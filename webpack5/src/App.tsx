import React from 'react';
import './app.less';
import icon from './pig.jpeg';
const App = () => {
  return (
    <div className="test">
      <div className="img"></div>
      <img src={icon} alt="" />
      demo测试
    </div>
  );
};

export default App;
