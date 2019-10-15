import React from 'react'
import {List, Grid, Container, Header} from 'semantic-ui-react'
import {Link} from 'react-router-dom'
import DataList from '../data/DataDirectory'

const GamesList = () => (
    <List link>
        <List.Item as = {Link} to='/game/convergence'>Convergence</List.Item>
        <List.Item as = {Link} to='/game/oscillation'>Oscillation</List.Item>
        <List.Item as = {Link} to='/game/divergence_a'>Divergence - scenario A</List.Item>
        <List.Item as = {Link} to='/game/divergence_b'>Divergence - scenario B</List.Item>
    </List>
)

const Home = () => (
    <Container style={{paddingTop:'5em'}}>
        <Grid columns={2} centered textAlign = 'center'>
            <Grid.Column floated='left'>
                <Header as='h3'>Game modes</Header>
                <GamesList />
            </Grid.Column>
            <Grid.Column floated ='right'>
                <Header as='h3'>Data</Header>
                <DataList />
            </Grid.Column>
        </Grid>
    </Container>    
)

//Data tab
//Games tab

export default Home;

