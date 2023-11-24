import {
    applyNodeChanges,
    applyEdgeChanges,
  } from 'reactflow';
  import { nanoid } from 'nanoid/non-secure';
  import { createWithEqualityFn } from 'zustand/traditional'

  const API_HOST_CREATENEWNODE = 'http://localhost:8000/api/save/create_newnode';
  
  const useStore = createWithEqualityFn((set, get) => ({
  // // 初回はfirstSetMapIdを通してマップを読み込む。(必要性を考慮中)
  // // setLoadedMapDataによってmapIdが設定される (各コンポーネントはmapIdを読み込む)
  //   firstSetMapId: 1, //本来は初期値null 
  //   setFirstSetMapId: (firstSetMapId) => set({ firstSetMapId: firstSetMapId }),

    themeName: "", // setLoadedMapDataで設定
    mapId: null, // setLoadedMapDataで設定
    firstNodes: [], //setFirstLoadMapで設定
    nodes: [], //setLoadedMapDataで設定
    //[
    //   {
    //     id: 'root',
    //     type: 'mindmap',
    //     data: { label: 'Python' },
    //     position: { x: 0, y: 0 },
    //     dragHandle: '.dragHandle',
    //     idd: 1,
    //   },
    //   {
    //     id: '1',
    //     type: 'mindmap',
    //     data: { label: '基本概念' },
    //     position: { x: 200, y: -70 },
    //     dragHandle: '.dragHandle',
    //     idd: 2,
    //   },
    //   {
    //     id: '2',
    //     type: 'mindmap',
    //     data: { label: '関数とモジュール' },
    //     position: { x: 200, y: 100 },
    //     dragHandle: '.dragHandle',
    //     idd: 2,
    //   },
    //   {
    //     id: '3',
    //     type: 'mindmap',
    //     data: { label: 'クラスとオブジェクト指向プログラミング (OOP)' },
    //     position: { x: -200, y: -70 },
    //     dragHandle: '.dragHandle',
    //     idd: 2,
    //   },
    //   // {
    //   //   id: '4',
    //   //   type: 'mindmap',
    //   //   data: { label: 'クラスとオブジェクト' },
    //   //   position: { x: -200, y: 100 },
    //   //   dragHandle: '.dragHandle',
    //   //   idd: 2,
    //   // },
    // ],
    edges: [], //setLoadedMapDataで設定
    //[
    //   {
    //     id: nanoid(),
    //     source: "root",
    //     target: "1",
    //   },
    //   {
    //     id: nanoid(),
    //     source: "root",
    //     target: "2",
    //   },
    //   {
    //     id: nanoid(),
    //     source: "root",
    //     target: "3",
    //   },
    //   // {
    //   //   id: nanoid(),
    //   //   source: "root",
    //   //   target: "4",
    //   // },
    // ],
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
    updateNodeIsCorrect: (id) => {
      set({
        nodes: get().nodes.map((node) => {
          if (node.id === id) {
            // it's important to create a new object here, to inform React Flow about the changes
            node.isCorrect = true;
          }
  
          return node;
        }),
      });
    },
    addChildNode: (parentNode, position, nodeName) => {
      const newNodeId = nanoid();
      const newNode = {
        id: newNodeId,
        type: 'mindmap',
        data: { label: nodeName },
        position,
        dragHandle: '.dragHandle',
        parentNode: parentNode.id,
        idd: parentNode.idd + 1,
        isCorrect: false,
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

      //newNodeのidをtreeに追加
      const searchNode = (tree, parentNodeId, childNodeId) => {
        if (tree.id !== null && tree.id === parentNodeId) {
          for (let child of tree.children) {
            if (child.name === nodeName) {
              child.id = childNodeId;
              return true; // Return true when the task is finished
            }
          }
        } else {
          for (let child2 of tree.children) {
            const result = searchNode(child2, parentNodeId, childNodeId);
            if (result) {
              return true; // Return true when the task is finished
            }
          }
        }
        return false;
      }

      const tree = get().tree;
      const dictTree = JSON.parse(tree)
      const taskFinished = searchNode(dictTree, parentNode.id, newNodeId);
      if (taskFinished) {
        set({ tree: JSON.stringify(dictTree) });
      }
      
      // DBに新しいノードを追加
      fetch(API_HOST_CREATENEWNODE, {
        method: 'POST',
        body: JSON.stringify({
          "map_id": get().mapId,
          "node_id": newNode.id,
          "title": nodeName,
          "x_coordinate": position.x,
          "y_coordinate": position.y,
          "idd": newNode.idd,
          "edge_id": newEdge.id,
          "parent_node": newEdge.source,
          "child_node": newEdge.target,
        }),
        headers: {
          'Content-Type': 'application/json'
        }}).then((response) => console.log('NEW NODE DATA SENDED'))
      
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
    setQuestionTitle: (title) => set({ nodeTitle: title }),
  
    // 問題の内容を設定
    question_phrase: '',
    question_a: '',
    question_b: '',
    question_c: '',
    question_d: '',
    correctAnswer: '',
    setQuestion: (question_phrase, question_a, question_b, question_c, question_d, correctAnswer) => set({ question_phrase: question_phrase, question_a: question_a, question_b: question_b, question_c: question_c, question_d: question_d, correctAnswer: correctAnswer }),
    


    tree: null, // setLoadedMapDataで設定 
    //{
    //   "name": "Python",
    //   "children": [
    //     {
    //       "name": "基本概念",
    //       "children": [
    //         {
    //           "name": "データ型と変数",
    //           "children": [
    //             {
    //               "name": "数値型",
    //               "children": [
    //                 {
    //                   "name": "整数",
    //                   "children": [
    //                     {
    //                       "name": "算術演算",
    //                       "children": []
    //                     },
    //                     {
    //                       "name": "整数の範囲",
    //                       "children": []
    //                     }
    //                   ]
    //                 },
    //                 {
    //                   "name": "浮動小数点数",
    //                   "children": [
    //                     {
    //                       "name": "精度",
    //                       "children": []
    //                     },
    //                     {
    //                       "name": "四則演算",
    //                       "children": []
    //                     }
    //                   ]
    //                 }
    //               ]
    //             },
    //             {
    //               "name": "文字列",
    //               "children": [
    //                 {
    //                   "name": "エスケープシーケンス",
    //                   "children": []
    //                 },
    //                 {
    //                   "name": "文字列メソッド",
    //                   "children": []
    //                 }
    //               ]
    //             }
    //           ]
    //         },
    //         {
    //           "name": "制御構造",
    //           "children": [
    //             {
    //               "name": "条件分岐",
    //               "children": [
    //                 {
    //                   "name": "if文",
    //                   "children": [
    //                     {
    //                       "name": "比較演算子",
    //                       "children": []
    //                     },
    //                     {
    //                       "name": "論理演算子",
    //                       "children": []
    //                     }
    //                   ]
    //                 },
    //                 {
    //                   "name": "switch-case代替",
    //                   "children": [
    //                     {
    //                       "name": "辞書による代替",
    //                       "children": []
    //                     },
    //                     {
    //                       "name": "if-elif-elseによる代替",
    //                       "children": []
    //                     }
    //                   ]
    //                 }
    //               ]
    //             },
    //             {
    //               "name": "ループ",
    //               "children": [
    //                 {
    //                   "name": "forループ",
    //                   "children": [
    //                     {
    //                       "name": "range関数",
    //                       "children": []
    //                     },
    //                     {
    //                       "name": "enumerate関数",
    //                       "children": []
    //                     }
    //                   ]
    //                 },
    //                 {
    //                   "name": "whileループ",
    //                   "children": [
    //                     {
    //                       "name": "条件式",
    //                       "children": []
    //                     },
    //                     {
    //                       "name": "breakとcontinue",
    //                       "children": []
    //                     }
    //                   ]
    //                 }
    //               ]
    //             }
    //           ]
    //         }
    //       ]
    //     },
    //     {
    //       "name": "関数とモジュール",
    //       "children": [
    //         {
    //           "name": "関数定義",
    //           "children": [
    //             {
    //               "name": "引数と戻り値",
    //               "children": [
    //                 {
    //                   "name": "デフォルト引数",
    //                   "children": []
    //                 },
    //                 {
    //                   "name": "可変長引数",
    //                   "children": []
    //                 }
    //               ]
    //             },
    //             {
    //               "name": "スコープと名前空間",
    //               "children": [
    //                 {
    //                   "name": "ローカルスコープ",
    //                   "children": []
    //                 },
    //                 {
    //                   "name": "グローバルスコープ",
    //                   "children": []
    //                 }
    //               ]
    //             }
    //           ]
    //         },
    //         {
    //           "name": "モジュールとパッケージ",
    //           "children": [
    //             {
    //               "name": "モジュールのインポート",
    //               "children": [
    //                 {
    //                   "name": "import文",
    //                   "children": []
    //                 },
    //                 {
    //                   "name": "from-import文",
    //                   "children": []
    //                 }
    //               ]
    //             },
    //             {
    //               "name": "パッケージ作成",
    //               "children": [
    //                 {
    //                   "name": "__init__.py",
    //                   "children": []
    //                 },
    //                 {
    //                   "name": "パッケージの構造",
    //                   "children": []
    //                 }
    //               ]
    //             }
    //           ]
    //         }
    //       ]
    //     },
    //     {
    //       "name": "クラスとオブジェクト指向プログラミング (OOP)",
    //       "children": [
    //         {
    //           "name": "クラス定義",
    //           "children": [
    //             {
    //               "name": "インスタンスメソッドと属性",
    //               "children": [
    //                 {
    //                   "name": "コンストラクタ",
    //                   "children": []
    //                 },
    //                 {
    //                   "name": "デストラクタ",
    //                   "children": []
    //                 }
    //               ]
    //             },
    //             {
    //               "name": "クラス変数とインスタンス変数",
    //               "children": [
    //                 {
    //                   "name": "クラス変数",
    //                   "children": []
    //                 },
    //                 {
    //                   "name": "インスタンス変数",
    //                   "children": []
    //                 }
    //               ]
    //             }
    //           ]
    //         },
    //         {
    //           "name": "継承とポリモーフィズム",
    //           "children": [
    //             {
    //               "name": "基底クラスと派生クラス",
    //               "children": [
    //                 {
    //                   "name": "継承",
    //                   "children": []
    //                 },
    //                 {
    //                   "name": "オーバーライド",
    //                   "children": []
    //                 }
    //               ]
    //             },
    //             {
    //               "name": "抽象クラスとインターフェース",
    //               "children": [
    //                 {
    //                   "name": "抽象クラス",
    //                   "children": []
    //                 },
    //                 {
    //                   "name": "インターフェース",
    //                   "children": []
    //                 }
    //               ]
    //             }
    //           ]
    //         }
    //       ]
    //     }
    //   ]
    // },
    setLoadedMapData(tree, mapId, themeName, nodes, edges) {
      set({ tree: tree, mapId: mapId, themeName: themeName, nodes: nodes, edges: edges })
    },
    
    setFirstLoadedMap(node) {
      set({ firstNodes: node })
      console.log("FirstNODES", get().firstNodes);
    },

    appendFirstNodes: (nodeList) => {
      const nodesLocal = get().nodes;
      for (let node of nodeList) {
        nodesLocal.push(node);
      }
      set({ nodes: nodesLocal });
    }
  }));
  
  export default useStore;
  