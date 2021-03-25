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
            } else if (await data.status === 404){
                this.setState({status : "No posts found"});
            } else {
                this.setState({status : "Network Problem"});
            }
        });
    }

    parseResponse(data) {
        var postInfo
        var count = (JSON.parse(JSON.stringify(data)).length) - 1;
        var numPosts = 10;
        this.setState({ posts:[] });
        while(data[count] !== undefined && numPosts > 0){
            postInfo = {game: data[count].gameName,
                        description: data[count].description,
                        numPlayers: data[count].numPlayers,
                        location: data[count].location,
                        time: data[count].gameTimeUTC,
                        duration: data[count].duration,
                        id: data[count]._id }
            this.setState({
                listOfPosts: this.state.listOfPosts.concat(postInfo)
            })
            count--;
            numPosts--;
        }
    }

    render() {
        return (
            <div>
                <p className = 'post-text'>Most recent posts!</p>
                <div className = 'all-posts'>
                    {this.state.listOfPosts.map(singlePost => (
                        <div className = 'single-post' key = {singlePost.game}>
                            <p><b>Description: </b>{singlePost.description}</p>
                            <p><b>Game: </b>{singlePost.game}</p>
                            <p><b>Looking for: </b>{singlePost.numPlayers} player(s)</p>
                            <p><b>Location: </b>{singlePost.location}</p>
                            <p><b>Time: </b>{singlePost.time}</p>
                            <p><b>Duration: </b>{singlePost.duration}</p>
                            <p style = {{fontSize: "14px", alignItems: "right"}}>ID: {singlePost.id}</p>
                        </div>
                    ))}
                </div>
            </div>
        );
    }
}