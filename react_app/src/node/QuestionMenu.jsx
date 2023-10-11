import React, { useEffect, useState } from 'react';
import styled, { keyframes } from 'styled-components';
import useStore from './store';
import useAddNode from './useAddNode';

const API_HOST_QUESTION = 'http://localhost:8000/api/gpt_calling/question';

const MenuWrapper = styled.div`
  position: fixed;
  top: 0;
  left: ${({ open }) => (open ? '0' : '-450px')};
  width: 450px;
  height: 100%;
  background-color: #FAFFF7; 
  box-shadow: 0px 0px 5px 0px rgba(0, 0, 0, 0.5);
  transition: left 0.3s ease-in-out;
  z-index: 100;
`;

const StyledQuestionHeader = styled.div`
  display: flex;
  width: 450px;
  align-items: center;
  background-color:#FFE867;
  height: 60px;
    p {
      font-size: 25px;
      font-weight: bold;
      margin-left: 20px;
      margin-top: 27px;
    }
`;

const StyledQuestionContent = styled.div`
  height: 366px;
  overflow-wrap: break-word; /* 単語の途中で改行させる */
  overflow-x: auto; /* コンテンツがはみ出す場合にスクロールバーを表示 */
  padding: 10px;
`;

const StyledQuestionButtons = styled.div`
  height: 250px;
  overflow-y: auto; /* ボタンがはみ出す場合にスクロールバーを表示 */
  padding: 10px;
  background-color:#FFE867;
  overflow-y: auto;
  white-space: nowrap;
  
  #buttonMessage{
    font-size: 18px;
    font-weight: bold;
    margin-top: 7px;
    margin-bottom: 15px;
  }
`;

const CloseButton = styled.button`
  position: absolute;
  top: 19px;
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
  position: absolute; 
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  backdrop-filter: blur(5px);
  display: flex;
  justify-content: center;
  align-items: center;
  animation: ${fadeIn} 0.3s ease-in-out;
  filter: grayscale(80%);/*モノクロに変更*/
`;

const RedCircle = styled.div`
  width: 150px;
  height: 150px;
  border: 20px solid #FF7A53; 
  border-radius: 50%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: #FF7A53;
  font-size: 24px;
  font-weight: bold;
  position: absolute;
  top: 40%; /* 上下中央に配置 */
  left: 50%; /* 左右中央に配置 */
  transform: translate(-50%, -50%); /* 中央揃え */
  animation: ${fadeIn} 0.3s ease-in-out;
`;

const ClearText = styled.p`
  color: #FF7A53;
  font-size: 40px;
  position: absolute;
  top: 60%; /* 上下中央より下側に配置 */
  left: 50%; /* 左右中央に配置 */
  transform: translateX(-50%); /* 中央揃え */
  animation: ${fadeIn} 0.3s ease-in-out;
`;

const NextButton = styled.button`
  background-color: #2BA287;
  color: white;
  font-size: 20px;
  border: none;
  padding: 10px 20px;
  border-radius: 5px;
  cursor: pointer;
  margin-top: 20px;
  position: absolute;
  top: 80%; /* 上下中央より下側に配置 */
  left: 50%; /* 左右中央に配置 */
  transform: translateX(-50%); /* 中央揃え */
  animation: ${fadeIn} 0.3s ease-in-out;
`;

const ErrorMessage = styled.p`
  color: red;
  font-size: 15px;
  margin-top: 5px;
  height: 20px;
`;

const ButtonAAndC = styled.button`
  background-color: #7BC74D;
  color: white;
  border: none;
  border-radius: 5px;
  padding: 10px 20px;
  font-size: 16px;
  cursor: pointer;
  margin-bottom: 10px;
  margin-right: 20px;
  position: relative;
  width: 200px;
  white-space: normal;
  &:hover {
    background-color: #5E9E3E;
  }
`;

