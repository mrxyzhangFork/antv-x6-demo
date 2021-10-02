import React, { useEffect, useState } from 'react';
import ConfigGrid from './ConfigGrid';
import ConfigNode from './ConfigNode';
import ConfigEdge from './ConfigEdge';
import FlowGraph from '@/pages/X6/Graph';
import { useGridAttr } from '@/models/global';
import styles from './index.less';

export default function () {
  const [type, setType] = useState('GRID'); // 默认为画布
  const [id, setId] = useState('');
  const { gridAttrs, setGridAttr } = useGridAttr();

  useEffect(() => {
    const { graph } = FlowGraph;
    graph.on('blank:click', () => {
      setType('GRID');
    });
    graph.on('cell:click', ({ cell }) => {
      setType(cell.isNode() ? 'NODE' : 'EDGE');
      setId(cell.id);
    });
  }, []);

  return (
    <div className={styles.config}>
      {type === 'GRID' && (
        <ConfigGrid attrs={gridAttrs} setAttr={setGridAttr} />
      )}
      {type === 'NODE' && <ConfigNode id={id} />}
      {type === 'EDGE' && <ConfigEdge id={id} />}
    </div>
  );
}
