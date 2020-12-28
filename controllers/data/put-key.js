const StorageService = require('../../services/storage')
module.exports = (req, res) => {    
    if (StorageService.exists(req.params.key)) {
        let replaced = StorageService.replace(req.params.key, req.body);
        return res.status(200).send(replaced);
    }
    return res.status(404).send({ error: `${req.params.key} not found.`});
}