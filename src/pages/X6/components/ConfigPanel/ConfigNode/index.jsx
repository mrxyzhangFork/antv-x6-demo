import React, { useEffect, useRef } from 'react';
import { Tabs, Input, Slider, Form } from 'antd';
import FlowGraph from '@/pages/X6/Graph';

const { TabPane } = Tabs;
const { Item } = Form;

export default function (props) {
  const { id } = props;

  const cellRef = useRef();
  const [form] = Form.useForm();

  useEffect(() => {
    if (id) {
      const { graph } = FlowGraph;
      const cell = graph.getCellById(id);
      if (!cell || !cell.isNode()) {
        return;
      }
      const { body, text } = cell.getAttrs();
      form.setFieldsValue({
        body: { strokeWidth: 1, fillOpacity: 1, ...body },
        text,
      });
      cellRef.current = cell;
    }
  }, [id]);

  // 节点属性值发生变化
  const onAttrsChange = (changedValues, allValues) => {
    cellRef.current.setAttrs(allValues);
  };

  return (
    <Form form={form} layout="vertical" onValuesChange={onAttrsChange}>
      <Tabs defaultActiveKey="1">
        <TabPane tab="节点样式" key="1" style={{ padding: 8 }}>
          <Item label="填充颜色" name={['body', 'fill']}>
            <Input type="color" />
          </Item>
          <Item label="填充颜色的透明值" name={['body', 'fillOpacity']}>
            <Slider min={0} max={1} step={0.1} />
          </Item>
          <Item label="描边颜色" name={['body', 'stroke']}>
            <Input type="color" />
          </Item>
          <Item label="描边宽度" name={['body', 'strokeWidth']}>
            <Slider min={0} max={10} step={1} />
          </Item>
          <Item label="字体颜色" name={['text', 'color']}>
            <Input type="color" />
          </Item>
          <Item label="字体大小" name={['text', 'fontSize']}>
            <Slider min={8} max={16} step={1} />
          </Item>
        </TabPane>
      </Tabs>
    </Form>
  );
}
