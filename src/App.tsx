import React from 'react';
import './App.css';

import Chart from './chart';

const App: React.FC = () => {
  return (
    <div className="App">
      <p>Hello World!</p>
      <Chart width={500} height={500} margin={40} ></Chart>
      <Chart width={1000} height={500} margin={40} ></Chart>
    </div>
  );
}

export default App;
