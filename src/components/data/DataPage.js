import React, {Component} from 'react'
import {VictoryBar} from 'victory'
import Plot from 'react-plotly.js'

class DataPage extends Component {
    constructor(props){
        super(props);
        this.state = {
            key: props.match.params.key
        }
    }

    componentWillMount = () => {
        this.loadData(this.state.key);
    }

    loadData = (key) => {
        var data = JSON.parse(localStorage.getItem(key));
        var asyns = data.asynchronies;
        var periods = data.period_estimates;
        this.setState({
            asyns: {
                label: 'Asynchronies',
                values: asyns
            },
            periods: {
                label: 'Period Estimates',
                values: periods
            }
        });
    }

    formatData = (data_key) => {
        var data = this.state[data_key].values;
        var formatted = [];
        data.forEach((point, index) => {
            formatted.push({time: index, [data_key]: point});
        })
        console.log(formatted)
        return formatted;
    }

    formatPlotlyData = (data_key) => {
        let x = [];
        let y = [];
        this.state[data_key].values.forEach((dataPoint, index) => {
            x.push(index);
            y.push(dataPoint);
        })
        console.log(y);
        return [x, y]
    }

    render() {
        return(
            <div>
                <p>{this.formatPlotlyData('asyns')}</p>
            </div>
        )
    }
}

export default DataPage