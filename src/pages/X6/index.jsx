import React, { useState, useEffect, useRef } from 'react';
import FlowGraph from './Graph';
import ToolBar from './components/ToolBar';
import ConfigPanel from './components/ConfigPanel';
import './global.less';
import styles from './index.less';

export default function () {
  const [isReady, setIsReady] = useState(false);

  let graphRef = useRef();

  const getContainerSize = () => {
    return {
      width: document.body.offsetWidth - 581,
      height: document.body.offsetHeight - 87,
    };
  };

  useEffect(() => {
    const graph = FlowGraph.init();
    setIsReady(true);

    const resizeFn = () => {
      const { width, height } = getContainerSize();
      graph.resize(width, height);
    };
    resizeFn();

    graphRef.current = graph;

    window.addEventListener('resize', resizeFn);
    return () => {
      window.removeEventListener('resize', resizeFn);
    };
  }, []);

  return (
    <div className={styles.wrap}>
      {/* <button onClick={() => console.log(graphRef.current.toJSON())}>
        导出
      </button> */}
      <div className={styles.content}>
        <div id="stencil" className={styles.sider} />
        <div className={styles.panel}>
          <div className={styles.toolbar}>{isReady && <ToolBar />}</div>
          <div id="container" className="x6-graph" />
        </div>
        <div className={styles.config}>{isReady && <ConfigPanel />}</div>
      </div>
    </div>
  );
}
