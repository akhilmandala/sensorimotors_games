import React, { Component } from "react";
import Plot from "react-plotly.js";
import { Grid, Menu, Segment, Container, Header, Button } from "semantic-ui-react";

var numeric = require('numeric')
var math = require('mathjs')

const UPDATE_CONSTANT = 1.0;

class CostMinimizationGame extends Component {
  constructor(props) {
    super(props);

    //initialize parameters for human cost function f_h
    const human_parameters = {
      a: Math.random() * 5 - 2.5,
      b: Math.random() * 5 - 2.5,
      c: Math.random() * 5,
      d: Math.random() * 40 - 20,
      e: Math.random() * 40 - 20
    };

    //initialize parameters for machine cost function f_m
    const machine_parameters = {
      a: Math.random() * 5 - 2.5,
      b: Math.random() * 5 - 2.5,
      c: Math.random() * 5,
      d: Math.random() * 40 - 20,
      e: Math.random() * 40 - 20
    };

    /**
     * Initialize human and machine actions:
     * - Solve for the fixed point of the cost functions by taking the jacobian of the cost functions
     * - take the jacobian of the first order cost functions (J[Dhfh Dmfm]), evaluate the jacobian at the fixed point
     */

    this.state = {
      human_parameters,
      machine_parameters,
      activeItem: "human_cost",
      human_action: 0,
    };
  }

  componentDidMount = () => {
    var fixedPoint = this.computeFixedPoint();
    var [human_cost_values, machine_cost_values] = this.generate_sample_data(fixedPoint);
    var stability = this.evaluateFixedPointStability(fixedPoint);

    console.log(fixedPoint);

    this.setState({
      human_cost_values,
      machine_cost_values,
      fixedPoint
    })
  }

  generate_sample_data = (fixed_point) => {
    const h_fixed = fixed_point[0];
    const m_fixed = fixed_point[1];

    const human_cost = [];
    const machine_cost = [];

    for (let h = 0; h < 300; h++) {
      var human_cost_datapoint = [];
      var machine_cost_datapoint = [];

      for (let m = 0; m < 300; m++) {
        human_cost_datapoint[m] = this.human_cost_function(h - 150, m - 150);
        machine_cost_datapoint[m] = this.machine_cost_function(
          h - 150,
          m - 150
        );
      }

      human_cost[h] = human_cost_datapoint;
      machine_cost[h] = machine_cost_datapoint;
    }

    return [human_cost, machine_cost]
  };

  computeFixedPoint = () => {
    const {human_parameters, machine_parameters} = this.state;

    const a_h = human_parameters.a;
    const c_h = human_parameters.c;
    const d_h = human_parameters.d;

    const b_m = machine_parameters.b;
    const c_m = machine_parameters.c;
    const e_m = machine_parameters.e;

    //solve the first order equations
    var coefficient_matrix = [[2*a_h, c_h],[c_m, 2*b_m]];
    coefficient_matrix = numeric.inv(coefficient_matrix);
    var constants = [-1 * d_h, -1 * e_m];
    var fixed_point = math.multiply(coefficient_matrix, constants);

    return fixed_point;
  }

  evaluateFixedPointStability = (fixed_point) => {
    const a_h = this.state.human_parameters.a;
    const c_h = this.state.human_parameters.c;

    const b_m = this.state.machine_parameters.b;
    const c_m = this.state.machine_parameters.c;

    const h = fixed_point[0];
    const m = fixed_point[1];
  }

  human_cost_function = (human_action, machine_action) => {
    const { a, b, c, d, e } = this.state.human_parameters;

    return a * Math.pow(human_action, 2) + b * Math.pow(machine_action, 2) + c * machine_action * human_action + d * human_action + e * machine_action;
  };

  machine_cost_function = (human_action, machine_action) => {
    const { a, b, c, d, e } = this.state.machine_parameters;

    return a * Math.pow(human_action, 2) + b * Math.pow(machine_action, 2) + c * machine_action * human_action + d * human_action + e * machine_action;
  };

  handleClick = (e, { name }) => {
    e.preventDefault();
    this.setState({
      activeItem: name
    });
  };

  update_function = (human_action, machine_action) => {
    const {b,c,d} = this.state.machine_parameters;
    const m_new = machine_action - (UPDATE_CONSTANT) * (2*b*machine_action + c*human_action + d);
    return m_new;
  }

