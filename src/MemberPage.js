import logo from './logo.svg';
import './App.css';
import Upload from './uploads';
import React, {useState} from 'react';
import {Button, Content, darkTheme, Flex, Provider, TextField} from '@adobe/react-spectrum'


function MemApp() {
  const [loginInfo, setLoginInfo] = useState({ username:'', password:''})

  return (
    <Provider theme={darkTheme}>
      <div className='App'>
        <Upload />
      </div>
    </Provider>
  );
}

export default MemApp;
