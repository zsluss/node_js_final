const express = require('express');
const router = express.Router();
const statesController = require('../../controllers/statesController');
const verifyState = require('../../middleware/verifyState');

router.param('state', verifyState);

router.route('/')
    .get(statesController.getAllStates);

router.route('/:state/funfact')
    .get(statesController.getStateFunfacts)
    .post(statesController.addStateFunfact)
    .patch(statesController.updateStateFunfact)
    .delete(statesController.deleteStateFunfact);

router.route('/:state/capital')
    .get(statesController.getStateCapital);

router.route('/:state/nickname')
    .get(statesController.getStateNickname);

router.route('/:state/population')
    .get(statesController.getStatePopulation);

router.route('/:state/admission')
    .get(statesController.getStateAdmission);

router.route('/:state')
    .get(statesController.getState);

module.exports = router;
