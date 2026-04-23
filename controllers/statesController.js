const states = require('../model/states.json');
const State = require('../model/State');

const getAllStates = (req, res) => {
    const sorted = [...states].sort((a, b) => a.state.localeCompare(b.state));
    res.json(sorted);
}

const getState = (req, res) => {
    const code = req.params.code.toUpperCase();
    const state = states.find(s => s.code === code);

    if (!state) {
        return res.status(404).json({ 'message': `No state found with code ${code}` });
    }

    res.json(state);
}

const getStateFunfacts = async (req, res) => {
    const code = req.params.state.toUpperCase();

    try {
        const state = await State.findOne({ code: code });
        if (!state) {
            return res.status(404).json({ 'message': `No state found with code ${code}` });
        }
        res.json({ state: state.state, code: state.code, funfacts: state.funfacts || [] });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}

const addStateFunfact = async (req, res) => {
    const code = req.params.state.toUpperCase();

    if (!req?.body?.funfacts || !Array.isArray(req.body.funfacts) || req.body.funfacts.length === 0) {
        return res.status(400).json({ 'message': 'funfacts array with at least one item is required.' });
    }

    try {
        let state = await State.findOne({ code: code });
        
        if (!state) {
            // Create new state if it doesn't exist
            const stateData = states.find(s => s.code === code);
            if (!stateData) {
                return res.status(404).json({ 'message': `No state found with code ${code}` });
            }
            state = new State({
                state: stateData.state,
                code: code,
                funfacts: req.body.funfacts
            });
        } else {
            // Add to existing funfacts
            state.funfacts.push(...req.body.funfacts);
        }
        
        const result = await state.save();
        res.status(201).json(result);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}

module.exports = {
    getAllStates,
    getState,
    getStateFunfacts,
    addStateFunfact
}