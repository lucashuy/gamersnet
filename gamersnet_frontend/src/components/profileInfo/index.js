import React from 'react';

import APIFetch from '../../utilities/api';

import './styles.css';

export default class ProfileInfo extends React.Component {
    constructor(props) {
        super(props);

        this.state = {data: []};
    }

    componentDidMount() {
        let fetchData = APIFetch('/users/getUserDetails/' + this.props.userID);

        fetchData.then(async (data) => {
            if (await data.ok) {
                let json = await data.json();

                this.setState({data: json});
            } else {
                console.log('profile-info', 'network problem happened');
            }
        });
    }
    
    render() {
        return (
            <div className = 'profile-info'>
                <div className = 'username'>{this.state.data.username || ''}</div>
            </div>
        );
    }
}