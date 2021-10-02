import React, { useState, memo } from 'react';
import { Button, Card, Alert } from 'antd';

// 子组件
const Child = memo(({ textInfo }) => {
  console.log('渲染了子组件');
  return <Alert message="我是一个简单的子组件" />;
});

// 父组件
const Parent = () => {
  const [count, setCount] = useState(0);
  const [text, setText] = useState('你好，世界！');

  // 按钮点击事件
  const handleClick = () => {
    setCount(count + 1);
  };

  return (
    <Card>
      <p>{count}</p>
      <p>
        <Button onClick={handleClick}>点击+1</Button>
      </p>
      <Child textInfo={{ text }} />
    </Card>
  );
};

export default Parent;
