import React from 'react';
import APIFetch from '../../utilities/api';
import {withRouter} from 'react-router-dom';
import './styles.css';

class MessageForm extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
          message: ''
        }
        this.handleChange = this.handleChange.bind(this)
        this.handleSubmit = this.handleSubmit.bind(this)
    }

    handleChange(e) {
      this.setState({
        message: e.target.value
      })
    }

    handleSubmit(e) {
      e.preventDefault()
      this.props.sendMessage(this.state.message)
      this.setState({
        message: ''
      })
    }


    render() {
      return (
        <form >
          <input
            onChange={this.handleChange}
            value={this.state.message}
            placeholder="Type your message"
            type="text" />
  
            <button onClick = {this.handle}>Send</button>
        </form>
      )
    }
}
export default withRouter(MessageForm);