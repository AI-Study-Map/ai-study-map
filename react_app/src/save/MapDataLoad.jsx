import { useEffect, useState } from 'react';
import useStore from '../node/store';
import Select from 'react-select';

const API_MAP_LOAD = "http://localhost:8000/api/load/map";
const options = [
    { value: 'default', label: 'テーマを選択してください' },
    { value: 1, label: 'Python' },
    { value: 2, label: '食べ物' },
];


function MapDataLoad() {
    const [thisMapId, setThisMapId] = useState(1); //mapIdを取得するための変数
    const [selectedValue, setSelectedValue] = useState(options[0]);
    const [buttonIsDisabled, setButtonIsDisabled] = useState(false);
    const {
        setNodes, setEdges, setTree, setThemeName, setMapId, 
        mapId, firstSetMapId, setLoadedMapData
    } = useStore((state) => ({
        setNodes: state.setNodes, 
        setEdges: state.setEdges,
        setTree: state.setTree,
        setThemeName: state.setThemeName,
        setMapId: state.setMapId,
        mapId: state.mapId,
        firstSetMapId: state.firstSetMapId,
        setLoadedMapData: state.setLoadedMapData,
    }));

    // useEffect(() => {
    //     setThisMapId(firstSetMapId);
    //     console.log("thisMapId: ", thisMapId);
    // }, [firstSetMapId]);

    useEffect(() => {
        if(selectedValue.value === "default") {
            setButtonIsDisabled(true);
        } else {
            setButtonIsDisabled(false);
        }
    }, [selectedValue]);

    const handleLoad = async () => {
        console.log("Load start---", selectedValue.value);
        await fetch(`${API_MAP_LOAD}`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },//thisMapIdは暫定で1
            body: JSON.stringify({"map_id": selectedValue.value}),
          })
        .then((response) => response.json())
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
        });
    };

    return (
        <>
            <Select
                options={options}
                defaultValue={selectedValue}
                onChange={(value) => { setSelectedValue(value); }}
            />
            <button onClick={() =>handleLoad()}>Load</button>
        </>
        
    );
}

export default MapDataLoad;