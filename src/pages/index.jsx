/*
 * X6 流程编辑器
 * Author : SPY
 * Email : 996251389@qq.com
 * Created: 2021-05-26
 */

import React, { useEffect, useRef } from 'react';
import { Graph, Shape } from '@antv/x6';

class MyShape extends Shape.Rect {
  getInPorts() {
    return this.getPortsByGroup('in');
  }

  getOutPorts() {
    return this.getPortsByGroup('out');
  }

  getUsedInPorts(graph) {
    const incomingEdges = graph.getIncomingEdges(this) || [];
    return incomingEdges.map((edge) => {
      const portId = edge.getTargetPortId();
      return this.getPort(portId);
    });
  }

  getNewInPorts(length) {
    return Array.from(
      {
        length,
      },
      () => {
        return {
          group: 'in',
        };
      },
    );
  }

  updateInPorts(graph) {
    const minNumberOfPorts = 2;
    const ports = this.getInPorts();
    const usedPorts = this.getUsedInPorts(graph);
    const newPorts = this.getNewInPorts(
      Math.max(minNumberOfPorts - usedPorts.length, 1),
    );

    if (
      ports.length === minNumberOfPorts &&
      ports.length - usedPorts.length > 0
    ) {
      // noop
    } else if (ports.length === usedPorts.length) {
      this.addPorts(newPorts);
    } else if (ports.length + 1 > usedPorts.length) {
      this.prop(
        ['ports', 'items'],
        this.getOutPorts().concat(usedPorts).concat(newPorts),
        {
          rewrite: true,
        },
      );
    }

    return this;
  }
}

MyShape.config({
  attrs: {
    root: {
      magnet: false,
    },
    body: {
      fill: '#f5f5f5',
      stroke: '#d9d9d9',
      strokeWidth: 1,
    },
  },
  ports: {
    items: [
      {
        group: 'out',
      },
    ],
    groups: {
      in: {
        position: {
          name: 'top',
        },
        attrs: {
          portBody: {
            magnet: 'passive',
            r: 6,
            stroke: '#ffa940',
            fill: '#fff',
            strokeWidth: 2,
          },
        },
      },
      out: {
        position: {
          name: 'bottom',
        },
        attrs: {
          portBody: {
            magnet: true,
            r: 6,
            fill: '#fff',
            stroke: '#3199FF',
            strokeWidth: 2,
          },
        },
      },
    },
  },
  portMarkup: [
    {
      tagName: 'circle',
      selector: 'portBody',
    },
  ],
});

// 高亮
const magnetAvailabilityHighlighter = {
  name: 'stroke',
  args: {
    attrs: {
      fill: '#fff',
      stroke: '#47C769',
    },
  },
};

const X6Editor = () => {
  const ref = useRef();

  useEffect(() => {
    const graph = new Graph({
      grid: true,
      container: document.getElementById('container'),
      height: 800,
      width: 800,
      highlighting: {
        magnetAvailable: magnetAvailabilityHighlighter,
        magnetAdsorbed: {
          name: 'stroke',
          args: {
            attrs: {
              fill: '#fff',
              stroke: '#31d0c6',
            },
          },
        },
      },
      connecting: {
        snap: false,
        allowBlank: false,
        allowLoop: false,
        highlight: true,
        allowMulti: 'withPort',
        connector: 'rounded',
        connectionPoint: 'boundary',
        router: {
          name: 'er',
          args: {
            direction: 'V',
          },
        },
        createEdge() {
          return new Shape.Edge({
            attrs: {
              line: {
                stroke: '#a0a0a0',
                strokeWidth: 1,
                targetMarker: {
                  name: 'classic',
                  size: 7,
                },
              },
            },
          });
        },
        validateConnection({ sourceView, targetView, targetMagnet }) {
          if (!targetMagnet) {
            // 如果没有目标连接桩，连接边清空
            return false;
          }

          if (targetMagnet.getAttribute('port-group') !== 'in') {
            // 如果目标连接桩的分组不等于in,连接边清空
            return false;
          }

          if (targetView) {
            const node = targetView.cell;
            if (node instanceof MyShape) {
              // 如果目标连接桩已经有连接边，连接边清空
              const portId = targetMagnet.getAttribute('port');
              const usedInPorts = node.getUsedInPorts(graph);
              if (usedInPorts.find((port) => port && port.id === portId)) {
                return false;
              }
            }
          }

          return true;
        },
      },
    });

    graph.addNode(
      new MyShape().resize(120, 40).position(200, 50).updateInPorts(graph),
    );

    graph.addNode(
      new MyShape().resize(120, 40).position(400, 50).updateInPorts(graph),
    );

    graph.addNode(
      new MyShape().resize(120, 40).position(300, 250).updateInPorts(graph),
    );

    function update(view) {
      const cell = view.cell;
      if (cell instanceof MyShape) {
        cell.getInPorts().forEach((port) => {
          const portNode = view.findPortElem(port.id, 'portBody');
          view.unhighlight(portNode, {
            highlighter: magnetAvailabilityHighlighter,
          });
        });
        cell.updateInPorts(graph);
      }
    }

    graph.on('edge:connected', ({ previousView, currentView, edge }) => {
      if (previousView) {
        update(previousView);
      }
      if (currentView) {
        const cell = currentView.cell;
        window.cell = cell;
        update(currentView);
      }
    });

    graph.on('edge:removed', ({ edge, options }) => {
      if (!options.ui) {
        return;
      }

      const target = edge.getTargetCell();
      if (target instanceof MyShape) {
        target.updateInPorts(graph);
      }
    });

    graph.on('edge:mouseenter', ({ edge }) => {
      edge.addTools([
        'source-arrowhead',
        'target-arrowhead',
        {
          name: 'button-remove',
          args: {
            distance: -30,
          },
        },
      ]);
    });

    graph.on('edge:mouseleave', ({ edge }) => {
      edge.removeTools();
    });

    ref.current = graph;
  }, []);
  console.log('ref', ref);
  return <div id="container">44</div>;
};
export default X6Editor;
