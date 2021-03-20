import React from 'react';
import ProfileAvatar from '../profileAvatar';

export default class Profile extends React.Component {
    constructor(props) {
        super(props);

        this.state = {edit: false};
    }
    
    render() {
        return (
            <ProfileAvatar userID = {this.props.match.params.id} />
        );
    }
}