const states = require('../model/states.json');
const State = require('../model/State');

const NON_CONTIGUOUS = ['AK', 'HI'];

const findStateByCode = (code) => states.find((s) => s.code === code);

const getStateWithFunfacts = async (code) => {
    const stateData = findStateByCode(code);
    if (!stateData) return null;

    const mongoState = await State.findOne({ code }).lean();
    if (mongoState?.funfacts?.length) {
        return { ...stateData, funfacts: mongoState.funfacts };
    }

    return stateData;
};

const getAllStates = (req, res) => {
    const { contig } = req.query;
    let result = [...states];

    if (contig === 'true') {
        result = result.filter((s) => !NON_CONTIGUOUS.includes(s.code));
    } else if (contig === 'false') {
        result = result.filter((s) => NON_CONTIGUOUS.includes(s.code));
    }

    result.sort((a, b) => a.state.localeCompare(b.state));
    res.json(result);
}

const getState = async (req, res) => {
    const code = req.stateCode || req.params.state.toUpperCase();

    try {
        const state = await getStateWithFunfacts(code);

        if (!state) {
            return res.status(404).json({ 'message': 'Invalid state abbreviation parameter' });
        }

        res.json(state);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}

const getStateFunfacts = async (req, res) => {
    const code = req.stateCode || req.params.state.toUpperCase();
    const stateData = findStateByCode(code);

    if (!stateData) {
        return res.status(404).json({ 'message': 'Invalid state abbreviation parameter' });
    }

    try {
        const state = await State.findOne({ code });

        if (!state?.funfacts?.length) {
            return res.status(404).json({ 'message': `No Fun Facts found for ${stateData.state}` });
        }

        const randomIndex = Math.floor(Math.random() * state.funfacts.length);
        res.json({ funfact: state.funfacts[randomIndex] });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}

const getStateCapital = (req, res) => {
    const code = req.stateCode || req.params.state.toUpperCase();
    const state = findStateByCode(code);

    if (!state) {
        return res.status(404).json({ 'message': 'Invalid state abbreviation parameter' });
    }

    res.json({ state: state.state, capital: state.capital_city });
}

const getStateNickname = (req, res) => {
    const code = req.stateCode || req.params.state.toUpperCase();
    const state = findStateByCode(code);

    if (!state) {
        return res.status(404).json({ 'message': 'Invalid state abbreviation parameter' });
    }

    res.json({ state: state.state, nickname: state.nickname });
}

const getStatePopulation = (req, res) => {
    const code = req.stateCode || req.params.state.toUpperCase();
    const state = findStateByCode(code);

    if (!state) {
        return res.status(404).json({ 'message': 'Invalid state abbreviation parameter' });
    }

    res.json({ state: state.state, population: state.population });
}

const getStateAdmission = (req, res) => {
    const code = req.stateCode || req.params.state.toUpperCase();
    const state = findStateByCode(code);

    if (!state) {
        return res.status(404).json({ 'message': 'Invalid state abbreviation parameter' });
    }

    res.json({ state: state.state, admitted: state.admission_date });
}

const addStateFunfact = async (req, res) => {
    const code = req.stateCode || req.params.state.toUpperCase();

    if (!req?.body?.funfacts || !Array.isArray(req.body.funfacts) || req.body.funfacts.length === 0) {
        return res.status(400).json({ 'message': 'funfacts array with at least one item is required.' });
    }

    try {
        let state = await State.findOne({ code: code });
        
        if (!state) {
            // Create new state if it doesn't exist
            const stateData = findStateByCode(code);
            if (!stateData) {
                return res.status(404).json({ 'message': 'Invalid state abbreviation parameter' });
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
    getStateCapital,
    getStateNickname,
    getStatePopulation,
    getStateAdmission,
    addStateFunfact
}