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

    themeName: "アジアの郷土料理", // setLoadedMapDataで設定
    mapId: 2, // setLoadedMapDataで設定
    nodes:  //setLoadedMapDataで設定
    [
      {
        id: 'root',
        type: 'mindmap',
        data: { label: 'アジアの郷土料理' },
        position: { x: 0, y: 0 },
        dragHandle: '.dragHandle',
        idd: 1,
      },
      {
        id: '1',
        type: 'mindmap',
        data: { label: '東アジア' },
        position: { x: 200, y: -70 },
        dragHandle: '.dragHandle',
        idd: 2,
      },
      {
        id: '2',
        type: 'mindmap',
        data: { label: '東南アジア' },
        position: { x: 200, y: 100 },
        dragHandle: '.dragHandle',
        idd: 2,
      },
      {
        id: '3',
        type: 'mindmap',
        data: { label: '南アジア' },
        position: { x: -200, y: -70 },
        dragHandle: '.dragHandle',
        idd: 2,
      },
      {
        id: '4',
        type: 'mindmap',
        data: { label: '中央アジア' },
        position: { x: -200, y: 100 },
        dragHandle: '.dragHandle',
        idd: 2,
      },
    ],
    edges:  //setLoadedMapDataで設定
    [
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
    updateNodeIsCorrect: (title) => {
      set({
        nodes: get().nodes.map((node) => {
          if (node.data.label === title) {
            // it's important to create a new object here, to inform React Flow about the changes
            node.isCorrect = true;
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
      
      // DBに新しいノードを追加
      // fetch(API_HOST_CREATENEWNODE, {
      //   method: 'POST',
      //   body: JSON.stringify({
      //     "map_id": get().mapId,
      //     "node_id": newNode.id,
      //     "title": nodeName,
      //     "x_coordinate": position.x,
      //     "y_coordinate": position.y,
      //     "idd": newNode.idd,
      //     "edge_id": newEdge.id,
      //     "parent_node": newEdge.source,
      //     "child_node": newEdge.target,
      //   }),
      //   headers: {
      //     'Content-Type': 'application/json'
      //   }}).then((response) => console.log('NEW NODE DATA SENDED'))
      
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
    


    tree: {
      "name": "アジアの郷土料理",
      "children": [
        {
          "name": "東アジア",
          "children": [
            {
              "name": "日本",
              "children": [
                {
                  "name": "魚料理",
                  "children": [
                    {
                      "name": "すし",
                      "children": [
                        { "name": "にぎり", "children": [{ "name": "コンプリート！", "children": [] }] },
                        { "name": "巻きずし", "children": [{ "name": "コンプリート！", "children": [] }] }
                      ]
                    },
                    {
                      "name": "刺身",
                      "children": [
                        { "name": "マグロ", "children": [{ "name": "コンプリート！", "children": [] }] },
                        { "name": "サーモン", "children": [{ "name": "コンプリート！", "children": [] }] }
                      ]
                    }
                  ]
                },
                {
                  "name": "日本の肉料理",
                  "children": [
                    {
                      "name": "焼肉",
                      "children": [
                        { "name": "牛肉", "children": [{ "name": "コンプリート！", "children": [] }] },
                        { "name": "豚肉", "children": [{ "name": "コンプリート！", "children": [] }] }
                      ]
                    },
                    {
                      "name": "しゃぶしゃぶ",
                      "children": [
                        { "name": "牛しゃぶ", "children": [{ "name": "コンプリート！", "children": [] }] },
                        { "name": "豚しゃぶ", "children": [{ "name": "コンプリート！", "children": [] }] }
                      ]
                    }
                  ]
                }
              ]
            },
            {
              "name": "中国",
              "children": [
                {
                  "name": "中国の炒め物",
                  "children": [
                    { "name": "麻婆豆腐", "children": [{ "name": "コンプリート！", "children": [] }] },
                    { "name": "回鍋肉", "children": [{ "name": "コンプリート！", "children": [] }] }
                  ]
                },
                {
                  "name": "鍋物",
                  "children": [
                    { "name": "火鍋", "children": [{ "name": "コンプリート！", "children": [] }] },
                    { "name": "蒸し物", "children": [{ "name": "コンプリート！", "children": [] }] }
                  ]
                }
              ]
            }
          ]
        },
        {
          "name": "南アジア",
          "children": [
            {
              "name": "インド",
              "children": [
                {
                  "name": "カレー",
                  "children": [
                    { "name": "チキンカレー", "children": [{ "name": "コンプリート！", "children": [] }] },
                    { "name": "野菜カレー", "children": [{ "name": "コンプリート！", "children": [] }] }
                  ]
                },
                {
                  "name": "パン",
                  "children": [
                    { "name": "ナン", "children": [{ "name": "コンプリート！", "children": [] }] },
                    { "name": "ロティ", "children": [{ "name": "コンプリート！", "children": [] }] }
                  ]
                }
              ]
            }
           
          ]
        },
        {
          "name": "東南アジア",
          "children": [
            {
              "name": "ベトナム",
              "children": [
                {
                  "name": "ベトナムの麺料理",
                  "children": [
                    { "name": "フォー", "children": [{ "name": "コンプリート！", "children": [] }] },
                    { "name": "ブンチャー", "children": [{ "name": "コンプリート！", "children": [] }] }
                  ]
                },
                {
                  "name": "ベトナムのライス",
                  "children": [
                    { "name": "ゴイクン", "children": [{ "name": "コンプリート！", "children": [] }] },
                    { "name": "コムタム", "children": [{ "name": "コンプリート！", "children": [] }] }
                  ]
                }
              ]
            },
            {
              "name": "インドネシア",
              "children": [
                {
                  "name": "インドネシアのライス",
                  "children": [
                    { "name": "ナシゴレン", "children": [{ "name": "コンプリート！", "children": [] }] },
                    { "name": "ナシパダン", "children": [{ "name": "コンプリート！", "children": [] }] }
                  ]
                },
                {
                  "name": "サテ",
                  "children": [
                    { "name": "サテアヤム", "children": [{ "name": "コンプリート！", "children": [] }] },
                    { "name": "サテクダン", "children": [{ "name": "コンプリート！", "children": [] }] }
                  ]
                }
              ]
            },
            {
              "name": "タイ",
              "children": [
                {
                  "name": "スープ",
                  "children": [
                    { "name": "トムヤムクン", "children": [{ "name": "コンプリート！", "children": [] }] },
                    { "name": "トムカーガイ", "children": [{ "name": "コンプリート！", "children": [] }] }
                  ]
                },
                {
                  "name": "タイの炒め物",
                  "children": [
                    { "name": "パッタイ", "children": [{ "name": "コンプリート！", "children": [] }] },
                    { "name": "ガパオライス", "children": [{ "name": "コンプリート！", "children": [] }] }
                  ]
                }
              ]
            }
          ]
        },
        {
          "name": "中央アジア",
          "children": [
            {
              "name": "ウズベキスタン",
              "children": [
                {
                  "name": "ウズベキスタンのライス",
                  "children": [
                    { "name": "パロフ", "children": [{ "name": "コンプリート！", "children": [] }] },
                    { "name": "サムサ", "children": [{ "name": "コンプリート！", "children": [] }] }
                  ]
                },
                {
                  "name": "ケバブ",
                  "children": [
                    { "name": "ラムケバブ", "children": [{ "name": "コンプリート！", "children": [] }] },
                    { "name": "鶏ケバブ", "children": [{ "name": "コンプリート！", "children": [] }] }
                  ]
                }
              ]
            },
            {
              "name": "カザフスタン",
              "children": [
                {
                  "name": "カザフスタンの肉料理",
                  "children": [
                    { "name": "バシュ", "children": [{ "name": "コンプリート！", "children": [] }] },
                    { "name": "シャシリク", "children": [{ "name": "コンプリート！", "children": [] }] }
                  ]
                },
                {
                  "name": "カザフスタンの鍋料理",
                  "children": [
                    { "name": "ビシュバルマク", "children": [{ "name": "コンプリート！", "children": [] }] },
                    { "name": "クイマク", "children": [{ "name": "コンプリート！", "children": [] }] }
                  ]
                }
              ]
            }
          ]
        }
      ]
    },
    setLoadedMapData(tree, mapId, themeName, nodes, edges) {
      set({ tree: tree, mapId: mapId, themeName: themeName, nodes: nodes, edges: edges })
    },

    valuea: null,
    setValuea: (value) => set({ valuea: value }),
  }));
  
  export default useStore;
  