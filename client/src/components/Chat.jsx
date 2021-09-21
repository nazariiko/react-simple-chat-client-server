import React from 'react';
import socket from '../socket';

const Chat = ({ roomID, userName, users, messages, handleSendMessage }) => {
  const [messageValue, setMessageValue] = React.useState('');
  const messagesRef = React.useRef()

  const onChangeMessageValue = (event) => {
    setMessageValue(event.target.value);
  };

  const onSendMessage = () => {
    socket.emit('ROOM:NEW_MESSAGE', {
      userName,
      roomID,
      text: messageValue,
    });
    handleSendMessage({ userName, text: messageValue });
    setMessageValue('')
  }

  React.useEffect(() => {
    messagesRef.current.scrollTo(0, 99999)
  }, [messages])

  return (
    <div className="chat">
      <div className="chat-users">
        Room: <b>{roomID}</b>
        <hr />
        <b>Online ({users.length}):</b>
        <ul>
          {users.map((name, index) => (
            <li key={name + index}>{name}</li>
          ))}
        </ul>
      </div>
      <div className="chat-messages">
        <div ref={messagesRef} className="messages">
          {messages.map((message, index) => (
            <div key={message.userName + index} className="message">
              <p>{message.text}</p>
              <div>
                <span>{message.userName}</span>
              </div>
            </div>
          ))}
        </div>
        <form>
          <textarea
            value={messageValue}
            onChange={onChangeMessageValue}
            className="form-control"
            rows="3"></textarea>
          <button onClick={onSendMessage} type="button" className="btn btn-primary">
            Send
          </button>
        </form>
      </div>
    </div>
  );
};

export default Chat;
