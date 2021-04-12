import React from 'react';

// include our API helper
import APIFetch from '../../utilities/api';
import GeneralPost from '../generalPost';
import FilterPosts from '../filterPosts';

import './styles.css'

export default class GameSearch extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
			listOfPosts: [],
            showListOfPosts:[],
            searchTerm: `${props.match.params.id}`,
            numPosts: 0,
			status : "loading",
            validFilter: false
		};

        this.parseResponse = this.parseResponse.bind(this);
    }

    filterFunction = (filterData) => {
        var minPlayers = filterData.minPlayers;
        var maxPlayers = filterData.maxPlayers
        var startDate = filterData.startDate;
        var endDate = filterData.endDate;
        var game = filterData.game;

        var postArray = [...this.state.listOfPosts];
        var numSpliced = 0;
        var len = postArray.length
        console.log("hi from gamesearch")
        
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
                else if(startDate !== "" && postArray[i-numSpliced].time < startDate){
                    postArray.splice(i-numSpliced, 1)
                    numSpliced++;
                }
                // end data filter
                else if(endDate !== "" && postArray[i-numSpliced].time > endDate){
                    postArray.splice(i-numSpliced, 1)
                    numSpliced++;
                }
                // game filter
                else if(game !== "" && game !== "None" && postArray[i-numSpliced].game !== game){
                    postArray.splice(i-numSpliced, 1)
                    numSpliced++;
                }
                
            }
            // update the list of valid posts
            this.setState({showListOfPosts: postArray})
        }
    }
    
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
        this.setState({ listOfPosts:[] });
        this.setState({ showListOfPosts:[] });
        while(data[count] !== undefined){
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
                listOfPosts: this.state.listOfPosts.concat(postInfo),
                showListOfPosts: this.state.showListOfPosts.concat(postInfo)
            })
            count--;
        }
    }

    render() {
        if(this.state.numPosts === 0){
            return (
                <div style = {{display: "flex", justifyContent: "center", alignItems: "center", fontSize: "26px"}}>No posts found</div>
            );
        } 
        else if(this.state.validFilter){

        }
        else {
            return (
                <div>
                    {< FilterPosts functionCallFromParent = {this.filterFunction.bind(this)}/>}
                    <p className = 'post-text'>Results for: "{this.state.searchTerm}"</p>
                    <div className = 'all-posts'>
                        {
                            this.state.showListOfPosts.map(singlePost => (
                                <GeneralPost toggleChat = {this.props.toggleChat} post = {singlePost} />
                            ))
                        }
                    </div>
                </div>
            );
        }

    }

}