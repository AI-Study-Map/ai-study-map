import { useCallback, useRef } from 'react';
import ReactFlow, {
  ConnectionLineType,
  useReactFlow,
  useStoreApi,
  Controls,
  Panel,
  Background,
} from 'reactflow';
import {shallow} from 'zustand/shallow';

import useStore from './store';
import MindMapNode from '../components/Node';
import MindMapEdge from '../components/Edge';

// we need to import the React Flow styles to make it work
import 'reactflow/dist/style.css';
import Header from '../layout/Header';

const selector = (state) => ({
  nodes: state.nodes,
  edges: state.edges,
  onNodesChange: state.onNodesChange,
  onEdgesChange: state.onEdgesChange,
  addChildNode: state.addChildNode,
  // selectedNodeId: state.selectedNodeId,
  // setSelectedNodeId: state.setSelectedNodeId,
});

const nodeTypes = {
  mindmap: MindMapNode,
};

const edgeTypes = {
  mindmap: MindMapEdge,
};

const nodeOrigin = [0.5, 0.5];

const connectionLineStyle = { stroke: '#000', strokeWidth: 2 };
const defaultEdgeOptions = { style: connectionLineStyle, type: 'mindmap' };

const Flow = () =>  {
  const store = useStoreApi();
  const { nodes, edges, onNodesChange, onEdgesChange, addChildNode } = useStore(
    selector,
    shallow
  );

  const { project } = useReactFlow();
  const connectingNodeId = useRef(null);

  const getChildNodePosition = (event, parentNode) => {
    const { domNode } = store.getState();

    if (
      !domNode ||
      // we need to check if these properites exist, because when a node is not initialized yet,
      // it doesn't have a positionAbsolute nor a width or height
      !parentNode?.positionAbsolute ||
      !parentNode?.width ||
      !parentNode?.height
    ) {
      return;
    }

    const { top, left } = domNode.getBoundingClientRect();

    // we need to remove the wrapper bounds, in order to get the correct mouse position
    const panePosition = project({
      x: event.clientX - left,
      y: event.clientY - top,
    });

    // we are calculating with positionAbsolute here because child nodes are positioned relative to their parent
    return {
      x: panePosition.x - parentNode.positionAbsolute.x + parentNode.width / 2,
      y: panePosition.y - parentNode.positionAbsolute.y + parentNode.height / 2,
    };
  };

  const onConnectStart = useCallback((_, { nodeId }) => {
    // we need to remember where the connection started so we can add the new node to the correct parent on connect end
    connectingNodeId.current = nodeId;
  }, []);

  const onConnectEnd = useCallback(
    (event) => {
      const { nodeInternals } = store.getState();
      const targetIsPane = (event.target).classList.contains(
        'react-flow__pane'
      );
      const node = (event.target).closest('.react-flow__node');

      if (node) {
        node.querySelector('input')?.focus({ preventScroll: true });
      } else if (targetIsPane && connectingNodeId.current) {
        const parentNode = nodeInternals.get(connectingNodeId.current);
        const childNodePosition = getChildNodePosition(event, parentNode);

        if (parentNode && childNodePosition) {
          addChildNode(parentNode, childNodePosition);
        }
      }
    },
    [getChildNodePosition]
  );

  return (
    <div style={{height: 93 + "vh"}}>
      <Header />
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnectStart={onConnectStart}
        onConnectEnd={onConnectEnd}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        nodeOrigin={nodeOrigin}
        defaultEdgeOptions={defaultEdgeOptions}
        connectionLineStyle={connectionLineStyle}
        connectionLineType={ConnectionLineType.Straight}
        fitView
      >
        <Background color="#FAFFF7" style={{"backgroundColor": "#FAFFF7"}}/>
        <Controls showInteractive={false} />
        
        <Panel position="top-left" className="header">
          AI Study Map
        </Panel>
      </ReactFlow>
    </div>
  );
}

export default Flow;




// import { useEffect, useState } from "react";
// import ReactFlow, { Controls, Background, MarkerType } from 'reactflow';
// import 'reactflow/dist/style.css';

// function Node() {
//   const nodes = [
//     {
//       id: '1',
//       data: { label: 'Start!' },
//       position: { x: 100, y: 0 },
//     },
//     {
//       id: '2',
//       data: { label: 'Node1' },
//       position: { x: 100, y: 100 },
//     },
//     {
//       id: '3',
//       data: { label: 'Node2' },
//       position: { x: 0, y: 200 },
//     },
//     {
//       id: '4',
//       data: { label: 'Node3' },
//       position: { x: 200, y: 200 },
//     }
//   ];
  
//   const edges = [
//     {
//       id: 'e1-2',
//       source: '1',
//       target: '2',
//       type: 'smoothstep',
//       markerEnd: { type: MarkerType.ArrowClosed },
//     },
//     {
//       id: 'e2-3',
//       source: '2',
//       target: '3',
//       type: 'smoothstep',
//       markerEnd: { type: MarkerType.ArrowClosed },
//     },
//     {
//       id: 'e2-4',
//       source: '2',
//       target: '4',
//       type: 'smoothstep',
//       markerEnd: { type: MarkerType.ArrowClosed },
//     }
//   ]

//   return (
//     <div style={{height: 100 + "vh"}}>
//         <ReactFlow nodes={nodes} edges={edges}>
//           <Background />
//           <Controls />
//         </ReactFlow>
//     </div>
//   );
// }

// export default Node;