import React from 'react';

import APIFetch from '../../../utilities/api';
import cookieCheck from '../../../utilities/cookieCheck';
import ProfileRatingAdd from '../profileRatingAdd';
import ProfileRatingComment from '../profileRatingComment';

import './styles.css';

export default class ProfileRatings extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            status: 0,
            commentStart: 0,
            commentEnd: 0,
            data: {
                userID: '123',
                strength: 0,
                punctuality: 0,
                friendliness: 0,
                fun: 0,
                playAgain: 0,
                comments: []
            },
            numComments: 0
        };
        
        this.renderComments = this.renderComments.bind(this);
        this.renderPageControl = this.renderPageControl.bind(this);
        this.pageBack = this.pageBack.bind(this);
        this.pageNext = this.pageNext.bind(this);
    }
    
    componentDidMount() {
        let fetchData = APIFetch('/ratings/getUserAvgRatings?userID=' + this.props.userID);

        fetchData.then(async (data) => {
            if (await data.ok) {
                let json = await data.json();
                
                let maxComments;
                if (json.comments.length < 5) {
                    maxComments = json.comments.length;
                } else {
                    maxComments = 5;
                }

                json.comments.sort((first, second) => {
                    return Date.parse(second.rateDate) - Date.parse(first.rateDate);
                });

                let nonEmptyComments = 0;

                json.comments.map((comment) => {
                    if (comment.comment !== '') nonEmptyComments++;
                })

                this.setState({status: 200, data: json, commentEnd: maxComments, numComments: nonEmptyComments});
            } else {
                console.log('profile-ratings', 'network problem happened');
            }
        });
    }

    renderComments() {
        let comments = [];

        for (let i = this.state.commentStart; i < this.state.commentEnd; i++) {
            let comment = this.state.data.comments[i];
            
            // only add comment if not empty
            if (comment.comment !== '') comments.push(<ProfileRatingComment userID = {comment.raterID} rateDate = {comment.rateDate} comment = {comment.comment} />);
        }

        return comments;
    }

    renderPageControl() {
        return (
            <div className = 'rating-overview-comments-page-ctrl'>
                <div onClick = {this.pageBack} className = {this.state.commentStart === 0 && 'page-ctrl-disabled'} >previous</div> | <div onClick = {this.pageNext} className = {this.state.commentEnd === this.state.data.comments.length && 'page-ctrl-disabled'} >next</div>
            </div>
        )
    }
    
    pageBack() {
        if (this.state.commentStart !== 0) {
            this.setState({
                commentStart: this.state.commentStart - 5,
                commentEnd: this.state.commentStart
            });
        }
    }

    pageNext() {
        if (this.state.commentEnd !== this.state.data.comments.length) {
            let end;
            if (this.state.commentEnd + 5 > this.state.data.comments.length) {
                end = this.state.data.comments.length;
            } else {
                end = this.state.commentEnd + 5;
            }

            this.setState({
                commentStart: this.state.commentStart + 5,
                commentEnd: end
            });
        }
    }

    render() {
        return (
            <div style = {{width: '100%'}}>
                <div className = 'profile-header'>Ratings ({this.state.data.comments.length} total)</div>
                <div className = 'rating-overview-wrapper'>
                    <div className = 'rating-overview-overview'>
                        <div>
                            <div className = 'star' style = {{'--rating': this.state.data.strength}}></div>
                            <div>Strength</div>
                        </div>
                        <div>
                            <div className = 'star' style = {{'--rating': this.state.data.punctuality}}></div>
                            <div>Punctuality</div>
                        </div>
                        <div>
                            <div className = 'star' style = {{'--rating': this.state.data.friendliness}}></div>
                            <div>Friendliness</div>
                        </div>
                        <div>
                            <div className = 'star' style = {{'--rating': this.state.data.fun}}></div>
                            <div>Fun</div>
                        </div>
                        <div>
                            <div>{Math.floor(this.state.data.playAgain)}%</div>
                            <div>would play again</div>
                        </div>
                    </div>
                    <div className = 'rating-overview-comments-wrapper'>
                        <div className = 'rating-overview-header'>
                            <div className = 'profile-header'>Comments ({this.state.numComments} total)</div>
                            {this.renderPageControl()}
                        </div>
                        
                        <div className = 'rating-overview-comments'>
                            {this.renderComments()}
                        </div>
                    </div>

                    {cookieCheck() && localStorage.getItem('id') !== this.props.userID && <ProfileRatingAdd userID = {this.props.userID} />}
                </div>
            </div>
        );
    }
}