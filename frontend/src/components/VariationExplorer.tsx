import React from 'react';

interface VariationNode {
  move: string;
  eval?: string;
  comment?: string;
  children?: VariationNode[];
}

interface VariationExplorerProps {
  tree: VariationNode;
  onSelectMove: (moveSequence: string[]) => void;
}

export const VariationExplorer: React.FC<VariationExplorerProps> = ({
  tree,
  onSelectMove
}) => {
  const renderTree = (node: VariationNode, depth = 0, prefix: string[] = []): React.ReactNode => {
    const currentPath = [...prefix, node.move];
    
    return (
      <div key={currentPath.join('-')} className="flex flex-col gap-1">
        <div 
          onClick={() => onSelectMove(currentPath)}
          className={`flex items-center gap-2 cursor-pointer hover:bg-emerald-500/10 p-2 rounded-lg transition-all border border-transparent hover:border-emerald-500/20`}
          style={{ marginLeft: `${depth * 16}px` }}
        >
          {depth > 0 && <span className="text-slate-500 font-mono">├─</span>}
          <span className="font-mono font-bold text-emerald-400 text-sm bg-white/5 px-2 py-0.5 rounded">
            {node.move}
          </span>
          {node.eval && (
            <span className="text-xs font-mono text-amber-400 bg-amber-400/10 px-1.5 py-0.5 rounded">
              {node.eval}
            </span>
          )}
          {node.comment && (
            <span className="text-xs text-slate-400 truncate max-w-[200px]" title={node.comment}>
              {node.comment}
            </span>
          )}
        </div>
        
        {node.children && node.children.map(child => renderTree(child, depth + 1, currentPath))}
      </div>
    );
  };

  return (
    <div className="glass-panel p-6 rounded-2xl flex flex-col gap-4 w-full max-w-md text-slate-200">
      <div className="border-b border-white/10 pb-3">
        <span className="text-xs font-bold uppercase tracking-wider text-emerald-500">Variation Explorer</span>
        <h3 className="text-base font-bold text-white">Interactive Variation Trees</h3>
      </div>
      <div className="flex-1 overflow-y-auto max-h-[300px] flex flex-col gap-2 bg-[#0c0c14] p-4 rounded-xl border border-white/5 scrollbar-thin">
        {renderTree(tree)}
      </div>
    </div>
  );
};
export default VariationExplorer;
