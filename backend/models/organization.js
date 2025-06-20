const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const organizationSchema = new Schema({
  _id: {
    type: Schema.Types.ObjectId,
    auto: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  domain: {
    type: String,
    required: true,
    trim: true
  },
  statusDomain: {
    type: String,
    default: null
  },
  owner: {
    type: String,
    ref: 'User',
    required: true
  },
  info: {
    type: String,
    trim: true
  },
  employeeCount: {
    type: String
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual to get all services belonging to this organization
organizationSchema.virtual('services', {
  ref: 'Service',
  localField: '_id',
  foreignField: 'organizationId'
});

// Add uptime as a virtual property that's calculated automatically
organizationSchema.virtual('uptime').get(function() {
  // If services aren't populated, return default value
  if (!this.populated('services') || !this.services || this.services.length === 0) {
    return 100.0;
  }
  
  // Calculate the average uptime percentage across all services
  let totalUptimePercentage = 0;
  
  for (const service of this.services) {
    // Use each service's uptimePercentage or default to 100
    const serviceUptime = service.uptimePercentage || 100.0;
    totalUptimePercentage += serviceUptime;
  }
  
  // Return the average uptime percentage
  return parseFloat((totalUptimePercentage / this.services.length).toFixed(2));
});

// Keep the existing method for detailed calculations when needed
organizationSchema.methods.calculateOverallUptime = async function(days = 90) {
  // Populate services if they haven't been populated yet
  if (!this.services) {
    await this.populate('services');
  }
  
  // If no services, return 100% uptime
  if (!this.services || this.services.length === 0) {
    return 100.0;
  }
  
  // Calculate the average uptime percentage across all services
  let totalUptimePercentage = 0;
  
  for (const service of this.services) {
    // For each service, we need to calculate its uptime percentage
    const daysAgo = new Date();
    daysAgo.setDate(daysAgo.getDate() - days);
    
    // Get relevant status history for the timeframe
    const relevantHistory = service.statusHistory.filter(item => 
      item.timestamp >= daysAgo
    );
    
    let serviceUptime = 100.0;
    
    if (relevantHistory.length > 0) {
      // Calculate downtime for each service
      let downtime = 0;
      for (let i = 0; i < relevantHistory.length - 1; i++) {
        if (relevantHistory[i].status !== 'operational') {
          const currentTime = relevantHistory[i].timestamp;
          const nextTime = relevantHistory[i + 1].timestamp;
          downtime += nextTime - currentTime;
        }
      }
      
      // Handle the most recent status if it's not operational
      if (relevantHistory[relevantHistory.length - 1].status !== 'operational') {
        const lastTime = relevantHistory[relevantHistory.length - 1].timestamp;
        const now = new Date();
        downtime += now - lastTime;
      }
      
      const totalTime = days * 24 * 60 * 60 * 1000;
      serviceUptime = 100 - (downtime / totalTime * 100);
      serviceUptime = Math.max(0, Math.min(100, parseFloat(serviceUptime.toFixed(2))));
    }
    
    totalUptimePercentage += serviceUptime;
  }
  
  // Return the average uptime percentage
  return parseFloat((totalUptimePercentage / this.services.length).toFixed(2));
};

// Static method to calculate uptime for a specific organization
organizationSchema.statics.getUptimeStats = async function(organizationId, days = 90) {
  const organization = await this.findById(organizationId).populate('services');
  if (!organization) {
    throw new Error('Organization not found');
  }
  
  const overallUptime = await organization.calculateOverallUptime(days);
  
  // Get individual service uptimes
  const serviceUptimes = organization.services.map(service => {
    return {
      serviceId: service._id,
      serviceName: service.name,
      uptime: service.uptimePercentage || 100.0,
      currentStatus: service.status
    };
  });
  
  return {
    organizationId: organization._id,
    organizationName: organization.name,
    overallUptime,
    serviceCount: organization.services.length,
    serviceUptimes,
    timeFrame: `Last ${days} days`
  };
};

// Middleware to update timestamps
organizationSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Index for faster queries
organizationSchema.index({ owner: 1 });
organizationSchema.index({ domain: 1 }, { unique: true });

const Organization = mongoose.model('Organization', organizationSchema);

module.exports = Organization;