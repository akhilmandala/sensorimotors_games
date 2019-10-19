import React from "react";
import {
  Container,
  Header,
  Divider,
  List,
  Menu,
  Segment
} from "semantic-ui-react";

const About = () => (
  <div>
    <Container text style={{ marginTop: "7em" }}>
      <Header as="h1">
        Sensorimotor games development
        <Header.Subheader>
          Brought to you by the UW BioRobotics Lab!
        </Header.Subheader>
      </Header>

      <Divider />

      <p>
        This website hosts a variety of simple games meant to study
        human-computer interaction. One phenomenon we study to better understand
        this interaction is sensorimotor synchronization (SMS). Humans
        synchronize with each other all the time - a round of applause, musical
        performances, sports games, etc. The act of synchronization can yield a
        wealth of information on how human's interact with outside stimuli and
        the strategies we employ to adapt to our environments.
      </p>

      <p>
        The process of synchronizing with an auditory or visual cue is well-
        documented. However, this interaction, "accounts for only a small
        proportion of all SMS activities in daily life," but research on SMS has
        focused, "almost exclusively" on these instances [1]. Our research aims
        to study peer-to-peer instances of SMS, and use this phenomenon as a
        launchpad to improve our understanding of human-machine interaction. One
        way this interaction can be studied in a research environment is by
        setting up a machine to act as a second human by changing its behavior
        in response to human action.
      </p>

      <p>
        The bouncing ball game is a simple example of this. When the player taps
        the ball, an ITI (Inter-Tap interval) is recorded. Based on this
        interval and how far off the player was from syncing with the machine,
        the game state can progress in different ways - the ball's bouncing
        period can increase or decrease based on how the machine reacts to the
        player.
      </p>

      <p>
        If you have any questions, email me at amvinnu@uw.edu.
      </p>
    </Container>
  </div>
);

export default About;
