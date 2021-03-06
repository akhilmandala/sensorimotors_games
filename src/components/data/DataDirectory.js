import React, { Component } from "react";
import { List, Button, Segment } from "semantic-ui-react";
import { Link } from "react-router-dom";

class DataDirectory extends Component {
  constructor(props) {
    super(props);
    const keys = Object.keys(localStorage);
    this.state = {
      keys
    };
  }

  deleteLocalStorage = e => {
    e.preventDefault();
    localStorage.clear();
    this.setState({
      keys: Object.keys(localStorage)
    });
  };

  render() {
    const { keys } = this.state;
    const key_links = keys.map(key => {
      switch (key.substring(0, 3)) {
        case "Dyn":
          return (
            <List.Item as={Link} to={"/data/" + key}>
              {key}
            </List.Item>
          );
        case "ref":
          return (
            <List.Item as={Link} to={"/reference-data/" + key}>
              {key}
            </List.Item>
          );
        default:
          return null;
      }
    });

    return (
      <div>
        <List>
          {key_links.length > 0 ? key_links : <p>You have no data.</p>}
        </List>
        <Button onClick={this.deleteLocalStorage} content="Clear data" />
      </div>
    );
  }
}

export default DataDirectory;
