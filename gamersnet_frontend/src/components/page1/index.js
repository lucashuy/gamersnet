import React from 'react';
import APIFetch from '../../api';

// this page is similar to Home
export default class Page1 extends React.Component {
    constructor(props) {
        super(props);

        this.state = {data: ''}
    }

    componentDidMount() {
        // turn our JSON object into a string for easy printing
        let fetchData = APIFetch('page1');
        fetchData.then((data) => {
            this.setState({data: JSON.stringify(data)});
        });
    }

    render() {
        return (
            <div>
                <p>this is page 1, the server says: {this.state.data}</p>
            </div>
        );
    }
}