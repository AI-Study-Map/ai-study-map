import useStore from '../node/store';

const API_MAP_LOAD = "http://localhost:8000/api/load/map";

function MapDataLoad() {
    const {
        setNodes, setEdges, setTree, setThemeName, setMapId, mapId
    } = useStore((state) => ({
        setNodes: state.setNodes, 
        setEdges: state.setEdges,
        setTree: state.setTree,
        setThemeName: state.setThemeName,
        setMapId: state.setMapId,
        mapId: state.mapId,
    }));

    const handleLoad = async () => {
        console.log("Load start---");
        await fetch(`${API_MAP_LOAD}`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({"map_id": mapId}),
          })
        .then((response) => response.json())
        .then((data) => {
            console.log("load data: ", data);
            if (data === "success") {
                console.log("LOAD SUCCESS");
            } else {
                console.log("LOAD FAILED");
            }
        });
    };

    return (
        <>
            <button onClick={() =>handleLoad()}>Load</button>
        </>
    );
}

export default MapDataLoad;