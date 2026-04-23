const states = require('../model/states.json');

const verifyState = (req, res, next, value) => {
    const code = String(value || '').toUpperCase();
    const isValid = states.some((state) => state.code === code);

    if (!isValid) {
        return res.status(400).json({ message: 'Invalid state abbreviation parameter' });
    }

    req.stateCode = code;
    next();
};

module.exports = verifyState;
