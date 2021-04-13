import React from 'react';
import {withRouter} from 'react-router-dom';

import APIFetch from '../../utilities/api';
import './styles.css';
class AddPost extends React.Component{

    constructor(props){
        super(props);

        this.state = {
            gameName: 'Not Listed',
            description: '',
            numPlayers: 1,
            gameTimeUTC: 0,
            duration: '',
            location: '',
            message: ''
        };

        this.inputGameName = this.inputGameName.bind(this);
        this.inputDescription = this.inputDescription.bind(this);
        this.inputLocation = this.inputLocation.bind(this);
        this.inputDuration = this.inputDuration.bind(this);
        this.inputPlayers = this.inputPlayers.bind(this);
        this.inputDate = this.inputDate.bind(this);

        this.handle = this.handle.bind(this);
    }

    inputDescription(event){
        this.setState({description: event.target.value});
    }

    inputGameName(event){
        this.setState({gameName: event.target.value});
    }

    inputLocation(event){
        this.setState({location: event.target.value});
    }

    inputPlayers(event){
        this.setState({numPlayers: event.target.value});
    }

    inputDuration(event){
        this.setState({duration: event.target.value});
    }

    inputDate(event){
        let inputDate = event.target.valueAsDate;

        if (this.validateDate(inputDate)) {
            this.setState({gameTimeUTC: inputDate, message: ''});
        } else{
            this.setState({message: 'invalid date'});
        }
    }

    validateDate(inputDate){
        let today = Date.now();

        if (Date.parse(inputDate) + 86400000 >= today) {
            return true;
        } else{
            return false;
        }
    }

    handle(event) {
        if (this.validateDate(this.state.gameTimeUTC)) {
            let body = {
                gameName: this.state.gameName,
                description: this.state.description,
                numPlayers: this.state.numPlayers,
                gameTimeUTC: this.state.gameTimeUTC,
                duration: this.state.duration,
                location: this.state.location
            };
            
            let fetchData = APIFetch('/posts/createPost', JSON.stringify(body), 'POST');
    
            fetchData.then(async (data) => {
                if (await data.ok) {
                    this.props.history.push('/');
                    this.props.updateHeader();
                } else {
                    this.setState({message: 'something went wrong'});
                }
            });
        }
        
        event.preventDefault();
    }

    render() {
        return (
            <div className = "post-form">
                <form onSubmit = {this.handle} autoComplete = 'off' className = "vertical-center">
                    <h1>Create a Post: </h1>

                    <br/>
                    <p>Add Game Name you want to play:</p>
                        <select onChange = {this.inputGameName} defaultValue="Not Listed">
                            <option value="Not Listed"> Not Listed </option>
                            <option value="Apex Legends"> Apex Legends </option>
                            <option value="CS:GO"> CS:GO </option>
                            <option value="Dota"> Dota </option>
                            <option value="Fifa 2021"> Fifa 2021 </option>
                            <option value="Fortnite"> Fortnite </option>
                            <option value="PUB-G"> PUB-G </option>
                            <option value="Super Mario Bros"> Super Mario Bros </option>
                        </select>
        
                    <p>Description</p>
                        <input
                            type='text'
                            name='description'
                            onChange = {this.inputDescription}
                        />
                   
                    <p >Number of players to play with:</p>
                        <select onChange = {this.inputPlayers}>
                            <option value = "1">1</option>
                            <option value = "2">2</option>
                            <option value = "3">3</option>
                            <option value = "4">4</option>
                            <option value = "5">5</option>
                            <option value = "6">6</option>
                            <option value = "7">7</option>
                            <option value = "8">8</option>    
                        </select>
                    
                    <p id = "location">Add location:</p>
                        <input
                            type = 'text'
                            name = 'location'
                            onChange = {this.inputLocation} 
                        />
                    
                    <p id = "duration">Duration to play:</p>
                        <input
                            type = 'text'
                            name = 'location'
                            onChange = {this.inputDuration}
                            placeholder = 'eg. 1hr 30mins'
                        />
                    
                    <p id = "date">Select a date to play on:</p>
                        <input
                            type='date'
                            name='date'
                            onChange = {this.inputDate}
                        />
                    <button onClick = {this.handle}>Post</button>
                </form>
                <p>{this.state.message}</p>
            </div>
        );
    }
}
export default withRouter(AddPost);