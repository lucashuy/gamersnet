import React from 'react';

export default class BlueBox extends React.Component {
    render() {
        // this component is specific to our Home page
        // here notice that we access "this.props.number"
        // recall from our Home class we gave it a number by doing "number = ...." when creating the component
        return (
            <div style = {{background: 'lightblue', padding: '0.5rem', marginBottom: '0.5rem'}}>
                {this.props.number}
            </div>
        );
    }
}