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
import { useCallback, useEffect } from 'react';
import GaugeBar from '../components/GaugeBar';

const SuggestNodeWrapper = styled.div`
  font-size: 20px;
  color: #17594A;
  position: absolute;
  top: 6%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 1000;
  pointer-events: none;
  background-size: contain;
  background-repeat: no-repeat;
  background-image: ${(props) => props.textLength && props.textLength > 7 ? "url(suggestion/signboard-large.png)": "url(suggestion/signboard.png)"};
  width: 340px;
  height: 100px;
`;

const SuggestNodeTextWrapper = styled.p`
  display: flex;
  justify-content: center;
`

const SuggestNodeText1 = styled.p`
  position: relative;
  color: #FAFFF7;
  float: left;
  min-width: 100px;
  margin-left: 10px;
`

const SuggestNodeText2 = styled.p`
  position: relative;
  color: #17594A;
  float: left;
  font-size: 30px;
  margin-top: 20px;
`

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
  const{ suggestNode, setSuggestNode, themeName, allNodes, clearedNodes } = useStore(
    state => ({
      suggestNode: state.suggestNode,
      setSuggestNode: state.setSuggestNode,
      themeName: state.themeName,
      allNodes: state.allNodes,
      clearedNodes: state.clearedNodes,
    })
  );

  useEffect(() => {
    setSuggestNode();
    console.log("suggestNode:", suggestNode);

    // ページから離れる場合にアラートを出す（戻るボタンは機能しない）
    const handleBeforeUnload = (e) => {
      e.preventDefault();
      e.returnValue = "";
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [])

const blockBrowserBack = useCallback(() => {
    window.history.go(1)
}, [])

useEffect(() => {
    // 直前の履歴に現在のページを追加
    window.history.pushState(null, '', window.location.href)

    // 直前の履歴と現在のページのループ
    window.addEventListener('popstate', blockBrowserBack)
    return () => {
        window.removeEventListener('popstate', blockBrowserBack)
    }
}, [blockBrowserBack])

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
        minZoom={0.1}
      >
        <Background color="#000" style={{"backgroundColor": "#FAFFF7"}}/>
        {/* <Background color="#000"/> */}
        <Controls showInteractive={false} />
        <SuggestNodeWrapper>
          <SuggestNodeTextWrapper>
            <SuggestNodeText1>おすすめ：</SuggestNodeText1>
            <SuggestNodeText2 textLength={() =>
              suggestNode ? suggestNode.data.label.length : 2
            }>
            {suggestNode ? suggestNode.data.label: "なし"}</SuggestNodeText2>
          </SuggestNodeTextWrapper>
        </SuggestNodeWrapper>
        <GaugeBar ClearNodes={(clearedNodes)} AllNodes={(allNodes)} theme={themeName} />
        <Panel position="top-left" className="header">
          AI Study Map
        </Panel>
      </ReactFlow>
    </div>
  );
}

export default Flow;