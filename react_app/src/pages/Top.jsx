import NodeTreeChoice from "../node/NodeTreeChoice";
import React from 'react';
import styled, { createGlobalStyle } from 'styled-components';
import Header from "../layout/Header";
import TopLogo from '../images/TopLogo.png'
import NodeTreeMake from "../node/NodeTreeMake";
import { useNavigate } from 'react-router-dom';
import '../noto_sans_jp.css'

export const GlobalStyle = createGlobalStyle`
  html {
    height: 100%;/*高さを100%にして描画エリアをとる*/
  }

  body {
    height: 100%;/*高さを100%にして描画エリアをとる*/
    font-family: "Noto Sans Japanese"; 
    background-color: #FAFFF7;
  }
`;

export const Container = styled.div`
  display: flex; //横並び
  justify-content: space-around;
  padding: rem 0 4rem 0;
`;

const LeftSection = styled.div` // コンテナ左
  width: 45%;
  min-width: 300px;
  padding: 1rem 2rem;
  flex: 0.5;
  margin: 2rem 1rem 2rem 6rem;
  .logo {
    display: flex; // ロゴとアプリ説明を横並び
  }

  .logoimg {
    max-width: 300px;
    max-height: 300px;
    min-width: 200px;
    min-width: 200px;
  }

  .logoimg img {
    width: 100%;
  }

  .logo h1 {
    width: 250px;
    font-size: 30px;
    color: #17594A;
    max-height: 300px;
    min-width: 300px;
    text-align: center;
    line-height: 1.5em;
    padding-left: 1em;
    padding-top: 0.5em;
  }
  p {
    color: #213363;
    font-size: 30px;
    line-height: 1.5em;
    margin-top: 1em;
    background-color: #FAFFF7;
  }

  .pc {
    font-size: 20px;
    line-height: 1.1em;
  }
  
  @media screen and (max-width: 1600px){
    margin: 2rem 0 2rem 2rem;
    .logo {
      display: block;
    }

    .logo h1 {
      text-align: left;
      min-width: 655px;
    }
    
    p {
      padding-left: 1em;
    }

    .pc {
      display: block; // 画面幅が1700px以下になったら改行
    }
  }
`;
const RightSection = styled.div` // コンテナ右
  width: 750px;
  height: 420px;
  background-color: #857f7f;
  margin: 4rem 0 0 0;
`;

const ScrollDown = styled.div`
  .arrows {
  width: 60px;
  height: 72px;
  position: absolute;
  left: 50%;
  margin-left: -30px;
  bottom: 20px;
}

  .arrows path {
    stroke: #7BC74D;
    fill: transparent;
    stroke-width: 1px;  
    animation: arrow 2s infinite;
    -webkit-animation: arrow 2s infinite; 
  }

  @keyframes arrow
  {
  0% {opacity:0}
  40% {opacity:1}
  80% {opacity:0}
  100% {opacity:0}
  }

  @-webkit-keyframes arrow /*Safari and Chrome*/
  {
  0% {opacity:0}
  40% {opacity:1}
  80% {opacity:0}
  100% {opacity:0}
  }

  .arrows path.a1 {
    animation-delay:-1s;
    -webkit-animation-delay:-1s; /* Safari 和 Chrome */
  }

  .arrows path.a2 {
    animation-delay:-0.5s;
    -webkit-animation-delay:-0.5s; /* Safari 和 Chrome */
  }

  .arrows path.a3 { 
    animation-delay:0s;
    -webkit-animation-delay:0s; /* Safari 和 Chrome */
  }
`;

const BottomSection = styled.div`
  min-width: 250px;
  max-height: 350px;
  padding: 2rem 2rem;
  margin: 0 4rem 4rem 4rem;
  flex: 0.5;
  border: 5px dotted #FFE867;
  border-radius: 10px;
  border-width: 4px;
  text-align: center;
  align-items: center;
  justify-content: center;
  
  h1 {
    color: #17594A;
    line-height: 1.2em;
  }

  .btn {
    /* text-align: right; */
    /* margin-right: 1.5rem; */
  }

  button {
    background-color: #7BC74D;
    color: #FAFFF7;
    font-size: 20px;
    font-weight: bold;
    margin: 0rem 0.5rem 0 0.5rem;
    padding: 1rem 1rem;
    border: none;
    border-radius: 25px 5px 25px 5px;
    cursor: pointer;
  }
  button:hover {
    background-color: #FFE867;
    color: #7BC74D;
  }
  /* クリックしたら波紋が広がる */
  .btnripple {
    /*波紋の基点とするためrelativeを指定*/
    position: relative;
    /*はみ出す波紋を隠す*/
    overflow: hidden;
  }
  .btnripple::after {
    content:"";
    /*絶対配置で波紋位置を決める*/
    position: absolute;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    /*波紋の形状*/
    background: radial-gradient(circle, #fff 10%, transparent 10%) no-repeat 50%;
    transform: scale(10, 10);
    /*はじめは透過0に*/
    opacity: 0;
    /*アニメーションの設定*/
    transition: transform 0.3s, opacity 1s;
}

/*クリックされたあとの形状の設定*/
    .btnripple:active::after {
    transform: scale(0, 0);
    transition: 0s;
    opacity: 0.3;
}

@media screen and (max-width: 1200px){
    .pc {
      display: block;
    }
  }

`;

function Top() {
  const navigate = useNavigate();
  const handleGoStart = () => {
    navigate("/start");
  }

  return (
    <>
    <meta name="viewport" content="width=device-width, initial-scale=1"></meta>
    <GlobalStyle />
      <Header />
      <Container>
        <LeftSection>
          <div className="logo">
            <div className="logoimg">
              <img src={TopLogo} alt="toplogo" />
            </div>
            <h1>AI Study Mapは<br />誰でも手軽に素早く<br />体系的に学習できる<br />Webアプリです</h1>
          </div>
            <p>
            <span class="pc">マインドマップを活用し</span><span class="pc">ゲーム感覚で楽しく学ぶことができます。</span>
            </p>
        </LeftSection>
        <RightSection>
          <div className="spinner">
          </div>
        </RightSection>
        </Container>
        <ScrollDown>
        <svg class="arrows">
              <path class="a1" d="M0 0 L30 32 L60 0"></path>
              <path class="a2" d="M0 20 L30 52 L60 20"></path>
              <path class="a3" d="M0 40 L30 72 L60 40"></path>
            </svg>
        </ScrollDown>
        <BottomSection>
          <h1><span class="pc">AI Study Mapを</span></h1>
          <div className="btn">
            <button className="btnripple" onClick={()=>handleGoStart()}>はじめる</button>
          </div>
          {/* <NodeTreeChoice />
          <NodeTreeMake /> */}
        </BottomSection>
    </>
  );
}

export default Top;
