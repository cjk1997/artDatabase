const express = require('express');
const router = express.Router();
const { 
    getWorks,
    addWork,
    updateWork,
    deleteWork
} = require('../../data/works');

router.get('/', async function(req, res, next) {
    try{
        const data = await getWorks();
        res.send(data);
    } catch(err) {
        console.log(err);
        res.send(500, 'Internal Server Issue, check logs');
    }  
});

router.post('/', async function(req, res, next) {
    try {
        const data = await addWork(req.body);
        res.send(data);
    } catch(err) {
        if (err.error) {
            res.status(400).send(err);
        } else {
            console.log(err);
            res.status(500).send('Internal Server Issue, check logs');

        };
    };
});

router.patch('/:id', async function(req, res, next) {
    try {
        const data = await updateWork(req.params.id, req.body);
        res.send(data);
    } catch (err) {
        if (err.error) {
            res.status(400).send(err);
        } else {
            console.log(err);
            res.status(500).send("Internal Server Issues, check logs");
        };
    };
});

router.delete('/:id', async function(req, res, next) {
    try {
        const data = await deleteWork(req.params.id);
        res.send(data);
    } catch(err) {
        if (err.error) {
            res.status(400).send(err);
        } else {
            console.log(err);
            res.status(500).send('Internal Server Issue, check log');
        };
    };
});

module.exports = router;