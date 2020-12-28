const StorageService = require('../../services/storage')
module.exports = (req, res) => {
    if (StorageService.exists(req.params.key)) {
        StorageService.delete(req.params.key);
        return res.status(204).send();
    }
    return res.status(404).send({ error: `${req.params.key} not found.` });
}