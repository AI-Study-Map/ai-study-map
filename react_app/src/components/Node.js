import { useLayoutEffect, useEffect, useRef, useState } from 'react';
import { Handle, Position } from 'reactflow';

import useStore from '../node/store';
import { styled } from 'styled-components';
import SwitchBtn from './SwitchBtn';
import NodeContents from '../NodeContents/NodeContents';

const NodeContainer = styled.div`
  position: relative;
`;

const NodeContentsWrapper = styled.div`
  position: absolute;
  top: 80%;
  left: 0;
  z-index: 1000;
  pointer-events: auto;
  width: 500px;
  height: auto;
  overflow-x: auto; //はみ出したときスクロールバー
  background-color: #FAFFF7;
  border-radius: 10px;
  box-shadow: 0px 4px 4px 0px rgba(0, 0, 0, 0.25);
  padding: 10px;
`;

const InputWrapper = styled.div`
  background-color: ${(props) => (props.id === "root" || props.id === "root2") ? "#17594A": (props.isCorrect ? "#FFE867" : "#7BC74D") };
  border-radius: 10px;
  z-index: 10000;
  box-shadow: 0px 4px 4px 0px rgba(0, 0, 0, 0.25);
`;

const DragHandleArea = styled.div`
  width: 100%;
  flex: 1;  // 余ったスペースを埋める
  padding: 6px 10px;
  font-size: 12px;
  background: transparent;
  height: 90%;
  display: flex;
  align-items: center;
  pointer-events: all;
  text-align: center;
`

const P = styled.p`
  color: ${(props) => props.isCorrect && props.id !== "root" ? "#7BC74D" : "white"};
  width: 600px;
  border-radius: 10px;
  font-weight: 700;
  background: transparent;
  height: 100%;
  margin: 0;
`;

function MindMapNode({ id, data, isCorrect }) {
  const inputRef = useRef(null);
  const [isCorrectLocal, setIsCorrectLocal] = useState(isCorrect)
  const { setSelectedNodeId } = useStore(state => ({ setSelectedNodeId: state.setSelectedNodeId }));

  const { nodes, getNodeFlippedStatus, toggleNodeFlipped } = useStore(state => ({
    nodes: state.nodes,
    getNodeFlippedStatus: state.getNodeFlippedStatus,
    toggleNodeFlipped: state.toggleNodeFlipped
  }));

  const flipped = getNodeFlippedStatus(id);

  const getIsCorrectById = (nodes, targetId) => {
    const node = nodes.find(node => node.id === targetId);
    return node ? node.isCorrect : null;
  };

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

  const onNodeClick = () => {
    setSelectedNodeId(id);
    toggleNodeFlipped(id);
    console.log("onNodeClick: ", flipped);
  };

  return (
    <NodeContainer>
      <InputWrapper className="inputWrapper" id={id} isCorrect={isCorrectLocal} onClick={() => onNodeClick()}>
        <DragHandleArea className="dragHandle">
          <P
            value={data.label}
            className="input"
            ref={inputRef}
            id={id}
            isCorrect={isCorrectLocal}
          >{data.label}</P>
         <SwitchBtn flipped={flipped}/>
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
  );
}

export default MindMapNode;
