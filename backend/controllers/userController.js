// backend/controllers/userController.js
const User = require('../models/User');

exports.getProfile = async (req, res) => {
    try {
        res.json(req.user);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.updateProfile = async (req, res) => {
    try {
        const allowedUpdates = ['username', 'bio'];
        const updates = Object.keys(req.body)
            .filter(key => allowedUpdates.includes(key));

        if (updates.length === 0) {
            return res.status(400).json({ error: 'No valid updates provided' });
        }

        updates.forEach(update => {
            req.user[update] = req.body[update];
        });

        await req.user.save();
        res.json(req.user);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};
