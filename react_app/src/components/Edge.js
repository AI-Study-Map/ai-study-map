import { BaseEdge, getStraightPath } from 'reactflow';
import { getSimpleBezierPath } from 'reactflow'; //少し曲がるエッジ

function MindMapEdge(props) {
  const { sourceX, sourceY, targetX, targetY } = props;

  const [edgePath] = getSimpleBezierPath({
    sourceX,
    sourceY: sourceY + 18,
    targetX,
    targetY,
  });

  return <BaseEdge path={edgePath} {...props} />;
}

export default MindMapEdge;
