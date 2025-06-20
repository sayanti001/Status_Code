const express = require('express');
const router = express.Router();
const Organization = require('../models/organization');
const Service = require('../models/Service');


// Get organization by domain and its services
router.get('/history', async (req, res) => {
    try {
      // Get subdomain from origin header
      const origin = req.headers.origin.toLowerCase();
      const subdomain = new URL(origin).hostname.split('.')[0]; // extract subdomain
      console.log('Subdomain:', subdomain);
      // Find organization by domain
      const organization = await Organization.findOne({ statusDomain: subdomain });
  
      if (!organization) {
        return res.status(404).json({
          success: false,
          message: 'Organization not found'
        });
      }
  
      // Get services for the organization
      const services = await Service.find({ organizationId: organization._id });
  
      // Calculate 90-day cutoff
      const ninetyDaysAgo = new Date();
      ninetyDaysAgo.setDate(ninetyDaysAgo.getDate() - 90);
  
      // Process services
      const processedServices = services.map(service => {
        const filteredHistory = service.statusHistory
          .filter(item => new Date(item.timestamp) >= ninetyDaysAgo)
          .sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
  
        // Calculate durations per status
        const statusDurations = {};
        for (let i = 0; i < filteredHistory.length; i++) {
          const current = filteredHistory[i];
          const next = filteredHistory[i + 1];
  
          const start = new Date(current.timestamp);
          const end = next ? new Date(next.timestamp) : new Date();
  
          const durationMs = end - start;
          const durationHrs = durationMs / (1000 * 60 * 60);
  
          if (!statusDurations[current.status]) {
            statusDurations[current.status] = 0;
          }
          statusDurations[current.status] += durationHrs;
        }
  
        return {
          id: service._id,
          name: service.name,
          description: service.description,
          currentStatus: service.status,
          statusHistory: filteredHistory,
          statusDurations: Object.entries(statusDurations).map(([status, hours]) => ({
            status,
            durationHours: Number(hours.toFixed(2))
          }))
        };
      });
  
      return res.status(200).json({
        success: true,
        data: {
          organization: {
            name: organization.name,
            domain: organization.statusDomain
          },
          services: processedServices
        }
      });
    } catch (error) {
      console.error('Error fetching status:', error);
      return res.status(500).json({
        success: false,
        message: 'Server error'
      });
    }
  });
  

  module.exports = router;