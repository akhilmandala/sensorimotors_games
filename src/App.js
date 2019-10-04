import React, {Component} from 'react';
import {Stage, AppConsumer} from '@inlet/react-pixi'
import Ball from './Ball'

const WIDTH = window.innerWidth;
const HEIGHT = window.innerHeight

class App extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <Stage width={WIDTH} height={HEIGHT}>
        {/* <Ball x={0} y={0} fill={0xFF0000}/> */}
        <AppConsumer>
          {app => <Ball x={WIDTH / 2} y={HEIGHT / 2} app={app}/>}
        </AppConsumer>
      </Stage>
    );
  }
}

export default App;
