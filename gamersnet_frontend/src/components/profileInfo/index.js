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

        this.renderTable = this.renderTable.bind(this);
    }

    componentDidMount() {
        let fetchData = APIFetch('/users/getUserDetails/' + this.props.userID);

        fetchData.then(async (data) => {
            if (await data.ok) {
                let json = await data.json();
                
                this.props.sendToParent(json.details);

                this.setState({status: 1, data: json});
            } else if (await data.status === 404) {
                this.setState({data: {username: `404, user ${this.props.userID} not found`}});
            } else {
                console.log('profile-info', 'network problem happened');
            }
        });
    }
    
    renderTable() {
        // TODO: finish me
        console.log(this.state.data);
        if (this.state.status) {
            let details = this.state.details;
            return <div>
                {details.age && <p><b>Age</b>: {details.age}</p>}
            </div>
        }
    }

    render() {
        return (
            <div className = 'profile-info'>
                <div className = 'username'>{this.state.data.username || ''}</div>
                {this.renderTable()}
            </div>
        );
    }
}