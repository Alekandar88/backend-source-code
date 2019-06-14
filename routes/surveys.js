const express = require('express');
const router = express.Router();

const surveyController = require('../controllers/survey');

router.post('/:userId', surveyController.Create);

router.get('/', surveyController.Find);

router.get('/:id', surveyController.FindById);

router.put('/:id', surveyController.Update);

router.delete('/:id', surveyController.Delete);

module.exports = router;