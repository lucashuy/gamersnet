import React from 'react';

import APIFetch from '../../utilities/api';
import '../signin/styles.css';

const BUTTON_STATE = {
    USER_INPUT: 'select image first',
    VALID_IMAGE: 'change avatar'
};

export default class ProfileChangeAvatar extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            message: '',
            validFile: false,
            image: undefined
        };

        this.inputFile = this.inputFile.bind(this);
        this.handle = this.handle.bind(this);
    }
    
    inputFile(event) {
        let file = event.target.files[0];
        
        if (file) {
            let image = new Image();
            image.src = window.URL.createObjectURL(file);

            image.onload = () => {
                // if file is smaller than 256KB and 256x256 pixels
                if (image.height <= 256 && image.width <= 256 && file.size < 256 * 1000 && file.type.includes('image')) {
                    this.setState({
                        message: '',
                        validFile: true,
                        image: file
                    });
                } else {
                    this.setState({
                        message: 'Invalid file selected',
                        validFile: false,
                        image: undefined
                    });
                }
            }
        }

        event.preventDefault();
    }

    handle(event) {
        if (this.state.validFile && this.state.image !== undefined) {
            this.setState({message: 'uploading...'});

            let body = new FormData();
            body.append('image', this.state.image);

            let fetchData = APIFetch('/users/changeAvatar', body, 'PATCH', {});

            fetchData.then(async (data) => {
                if (await data.ok) {
                    // console.log(data);
                    this.setState({message: 'success'});
                } else {
                    this.setState({message: 'something went wrong'});
                }
            });
        }

        event.preventDefault();
    }

    render() {
        return (
            <div className = 'register-form'>
                <h2>Change Avatar</h2>
                <p>Image must be 256 by 256 pixels or smaller and less than 256KB in size.</p>
                <form onSubmit = {this.handle} autoComplete = 'off' className = 'vertical-center'>
                    <input type = 'file' onChange = {this.inputFile} accept = 'image/png, image/jpeg' />
                    {
                        this.state.validFile
                            ? <button onClick = {this.handle} >{BUTTON_STATE.VALID_IMAGE}</button>
                            : <button className = 'button-disabled' onClick = {this.handle} disabled >{BUTTON_STATE.USER_INPUT}</button>
                    }
                </form>
                <p>{this.state.message}</p>
            </div>
        );
    }
}