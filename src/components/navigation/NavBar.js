import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { Menu, Dropdown } from 'semantic-ui-react'
import * as ROUTES from '../constants/routes'

class NavBar extends Component {
    constructor(props) {
        super(props);
        this.state = {
            activateItem: null
        }
    }

    handleClick = (e, { name }) => {
        this.setState({
            activateItem: name
        })
    }

    render() {
        const { activeItem } = this.state;

        return (
            <div>
                <Menu pointing secondary>
                    <Menu.Menu position='left'>
                        <Menu.Item
                            as={Link}
                            to={ROUTES.HOME}
                            name='home'
                            active={activeItem === 'home'}
                            onClick={this.handleClick}
                        />
                        <Dropdown item pointing text = 'Games'>
                        <Dropdown.Menu >
                            <Dropdown.Item as={Link} to='/game/convergence'>Convergence</Dropdown.Item>
                            <Dropdown.Item as={Link} to='/game/oscillation'>Oscillation</Dropdown.Item>
                            <Dropdown.Item as={Link} to='/game/divergence_a'>Divergence - scenario A</Dropdown.Item>
                            <Dropdown.Item as={Link} to='/game/divergence_b'>Divergence - scenario B</Dropdown.Item>
                        </Dropdown.Menu>
                    </Dropdown>
                    </Menu.Menu>
                    <Menu.Menu position='right'>
                        <Menu.Item
                            as={Link}
                            to={ROUTES.ABOUT}
                            name='about'
                            active={activeItem === 'about'}
                            onClick={this.handleClick}
                        ><b>About</b></Menu.Item>
                    </Menu.Menu>
                </Menu>
            </div>
        )
    }
}

export default NavBar