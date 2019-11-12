import React, { Component } from "react";
import SensoriBall from "../game/SensoriBall";
import { Slider } from "react-semantic-ui-range";
import { Grid, Segment } from "semantic-ui-react";
import ReferenceTrackingGame from "../game/ReferenceTrackingGame";

class ReferenceTrackingGameWindow extends Component {
  constructor(props) {
    super(props);
    this.state = {
      position: 0
    };
  }

  componentDidMount = () => {};

  componentDidUpdate = () => {};

  render() {
    var { position } = this.state;

    const settingsA = {
      start: 0,
      min: -2,
      max: 2,
      step: 0.001,
      onChange: value => {
        this.setState({
          position: value
        });
      }
    };

    return <ReferenceTrackingGame />;
  }
}

export default ReferenceTrackingGameWindow;
