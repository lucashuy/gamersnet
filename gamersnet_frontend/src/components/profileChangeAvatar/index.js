import React from 'react';

import APIFetch from '../../utilities/api';

import Button from '../button';
import StatusMessage from '../statusMessage';

import './styles.css';

const INPUT_STATE = {
    WAIT: 'select image'
};

export default class ProfileChangeAvatar extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            message: '',
            validFile: false,
            image: undefined,
            selectText: INPUT_STATE.WAIT,
            buttonState: 'normal',
            messageStatus: 'normal'
        };

        this.inputFile = this.inputFile.bind(this);
        this.handle = this.handle.bind(this);

        this.renderStatusMessage = this.renderStatusMessage.bind(this);
    }
    
    inputFile(event) {
        let file = event.target.files[0];
        console.log(file);
        if (file) {
            let image = new Image();
            image.src = window.URL.createObjectURL(file);
            
            image.onload = () => {
                // if file is smaller than 256KB and 256x256 pixels
                if (image.height <= 256 && image.width <= 256 && file.size < 256 * 1000 && file.type.includes('image')) {
                    this.setState({
                        message: '',
                        validFile: true,
                        image: file,
                        selectText: file.name
                    });

                    // oh no
                    let avatarElement = document.getElementById('profile-avatar');
                    if (avatarElement) {
                        avatarElement.src = image.src;
                    }
                } else {
                    this.setState({
                        message: 'Invalid file selected',
                        validFile: false,
                        image: undefined,
                        selectText: INPUT_STATE.WAIT,
                        messageStatus: 'error'
                    });
                }
            }
        }

        event.preventDefault();
    }

    handle(event) {
        if (this.state.validFile && this.state.image !== undefined) {
            this.setState({
                buttonState: 'loading'
            });

            let body = new FormData();
            body.append('image', this.state.image);

            let fetchData = APIFetch('/users/updateAvatar', body, 'PATCH', {});

            fetchData.then(async (data) => {
                if (await data.ok) {
                    this.setState({
                        message: 'avatar changed',
                        validFile: false,
                        image: undefined,
                        selectText: INPUT_STATE.WAIT,
                        messageStatus: 'success'
                    });
                } else {
                    this.setState({
                        message: 'something went wrong',
                        buttonState: 'normal',
                        messageStatus: 'error'
                    });
                }
            });
        }

        event.preventDefault();
    }

    renderStatusMessage() {
        if (this.state.message !== '') {
            return <StatusMessage className = {this.state.messageStatus + ' avatar-change-message'}>{this.state.message}</StatusMessage>
        }
    }

    render() {
        return (
            <div>
                <p>Image must be 256 by 256 pixels or smaller.</p>
                <form onSubmit = {this.handle} autoComplete = 'off' className = 'avatar-change-form'>
                    <label className = 'file-select'>
                        {this.state.selectText}
                        <input type = 'file' onChange = {this.inputFile} accept = 'image/png, image/jpeg' hidden />
                    </label>
                    {this.state.validFile && <Button onClick = {this.handle}>upload</Button>}
                </form>
                {this.renderStatusMessage()}
            </div>
        );
    }
}