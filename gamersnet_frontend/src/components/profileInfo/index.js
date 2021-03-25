import React from 'react';

import APIFetch from '../../utilities/api';

import './styles.css';

export default class ProfileInfo extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            status: 0,
            data: {username: 'loading'}
        };

        this.renderDetails = this.renderDetails.bind(this);
        this.renderRank = this.renderRank.bind(this);
    }

    componentDidMount() {
        let fetchData = APIFetch('/users/getUserDetails/' + this.props.userID);

        fetchData.then(async (data) => {
            if (await data.ok) {
                let json = await data.json();
                
                this.props.sendToParent(json);

                this.setState({status: 1, data: json});
            } else if (await data.status === 404) {
                this.setState({data: {username: `404, user ${this.props.userID} not found`}});
            } else {
                console.log('profile-info', 'network problem happened');
            }
        });
    }
    
    renderDetails() {
        let components = [];
        if (this.state.status) {
            let details = this.state.data.details;

            components.push(<div>
                {details.age && <p><b>Age</b>: {details.age}</p>}
            </div>);
            components.push(<div>
                {details.age && <p><b>Games</b>: {details.games}</p>}
            </div>);
            components.push(<div>
                {details.platform && <p><b>Platform</b>: {details.platform}</p>}
            </div>);
            components.push(<div>
                {details.timezone && <p><b>Timezone</b>: {details.timezone}</p>}
            </div>);
        }

        return components;
    }

    renderRank() {
        if (this.state.status) {
            let rank = this.state.data.rankDetail;

            return (
                <div>
                    <p><b>{rank.game}</b></p>
                    <p>{rank.rank}</p>
                </div>
            )
        }
    }

    render() {
        return (
            <div>
                <div className = 'username'>{this.state.data.username || ''}</div>
                <div className = 'info-details-wrapper'>
                    <div className = 'info-details'>
                        {this.renderDetails()}
                    </div>
                    <div className = 'info-rank'>
                        {this.renderRank()}
                    </div>
                </div>
            </div>
        );
    }
}