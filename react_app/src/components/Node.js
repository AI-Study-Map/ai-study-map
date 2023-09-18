import { useLayoutEffect, useEffect, useRef } from 'react';
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
  top: 100%;
  left: 0;
  z-index: 1000000;
  pointer-events: auto;
`;

const InputWrapper = styled.div`
  background-color: ${(props) => props.id === "root" ? "#17594A": "#7BC74D" };
  border-radius: 10px;
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
  color: white;
  width: 600px;
`;

function MindMapNode({ id, data }) {
  const inputRef = useRef(null);
  const { setSelectedNodeId } = useStore(state => ({ setSelectedNodeId: state.setSelectedNodeId }));

  const { getNodeFlippedStatus, toggleNodeFlipped } = useStore(state => ({
    getNodeFlippedStatus: state.getNodeFlippedStatus,
    toggleNodeFlipped: state.toggleNodeFlipped
  }));

  const flipped = getNodeFlippedStatus(id);

  useEffect(() => {
    setTimeout(() => {
      inputRef.current?.focus({ preventScroll: true });
    }, 1);
  }, []);

  useLayoutEffect(() => {
    if (inputRef.current) {
      inputRef.current.style.width = `${data.label.length * 8}px`;
    }
  }, [data.label.length]);

  const onNodeClick = () => {
    setSelectedNodeId(id);
    toggleNodeFlipped(id);
    console.log("onNodeClick: ", flipped);
  };

  return (
    <NodeContainer onClick={() => onNodeClick()}>
      <InputWrapper className="inputWrapper" id={id}>
        <DragHandleArea className="dragHandle">
          <P
            value={data.label}
            className="input"
            ref={inputRef}
          >{data.label}</P>
         <SwitchBtn flipped={flipped}/>
        </DragHandleArea>
        
      </InputWrapper>
      {flipped && (
        <NodeContentsWrapper>
          <NodeContents />
        </NodeContentsWrapper>
      )}

      <Handle type="target" position={Position.Top} />
      <Handle type="source" position={Position.Top} />
    </NodeContainer>
  );
}

export default MindMapNode;
