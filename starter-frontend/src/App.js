import './App.css' // import css file
import { useEffect, useState } from 'react' // import react hooks
import 'bootstrap/dist/css/bootstrap.css';

import { Chess } from 'chess.js'
// import a default export from a file
// import PeopleForm from './components/PeopleForm'
// import a named export from a file
import { ChessBoard } from './components/ChessBoard'
// import functions from services folder
// import { create, getAll } from './services/people'
import { NavigationBar } from './components/Navigation'

import { getBoard } from './services/chess'
import { Footer } from './components/Footer';


// App component
function App() {

  const chess = new Chess();

  return (
    <div className='center'>
      <NavigationBar />
      <br />
      <ChessBoard chess={chess}/>
      <Footer />
    </div>
  )
}

export default App
