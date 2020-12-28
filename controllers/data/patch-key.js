const StorageService = require('../../services/storage')
module.exports = (req, res) => {
    if (!req.body) {
        return res.status(400).send({ error: `${req.params.key} has no object to save.` });
    }
    if(StorageService.exists(req.params.key)){
        let updated = StorageService.update(req.params.key,req.body);
        return res.status(200).json(updated);
    }
    return res.status(404).send({ error: `${req.params.key} not found.`});
}