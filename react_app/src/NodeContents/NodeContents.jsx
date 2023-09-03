import React, { useState } from 'react';
import axios from 'axios';

function ChatLog({ messages }) {
  return (
    <div id="chat-log">
      {messages.map((message, index) => (
        <p key={index}>{message}</p>
      ))}
    </div>
  );
}

function Response({ response }) {
  return (
    <div id="response">
      {response && <p>ChatGPT: {response}</p>}
    </div>
  );
}

function NodeContents() {
  const [userInput, setUserInput] = useState('');
  const [chatLog, setChatLog] = useState([]);
  const [chatReply, setChatReply] = useState('');

  const handleSend = async () => {
    if (userInput.trim() === '') return console.log('No input');

    const newChatLog = [...chatLog, `User: ${userInput}`];
    setChatLog(newChatLog);
    setUserInput('');

    console.log("userInput", userInput);

    try {
      const response = await axios.post('', { user_input: userInput });
      console.log("response", response);
      const newChatReply = response.data.chat_reply;
      setChatReply(newChatReply);
    } catch (error) {
      console.error(error);
    }
  };

  const handleResend = async () => {
    if (userInput.trim() === '') return;

    const newChatLog = [...chatLog, `User: ${userInput}`];
    setChatLog(newChatLog);
    setUserInput('');

    try {
      const response = await axios.post('', { user_input: userInput });
      const newChatReply = response.data.chat_reply;
      setChatReply(newChatReply);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
      <h1>Chat with ChatGPT</h1>
      <div id="chat-container">
        <ChatLog messages={chatLog} />
        <Response response={chatReply} />
        <input
          type="text"
          id="user-input"
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
        />
        <button id="send-button" onClick={handleSend}>Send</button>
        <button id="resend" onClick={handleResend}>再生成</button>
      </div>
    </div>
  );
}

export default NodeContents;

  