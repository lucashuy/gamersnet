import React from 'react';
import {Route, Redirect} from 'react-router-dom';

import cookieCheck from '../utilities/cookieCheck';

// argument means: remove "component" from "props" and rename it to "Component"
// then take whats left in "props" and make variable called "rest"
// only reason (i think) is to have capital 'C' in component
function PrivateRoute({component: Component, ...rest}) {
    let auth = cookieCheck();

    return (
        <Route {...rest} render = {(props) => auth ? <Component {...props} /> : <Redirect to = {{pathName: '/', state: {from: props.location}}} />}/>
    );
}

export default PrivateRoute;