const router = require('express').Router();

// include each route handler
let { addRatings } = require('./addRatings');
let {getUserRatings, getUserAvgRatings} = require('./getUserRatings');

router.post('/addRatings', addRatings);
router.get('/getUserRatings', getUserRatings);
router.get('/getUserAvgRatings', getUserAvgRatings);


// return the above routes
module.exports = router;
