const express = require('express');
const router = express.Router();

const clientController = require('../controllers/client');

router.post('/:userId', clientController.Create);

router.get('/', clientController.Find);

router.get('/:id', clientController.FindById);

router.put('/:id', clientController.Update);

router.delete('/:id', clientController.Delete);

//SET UP RELATIONAL ROUTES
router.get('/employees/:clientId',clientController.FindEmployees);

router.get('/surveys/:clientId',clientController.FindSurveys);

module.exports = router;