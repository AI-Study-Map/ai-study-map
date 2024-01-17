import { useEffect, useState } from "react";
import useStore from "../node/store";
import { getBottomNavigationActionUtilityClass } from "@mui/material";
import { TiTree } from "react-icons/ti";
import { AiOutlineNodeIndex } from "react-icons/ai";
import styled from 'styled-components';
import '../noto_sans_jp.css'

const Wrapper = styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    font-size: 1.2em;
    font-weight: bold;
    background-color: #FAFFF7;;
    border-radius: 999px;
    padding: 5px 10px;
    font-family: "Noto Sans Japanese";
`

const Texts = styled.div`
    margin-right: 10px;
    margin-left: 3px;
`
const Texts2 = styled.div`
    margin-right: 3px;
    margin-left: 3px;
`

const ApiCounter = () => {
    const { apiTree, apiNode, setApiTree, setApiNode, apiLock, handleApiCount } = useStore(state => ({
        apiTree: state.apiTree,
        apiNode: state.apiNode,
        setApiTree: state.setApiTree,
        setApiNode: state.setApiNode,
        apiLock: state.apiLock,
        handleApiCount: state.handleApiCount,
    }));

    const [apiContent, setApiContent] = useState(true);

    useEffect(() => {
        if (apiTree === null) {
            setApiContent(false);
            console.log("B");
        }
        else {
            setApiContent(true);
            console.log("a");
        }
    }, [apiTree]);

    return (
        <>{apiContent &&
            <Wrapper>
                <TiTree color={"#213363"} size={20}/>
                <Texts>
                    {apiTree}
                </Texts>
                <AiOutlineNodeIndex color={"#213363"} size={23}/>
                <Texts2>
                    {apiNode}
                </Texts2>
                {/* <button onClick={() => handleApiCount(0)}>APIカウント</button>
                <button onClick={() => handleApiCount(1)}>tree-1</button>
                <button onClick={() => handleApiCount(2)}>node-1</button> */}
                {/* <button onClick={() => handleApiCount(3)}>debug用clear</button> */}
            </Wrapper>
        }
        </>
    );
}

export default ApiCounter;