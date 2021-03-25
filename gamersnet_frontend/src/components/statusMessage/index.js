import React from 'react';
import RoundedBox from '../roundedBox';

import './styles.css';

export default class StatusMessage extends React.Component {
    render() {
        return (
            <RoundedBox className = {'status ' + this.props.className || 'normal'}>
                {this.props.children}
            </RoundedBox>
        );
    }
}