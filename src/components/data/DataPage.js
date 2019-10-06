import React, {Component} from 'react'
import {VictoryBar} from 'victory'

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
        var bounces = data.bounce_times;
        var taps= data.tap_times;
        this.setState({
            asyns: {
                label: 'Asynchronies',
                values: asyns
            },
            bounces: {
                label: 'Bounce times',
                values: bounces
            },
            taps: {
                label: 'Tap times',
                values: taps
            }
        });
    }

    loadVictoryVizData = (data_key) => {
        var data = this.state[data_key].values;
        var formatted = [];
        data.forEach((point, index) => {
            formatted.push({time: index, [data_key]: point});
        })
        return formatted;
    }

    render() {
        return(
            <div>
                <p>Asynchronies</p>
                <VictoryBar 
                    data = {this.loadVictoryVizData('asyns')}
                    x = 'time'
                    y = 'asyns'
                />
                <p>Bounce times</p>
                <VictoryBar 
                    data = {this.loadVictoryVizData('bounces')}
                    x = 'time'
                    y = 'bounces'
                />
                <p>Tap times</p>
                <VictoryBar 
                    data = {this.loadVictoryVizData('taps')}
                    x = 'time'
                    y = 'taps'
                />
            </div>
        )
    }
}

export default DataPage