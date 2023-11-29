import { useEffect, useState } from 'react';
import Select from 'react-select';
import { useNavigate } from 'react-router-dom';
import { nanoid } from 'nanoid/non-secure';
import useStore from './store';
import styled from 'styled-components';
import LoadingScreenTreeMake from '../components/LoadingScreenTreeMake';

const Starter = styled.div`
    border-bottom: 5px dotted #FFE867;
    p {
        color:#213363;
        font-size: 15px;
        font-weight: bold;
    }
`

const Button = styled.div`
    display: flex;
    justify-content: center;
`
const Selecter = styled.div`
    padding: 0.5rem 1rem;
    margin: 3em 1em;
    
`
const LoadingScreenWrapper = styled.div`
    margin: auto;
`

const FormWrapper = styled.div`
    margin-top: 3em;
    display: flex;
    flex-direction: column;
    align-items: center;
    font-family: "メイリオ";
    form {
        display: flex;
        flex-direction: column;
        align-items: center;
        
    }

    label {
        margin-bottom: 1em;
    }

    input {
        width: 15em;
        height: 3em;
        font-size: 1em;
        font-weight: 1000;
        padding: 0.5em;
        border: 4px solid #ccc;
        border-radius: 10px;
        outline: none;
        font-family: "メイリオ";
        transition: border-color 0.5s ease;

        &:hover {
            border-color: #4CAF50;
        }
        &:focus {
            border-color: #4CAF50;
        }

    }
`

const Wrapper = styled.div`
    /* display: table; */
`

const API_MAP_MAKE = "http://localhost:8000/api/gpt_calling/make_map";

function NodeTreeMake() {
    const [formData, setFormData] = useState("");
    const [buttonIsDisabled, setButtonIsDisabled] = useState(true);
    const{ setLoadedMapData, setFirstLoadedMap, isCommonLoading, setIsCommonLoading
      } = useStore(
          state => ({
            setLoadedMapData: state.setLoadedMapData,
            setFirstLoadedMap: state.setFirstLoadedMap,
            isCommonLoading: state.isCommonLoading,
            setIsCommonLoading: state.setIsCommonLoading,
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
                const nodes = JSON.stringify(parseData.node_list);
                const edges = JSON.stringify(parseData.edge_list);
                const nodesJSON = JSON.parse(nodes);
                const edgesJSON = JSON.parse(edges);
                const RootNode = [nodesJSON[0]];
                const FirstNode = [nodesJSON[1], nodesJSON[2], nodesJSON[3], nodesJSON[4]];
                setFirstLoadedMap(FirstNode);
                setLoadedMapData(tree, mapId, themeName, RootNode, edgesJSON);
                console.log("NODES:", nodesJSON);
                setIsCommonLoading(false);
                navigate("/map");
            });
    }

    return (
        <>
        {isCommonLoading ? 
        <LoadingScreenWrapper>
            <LoadingScreenTreeMake /> 
        </LoadingScreenWrapper>
        :
            <>
            <Starter>
            <h1>はじめる</h1>
            <p>下記のメニューからテーマを選択して学習を始めましょう</p>
            </Starter>
            <Wrapper>
                <FormWrapper>
                    <form  onLoad={handleInputChange} >
                        <label>
                            
                            <input
                                onChange={handleInputChange}
                                placeholder='自由にテーマを決めましょう'
                            />
                        </label>
                    </form>
                </FormWrapper>
                <Button>
                <button disabled={buttonIsDisabled} onClick={()=>handleButton()} className='btnripple'>マインドマップ作成</button>
                </Button>
            </Wrapper>
            </>
        }
        </>
        
    );
}

export default NodeTreeMake;