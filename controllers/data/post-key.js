const StorageService = require('../../services/storage')
module.exports = (req, res) => {
    if (!req.body) {
        return res.status(400).send({ error: `${req.params.key} has no object to save.` });
    }
    if (StorageService.exists(req.params.key)) {
        return res.status(406).send({ error: `${req.params.key} already exists.` });
    }
    let saved = StorageService.create(req.params.key, req.body);
    return res.status(201).json(saved);
}