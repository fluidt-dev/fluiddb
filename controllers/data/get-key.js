const StorageService = require('../../services/storage')
module.exports = (req, res) => {
    if (StorageService.exists(req.params.key)) {        
        return res.json(StorageService.get(req.params.key));
    }
    return res.status(404).json({ error: `${req.params.key} not found.` });
}