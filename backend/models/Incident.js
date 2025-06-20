const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const incidentSchema = new Schema({
  _id: {
    type: Schema.Types.ObjectId,
    auto: true
  },
  title: {
    type: String,
    required: [true, 'Incident title is required'],
    trim: true,
    maxlength: [200, 'Incident title cannot be more than 200 characters']
  },
  description: {
    type: String,
    required: [true, 'Incident description is required'],
    trim: true
  },
  status: {
    type: String,
    enum: {
      values: ['investigating', 'identified', 'monitoring', 'resolved'],
      message: '{VALUE} is not a valid status'
    },
    default: 'investigating'
  },
  impact: {
    type: String,
    enum: {
      values: ['none', 'minor', 'major', 'critical'],
      message: '{VALUE} is not a valid impact level'
    },
    default: 'minor'
  },
  affectedService: {
    type: Schema.Types.ObjectId,
    ref: 'Service',
    required: true
  },
  organizationId: {
    type: Schema.Types.ObjectId,
    ref: 'Organization',
    required: [true, 'Organization ID is required']
  },
  updates: [{
    message: {
      type: String,
      required: true,
      trim: true
    },
    status: {
      type: String,
      enum: ['investigating', 'identified', 'monitoring', 'resolved'],
      required: true
    },
    createdAt: {
      type: Date,
      default: Date.now
    },
    createdBy: {
      type: String,
      ref: 'User'
    }
  }],
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
  },
  notificationsSent: {
    email: {
      type: Boolean,
      default: false
    },
  },
}, {
  timestamps: true
});

// Add pre-save middleware to update timestamps
// Pre-save middleware
incidentSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  
  // Add update when status changes
  if (this.isModified('status')) {
    this.updates.push({
      message: `Status changed to ${this.status}`,
      status: this.status,
      createdAt: Date.now(),
      createdBy: this.createdBy
    });
  }
  
  next();
});

// Pre-findOneAndUpdate middleware
incidentSchema.pre('findOneAndUpdate', async function(next) {
  const update = this.getUpdate();
  if (update.status) {
    const incident = await this.model.findOne(this.getQuery());
    if (incident) {
      update.$push = update.$push || {};
      update.$push.updates = {
        message: `Status changed to ${update.status}`,
        status: update.status,
        createdAt: Date.now(),
        createdBy: update.createdBy || incident.createdBy
      };
    }
  }
  update.updatedAt = Date.now();
  next();
});

// Index for faster queries
incidentSchema.index({ organizationId: 1 });
incidentSchema.index({ status: 1 });
incidentSchema.index({ createdAt: -1 });
incidentSchema.index({ updatedAt: -1 });
incidentSchema.index({ 'affectedServices': 1 });

const Incident = mongoose.model('Incident', incidentSchema);

module.exports = Incident;