import React, { Component } from "react";
import { Grid, Container, Checkbox, Segment } from "semantic-ui-react";
import Plot from "react-plotly.js";
var ft = require('fourier-transform')

// var fft = require('fft-js').fft

class ReferenceTrackerData extends Component {
  constructor(props) {
    super(props);
    this.state = {
      key: props.match.params.key
    };
  }

  UNSAFE_componentWillMount = () => {
    var data = localStorage.getItem(this.state.key);
    data = JSON.parse(data);
    const { disturbances, inaccuracies, references, timestamps, positions } = data;
    this.setState({
      disturbances,
      inaccuracies,
      references,
      timestamps,
      positions
    });
  };

  render() {
    const { disturbances, inaccuracies, references, timestamps, positions } = this.state;
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
      name: 'Reference signal'
    };

    var disturbance_data = {
      x: x_axis,
      y: disturbances,
      type: "scatter",
      mode: "lines",
      marker: { color: "blue" },
      name: 'Disturbance signal'
    };

    var ref_dist_data = [reference_data,disturbance_data];

    console.log(inaccuracies);

    var inaccuracy_data = [
      {
        x: timestamps,
        y: inaccuracies,
        type: "scatter",
        mode: "lines",
        marker: { color: "blue" }
      }
    ];

    var position_data = [{
        x: x_axis,
        y: positions,
        type: "scatter",
        mode: "lines",
        marker: { color: "purple" }
    }]

    var min_index = Math.pow(2, Math.floor(Math.log2(positions.length)))
    
    var positions_fft = positions.slice(0, min_index)
    var spectrum = ft(positions_fft)
    console.log(spectrum)

    var new_axis = [];
    for(let i = 0; i < min_index; i++) {
        new_axis[i] = i
    }
    console.log(new_axis)

    var fft_data = [{
        x: new_axis.slice(0, 10),
        y: spectrum.slice(0, 10),
        type: "scatter",
        mode: "lines",
        marker: { color: "green" }
    }]

    return (
      <>
        <Container>
          <Grid centered>
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
                    width: 1000,
                    height: 700,
                    title: "Fast fourier transform of position data over time"
                  }}
                />
              </Segment>
            </Grid.Row>
            <Grid.Row>
              <Segment>
                <Plot
                  data={inaccuracy_data}
                  layout={{
                    width: 500,
                    height: 300,
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

/**
 *  *             <Plot
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
 */
