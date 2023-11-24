import useStore from './store';

const useAddNode = () => {
  const { nodes, addChildNode, selectedNodeId } = useStore(state => ({
    nodes: state.nodes,
    addChildNode: state.addChildNode,
    selectedNodeId: state.selectedNodeId,
  }));

  const nodeTemplate = (node, name, xnum, ynum) => {
    const child1NodePosition = { x: (node.position.x + xnum / node.idd), y: (node.position.y + ynum / node.idd) };
    addChildNode(node, child1NodePosition, name);
  }

  const addNewNode = (nodeNameList, num) => {
    const parentNode = nodes.find(node => node.id === selectedNodeId) || nodes.find(node => node.idd === 1);
    console.log("parentNode:", parentNode)
    if (parentNode) {
      switch (num) {
        case 1:
          nodeTemplate(parentNode, nodeNameList[0], 200, 100)
          break
        case 2:
          nodeTemplate(parentNode, nodeNameList[0], 200, 100)
          nodeTemplate(parentNode, nodeNameList[1], 200, -70)
          break
        case 3:
          nodeTemplate(parentNode, nodeNameList[0], 200, 100)
          nodeTemplate(parentNode, nodeNameList[1], 200, -70)
          nodeTemplate(parentNode, nodeNameList[2], -150, 100)
          break
        case 4:
          nodeTemplate(parentNode, nodeNameList[0], 200, 100)
          nodeTemplate(parentNode, nodeNameList[1], 200, -70)
          nodeTemplate(parentNode, nodeNameList[2], -150, 100)
          nodeTemplate(parentNode, nodeNameList[3], -150, -70)
          break
        default:
          nodeTemplate(parentNode, nodeNameList[0], 200, 100)
          nodeTemplate(parentNode, nodeNameList[1], 200, -70)
      }
      // const child1NodePosition = { x: parentNode.position.x + 200 / parentNode.idd, y: parentNode.position.y + 100 / parentNode.idd };
      // addChildNode(parentNode, child1NodePosition, nodeName1);
      // const child2NodePosition = { x: parentNode.position.x + 200 / parentNode.idd, y: parentNode.position.y + -70 / parentNode.idd };
      // addChildNode(parentNode, child2NodePosition, nodeName2);
      // const child3NodePosition = { x: parentNode.position.x + -150 / parentNode.idd, y: parentNode.position.y + 100 / parentNode.idd };
      // addChildNode(parentNode, child3NodePosition, nodeName2);
      // const child4NodePosition = { x: parentNode.position.x + -150 / parentNode.idd, y: parentNode.position.y + -70 / parentNode.idd };
      // addChildNode(parentNode, child4NodePosition, nodeName2);
    } 
  };

  return addNewNode;
};

export default useAddNode;


// import { useCallback, useRef } from "react";
// import { useReactFlow, useStoreApi } from "reactflow";
// import useStore from "./store";
// import { shallow } from "zustand/shallow";

// const selector = (state) => ({
//     nodes: state.nodes,
//     edges: state.edges,
//     onNodesChange: state.onNodesChange,
//     onEdgesChange: state.onEdgesChange,
//     addChildNode: state.addChildNode,
//   });

// const useAddNode = () => {
//     const store = useStoreApi();
//     const { nodes, edges, onNodesChange, onEdgesChange, addChildNode } = useStore(
//         selector,
//         shallow
//       );
//     const { project } = useReactFlow();
//     const connectingNodeId = useRef(null);

//     const getChildNodePosition = (event, parentNode) => {
//         const { domNode } = store.getState();
    
//         if (
//           !domNode ||
//           // we need to check if these properites exist, because when a node is not initialized yet,
//           // it doesn't have a positionAbsolute nor a width or height
//           !parentNode?.positionAbsolute ||
//           !parentNode?.width ||
//           !parentNode?.height
//         ) {
//           return;
//         }
    
//         const { top, left } = domNode.getBoundingClientRect();
    
//         // we need to remove the wrapper bounds, in order to get the correct mouse position
//         const panePosition = project({
//           x: event.clientX - left,
//           y: event.clientY - top,
//         });
    
//         // we are calculating with positionAbsolute here because child nodes are positioned relative to their parent
//         return {
//           x: panePosition.x - parentNode.positionAbsolute.x + parentNode.width / 2,
//           y: panePosition.y - parentNode.positionAbsolute.y + parentNode.height / 2,
//         };
//       };

//     const onConnectEnd = useCallback(
//         (event) => {
//           const { nodeInternals } = store.getState();
//           const targetIsPane = (event.target).classList.contains(
//             'react-flow__pane'
//           );
//           const node = (event.target).closest('.react-flow__node');
    
//           if (node) {
//             node.querySelector('input')?.focus({ preventScroll: true });
//           } else if (targetIsPane && connectingNodeId.current) {
//             const parentNode = nodeInternals.get(connectingNodeId.current);
//             const childNodePosition = getChildNodePosition(event, parentNode);
    
//             if (parentNode && childNodePosition) {
//               addChildNode(parentNode, childNodePosition);
//             }
//           }
//         },
//         [getChildNodePosition]
//       );
// }

// export default useAddNode