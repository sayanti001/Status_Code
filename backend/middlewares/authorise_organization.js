const User = require('../models/user'); 

const authorise_organization = async (req, res, next) => {
    try {
        const auth0ID = req.auth.sub; 
        const organizationId = req.headers.organizationid;
        if (!organizationId) {
            return res.status(400).json({ message: 'Organization ID is required' });
        }

        const user = await User.findOne({ auth0ID });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        if (!user.organizations || !user.organizations.includes(organizationId)) {
            return res.status(403).json({ message: 'User is not authorised for this organization' });
        }
        console.log('User is authorized for this organization');

        next();
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

module.exports = authorise_organization;