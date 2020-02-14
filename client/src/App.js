import React, {useState, useEffect} from 'react';
import './App.css';
import axios from 'axios'

function App() {

  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  const handleChange = (event) => {
    const {name, value} = event.target
    name==='username' && setUsername(value)
    name==='password' && setPassword(value)
  }

  const tryLogin = (event) => {
    event.preventDefault()
    const info = event.target
    const user = {
      username: info[0].value,
      password: info[1].value
    }
    axios.post('http://localhost:5000/api/login', user)
      .then(res => {
        console.log(res)
      })
      .catch(err=> console.log(err))
  }

  return (
    <div className="App">
      <h1>Login</h1>
      <form onSubmit={tryLogin}>
        <input 
          type='text'
          placeholder='username'
          name='username'
          value= {username}
          onChange = {handleChange}
        />
        <input 
          type='text'
          placeholder='password'
          name='password'
          value= {password}
          onChange = {handleChange}
        />
        <button>Log in</button>
      </form>
    </div>
  );
}

export default App;
