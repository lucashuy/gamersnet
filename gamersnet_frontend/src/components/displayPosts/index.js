import React from 'react';

import APIFetch from '../../utilities/api';
import Post from './post'

export default class DisplayPosts extends React.Component{
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
			items: prevState.items.filter(post => post["_id"] !== id)
		}));  
		alert("Post Deleted Successfully");
	}

	componentDidMount() {
			let userID = "";
				
			let fetchPosts = APIFetch('/posts/listUserPosts?userID=' + userID, null, 'GET');

			fetchPosts.then(async (data) => {
				if (await data.ok) {
					let posts = await data.json();
					this.setState({items: posts, status : ""});
				} else if (await data.status === 404){
					this.setState({status : "No posts found"});
				} else {
					this.setState({status : "Network Problem"});
				}
			});
	}
		
	render() {
		let items = this.state.items;
		return (
			<div className = 'posts-wrapper'>
				{items.map(item => (
					<Post delete_post = {this.delete_post} key = {item._id} post = {item}/>
				))}
			</div>
		); 
	}
}