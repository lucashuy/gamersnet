import React from 'react';

import APIFetch from '../../utilities/api';
import cookieCheck from '../../utilities/cookieCheck';

import './styles.css'

export default class FilterPosts extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            minPlayers: 1,
            maxPlatesr: 1,
            startDate: '',
            endDate: ''
        }

        this.minPlayers = this.minPlayers.bind(this);
        this.maxPlayers = this.maxPlayers.bind(this);
        this.startDate = this.startDate.bind(this);
        this.endDate = this.endDate.bind(this);
        this.handleSearch = this.handleSearch.bind(this);
    }

    minPlayers(event) {
        this.setState({minPlayers: event.target.value})
    }

    maxPlayers(event) {
        this.setState({maxPlayers: event.target.value})
    }

    startDate(event) {
        this.setState({startDate: event.target.value})
    }

    endDate(event) {
        this.setState({endDate: event.target.value})
    }

    handleSearch(event) {
        let body = {
            minPlayers: this.state.minPlayers,
            maxPlayers: this.state.maxPlayers,
            startDate: this.state.startDate,
            endDate: this.state.endDate
        };
        
        this.props.history.push('/');
        this.props.updateHeader();
        

        event.preventDefault();
    }

    render() {
        return (
            <div className = 'filter-section'>
                <div className = 'filter-num-players'>
                    <div className = 'filter-min-players'>
                        <p className = 'num-players-text'>Minimum number of players
                        <select onChange = {this.minPlayers} className = 'num-players-select'>
                                <option value = "1">1</option>
                                <option value = "2">2</option>
                                <option value = "3">3</option>
                                <option value = "4">4</option>
                                <option value = "5">5</option>
                                <option value = "6">6</option>
                                <option value = "7">7</option>
                                <option value = "8">8</option>    
                            </select>
                        </p>
                    </div>
                    <div className = 'filter-max-players'>
                        <p>Maximum number of players
                        <select onChange = {this.maxPlayers} className = 'num-players-select'>
                                <option value = "1">1</option>
                                <option value = "2">2</option>
                                <option value = "3">3</option>
                                <option value = "4">4</option>
                                <option value = "5">5</option>
                                <option value = "6">6</option>
                                <option value = "7">7</option>
                                <option value = "8">8</option>    
                            </select>
                        </p>
                    </div>
                </div>
                <div className = 'filter-date'>
                    <div className = 'filter-start-date'>
                        <p>Start date
                            <input type = 'date' onChange = {this.startDate} className = 'calendar-select'></input>
                        </p>
                    </div>
                    <div className = 'filter-end-date'>
                        <p>End date
                            <input type = 'date' onChange = {this.endDate} className = 'calendar-select'></input>
                        </p>
                    </div>
                </div>
                <div className = 'button-container'>
                    <button type = 'submit' className = 'button-filter' onClick = {this.handleSearch} >Submit filter</button>
                </div>
            </div>
        )
    }
}