import {
    applyNodeChanges,
    applyEdgeChanges,
  } from 'reactflow';
  import { nanoid } from 'nanoid/non-secure';
  import { createWithEqualityFn } from 'zustand/traditional'
  
  const useStore = createWithEqualityFn((set, get) => ({
    nodes: [
      {
        id: 'root',
        type: 'mindmap',
        data: { label: 'Python' },
        position: { x: 0, y: 0 },
        dragHandle: '.dragHandle',
        idd: 1,
      },
      {
        id: '1',
        type: 'mindmap',
        data: { label: 'データ型' },
        position: { x: 200, y: -70 },
        dragHandle: '.dragHandle',
        idd: 2,
      },
      {
        id: '2',
        type: 'mindmap',
        data: { label: '演算子と制御フロー' },
        position: { x: 200, y: 100 },
        dragHandle: '.dragHandle',
        idd: 2,
      },
      {
        id: '3',
        type: 'mindmap',
        data: { label: '関数とモジュール' },
        position: { x: -200, y: -70 },
        dragHandle: '.dragHandle',
        idd: 2,
      },
      {
        id: '4',
        type: 'mindmap',
        data: { label: 'クラスとオブジェクト' },
        position: { x: -200, y: 100 },
        dragHandle: '.dragHandle',
        idd: 2,
      },
    ],
    edges: [
      {
        id: nanoid(),
        source: "root",
        target: "1",
      },
      {
        id: nanoid(),
        source: "root",
        target: "2",
      },
      {
        id: nanoid(),
        source: "root",
        target: "3",
      },
      {
        id: nanoid(),
        source: "root",
        target: "4",
      },
    ],
    onNodesChange: (changes) => {
      set({
        nodes: applyNodeChanges(changes, get().nodes),
      });
    },
    onEdgesChange: (changes) => {
      set({
        edges: applyEdgeChanges(changes, get().edges),
      });
    },
    updateNodeLabel: (nodeId, label) => {
      set({
        nodes: get().nodes.map((node) => {
          if (node.id === nodeId) {
            // it's important to create a new object here, to inform React Flow about the changes
            node.data = { ...node.data, label };
          }
  
          return node;
        }),
      });
    },
    addChildNode: (parentNode, position, nodeName) => {
      const newNode = {
        id: nanoid(),
        type: 'mindmap',
        data: { label: nodeName },
        position,
        dragHandle: '.dragHandle',
        parentNode: parentNode.id,
        idd: parentNode.idd + 1
      };
  
      const newEdge = {
        id: nanoid(),
        source: parentNode.id,
        target: newNode.id,
      };
  
      set({
        nodes: [...get().nodes, newNode],
        edges: [...get().edges, newEdge],
      });
    },
    
    // 現在選択されているノードのID
    selectedNodeId: null,

    // 選択されたノードのIDを設定
    setSelectedNodeId: (id) => set({ selectedNodeId: id }),

    flipped: false,
    setFlipped: () => set({ flipped: !get().flipped}),

    getNodeFlippedStatus: (nodeId) => {
      const node = get().nodes.find(n => n.id === nodeId);
      return node ? node.flipped : false;
    },
    
    toggleNodeFlipped: (nodeId) => {
      set({
        nodes: get().nodes.map((node) => {
          if (node.id === nodeId) {
            return { ...node, flipped: !node.flipped };
          }
          return node;
        }),
      });
    },
    // QuestionMenuの開閉
    questionMenuIsOpen: false,
    setQuestionMenu: (boolean) => set({ questionMenuIsOpen: boolean }),
    
    // ノードのタイトルと内容を設定
    nodeTitle: '',
    nodeContent: '',
    setQuestionDetail: (title, content) => set({ nodeTitle: title, nodeContent: content }),
  }));
  
  export default useStore;
  