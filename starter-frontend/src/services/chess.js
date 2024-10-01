import axios from 'axios' // Imports the axios library

// URL for the backend
const baseURL = 'http://localhost:8000'

///////////////////////////////////////////////////////////////////////
// Functions to make API calls
///////////////////////////////////////////////////////////////////////
// export async function create (name, age) {
//   // axios is a library for making HTTP requests.
//   // Here we use it to make a POST request to the backend
//   // The first argument is the URL, the second is the data to send
//   const { data } = await axios.post(`${baseURL}/people`, {
//     name,
//     age
//   })

//   return data
// }

export async function getBoard () {
  // Here we make a GET request to the backend
  // The result is an object with a data property, which
  // contains the response from the backend
  const { data } = await axios.get(`${baseURL}/board`);
  console.log(data)
  return data;
}
