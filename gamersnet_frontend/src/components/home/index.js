import React from 'react';

// include our API helper
import APIFetch from '../../utilities/api';
import cookieCheck from '../../utilities/cookieCheck';
import GeneralPost from '../generalPost';
import RecentChats from '../recentChats';
import FilterPosts from '../filterPosts';

import './styles.css'

export default class Home extends React.Component {
    constructor(props) {
        super(props);

        // define an initial state for our data we will fetch
        this.state = {
			listOfPosts: [],
			status: "loading",
            headerText: 'Most Recent Posts',
            forceChatUserID: undefined,
            forceChatUsername: undefined
		};

        this.forceChat = this.forceChat.bind(this);
        this.localFetch = this.localFetch.bind(this);
        this.filterFunction = this.filterFunction.bind(this);
    }

    forceChat(userID, username) {
        this.setState({forceChatUserID: userID, forceChatUsername: username});
    }

    localFetch() {
        let fetchPosts;

        if (this.props.query === undefined || this.props.query === '') {
            fetchPosts = APIFetch('/posts/listValidPosts', null, 'GET');
            this.setState({headerText : 'Most Recent Posts'});
        } else {
            fetchPosts = APIFetch(`/posts/filterPostsbyText?searchText=${this.props.query}`, null, 'GET');
            this.setState({headerText : 'Results for: ' + this.props.query});
        }

        fetchPosts.then(async (data) => {
            if (await data.ok) {
                let posts = await data.json();
                this.parseResponse(posts);
            } else if (await data.status === 404){
                this.setState({headerText : "No posts found"});
            } else {
                this.setState({status : "Network Problem"});
            }
        });
    }

	componentDidUpdate(prevProps) {
        if (prevProps.query !== this.props.query) {
            this.localFetch();
        }
	}

    componentDidMount() {
        this.localFetch();
    }

    parseResponse(data) {
        var postInfo
        var count = (JSON.parse(JSON.stringify(data)).length) - 1;
        var numPosts = 10;
        this.setState({ listOfPosts:[] });
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

    filterFunction(filterData) {
        var minPlayers = filterData.minPlayers;
        var maxPlayers = filterData.maxPlayers
        var startDate = Date.parse(filterData.startDate);
        var endDate = Date.parse(filterData.endDate);
        var game = filterData.game;

        var postArray = [...this.state.listOfPosts];
        var numSpliced = 0;
        var len = postArray.length
        
        // check all posts for filter violations
        for(var i = 0; i < len; i++) {
            // make sure post is defined before working on it
            if(postArray[i-numSpliced] !== undefined) {
                // number of players filter
                if(postArray[i-numSpliced].numPlayers < minPlayers || postArray[i-numSpliced].numPlayers > maxPlayers) {
                    postArray.splice(i-numSpliced, 1)
                    numSpliced++;
                }
                // start data filter
                else if(startDate !== "" && Date.parse(postArray[i-numSpliced].time) < startDate){
                    postArray.splice(i-numSpliced, 1)
                    numSpliced++;
                }
                // end data filter
                else if(endDate !== "" && Date.parse(postArray[i-numSpliced].time) > endDate){
                    postArray.splice(i-numSpliced, 1)
                    numSpliced++;
                }
                // game filter
                else if(game !== "" && game !== "None" && postArray[i-numSpliced].game !== game){
                    console.log(postArray[i-numSpliced].game+"\t"+game)
                    postArray.splice(i-numSpliced, 1)
                    numSpliced++;
                }
            }
            
            // update the list of valid posts
            this.setState({listOfPosts: postArray})
        }
    }
    
    render() {
        return (
            <div className = 'home'>
                <div className = 'home-posts'>
                    {this.props.query !== '' && this.props.query !== undefined &&
                        <FilterPosts functionCallFromParent = {this.filterFunction}/>}

                    <p className = 'post-text'>{this.state.headerText}</p>
                    <div className = 'all-posts'>
                        {this.state.listOfPosts.map(singlePost => (
                            <GeneralPost post = {singlePost} forceChat = {this.forceChat} />
                        ))}
                    </div>
                </div>
                {cookieCheck() && <RecentChats forcedID = {this.state.forceChatUserID} forcedUsername = {this.state.forceChatUsername} />}
            </div>
        );
    }
}
