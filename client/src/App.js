import React from 'react';
import axios from 'axios';
import socket from './socket';

import { Join, Chat } from './components';
import login from './reducer';

import { ENDPOINT } from './api'


const App = () => {
  const [state, dispatch] = React.useReducer(login, {
    joined: false,
    roomID: null,
    userName: null,
    users: [],
    messages: [],
  })

  const handleLogin = async (obj) => {
    dispatch({
      type: 'JOIN',
      payload: obj,
    })
    socket.emit('ROOM:JOIN', obj)
    const { data } = await axios.get(`${ENDPOINT}/rooms/${obj.roomID}`)
    setUsers(data.users)
    setMessages(data.messages)
  }

  const setUsers = (users) => {
    dispatch({
      type: 'SET_USERS',
      payload: users,
    })
  }

  const setMessages = (messages) => {
    dispatch({
      type: 'SET_MESSAGES',
      payload: messages,
    })
  }

  const addMessage = (message) => {
    dispatch({
      type: 'ADD_MESSAGE',
      payload: message,
    })
  }

  React.useEffect(() => {
    socket.on('ROOM:JOINED', setUsers)
    socket.on('ROOM:LEAVE', setUsers)
    socket.on('ROOM:NEW_MESSAGE', addMessage)
  }, []);

  return (
    <div className="wrapper">
      {!state.joined ? <Join handleLogin={handleLogin} /> : <Chat handleSendMessage={addMessage} {...state} />}
    </div>
  )
}

export default App