  incrementUp = () => {
    var {human_action, machine_action} = this.state;
    human_action++;
    machine_action = this.update_function(human_action, machine_action); 
    this.setState({
      human_action,
      machine_action,
      current_cost: this.human_cost_function(human_action, machine_action)
    })
  }

  incrementDown = () => {
    var {human_action, machine_action} = this.state;
    human_action--;
    machine_action = this.update_function(human_action, machine_action); 
    this.setState({
      human_action,
      machine_action,
      current_cost: this.human_cost_function(human_action, machine_action)
    })
  }

  render() {
    const { activeItem, current_cost, human_cost_values, machine_cost_values} = this.state;

    const human_cost_trace = [
      {
        z: human_cost_values,
        type: "contour",
        contours: { coloring: "lines" }
      }
    ];

    const machine_cost_trace = [
      {
        z: machine_cost_values,
        type: "contour",
        contours: { coloring: "lines" }
      }
    ];

    const full_data = [
      {
        z: machine_cost_values,
        type: "contour",
        contours: { coloring: "lines" }
      },
      {
        z: human_cost_values,
        type: "contour",
        contours: { coloring: "lines" }
      }
    ];

    var { a, b, c, d, e } = this.state.human_parameters;
    [a, b, c, d, e] = [a, b, c, d, e].map(value => {
      return Math.round(value * 100) / 100;
    });

    const human_equation = (
      <p>
        {a}h<sup>2</sup> + {b}m<sup>2</sup> + {c}hm + {d}h + {e}m
      </p>
    );

    var { a, b, c, d, e } = this.state.machine_parameters;
    [a, b, c, d, e] = [a, b, c, d, e].map(value => {
      return Math.round(value * 100) / 100;
    });

    const machine_equation = (
      <p>
        {a}h<sup>2</sup> + {b}m<sup>2</sup> + {c}hm + {d}h + {e}m
      </p>
    );

    return (
      <>
        <Grid style={{ paddingTop: "2em" }}>
          <Grid.Row columns={3}>
            <Grid.Column width={2}>
              <Menu fluid vertical tabular>
                <Menu.Item
                  name="human_cost"
                  active={activeItem === "human_cost"}
                  onClick={this.handleClick}
                />
                <Menu.Item
                  name="machine_cost"
                  active={activeItem === "machine_cost"}
                  onClick={this.handleClick}
                />
                <Menu.Item
                  name="total_cost"
                  active={activeItem === "total_cost"}
                  onClick={this.handleClick}
                />
              </Menu>
            </Grid.Column>
            <Grid.Column width={8}>
              {(function() {
                switch (activeItem) {
                  case "human_cost":
                    return (
                      <>
                        <Plot
                          data={human_cost_trace}
                          layout={{
                            width: 500,
                            height: 500
                          }}
                        />
                      </>
                    );
                  case "machine_cost":
                    return (
                      <>
                        <Plot
                          data={machine_cost_trace}
                          layout={{
                            width: 500,
                            height: 500
                          }}
                        />
                      </>
                    );
                  case "total_cost":
                    return (
                      <>
                        <Plot
                          data={full_data}
                          layout={{
                            width: 500,
                            height: 500
                          }}
                        />
                      </>
                    );
                }
              })()}
            </Grid.Column>
            <Grid.Column width={6}>
              <Segment>
                <Container text>
                  <Header as="h5">Human cost equation</Header>
                  {human_equation}
                </Container>
                <Container text>
                  <Header as="h5">Machine cost equation</Header>
                  {machine_equation}
                </Container>
              </Segment>
            </Grid.Column>
          </Grid.Row>
          <Grid.Row columns={2}>
              <Grid.Column>
                <Button onClick={this.incrementUp}>Increment down</Button>
                <Button onClick={this.incrementDown}>Increment up</Button>
              </Grid.Column>
              <Grid.Column>
                <Header as='h4'>Current cost</Header>
                <p>{current_cost}</p>
            <p>Human action: {this.state.human_action}</p>
            <p>Machine action: {this.state.machine_action}</p>
              </Grid.Column>
          </Grid.Row>
        </Grid>
      </>
    );
  }
}

export default CostMinimizationGame;
