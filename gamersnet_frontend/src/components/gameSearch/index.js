import React from 'react';

// include our API helper
import APIFetch from '../../utilities/api';
import GeneralPost from '../generalPost';
import FilterPosts from '../filterPosts';

import './styles.css'

export default class GameSearch extends React.Component {
    constructor(props) {
        super(props);
        console.log(props)
        // define an initial state for our data we will fetch
        this.state = {
			listOfPosts: [],
            searchTerm: `${props.match.params.id}`,
            numPosts: 0,
			status : "loading"
		};
    }

    // this function will be automatically called when react creates this "Home" object in the browser
    componentDidMount() {
        let fetchPosts = APIFetch(`/posts/filterPostsbyText?searchText=${this.state.searchTerm}`, null, 'GET');

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
        this.setState({numPosts: count+1})
        var numPosts = 10;
        this.setState({ posts:[] });
        while(data[count] !== undefined && numPosts > 0){
            postInfo = {
                game: data[count].gameName,
                    description: data[count].description,
                    numPlayers: data[count].numPlayers,
                    location: data[count].location,
                    time: data[count].gameTimeUTC.substring(0,10),
                    duration: data[count].duration,
                    id: data[count]._id,
                    userID: data[count].userID
                }
            this.setState({
                listOfPosts: this.state.listOfPosts.concat(postInfo)
            })
            count--;
            numPosts--;
        }
    }

    render() {
        if(this.state.numPosts === 0){
            return (
                <div style = {{display: "flex", justifyContent: "center", alignItems: "center", fontSize: "26px"}}>No posts found</div>
            );
        } else {
            return (
                <div>
                    {< FilterPosts />}
                    <p className = 'post-text'>Results for: "{this.state.searchTerm}"</p>
                    <div className = 'all-posts'>
                        {
                            this.state.listOfPosts.map(singlePost => (
                                <GeneralPost toggleChat = {this.props.toggleChat} post = {singlePost} />
                            ))
                        }
                    </div>
                </div>
            );
        }

    }

}