import { useEffect, useState } from 'react';
import Select from 'react-select';
import { useNavigate } from 'react-router-dom';
import useStore from './store';
import styled from 'styled-components';

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

const API_MAP_LOAD = "http://localhost:8000/api/load/map";
const API_MAP_NUMOFMAP = "http://localhost:8000/api/load/num_of_map";

const options = [
    { value: 'default', label: 'テーマを選択してください' },
    // { value: 1, label: 'Python' },
    // { value: 2, label: 'アジアの郷土料理' },
];

function NodeTreeChoice() {
    const [selectedValue, setSelectedValue] = useState(options[0]);
    const [buttonIsDisabled, setButtonIsDisabled] = useState(false);
    
    const{ setLoadedMapData
      } = useStore(
          state => ({
            setLoadedMapData: state.setLoadedMapData,
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
                options.push({ value: 'default', label: 'テーマを選択してください' })
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
                const nodes = JSON.stringify(parseData.node_list);
                const edges = JSON.stringify(parseData.edge_list);
                const nodesJSON = JSON.parse(nodes);
                const edgesJSON = JSON.parse(edges);
                setLoadedMapData(tree, mapId, themeName, nodesJSON, edgesJSON);
                navigate("/map");
            });
    }

    return (
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
        <Button buttonIsDisabled={buttonIsDisabled}>
        <button disabled={buttonIsDisabled} onClick={()=>handleButton()} className='btnripple'>選択してマインドマップ作成</button>
        </Button>
    </>
    );
}

export default NodeTreeChoice;