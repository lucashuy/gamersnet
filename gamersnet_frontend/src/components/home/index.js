import React from 'react';

// include our API helper
import APIFetch from '../../utilities/api';
import cookieCheck from '../../utilities/cookieCheck';
import GeneralPost from '../generalPost';
import RecentChats from '../recentChats';

import './styles.css'

export default class Home extends React.Component {
    constructor(props) {
        super(props);

        // define an initial state for our data we will fetch
        this.state = {
			listOfPosts: [],
			status : "loading",
            forceChatUserID: undefined
		};

        this.forceChat = this.forceChat.bind(this);
    }

    forceChat(userID) {console.log('home', userID);
        this.setState({forceChatUserID: userID});
    }

	componentDidUpdate(_, prevState) {
		console.log('prevhome', prevState);
		console.log('thishome', this.state);
	}

    // this function will be automatically called when react creates this "Home" object in the browser
    componentDidMount() {
        let fetchPosts = APIFetch('/posts/listValidPosts', null, 'GET');

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
            postInfo = {
                game: data[count].gameName,
                description: data[count].description,
                numPlayers: data[count].numPlayers,
                location: data[count].location,
                time: data[count].gameTimeUTC,
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
        return (
            <div className = 'home'>
                <div className = 'home-posts'>
                    <p className = 'post-text'>Most recent posts!</p>
                    <div className = 'all-posts'>
                        {this.state.listOfPosts.map(singlePost => (
                            <GeneralPost post = {singlePost} forceChat = {this.forceChat} />
                        ))}
                    </div>
                </div>
                {cookieCheck() && <RecentChats forcedID = {this.state.forceChatUserID} />}
            </div>
        );
    }
}
