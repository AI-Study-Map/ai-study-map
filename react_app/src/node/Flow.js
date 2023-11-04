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

import { useState } from 'react';
import Select from 'react-select';
import styled from 'styled-components';
import {Selecter} from './NodeTreeMake.jsx';

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
const options = [
  { value: 'default', label: 'テーマを選択してください' },
  // { value: 1, label: 'Python' },
  { value: 2, label: '難易度：低' },
  { value: 3, label: '難易度：中' },
  { value: 4, label: '難易度：高' },
];

const Flow = () =>  {
  const { nodes, edges, onNodesChange, onEdgesChange } = useStore(
    selector,
    shallow,
  );
  const{ questionMenuIsOpen, setQuestionMenu } = useStore(
    state => ({
      questionMenuIsOpen: state.questionMenuIsOpen,
      setQuestionMenu: state.setQuestionMenu,
    })
  );
  const [selectedValue, setSelectedValue] = useState(options[0]);

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
        <div
            style={{
              fontSize: "35px",
              position: 'absolute',
              top: '6.6%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              zIndex: 1000,
              pointerEvents: 'none',
            }}
        >
          <div
              style={{
                border: '2px solid #999',
                padding: '30px 105px',
                borderRadius: '10px',
              }}
          >
            {}を探し出せ！
          <Selecter>
          <Select
          options={options}
          defaultValue={selectedValue}
          onChange={(value) => { setSelectedValue(value); }}
          />
          </Selecter>
          </div>
        </div>
        <Controls showInteractive={false} />
        
        <Panel position="top-left" className="header">
          AI Study Map
        </Panel>
      </ReactFlow>
    </div>
  );
}

export default Flow;