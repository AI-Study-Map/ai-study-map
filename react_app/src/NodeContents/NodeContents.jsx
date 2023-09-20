import React, { useState } from 'react';
import { styled } from 'styled-components';
import useStore from '../node/store';


const API_HOST = 'http://localhost:8000/api/gpt_calling/';

function NodeContents() {
    const [inputLog, setInputLog] = useState([]);
    const [responseLog, setResponse] = useState([]);
    const [userInput, setUserInput] = useState('');
    
    const handleUserInputChange = (e) => {
        setUserInput(e.target.value);
    };

    const{ questionMenuIsOpen, setQuestionMenu, nodeTitle, nodeContent, setQuestionDetail } = useStore(
        state => ({
          questionMenuIsOpen: state.questionMenuIsOpen,
          setQuestionMenu: state.setQuestionMenu,
          nodeTitle: state.nodeTitle,
          nodeContent: state.nodeContent,
          setQuestionDetail: state.setQuestionDetail,
        })
      );

    const handleSend = () => {
        // ユーザーの入力を取得してログに追加、入力欄をクリア
        const userInputValue = userInput;
        setInputLog([...inputLog, `${userInputValue}`]);
        setUserInput(''); // 入力欄をクリア

        console.log(JSON.stringify({ user_input: userInput }));

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
        const chatReply = data.body;
        console.log(chatReply);
        // ChatGPTからの応答をログに追加
        setResponse([...responseLog, `${chatReply}`]);
      });
    };

    const handleAddExplain = () => {
        //inputlogの最後の要素を取得し、文章を追加
        const lastInput = inputLog[inputLog.length - 1];
        const lastResponse = responseLog[responseLog.length - 1];

        
        
        const input = 'Userとのやり取りにおいて、あなたは説明を追加することを求められました\n'
         + 'Userとの会話のログをもとに、自然につながるように説明文を追加してください\n'
         + 'その際、もとの会話文やbotの返答を繰り返す必要はなく、あくまで、続きを出力してください。\n'
         + 'User:' + lastInput + '\n'
         + 'Bot:' + lastResponse + '\n';
        
        console.log("lastInput: ", input);
        
        fetch(`${API_HOST}`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ user_input: input }),
          })
        .then((response) => response.json())
        .then((data) => {
        const chatReply = data.body;
        console.log(chatReply);
        // responselogの最後の要素を取得、ChatGPTからの応答を繋げる
        responseLog.pop();
        setResponse([...responseLog, `${lastResponse}${chatReply}`]);
      });
    }


    const handleResend = () => {
        //inputlogの最後の要素を取得
        const lastInput = inputLog[inputLog.length - 1];
        console.log("lastInput: ", lastInput);
        
        fetch(`${API_HOST}`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ user_input: lastInput }),
          })
        .then((response) => response.json())
        .then((data) => {
        const chatReply = data.body;
        console.log(chatReply);
        // responselogの最後の要素を削除、ChatGPTからの応答を追加
        responseLog.pop();
        setResponse([...responseLog, `${chatReply}`]);
      });
    };

    const handleAddQuestion = () => {
        //setQuestionTitle と setQuestionContentsにinputListの末尾とresponseListの末尾を渡す
        const lastInput = inputLog[inputLog.length - 1];
        const lastResponse = responseLog[responseLog.length - 1];
        setQuestionDetail(lastInput, lastResponse);
        setQuestionMenu(true);
    }


    // 入力ログと応答ログの要素をリストにマッピング
    const inputList = inputLog.map((input) => <li key={input}>{input}</li>)
    const responseList = responseLog.map((response) => <li key={response}>{response}</li>)

    return (
        <div className='NodeContents'>
            <div id='input'>
                <input type='text' id='user_input' value={userInput} onChange={handleUserInputChange} />

                <button id='send' onClick={handleSend}>送信</button>
            </div>
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
            <div id='buttons'>
                <button id='addQuestion' onClick={handleAddQuestion}>問題に挑戦！</button>
                <button id='addExplain' onClick={handleAddExplain}>説明文を追加</button>
                <button id='regenerate'onClick={handleResend}>再生成</button>
            </div>
        </div>

    );
};

export default NodeContents;