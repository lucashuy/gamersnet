import React from 'react';

import './styles.css';

export default class Input extends React.Component {
    render() {
        return (
            <input id = {this.props.id || ''} type = {this.props.type || 'input'} onChange = {this.props.onChange} placeholder = {this.props.placeholder} />
        );
    }
}