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

const getAllStates = async (req, res) => {
    const { contig } = req.query;
    let result = [...states];

    if (contig === 'true') {
        result = result.filter((s) => !NON_CONTIGUOUS.includes(s.code));
    } else if (contig === 'false') {
        result = result.filter((s) => NON_CONTIGUOUS.includes(s.code));
    }

    result.sort((a, b) => a.state.localeCompare(b.state));

    try {
        const mongoStates = await State.find(
            { code: { $in: result.map((state) => state.code) } },
            { code: 1, funfacts: 1, _id: 0 }
        ).lean();

        const funfactsByCode = new Map(
            mongoStates
                .filter((state) => Array.isArray(state.funfacts) && state.funfacts.length)
                .map((state) => [state.code, state.funfacts])
        );

        const merged = result.map((state) => {
            const funfacts = funfactsByCode.get(state.code);
            return funfacts ? { ...state, funfacts } : state;
        });

        res.json(merged);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}

const getState = async (req, res) => {
    const code = req.stateCode;

    try {
        const state = await getStateWithFunfacts(code);

        res.json(state);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}

const getStateFunfacts = async (req, res) => {
    const code = req.stateCode;
    const stateData = findStateByCode(code);

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
    const code = req.stateCode;
    const state = findStateByCode(code);

    res.json({ state: state.state, capital: state.capital_city });
}

const getStateNickname = (req, res) => {
    const code = req.stateCode;
    const state = findStateByCode(code);

    res.json({ state: state.state, nickname: state.nickname });
}

const getStatePopulation = (req, res) => {
    const code = req.stateCode;
    const state = findStateByCode(code);

    res.json({ state: state.state, population: state.population.toLocaleString() });
}

const getStateAdmission = (req, res) => {
    const code = req.stateCode;
    const state = findStateByCode(code);

    res.json({ state: state.state, admitted: state.admission_date });
}

const addStateFunfact = async (req, res) => {
    const code = req.stateCode;

    if (!req?.body?.funfacts) {
        return res.status(400).json({ 'message': 'State fun facts value required' });
    }

    if (!Array.isArray(req.body.funfacts)) {
        return res.status(400).json({ 'message': 'State fun facts value must be an array' });
    }

    if (req.body.funfacts.length === 0) {
        return res.status(400).json({ 'message': 'State fun facts value required' });
    }

    try {
        let state = await State.findOne({ code: code });
        
        if (!state) {
            // Create new state if it doesn't exist
            const stateData = findStateByCode(code);
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

const updateStateFunfact = async (req, res) => {
    const code = req.stateCode;
    const stateData = findStateByCode(code);
    const { index, funfact } = req.body || {};

    if (!index) {
        return res.status(400).json({ message: 'State fun fact index value required' });
    }

    if (!funfact) {
        return res.status(400).json({ message: 'State fun fact value required' });
    }

    try {
        const state = await State.findOne({ code });

        if (!state?.funfacts?.length) {
            return res.status(404).json({ message: `No Fun Facts found for ${stateData.state}` });
        }

        const factIndex = Number(index) - 1;
        if (!Number.isInteger(Number(index)) || factIndex < 0 || factIndex >= state.funfacts.length) {
            return res.status(400).json({ message: `No Fun Fact found at that index for ${stateData.state}` });
        }

        state.funfacts[factIndex] = funfact;
        const result = await state.save();
        res.json({
            _id: result._id,
            state: result.state,
            code: result.code,
            funfacts: result.funfacts
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}

const deleteStateFunfact = async (req, res) => {
    const code = req.stateCode;
    const stateData = findStateByCode(code);
    const { index } = req.body || {};

    if (!index) {
        return res.status(400).json({ message: 'State fun fact index value required' });
    }

    try {
        const state = await State.findOne({ code });

        if (!state?.funfacts?.length) {
            return res.status(404).json({ message: `No Fun Facts found for ${stateData.state}` });
        }

        const factIndex = Number(index) - 1;
        if (!Number.isInteger(Number(index)) || factIndex < 0 || factIndex >= state.funfacts.length) {
            return res.status(400).json({ message: `No Fun Fact found at that index for ${stateData.state}` });
        }

        state.funfacts.splice(factIndex, 1);
        const result = await state.save();
        res.json(result);
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
    addStateFunfact,
    updateStateFunfact,
    deleteStateFunfact
}