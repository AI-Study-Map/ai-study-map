import React, { useEffect, useState } from 'react';
import { styled } from 'styled-components';
import ReactMarkdown from 'react-markdown';
import useStore from '../node/store';

const NodeContentsArea = styled.div`
  z-index: 10000;
  /* margin-bottom: 30px; */
`

const ResponseLogArea = styled.div`
  overflow-x: auto;
`

const ButtonContainer = styled.div`
  display: flex;
  justify-content: space-between;
  margin: auto 30px;
`;

const StyledButton = styled.button`
  border-radius: 10px;
  background-color: #FFE867;
  box-shadow: 0px 4px 4px 0px rgba(0, 0, 0, 0.25);
  border: none; // デフォルトのボーダーを削除（必要に応じて）
  cursor: pointer; // ボタンにマウスカーソルが乗ったときのスタイル
  padding: 4px 8px; // ボタンのパディング（必要に応じて）
  width: 120px;
  // font
  color: var(--1, #17594A);
  text-align: center;
  font-family: Inter;
  font-size: 20px;
  font-style: normal;
  font-weight: 500;
  line-height: normal;
  &:hover {
    background-color: #FFD433; // ボタンにマウスカーソルが乗ったときの背景色
  }
`;

const StyledButtonGreen = styled(StyledButton)`
  background-color: #7BC74D;
  align-items: center;
  display: flex; // フレックスボックスとして要素を表示
  align-items: center; // 子要素を中央揃え
  justify-content: center; // 子要素を中央揃え
  color: #FAFFF7;
  &:hover {
    background-color: #5E9E3E; // ボタンにマウスカーソルが乗ったときの背景色
  }
`

const RegenerateSvg = styled.svg`
  margin-left: 8px; // テキストとSVGの間にマージンを追加
  vertical-align: middle; // テキストとSVGを中央揃え
`

const API_HOST = 'http://localhost:8000/api/gpt_calling/';
const API_HOST_DESCRIPTION = 'http://localhost:8000/api/gpt_calling/add_description';
const API_HOST_QUESTION = 'http://localhost:8000/api/gpt_calling/question';

