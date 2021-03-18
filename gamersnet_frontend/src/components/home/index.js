import React from 'react';

// include our API helper
import APIFetch from '../../utilities/api';

// include our reusable "BlueBox" component
import BlueBox from './BlueBox';

export default class Home extends React.Component {
    constructor(props) {
        super(props);

        // define an initial state for our data we will fetch
        this.state = {data: []};
    }

    // this function will be automatically called when react creates this "Home" object in the browser
    componentDidMount() {
        // create a temporary variable to hold our "promise"
        let fetchData = APIFetch('/');

        // when our promise gets fulfilled, we "then" act on it and save it
        fetchData.then(async (response) => {
            let data = await response.json();
            this.setState({data: data.numbers});
        });
    }

    render() {
        // here we return some more JSX
        // we have a loop that goes through the numbers that the server gave us and make some blue boxes with it
        // we access the data by using "this.state.data", this data was set above
        // "this.state.data" is an array of numbers, thus we can use map() on it
        // youll notice that in <BlueBox number = .... />, "number" is a "property" that gets passed to BlueBox
        return (
            <div>
                <p>this is the main page, the server gives us these numbers:</p>
                {
                    this.state.data.map((num) => {
                        return <BlueBox number = {num} />
                    })
                }
            </div>
        );
    }
}