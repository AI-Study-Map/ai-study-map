import { useLayoutEffect, useEffect, useRef } from 'react';
import { Handle, Position } from 'reactflow';

import useStore from '../node/store';
import DragIcon from './DragIcon';
import { styled } from 'styled-components';
import SwitchBtn from './SwitchBtn';

const Test = styled.div`
  /* width: 200px;
  height: 30px; */
  max-width: 300px;
  /* background-color: #17594A; */
  display: inline-block;
`

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
  const updateNodeLabel = useStore((state) => state.updateNodeLabel);
  const { setSelectedNodeId } = useStore(state => ({ setSelectedNodeId: state.setSelectedNodeId }));

  const tmpData = { label: 'Python' }

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

  const onNodeClick = (event, element) => {
    setSelectedNodeId(id);
  };

  return (
    <Test onClick={() => onNodeClick()}>
      <InputWrapper className="inputWrapper" id={id}>
        <DragHandleArea className="dragHandle">
          <P
            value={data.label}
            className="input"
            ref={inputRef}
          >{data.label}</P>
         <SwitchBtn />
        </DragHandleArea>
      </InputWrapper>

      <Handle type="target" position={Position.Top} />
      <Handle type="source" position={Position.Top} />
    </Test>
    
  );
}

export default MindMapNode;
