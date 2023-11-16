import React, { useState } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './App.css';
import Transfer from './transfer';
import Login from './Login';

function App() {
  const [token, setToken] = useState();

  if(!token) {
    return <Login setToken={setToken} />
  }

  console.log(token);

  return (
    <div className="wrapper">
      <Transfer />
    </div>
  );
}

export default App;