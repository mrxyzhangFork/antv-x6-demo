import { Graph, Addon, FunctionExt, Shape, Vector } from '@antv/x6';
import { message } from 'antd';
import './shape';
import graphData from './data';

export default class FlowGraph {
  static graph;
  static stencil;

  static init() {
    this.graph = new Graph({
      container: document.getElementById('container'),
      width: 1000,
      height: 800,
      grid: {
        size: 10,
        visible: true,
        type: 'doubleMesh',
        args: [
          {
            color: '#cccccc',
            thickness: 1,
          },
          {
            color: '#5F95FF',
            thickness: 1,
            factor: 4,
          },
        ],
      },
      scroller: {
        enabled: true,
        pannable: true,
        pageVisible: false, // 是否分页
        pageBreak: false,
      },
      mousewheel: {
        enabled: true,
        modifiers: ['ctrl', 'meta'],
      },
      selecting: {
        enabled: true,
        // showNodeSelectionBox: true,
      },
      connecting: {
        anchor: 'center',
        connectionPoint: 'anchor',
        connector: 'rounded',
        createEdge() {
          return new Shape.Edge({
            attrs: {
              line: {
                strokeDasharray: '5 5',
                stroke: '#5F95FF',
                strokeWidth: 2,
                sourceMarker: {
                  name: 'diamond',
                  args: {
                    size: 6,
                  },
                },
                targetMarker: {
                  name: 'classic',
                  args: {
                    size: 14,
                  },
                },
                zIndex: 0,
              },
            },
          });
        },
        router: 'manhattan',
        allowBlank: false,
        highlight: true,
        snap: true,
        validateConnection({
          sourceView,
          targetView,
          sourceMagnet,
          targetMagnet,
        }) {
          if (sourceView === targetView) {
            return false;
          }
          if (!sourceMagnet) {
            return false;
          }
          if (!targetMagnet) {
            return false;
          }
          return true;
        },
      },
      highlighting: {
        magnetAvailable: {
          name: 'stroke',
          args: {
            attrs: {
              fill: '#fff',
              stroke: '#47C769',
            },
          },
        },
      },
      snapline: true,
      history: true,
      clipboard: {
        enabled: true,
      },
      keyboard: {
        enabled: true,
      },
    });
    this.initStencil();
    this.initShape();
    // this.initGraphShape(); // 填充数据
    this.initEvent();
    return this.graph;
  }

  static initStencil() {
    this.stencil = new Addon.Stencil({
      target: this.graph,
      stencilGraphWidth: 280,
      validateNode: (node) => {
        const nName = node.getAttrByPath('text/textWrap/text');
        if (nName === '开 始') {
          node.setProp('id', 'start');
        }
        if (nName === '结 束') {
          node.setProp('id', 'end');
        }
        return true;
      },
      // search: { rect: true },
      // collapsable: true,
      groups: [
        {
          name: 'basic',
          title: '基础节点',
          // graphHeight: 180,
          layoutOptions: {
            columns: 1,
            marginX: 20,
            resizeToFit: true,
          },
          graphHeight: 400,
        },
        // {
        //   name: 'combination',
        //   title: '组合节点',
        //   layoutOptions: {
        //     columns: 1,
        //     marginX: 60,
        //   },
        //   graphHeight: 260,
        // },
        // {
        //   name: 'group',
        //   title: '节点组',
        //   graphHeight: 100,
        //   layoutOptions: {
        //     columns: 1,
        //     marginX: 60,
        //   },
        // },
      ],
    });
    const stencilContainer = document.querySelector('#stencil');
    stencilContainer?.appendChild(this.stencil.container);
  }

  static initShape() {
    const { graph } = this;
    const r1 = graph.createNode({
      width: 110,
      height: 40,
      shape: 'flow-chart-rect',
      attrs: {
        body: {
          rx: 24,
          ry: 24,
          fill: '#bae7ff',
          stroke: '#9254de',
        },
        text: {
          textWrap: {
            text: '开 始',
          },
        },
      },
    });
    const r2 = graph.createNode({
      width: 140,
      height: 60,
      shape: 'flow-chart-rect',
      attrs: {
        text: {
          textWrap: {
            text: '流程节点',
          },
        },
      },
    });
    const r4 = graph.createNode({
      shape: 'flow-chart-rect',
      width: 110,
      height: 40,
      attrs: {
        body: {
          rx: 24,
          ry: 24,
          fill: '#ffccc7',
          stroke: '#9254de',
        },
        text: {
          textWrap: {
            text: '结 束',
          },
        },
      },
    });

    this.stencil.load([r1, r2, r4], 'basic');
  }

