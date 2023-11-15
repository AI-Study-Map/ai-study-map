import { BaseEdge, getStraightPath } from 'reactflow';
import { getSimpleBezierPath } from 'reactflow'; //少し曲がるエッジ
import useStore from '../node/store';

function MindMapEdge(props) {
  const { sourceX, sourceY, targetX, targetY, source } = props;
  const { nodes } = useStore(state => ({nodes: state.nodes}))

  // sourceからparentNodeのiddを取得
  const findNodeIsCorrect = (nodes, id) => {
    for (let node of nodes) {
      if (node.id === id) {
        return node.idd;
      }
    }
    return null;
  };

  // edgeの太さを設定
  const setStroke = (nodes, source) => {
    const strokeWidth = 20 - (findNodeIsCorrect(nodes, source)*4)
    if (strokeWidth < 2) {
      return 2
    }
    return strokeWidth
  }

  // edgeのstyle
  const style = {
    strokeWidth: setStroke(nodes, source),
    stroke: "rgb(110, 44, 0)",
  }

  const [edgePath] = getSimpleBezierPath({
    sourceX,
    sourceY: sourceY + 18,
    targetX,
    targetY,
  });

  return <BaseEdge path={edgePath} {...props} style={style}/>;
}

export default MindMapEdge;
