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
  /* display: flex;  // 横並びにする
  align-items: center;  // 縦方向中央に配置 */
  /* display: inline-block; */
`;

const DragHandleArea = styled.div`
  width: 100%;
  flex: 1;  // 余ったスペースを埋める
  padding: 6px 10px;
  font-size: 14px;
  background: transparent;
  height: 90%;
  display: flex;
  align-items: center;
  pointer-events: all;
`

const P = styled.p`
  color: white;
`;

function MindMapNode({ id, data }) {
  const inputRef = useRef(null);
  const updateNodeLabel = useStore((state) => state.updateNodeLabel);

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

  return (
    <Test>
      <InputWrapper className="inputWrapper">
        <DragHandleArea className="dragHandle">
            {/* <DragIcon /> */}
          <P
            value={data.label}
            className="input"
            ref={inputRef}
          >{data.label}</P>
        {/* <input
          value={data.label}
          onChange={(evt) => updateNodeLabel(id, evt.target.value)}
          className="input"
          ref={inputRef}
        /> */}
         <SwitchBtn></SwitchBtn>
        </DragHandleArea>
        {/* <button>O</button> */}
      </InputWrapper>

      {/* <Handle type="target" position={Position.Top} />
      <Handle type="source" position={Position.Top} /> */}
    </Test>
    
  );
}

export default MindMapNode;
