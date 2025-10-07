// routes/router.js
const express = require('express');
const productItemsRouter = require('./productItems');

const router = express.Router();

router.use('/productItems', productItemsRouter);

module.exports = router;
