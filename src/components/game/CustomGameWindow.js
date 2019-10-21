import React, { Component } from "react";
import { Stage, AppConsumer } from "@inlet/react-pixi";
import SensoriBall from "./SensoriBall";
import { Grid, Segment, Button, Container } from "semantic-ui-react";
import { Link } from "react-router-dom";
import { Slider } from "react-semantic-ui-range";
import * as d3 from "d3";

const WIDTH = window.innerWidth / 2.2;
const HEIGHT = window.innerHeight - 100;

class GameWindow extends Component {
  constructor(props) {
    super(props);

    const game_type = props.match.params.game_type;
    let a = -0.75;
    let b = 0.5;

    this.state = {
      runGame: true,
      a,
      b,
      game_type,
      gameStart: false
    };

    this.gameColumn = React.createRef();
    this.d3Graph = React.createRef();
  }

  componentDidMount = () => {
    this.drawFunctionGraph(this.state.a);
  };

  componentDidUpdate = () => {
    d3.select(this.d3Graph.current)
      .select("svg")
      .remove();
    this.drawFunctionGraph(this.state.a);
  };

  gameProgressionFunction = y => {
    return this.state.a * y + (this.state.b * (1 - this.state.a));
  };

  drawFunctionGraph = data => {
    // set the dimensions and margins of the graph
    var margin = { top: 10, right: 30, bottom: 50, left: 60 };
    var width = 460 - margin.left - margin.right;
    var height = 400 - margin.top - margin.bottom;

    var data = [];
    var yEqualsXLine = [];
    var step = 0.01;
    var intersection = -1;;

    for (let i = 0; i < 1; i += step) {
      data.push({
        x: i,
        y: this.gameProgressionFunction(i)
      });
      yEqualsXLine.push({
        x: i,
        y: i
      });

      if(Math.abs(i - this.gameProgressionFunction(i)) <= 0.05) {
        intersection = i;
      }
    }

    var x = d3
      .scaleLinear()
      .domain([
          0,
          d3.max(data, function(d){
              return d.x;
          })
        ])
      .range([0, width]);
    
    var y = d3
      .scaleLinear()
      .domain([
        0,
        d3.max(data, function(d) {
          return d.y;
        })
      ])
      .range([height, 0]);

    // append the svg object to the body of the page
    var svg = d3
      .select(this.d3Graph.current)
      .append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    svg
      .append("g")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(x));

    svg.append("text")      // text label for the x axis
      .attr("transform", "translate(" + (width / 2) + " ," + (height + margin.bottom) + ")")
      .style("text-anchor", "middle")
      .text("Inter-onset interval");

    svg.append("g").call(d3.axisLeft(y));

    svg.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 0 - margin.left)
        .attr("x",0 - (height / 2))
        .attr("dy", "1em")
        .style("text-anchor", "middle")
        .text("Inter-tap interval");

    let data_point = [];
    if(intersection !== -1) {
       data_point.push({
           x: intersection,
           y: this.gameProgressionFunction(intersection)
       }) ;
    } else {
        data_point.push({
            x: -1,
            y: -1
        })
    }
    
    //Code to add a circle at the intersection point. 
    // svg
    //     .append('circle')
    //     .datum(data_point)
    //     .attr('r', 10)
    //     .attr('fill', 'red')
    //     .attr('cx', function (d) { return d[0].x * width })
    //     .attr('cy', function (d) { return d[0].y * height })

    svg
      .append("path")
      .datum(data)
      .attr("fill", "none")
      .attr("stroke", "red")
      .attr("stroke-width", 1.5)
      .attr(
        "d",
        d3
          .line()
          .x(function(d) {
            return x(d.x);
          })
          .y(function(d) {
            return y(d.y);
          })
      );

    svg
      .append("path")
      .datum(yEqualsXLine)
      .attr("fill", "none")
      .attr("stroke", "green")
      .attr("stroke-width", 1.5)
      .attr(
        "d",
        d3
          .line()
          .x(function(d) {
            return x(d.x);
          })
          .y(function(d) {
            return y(d.y);
          })
      );
  };

  startGame = e => {
    e.preventDefault();
    this.initializeGame();
  };

  handleStorageKey = key => {
    this.setState({
      key
    });
    console.log(key);
  };

  initializeGame = () => {
    this.setState({
      gameStart: true
    });
  };

  render() {
    const { gameStart, key, a, b } = this.state;
    
    const settingsA = {
      start: 0,
      min: -2,
      max: 2,
      step: 0.001,
      onChange: value => {
        this.setState({
          a: value
        });
      }
    };

    const settingsX = {
      start: 0,
      min: -1,
      max: 1,
      step: 0.001,
      onChange: value => {
        this.setState({
          b: value
        });
      }
    };

    return (
      <Grid columns={2} style={{ padding: "2em" }}>
        <Grid.Row>
          <Grid.Column
            verticalAlign="middle"
            textAlign="left"
            style={{ paddingLeft: "1em" }}
          >
            <Segment>
              {gameStart ? (
                <Stage width={WIDTH} height={HEIGHT}>
                  <AppConsumer>
                    {app => (
                      <SensoriBall
                        app={app}
                        window_width={WIDTH}
                        window_height={HEIGHT}
                        a={this.state.a}
                        x={this.state.b}
                        game_type={'custom-a=' + a + 'x=' + b}
                        uploadLocalStorageKey={this.handleStorageKey}
                      />
                    )}
                  </AppConsumer>
                </Stage>
              ) : (
                <p>You must start the game to begin.</p>
              )}
            </Segment>
          </Grid.Column>
          <Grid.Column verticalAlign="middle" textAlign="left">
            <Segment>
              <Container text fluid>
                <p>
                  This is a simple game designed to study how humans and
                  machines interact with each other. Your objective is to simple
                  - press the spacebar everytime the ball hits the bottom of the
                  screen. You are currently playing on the custom setting. Here, you
                  can adjust the parameters of the game yourself. The intersection of the two
                  lines is the "equilibrium" point that the game should reach. You can adjust
                  the values below so that the game diverges instead.
                </p>

                <p>
                  You can access the data about your current game from the home
                  page, where the current game's type, data, and start time will
                  be listed. Your data is stored locally, and is purely meant as
                  a demonstration of the game's underlying principles.
                </p>

                {key && <p>Game key: {key}</p>}

                {!gameStart ? (
                  <React.Fragment>
                    <div ref={this.d3Graph}></div>

                    <div style={{paddingTop: '2em'}}>
                      <p>a = {a.toFixed(2)}</p>

                      <Slider
                        value={a}
                        color="yellow"
                        settings={settingsA}
                        style={{ padding: "1em 0em 3em 0em" }}
                      />

                      <p>b = {b.toFixed(2)}</p>

                      <Slider
                        value={b}
                        color="blue"
                        settings={settingsX}
                        style={{ padding: "1em 0em 3em 0em" }}
                      />

                      <Button onClick={this.startGame} content="Start game" />
                    </div>
                  </React.Fragment>
                ) : (
                  <Link to={"/data/" + key}>View data</Link>
                )}
              </Container>
            </Segment>
          </Grid.Column>
        </Grid.Row>
      </Grid>
    );
  }
}

export default GameWindow;
