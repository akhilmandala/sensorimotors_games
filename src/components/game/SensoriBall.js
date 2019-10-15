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
    press_index: 0,
    counter: 0,
    bounce_counter: 0,
    IOIs: [],
    ITIs: [],
}

//This is so react doesn't break - the count tracker makes sure the state is updated only when the data actually changes (a tap)
var COUNT_TRACKER = 0;

/**
 * Sensoriball class, requires a game_type, alpha and beta values (a, x)
 */
class SensoriBall extends Component {
    constructor(props) {
        super(props);

        const height = props.window_height;
        const width = props.window_width;

        const a = parseFloat(props.a);
        const x = parseFloat(props.x);
        const b = x * (1 - a);

        const start_time = new Date().getTime();
        const current_date = new Date().toDateString();
        
        var today = new Date();
        var seconds = today.getSeconds();

        if(seconds < 10) {
            seconds = '0' + seconds
        }

        var keyTime = today.getHours() + ":" + today.getMinutes() + ":" + seconds;

        const game_type = props.game_type;
        const localStorageKey = 'Dyn Sys Demo, type: ' + game_type + ': ' + current_date + ' ' + keyTime;

        if(this.props.uploadLocalStorageKey) {
            this.props.uploadLocalStorageKey(localStorageKey);
        }

        console.log(this.props.gameStart)
        console.log(start_time);
        console.log(current_date);

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

        document.addEventListener("keydown", this.updatePressData, false);
    }

    componentDidMount() {
        console.log("init");
        this.props.app.ticker.add(this.sensoriTick);
        this.props.uploadLocalStorageKey(this.state.localStorageKey);
    }

    componentDidUpdate = () => {
        const {localStorageKey, counter} = this.state;
        if(counter !== COUNT_TRACKER) {
            COUNT_TRACKER++;
            console.log('updated!')
            let timestamps = this.state.tap_times;
            let asyns = this.state.asynchronies;

            if(timestamps.length !== 0 && asyns.length !== 0) {
                var data = {
                    asyncs: this.state.asynchronies,
                    timestamps: this.state.tap_times,
                    ITIs: this.state.ITIs,
                    IOIs: this.state.IOIs
                };
        
                localStorage.setItem(localStorageKey, JSON.stringify(data));
        
                if(this.props.updateGraph) {
                    this.props.updateGraph();
                }
            }
        }
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

    /**
     * Registers last press time - if a last tap exists, the new period estimated is calculated using the current press time and the last tap. Otherwise,
     * The new period is estimated using the starting IOI.
     */
    updatePressData = (event) => {
        if(event.keyCode === 32) {
            if(!event.repeat) {
                event.preventDefault();
                //Calculate the current press time.
                var {start_time, last_tap, counter} = this.state;
                counter++;
                var press_time = new Date().getTime() - start_time;
                let ITI;

                //Update the tap_times array, the last_tap variable (new press_time), period estimate, and period estimates array.
                if (last_tap) {
                    ITI = press_time - last_tap;
                    var new_period_estimate = (0.25 * this.state.period_estimate + 0.75 * (press_time - last_tap) / 1000.0)
                    this.setState({
                        tap_times: this.state.tap_times.concat(press_time),
                        last_tap: press_time,
                        period_estimate: new_period_estimate,
                        period_estimates: this.state.period_estimates.concat(new_period_estimate),
                        counter,
                        ITIs: this.state.ITIs.concat(ITI),
                    })
                } else {
                    ITI = press_time;
                    this.setState({
                        tap_times: this.state.tap_times.concat(press_time),
                        period_estimate: this.state.starting_IOI,
                        period_estimates: this.state.period_estimates.concat(this.state.starting_IOI),
                        last_tap: press_time,
                        counter,
                        ITIs: this.state.ITIs.concat(ITI),
                    })
                }
            }
        }
    }

    /**
     * Updates the bounce data whenever the ball bounces - asynchronies are calculated using the last tap and last bounce.
     */
    updateBounceData = () => {
        var this_bounce = new Date().getTime() - this.state.start_time;
        var {last_bounce, bounce_counter, last_tap} = this.state;

        if (last_bounce) {
            var IOI = this_bounce - last_bounce;
            if(last_tap) {
                if (this_bounce - last_tap <= 2500) {
                    let asyn = 0;
                    if(last_tap - last_bounce < this_bounce - last_tap) {
                        asyn = last_tap - last_bounce;
                        this.setState({
                            asynchronies: this.state.asynchronies.concat(asyn),
                            bounce_times: this.state.bounce_times.concat(this_bounce),
                            last_bounce: this_bounce,
                            bounce_counter: bounce_counter + 1,
                            IOIs: this.state.IOIs.concat(IOI),
                        })
                    } else {
                        asyn = last_tap - this_bounce;
                        this.setState({
                            asynchronies: this.state.asynchronies.concat(asyn),
                            bounce_times: this.state.bounce_times.concat(this_bounce),
                            last_bounce: this_bounce,
                            bounce_counter: bounce_counter + 1,
                            IOIs: this.state.IOIs.concat(IOI),
                        })
                    }
                } else {
                    console.log('TOO LONG')
                }
            }
        } else {
            this.setState({
                last_bounce: this_bounce,
                bounce_counter: bounce_counter + 1,
                IOIs: this.state.IOIs.concat(this.state.starting_IOI),
            })
        } 
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
            this.updateBounceData();
            let dt = this.IOIUpdate();
            const min_dt = 0.1;
            const max_dt = 4;
            dt = Math.min(max_dt,Math.max(min_dt,dt));
            this.setPos(x, 90);
            this.setState({
                velocity: this.state.gravity * dt / 2,
                tracker: this.state.tracker + 1,
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