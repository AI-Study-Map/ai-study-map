import React, { useEffect, useState } from 'react';
import styled, { keyframes } from 'styled-components';
import useStore from './store';
import useAddNode from './useAddNode';
import LoadingScreen from '../components/LoadingScreen';
import Clear_animation from '../images/clear-loop.gif';
import '../noto_sans_jp.css'

const themeColors = ["#FFE867", "#FFC8C8", "#FF8B67", "#478577"]
const subThemeColors = ["#7BC74D", "#66A83E", "#CD7160", "#70C79D"]
const hoverSubThemeColors = ["#5d953b", "#48782b", "#955246", "#559878"]
const fontColors = ["#7BC74D", "#66A83E", "#FAFFF7", "#FAFFF7"]

const LoadingScreenArea = styled.div`
  cursor: default;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
`

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
  background-color:${(props) => themeColors[props.themeColorId]};
  height: 8vh;
    p {
      color: ${(props) => fontColors[props.themeColorId]};
      font-size: 25px;
      font-weight: bold;
      margin-left: 20px;
      margin-top: 27px;
      width: 350px;
    }
`;

const StyledQuestionContent = styled.div`
  height: 60vh;
  overflow-wrap: break-word; /* 単語の途中で改行させる */
  overflow-x: auto; /* コンテンツがはみ出す場合にスクロールバーを表示 */
  padding: 10px;
  p {
      color: #213363;
      font-size: 18px;
      margin-left: 10px;
    }

`;

const StyledQuestionButtons = styled.div`
  height: 32vh;
  overflow-y: auto; /* ボタンがはみ出す場合にスクロールバーを表示 */
  padding: 10px;
  background-color:${(props) => themeColors[props.themeColorId]};
  overflow-y: auto;
  white-space: nowrap;
  
  #buttonMessage{
    font-size: 18px;
    font-weight: bold;
    margin: 7px 0px 15px 10px;
    color: ${(props) => fontColors[props.themeColorId]};

  }
`;

const CloseButton = styled.button`
  position: absolute;
  top: 18px;
  right: 15px;
  font-size: 20px;
  background: none;
  border: none;
  cursor: pointer;
`;

const ClosePath = styled.path`
  fill: ${(props) => fontColors[props.themeColorId]};
`

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
  img{
    width: 520px;
    height: auto;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    font-weight: bold;
    position: absolute;
    top: 37%; /* 上下中央に配置 */
    left: 42.2%; /* 左右中央に配置 */
    transform: translate(-50%, -50%); /* 中央揃え */
    animation: ${fadeIn} 0.3s ease-in-out;
  } 
`;

const ClearText = styled.p`
  color: #FF7A53;
  font-size: 60px;
  font-weight: bold;
  position: absolute;
  top: 55%; /* 上下中央より下側に配置 */
  left: 50%; /* 左右中央に配置 */
  transform: translateX(-50%); /* 中央揃え */
  animation: ${fadeIn} 0.3s ease-in-out;
`;

const NextButton = styled.svg`
  width: 45%;
  height: 2.5em;
  color: #FAFFF7;
  font-size: 25px;
  border: none;
  padding: 10px 20px;
  border-radius: 10px;
  cursor: pointer;
  margin-top: 20px;
  position: absolute;
  top: 75%;
  left: 50%;
  transform: translateX(-50%);
  path {
    animation: ${fadeIn} 0.3s ease-in-out;
    transition: 0.3s ease;
  }
  text {
    animation: ${fadeIn} 0.3s ease-in-out;
    fill: #FAFFF7;
    font-family: "Noto Sans Japanese"; 
    font-size: 60px;
    position: absolute;
    font-weight: 400;
    transform: translate(0, 5%);
  }
  &:hover {
    path {
      fill: #229379;
    }
  }
`;
const ErrorMessage = styled.p`
  color: #ff3636;
  font-size: 16px;
  margin-left: 10px;
  margin-top: 5px;
  height: 20px;
`;

const ButtonAAndC = styled.button`
  background-color: ${props => props.disabled ? '#ccc' : `${subThemeColors[props.themeColorId]}`};
  color: #FAFFF7;
  border: none;
  border-radius: 10px;
  padding: 10px 20px;
  font-size: 16px;
  cursor: ${props => props.disabled ? 'not-allowed' : 'pointer'};
  margin-bottom: 10px;
  margin-right: 20px;
  position: relative;
  width: 200px;
  white-space: normal;
  &:hover {
    background-color: ${props => props.disabled ? '#ccc' : `${hoverSubThemeColors[props.themeColorId]}`};
  }
`;

