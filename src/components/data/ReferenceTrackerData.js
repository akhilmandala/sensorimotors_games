import React, { Component } from "react";
import { Grid, Container, Button, Segment } from "semantic-ui-react";
import Plot from "react-plotly.js";
var ft = require("fourier-transform");

// var fft = require('fft-js').fft
class ReferenceTrackerData extends Component {
  constructor(props) {
    super(props);
    this.state = {
      key: props.match.params.key
    };
    this.downloadData = React.createRef();
  }

  UNSAFE_componentWillMount = () => {
    var string_data = localStorage.getItem(this.state.key);
    var data = JSON.parse(string_data);
    const {
      disturbances,
      inaccuracies,
      references,
      timestamps,
      positions
    } = data;
    this.setState({
      disturbances,
      inaccuracies,
      references,
      timestamps,
      positions,
      string_data
    });
  };

  componentDidMount = () => {
    var dataStr =
      "data:text/json;charset=utf-8," +
      encodeURIComponent(this.state.string_data);
    var downloadAnchorNode = this.downloadData.current;
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", "game_data" + ".json");
  };

  render() {
    const { disturbances, inaccuracies, references, timestamps } = this.state;
    var length = references.length;
    var x_axis = [];
    for (var i = 0; i < length; i++) {
      x_axis[i] = i;
    }

    var reference_data = {
      x: x_axis,
      y: references,
      type: "scatter",
      mode: "lines",
      marker: { color: "red" },
      name: "Reference signal"
    };

    var disturbance_data = {
      x: x_axis,
      y: disturbances,
      type: "scatter",
      mode: "lines",
      marker: { color: "blue" },
      name: "Disturbance signal"
    };

    var ref_dist_data = [reference_data, disturbance_data];

    var inaccuracy_data = [
      {
        x: timestamps,
        y: inaccuracies,
        type: "scatter",
        mode: "lines",
        marker: { color: "blue" }
      }
    ];

    var positions = this.state.positions.slice(
      503,
      this.state.positions.length - 1
    );

    var position_data = [
      {
        x: x_axis.slice(503, x_axis.length - 1),
        y: positions,
        type: "scatter",
        mode: "lines",
        marker: { color: "purple" }
      }
    ];

    var min_index = Math.pow(2, Math.floor(Math.log2(positions.length)));

    var positions_fft = positions.slice(0, min_index);
    var position_offset = positions_fft[0];

    var disturbance_fft = disturbances.slice(0, min_index);
    var references_fft = references.slice(0, min_index);

    positions_fft = positions_fft.map(position => {
      return position - position_offset;
    });

    var position_spectrum = ft(positions_fft);
    var disturbance_spectrum = ft(disturbance_fft);
    var references_spectrum = ft(references_fft);

    var new_axis = [];
    for (let i = 0; i < min_index; i++) {
      new_axis[i] = i;
    }

    var fft_data = [
      {
        x: new_axis,
        y: position_spectrum,
        type: "scatter",
        mode: "lines",
        marker: { color: "green" },
        name: 'position'
      },
      {
        x: new_axis,
        y: disturbance_spectrum,
        type: "scatter",
        mode: "lines",
        marker: { color: "blue" },
        name: 'disturbance'
      },
      {
        x: new_axis,
        y: references_spectrum,
        type: "scatter",
        mode: "lines",
        marker: { color: "red" },
        name: 'reference'
      }
    ];

    return (
      <>
        <Container>
          <Grid centered>
            <Grid.Row>
              <Segment>
                <a id="downloadAnchorElem" ref={this.downloadData}>
                  Download data
                </a>
              </Segment>
            </Grid.Row>
            <Grid.Row>
              <Segment>
                <Plot
                  data={ref_dist_data}
                  layout={{
                    width: 1000,
                    height: 700,
                    title: "Reference and disturbance signal over time"
                  }}
                />
              </Segment>
            </Grid.Row>
            <Grid.Row>
              <Segment>
                <Plot
                  data={position_data}
                  layout={{
                    width: 1000,
                    height: 700,
                    title: "Position over time"
                  }}
                />
              </Segment>
            </Grid.Row>
            <Grid.Row>
              <Segment>
                <Plot
                  data={fft_data}
                  layout={{
                    xaxis: {
                      type: "log",
                      autorange: true
                    },
                    yaxis: {
                      type: "log",
                      autorange: true
                    },
                    width: 1000,
                    height: 700,
                    title: "Fast fourier transform of position, disturbance, and reference data over time"
                  }}
                />
              </Segment>
            </Grid.Row>
            <Grid.Row>
              <Segment>
                <Plot
                  data={inaccuracy_data}
                  layout={{
                    width: 1000,
                    height: 700,
                    title: "Inaccuracy over time"
                  }}
                />
              </Segment>
            </Grid.Row>
          </Grid>
        </Container>
      </>
    );
  }
}

export default ReferenceTrackerData;
