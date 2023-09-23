import React, { useEffect, useState } from 'react';
import { styled } from 'styled-components';
import useStore from '../node/store';


const API_HOST = 'http://localhost:8000/api/gpt_calling/';

function NodeContents() {
    const [inputLog, setInputLog] = useState([]);
    const [responseLog, setResponse] = useState([]);
    const [userInput, setUserInput] = useState('');
    const [inputed, setInput] = useState(''); 
    const [description, setDescription] = useState('');
    const [example, setExample] = useState('');
    
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
        setInput(userInput);
        setUserInput(''); // 入力欄をクリア
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
        // ChatGPTからの応答をパースして、説明文と例文を取得、set
        const parsedContent = JSON.parse(data.body);
            setDescription(parsedContent.description);
            setExample(parsedContent.example);
        });
    };

    const handleAddExplain = () => {
        //inputlogの最後の要素を取得し、文章を追加
        const lastInput = inputed;
        const lastResponse = description;
        
        const gptInput = 'Userとのやり取りにおいて、あなたは説明を追加することを求められました\n'
         + 'Userとの会話のログをもとに、自然につながるように説明文を追加してください。\n'
         + 'その際、もとの会話文やbotの返答を繰り返す必要はなく、あくまで、続きを出力してください。\n'
         + 'また、これまでのやり取りと内容が被らないようにしてください。\n'
         + 'User:' + lastInput + '\n'
         + 'Bot:' + lastResponse + '\n';
        
        console.log("lastInput: ", gptInput);
        
        fetch(`${API_HOST}`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ user_input: gptInput }),
          })
        .then((response) => response.json())
        .then((data) => {
        const chatReply = JSON.parse(data.body);
        console.log(chatReply);
        // responselogの最後の要素を取得、ChatGPTからの応答を繋げる
        setDescription(description + chatReply.description);
      });
    }
    

    const handleResend = () => {
        //inputlogの最後の要素を取得
        const lastInput = inputed;
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
        const chatReply = JSON.parse(data.body);
        console.log(chatReply);
        // responselogの要素を変更
        setDescription(chatReply.description);
      });
    };

    const handleAddQuestion = () => {
        //setQuestionTitle と setQuestionContentsにinputListの末尾とresponseListの末尾を渡す
        const lastInput = inputed;
        const lastResponse = description;
        console.log("lastInput: ", lastInput, "lastResponse: ", lastResponse);
        setQuestionDetail(lastInput, lastResponse);
        setQuestionMenu(true);
        
    }

    return (
        <div className='NodeContents'>
            <div id='input'>
                <input type='text' id='user_input' value={userInput} onChange={handleUserInputChange} />

                <button id='send' onClick={handleSend}>送信</button>
            </div>
            <div id='input_log'>
                <p>inputlog</p>
                <ul>
                    {inputed}
                </ul>
            </div>
            <div id='response_log'>
                <p>responselog</p>
                <p>{description}</p>
                <p>{example}</p>       
                
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