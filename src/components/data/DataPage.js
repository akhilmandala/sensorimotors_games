import React, {Component} from 'react'
import { Grid, Container, Checkbox, Segment } from "semantic-ui-react";
import Plot from "react-plotly.js";

class DataPage extends Component {
    constructor(props){
        super(props);
        this.state = {
            key: props.match.params.key,
            show_topological: false,
        }
    }

    UNSAFE_componentWillMount = () => {
        var data = localStorage.getItem(this.state.key);
        data = JSON.parse(data);
        this.setState({
            async_y: data.asyncs,
            async_x: data.timestamps,
            gameData: data,
            IOIs: data.IOIs,
            ITIs: data.ITIs,
        })
    }

    handleTopologicalToggle = (event) => {
        this.setState({
            show_topological: !this.state.show_topological
        })
    }

    render() {
        //Initialize plotly.js viz
        var topological_trace = {
            x: this.state.IOIs,
            y: this.state.ITIs,
            name: 'density',
            ncontours: 20,
            colorscale: 'YIGnBu',
            reversescale: true,
            showscale: false,
            type: 'histogram2dcontour'
        }

        var point_trace = {
            x: this.state.IOIs,
            y: this.state.ITIs,
            type: "scatter",
            mode: "lines+markers",
            marker: { color: "red" }
        }

        var coadaptation_data = [point_trace]

        if (this.state.show_topological) {
            coadaptation_data = [topological_trace, point_trace]
        }

        //Use a stem plot
        var async_data = [
            {
              x: this.state.async_x,
              y: this.state.async_y,
              type: "scatter",
              mode: "markers",
              marker: { color: "blue" }
            }
        ]

        return(
            <div>
                <Container>
                    <Grid centered>
                        <Grid.Row style={{padding: '3em'}} >
                            <Segment verticalAlign='middle'>
                                <Plot
                                    style={{padding: '0em 0em 0em 1.5em'}}
                                    data={coadaptation_data} 
                                    layout={ {width: 800, height: 500, title: 'Game progression', xaxis: {title: {text: 'Inter-onset interval'}}, yaxis: {title: {text: 'Inter-tap interval'}}} }
                                />
                                <Checkbox onClick={this.handleTopologicalToggle} label='Toggle a toplogical view'/>
                            </Segment>
                        </Grid.Row>
                        <Grid.Row textAlign='center'>
                            <Segment verticalAlign='middle'>
                                <Plot
                                    style={{padding: '0em 0em 0em 1.5em'}}
                                    data={async_data} 
                                    layout={ {width: 800, height: 500, title: 'Asynchronies', xaxis: {title: {text: 'timestamps'}}, yaxis: {title: {text: 'asynchronies'}}} }
                                />
                            </Segment>
                        </Grid.Row>
                    </Grid>
                </Container>
            </div>
        )
    }
}

export default DataPage