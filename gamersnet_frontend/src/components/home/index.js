import React from 'react';

// include our API helper
import APIFetch from '../../utilities/api';

import './styles.css'

export default class Home extends React.Component {
    constructor(props) {
        super(props);

        // define an initial state for our data we will fetch
        this.state = {
			listOfPosts: [],
			status : "loading"
		};
    }

    // this function will be automatically called when react creates this "Home" object in the browser
    componentDidMount() {

        let fetchPosts = APIFetch('/posts/listAllPosts', null, 'GET');

			fetchPosts.then(async (data) => {
				if (await data.ok) {
					let posts = await data.json();
                    this.parseResponse(posts);
                    this.setState({jsonPost: posts})

				} else if (await data.status === 404){
					this.setState({status : "No posts found"});
				} else {
					this.setState({status : "Network Problem"});
				}
			});
    }

    parseResponse(data) {
        var postInfo
        var count = 0;
        this.setState({ posts:[] });
        while(data[count] !== undefined && count < 8){
            postInfo = {game: data[count].gameName,
                        description: data[count].description,
                        numPlayers: data[count].numPlayers,
                        location: data[count].location,
                        time: data[count].getTimeUTC,
                        duration: data[count].duration, }
            this.setState({
                listOfPosts: this.state.listOfPosts.concat(postInfo)
            })
            count++;
        }
    }

    render() {
        return (
            <div>
                <p className = 'post-text'>Most recent posts!</p>
                <div className = 'all-posts'>
                    {this.state.listOfPosts.map(singlePost => (
                        <div className = 'single-post' key = {singlePost.game}>
                            <p>Description: {singlePost.description}</p>
                            <p>Game: {singlePost.game}</p>
                            <p>Players needed: {singlePost.numPlayers}</p>
                            <p>Location: {singlePost.location}</p>
                            <p>Time: {singlePost.time}</p>
                            <p>Duration: {singlePost.duration}</p>
                        </div>
                    ))}
                </div>
            </div>
        );
    }
}