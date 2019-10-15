import React, { Component } from 'react';
import { Stage, AppConsumer } from '@inlet/react-pixi'
import SensoriBall from './SensoriBall'
import {Grid, Segment, Button, Container} from 'semantic-ui-react'
import {Link} from 'react-router-dom'

const WIDTH = window.innerWidth / 2.2;
const HEIGHT = window.innerHeight - 100;

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
            x,
            game_type,
            gameStart: false,
        }

        this.gameColumn = React.createRef();
    }

    componentDidMount = () => {
        console.log(this.gameColumn);
    }

    startGame = (e) => {
        e.preventDefault();
        this.initializeGame();
    }

    handleStorageKey = (key) => {
        this.setState({
            key
        })
        console.log(key);
    }

    initializeGame = () => {
        this.setState({
            gameStart: true
        })
    }

    render() {
        const {gameStart, key} = this.state;

        return (
            <Grid columns={2}>
                <Grid.Row>
                    <Grid.Column>
                        <Segment>
                            {gameStart ? (
                                <Stage width={WIDTH} height={HEIGHT}>
                                    <AppConsumer>
                                        {app => <SensoriBall app={app} window_width={WIDTH} window_height={HEIGHT} a = {this.state.a} x = {this.state.x} game_type = {this.props.match.params.game_type} uploadLocalStorageKey={this.handleStorageKey}/>}
                                    </AppConsumer>
                                </Stage>
                            ) : (
                                <p>You must start the game to begin.</p>
                            )}
                        </Segment>
                    </Grid.Column>
                    <Grid.Column verticalAlign='middle' textAlign = 'left'>
                        <Container text>
                            <p>
                                This is a simple game designed to study how humans and machines interact
                                with each other. Your objective is to simple - press the spacebar everytime
                                the ball hits the bottom of the screen. You are currently playing on the 
                                {" "} {this.state.game_type} {" "} setting.
                            </p>

                            <p>
                                You can access the data about your current game from the home page, where
                                the current game's type, data, and start time will be listed. Your data is
                                stored locally, and is purely meant as a demonstration of the game's underlying
                                principles.
                            </p>
                            
                            {key && <p>Game key: {key}</p>}

                            {!gameStart ? (
                                <Button onClick = {this.startGame} content='Start game'/>
                            ) : (
                                <Link to = {'/data/' + key}>View data</Link>
                            )} 
                        </Container>
                    </Grid.Column>
                </Grid.Row>
            </Grid>
        )
    }
}

export default GameWindow;