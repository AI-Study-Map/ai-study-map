import NodeTreeMake from "../node/NodeTreeMake";
import React from 'react';
import styled, { createGlobalStyle } from 'styled-components';
import Header from "../layout/Header";
import TopLogo from '../images/TopLogo.png'

import { useEffect, useState } from 'react';
import Select from 'react-select';
import { useNavigate } from 'react-router-dom';
import useStore from '../node/store';


const Starter = styled.div`
    border-bottom: 5px dotted #FFE867;
    p {
        color:#213363;
        font-size: 15px;
        font-weight: bold;
    }
`

const Button = styled.div`
    text-align: right;
`
const Selecter = styled.div`
    padding: 0.5rem 1rem;
    margin: 3em 1em;
    margin-bottom: 0em;
    
`

const API_MAP_LOAD = "http://localhost:8000/api/load/map";
const options = [
    { value: 'default', label: '難易度を選択してください' },
    // { value: 1, label: 'Python' },
    { value: "ナン", label: '簡単' },
    { value: "ロティ", label: '普通' },
    { value: "コムタム", label: '難しい'} ,
];

const GlobalStyle = createGlobalStyle`
  html {
    height: 100%;/*高さを100%にして描画エリアをとる*/
  }

  body {
    height: 100%;/*高さを100%にして描画エリアをとる*/
    font-family: "メイリオ";
    background-color: #FAFFF7;
  }
`;

const Container = styled.div`
  height: auto;
  display: flex; //横並び
  justify-content: space-between;
  padding: 6rem 4rem;
`;

const LeftSection = styled.div` // コンテナ左
  padding: 1rem 2rem;
  flex: 0.5;
  margin: 2rem 0 2rem 8rem;
  min-width: 670px;
  .logo {
    display: flex; // ロゴとアプリ説明を横並び
  }

  .logo img{
    width: 300px;
    height: 300px;
  }

  .logo h1 {
    color: #17594A;
    max-height: 300px;
    text-align: center;
    line-height: 1.5em;
    padding-left: 1em;
    padding-top: 1em;
  }
  p {
    color: #213363;
    font-size: 30px;
    line-height: 1.5em;
    margin-top: 2rem;
    background-color: #FAFFF7;
  }
`;
const RightSection = styled.div` // コンテナ右
  max-height: 400px;
  max-width: 600px;
  padding: 2rem 2rem;
  margin: 6rem 10rem 3rem 3rem;
  flex: 0.5;
  border: 5px dotted #FFE867;
  border-radius: 10px;
  border-width: 4px;
  h1 {
    color: #17594A;
  }
  button {
    background-color: #7BC74D;
    color: #FAFFF7;
    font-size: 20px;
    font-weight: bold;
    margin: 5rem 0.5rem 0 0.5rem;
    padding: 1rem 1rem;
    border: none;
    border-radius: 15px;
    cursor: pointer;
  }
  button:hover {
    background-color: #62a439;
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
`;

function Top() {
    const [selectedValue, setSelectedValue] = useState(options[0]);
    const [buttonIsDisabled, setButtonIsDisabled] = useState(false);
    const{ setLoadedMapData, setValuea
      } = useStore(
          state => ({
            setLoadedMapData: state.setLoadedMapData,
            setValuea: state.setValuea,
          })
        );
    const navigate = useNavigate();
    
    console.log("selectedValue", selectedValue)

    // テーマが選択されていない場合はボタンを非有効化
    useEffect(() => {
        if(selectedValue.value === "default") {
            setButtonIsDisabled(true);
        } else {
            setButtonIsDisabled(false);
            setValuea(selectedValue.value);
            console.log("options.value", selectedValue.value)
        }
    }, [selectedValue]);

    // ボタンが押されたら、テーマに応じたマインドマップを作成
    const handleButton = () => {
        // console.log("LOAD START--- Map ID: ", selectedValue.value)
        // fetch(`${API_MAP_LOAD}`, {
        //     method: 'POST',
        //     headers: {
        //       'Content-Type': 'application/json',
        //     },
        //     body: JSON.stringify({"map_id": selectedValue.value}),
        //   }).then((response) => response.json())
        //   .then((data) => {
        //         const parseData = JSON.parse(data) 
        //         console.log("loaded data: ", parseData);
        
        //         const tree = parseData.tree;
        //         const mapId = parseData.mapId;
        //         const themeName = parseData.theme_name;  
        //         const nodes = JSON.stringify(parseData.node_list);
        //         const edges = JSON.stringify(parseData.edge_list);
        //         const nodesJSON = JSON.parse(nodes);
        //         const edgesJSON = JSON.parse(edges);
        //         setLoadedMapData(tree, mapId, themeName, nodesJSON, edgesJSON);
                navigate("/map");
            // });
    }
  return (
    <>
    <GlobalStyle />
      <Header />
      <Container>
        <LeftSection>
          <div className="logo">
            <img src={TopLogo} alt="toplogo" />
            <h1>AI Study Mapは<br />誰でも手軽に素早く<br />体系的に学習できる<br />Webアプリです</h1>
          </div>
            <p>
              マインドマップを活用しゲーム感覚で楽しく学ぶことができます。<br/>
              INIAD-Fesではクイズを解きながら単語を見つけ出す宝探しゲームとして体験していただきます!
            </p>
        </LeftSection>
        <RightSection>
        <>
        <Starter>
        <h1>はじめる</h1>
        <p>下記のメニューからテーマを選択して宝探しを始めましょう</p>
        </Starter>
        <Selecter>
        <Select
            options={options}
            defaultValue={selectedValue}
            onChange={(value) => { setSelectedValue(value); }}
        />
        </Selecter>
        <Button>
        <button disabled={buttonIsDisabled} onClick={()=>handleButton()} className='btnripple'>マインドマップ作成</button>
        </Button>
    </>
        </RightSection>
      </Container>
    </>
  );
}

export default Top;
