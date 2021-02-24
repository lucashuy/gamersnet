import React from 'react';
import APIFetch from '../../api';

export default class AddPost extends React.Component{

    constructor(props){
        super(props);
    }

    componentDidMount() {
        // turn our JSON object into a string for easy printing
        let fetchData = APIFetch('addPost');
        fetchData.then((data) => {
            this.setState({data: JSON.stringify(data)});
        });
    }

    render() {
        return (
          <form>

            <h1>Create a Post: </h1>

            <p>Add Game Name you want to play:</p>
                <select>
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
                />

            <p>Number of players to play with:</p>
                <select>
                    <option value = "1">1</option>
                    <option value = "2">2</option>
                    <option value = "3">3</option>
                    <option value = "4">4</option>
                    <option value = "5">5</option>
                    <option value = "6">6</option>
                    <option value = "7">7</option>
                    <option value = "8">8</option>    
                </select>
        
            <p>Add location:</p>
                <input
                    type='text'
                    name='location'
                />
            <p>Duration to play:</p>
                <input
                    type='time'
                    name='duration'
                />
            <p>Select a date to play on:</p>
                <input
                    type='date'
                    name='date'
                />
          </form>
        );
    }
    
}