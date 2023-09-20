import React, { useEffect, useState } from 'react';
import styled, { keyframes } from 'styled-components';
import useStore from './store';
import useAddNode from './useAddNode';

const API_HOST_QUESTION = 'http://localhost:8000/api/gpt_calling/question';

const MenuWrapper = styled.div`
  position: fixed;
  top: 0;
  left: ${({ isOpen }) => (isOpen ? '0' : '-450px')};
  width: 450px;
  height: 100%;
  background-color: #fff;
  box-shadow: 0px 0px 5px 0px rgba(0, 0, 0, 0.5);
  transition: left 0.3s ease-in-out;
  z-index: 100;
`;

const CloseButton = styled.button`
  position: absolute;
  top: 10px;
  right: 10px;
  font-size: 20px;
  background: none;
  border: none;
  cursor: pointer;
`;

const fadeIn = keyframes`
  0% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
`;

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  backdrop-filter: blur(5px);
  display: flex;
  justify-content: center;
  align-items: center;
  animation: ${fadeIn} 0.3s ease-in-out;
`;

const RedCircle = styled.div`
  width: 200px;
  height: 200px;
  background-color: red;
  border-radius: 50%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 24px;
  font-weight: bold;
`;

const ClearText = styled.p`
  color: red;
  font-size: 24px;
  margin-top: 20px;
`;

const ErrorMessage = styled.p`
  color: red;
  font-size: 16px;
`;

function QuestionMenu() {
  const newAddNode = useAddNode();
  const [showEffect, setShowEffect] = useState(false);
  const [question, setQuestion] = useState('');
  const [answerA, setAnswerA] = useState('');
  const [answerB, setAnswerB] = useState('');
  const [answerC, setAnswerC] = useState('');
  const [answerD, setAnswerD] = useState('');
  const [correctAnswer, setCorrectAnswer] = useState('');
  const [error, setError] = useState('');
  const{ questionMenuIsOpen, setQuestionMenu, nodeTitle, nodeContent, setQuestionDetail } = useStore(
    state => ({
      questionMenuIsOpen: state.questionMenuIsOpen,
      setQuestionMenu: state.setQuestionMenu,
      nodeTitle: state.nodeTitle,
      nodeContent: state.nodeContent,
      setQuestionDetail: state.setQuestionDetail,
    })
  );
  
  // ユーザの回答が正解か判断し、エフェクトを表示
  const handleCheckAnswer = (user_answer) => {
    if (user_answer === correctAnswer) {
      setShowEffect(true);
      setError('');
    } else {
      setError('不正解です。もう一度選択してください。');
    }
  };
  
  // CLEARエフェクトを非表示、問題メニューを非表示、ノードを追加
  const handleHideEffect = () => {
    setShowEffect(false);
    setQuestionMenu(false);  
    newAddNode();  
  };

  function questionSetting(question, a, b, c, d, correctaAnswer) {
    setQuestion(question);
    setAnswerA(a);
    setAnswerB(b);
    setAnswerC(c);
    setAnswerD(d);
    setCorrectAnswer(correctaAnswer);
  }
  
  // nodeContentが変更されたときに実行される処理
  useEffect(() => {
    // 初期状態ではnodeContentが空なので、何もしない
    if (nodeContent === "") {
      console.log("nodeContent is empty")
    } else {
      // nodeContentが空でない場合、APIリクエスト
      try {
        const parsedContent = JSON.parse(nodeContent);
        const description = parsedContent.description;
        
          //API
        fetch(`${API_HOST_QUESTION}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({"title": nodeTitle, "description": description}),
        })
        .then((response) => response.json())
        .then((data) => {
        const qData = JSON.parse(data.body);

        //responseを各欄に反映
        questionSetting(
          qData.question, qData.choices.a, 
          qData.choices.b, qData.choices.c, 
          qData.choices.d, qData.answer
        )
      });

      } catch (error) {
        console.error('QuestionMakeError:', error);
      }
    }
  }, [nodeContent]);

  return (
    <>
      <MenuWrapper isOpen={questionMenuIsOpen}>
        <CloseButton onClick={() => setQuestionMenu(false)}>x</CloseButton>
        <div id='clearEffect'>
          <p>{nodeTitle}</p>
          <p>{question}</p>
          {error && <ErrorMessage>{error}</ErrorMessage>}
          <p>正しい選択肢を選んでください</p>
          <button onClick={() => handleCheckAnswer("a")}>A: {answerA}</button>
          <button onClick={() => handleCheckAnswer("b")}>B: {answerB}</button> <br></br>
          <button onClick={() => handleCheckAnswer("c")}>C: {answerC}</button>
          <button onClick={() => handleCheckAnswer("d")}>D: {answerD}</button>
          {showEffect && (
            <Overlay>
              <RedCircle>
                <button onClick={handleHideEffect}>次のノードへ</button>
              </RedCircle><br></br>
              <ClearText>CLEAR!!</ClearText>
            </Overlay>
          )}
        </div>
      </MenuWrapper>
    </>
  );
}

export default QuestionMenu;
