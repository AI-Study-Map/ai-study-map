import { useLayoutEffect, useEffect, useRef } from 'react';
import { Handle, Position } from 'reactflow';

import useStore from '../node/store';
import DragIcon from './DragIcon';


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
    <>
      <div className="inputWrapper">
        <div className="dragHandle">
            <DragIcon />
        </div>
        <input
          value={data.label}
          onChange={(evt) => updateNodeLabel(id, evt.target.value)}
          className="input"
          ref={inputRef}
        />
      </div>

      <Handle type="target" position={Position.Top} />
      <Handle type="source" position={Position.Top} />
    </>
  );
}

export default MindMapNode;
