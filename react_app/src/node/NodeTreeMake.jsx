import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { nanoid } from 'nanoid/non-secure';
import useStore from './store';
import styled from 'styled-components';
import { StartButton, Text } from './NodeTreeChoice';

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
    
`
const LoadingScreenWrapper = styled.div`
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    margin: auto;
    text-align: center;
    img {
        height: 400px;
    }
`

const FormWrapper = styled.div`
    margin-top: 3em;
    display: flex;
    flex-direction: column;
    font-family: "Noto Sans Japanese"; 
    form {
        margin: 5px 30px;
    }

    label {
        margin-bottom: 1em;
    }

    input {
        width: 40%;
        height: 2em;
        font-size: 1em;
        font-weight: 1000;
        padding: 0.5em;
        border-radius: 10px;
        box-shadow: inset 0px 2px 2px #cccccc;
        border: 1px solid #FFE867;

        &:hover {
            border: 1px solid #7BC74D;
        }
        &:focus {
            border: 1px solid #7BC74D;
            outline: #7BC74D 1px solid;
        }

    }
`

const Wrapper = styled.div`
    /* display: table; */
`

const Example = styled.div`
  text-align: center;
  margin-top: 15px;
  font-size: 25px;
  padding-right: 30%;
`

const StartTreeButton = styled(StartButton)`
    background-color: #7BC74D;
    color: #FFE867;
    bottom: 60px;
    right: 30%;
    &:hover {
        background-color: #FFE867;
        color: #66A83E;
    }
`

const API_MAP_MAKE = "http://localhost:8000/api/gpt_calling/make_map";

function NodeTreeMake() {
    const [formData, setFormData] = useState("");
    const [buttonIsDisabled, setButtonIsDisabled] = useState(true);
    const{ setLoadedMapData, setFirstLoadedMap, isCommonLoading, setIsCommonLoading, setGauge
      } = useStore(
          state => ({
            setLoadedMapData: state.setLoadedMapData,
            setFirstLoadedMap: state.setFirstLoadedMap,
            isCommonLoading: state.isCommonLoading,
            setIsCommonLoading: state.setIsCommonLoading,
            setGauge: state.setGauge,
          })
        );
    const navigate = useNavigate();
    
    //ユーザーの入力をformDataに格納
    const handleInputChange = (e) => {
        if (e.target.value === "") {
            setButtonIsDisabled(true);
            setFormData("");
        } else {
            setButtonIsDisabled(false);
            setFormData(e.target.value);
        }
    }
    
    // ボタンが押されたら、テーマに応じたマインドマップを作成
    const handleButton = () => {
        setIsCommonLoading(true);
        setButtonIsDisabled(true);
        const mapId = nanoid();
        const thisFormData = formData;
        console.log("MAKE MAP START--- MAP THEME: ", thisFormData, "\nMAP ID: ", mapId);
        fetch(`${API_MAP_MAKE}`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({"map_id": mapId, "theme": thisFormData}),
          }).then((response) => response.json())
          .then((data) => {
                const parseData = JSON.parse(data) 
                console.log("loaded data: ", parseData);
        
                const tree = parseData.tree;
                const mapId = parseData.mapId;
                const themeName = parseData.theme_name;  
                const allNodes = parseData.total_nodes;
                const cleared_nodes = 0;
                const nodes = JSON.stringify(parseData.node_list);
                const edges = JSON.stringify(parseData.edge_list);
                const nodesJSON = JSON.parse(nodes);
                const edgesJSON = JSON.parse(edges);
                const RootNode = [nodesJSON[0]];
                const FirstNode = [nodesJSON[1], nodesJSON[2], nodesJSON[3], nodesJSON[4]];
                setFirstLoadedMap(FirstNode);
                setLoadedMapData(tree, mapId, themeName, RootNode, edgesJSON);
                setGauge(allNodes, cleared_nodes);
                console.log("NODES:", nodesJSON);
                setIsCommonLoading(false);
                navigate("/map");
            });
    }

    return (
        <>
        {isCommonLoading ? 
        <LoadingScreenWrapper>
            <img src="load/loading-donguri.gif" alt="loading gif"></img>
        </LoadingScreenWrapper>
        :
            <>
            <Starter>
            <h2>下記の入力欄にテーマを入力して学習を始めましょう</h2>
            <p>
                あなたが学びたいもののテーマを入力して「はじめる」を押すことで<br/>
                入力したテーマに基づくマインドマップがChatGPTによって作成されます。
            </p>
            </Starter>
            <Wrapper>
                <FormWrapper>
                    <form  onLoad={handleInputChange} >
                        <label>
                            <Text>自由にマインドマップ作成</Text>
                            <input
                                onChange={handleInputChange}
                                placeholder='学習したいテーマを入力'
                            />
                        </label>
                    </form>
                </FormWrapper>
                <Button>
                    <StartTreeButton disabled={buttonIsDisabled} onClick={()=>handleButton()} className='btnripple'>はじめる</StartTreeButton>
                </Button>
            </Wrapper>
            <Example>テーマ例: 料理、スポーツ、Python</Example>
            </>
        }
        </>
        
    );
}

export default NodeTreeMake;