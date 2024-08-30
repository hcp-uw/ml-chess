from flask import Flask, request, jsonify
import chess
import torch
from models import ChessNet
from flask_cors import CORS
import numpy as np
import re

app = Flask(__name__)

# CORS setup
CORS(app) 

# Initialize the chess board
board = chess.Board()

# Load the model
device = torch.device("cpu")  # Use CPU only
model = ChessNet().to(device)
model.load_state_dict(torch.load('./cnn.pth', map_location=device))  # Ensure loading on the CPU
model.eval()

letter_to_num = {'a': 0, 'b': 1,'c': 2,'d': 3,'e': 4,'f': 5,'g': 6,'h': 7}
num_to_letter = {0:'a', 1:'b', 2:'c', 3:'d', 4:'e', 5:'f', 6:'g', 7:'h'}

def board_to_rep(board):
    pieces = ['p', 'r', 'n', 'b', 'q', 'k']
    layers = []
    for piece in pieces:
        layers.append(create_rep_layer(board, piece))
    board_rep = np.stack(layers)
    return board_rep

def create_rep_layer(board, piece_type):
    s = str(board)
    s = re.sub(f'[^{piece_type}{piece_type.upper()} \n]', '.', s)
    s = re.sub(f'{piece_type}', '-1', s)
    s = re.sub(f'{piece_type.upper()}', '1', s)
    s = re.sub(f'\.', '0', s)

    board_mat = []
    for row in s.split('\n'):
        row = row.split(' ')
        row = [int(x) for x in row]
        board_mat.append(row)

    return np.array(board_mat)

def distribution_over_moves(vals, penalty_factor=6):
    # Convert the list of move values to a numpy array
    probs = np.array(vals)
    # Apply an exponential function to emphasize higher values
    probs = np.exp(probs)
    # Apply a penalty to lower-valued moves
    # Moves with lower values are penalized, reducing their probability
    probs = probs ** penalty_factor
    # Normalize the probabilities so they sum to 1
    probs = probs / probs.sum()
    return probs

def check_mate_single(board):
    board = board.copy()
    legal_moves = list(board.legal_moves)
    for move in legal_moves:
        board.push(move)
        if board.is_checkmate():
            board.pop()
            return move
        board.pop()

def choose_move(board, color_str):
    legal_moves = list(board.legal_moves)

    move = check_mate_single(board)
    if move is not None:
        return move

    x = torch.tensor(board_to_rep(board)).float()
    if color_str == 'black':
        x *= -1
    x = x.unsqueeze(0)

    model.eval()  # Set the model to evaluation mode
    with torch.no_grad():  # Disable gradient calculation for inference
        move = model(x)  # Call the forward method implicitly

    vals = []
    froms = [str(legal_move)[:2] for legal_move in legal_moves]
    froms = list(set(froms))
    for f in froms:
        val = move[0, 0, 8 - int(f[1]), letter_to_num[f[0]]].item()
        vals.append(val)

    probs = distribution_over_moves(vals)

    chosen_from = np.random.choice(froms, size=1, p=probs)[0]

    vals = []
    for legal_move in legal_moves:
        f = str(legal_move)[:2]
        if f == chosen_from:
            to = str(legal_move)[2:]
            val = move[0, 1, 8 - int(to[1]), letter_to_num[to[0]]].item()
            vals.append(val)
        else:
            vals.append(0)

    return legal_moves[np.argmax(vals)]
    

@app.route('/predict', methods=['POST'])
def predict():
    data = request.json
    fen = data.get('board')
    board = chess.Board(fen)
    color_str = data.get('color')

    # Convert model output to move
    move = choose_move(board, color_str)

    # Convert the move to UCI format
    move_uci = move.uci()

    return jsonify({'move': move_uci})

@app.route('/makemove', methods=['POST'])
def make_move_route():
    move = request.json.get('move')
    try:
        move = chess.Move.from_uci(move)
        board.push(move)
        return jsonify({'status': 'success'}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 400

@app.route('/reset', methods=['POST'])
def reset():
    board.reset()
    return jsonify({'status': 'success'}), 200

@app.route('/board', methods=['GET'])
def get_board():
    return jsonify({'board': board.fen()})

if __name__ == "__main__":
    app.run(host='0.0.0.0', port=8000, debug=True)