function NodeContents(props) {
    const {title, id} = props;
    const [inputed, setInput] = useState(title); 
    const [description, setDescription] = useState('');
    const [example, setExample] = useState('');
    const{ questionMenuIsOpen, setQuestionMenu, nodeTitle, 
      setQuestionTitle, selectedNodeId, setQuestion
    } = useStore(
        state => ({
          questionMenuIsOpen: state.questionMenuIsOpen,
          setQuestionMenu: state.setQuestionMenu,
          nodeTitle: state.nodeTitle,
          setQuestionTitle: state.setQuestionTitle,
          selectedNodeId: state.selectedNodeId,
          setQuestion: state.setQuestion,
        })
      );

    useEffect(() => {
      // titleが変更されると実行される
      console.log("title: ", title);
      console.log("selectedNodeId:", selectedNodeId);
      fetch(`${API_HOST}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ nodeId: selectedNodeId, user_input: title, resend: "false" }),
      })
      .then((response) => response.json())
      .then((data) => {
      // ChatGPTからの応答をパースして、説明文と例文を取得、set
      console.log("data", data);
      const parsedContent = JSON.parse(data);
          console.log("parsedContent", parsedContent);
          setDescription(parsedContent.description);
          setExample(parsedContent.example);
      });
    }, [title]);

    const handleAddExplain = () => {
        //inputlogの最後の要素を取得し、文章を追加
        const thisTitle = title;
        const thisDescription = description;
        
        fetch(`${API_HOST_DESCRIPTION}`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({"title": thisTitle, "description": thisDescription }),
          })
        .then((response) => response.json())
        .then((data) => {
        const chatReply = JSON.parse(data);
        console.log(chatReply);
        // responselogの最後の要素を取得、ChatGPTからの応答を繋げる
        setDescription(description + chatReply.add_description);
      });
    }
    

    const handleResend = () => {
        fetch(`${API_HOST}`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ user_input: title, resend: "true" }),
          })
        .then((response) => response.json())
        .then((data) => {
          const parsedContent = JSON.parse(data);
          console.log("parsedContent", parsedContent);
          setDescription(parsedContent.description);
          setExample(parsedContent.example);
      });
    };

    const handleAddQuestion = () => {
        //ノード名と説明文をセット
        const thisId = id;
        const thisTitle = title;
        const desc = description;
        const exa = example;
        console.log("nodeId: ", thisId , "description: ", desc, "example: ", exa);
        
        try{//API
          fetch(`${API_HOST_QUESTION}`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({"nodeId": thisId, "title": thisTitle, "description": desc, "example": exa}),
          })
          .then((response) => response.json())
          .then((data) => {
            const qData = JSON.parse(data);
            console.log("qData", qData);
            //responseを各欄に反映
            setQuestion(
              qData.question, qData.question_a,
              qData.question_b, qData.question_c,
              qData.question_d, qData.true_answer
            )
          });

          } catch (error) {
            console.error('QuestionMakeError:', error);
          }
          console.log("nodeTitle: ", title);
          setQuestionTitle(title);
          setQuestionMenu(true);
    }

    return (
        <NodeContentsArea className='NodeContents' >
            <ResponseLogArea id='response_log'>
                <ReactMarkdown>{description}</ReactMarkdown>
                <hr></hr>
                <ReactMarkdown>{example}</ReactMarkdown>
            </ResponseLogArea>
            <ButtonContainer id='buttons'>
                <StyledButton id='addQuestion' onClick={handleAddQuestion}>問題作成</StyledButton>
                <StyledButton id='addExplain' onClick={handleAddExplain}>説明文追加</StyledButton>
                <StyledButtonGreen id='regenerate'onClick={handleResend}>
                  再生成
                  <RegenerateSvg xmlns="http://www.w3.org/2000/svg" width="25" height="25" viewBox="0 0 35 35" fill="none">
                    <path d="M17.5 32.0833C15.6771 32.0833 13.9694 31.7367 12.3769 31.0435C10.7844 30.3504 9.39896 29.4151 8.22062 28.2377C7.04229 27.0584 6.10701 25.673 5.41479 24.0815C4.72257 22.4899 4.37597 20.7822 4.375 18.9583C4.375 18.5451 4.515 18.1985 4.795 17.9185C5.075 17.6385 5.42111 17.499 5.83333 17.5C6.24653 17.5 6.59312 17.64 6.87312 17.92C7.15312 18.2 7.29264 18.5461 7.29167 18.9583C7.29167 21.8021 8.28236 24.2147 10.2637 26.196C12.2451 28.1774 14.6572 29.1676 17.5 29.1667C20.3437 29.1667 22.7563 28.176 24.7377 26.1946C26.7191 24.2132 27.7093 21.8011 27.7083 18.9583C27.7083 16.1146 26.7176 13.702 24.7362 11.7206C22.7549 9.73924 20.3428 8.74903 17.5 8.75H17.2812L18.5208 9.98959C18.8125 10.2813 18.9525 10.6215 18.9408 11.0104C18.9292 11.3993 18.7892 11.7396 18.5208 12.0313C18.2292 12.3229 17.8831 12.4751 17.4825 12.4877C17.0819 12.5003 16.7353 12.3603 16.4427 12.0677L12.6875 8.3125C12.3958 8.02084 12.25 7.68056 12.25 7.29167C12.25 6.90278 12.3958 6.5625 12.6875 6.27084L16.4427 2.51563C16.7344 2.22396 17.081 2.08396 17.4825 2.09563C17.884 2.1073 18.2301 2.25945 18.5208 2.55209C18.7882 2.84375 18.9282 3.18403 18.9408 3.57292C18.9535 3.96181 18.8135 4.30209 18.5208 4.59375L17.2812 5.83334H17.5C19.3229 5.83334 21.0306 6.17993 22.6231 6.87313C24.2156 7.56632 25.601 8.50209 26.7794 9.68042C27.9577 10.8588 28.8935 12.2442 29.5867 13.8367C30.2799 15.4292 30.626 17.1364 30.625 18.9583C30.625 20.7813 30.2784 22.489 29.5852 24.0815C28.892 25.674 27.9567 27.0594 26.7794 28.2377C25.6001 29.416 24.2147 30.3518 22.6231 31.045C21.0316 31.7382 19.3239 32.0843 17.5 32.0833Z" fill="#FAFFF7"/>
                  </RegenerateSvg>
                </StyledButtonGreen>
            </ButtonContainer>
        </NodeContentsArea>

    );
};

export default NodeContents;