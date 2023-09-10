import React, { useState } from 'react';

const API_HOST = 'http://localhost:8000/api/gpt_calling/';

function NodeContents() {
    const [inputLog, setInputLog] = useState([]);
    const [responseLog, setResponse] = useState([]);
    
    const handleSend = () => {
        // ユーザーの入力を取得してログに追加、入力欄をクリア
        const userInput = document.getElementById('user_input').value
        setInputLog([...inputLog, `User: ${userInput}`]);
        document.getElementById('user_input').value = '';

        console.log(JSON.stringify({ user_input: userInput }))

        // ユーザーの入力をサーバーに送信してChatGPTからの応答を取得
        fetch(`${API_HOST}`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ user_input: userInput }),
          })
        .then((response) => response.json())
        .then((data) => {
        const chatReply = data.body.choices[0].message.content;
        console.log(chatReply);
        // ChatGPTからの応答をログに追加
        setResponse([...responseLog, `ChatGPT: ${chatReply}`]);
      });

    };

    // 入力ログと応答ログの要素をリストにマッピング
    const inputList = inputLog.map((input) => <li key={input}>{input}</li>)
    const responseList = responseLog.map((response) => <li key={response}>{response}</li>)

    return (
        <div className='NodeContents'>
            <h1>NodeContents</h1>
            <div id='input_log'>
                <p>inputlog</p>
                <ul>
                    {inputList}
                </ul>
            </div>
            <div id='response_log'>
                <p>responselog</p>
                <ul>
                    {responseList}        
                </ul>
            </div>
            <div id='input'>
                <p>input</p>
                <input type='text' id='user_input'/>
                <button id='send' onClick={handleSend}>送信</button>
            </div>
        </div>

    );
};

export default NodeContents;