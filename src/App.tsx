import React from 'react';
import './App.css';

import Chart from './chart';

interface State {
  data: any;
  counter: number;
}

interface Props {

}

class Datum {
  id: number;
  x: number;
  y: number;
  constructor(id: number, x: number, y:number) {
    this.id = id
    this.x = x
    this.y = y
  }
}

class App extends React.Component<Props, State> {

  state = {
    data: [
      new Datum(0, 100, 100)
    ],
    counter: 1
  }

   addData = () => {
     const x = Math.floor(Math.random()*1000)
     const y = Math.floor(Math.random()*1000)
     this.setState({
       data: [...this.state.data, new Datum(this.state.counter, x, y)]
     }, () => {
       this.setState({
         counter: this.state.counter + 1
       })
     })
  }

  removeData = () => {
    const data = this.state.data
    if (data) {
      const randItem = Math.floor(Math.random()*data.length)
      data.splice(randItem, 1)
      this.setState({
        data: data
      }, () => console.log(this.state))
    }
  }

  clearData = () => {
    this.setState({
      data: []
    })
  }

  render() {
    return (
      <div className="App">
        <p>Hello World!</p>
        <button onClick={this.addData}>Add Data</button>
        <button onClick={this.removeData}>Remove Data</button>
        <button onClick={this.clearData}>Clear</button>
        <Chart data={this.state.data} width={500} height={500} margin={40} ></Chart>
        <Chart data={this.state.data} width={1000} height={500} margin={40} ></Chart>
      </div>
    )
  }
}

export default App;
