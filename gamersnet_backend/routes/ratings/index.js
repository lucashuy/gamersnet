const router = require('express').Router();

// include each route handler
let { addRatings } = require('./addRatings');
let {getUserRatings, getUserAvgRatings, getRatingOfUserByRater} = require('./getUserRatings');

router.post('/addRatings', addRatings);
router.get('/getUserRatings', getUserRatings);
router.get('/getUserAvgRatings', getUserAvgRatings);
router.get('/getRatingOfUserByRater', getRatingOfUserByRater);


// return the above routes
module.exports = router;
