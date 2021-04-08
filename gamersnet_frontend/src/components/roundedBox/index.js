import React from 'react';

import './styles.css';

export default class RoundedBox extends React.Component {
    render() {
        return (
            <div className = {'rounded-box ' + this.props.className} style = {this.props.style} onClick = {this.props.onClick}>
                {this.props.children}
            </div>
        );
    }
}