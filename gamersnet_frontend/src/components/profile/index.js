import React from 'react';
import APIFetch from '../../utilities/api';

export default class Password extends React.Component {
    constructor(props) {
        super(props);

        this.state = {avatar: undefined};
    }

    componentDidMount() {
        let fetchData = APIFetch('/users/changePassword', JSON.stringify(body), 'POST');

        fetchData.then(async (data) => {
            if (await data.ok) {
                this.setState({message: 'password changed successfully'});
            } else {
                this.setState({message: 'something went wrong'});
            }
        });
    }
    
    render() {
        return (
            // <img src = ></img>
            <p></p>
        );
    }
}