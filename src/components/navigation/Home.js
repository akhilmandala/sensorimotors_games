import React from "react";
import {
  List,
  Grid,
  Container,
  Header,
  Divider,
  Card,
  Image
} from "semantic-ui-react";
import { Link } from "react-router-dom";
import DataList from "../data/DataDirectory";
import reference_tracking from "./pictures/reference_tracking_screenshot.png";
import dynamical_systems from "./pictures/dynamical_systems_screenshot.png";
import cost_minimization from "./pictures/cost_minimization_screenshot.png";

const GamesList = () => (
  <List link>
    <List.Item as={Link} to="/custom">
      Dynamical systems demonstration
    </List.Item>
    <List.Item as={Link} to="/tracker">
      Reference Tracking
    </List.Item>
    <List.Item as={Link} to="/cost-minimization">
      Cost minimization
    </List.Item>
  </List>
);

const GamesListPretty = () => (
  <Card.Group itemsPerRow={3}>
    <Card  as={Link} to='/custom'>
      <Card.Content>
        <Image src={dynamical_systems} size="large" />
        <Card.Header style={{paddingTop: '0.5em'}}>Dynamical Systems</Card.Header>
        <Card.Description>Press your spacebar at the same time as the ball bounce.</Card.Description>
      </Card.Content>
    </Card>
    <Card as={Link} to='/tracker'>
      <Card.Content>
        <Image src={reference_tracking} size="large" />
        <Card.Header style={{paddingTop: '0.5em'}}>Reference Tracking</Card.Header>
        <Card.Description>Adjust the acceleration of the ball to remain on the path.</Card.Description>
      </Card.Content>
    </Card>
    <Card as={Link} to='/cost-minimization'>
      <Card.Content>
        <Image src={cost_minimization} size="large" />
        <Card.Header style={{paddingTop: '0.5em'}}>Cost minimization</Card.Header>
        <Card.Description>Take actions to reduce the tone.</Card.Description>
      </Card.Content>
    </Card>
  </Card.Group>
);

const Home = () => (
  <Container style={{ paddingTop: "2em" }}>
    <Grid columns={1} centered textAlign="center" padded="horizontally">
      <Grid.Column floated="left">
        <Header as="h4">Games</Header>
        <Divider />
        <GamesListPretty />
      </Grid.Column>
      <Grid.Column>
        <Header as="h4" style={{ paddingTop: "2em" }}>
          Data
        </Header>
        <Divider />
        <DataList />
      </Grid.Column>
    </Grid>
  </Container>
);

//Data tab
//Games tab

export default Home;
