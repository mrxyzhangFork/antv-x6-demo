/*
 * X6 拖拽学习
 * Author : SPY
 * Email : 996251389@qq.com
 * Created: 2021-05-30
 */

import React, { useEffect, useRef } from 'react';
import { Graph, Dom, Addon } from '@antv/x6';
import styles from './index.less';

const { Dnd } = Addon;

const X6AddonDnd = () => {
  const graphRef = useRef();
  const dndRef = useRef();

  useEffect(() => {
    const graph = new Graph({
      container: document.getElementById('app'),
      // width:'100%',
      height: 500,
      grid: true,
      history: true, // 撤销/重做，默认禁用
      snapline: {
        // 对齐线
        enabled: true,
        sharp: true,
      },
      // scroller: {
      //   // Scroller 使画布具备滚动、平移、居中、缩放等能力
      //   enabled: true,
      //   pageVisible: false,
      //   pageBreak: false,
      //   pannable: true,
      // },
      mousewheel: {
        // 鼠标滚轮的默认行为是滚动页面，启用 Scroller 后用于滚动画布
        enabled: true,
        modifiers: ['ctrl', 'meta'],
      },
      selecting: {
        enabled: true,
        // className: styles.mySelecting,
        multiple: true,
        rubberband: true,
        movable: true,
        showNodeSelectionBox: true,
      },
    });

    const source = graph.addNode({
      x: 130,
      y: 30,
      width: 100,
      height: 40,
      attrs: {
        label: {
          text: 'Hello',
          fill: '#6a6c8a',
        },
        body: {
          stroke: '#31d0c6',
          strokeWidth: 2,
        },
      },
    });

    const target = graph.addNode({
      x: 180,
      y: 160,
      width: 100,
      height: 40,
      attrs: {
        label: {
          text: 'World',
          fill: '#6a6c8a',
        },
        body: {
          stroke: '#31d0c6',
          strokeWidth: 2,
        },
      },
    });

    graph.addEdge({ source, target });
    graph.centerContent(); // 将画布内容中心与视口中心对齐
    const dnd = new Dnd({
      target: graph,
      scaled: false,
      animation: true,
      // getDragNode(node) {
      //   // 这里返回一个新的节点作为拖拽节点
      //   return graph.createNode({
      //     width: 100,
      //     height: 100,
      //     shape: 'rect',
      //     attrs: {
      //       body: {
      //         fill: '#ccc'
      //       }
      //     }
      //   })
      // },
      // getDropNode(node) {
      //   const { width, height } = node.size()
      //   // 返回一个新的节点作为实际放置到画布上的节点
      //   return node.clone().size(width * 3, height * 3)
      // },
      validateNode(droppingNode, options) {
        console.log('droppingNode', droppingNode);
        window.droppingNode = droppingNode;
        return droppingNode.shape === 'html'
          ? new Promise((resolve) => {
              const { draggingNode, draggingGraph } = options;
              const view = draggingGraph.findView(draggingNode);
              const contentElem = view.findOne('foreignObject > body > div');
              Dom.addClass(contentElem, 'validating');
              setTimeout(() => {
                Dom.removeClass(contentElem, 'validating');
                resolve(true);
              }, 3000);
            })
          : true;
      },
    });

    graph.on('node:selected', ({ cell, options }) => {
      console.log('cell', cell);
      console.log('options', options);
      console.log(graph.isSelected(cell));
    });

    graphRef.current = graph;
    dndRef.current = dnd;
  }, []);

  console.log(graphRef, 'graphRef');
  console.log(dndRef, 'dndRef');

  const startDrag = (e) => {
    const target = e.currentTarget;
    const type = target.getAttribute('data-type');
    const node =
      type === 'rect'
        ? graphRef.current.createNode({
            width: 100,
            height: 40,
            attrs: {
              label: {
                text: 'Rect',
                fill: '#6a6c8a',
              },
              body: {
                stroke: '#31d0c6',
                strokeWidth: 2,
              },
            },
          })
        : graphRef.current.createNode({
            width: 60,
            height: 60,
            shape: 'html',
            // html: () => {
            //   const wrap = document.createElement('div');
            //   wrap.style.width = '100%';
            //   wrap.style.height = '100%';
            //   wrap.style.display = 'flex';
            //   wrap.style.alignItems = 'center';
            //   wrap.style.justifyContent = 'center';
            //   wrap.style.border = '2px solid rgb(49, 208, 198)';
            //   wrap.style.background = '#fff';
            //   wrap.style.borderRadius = '100%';
            //   wrap.innerText = 'Circle';
            //   console.log('wrap',wrap);
            //   return wrap;
            // },
            data: {
              time: new Date().toString(),
            },
            html: {
              render(node) {
                const data = node.getData();
                return `<div style="color:#F00; font-weight:bold">
                    <span>${data.time}</span>
                  </div>`;
              },
              shouldComponentUpdate(node) {
                // 控制节点重新渲染
                return node.hasChanged('data');
              },
            },
          });

    dndRef.current.start(node, e.nativeEvent);
  };

  return (
    <div className={styles.app}>
      <div className={styles.dnd_wrap}>
        <div
          data-type="rect"
          className={styles.dnd_rect}
          onMouseDown={startDrag}
        >
          Rect
        </div>
        <div
          data-type="circle"
          className={styles.dnd_circle}
          onMouseDown={startDrag}
        >
          Circle
        </div>
      </div>

      <div className={styles.app_content} id="app" />
    </div>
  );
};
export default X6AddonDnd;
