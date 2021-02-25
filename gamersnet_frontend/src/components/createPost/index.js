import React from 'react';
import {withRouter} from 'react-router-dom';

import APIFetch from '../../api';
// import cookieCheck from '../../cookieCheck';

import './styles.css';
class AddPost extends React.Component{

    constructor(props){
        super(props);

        this.state = {gameName: '', description: '', numPlayers: '',gameTimeUTC: '', duration: '', location:'', message: ''};

        this.inputgameName = this.inputgameName.bind(this);
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

    inputgameName(event){
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
        this.setState({gameTimeUTC: event.target.value});
    }


    handle(event) {

        let description = this.state.description, gameName = this.state.gameName, duration = this.state.duration, location = this.state.location;
        let numPlayers = this.state.numPlayers, date = this.state.date;

        // also pass in the username
        
        let body = {gameName: gameName, description: description, numPlayers: numPlayers, gameTimeUTC: date , duration: duration, location: location};

        let fetchData = APIFetch('/createPost', JSON.stringify(body), 'POST');

        fetchData.then(async (data) => {
            if (await data.ok) {
                this.props.history.push('/');
                this.props.updateHeader();
            } else {
                this.setState({message: 'something went wrong'});
            }
        });
        

        event.preventDefault();
    }

    render() {
        return (
            <div className = "post-form">
                <form onSubmit = {this.handle} autoComplete = 'off' className = "vertical-center">
                    <h1>Create a Post: </h1>

                    <br/>
                    <p>Add Game Name you want to play:</p>
                        <select onChange = {this.inputgameName}>
                            <option value="ApexLegends"> Apex Legends </option>
                            <option value="Dota"> Dota </option>
                            <option value="CS:Go"> CS:GO </option>
                            <option value="Fortnite"> Fortnite </option>
                            <option value="Fifa 2021"> Fifa 2021 </option>
                            <option value="PUB-G"> PUB-G </option>
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
                            type='time'
                            name='duration'
                            onChange = {this.inputDuration}
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