import React from 'react'
import {List} from 'semantic-ui-react'
import {Link} from 'react-router-dom'

const Home = () => (
    <List link>
        <List.Item as = {Link} to='/game/convergence'>Convergence</List.Item>
        <List.Item as = {Link} to='/game/oscillation'>Oscillation</List.Item>
        <List.Item as = {Link} to='/game/divergence_a'>Divergence - scenario A</List.Item>
        <List.Item as = {Link} to='/game/divergence_b'>Divergence - scenario B</List.Item>
    </List>
)

export default Home;