  static initGraphShape() {
    this.graph.fromJSON(graphData);
  }

  static showPorts(ports, show) {
    for (let i = 0, len = ports.length; i < len; i = i + 1) {
      ports[i].style.visibility = show ? 'visible' : 'hidden';
    }
  }

  static initEvent() {
    const { graph } = this;
    const container = document.getElementById('container');

    graph.on(
      'node:mouseenter',
      FunctionExt.debounce(() => {
        const ports = container.querySelectorAll('.x6-port-body');
        this.showPorts(ports, true);
      }),
      500,
    );
    graph.on('node:mouseleave', () => {
      const ports = container.querySelectorAll('.x6-port-body');
      this.showPorts(ports, false);
    });

    // 清除路径动画和边动画
    const clearAnimate = () => {
      clearInterval(this.interval); // 清除定时器

      const edges = graph.getEdges();
      edges.forEach((edge) => {
        edge.attr('line/strokeDasharray', '');
        edge.attr('line/style', {});
      });
    };

    // 清除节点选中样式和边的样式
    const clearStyle = () => {
      const nodes = graph.getNodes();
      nodes.forEach((node) => {
        node.setAttrs({
          body: {
            filter: '',
          },
        });
      });

      const edges = graph.getEdges();
      edges.forEach((edge) => {
        edge.attr('line/stroke', '#5F95FF');
        edge.attr('line/strokeWidth', 2);
      });
    };

    // 点击画布时，清除连接桩
    graph.on('blank:click', () => {
      const ports = container.querySelectorAll('.x6-port-body');
      this.showPorts(ports, false);
      clearAnimate();
      clearStyle();
    });

    graph.bindKey('backspace', () => {
      const cells = graph.getSelectedCells();
      if (cells.length) {
        graph.removeCells(cells);
      }
    });

    // 自定义事件--路径动画
    graph.on('signal', (cell) => {
      if (cell.isEdge()) {
        const view = graph.findViewByCell(cell);
        if (view) {
          const token = Vector.create('circle', { r: 6, fill: 'red' });
          this.stop = view.sendToken(token.node, 1500);
        }
      } else {
        const edges = graph.model.getConnectedEdges(cell, {
          outgoing: true,
        });
        // 消除定时器一秒的延迟
        edges.forEach((edge) => graph.trigger('signal', edge));
        this.interval = setInterval(() => {
          edges.forEach((edge) => graph.trigger('signal', edge));
        }, 1500);
      }
    });

    // 节点被选中时触发
    graph.on('node:click', ({ cell, node }) => {
      // node.setProp('id', 'start');
      // graph
      //   .getNeighbors(node)
      //   .forEach((node) => console.log(node.getProp('zIndex')));

      clearStyle();
      // 给该节点增加阴影效果
      node.setAttrs({
        body: {
          filter: {
            name: 'highlight',
            args: {
              color: '#f4488d',
              width: 10,
              blur: 1,
              opacity: 0.25,
            },
          },
        },
      });

      clearAnimate();

      // 启用输出边动画
      const outgoingEdges = graph.getConnectedEdges(cell, {
        outgoing: true,
      });
      outgoingEdges.forEach((edge) => {
        edge.attr('line/strokeDasharray', 5);
        edge.attr('line/style', { animation: 'ant-line 30s infinite linear' });
      });

      // 输入边增加样式
      const incomingEdges = graph.getConnectedEdges(cell, {
        incoming: true,
      });
      incomingEdges.forEach((edge) => {
        edge.attr('line/stroke', 'orange');
        edge.attr('line/strokeWidth', 3);
      });

      graph.trigger('signal', node); // 启用路径动画
    });

    graph.on('edge:click', ({ edge }) => {
      clearAnimate();
      clearStyle();

      edge.attr('line/strokeDasharray', 5);
      edge.attr('line/style', { animation: 'ant-line 30s infinite linear' });
    });

    graph.on('edge:connected', (args) => {
      const edge = args.edge;
      const node = args.currentCell;
      const elem = args.currentMagnet;
      const portId = elem.getAttribute('port');

      // 解决sendToken第一次触发时，1000时长失效的bug
      if (graph.model.getEdges().length === 1) {
        graph.trigger('signal', edge);
      }

      // 触发 port 重新渲染
      node.setPortProp(portId, 'connected', true);

      // 更新连线样式
      edge.attr({
        line: {
          strokeDasharray: '', // 让虚线变成实线
        },
      });
    });
  }
}
