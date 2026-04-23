const express = require('express');
const router = express.Router();
const statesController = require('../../controllers/statesController');

router.route('/')
    .get(statesController.getAllStates);

router.route('/:code')
    .get(statesController.getState);

router.route('/:state/funfact')
    .get(statesController.getStateFunfacts)
    .post(statesController.addStateFunfact);

module.exports = router;
