export const validate = (schema) => (req, res, next) => {
    try {
        schema.parse({
            body: req.body,
            query: req.query,
            params: req.params,
        })
        next();
    } catch (err) {
        return res.status(400).json({ errors: err.errors });
    }
}

export const validateBody = (schema) => (req, res, next) => {
    try {
        req.body = schema.parse(req.body);
        next();
    } catch (err) {
        return res.status(400).json({ errors: err.errors });
    }
};

export const validateQuery = (schema) => (req, res, next) => {
    try {
        req.query = schema.parse(req.query);
        next();
    } catch (err) {
        return res.status(400).json({ errors: err.errors });
    }
};

export const validateParams = (schema) => (req, res, next) => {
    try {
        req.params = schema.parse(req.params);
        next();
    } catch (err) {
        return res.status(400).json({ errors: err.errors });
    }
};
