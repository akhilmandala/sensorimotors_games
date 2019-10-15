import React, { Component } from "react";
import { Stage, AppConsumer } from "@inlet/react-pixi";
import SensoriBall from "../game/SensoriBall";
import { Grid } from "semantic-ui-react";
import Plot from "react-plotly.js";

class DevPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentLocalStorageKey: null
    };
  }

  shouldComponentUpdate(nextProps, nextState) {
      if (this.state.gameData !== nextState.gameData) {
          console.log('YES')
          return true
      } else {
          console.log('NO')
          return false
      }
  }

  UNSAFE_componentWillMount = () => {
    window.addEventListener('localStorage', function(e) {
        console.log(e);
    })
  }

  handleStorageKey = (key) => {
      this.setState({
          currentLocalStorageKey: key
      })
      console.log(key);
  }

  detectLocalStorageChange = () => {
    var data = localStorage.getItem(this.state.currentLocalStorageKey);
    data = JSON.parse(data);
    this.setState({
        async_y: data.asyncs,
        async_x: data.timestamps,
        gameData: data,
        IOIs: data.IOIs,
        ITIs: data.ITIs,
    })
  }

  render() {
    var data = [
        {
          x: this.state.IOIs,
          y: this.state.ITIs,
          type: "scatter",
          mode: "markers",
          marker: { color: "red" }
        }
      ]

    return (
      <div>
        <Grid columns={2} inverted celled>
          <Grid.Row>
            <Grid.Column>
              <Stage width={window.innerWidth / 2.5} height={window.innerHeight - 40}>
                <AppConsumer>
                  {app => (
                    <SensoriBall
                      app={app}
                      window_width={window.innerWidth / 2.5}
                      window_height={window.innerHeight - 40}
                      a={-0.75} 
                      x={0.5}
                      game_type='convergence'
                      uploadLocalStorageKey = {this.handleStorageKey}
                      updateGraph = {this.detectLocalStorageChange}
                    />
                  )}
                </AppConsumer>
              </Stage>
            </Grid.Column>
            <Grid.Column verticalAlign='middle' floated='right'>
                <Plot
                  style={{padding: '0em 0em 0em 1.5em'}}
                  data={data} 
                  layout={ {width: 800, height: 500, title: 'Game progression', xaxis: {title: {text: 'IOI'}}, yaxis: {title: {text: 'ITI'}}} }
                />
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </div>
    );
  }
}

export default DevPage;
