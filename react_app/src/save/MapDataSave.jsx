import { useState, useEffect } from 'react';
import useStore from '../node/store';
import { useNavigate } from 'react-router-dom';

const API_MAP_SAVE = "http://localhost:8000/api/save/map";
const API_NODE_SAVE = "http://localhost:8000/api/save/node";
const API_EDGE_SAVE = "http://localhost:8000/api/save/edge";
const API_HOST_CREATENEWNODE = 'http://localhost:8000/api/save/create_newnode';

//メモ：map作るときにrootnodeを作成してそれをnode登録する
function MapDataSave(props) {
    const navigate = useNavigate();
    const {goTop} = props;
    const {
        nodes, edges, tree, themeName, mapId, clearedNodes
    } = useStore((state) => ({
        nodes: state.nodes, 
        edges: state.edges,
        tree: state.tree,
        themeName: state.themeName,
        mapId: state.mapId,
        clearedNodes: state.clearedNodes,
    }));

    useEffect(() =>{
        if (goTop) {
            handleSave();
            navigate("/start");
        }
    }, [goTop])

    const handleSave = async () => {
        console.log("Save start---");
        console.log("themeName: ", themeName);
        const nodesLength = nodes.length;
        const edgesLength = edges.length;
        const totalStep = 1 + 1 + nodesLength + edgesLength;
        let step = 0;

        await fetch(`${API_MAP_SAVE}`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({"map_id": mapId, "graph_structure": tree, "theme_name": themeName, "cleared_nodes": clearedNodes }),
          })
        .then((response) => response.json())
        .then((data) => {
            console.log("map return data: ", data);
            if (data === "success") {
                console.log("SAVE SUCCESS");
                step++;
            } else {
                console.log("SAVE FAILED");
            }
        });

        for (let i = 0; i < nodesLength; i++) {
            if (nodes[i].id === "root") {
                const nodeId = nodes[i].id;
                const idd = nodes[i].idd;
                const x_coordinate = nodes[i].position.x;
                const y_coordinate = nodes[i].position.y;
                await fetch(`${API_HOST_CREATENEWNODE}`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({"map_id": mapId, "title": themeName, "node_id": nodeId, "idd": idd, "x_coordinate": x_coordinate, "y_coordinate": y_coordinate }),
                })
                .then((response) => response.json())
                .then((data) => {
                    console.log("node data: ", data);
                    if (data === "success") {
                        console.log("SAVE SUCCESS");
                        step++;
                    } else {
                        console.log("SAVE FAILED");
                    }
                });
            }
            else {    
                const nodeId = nodes[i].id;
                const idd = nodes[i].idd;
                const x_coordinate = nodes[i].position.x;
                const y_coordinate = nodes[i].position.y;
                console.log("step: ", step);
                await fetch(`${API_NODE_SAVE}`, {
                    method: 'POST',
                    headers: {
                    'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({"map_id": mapId, "node_id": nodeId, "idd": idd, "x_coordinate": x_coordinate, "y_coordinate": y_coordinate }),
                })
                .then((response) => response.json())
                .then((data) => {
                    console.log("node data: ", data);
                    if (data === "success") {
                        console.log("SAVE SUCCESS");
                        step++;
                    } else {
                        console.log("SAVE FAILED");
                    }
                });
            }   
        }

        for (let i = 0; i < edgesLength; i++) {
            const edgeId = edges[i].id;
            const source = edges[i].source;
            const target = edges[i].target;
            console.log("step: ", step);
            await fetch(`${API_EDGE_SAVE}`, {
                method: 'POST',
                headers: {
                'Content-Type': 'application/json',
                },
                body: JSON.stringify({"map_id": mapId, "edge_id": edgeId, "parent_node": source, "child_node": target }),
            })
            .then((response) => response.json())
            .then((data) => {
                console.log("edge data: ", data);
                if (data === "success") {
                    console.log("SAVE SUCCESS");
                    step++;
                } else {
                    console.log("SAVE FAILED");
                }
            });
        }  
    }


    return (
        <>
            {/* <button onClick={() => handleSave()}>Save</button> */}
        </>
    );
}

export default MapDataSave;