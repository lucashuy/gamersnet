import React from 'react';

import APIFetch from '../../../utilities/api';

import './styles.css';

import post1 from './images/POST_1.png';
import post5 from './images/POST_5.png';
import post10 from './images/POST_10.png';

import age0 from './images/AGE_0.png';
import age7 from './images/AGE_7.png';

const IMAGE_TABLE = {
    POST_1: post1,
    POST_5: post5,
    POST_10: post10,
    AGE_0: age0,
    AGE_7: age7
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
                        <img className = 'achievement-icon' src = {IMAGE_TABLE[achievement.nameInternal]} title = {achievement.description} alt = {achievement.description} />
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