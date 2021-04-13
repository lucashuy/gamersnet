import React from 'react';

import './styles.css'

export default class FilterPosts extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            game: '',
            minPlayers: 1,
            maxPlayers: 8,
            startDate: '',
            endDate: ''
        }

        this.game = this.game.bind(this);
        this.minPlayers = this.minPlayers.bind(this);
        this.maxPlayers = this.maxPlayers.bind(this);
        this.startDate = this.startDate.bind(this);
        this.endDate = this.endDate.bind(this);
    }

    game(event) {
        this.setState({game: event.target.value})
    }

    minPlayers(event) {
        this.setState({minPlayers: event.target.value})
    }

    maxPlayers(event) {
        this.setState({maxPlayers: event.target.value})
    }

    startDate(event) {
        this.setState({startDate: event.target.valueAsDate})
    }

    endDate(event) {
        this.setState({endDate: event.target.valueAsDate})
    }

    dataFunction = (event) => {
        event.preventDefault();
        this.props.functionCallFromParent(this.state);
    }

    render() {
        return (
            <div className = 'filter-section'>
                <div className = 'filter-game'>
                    <p className = 'game-text'>Game</p>
                        <select onChange = {this.game} className = 'game-filter-select' defaultValue="None">
                            <option value="None"> None </option>
                            <option value="Apex Legends"> Apex Legends </option>
                            <option value="CS:GO"> CS:GO </option>
                            <option value="Dota"> Dota </option>
                            <option value="Fifa 2021"> Fifa 2021 </option>
                            <option value="Fortnite"> Fortnite </option>
                            <option value="PUB-G"> PUB-G </option>
                            <option value="Super Mario Bros"> Super Mario Bros </option>
                        </select>
                </div>
                <div className = 'filter-num-players'>
                    <div className = 'filter-min-players'>
                        <p className = 'num-players-text'>Minimum number of players
                        <select onChange = {this.minPlayers} className = 'num-players-select' defaultValue = "1">
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
                        <select onChange = {this.maxPlayers} className = 'num-players-select' defaultValue = "8">
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
                    <button type = 'submit' className = 'button-filter' onClick ={this.dataFunction.bind(this)} >Submit filter</button>
                </div>
            </div>
        )
    }
}