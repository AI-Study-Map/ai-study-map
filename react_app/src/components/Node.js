import { useLayoutEffect, useEffect, useRef, useState } from 'react';
import { Handle, Position } from 'reactflow';

import useStore from '../node/store';
import { styled } from 'styled-components';
// import SwitchBtn from './SwitchBtn';
import NodeContents from '../NodeContents/NodeContents';

const fontColors = ["#7BC74D", "#66A83E", "#FAFFF7", "#FAFFF7"]

const TestDiv = styled.div`
  background-image: ${(props) => props.isRootNode ? "url(node/wood.png)": (props.isCorrect ? (props.hasChildren ? `url(node/leaf/pattern${props.themeColorId+1}-main.png)`: `url(node/leaf/pattern${props.themeColorId+1}-last.png)`) : `url(node/leaf/pattern${props.themeColorId+1}-sub.png)`) };
  background-size: contain;
  background-repeat: no-repeat;
  height: ${(props) => props.isRootNode ? "1000px": props.isLongString ? "125px": "100px" };
  width: ${(props) => props.isRootNode ? "400px": props.isLongString ? "280px": "220px" };
  position: absolute;
  top: ${(props) => props.isRootNode ? "-95px": props.isLongString ? "-30px": "-26px" };
  left: ${(props) => props.isRootNode ? "-100px": props.isLongString ? "-35px": "-3px" };
`

const GroundWithGrass = styled.div`
  position: absolute;
  background-size: contain;
  background-repeat: no-repeat;
  background-image: ${(props) => {
    if (props.isRootNode) {
      let imageUrl;
      if (props.mapProgressPercentage === 0) {
        imageUrl = "url(node/ground/first.png)";
      } else if (props.mapProgressPercentage > 0 && props.mapProgressPercentage <= 25) {
        imageUrl = `url(node/ground/pattern${props.themeColorId + 1}-second.png)`;
      } else if (props.mapProgressPercentage > 25 && props.mapProgressPercentage <= 75) {
        imageUrl = `url(node/ground/pattern${props.themeColorId + 1}-third.png)`;
      } else if (props.mapProgressPercentage > 75 && props.mapProgressPercentage <= 100) {
        imageUrl = `url(node/ground/pattern${props.themeColorId + 1}-last.png)`;
      }
      return imageUrl;
    }
    return null;
  }};
  height: ${(props) => props.isRootNode ? "700px" : "0"};
  width: ${(props) => props.isRootNode ? "1500px" : "0"};
  top: 615px;
  left: -650px;
  z-index: 1000000000;
`

const Ground = styled.div`
  position: absolute;
  background-size: contain;
  background-repeat: no-repeat;
  background-image: ${(props) => props.isRootNode ? "url(node/ground/ground.svg)": null };
  height: ${(props) => props.isRootNode ? "10000px": "0" };
  width: ${(props) => props.isRootNode ? "10000px": "0" };
  top: 645px;
  left: -5000px;
  z-index: 999;
`

const SuggestIcon = styled.div`
  position: absolute;
  background-size: contain;
  background-repeat: no-repeat;
  background-image: ${(props) => props.isSuggest ? `url("node/butterfly/pattern${props.themeColorId+1}.png")`: null };
  height: ${(props) => props.isSuggest ? "70px": "0" };
  width: ${(props) => props.isSuggest ? "80px": "0" };
  top: -60px;
  left: 185px;
  z-index: 1000;
`

const NodeContainer = styled.div`
  position: relative;
`;

const NodeContentsWrapper = styled.div`
  color: #213363;
  position: absolute;
  top: 80%;
  left: 0;
  z-index: 10000;
  pointer-events: auto;
  width: 500px;
  height: auto;
  overflow-x: auto; //はみ出したときスクロールバー
  background-color: #FAFFF7;
  border-radius: 22px;
  box-shadow: 0px 4px 4px 0px rgba(0, 0, 0, 0.25);
  padding: 15px;
    p {
      line-height: 1.3em;
    }
`;

const InputWrapper = styled.div`
  /* background-color: ${(props) => props.isRootNode ? "#17594A": (props.isCorrect ? "#FFE867" : "#7BC74D") }; */
  background-color: transparent;
  /* border-radius: 10px; */
  z-index: 10000;
  /* box-shadow: 0px 4px 4px 0px rgba(0, 0, 0, 0.25); */
  &:hover {
    ${(props) => props.isRootNode ? "": "transform: scale(1.30)"};
  }
  transition: transform 0.15s ease;
`;

const DragHandleArea = styled.div`
  width: 100%;
  flex: 1;  // 余ったスペースを埋める
  padding: 6px 10px;
  font-size: 20px;
  background: transparent;
  height: 100%;
  display: flex;
  align-items: center;
  pointer-events: all;
  text-align: center;
  padding: 10px 10px 20px 10px;
`

