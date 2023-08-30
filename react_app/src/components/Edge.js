import { BaseEdge, getStraightPath } from 'reactflow';

function MindMapEdge(props) {
  const { sourceX, sourceY, targetX, targetY } = props;

  const [edgePath] = getStraightPath({
    sourceX,
    sourceY: sourceY + 18,
    targetX,
    targetY,
  });

  return <BaseEdge path={edgePath} {...props} />;
}

export default MindMapEdge;
