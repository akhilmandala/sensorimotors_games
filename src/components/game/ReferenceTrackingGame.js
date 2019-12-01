import React, { Component, useEffect } from "react";
import { Grid, Menu } from "semantic-ui-react";
import { Slider } from "react-semantic-ui-range";
import Plot from "react-plotly.js";

const WIDTH = window.innerWidth / 2.2;
const HEIGHT = window.innerHeight - 100;

const MIN_VELOCITY = -1000;
const MAX_VELOCITY = 1000;

const MIN_ACCELERATION = -1000;
const MAX_ACCELERATION = 1000;

const FREQUENCIES = [
  0.1,
  0.2,
  0.3,
  0.4,
  0.5,
  0.6,
  0.7,
  0.8,
  0.9,
  1.0,
  1.1,
  1.2,
  1.3,
  1.4,
  1.5
];

class ReferenceTrackingGame extends Component {
  constructor(props) {
    super(props);
    this.gameWindow = React.createRef();

    //randomly generate components of the disturbance path function
    const [disturbance_amplitudes, disturbance_phases] = this.generate_random_signal(); 
    var disturbance_frequencies = getRandom(FREQUENCIES, 5);

    //randomly generate components of the reference path function
    const [reference_amplitudes, reference_phases] = this.generate_random_signal();
    var reference_frequencies = getRandom(FREQUENCIES, 5);

    //initialize reference path as a straight line
    var path = [];
    for (let i = 0; i < HEIGHT + 200; i++) {
      path[i] = 0;
    }

    //generate a key for the game
    this.key = this.generate_key()

    this.state = {
      x: WIDTH / 2,
      y: HEIGHT - 200,
      velocity: 0,
      acceleration: 0,
      time: 0,
      disturbance: 0,
      disturbance_amplitudes,
      disturbance_phases,
      disturbance_frequencies,
      reference_amplitudes,
      reference_phases,
      reference_frequencies,
      path,
      time_stamps: [],
      inaccuracies: [],
      loggerVariable: 0,
      activeItem: "slider",
      disturbances: [],
      references: [],
      positions: [],
      offset: 0,
    };
  }

  generate_key = () => {
    const current_date = new Date().toDateString();

    var today = new Date();
    var seconds = today.getSeconds();

    if (seconds < 10) {
      seconds = "0" + seconds;
    }

    var keyTime = today.getHours() + ":" + today.getMinutes() + ":" + seconds;
    var game_storage_key = "ref-tracking-data" + current_date + "-" + keyTime;

    return game_storage_key
  }

  generate_random_signal = () => {
    var amplitudes = [...Array(5).keys()].map(frequency => {
      return Math.random();
    });

    var phases = [...Array(5).keys()].map(frequency => {
      var max = Math.PI;
      var min = -1 * Math.PI;
      return Math.random() * (max - min) + min;
    });
    
    return [amplitudes, phases]
  }

  /**
   * Calculates the disturbance force to be applied to the reference. Assumes that the
   * amplitudes and phases of the disturbance signal have already been computed.
   * @param {Number} time The time at which the disturbance is calculated
   * @returns {Number} The disturbance force
   */
  disturbance_function = time => {
    const {
      disturbance_amplitudes,
      disturbance_phases,
      disturbance_frequencies
    } = this.state;
    let disturbance = 0;
    for (let i = 0; i < 5; i++) {
      disturbance +=
        disturbance_amplitudes[i] *
        Math.sin(
          disturbance_phases[i] +
            2 * Math.PI * time * disturbance_frequencies[i]
        );
    }
    return disturbance;
  };

  /**
   * Calculates the reference path position given a specific time
   * @param {Number} time The time at which the reference is calculated
   * @returns {Number} The reference position - the returned value needs to be scaled
   */
  reference_function = time => {
    const {
      reference_amplitudes,
      reference_phases,
      reference_frequencies
    } = this.state;
    let reference = 0;
    for (let i = 0; i < 5; i++) {
      reference +=
        reference_amplitudes[i] *
        Math.sin(
          reference_phases[i] + 2 * Math.PI * time * reference_frequencies[i]
        );
    }
    return reference;
  };

