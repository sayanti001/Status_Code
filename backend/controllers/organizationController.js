// server/controllers/userController.js
const jwt = require('jsonwebtoken');
const Organization = require('../models/organization.js');
const User = require('../models/user.js');
const Service = require('../models/Service.js');
const Incident = require('../models/Incident');

// Verify user and create if not exists
const createOrganization = async (req, res) => {
    try {
        const { name, domain, info, employeeCount } = req.body;
        const auth0ID = req.auth.sub;
        if (!auth0ID) {
            return res.status(400).json({ message: 'userId not found in token' });
        }

        // Create a new organization
        let organization = new Organization({
            name,
            domain,
            info,
            owner: auth0ID,
            employeeCount
        });

        await organization.save();
        // Add organization ID to the user's organizations array
        await User.findOneAndUpdate(
            { auth0ID },
            { $push: { organizations: organization._id } },
            { new: true, upsert: true }
        );
        res.status(201).json({ message: 'Organization created successfully', organization });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
}
const updateOrganization = async (req, res) => {
    try {
        const { name, domain, info, employeeCount } = req.body;
        const organizationId = req.headers.organizationid;
        
        const organization = await Organization.findByIdAndUpdate(
            organizationId,
            { name, domain, info, employeeCount },
            { new: true }
        );

        res.status(200).json({ message: 'Organization updated successfully', organization });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
}
const updateStatusDomain = async (req, res) => {
    try {
        const { statusDomain } = req.body;
        const organizationId = req.headers.organizationid;
        
        const organization = await Organization.findByIdAndUpdate(
            organizationId,
            { statusDomain },
            { new: true }
        );

        res.status(200).json({ message: 'Organization updated successfully', organization });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
}

const createService = async (req, res) => {
    try {
        const { name, description, status } = req.body;
        const organizationId = req.headers.organizationid;

        const service = new Service({
            name,
            description,
            status,
            organizationId,
            createdBy: req.auth.sub,
        });

        await service.save();
        res.status(201).json({ message: 'Service created successfully', service });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
}

const updateService = async (req, res) => {
    try {
        const { name, description, status, serviceId } = req.body;

        const service = await Service.findOneAndUpdate(
            { _id: serviceId },
            { name, description, status },
            { new: true }
        );

        res.status(201).json({ message: 'Service updated successfully', service });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
}

const createIncident = async (req, res) => {
    try {
        const { title, description, status, affectedService } = req.body;
        const organizationId = req.headers.organizationid;

        const incident = new Incident({
            title,
            description,
            status,
            affectedService,
            organizationId,
            createdBy: req.auth.sub,
        });

        await incident.save();
        res.status(201).json({ message: 'Incident created successfully', incident });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
}

const updateIncident = async (req, res) => {
    try {
        const { title, description, status, affectedService, incidentId } = req.body;

        const incident = await Incident.findOneAndUpdate(
            { _id: incidentId },
            { title, description, status, affectedService },
            { new: true }
        );

        res.status(201).json({ message: 'Incident updated successfully', incident });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
}

const getServices = async (req, res) => {
    try {
        const organizationId = req.headers.organizationid;

        const services = await Service.find({ organizationId });
        res.status(200).json(services);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
}

const getIncidents = async (req, res) => {
    try {
        const organizationId = req.headers.organizationid;

        const incidents = await Incident.find({ organizationId });
        res.status(200).json(incidents);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
}

module.exports = { createOrganization, updateOrganization, getServices, getIncidents, createService, createIncident, updateService, updateIncident, updateStatusDomain };