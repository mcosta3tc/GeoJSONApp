const express = require('express');
const router = express.Router();
const {getStores, addStores} = require('../controllers/stores')

router.route('/')
    .get(getStores)
    .post(addStores)

module.exports = router;