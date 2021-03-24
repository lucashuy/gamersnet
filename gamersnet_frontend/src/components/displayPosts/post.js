import React from 'react';
import {withRouter} from 'react-router-dom';

import APIFetch from '../../utilities/api';

import './post.css'

class Post extends React.Component{

    constructor(props){
        super(props);
        this.state = {
            message: ""
        }
    }

    delete_post(post){
        let _id = post._id;
        let body = {id : _id};
        console.log(body)
        let deletePost = APIFetch('/posts/deletePost', JSON.stringify(body), 'DELETE');
        deletePost.then(async (data) => {
            if (await data.ok) {
                this.props.delete_post(_id);
            } else {
                this.setState({message: 'something went wrong'});
            }
        });        
    }
    render(){
        let post = this.props.post;
        return (
            <div>
                <div className = "post">
                    <h4>Description: {post.description}</h4><br/>
                    <h4>Game: {post.gameName}</h4><br/>
                    <h4>Players Needed: {post.numPlayers}</h4><br/>
                    <h4>Location: {post.location}</h4><br/>
                    <h4>Time: {post.gameTimeUTC}</h4><br/>
                    <h4>Duration: {post.duration}</h4><br/>

                    <button className = "button delete" onClick = {this.delete_post.bind(this,post)}>Delete</button>
                    <button className = "button edit">Edit</button> <br></br>
                </div><br></br>
            </div>
            
            
        );
    }


}
export default withRouter(Post);