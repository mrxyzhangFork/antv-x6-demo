import { Graph, Dom, Node } from '@antv/x6';

export const FlowChartRect = Graph.registerNode('flow-chart-rect', {
  inherit: 'rect',
  width: 80,
  height: 42,
  attrs: {
    body: {
      fill: '#efdbff',
      stroke: '#9254de',
    },
    fo: {
      refWidth: '100%',
      refHeight: '100%',
    },
    foBody: {
      xmlns: Dom.ns.xhtml,
      style: {
        width: '100%',
        height: '100%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      },
    },
    'edit-text': {
      contenteditable: 'false',
      class: 'x6-edit-text',
      style: {
        width: '100%',
        textAlign: 'center',
        fontSize: 12,
        color: 'rgba(0,0,0,0.85)',
      },
    },
    text: {
      fontSize: 12,
      fill: 'rgba(0,0,0,0.85)',
      textWrap: {
        text: '',
        width: -10,
      },
    },
  },
  markup: [
    {
      tagName: 'rect',
      selector: 'body',
    },
    {
      tagName: 'text',
      selector: 'text',
    },
    {
      tagName: 'foreignObject',
      selector: 'fo',
      children: [
        {
          ns: Dom.ns.xhtml,
          tagName: 'body',
          selector: 'foBody',
          children: [
            {
              tagName: 'div',
              selector: 'edit-text',
            },
          ],
        },
      ],
    },
  ],
  ports: {
    groups: {
      top: {
        position: 'top',
        attrs: {
          circle: {
            r: 4,
            magnet: true,
            stroke: '#5F95FF',
            strokeWidth: 1,
            fill: '#fff',
            style: {
              visibility: 'hidden',
            },
          },
        },
      },
      right: {
        position: 'right',
        attrs: {
          circle: {
            r: 4,
            magnet: true,
            stroke: '#5F95FF',
            strokeWidth: 1,
            fill: '#fff',
            style: {
              visibility: 'hidden',
            },
          },
        },
      },
      bottom: {
        position: 'bottom',
        attrs: {
          circle: {
            r: 4,
            magnet: true,
            stroke: '#5F95FF',
            strokeWidth: 1,
            fill: '#fff',
            style: {
              visibility: 'hidden',
            },
          },
        },
      },
      left: {
        position: 'left',
        attrs: {
          circle: {
            r: 5,
            magnet: true,
            stroke: '#5F95FF',
            strokeWidth: 1,
            fill: '#fff',
            style: {
              visibility: 'hidden',
            },
          },
        },
      },
    },
    items: [
      {
        id: 'topPort1',
        group: 'top',
      },
      {
        id: 'topPort2',
        group: 'top',
      },
      {
        id: 'topPort3',
        group: 'top',
      },
      {
        group: 'right',
      },
      {
        id: 'bottomPort1',
        group: 'bottom',
      },
      {
        id: 'bottomPort2',
        group: 'bottom',
      },
      {
        id: 'bottomPort3',
        group: 'bottom',
      },
      {
        group: 'left',
      },
    ],
  },
});

// 定义边
export const algoEdge = Graph.registerConnector(
  'algoEdge',
  (source, target) => {
    const offset = 4;
    const control = 80;
    const v1 = { x: source.x, y: source.y + offset + control };
    const v2 = { x: target.x, y: target.y - offset - control };

    return `M ${source.x} ${source.y}
       L ${source.x} ${source.y + offset}
       C ${v1.x} ${v1.y} ${v2.x} ${v2.y} ${target.x} ${target.y - offset}
       L ${target.x} ${target.y}
      `;
  },
  true,
);
