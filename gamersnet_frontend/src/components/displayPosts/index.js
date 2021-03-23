import React from 'react';
import {withRouter} from 'react-router-dom';

import APIFetch from '../../utilities/api';
import Post from './post'

class DisplayPosts extends React.Component{

    constructor(props) {
        super(props);
        this.state = {
            items: [],
            status : "loading"
        };
        this.delete_post = this.delete_post.bind(this);
    }

    delete_post(id){
        this.setState(prevState => ({
            items: prevState.items.filter(post => post["_id"] != id  )
        }));  
        alert("Post Deleted Successfully");
    }

    componentDidMount() {
        let userID = "";
        
        let fetchPosts = APIFetch('/posts/listUserPosts?userID=' + userID, null,'GET');
        // for peer reviewers, How can we do error checking here?

        fetchPosts.then(async (data) => {
            if(await data.ok){
                  let posts = await data.json();
                  this.setState({items: posts, status : ""});
            }
            else if (await data.status === 404){
                  this.setState({status : "No posts found"});
            }
            else{
                  this.setState({status : "Network Problem"});
            }

        });
    }
    
    render() {
          let items = this.state.items;
          return (
            <div>
              <div>{this.state.status}</div>
              <ul>
                {items.map(item => (
                  <li key={item._id}>
                    <Post delete_post = {this.delete_post} post = {item}/>
                  </li>
                ))}
              </ul>
            </div>
          ); 
    }
}
export default withRouter(DisplayPosts);