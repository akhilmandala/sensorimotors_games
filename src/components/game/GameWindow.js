import React, { Component } from 'react';
import { Stage, AppConsumer } from '@inlet/react-pixi'
import SensoriBall from './SensoriBall'

const WIDTH = window.innerWidth;
const HEIGHT = window.innerHeight - 43;

class GameWindow extends Component {
    constructor(props) {
        super(props);

        const game_type = props.match.params.game_type;
        let a, x;

        if(game_type === 'convergence') {
            a = -0.75;
            x = .5;
        } else if (game_type === 'oscillation') {
            a = -1.5;
            x = 1;
        } else if (game_type === 'divergence_a') {
            a = 1;
            x = 1;
        } else if (game_type === 'divergence_b') {
            a = 2;
            x = 0.5;
        }

        this.state = {
            runGame: true,
            a,
            x
        }
    }

    render() {
        return (
            
            <Stage width={WIDTH} height={HEIGHT}>
                <AppConsumer>
                    {app => <SensoriBall app={app} window_width={WIDTH} window_height={HEIGHT} a = {this.state.a} x = {this.state.x} game_type = {this.props.match.params.game_type} />}
                </AppConsumer>
            </Stage>
        )
    }
}

export default GameWindow;