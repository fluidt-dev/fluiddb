const express = require('express')
const router = express.Router()
const logger = require('@fluidt/logger')
const StorageService = require('../services/storage')

//Storage
const storage = {}
// middleware that is specific to this router
router.use((req,res,next) => {
    logger.debug(`Access Request '/model'`);
    next();
});

router.get('/:key', (req, res) => {
    if (StorageService.exists(req.params.key)) {        
        return res.json(StorageService.get(req.params.key));
    }
    return res.status(404).json({ error: `${req.params.key} not found.` });
})

router.post('/:key', (req, res) => {
    if (!req.body) {
        return res.status(400).send({ error: `${req.params.key} has no object to save.` });
    }
    if (StorageService.exists(req.params.key)) {
        return res.status(406).send({ error: `${req.params.key} already exists.` });
    }
    let saved = StorageService.create(req.params.key, req.body);
    return res.status(201).json(saved);
})

router.delete('/:key', (req, res) => {
    if (StorageService.exists(req.params.key)) {
        StorageService.delete(req.params.key);
        return res.status(204).send();
    }
    return res.status(404).send({ error: `${req.params.key} not found.` });
})

router.put('/:key', (req, res) => {    
    if (StorageService.exists(req.params.key)) {
        let replaced = StorageService.replace(req.params.key, req.body);
        return res.status(200).send(replaced);
    }
    return res.status(404).send({ error: `${req.params.key} not found.`});
})

router.patch('/:key', (req, res) => {
    if (!req.body) {
        return res.status(400).send({ error: `${req.params.key} has no object to save.` });
    }
    if(StorageService.exists(req.params.key)){
        let updated = StorageService.update(req.params.key,req.body);
        return res.status(200).json(updated);
    }
    return res.status(404).send({ error: `${req.params.key} not found.`});
})

module.exports = router