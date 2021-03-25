import React from 'react';

import './styles.css';

export default class Button extends React.Component {
    render() {
        if (this.props.className === 'disabled') {
            return (
                <button onClick = {this.props.onClick} className = 'disabled' disabled>{this.props.children}</button>
            );
        } else if (this.props.className === 'loading') {
            return (
                <button onClick = {this.props.onClick} className = 'loading' disabled>loading</button>
            );
        } else {
            return (
                <button onClick = {this.props.onClick} className = {this.props.className || 'normal'}>{this.props.children}</button>
            );
        }
    }
}