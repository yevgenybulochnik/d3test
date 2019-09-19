import React from 'react';
import './App.css';

import Chart from './chart';

interface State {
  data: any;
}

interface Props {

}


class App extends React.Component<Props, State> {

  state = {
    data: [
      [100, 100],
      [200, 200],
      [300, 300],
      [400, 400],
    ]
  }

   addData = () => {
    const randNum = [
      Math.floor(Math.random()*800),
      Math.floor(Math.random()*800)
    ]
    this.setState({
      data: [...this.state.data, randNum]
    }, () => console.log(this.state))
  }

  removeData = () => {
    const data = this.state.data
    if (data) {
      const randItem = Math.floor(Math.random()*data.length)
      data.splice(randItem, 1)
      this.setState({
        data: data
      })
    }
  }

  render() {
    return (
      <div className="App">
        <p>Hello World!</p>
        <button onClick={this.addData}>Add Data</button>
        <button onClick={this.removeData}>Remove Data</button>
        <Chart width={500} height={500} margin={40} ></Chart>
        <Chart width={1000} height={500} margin={40} ></Chart>
      </div>
    )
  }
}

export default App;
