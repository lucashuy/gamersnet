import React from 'react';

import './styles.css';

export default class Input extends React.Component {
    render() {
        if (this.props.type === 'number') {
            return <input
                id = {this.props.id || ''}
                type = 'number'
                onChange = {this.props.onChange}
                defaultValue = {this.props.value}
                min = '0'
            />
        } else {
            return <input
                id = {this.props.id || ''}
                type = {this.props.type || 'input'}
                onChange = {this.props.onChange}
                placeholder = {this.props.placeholder}
                defaultValue = {this.props.value}
            />
        }
    }
}

/*

                        <input
                            type='date'
                            name='date'
                            onChange = {this.inputDate}
                        />*/