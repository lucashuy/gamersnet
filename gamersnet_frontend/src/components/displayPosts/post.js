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
            <div className = "post">
                <p><b>Description:</b> {post.description}</p>
                <p><b>Game:</b> {post.gameName}</p>
                <p><b>Players Needed:</b> {post.numPlayers}</p>
                <p><b>Location:</b> {post.location}</p>
                <p><b>Time:</b> {post.gameTimeUTC}</p>
                <p><b>Duration:</b> {post.duration}</p>

                <button className = "button delete" onClick = {this.delete_post.bind(this,post)}>Delete</button>
                <button className = "button edit">Edit</button>
            </div>
            
            
        );
    }
}
export default withRouter(Post);