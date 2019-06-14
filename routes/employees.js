const express = require('express');
const router = express.Router();

const employeeController = require('../controllers/employee');

router.post('/:clientId', employeeController.Create);

router.get('/', employeeController.Find);

router.get('/:id', employeeController.FindById);

router.put('/:id', employeeController.Update);

router.delete('/:id', employeeController.Delete);

module.exports = router;