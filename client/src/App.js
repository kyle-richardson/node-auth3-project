import React, {useState, useEffect} from 'react';
import './App.css';
import axios from 'axios'

function App() {

  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [token, setToken] = useState('')
  const [userList, setUserList] = useState([])

  const handleChange = (event) => {
    const {name, value} = event.target
    name==='username' && setUsername(value)
    name==='password' && setPassword(value)
  }

  const tryLogin = async (event) => {
    event.preventDefault()
    const info = event.target
    const user = {
      username: info[0].value,
      password: info[1].value
    }
    try{
      const tok = await axios.post('http://localhost:5000/api/login', user).then(res=>res.data.token)
      setToken(tok)
      setUserList(await axios({
          method: 'get',
          url: 'http://localhost:5000/api/users',
          headers: {Authorization: tok}
      }).then(res=> res.data))
    }
    catch(err) {
      console.log(err)
    }
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
      {!!userList && userList.map(user=> {
        return (
          <div key = {user.id} style={{padding: '10px', border: '2px solid blue', marginBottom: '10px'}}>
            <p>id: {user.id}</p>
            <p>username: {user.username}</p>
            <p>department: {user.department}</p>
          </div>
        )
      })}
    </div>
  );
}

export default App;
