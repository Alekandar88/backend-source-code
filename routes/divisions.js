const express = require('express');
const router = express.Router();

const divisionController = require('../controllers/division');

router.post('/:organizationId', divisionController.Create);

router.get('/', divisionController.Find);

router.get('/:id', divisionController.FindById);

router.put('/:id', divisionController.Update);

router.delete('/:id', divisionController.Delete);

module.exports = router;