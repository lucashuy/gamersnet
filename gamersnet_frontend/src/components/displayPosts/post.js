import React from 'react';
import APIFetch from '../../utilities/api';
import Button from '../button';
import Input from '../input';
import StatusMessage from '../statusMessage';

import './post.css'

export default class Post extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            isOurPost: this.props.post.userID === localStorage.getItem('id'),
            isEdit: false,
            status: 'normal',
            message: '',
            editDescription: this.props.post.description,
            editNumPlayers: this.props.post.numPlayers,
            editLocation: this.props.post.location,
            editDate: this.props.post.gameTimeUTC,
            editDuration: this.props.post.duration
        }

        this.toggleEdit = this.toggleEdit.bind(this);
        this.deletePost = this.deletePost.bind(this);
        this.renderPosts = this.renderPosts.bind(this);
        this.renderControl = this.renderControl.bind(this);

        this.handleDescription = this.handleDescription.bind(this);
        this.handlePlayers = this.handlePlayers.bind(this);
        this.handleLocation = this.handleLocation.bind(this);
        this.handleDate = this.handleDate.bind(this);
        this.handleDuration = this.handleDuration.bind(this);
        this.handle = this.handle.bind(this);
    }

    toggleEdit() {
        let toggled = this.state.isEdit;
        
        this.setState({
            message: '',
            isEdit: !toggled
        });
    }

    deletePost() {
        let _id = this.props.post._id;
        let body = {id : _id};
        
        let result = APIFetch('/posts/deletePost', JSON.stringify(body), 'DELETE');
        result.then(async (data) => {
            if (await data.ok) {
                this.props.deletePost(_id);
            } else {
                this.setState({
                    status: 'error',
                    message: 'authorization error'
                });
            }
        });        
    }

    handleDescription(event) {
        this.setState({editDescription: event.target.value});
    }

    handlePlayers(event) {
        this.setState({editNumPlayers: event.target.value});
    }

    handleLocation(event) {
        this.setState({editLocation: event.target.value});
    }

    handleDate(event) {
        this.setState({editDate: event.target.valueAsDate});
    }

    handleDuration(event) {
        this.setState({editDuration: event.target.value});
    }

    handle(event) {
        let body = {
            description: this.state.editDescription,
            gameName: this.props.post.gameName,
            numPlayers: this.state.editNumPlayers,
            gameTimeUTC: this.state.editDate,
            duration: this.state.editDuration,
            location: this.state.editLocation
        };

        let result = APIFetch(`/posts/updatePost?_id=${this.props.post['_id']}`, JSON.stringify(body), 'POST');
        result.then(async (data) => {
            if (await data.ok) {
                this.setState({
                    status: 'success',
                    message: 'updated successfully'
                });
            } else {
                this.setState({
                    status: 'error',
                    message: 'authorization error'
                });
            }
        });

        event.preventDefault();
    }

    renderStatus() {
        if (this.state.message !== '') {
            return <StatusMessage className = {this.state.status}><p>{this.state.message}</p></StatusMessage>
        }
    }

    renderPosts() {
        if (this.state.isEdit) {
            return (
                <form className = 'edit-post-wrapper' onSubmit = {this.handle}>
                    <div>
                        <p><b>Description:</b></p><Input onChange = {this.handleDescription} value = {this.props.post.description} />
                    </div>
                    <div>
                        <p><b>Game:</b> {this.props.post.gameName}</p>
                    </div>
                    <div>
                        <p><b>Players Needed:</b></p><Input onChange = {this.handlePlayers} type = 'number' value = {this.props.post.numPlayers} />
                    </div>
                    <div>
                        <p><b>Location:</b></p><Input onChange = {this.handleLocation} value = {this.props.post.location} />
                    </div>
                    <div>
                        <p><b>Time:</b></p><Input onChange = {this.handleDate} type = 'date' />
                    </div>
                    <div>
                        <p><b>Duration:</b></p><Input onChange = {this.handleDuration} value = {this.props.post.duration} />
                    </div>
                    
                    {this.renderStatus()}
                    <Button className = 'confirm' onClick = {this.handle} >submit</Button>
                    <Button className = 'critical' onClick = {this.toggleEdit} >cancel</Button>
                </form>
            );
        } else {
            return (
                <div>
                    <div>
                        <p><b>Description:</b> {this.props.post.description}</p>
                    </div>
                    <div>
                        <p><b>Game:</b> {this.props.post.gameName}</p>
                    </div>
                    <div>
                        <p><b>Players Needed:</b> {this.props.post.numPlayers}</p>
                    </div>
                    <div>
                        <p><b>Location:</b> {this.props.post.location}</p>
                    </div>
                    <div>
                        <p><b>Time:</b> {this.props.post.gameTimeUTC}</p>
                    </div>
                    <div>
                        <p><b>Duration:</b> {this.props.post.duration}</p>
                    </div>

                    {this.renderControl()}
                </div>
            );
        }
    }

    renderControl() {
        if (this.state.isOurPost) {
            return (
                <div>
                    <Button className = 'critical' onClick = {this.deletePost} >delete</Button>
                    <Button className = 'normal'  onClick = {this.toggleEdit} >edit</Button>
                </div>
            );
        }
    }

    render(){
        return (
            <div className = "post">
                {this.renderPosts()}
            </div>
        );
    }
}