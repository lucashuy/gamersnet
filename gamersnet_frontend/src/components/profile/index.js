import React from 'react';

import ProfileAvatar from '../profileAvatar';
import ProfileInfo from '../profileInfo';
import RoundedBox from '../roundedBox';
import Button from '../button';

import './styles.css';
import ProfilePassword from '../profilePassword';

const EDIT_BUTTON_TEXT = {
    EDIT: 'edit profile',
    RETURN: 'return to profile'
};

export default class Profile extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            edit: false,
            us: localStorage.getItem('id') === this.props.match.params.id,
            editButtonText: EDIT_BUTTON_TEXT.EDIT
        };

        this.editProfile = this.editProfile.bind(this);
    }
    
    editProfile(event) {
        if (this.state.us) {
            if (this.state.edit) {
                this.setState({
                    edit: false,
                    editButtonText: EDIT_BUTTON_TEXT.EDIT
                });
            } else {
                this.setState({
                    edit: true,
                    editButtonText: EDIT_BUTTON_TEXT.RETURN
                });
            }
        }

        event.preventDefault();
    }

    passwordChange() {
        if (this.state.us && this.state.edit) {
            return <ProfilePassword />
        }
    }

    render() {
        return (
            <div className = 'profile'>
                {this.state.us && <Button className = 'normal edit-button' onClick = {this.editProfile}>{this.state.editButtonText}</Button>}

                <RoundedBox className = 'row'>
                    <ProfileAvatar userID = {this.props.match.params.id} />
                    <ProfileInfo userID = {this.props.match.params.id} />
                </RoundedBox>

                <RoundedBox className = 'row'>
                    {this.passwordChange()}
                </RoundedBox>
            </div>
        );
    }
}