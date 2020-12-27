/*
 * Copyright (c) 2020, Dan Abarbanel <abarbaneld at fluidt dot dev>
 * All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions are met:
 *
 *   * Redistributions of source code must retain the above copyright notice,
 *     this list of conditions and the following disclaimer.
 *   * Redistributions in binary form must reproduce the above copyright
 *     notice, this list of conditions and the following disclaimer in the
 *     documentation and/or other materials provided with the distribution.
 *   * Neither the name of Fluiddb nor the names of its contributors may be used
 *     to endorse or promote products derived from this software without
 *     specific prior written permission.
 *
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
 * AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
 * IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE
 * ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT OWNER OR CONTRIBUTORS BE
 * LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR
 * CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF
 * SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS
 * INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN
 * CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE)
 * ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE
 * POSSIBILITY OF SUCH DAMAGE.
 */
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