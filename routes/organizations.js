const express = require('express');
const router = express.Router();

const organizationController = require('../controllers/organization');

router.post('/:clientId', organizationController.Create);

router.get('/', organizationController.Find);

router.get('/:id', organizationController.FindById);

router.put('/:id', organizationController.Update);

router.delete('/:id', organizationController.Delete);

module.exports = router;