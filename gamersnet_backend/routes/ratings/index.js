const router = require('express').Router();

// include each route handler
let { addRatings } = require('./addRatings');
let {getUserRatings, getUserAvgRatings, getUserRatingByRater} = require('./getUserRatings');

router.post('/addRatings', addRatings);
router.get('/getUserRatings', getUserRatings);
router.get('/getUserAvgRatings', getUserAvgRatings);
router.get('/getUserRatingByRater', getUserRatingByRater);


// return the above routes
module.exports = router;
