import React, { Component, useEffect } from "react";
import { Grid } from "semantic-ui-react";
import { Slider } from "react-semantic-ui-range";
import Plot from "react-plotly.js";

const WIDTH = window.innerWidth / 2.2;
const HEIGHT = window.innerHeight - 100;

const MIN_VELOCITY = -1000;
const MAX_VELOCITY = 1000;

const MIN_ACCELERATION = -1000;
const MAX_ACCELERATION = 1000;

class ReferenceTrackingGame extends Component {
  constructor(props) {
    super(props);
    this.gameWindow = React.createRef();
    var disturbance_frequencies = [0, 1, 2, 3, 4];
    var reference_frequencues = [5, 6, 7, 8, 9];

    //randomly generate disturbance path function
    var disturbance_amplitudes = disturbance_frequencies.map(frequency => {
      return Math.random();
    });
    var disturbance_phases = disturbance_frequencies.map(frequency => {
      var max = Math.PI;
      var min = -1 * Math.PI;
      return Math.random() * (max - min) + min;
    });

    //randomly generate reference path function
    var reference_amplitudes = reference_frequencues.map(frequency => {
      return Math.random();
    });
    var reference_phases = reference_frequencues.map(frequency => {
      var max = Math.PI;
      var min = -1 * Math.PI;
      return Math.random() * (max - min) + min;
    });

    var path = [];
    //initialize reference path
    for (let i = 0; i < HEIGHT; i++) {
      path[i] = 0;
    }

    this.state = {
      x: WIDTH / 2,
      y: HEIGHT - 200,
      velocity: 0,
      acceleration: 0,
      time: 0,
      disturbance: 0,
      disturbance_amplitudes,
      disturbance_phases,
      reference_amplitudes,
      reference_phases,
      path,
      time_stamps: [],
      inaccuracies: [],
      loggerVariable: 0
    };

    console.log(this.state.path);
  }

  disturbance_function = time => {
    const { disturbance_amplitudes, disturbance_phases } = this.state;
    let disturbance = 0;
    for (let i = 0; i < 5; i++) {
      disturbance +=
        disturbance_amplitudes[i] *
        Math.sin(disturbance_phases[i] + 2 * Math.PI * time);
    }
    return disturbance;
  };

  reference_function = time => {
    const { reference_amplitudes, reference_phases } = this.state;
    let reference = 0;
    for (let i = 0; i < 5; i++) {
      reference +=
        reference_amplitudes[i] *
        Math.sin(reference_phases[i] + 2 * Math.PI * time);
    }
    return reference;
  };

  _onMouseMove(e) {
    this.setState({ x: e.screenX - 45 });
  }

  componentDidMount = () => {
    this.interval = setInterval(() => {
      const { time, loggerVariable } = this.state;

      var disturbance = 0;

      disturbance = this.disturbance_function(time);
      var reference = this.reference_function(time);

      this.setState(state => {
        var newPath = state.path.slice(1);
        newPath.push(reference);

        var newX = state.x + 0.01 * state.velocity;

        if (newX < 0) {
          newX = 0;
        } else if (newX > WIDTH) {
          newX = WIDTH;
        }

        var newVel =
          state.velocity + 0.01 * (state.acceleration + disturbance);
        if (newVel < MIN_VELOCITY) {
          newVel = MIN_VELOCITY;
        } else if (newVel > MAX_VELOCITY) {
          newVel = MAX_VELOCITY;
        }

        var newTimestamps = state.time_stamps.slice(0);
        var newInaccuracies = state.inaccuracies.slice(0);

        if (loggerVariable % 100 == 0) {
          newTimestamps.push(time);
          newInaccuracies.push(state.x - WIDTH / 2 + 100 * this.state.path[Math.floor(this.state.y)]);
        }

        return {
          x: newX,
          velocity: newVel,
          time: time + 0.01,
          disturbance,
          path: newPath,
          loggerVariable: loggerVariable + 1,
          time_stamps: newTimestamps,
          inaccuracies: newInaccuracies
        };
      });
    }, 10);
  };

  componentWillUnmount = () => {
    clearInterval(this.interval);
  };

  render() {
    const settingsX = {
      start: this.state.x,
      min: 0,
      max: WIDTH,
      step: 0.001,
      onChange: value => {
        this.setState({
          x: value
        });
      }
    };

    const settingsVelocity = {
      start: this.state.velocity,
      min: MIN_VELOCITY,
      max: MAX_VELOCITY,
      step: 1,
      onChange: value => {
        this.setState({
          velocity: value
        });
      }
    };

    const settingsAcceleration = {
      start: this.state.acceleration,
      min: MIN_ACCELERATION,
      max: MAX_ACCELERATION,
      step: 0.1,
      onChange: value => {
        this.setState({
          acceleration: value
        });
      }
    };

    var drawn_path = [];

    for (let i = 1; i < this.state.path.length - 1; i++) {
      var x_coord = WIDTH / 2 + 100 * this.state.path[i];
      drawn_path += x_coord + "," + i + " ";
    }

    drawn_path.concat(
      (WIDTH / 2) * this.state.path[this.state.path.length] +
        " " +
        this.state.path.length
    );

    return (
      <Grid columns={2} style={{ padding: "2em" }}>
        <Grid.Row>
          <Grid.Column
            verticalAlign="middle"
            textAlign="left"
            style={{ paddingLeft: "1em" }}
          >
            <p>{this.state.disturbance}</p>
            <svg width={WIDTH} height={HEIGHT}>
              <polyline
                points={drawn_path}
                style={{ fill: "none", stroke: "black", strokeWidth: "2" }}
              />
              <circle cx={this.state.x} cy={HEIGHT - 100} r={10} fill="red" />
            </svg>
          </Grid.Column>
          <Grid.Column>
            <p>0th order control - position</p>
            <p>{this.state.x}</p>
            <Slider
              value={this.state.x}
              color="yellow"
              settings={settingsX}
              style={{ padding: "1em 0em 3em 0em" }}
            />

            <p>1st order control - velocity</p>
            <p>{this.state.velocity}</p>
            <Slider
              value={this.state.velocity}
              color="red"
              settings={settingsVelocity}
              style={{ padding: "1em 0em 3em 0em" }}
            />

            <p>2nd order control - acceleration</p>
            <p>{this.state.acceleration}</p>
            <Slider
              value={this.state.acceleration}
              color="blue"
              settings={settingsAcceleration}
              style={{ padding: "1em 0em 3em 0em" }}
            />
            <Plot
              data={[
                {
                  x: this.state.time_stamps,
                  y: this.state.inaccuracies,
                  type: "scatter",
                  mode: "lines",
                  marker: { color: "red" }
                }
              ]}
              layout={{ width: 500, height: 300, title: "Accuracy over time" }}
            />
          </Grid.Column>
        </Grid.Row>
      </Grid>
    );
  }
}

export default ReferenceTrackingGame;
