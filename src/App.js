import logo from './logo.svg';
import './App.css';
import React, {useState} from 'react';
import {Button, Content, darkTheme, Flex, Provider, TextField} from '@adobe/react-spectrum'


function App() {
  const [loginInfo, setLoginInfo] = useState({ username:'', password:''})

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
              }}>Login
              </Button>
            
          </Flex>
        </Content>
      </header>
    </div></Provider>
  );
}

export default App;
