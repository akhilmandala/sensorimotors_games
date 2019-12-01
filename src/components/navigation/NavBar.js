import React, { Component } from "react";
import { Link } from "react-router-dom";
import { Menu, Dropdown, Header } from "semantic-ui-react";
import * as ROUTES from "../constants/routes";
import styled from "styled-components";

class NavBar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      activateItem: null
    };
  }

  handleClick = (e, { name }) => {
    this.setState({
      activeItem: name
    });
  };

  render() {
    const { activeItem } = this.state;

    return (
      <div>
        <Menu secondary>
          <Menu.Item
            as={Link}
            to={ROUTES.HOME}
            name="home"
            active={activeItem === "home"}
            onClick={this.handleClick}
            style={{paddingLeft: '2em', paddingTop: '2em'}}
          >
            <Header as="h3">Sensorimotor Games</Header>
          </Menu.Item>
          <Menu.Menu position="right">
            <Menu.Item
              as={Link}
              to={ROUTES.ABOUT}
              name="about"
              active={activeItem === "about"}
              onClick={this.handleClick}
              style={{paddingRight: '2em', paddingTop: '2em'}}
            >
              <Header as="h3">About</Header>
            </Menu.Item>
          </Menu.Menu>
        </Menu>
      </div>
    );
  }
}

export default NavBar;
