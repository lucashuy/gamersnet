const router = require('express').Router();

// include each route handler
let { addRatings } = require('./addRatings');
//let {getUserRatings} = require('./getUserRatings');

router.post('/addRatings', addRatings);
//router.get('/getUserRatings', getUserRatings);

// return the above routes
module.exports = router;