  /**
   * @deprecated for mouse control
   */
  _onMouseMove(e) {
    this.setState({ x: e.screenX - 45 });
  }

  /**
   * Initializes a 10ms interval for calculating and loading the disturbance force and reference point
   * Every 1s a data point is logged (timestamp, inaccuracy)
   */
  componentDidMount = () => {
    this.interval = setInterval(() => {
      const { time, loggerVariable } = this.state;

      var disturbance = this.disturbance_function(time);
      var reference = this.reference_function(time);

      this.setState(state => {
        var newPath = state.path.slice(1);
        newPath.push(reference);

        const disturbances = state.disturbances.concat(disturbance);
        const references = state.references.concat(reference);
        const positions = state.positions.concat(state.x);
        const time_stamps = state.time_stamps.concat(time);

        var path_position = WIDTH / 2 + 100 * state.path[state.y - 200];
        const offset = state.x - path_position;

        const inaccuracies = state.inaccuracies.concat(offset);

        var newX = state.x + 0.01 * state.velocity;
        var newVel = state.velocity + 0.01 * (state.acceleration + disturbance);

        //If the calculated values are outside of a certain range, then they default to the MIN/MAX values.
        if (newX < 0) {
          newX = 0;
        } else if (newX > WIDTH) {
          newX = WIDTH;
        }

        if (newVel < MIN_VELOCITY) {
          newVel = MIN_VELOCITY;
        } else if (newVel > MAX_VELOCITY) {
          newVel = MAX_VELOCITY;
        }

        return {
          x: newX,
          velocity: newVel,
          time: time + 0.001,
          disturbance,
          path: newPath,
          loggerVariable: loggerVariable + 1,
          time_stamps: time_stamps,
          inaccuracies: inaccuracies,
          disturbances,
          references,
          positions,
          offset
        };
      });
    }, 10);
  };

  componentWillUnmount = () => {
    clearInterval(this.interval);

    var data = {
      references: this.state.references,
      disturbances: this.state.disturbances,
      timestamps: this.state.time_stamps,
      inaccuracies: this.state.inaccuracies,
      positions: this.state.positions
    };

    localStorage.setItem(this.key, JSON.stringify(data));
  };

  handleItemClick = (e, { name }) => this.setState({ activeItem: name });

  render() {
    const { activeItem, offset } = this.state;
    //Settings for the sliders
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

    //Some processing for the SVG drawing the sin() wave
    var drawn_path = [];

    for (let i = 1; i < this.state.path.length - 1; i++) {
      var x_coord = WIDTH / 2 + 100 * this.state.path[i];
      drawn_path += x_coord + "," + (HEIGHT - i) + " ";
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
            <svg width={WIDTH} height={HEIGHT}>
              <polyline
                points={drawn_path}
                style={{ fill: "none", stroke: "black", strokeWidth: "2" }}
              />
              <circle cx={this.state.x} cy={this.state.y} r={10} fill="red" />
            </svg>
          </Grid.Column>
          <Grid.Column>
            <Menu>
              <Menu.Item
                name="slider"
                active={activeItem === "slider"}
                onClick={this.handleItemClick}
              />
              <Menu.Item
                name="cursor"
                active={activeItem === "cursor"}
                onClick={this.handleItemClick}
              />
              <Menu.Item
                name="buttons"
                active={activeItem === "buttons"}
                onClick={this.handleItemClick}
              />
            </Menu>
            {activeItem === "slider" && (
              <>
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
              </>
            )}
            {activeItem === "cursor" && (
              <>
                <p>TODO - CURSOR</p>
              </>
            )}
            {activeItem === "buttons" && (
              <>
                <p>TODO-BUTTONS</p>
              </>
            )}
          </Grid.Column>
        </Grid.Row>
      </Grid>
    );
  }
}

function getRandom(arr, n) {
  var result = new Array(n),
    len = arr.length,
    taken = new Array(len);
  if (n > len)
    throw new RangeError("getRandom: more elements taken than available");
  while (n--) {
    var x = Math.floor(Math.random() * len);
    result[n] = arr[x in taken ? taken[x] : x];
    taken[x] = --len in taken ? taken[len] : len;
  }
  return result;
}

export default ReferenceTrackingGame;
