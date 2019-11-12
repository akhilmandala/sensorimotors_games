import {createStore} from 'redux'
import game_reducer from './game_reducer'

const store = createStore(game_reducer)