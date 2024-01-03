import { useEffect, useState } from 'react';
import Select from 'react-select';
import { useNavigate } from 'react-router-dom';
import useStore from './store';
import styled from 'styled-components';
import LoadingScreen from '../components/LoadingScreen';

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

export const StartButton = styled.button`
    width: 180px;
    height: 60px;
    border-radius: 10px 0 10px 0;
    border: 0;
    box-shadow: 0px 1px 2px #8a8a8a;
    background-color: #FFE867;
    color: #66A83E;
    font-weight: bold;
    font-size: 20px;
    position: relative;
    bottom: 53px;
    right: 20%;
    &:hover {
        background-color: #7BC74D;
        color: #FFE867;
        cursor: pointer;
    }
`

export const Text = styled.p`
    color: #17594A;
    text-decoration:underline;
    text-decoration-color: #17594A;
    font-weight: bold;
`

const API_MAP_LOAD = "http://localhost:8000/api/load/map";
const API_MAP_NUMOFMAP = "http://localhost:8000/api/load/num_of_map";

const options = [
    { value: 'default', label: '学習したいテーマを選択' },
    // { value: 1, label: 'Python' },
    // { value: 2, label: 'アジアの郷土料理' },
];

function NodeTreeChoice() {
    const [selectedValue, setSelectedValue] = useState(options[0]);
    const [buttonIsDisabled, setButtonIsDisabled] = useState(false);
    
    const{ setLoadedMapData, isCommonLoading, setIsCommonLoading, setGauge
      } = useStore(
          state => ({
            setLoadedMapData: state.setLoadedMapData,
            isCommonLoading: state.isCommonLoading,
            setGauge: state.setGauge,
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
        }
    }, [selectedValue]);

    //画面ロード時にバックにマップの数を問い合わせてoptionsにvalue: mapId, label: themeNameを追加
    useEffect(() => {
        fetch(`${API_MAP_NUMOFMAP}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                },
            }).then((response) => response.json())
            .then((data) => {
                const parseData = JSON.parse(data)
                console.log("parseData", parseData)

                // optionsを初期化
                options.splice(0);
                options.push({ value: 'default', label: '学習したいテーマを選択' })
                //mapデータをoptionsに追加
                for (let i=0; i<parseData.length; i++) {
                    options.push({ value: parseData[i].map_id, label: parseData[i].theme_name })
                }
            });
    }, [])

    // ボタンが押されたら、テーマに応じたマインドマップを作成
    const handleButton = () => {
        console.log("LOAD START--- Map ID: ", selectedValue.value)
        fetch(`${API_MAP_LOAD}`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({"map_id": selectedValue.value}),
          }).then((response) => response.json())
          .then((data) => {
                const parseData = JSON.parse(data) 
                console.log("loaded data: ", parseData);
        
                const tree = parseData.tree;
                const mapId = parseData.mapId;
                const themeName = parseData.theme_name;  
                const allNodes = parseData.total_nodes;
                const cleared_nodes = parseData.cleared_nodes;
                const nodes = JSON.stringify(parseData.node_list);
                const edges = JSON.stringify(parseData.edge_list);
                const nodesJSON = JSON.parse(nodes);
                const edgesJSON = JSON.parse(edges);
                setLoadedMapData(tree, mapId, themeName, nodesJSON, edgesJSON);
                setGauge(allNodes, cleared_nodes);
                navigate("/map");
            });
    }

    return (
        
        <>
            {isCommonLoading ? null:
            <>
                <Starter>
                <h2>下記のメニューからテーマを選択して学習を再開しましょう</h2>
                <p>
                    あなたが作成して学習したテーマのマインドマップを<br/>
                    「学習したいテーマを選択」から選択することができます。
                </p>
                </Starter>
                
                <Selecter>
                    <Text>ライブラリからマインドマップを開く</Text>
                <Select
                    options={options}
                    defaultValue={selectedValue}
                    onChange={(value) => { setSelectedValue(value); }}
                    theme={(theme) => ({
                        ...theme,
                        colors: {
                          ...theme.colors,
                          text: '#cccccc',
                          primary25: '#FFE867',
                          primary: '#7BC74D',
                        },
                      })}
                    styles={{control: (provided, state) => ({
                        ...provided,
                        width: '50%',
                        height: '48px',
                        borderRadius: '10px',
                        color: '#fff',
                        border: '1px solid #FFE867',
                        backgroundColor: '#FAFFF7',
                        boxShadow: "inset 0px 2px 2px #cccccc",
                        '&:hover': {
                          border: '1px solid #7BC74D',
                          cursor: 'pointer',
                        },
                      }), width: "100px"}}
                />
                <Button buttonIsDisabled={buttonIsDisabled}>
                    <StartButton disabled={buttonIsDisabled} onClick={()=>handleButton()} className='btnripple'>はじめる</StartButton>
                </Button>
                </Selecter>
            </>
            }
        </>
        );
    }
    
    export default NodeTreeChoice;