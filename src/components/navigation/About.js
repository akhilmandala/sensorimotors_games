import React from "react";
import {
  Container,
  Header,
  Divider,
  List,
  Menu,
  Segment
} from "semantic-ui-react";
import {Link} from 'react-router-dom'

const About = () => (
  <div>
    <Container text style={{ marginTop: "3em" }}>
      <Header as="h1">
        Sensorimotor games development
      </Header>

      <Divider />

      <p>
        This website contains several different videogames that leverage a variety of frameworks
        to study human-computer interaction. The code can be found <a href='https://github.com/akhilmandala/sensorimotors_games'>here</a>.
      </p>

      <p>As of December 2019, there is a: </p>
      <ul>
        <li><Link to='/custom'>Bouncing ball game</Link> (dynamical systems theory)</li>
        <li><Link to='/tracker'>Reference tracking game</Link> (feedforward + feedback learning)</li>
        <li><Link to='/cost-minimization'>Tone adjustment game </Link> (cost minimization) </li>
      </ul>

      <p>
        If you have any questions, email me at amvinnu@uw.edu.
      </p>
    </Container>
  </div>
);

export default About;
