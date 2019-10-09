import React, {Component} from 'react'

class DevPlot extends Component {
    constructor(props) {
        super(props);
        this.state = {

        }
    }
    
    UNSAFE_componentWillMount = () => {
        window.addEventListener('storage', function(e) {
            console.log(
                'storage change'
            )
        })
    }

    render() {
        return(
            <h1>test</h1>
        )
    }
}

export default DevPlot