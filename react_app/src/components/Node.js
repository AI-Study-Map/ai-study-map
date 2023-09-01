import { useLayoutEffect, useEffect, useRef } from 'react';
import { Handle, Position } from 'reactflow';

import useStore from '../node/store';
import DragIcon from './DragIcon';
import { styled } from 'styled-components';

const NodeArea = styled.div`
  /* background-color: yellow; */
  width: 70%;
`

const Test = styled.div`
  background-color: blue;
  width: 70px;
  height: 20px;
`

function MindMapNode({ id, data }) {
  const inputRef = useRef(null);
  const updateNodeLabel = useStore((state) => state.updateNodeLabel);

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
      <div className="inputWrapper">
        <NodeArea className="dragHandle">
            {/* <DragIcon /> */}
          <p
            value={data.label}
            className="input"
            ref={inputRef}
          >Python</p>
        {/* <input
          value={data.label}
          onChange={(evt) => updateNodeLabel(id, evt.target.value)}
          className="input"
          ref={inputRef}
        /> */}
        </NodeArea>
        <button>O</button>
      </div>

      <Handle type="target" position={Position.Top} />
      <Handle type="source" position={Position.Top} />
    </Test>
  );
}

export default MindMapNode;
