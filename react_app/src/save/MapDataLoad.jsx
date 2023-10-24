import { useEffect, useState } from 'react';
import useStore from '../node/store';

const API_MAP_LOAD = "http://localhost:8000/api/load/map";

function MapDataLoad() {
    const [thisMapId, setThisMapId] = useState(1); //mapIdを取得するための変数
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

    useEffect(() => {
        setThisMapId(firstSetMapId);
        console.log("thisMapId: ", thisMapId);
    }, [firstSetMapId]);

    const handleLoad = async () => {
        console.log("Load start---", thisMapId);
        await fetch(`${API_MAP_LOAD}`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },//thisMapIdは暫定で1
            body: JSON.stringify({"map_id": thisMapId}),
          })
        .then((response) => response.json())
        .then((data) => {
           const parseData = JSON.parse(data) 
           const tree = parseData.tree;
           const mapId = parseData.mapId;
           const themeName = parseData.theme_name;  
           const nodes = parseData.node_list;
           const edges = parseData.edge_list;
           setLoadedMapData(tree, mapId, themeName, nodes, edges);
        });
    };

    return (
        <>
            <button onClick={() =>handleLoad()}>Load</button>
        </>
    );
}

export default MapDataLoad;