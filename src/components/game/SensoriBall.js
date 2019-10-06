import React, {Component} from 'react'
import {Ball} from './Ball'

const INIT_STATE = {
    duration: 60e3,
    starting_IOI: 1.0,
    velocity: 0,
    last_tap: undefined,
    next_bounce: undefined,
    last_bounce: undefined,
    ITI: undefined,
    IOI: undefined,
    period_estimate: undefined,
    //Data we want to store
    bounce_times: [],
    asynchronies: [],
    tap_times: [],
    period_estimates: [],
}

class SensoriBall extends Component {
    constructor(props) {
        super(props);

        const height = props.window_height;
        const width = props.window_width;

        const a = parseFloat(props.a);
        const x = parseFloat(props.x);
        const b = x * (1 - a);

        const start_time = new Date().getTime();
        const current_date = new Date().getUTCDate();
        const game_type = props.game_type;
        const localStorageKey = 'Dyn Sys Demo, type: ' + game_type + ': ' + current_date + ' ' + start_time; 

        //The state controls the "conditions" of the game and ball placement
        this.state = {
            ...INIT_STATE,
            top: 0,
            bot: height,
            gravity: (8 * (height/2)/(1.0**2)),
            x: width / 2,
            y: height / 2,
            a,
            b,
            start_time,
            localStorageKey
        }

        document.addEventListener("keydown", this.registerUserPress, false);
    }

    componentDidMount() {
        console.log("init");
        this.props.app.ticker.add(this.sensoriTick);
    }

    componentDidUpdate = () => {
        const {localStorageKey} = this.state;
        var {bounce_times, asynchronies, tap_times} = this.state;
        var data_set = {
            bounce_times,
            asynchronies,
            tap_times
        }
        localStorage.setItem(localStorageKey, JSON.stringify(data_set));
    }

    componentWillUnmount() {
        this.props.app.ticker.remove(this.sensoriTick);
    }

    coordTransform = (x, y) => {
        return [x, this.state.bot - y]
    }

    setPos = (x, y) => {
        let xnew, ynew;
        [xnew, ynew] = this.coordTransform(x, y);
        this.setState({
            x: xnew,
            y: ynew
        })
    }

    getPos = () => {
        let x, y;
        [x, y] = this.coordTransform(this.state.x, this.state.y);
        return [x, y];
    }

    registerUserPress = (event) => {
        if(event.keyCode === 32) {
            event.preventDefault();
            var {start_time, last_tap} = this.state;
            var press_time = new Date().getTime() - start_time;
            this.setState({
                tap_times: this.state.tap_times.concat(press_time)
            })
            if (last_tap) {
                this.setState({
                    period_estimate: (0.25 * this.state.period_estimate + 0.75 * (press_time - last_tap) / 1000.0)
                })
            } else {
                this.setState({
                    period_estimate: this.state.starting_IOI
                })
            }
            this.setState({
                last_tap: press_time
            })
        }
    }

    getTaskData = () => {
        var data = {
            asyncs: this.state.asynchronies,
            timestamps: this.state.tap_times,
        };

        return data;
    }

    updateData = () => {
        var this_bounce = new Date().getTime() - this.state.start_time;
        
        this.setState({
            bounce_times: this.state.bounce_times.concat(this_bounce)
        })

        var {last_bounce, tap_times} = this.state;

        if (last_bounce) {
            if(tap_times.length > 0) {
                var last_tap = tap_times[tap_times.length - 1];
                var asyn = 0;
                if(last_tap - last_bounce < this_bounce - last_tap) {
                    asyn = last_tap - last_bounce;
                    this.setState({
                        asynchronies: this.state.asynchronies.concat(asyn)
                    })
                } else {
                    asyn = last_tap - this_bounce;
                    this.setState({
                        asynchronies: this.state.asynchronies.concat(asyn)
                    })
                }
            }
        }

        this.setState({
            last_bounce: this_bounce
        });
    }

    IOIUpdate = () => {
        var dt = this.state.starting_IOI;

        if (this.state.period_estimate) {
            var {a, b, period_estimate} = this.state;
            dt = a * period_estimate + b;
            this.setState({
                dt
            })
        }

        return dt;
    }

    sensoriTick = (delta) => {
        var dt = delta / 60;
        
        let x, y;
        //Retrieve current positions
        [x, y] = this.getPos(this.state.x, this.state.y);
        //Set new position
        this.setPos(x, y + this.state.velocity * dt);
        //Retrieve new positions
        [x, y] = this.getPos(this.state.x, this.state.y);

        if(y - 50 < 0) {
            //collision case
            this.updateData();
            let dt = this.IOIUpdate();
            const min_dt = 0.1;
            const max_dt = 4;
            dt = Math.min(max_dt,Math.max(min_dt,dt));
            this.setPos(x, 50);
            this.setState({
                velocity: this.state.gravity * dt / 2,
                tracker: this.state.tracker + 1
            })
        } else {
            //ballistic update
            this.setState({
                velocity: this.state.velocity - this.state.gravity * dt
            })
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

export default SensoriBall;