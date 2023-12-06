import { useLayoutEffect, useEffect, useRef, useState } from 'react';
import { Handle, Position, useReactFlow, useStoreApi } from 'reactflow';
import useStore from '../node/store';
import { styled } from 'styled-components';
import SwitchBtn from './SwitchBtn';
import NodeContents from '../NodeContents/NodeContents';

const NodethemeColorId = [
  {"main": "node/leaf-green.png", "sub": "node/leaf-yellow.png"},
  {"main": "node/leaf-green.png", "sub": "node/leaf-pink.png"},
  {"main": "node/leaf-green.png", "sub": "node/leaf-orange.png"},
]

const TestDiv = styled.div`
  background-image: ${(props) => (props.id === "root" || props.id === "root2") ? "url(node/wood.png)": (props.isCorrect ? `url(${NodethemeColorId[props.themeColorId]["sub"]})` : `url(${NodethemeColorId[props.themeColorId]["main"]})`) };
  background-size: contain;
  background-repeat: no-repeat;
  height: ${(props) => (props.id === "root" || props.id === "root2") ? "560px": "90px" };
  width: ${(props) => (props.id === "root" || props.id === "root2") ? "300px": "200px" };
  position: absolute;
  top: ${(props) => (props.id === "root" || props.id === "root2") ? "-65px": "-20px" };
  left: ${(props) => (props.id === "root" || props.id === "root2") ? "-77px": "-20px" };
`

const GroundWithGrass = styled.div`
  position: absolute;
  background-size: contain;
  background-repeat: no-repeat;
  background-image: ${(props) => (props.id === "root" || props.id === "root2") ? "url(node/ground.png)": null };
  height: ${(props) => (props.id === "root" || props.id === "root2") ? "700px": "0" };
  width: ${(props) => (props.id === "root" || props.id === "root2") ? "1500px": "0" };
  top: 455px;
  left: -650px;
  z-index: 1000;
`

const Ground = styled.div`
  position: absolute;
  background-size: contain;
  background-repeat: no-repeat;
  background-image: ${(props) => (props.id === "root" || props.id === "root2") ? "url(node/ground.svg)": null };
  height: ${(props) => (props.id === "root" || props.id === "root2") ? "10000px": "0" };
  width: ${(props) => (props.id === "root" || props.id === "root2") ? "10000px": "0" };
  top: 485px;
  left: -5000px;
  z-index: 999;
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
  /* background-color: ${(props) => (props.id === "root" || props.id === "root2") ? "#9C8468": (props.isCorrect ? "#FFE867" : "#7BC74D") }; */
  background-color: transparent;
  /* border-radius: 10px; */
  z-index: 10000;
  box-shadow: ${(props) => (props.id === "root" || props.id === "root2") ? "none": "none" };
  /* box-shadow: 0px 4px 4px 0px rgba(0, 0, 0, 0.25); */
  &:hover {
    ${(props) => (props.id === "root" || props.id === "root2") ? "": "transform: scale(1.30)"};
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
  color: ${(props) => props.isCorrect && props.id !== "root" ? "#7BC74D" : "#FAFFF7"};
  width: 600px;
  border-radius: 10px;
  font-weight: 700;
	letter-spacing: 0.05em;
  background: transparent;
  height: 100%;
  margin: 0;
  font-size: 14px;
  overflow-wrap: break-word;
  position: relative;
  top: ${(props) => (props.id === "root" || props.id === "root2") ? "12%" : "30%"};
  left: ${(props) => (props.id === "root" || props.id === "root2") ? "4%" : "10%"};
`;

function MindMapNode({ id, data, isCorrect,}) {
  const inputRef = useRef(null);
  const [isCorrectLocal, setIsCorrectLocal] = useState(isCorrect)

  const { nodes, getNodeFlippedStatus, toggleNodeFlipped, themeColorId } = useStore(state => ({
    nodes: state.nodes,
    getNodeFlippedStatus: state.getNodeFlippedStatus,
    toggleNodeFlipped: state.toggleNodeFlipped,
    themeColorId: state.themeColorId
  }));

  // const { setCenter } = useReactFlow();

  const flipped = getNodeFlippedStatus(id);

  const getIsCorrectById = (nodes, targetId) => {
    const node = nodes.find(node => node.id === targetId);
    return node ? node.isCorrect : null;
  };

  // const getPositionById = (nodes, targetId) => {
  //   const node = nodes.find(node => node.id === targetId);
  //   return node ? node.position : null;
  // };

  // const focusNode = () => {
  //   if (!flipped && nodes.length > 0) {
  //     const posi = getPositionById(nodes, id);
  //     const node = nodes[1];

  //     const x = posi.x + node.width / 2;
  //     const y = posi.y + node.height / 2 + (posi.y * 1.1);
  //     const zoom = 1.30;

  //     setCenter(x, y, { zoom, duration: 1000 });
  //   }
  // };

  useEffect(() => {
    const gotIsCorrect = getIsCorrectById(nodes, id);
    setIsCorrectLocal(gotIsCorrect);
  }, [nodes, id])

  useEffect(() => {
    setTimeout(() => {
      inputRef.current?.focus({ preventScroll: true });
    }, 1);
  }, []);

  useLayoutEffect(() => {
    if (inputRef.current) {
      // inputRef.current.style.width = `${data.label.length * 8}px`;
      inputRef.current.style.width = `120px`;
    }
  }, [data.label]);

  const onNodeClick = (e) => {
    e.preventDefault();
    toggleNodeFlipped(id);
    // focusNode()
    console.log("onNodeClick: ", flipped);
  };

  return (
    <>
    {/* <TestDiv id={id} isCorrect={isCorrectLocal} themeColorId={themeColorId}/> */}
    <GroundWithGrass id={id} />
    <Ground id={id} />
    <NodeContainer id={id}>
      <InputWrapper className="inputWrapper dragHandle" id={id} isCorrect={isCorrectLocal} onClick={(e) => onNodeClick(e)}>
        <TestDiv id={id} isCorrect={isCorrectLocal} themeColorId={themeColorId}></TestDiv>
        <DragHandleArea id={id} className="dragHandle">
          <P
            value={data.label}
            className="input"
            ref={inputRef}
            id={id}
            isCorrect={isCorrectLocal}
          >{data.label}</P>
         {/* <SwitchBtn flipped={flipped} isCorrect={isCorrectLocal}/> */}
        </DragHandleArea>
        {/* </TestDiv> */}
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
