import React from 'react';

import ProfileAvatar from '../profileAvatar';
import ProfileInfo from '../profileInfo';
import RoundedBox from '../roundedBox';
import Button from '../button';

import './styles.css';
import ProfileChangePassword from '../profileChangePassword';
import ProfileChangeAvatar from '../profileChangeAvatar';
import ProfileChangeDetails from '../profileChangeDetails.js';
import DisplayPosts from '../displayPosts';

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
            editButtonText: EDIT_BUTTON_TEXT.EDIT,
            data: undefined
        };

        this.editProfile = this.editProfile.bind(this);
        this.sendDataToParent = this.sendDataToParent.bind(this);
        this.renderPosts = this.renderPosts.bind(this);
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

    renderPasswordChange() {
        if (this.state.us && this.state.edit) {
            return (
                <RoundedBox className = 'row'>
                    <ProfileChangePassword />
                </RoundedBox>
            );
        }
    }

    renderAvatarChange() {
        if (this.state.us && this.state.edit) {
            return <ProfileChangeAvatar />
        }
    }

    renderDetailsChange() {
        if (this.state.us && this.state.edit) {
            return (
                <RoundedBox className = 'row'>
                    <ProfileChangeDetails data = {this.state.data} />
                </RoundedBox>
            );
        }
    }

    renderPosts() {
        if (!this.state.edit) {
            return (
                <RoundedBox className = 'row'>
                    <DisplayPosts />
                </RoundedBox>
            );
        }
    }

    sendDataToParent(data) {
        this.setState({data: data});
    }

    render() {
        return (
            <div className = 'profile'>
                {
                    this.state.data && this.state.us &&
                    <Button className = 'normal edit-button' onClick = {this.editProfile}>{this.state.editButtonText}</Button>
                }

                <RoundedBox className = 'row'>
                    <div className = 'profile-image-wrapper'>
                        <ProfileAvatar userID = {this.props.match.params.id} />
                        {this.renderAvatarChange()}
                    </div>
                    <ProfileInfo userID = {this.props.match.params.id} sendToParent = {this.sendDataToParent} />
                </RoundedBox>

                {this.renderPosts()}

                {this.renderPasswordChange()}
                {this.renderDetailsChange()}
            </div>
        );
    }
}