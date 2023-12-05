import ReactFlow, {
  ConnectionLineType,
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
import QuestionMenu from './QuestionMenu';
import styled from 'styled-components';
import { useEffect } from 'react';

const SuggestNodeWrapper = styled.div`
  font-size: 20px;
  position: absolute;
  top: 6.6%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 1000;
  pointer-events: none;
  border: 2px solid #999;
  padding: 30px 105px;
  border-radius: 10px;
`;


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
  const { nodes, edges, onNodesChange, onEdgesChange } = useStore(
    selector,
    shallow,
  );
  const{ suggestNode, setSuggestNode } = useStore(
    state => ({
      suggestNode: state.suggestNode,
      setSuggestNode: state.setSuggestNode,
    })
  );

  useEffect(() => {
    setSuggestNode();
    console.log("suggestNode:", suggestNode);
  }, [])

  // const defaultViewport = { x: 500, y: 500, zoom: 1.0 };

  return (
    <div style={{height: 92 + "vh"}}>
      <Header />
      <QuestionMenu />
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        nodeOrigin={nodeOrigin}
        defaultEdgeOptions={defaultEdgeOptions}
        connectionLineStyle={connectionLineStyle}
        connectionLineType={ConnectionLineType.Straight}
        // defaultViewport={defaultViewport}
        fitView
      >
        {/* <Background color="#FAFFF7" style={{"backgroundColor": "#FAFFF7"}}/> */}
        <Background color="#000"/>
        <Controls showInteractive={false} />
        <SuggestNodeWrapper>
          おすすめノード：{suggestNode? suggestNode.data.label: "なし"}
        </SuggestNodeWrapper>
        <Panel position="top-left" className="header">
          AI Study Map
        </Panel>
      </ReactFlow>
    </div>
  );
}

export default Flow;