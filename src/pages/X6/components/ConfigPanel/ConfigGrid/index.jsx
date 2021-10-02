import React, { useEffect } from 'react';
import { Tabs, Row, Col, Select, Slider, Input } from 'antd';
import FlowGraph from '@/pages/X6/Graph';

const { TabPane } = Tabs;

export default function (props) {
  const { attrs, setAttr } = props;

  useEffect(() => {
    let options;
    if (attrs.type === 'doubleMesh') {
      options = {
        type: attrs.type,
        args: [
          {
            color: attrs.color,
            thickness: attrs.thickness,
          },
          {
            color: attrs.colorSecond,
            thickness: attrs.thicknessSecond,
            factor: attrs.factor,
          },
        ],
      };
    } else {
      options = {
        type: attrs.type,
        args: [
          {
            color: attrs.color,
            thickness: attrs.thickness,
          },
        ],
      };
    }
    const { graph } = FlowGraph;
    graph.drawGrid(options);
  }, [
    attrs.type,
    attrs.color,
    attrs.thickness,
    attrs.thicknessSecond,
    attrs.colorSecond,
    attrs.factor,
  ]);

  useEffect(() => {
    const { graph } = FlowGraph;
    graph.setGridSize(attrs.size);
  }, [attrs.size]);

  return (
    <Tabs defaultActiveKey="1">
      <TabPane tab="网格样式" key="1" style={{ padding: 8 }}>
        <Row align="middle">
          <Col span={24}>网格类型</Col>
          <Col span={24}>
            <Select
              style={{ width: '100%' }}
              value={attrs.type}
              onChange={(val) => setAttr('type', val)}
            >
              <Select.Option value="dot">Dot</Select.Option>
              <Select.Option value="fixedDot">Fixed Dot</Select.Option>
              <Select.Option value="mesh">Mesh</Select.Option>
              <Select.Option value="doubleMesh">Double Mesh</Select.Option>
            </Select>
          </Col>
        </Row>
        <Row align="middle">
          <Col span={24}>网格尺寸</Col>
          <Col span={24}>
            <Slider
              min={1}
              max={20}
              step={1}
              value={attrs.size}
              onChange={(val) => setAttr('size', val)}
            />
          </Col>
          {/* <Col span={2}>
            <div className="result">{attrs.size}</div>
          </Col> */}
        </Row>
        {attrs.type === 'doubleMesh' ? (
          <React.Fragment>
            <Row align="middle">
              <Col span={12}>主网格线颜色</Col>
              <Col span={12}>
                <Input
                  type="color"
                  value={attrs.color}
                  style={{ width: '100%' }}
                  onChange={(e) => setAttr('color', e.target.value)}
                />
              </Col>
            </Row>
            <Row align="middle">
              <Col span={12}>主网格线宽度</Col>
              <Col span={12}>
                <Slider
                  min={0.5}
                  max={10}
                  step={0.5}
                  value={attrs.thickness}
                  onChange={(val) => setAttr('thickness', val)}
                />
              </Col>
              {/* <Col span={2}>
                <div className="result">{attrs.thickness.toFixed(1)}</div>
              </Col> */}
            </Row>
            <Row align="middle">
              <Col span={10}>次网格线颜色</Col>
              <Col span={12}>
                <Input
                  type="color"
                  value={attrs.colorSecond}
                  style={{ width: '100%' }}
                  onChange={(e) => setAttr('colorSecond', e.target.value)}
                />
              </Col>
            </Row>
            <Row align="middle">
              <Col span={12}>次网格线宽度</Col>
              <Col span={12}>
                <Slider
                  min={0.5}
                  max={10}
                  step={0.5}
                  value={attrs.thicknessSecond}
                  onChange={(val) => setAttr('thicknessSecond', val)}
                />
              </Col>
              {/* <Col span={2}>
                <div className="result">{attrs.thicknessSecond.toFixed(1)}</div>
              </Col> */}
            </Row>
            <Row align="middle">
              <Col span={12}>主次网格线间隔</Col>
              <Col span={12}>
                <Slider
                  min={1}
                  max={10}
                  step={1}
                  value={attrs.factor}
                  onChange={(val) => setAttr('factor', val)}
                />
              </Col>
              {/* <Col span={2}>
                <div className="result">{attrs.factor}</div>
              </Col> */}
            </Row>
          </React.Fragment>
        ) : (
          <React.Fragment>
            <Row align="middle">
              <Col span={10}>网格颜色</Col>
              <Col span={12}>
                <Input
                  type="color"
                  value={attrs.color}
                  style={{ width: '100%' }}
                  onChange={(e) => setAttr('color', e.target.value)}
                />
              </Col>
            </Row>
            <Row align="middle">
              <Col span={12}>网格线宽度</Col>
              <Col span={12}>
                <Slider
                  min={0.5}
                  max={10}
                  step={0.5}
                  value={attrs.thickness}
                  onChange={(val) => setAttr('thickness', val)}
                />
              </Col>
              {/* <Col span={1}>
                <div className="result">{attrs.thickness.toFixed(1)}</div>
              </Col> */}
            </Row>
          </React.Fragment>
        )}
      </TabPane>
    </Tabs>
  );
}