const ButtonBAndD = styled.button`
  background-color: ${props => props.disabled ? '#ccc' : `${subThemeColors[props.themeColorId]}`}; /* ボタンの背景色 */
  color: #FAFFF7; /* ボタンのテキスト色 */
  border: none;
  border-radius: 10px; /* 角の取れたデザイン */
  padding: 10px 20px;
  font-size: 16px;
  cursor: ${props => props.disabled ? 'not-allowed' : 'pointer'};
  margin-bottom: 10px;
  width: 200px;
  white-space: normal;

  &:hover {
    background-color: ${props => props.disabled ? '#ccc' : `${hoverSubThemeColors[props.themeColorId]}`}; /* ホバー時の背景色 */
  }
  transition: background-color 0.5s;
`;

const API_SAVE_ISCORRECT = "http://localhost:8000/api/save/is_cleared";

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
  const [isCorrect, setIsCorrect] = useState(false)
  const [disabledOptions, setDisabledOptions] = useState({
    a: false,
    b: false,
    c: false,
    d: false
  });
  const { nodes, questionMenuIsOpen, setQuestionMenu, nodeTitle, nodeContent, 
    nodeExample, setQuestionTitle, selectedNodeId, getQUestion, toggleNodeFlipped,
    question_phrase, question_a, question_b, question_c, question_d, correctAns, tree, updateNodeIsCorrect,
    isQuestionMenuLoading, mapId, setSuggestNode, setGauge, clearedNodes, allNodes, themeColorId,
  } = useStore(
    state => ({
      nodes: state.nodes,
      updateNodeIsCorrect: state.updateNodeIsCorrect,
      questionMenuIsOpen: state.questionMenuIsOpen,
      setQuestionMenu: state.setQuestionMenu,
      nodeTitle: state.nodeTitle,
      nodeContent: state.nodeContent,
      nodeExample: state.nodeExample,
      setQuestionTitle: state.setQuestionTitle,
      selectedNodeId: state.selectedNodeId,
      getQUestion: state.getQUestion,
      question_phrase: state.question_phrase,
      question_a: state.question_a,
      question_b: state.question_b,
      question_c: state.question_c,
      question_d: state.question_d,
      correctAns: state.correctAnswer,
      tree: state.tree,
      isQuestionMenuLoading: state.isQuestionMenuLoading,
      toggleNodeFlipped: state.toggleNodeFlipped,
      mapId: state.mapId,
      setSuggestNode: state.setSuggestNode,
      setGauge: state.setGauge,
      clearedNodes: state.clearedNodes,
      allNodes: state.allNodes,
      themeColorId: state.themeColorId,
    })
  );

  // ユーザの回答が正解か判断し、エフェクトを表示
  const handleCheckAnswer = (user_answer) => {
    if (user_answer === correctAnswer) {
      setShowEffect(true);
      setError('');
      setDisabledOptions({
        a: false,
        b: false,
        c: false,
        d: false
      });
      // DBのis_clearedをtrueにする
      fetch(`${API_SAVE_ISCORRECT}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({"node_id": selectedNodeId, "map_id": mapId, "is_cleared": "true"}),
      });
    } else {
      setError('不正解です。もう一度選択してください。');
      setDisabledOptions({
        ...disabledOptions,
        [user_answer]: true
      });
    }
  };

  //旧ver バグあり
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

  //新ver 
  //idを指定して子ノードのnameのリストを返す関数
  const findChildrenById = (node, id) => {
    if (node.id !== null && node.id === id) {
      return node.children.map(child => child.name);
    }
    for (let child of node.children) {
      const result = findChildrenById(child, id);
      if (result) {
        return result;
      }
    } 
    return null;
  }

  // idを指定して正解済みかの真偽値を返す関数
  const findNodeIsCorrect = (nodes, id) => {
    for (let node of nodes) {
      if (node.id === id) {
        // 指定されたIDを持つアイテムを見つけた場合、isCorrectの値を返す
        return node.isCorrect;
      }
    }
    // 指定されたIDを持つアイテムが見つからなかった場合、nullを返す
    return null;
  };

  // 問題に正解済みかどうかの真偽値を更新
  // const setTitleMatchedAsCorrect = (nodes, title) => {
  //   nodes.forEach(node => {
  //     if (node.data && node.data.label === title) {
  //       node.isCorrect = true;
  //     }
  //   });
  // };

  // CLEARエフェクトを非表示、問題メニューを非表示、ノードを追加
  const handleHideEffect = () => {
    setShowEffect(false);
    setQuestionMenu(false);
    updateNodeIsCorrect(selectedNodeId);
    setGauge(allNodes, clearedNodes+1);
    const dictTree = JSON.parse(tree);
    const childrenNames = findChildrenById(dictTree, selectedNodeId);
    if (childrenNames.length === 0) {
      console.log("子ノードがありません");
      setSuggestNode();
      toggleNodeFlipped(selectedNodeId);
      return;
    } else {
      newAddNode(childrenNames, childrenNames.length);
      setSuggestNode();
      toggleNodeFlipped(selectedNodeId);
    }
  };

  // CLEARエフェクトを非表示、問題メニューを非表示のみ
  const handleClose = () => {
    setShowEffect(false);
    setQuestionMenu(false);
    toggleNodeFlipped(selectedNodeId);
  }

  function questionSetting(quest, a, b, c, d, correctaAnswer) {
    setQuestion(quest);
    setAnswerA(a);
    setAnswerB(b);
    setAnswerC(c);
    setAnswerD(d);
    setCorrectAnswer(correctaAnswer);
  }

  useEffect(() => {
    // 問題文が変更されると実行される
    questionSetting(
      question_phrase, question_a, question_b, question_c, question_d, correctAns
    );
    setIsCorrect(findNodeIsCorrect(nodes, selectedNodeId))
  }, [question_phrase, nodes, selectedNodeId]);
    

  // ノードタイトルが変わるごとにリセット
  useEffect(() => {
    setDisabledOptions({
      a: false,
      b: false,
      c: false,
      d: false
    });
    setError('');
  }, [nodeTitle])

  return (
    <>
      <MenuWrapper open={questionMenuIsOpen}>
        <CloseButton onClick={() => setQuestionMenu(false)}>
          <svg width="20" height="20" viewBox="0 0 38 38" fill="none" xmlns="http://www.w3.org/2000/svg">
            <ClosePath id="Union" fillRule="evenodd" clipRule="evenodd" d="M31.1223 1.17157C32.6844 -0.390524 35.217 -0.390524 36.7791 1.17157C38.3412 2.73367 38.3412 5.26633 36.7791 6.82843L24.6322 18.9753L36.7791 31.1223C38.3412 32.6844 38.3412 35.217 36.7791 36.7791C35.217 38.3412 32.6844 38.3412 31.1223 36.7791L18.9754 24.6322L6.82842 36.7791C5.26632 38.3412 2.73366 38.3412 1.17156 36.7791C-0.390536 35.217 -0.390537 32.6844 1.17156 31.1223L13.3185 18.9753L1.17158 6.82843C-0.390521 5.26633 -0.390521 2.73367 1.17158 1.17157C2.73367 -0.390524 5.26633 -0.390524 6.82843 1.17157L18.9754 13.3185L31.1223 1.17157Z" themeColorId={themeColorId}/>
          </svg>
        </CloseButton>
        <div id='clearEffect'>
          <StyledQuestionHeader themeColorId={themeColorId}>
            <p>{nodeTitle}</p>
          </StyledQuestionHeader>
          {isQuestionMenuLoading ? 
          <LoadingScreenArea>
            <img src="load/question-loading.gif" alt="loading gif"></img>
          </LoadingScreenArea>
          :
          <>
          <StyledQuestionContent>
            <p>問題</p>
            <p>{question}</p>
          </StyledQuestionContent>
          <StyledQuestionButtons themeColorId={themeColorId}>
            <p id='buttonMessage'>正しい選択肢を選んでください</p>
            <ErrorMessage>{error}</ErrorMessage>
            <ButtonAAndC onClick={() => handleCheckAnswer("a")} disabled={disabledOptions["a"]} themeColorId={themeColorId}>A: {answerA}</ButtonAAndC>
            <ButtonBAndD onClick={() => handleCheckAnswer("b")} disabled={disabledOptions["b"]} themeColorId={themeColorId}>B: {answerB}</ButtonBAndD> <br></br>
            <ButtonAAndC onClick={() => handleCheckAnswer("c")} disabled={disabledOptions["c"]} themeColorId={themeColorId}>C: {answerC}</ButtonAAndC>
            <ButtonBAndD onClick={() => handleCheckAnswer("d")} disabled={disabledOptions["d"]} themeColorId={themeColorId}>D: {answerD}</ButtonBAndD>  
          </StyledQuestionButtons>
          </>
          
          }
          {showEffect && (
            <>
              <Overlay />
              <RedCircle>
                <img src={Clear_animation} alt="gif" />
              </RedCircle>
              <ClearText>CLEAR!!</ClearText>
              {isCorrect ? 
              <NextButton onClick={handleClose} className="next-button">
                <svg viewBox="0 0 419 115" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M0 30C0 13.4315 13.4315 0 30 0H419V85C419 101.569 405.569 115 389 115H0V30Z" fill="#2BA287"/>
                  <text x="50%" y="50%" alignmentBaseline="middle" textAnchor="middle">閉じる</text>
                </svg>
              </NextButton>
              : <NextButton onClick={handleHideEffect} className="next-button">
                  <svg viewBox="0 0 419 115" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M0 30C0 13.4315 13.4315 0 30 0H419V85C419 101.569 405.569 115 389 115H0V30Z" fill="#2BA287"/>
                  <text x="50%" y="50%" alignmentBaseline="middle" textAnchor="middle">次のノードへ</text>
                </svg>
                </NextButton>}
            </>
          )}
        </div>
      </MenuWrapper>
    </>
  );
}

export default QuestionMenu;
