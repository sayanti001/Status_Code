const express = require('express');
const router = express.Router();
const { authenticate } = require('../middlewares/auth');
const { createOrganization, getServices, getIncidents, createService, createIncident, updateService, updateIncident, updateOrganization, updateStatusDomain } = require('../controllers/organizationController');
const authorise_organization = require('../middlewares/authorise_organization');

router.use(authenticate);
router.post('/create', createOrganization);
router.put('/update', authorise_organization, updateOrganization);
router.put('/update_statusDomain', authorise_organization, updateStatusDomain)

router.post('/create_service', authorise_organization, createService);
router.put('/update_service', authorise_organization, updateService);
//router.delete('/delete_service', authorise_organization, createService);
router.get('/services', authorise_organization, getServices);

router.post('/create_incident', authorise_organization, createIncident);
router.put('/update_incident', authorise_organization, updateIncident);
//router.delete('/delete_incident', authorise_organization, createIncident);
router.get('/incidents', authorise_organization, getIncidents);




module.exports = router;