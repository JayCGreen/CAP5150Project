import logo from './logo.svg';
import './App.css';
import React, {useState} from 'react';
import Transfer from './transfer';
import {Button, Content, darkTheme, Flex, Provider, TextField} from '@adobe/react-spectrum'


async function loginUser(credentials) {
  return fetch('http://localhost:8080/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(credentials)
  })
    .then(data => data.json())
 }

function Login({setToken}) {
  const [loginInfo, setLoginInfo] = useState({ username:'', password:''})

  const handleSubmit = async e => {
    e?.preventDefault();
    const token = await loginUser({
      loginInfo
    });
    setToken(token);
  }

  return (
    <Provider theme={darkTheme}>
    <div className="App">
      <header className="App-header">
        <header>Generic Company</header>
        <h5><u>Sign in</u></h5>
        <hl/>
        <Content >
          <Flex alignItems={'center'} direction={'column'} gap={'size-250'}>
              <TextField label='Username' onChange={(text)=>setLoginInfo({...loginInfo, username: text})}></TextField>
              <TextField label='Password' type={'password'} onChange={(text)=>setLoginInfo({...loginInfo, password: text})}></TextField>
              <Button type='submit' onPress={()=>{
                console.log('pressed')
                console.log(loginInfo)
                handleSubmit()
              }}>Login
              </Button>
            
          </Flex>
        </Content>
      </header>
    </div></Provider>
  );
}

export default Login;
