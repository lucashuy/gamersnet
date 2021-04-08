import React from 'react';

import APIFetch from '../../../utilities/api';

import './styles.css';

export default class ProfileAvatar extends React.Component {
    constructor(props) {
        super(props);

        this.state = {avatar: undefined};

        this.localFetch = this.localFetch.bind(this);
    }

    localFetch() {
        let fetchData = APIFetch('/users/getAvatar/' + this.props.userID);

        fetchData.then(async (data) => {
            if (await data.ok) {
                let image = await data.blob();
                
                this.setState({avatar: URL.createObjectURL(image)});
            } else {
                console.log('profile-avatar', 'network problem happened');
            }
        });
    }

    componentDidMount() {
        this.localFetch();
    }
    
    componentDidUpdate(prevProps) {
        if (prevProps.userID !== this.props.userID) {
            this.localFetch();
        }
    }
    
    render() {
        return (
            <div className = 'profile-image'>
                <img src = {this.state.avatar} id = 'profile-avatar' alt = '' />
            </div>
        );
    }
}