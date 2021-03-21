import React from 'react';
import Input from '../input';

import './styles.css';

export default class ProfileChangeDetails extends React.Component {
    render() {
        return (
            <div style = {{width: '100%'}}>
                <div className = 'profile-header'>Change Details</div>
                <div className = 'profile-details-change-wrapper'>
                    <div>
                        <p>Age</p>
                        <Input id = 'age' placeholder = 'eg. 10'/>
                    </div>
                    <div>
                        <p>Platform</p>
                        <Input id = 'platform' placeholder = 'eg. PC, Console, Mobile'/>
                    </div>
                    <div>
                        <p>Timezone</p>
                        <Input id = 'timezone' placeholder = 'eg. UTC - 6, Winnipeg Time, CST'/>
                    </div>
                    <div>
                        <p>Game Interests</p>
                        <Input id = 'games' placeholder = 'eg. Call of Duty, BTD6, Dota 2'/>
                    </div>
                </div>
            </div>
        );
    }
}