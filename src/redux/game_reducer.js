import {UPDATE_POSITION, UPDATE_VELOCITY, UPDATE_ACCELERATION} from './actions'
import {combineReducers} from 'redux'

const initialState = {
    referenceParamaters: {
        position: 0,
        velocity: 0,
        acceleration: 0,
    }
}

function referenceParameters(state = {}, action) {
    switch(action.type) {
        case UPDATE_POSITION:
            console.log(action.new_position)
            return {
                ...state,
                position: action.new_position
            }
        case UPDATE_VELOCITY: 
            return {
                ...state,
                velocity: action.new_velocity
            }
        case UPDATE_ACCELERATION:
            return {
                ...state,
                acceleration: action.new_acceleration
            }
        default:
            return state
    }
}

const gameReducer = combineReducers({
    referenceParameters
})

export default gameReducer