const P = styled.p`
  color: ${(props) => props.isCorrect && !props.isRootNode ? `${fontColors[props.themeColorId]}` : "#FAFFF7"};
  width: 600px;
  border-radius: 10px;
  font-weight: 700;
	letter-spacing: 0.05em;
  background: transparent;
  height: 100%;
  margin: 0;
  font-size: 18px;
  overflow-wrap: break-word;
  position: relative;
  top: ${(props) => props.isRootNode ? "12%" : "30%"};
  left: ${(props) => props.isRootNode ? "4%" : "10%"};
`;

function MindMapNode({ id, data, isCorrect}) {
  const inputRef = useRef(null);
  const [isCorrectLocal, setIsCorrectLocal] = useState(isCorrect);
  const [isRootNode, setIsRootNode] = useState(false);
  const [isLongString, setIsLongString] = useState(false)
  const [hasChildren, setHasChildren] = useState(true)

  const { nodes, getNodeFlippedStatus, toggleNodeFlipped, themeColorId, suggestNode, tree, allNodes, clearedNodes } = useStore(state => ({
    nodes: state.nodes,
    getNodeFlippedStatus: state.getNodeFlippedStatus,
    toggleNodeFlipped: state.toggleNodeFlipped,
    themeColorId: state.themeColorId,
    suggestNode: state.suggestNode,
    tree: state.tree,
    allNodes: state.allNodes,
    clearedNodes: state.clearedNodes,
  }));

  const flipped = getNodeFlippedStatus(id);

  const getIsCorrectById = (nodes, targetId) => {
    const node = nodes.find(node => node.id === targetId);
    return node ? node.isCorrect : null;
  };

// idを指定して子ノードが存在するかどうかを返す関数
const hasChildrenById = (node, id) => {
  if (node.id !== null && node.id === id) {
    return node.children && node.children.length > 0;
  }
  for (let child of node.children) {
    const result = hasChildrenById(child, id);
    if (result) {
      return true;
    }
  }
  return false;
}

  useEffect(() => {
    const gotIsCorrect = getIsCorrectById(nodes, id);
    setIsCorrectLocal(gotIsCorrect);
  }, [nodes, id])

  
  useEffect(() => {
    setTimeout(() => {
      inputRef.current?.focus({ preventScroll: true });
    }, 1);
    //iddが1のnodeのidとこのnodeのidが一致したらisRootNodeをtrueにset
    if (id === nodes[0].id) {
      setIsRootNode(true);
    }

    // 子ノードを持つかを調べる
    // const dictTree = JSON.parse(tree);
    // setHasChildren(dictTree && hasChildrenById(dictTree, id));
  }, []);

  useLayoutEffect(() => {
    if (inputRef.current) {
      // inputRef.current.style.width = `${data.label.length * 8}px`;
        inputRef.current.style.width = `170px`;
        if (data.label.length > 8) {
          setIsLongString(true)
        }
    }
  }, [data.label]);

  const onNodeClick = () => {
    toggleNodeFlipped(id);
    console.log("onNodeClick: ", flipped);
    console.log("suggestNode.id: ", suggestNode && suggestNode.id === id);
  };

  return (
    <>
    {/* <TestDiv isCorrect={isCorrectLocal} isRootNode={isRootNode} isLongString={isLongString}/> */}
    <GroundWithGrass isRootNode={isRootNode} themeColorId={themeColorId} mapProgressPercentage={clearedNodes / allNodes * 100}/>
    <Ground isRootNode={isRootNode} />
    <NodeContainer id={id}>
      <InputWrapper className="inputWrapper  dragHandle" id={id} isCorrect={isCorrectLocal} isRootNode={isRootNode} onClick={() => onNodeClick()}>
      <TestDiv isCorrect={isCorrectLocal} isRootNode={isRootNode} isLongString={isLongString} themeColorId={themeColorId} hasChildren={hasChildren}/>
      <SuggestIcon isSuggest={suggestNode && suggestNode.id === id} themeColorId={themeColorId}/>
        <DragHandleArea id={id} className="dragHandle">
          <P
            value={data.label}
            className="input"
            ref={inputRef}
            id={id}
            isCorrect={isCorrectLocal}
            isRootNode={isRootNode}
            themeColorId={themeColorId}
          >{data.label}</P>
         {/* <SwitchBtn flipped={flipped} isCorrect={isCorrectLocal}/> */}
        </DragHandleArea>
        
      </InputWrapper>
      {flipped && (
        <NodeContentsWrapper>
          <NodeContents title={data.label} id={id}/>
        </NodeContentsWrapper>
      )}

      <Handle type="target" position={Position.Top} />
      <Handle type="source" position={Position.Top} />
    </NodeContainer>
    </>
  );
}

export default MindMapNode;
