import React from 'react';

import APIFetch from '../../../utilities/api';

import './styles.css';

const IMAGE_TABLE = {
    POST_1: 'fas fa-pen',
    POST_5: 'fas fa-sticky-note',
    POST_10: 'fas fa-book',
    AGE_0: 'fas fa-birthday-cake',
    AGE_7: 'fas fa-calendar-week'
}

export default class ProfileAchievements extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            achievements: []
        };

        this.localFetch = this.localFetch.bind(this);
    }

    localFetch() {
        let fetchData = APIFetch('/users/getAchievements/' + this.props.userID);

        fetchData.then(async (data) => {
            if (await data.ok) {
                let json = await data.json();
                
                let newElements = [];

                for (let achievement of json.achievements) {
                    newElements.push(
                        <div className = {`achievement-icon ${IMAGE_TABLE[achievement.nameInternal]}`} title = {achievement.description} alt = {achievement.description} />
                    )
                }

                this.setState({achievements: newElements});
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
            <div className = 'achievement-wrapper'>
                {this.state.achievements}
            </div>
        );
    }
}
