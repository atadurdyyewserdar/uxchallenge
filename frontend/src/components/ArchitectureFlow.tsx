import ReactFlow, { 
  type Node, 
  type Edge,
  Background,
  Controls,
  useNodesState,
  useEdgesState,
} from 'reactflow';
import 'reactflow/dist/style.css';

interface ArchitectureFlowProps {
  title: string;
  description?: string;
  nodes: Node[];
  edges: Edge[];
  height?: string;
}

export function ArchitectureFlow({ 
  title, 
  description,
  nodes, 
  edges, 
  height = 'h-96' 
}: ArchitectureFlowProps) {
  const [flowNodes, , onNodesChange] = useNodesState(nodes);
  const [flowEdges, , onEdgesChange] = useEdgesState(
    edges.map(edge => ({
      ...edge,
      labelStyle: {
        ...edge.labelStyle,
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        color: '#3b3b3b',
        padding: '4px 8px',
        borderRadius: '4px',
        fontSize: '10px',
        fontWeight: '600',
      },
    }))
  );

  return (
    <div className="flex flex-col gap-4">
      <div>
        <h4 className="text-sm font-semibold text-black dark:text-white/90">{title}</h4>
        {description && <p className="text-xs text-black/60 dark:text-white/60 mt-1">{description}</p>}
      </div>
      <div className={`${height} bg-white dark:bg-residential-100 rounded-lg border border-residential-20 overflow-hidden shadow-2xl`}>
        <ReactFlow
          nodes={flowNodes}
          edges={flowEdges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          fitView
          attributionPosition="bottom-left"
          maxZoom={2}
          minZoom={0.5}
        >
          <Background 
            color="#d1d5db" 
            gap={25} 
            size={1.5}
            style={{ backgroundColor: 'transparent' }}
          />
          <Controls 
            style={{ 
              position: 'absolute', 
              bottom: '12px', 
              left: '12px',
              backgroundColor: 'rgba(255, 255, 255, 0.95)',
              border: '1px solid rgba(0, 0, 0, 0.1)',
              borderRadius: '8px',
              boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
            }} 
          />
        </ReactFlow>
      </div>
    </div>
  );
}
