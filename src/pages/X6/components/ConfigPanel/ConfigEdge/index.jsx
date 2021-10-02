import React, { useEffect, useState, useRef } from 'react';
import { Tabs, Row, Col, Input, Slider, Select } from 'antd';
import FlowGraph from '@/pages/X6/Graph';
import { Cell, Edge } from '@antv/x6';

const { TabPane } = Tabs;

export default function (props) {
  const { id } = props;
  const [attrs, setAttrs] = useState({
    stroke: '#5F95FF',
    strokeWidth: 1,
    connector: 'normal',
  });
  const cellRef = useRef();

  useEffect(() => {
    if (id) {
      const { graph } = FlowGraph;
      const cell = graph.getCellById(id);
      if (!cell || !cell.isEdge()) {
        return;
      }
      cellRef.current = cell;

      const connector = cell.getConnector() || {
        name: 'smooth',
      };
      setAttr('stroke', cell.attr('line/stroke'));
      setAttr('strokeWidth', cell.attr('line/strokeWidth'));
      setAttr('connector', connector.name);
    }
  }, [id]);

  const setAttr = (key, val) => {
    setAttrs((prev) => ({
      ...prev,
      [key]: val,
    }));
  };

  const onStrokeChange = (e) => {
    const val = e.target.value;
    setAttr('stroke', val);
    cellRef.current.attr('line/stroke', val);
  };

  const onStrokeWidthChange = (val) => {
    setAttr('strokeWidth', val);
    cellRef.current.attr('line/strokeWidth', val);
  };

  const onConnectorChange = (val) => {
    setAttr('connector', val);
    const cell = cellRef.current;
    cell.setConnector(val);
  };

  return (
    <Tabs defaultActiveKey="1">
      <TabPane tab="线条样式" key="1">
        <Row align="middle">
          <Col span={24}>宽 度</Col>
          <Col span={24}>
            <Slider
              min={1}
              max={5}
              step={1}
              value={attrs.strokeWidth}
              onChange={onStrokeWidthChange}
            />
          </Col>
          {/* <Col span={2}>
            <div className="result">{attrs.strokeWidth}</div>
          </Col> */}
        </Row>
        <Row align="middle">
          <Col span={24}>颜 色</Col>
          <Col span={24}>
            <Input
              type="color"
              value={attrs.stroke}
              style={{ width: '100%' }}
              onChange={onStrokeChange}
            />
          </Col>
        </Row>
        <Row align="middle">
          <Col span={24}>连接器</Col>
          <Col span={24}>
            <Select
              style={{ width: '100%' }}
              value={attrs.connector}
              onChange={onConnectorChange}
            >
              <Select.Option value="normal">简单连接器</Select.Option>
              <Select.Option value="smooth">平滑连接器</Select.Option>
              <Select.Option value="rounded">圆角连接器</Select.Option>
              <Select.Option value="jumpover">跳线连接器</Select.Option>
            </Select>
          </Col>
        </Row>
      </TabPane>
    </Tabs>
  );
}
