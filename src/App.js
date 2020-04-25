 import React, {useState} from 'react';
import logo from './logo.svg';
import './App.css';

const controlButton = {
  border: 0, borderRadius: '5px', width: '40%', height: '50vh', cursor: 'pointer', color: 'white', fontSize: '60px', fontWeight: 'bold'
}

const ws = new WebSocket(process.env.REACT_APP_WEBSOCKET_SERVER);

function App() {
  const [lightStatus, setLightStatus] = useState(false);
  const [servoStatus, setServoStatus] = useState(false);
  const [serverStatus, setServerStatus] = useState(false);
  const [message, setMessage] = useState("No new message");
  
  ws.onopen = ()=>{
    setServerStatus(true);
  }

  ws.onclose = ()=>{
    setServerStatus(false);
  }
  
  ws.onerror = ()=>{
    setServerStatus(false);
  }

  ws.onmessage = (e)=>{
    console.log(e);
    setMessage(e.data);
  }

  const send = (data)=>{
    ws.send(JSON.stringify(data));
  }

  return (
    <div className='App'>
      <header className='App-header'>
        <div style={{padding:'100px'}}>
        <span style={{color:'blueviolet'}}>Server Status: <span style={{color: serverStatus ? 'green' : 'red'}}>{serverStatus ? 'CONNECTED' : 'DISCONNECTED'}</span></span>
        <br/>
        <span style={{color:'green'}}>Message:</span> {message}
        </div>
        <div style={{width: '100%', display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around'}}>
          <button
          style= {{backgroundColor:lightStatus ? 'red' : 'green', ...controlButton}}
          onClick={()=>{
            setLightStatus(!lightStatus)
            send({action: lightStatus ? 'off-led' : 'on-led'})
          }}
          >
            {lightStatus ? 'Off' : 'On'} Light
          </button>
          <button
          style= {{backgroundColor:servoStatus ? 'red' : 'green', ...controlButton}}
          onClick={()=>{
            setServoStatus(!servoStatus)
            send({action: 'turn-servo'})
          }}
          >
            {servoStatus ? 'Off' : 'On'} Servo Motor
          </button>
        </div>
      </header>
    </div>
  );
}

export default App;
