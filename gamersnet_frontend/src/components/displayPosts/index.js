import React from 'react';
import {withRouter} from 'react-router-dom';

import APIFetch from '../../utilities/api';
import Post from './post'

class DisplayPosts extends React.Component{
    _isMounted = false;

    constructor(props) {
        super(props);
        this.state = {
            items: []
        };
        this.delete_post = this.delete_post.bind(this);
    }

    delete_post(id){
        this.setState(prevState => ({
            items: prevState.items.filter(post => post["_id"] != id  )
        }));  
    }

    componentDidMount() {
        this._isMounted = true;

        let json = {userID : ""};
        let fetchPosts = APIFetch('/posts/listUserPosts', JSON.stringify(json),'POST');
        // for peer reviewers, How can we do error checking here?
        fetchPosts
          .then(res => res.json())
          .then((result) => {
            console.log(result)
            this.setState({items: result});
        });
    }
    componentWillUnmount() {
        this._isMounted = false;
    }
    
    render() {
          let items = this.state.items;
          return (
            <ul>
              {items.map(item => (
                <li key={item._id}>
                  <Post delete_post = {this.delete_post} post = {item}/>
                </li>
              ))}
            </ul>
            
          ); 
    }
}
export default withRouter(DisplayPosts);