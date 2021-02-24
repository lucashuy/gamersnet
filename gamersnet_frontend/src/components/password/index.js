import React from 'react';
import APIFetch from '../../api';

export default class Password extends React.Component {
    constructor(props) {
        super(props);

        this.state = {data: ''}
    }

    componentDidMount() {
        let fetchData = APIFetch('page2');
        fetchData.then((data) => {
            this.setState({data: JSON.stringify(data)});
        });
    }

    render() {
        return (
            <div>
                <p>this is page 2 and the server says: {this.state.data}</p>
            </div>
        );
    }
}