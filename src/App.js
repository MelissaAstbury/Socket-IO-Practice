import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
import TextField from '@material-ui/core/TextField';
import './App.css';

// this is the connection to the backend
const socket = io.connect('http://localhost:8080');

const App = () => {
  const [data, setData] = useState({ message: '', username: '' });
  const [chat, setChat] = useState([]);

  useEffect(() => {
    socket.on('message', ({ username, message }) => {
      setChat([...chat, { username, message }]);
    });
  });

  const handleChange = (e) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    // stop page refresh
    e.preventDefault();
    const { username, message } = data;
    socket.emit('message', { username, message });
    // setData({ message: '', username });
  };

  const renderChat = () => {
    return chat.map(({ username, message }, index) => (
      <div key={index}>
        <h3>
          {username}: <span>{message}</span>
        </h3>
      </div>
    ));
  };

  return (
    <div className="card">
      <form onSubmit={handleSubmit}>
        <h1>Messenger</h1>
        <div className="name-field">
          <TextField
            name="username"
            onChange={(e) => {
              handleChange(e);
            }}
            value={data.username}
            label="Username"
          />
        </div>
        <div>
          <TextField
            name="message"
            onChange={(e) => {
              handleChange(e);
            }}
            value={data.message}
            label="Message"
          />
        </div>
        <button>Send Message</button>
      </form>
      <div className="render-chat">
        <h1>Chat Log</h1>
        {renderChat()}
      </div>
    </div>
  );
};

export default App;
