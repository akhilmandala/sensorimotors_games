import { Graphics, Sprite } from 'pixi.js'
import { PixiComponent, AppConsumer } from '@inlet/react-pixi'
import React, {Component} from 'react'

const Ball = PixiComponent('Ball', {
    create: props => {
        return new Graphics()
    },

    didMount: (instance, parent) => {
        
    },

    willUnmount: (instance, parent) => {
        // clean up before removal
    },

    applyProps: (instance, oldProps, newProps) => {
        const { fill, x, y, radius } = newProps;
        instance.clear();
        instance.beginFill(fill);
        instance.drawCircle(x, y, radius);
        instance.endFill();
    }
})

class BouncingBall extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            acceleration: 1.2,
            velocity: 5,
            direction: -1,
            y: props.y,
            x: props.x,
            MAX_HEIGHT: props.y * 2,
            MIN_HEIGHT: 0,
        }
    }

    componentDidMount() {
        this.props.app.ticker.add(this.tick);
    }

    componentWillUnmount() {
        this.props.app.ticker.remove(this.tick);
    }

    tick = (delta) => {
        const {y, MAX_HEIGHT, MIN_HEIGHT} = this.state;

        if(y >= MIN_HEIGHT && y <= MAX_HEIGHT) {
            this.setState(state => ({
                // velocity: state.velocity + state.acceleration,
                y: state.y + state.direction * state.velocity,
            }))
        } else if (y < MIN_HEIGHT) {
            console.log('bot collision at ' + y);
            this.setState(state => ({
                direction: 1,
                y: 1
            }))
        } else if (y > MAX_HEIGHT) {
            console.log('top collision at ' + y);
            this.setState(state => ({
                direction: -1,
                y: MAX_HEIGHT - 1
            }))
        }
    }

    render() {
        return(
            <Ball 
                x={this.state.x}
                y={this.state.y}
                radius={50} 
                fill={0xff0000}
            />
        )
    }

}

export default BouncingBall