const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const serviceSchema = new Schema({
  _id: {
    type: Schema.Types.ObjectId,
    auto: true
  },
  name: {
    type: String,
    required: [true, 'Service name is required'],
    trim: true,
    maxlength: [100, 'Service name cannot be more than 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Service description is required'],
    trim: true,
    maxlength: [500, 'Service description cannot be more than 500 characters']
  },
  status: {
    type: String,
    enum: {
      values: ['operational', 'degraded_performance', 'partial_outage', 'major_outage'],
      message: '{VALUE} is not a valid status'
    },
    default: 'operational'
  },
  statusHistory: [{
    status: {
      type: String,
      enum: ['operational', 'degraded', 'partial_outage', 'major_outage'],
      required: true
    },
    timestamp: {
      type: Date,
      default: Date.now
    },
    message: {
      type: String,
      trim: true
    }
  }],
  organizationId: {
    type: Schema.Types.ObjectId,
    ref: 'Organization',
    required: [true, 'Organization ID is required']
  },
  createdBy: {
    type: String,
    required: [true, 'Created by auth0ID is required']
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
  timestamps: true, // Automatically create createdAt and updatedAt fields
});

// Add virtual field for uptime percentage (calculated when needed)
serviceSchema.virtual('uptimePercentage').get(function() {
  if (!this.statusHistory || this.statusHistory.length === 0) {
    return 100.0; // Default to 100% if no history
  }
  
  // For a simple implementation, we could calculate based on the last 30 days
  const ninetyDaysAgo = new Date();
  ninetyDaysAgo.setDate(ninetyDaysAgo.getDate() - 90);
  
  const relevantHistory = this.statusHistory.filter(item => 
    item.timestamp >= ninetyDaysAgo
  );
  
  if (relevantHistory.length === 0) {
    return 100.0;
  }
  
  // Count non-operational time
  let downtime = 0;
  for (let i = 0; i < relevantHistory.length - 1; i++) {
    if (relevantHistory[i].status !== 'operational') {
      const currentTime = relevantHistory[i].timestamp;
      const nextTime = relevantHistory[i + 1].timestamp;
      downtime += nextTime - currentTime;
    }
  }
  
  // Handle the latest status if it's not operational
  if (relevantHistory[relevantHistory.length - 1].status !== 'operational') {
    const lastTime = relevantHistory[relevantHistory.length - 1].timestamp;
    const now = new Date();
    downtime += now - lastTime;
  }
  
  const totalTime = 90 * 24 * 60 * 60 * 1000;
  const uptimePercentage = 100 - (downtime / totalTime * 100);
  
  return Math.max(0, Math.min(100, parseFloat(uptimePercentage.toFixed(2))));
});

// Middleware to update timestamps
serviceSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Pre-save middleware to add status to history if it has changed
serviceSchema.pre('save', function(next) {
  if (this.isModified('status')) {
    this.statusHistory.push({
      status: this.status,
      timestamp: new Date(),
      message: `Status set to ${this.status}`
    });
  }
  next();
});

// Middleware to update timestamps and add status to history on update
serviceSchema.pre('findOneAndUpdate', async function(next) {
  const update = this.getUpdate();
  if (update.status) {
    const service = await this.model.findOne(this.getQuery());
    if (service && service.status !== update.status) {
      update.$push = update.$push || {};
      update.$push.statusHistory = {
        status: update.status,
        timestamp: new Date(),
        message: `Status changed to ${update.status}`
      };
    }
  }
  update.updatedAt = Date.now();
  next();
});

// Index for faster queries
serviceSchema.index({ organizationId: 1 });
serviceSchema.index({ status: 1 });
serviceSchema.index({ 'statusHistory.timestamp': -1 });

const Service = mongoose.model('Service', serviceSchema);

module.exports = Service;