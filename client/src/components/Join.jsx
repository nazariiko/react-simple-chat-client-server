import React from 'react';
import axios from 'axios';

import { ENDPOINT } from '../api'

const Join = ({ handleLogin }) => {
  const [roomID, setRoomID] = React.useState('');
  const [userName, setUserName] = React.useState('');
  const [isLoading, setIsLoading] = React.useState(false);

  const onChangeRoomID = (e) => {
    setRoomID(e.target.value)
  }

  const onChangeUserName = (e) => {
    setUserName(e.target.value)
  }

  const connect = async () => {
    if (!roomID || !userName) {
      alert('Please enter room ID and userName')
      return
    }

    const obj = {
      roomID,
      userName,
    }

    setIsLoading(true)
    await axios.post(`${ENDPOINT}/rooms`, {
      roomID,
      userName,
    })
    handleLogin(obj)
  }

  return (
    <div className="join-block">
      <input onChange={onChangeRoomID} type="text" placeholder="Room ID" value={roomID} />
      <input onChange={onChangeUserName} type="text" placeholder="Your name" value={userName} />
      <button onClick={connect} className="btn btn-success">{isLoading ? 'Logining...' : 'Login'}</button>
    </div>
  )
}

export default Join