const ButtonBAndD = styled.button`
  background-color: #7BC74D; /* ボタンの背景色 */
  color: white; /* ボタンのテキスト色 */
  border: none;
  border-radius: 5px; /* 角の取れたデザイン */
  padding: 10px 20px;
  font-size: 16px;
  cursor: pointer;
  margin-bottom: 10px;
  width: 200px;
  white-space: normal;

  &:hover {
    background-color: #5E9E3E; /* ホバー時の背景色 */
  }
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
  const { questionMenuIsOpen, setQuestionMenu, nodeTitle, nodeContent, nodeExample, setQuestionDetail, test } = useStore(
    state => ({
      questionMenuIsOpen: state.questionMenuIsOpen,
      setQuestionMenu: state.setQuestionMenu,
      nodeTitle: state.nodeTitle,
      nodeContent: state.nodeContent,
      nodeExample: state.nodeExample,
      setQuestionDetail: state.setQuestionDetail,
      test: state.test,
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

const findChildrenByName = (node, name) => {
    if (node.name === name) {
      return node.children.map(child => child.name);
    }
    for (let child of node.children) {
      const result = findChildrenByName(child, name);
      if (result) {
        return result;
      }
    }
    return null;
  }

  // CLEARエフェクトを非表示、問題メニューを非表示、ノードを追加
  const handleHideEffect = () => {
    setShowEffect(false);
    setQuestionMenu(false);
    const childrenNames = findChildrenByName(test, nodeTitle);
    if (childrenNames === null) {
      console.log("子ノードがありません")
      return 
    } else {
      newAddNode(childrenNames[0], childrenNames[1]);
    }
  };

  function questionSetting(question, a, b, c, d, correctaAnswer) {
    setQuestion(question);
    setAnswerA(a);
    setAnswerB(b);
    setAnswerC(c);
    setAnswerD(d);
    setCorrectAnswer(correctaAnswer);
  }

  const testPhrase = '###########################################################################################################################################################################################################################################################################################################################################################################################################################################################################################################################################################################################################################################################################################################################################################################################################################';

  // nodeContentが変更されたときに実行される
  // APIを通して問題を作成し、各欄に反映（先に作っておくことで遅延を軽減）
  useEffect(() => {
    // 初期状態ではnodeContentが空なので、何もしない
    if (nodeContent === "") {
      console.log("nodeContent is empty")
    } else {
      // nodeContentが空でない場合、APIリクエスト
      try {
        const description = nodeContent;
        const example = nodeExample;
        console.log("description: ", description, "example: ", example);
        //API
        fetch(`${API_HOST_QUESTION}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({"title": nodeTitle, "description": description, "example": example}),
        })
          .then((response) => response.json())
          .then((data) => {
            const qData = JSON.parse(data);
            console.log("qData", qData);
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
      <MenuWrapper open={questionMenuIsOpen}>
        <CloseButton onClick={() => setQuestionMenu(false)}>
          <svg width="20" height="20" viewBox="0 0 38 38" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path id="Union" fillRule="evenodd" clipRule="evenodd" d="M31.1223 1.17157C32.6844 -0.390524 35.217 -0.390524 36.7791 1.17157C38.3412 2.73367 38.3412 5.26633 36.7791 6.82843L24.6322 18.9753L36.7791 31.1223C38.3412 32.6844 38.3412 35.217 36.7791 36.7791C35.217 38.3412 32.6844 38.3412 31.1223 36.7791L18.9754 24.6322L6.82842 36.7791C5.26632 38.3412 2.73366 38.3412 1.17156 36.7791C-0.390536 35.217 -0.390537 32.6844 1.17156 31.1223L13.3185 18.9753L1.17158 6.82843C-0.390521 5.26633 -0.390521 2.73367 1.17158 1.17157C2.73367 -0.390524 5.26633 -0.390524 6.82843 1.17157L18.9754 13.3185L31.1223 1.17157Z" fill="#7BC74D"/>
          </svg>
        </CloseButton>
        <div id='clearEffect'>
          <StyledQuestionHeader>
            <p>{nodeTitle}</p>
          </StyledQuestionHeader>
          <StyledQuestionContent>
            <p>{question}</p>
          </StyledQuestionContent>
          <StyledQuestionButtons>
            <p id='buttonMessage'>正しい選択肢を選んでください</p>
            <ErrorMessage>{error}</ErrorMessage>
            <ButtonAAndC onClick={() => handleCheckAnswer("a")}>A: {answerA}</ButtonAAndC>
            <ButtonBAndD onClick={() => handleCheckAnswer("b")}>B: {answerB}</ButtonBAndD> <br></br>
            <ButtonAAndC onClick={() => handleCheckAnswer("c")}>C: {answerC}</ButtonAAndC>
            <ButtonBAndD onClick={() => handleCheckAnswer("d")}>D: {answerD}</ButtonBAndD>
            
          </StyledQuestionButtons>
          {showEffect && (
            <>
              <Overlay />
              <RedCircle />
              <ClearText>CLEAR!!</ClearText>
              <NextButton onClick={handleHideEffect} className="next-button">次のノードへ</NextButton>
            </>
          )}
        </div>
      </MenuWrapper>
    </>
  );
}

export default QuestionMenu;
