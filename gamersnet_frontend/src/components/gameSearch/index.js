import React from 'react';

// include our API helper
import APIFetch from '../../utilities/api';

import './styles.css'

export default class GameSearch extends React.Component {
    constructor(props) {
        super(props);

        // define an initial state for our data we will fetch
        this.state = {
			listOfPosts: [],
			status : "loading"
		};
    }


    
}