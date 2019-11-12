import React from 'react'
import {List, Grid, Container, Header, Segment} from 'semantic-ui-react'
import {Link} from 'react-router-dom'
import DataList from '../data/DataDirectory'

const GamesList = () => (
    <Segment>
        <List link>
            <List.Header style={{paddingBottom: '1em'}}>Dynamical systems demonstration</List.Header>
            <List.Item as = {Link} to='/game/convergence'>Convergence</List.Item>
            <List.Item as = {Link} to='/game/oscillation'>Oscillation</List.Item>
            <List.Item as = {Link} to='/game/divergence_a'>Divergence - scenario A</List.Item>
            <List.Item as = {Link} to='/game/divergence_b'>Divergence - scenario B</List.Item>
            <List.Item as = {Link} to='/custom'>Custom</List.Item>
            <List.Header style={{paddingBottom: '1em', paddingTop: '1em'}}>Reference Tracking</List.Header>
            <List.Item as = {Link} to='/tracker'>Base game</List.Item>
        </List>
    </Segment>
)

const Home = () => (
    <Container style={{paddingTop:'5em'}}>
        <Grid columns={1} centered textAlign = 'center'>
            <Grid.Column floated='left'>
                <Header as='h3'>Games</Header>
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

