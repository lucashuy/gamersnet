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
import ProfileAchievements from '../profileAchievements';
import ProfileRankChange from '../profileRankChange';
import ProfileRatings from '../profileRatings';

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
            data: undefined,
            userID: this.props.match.params.id
        };

        this.editProfile = this.editProfile.bind(this);
        this.sendDataToParent = this.sendDataToParent.bind(this);
        this.renderPosts = this.renderPosts.bind(this);
        this.renderAvatarChange = this.renderAvatarChange.bind(this);
        this.renderDetailsChange = this.renderDetailsChange.bind(this);
        this.renderPasswordChange = this.renderPasswordChange.bind(this);
        this.renderRankChange = this.renderRankChange.bind(this);
        this.renderRatings = this.renderRatings.bind(this);
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
                    <ProfileChangeDetails data = {this.state.data.details} />
                </RoundedBox>
            );
        }
    }

    renderRankChange() {
        if (this.state.us && this.state.edit) {
            return (
                <RoundedBox className = 'row'>
                    <ProfileRankChange data = {this.state.data.rankDetail} />
                </RoundedBox>
            );
        }
    }

    renderPosts() {
        if (!this.state.edit && this.state.data) {
            return (
                <RoundedBox className = 'row'>
                    <DisplayPosts />
                </RoundedBox>
            );
        }
    }

    renderRatings() {
        if (!this.state.edit && this.state.data) {
            return (
                <RoundedBox className = 'row'>
                    <ProfileRatings userID = {this.state.userID} />
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
                        <ProfileAvatar userID = {this.state.userID} />
                        {this.renderAvatarChange()}
                    </div>
                    <div className = 'profile-info'>
                        <ProfileInfo userID = {this.props.match.params.id} sendToParent = {this.sendDataToParent} />
                        <ProfileAchievements userID = {this.state.userID} />
                    </div>
                </RoundedBox>

                {this.renderRatings()}
                {this.renderPosts()}

                {this.renderPasswordChange()}
                {this.renderDetailsChange()}
                {this.renderRankChange()}
            </div>
        );
    }
}