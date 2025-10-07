// routes/productItems.js
const express = require('express');
const { body, param } = require('express-validator');
const productItemController = require('../controllers/productItemController');

const router = express.Router();

/**
 * @openapi
 * /api/v1/productitems:
 *   get:
 *     summary: Retrieve a list of product items
 *     responses:
 *       200:
 *         description: A list of product items
 *   post:
 *     summary: Create a new product item
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - price
 *             properties:
 *               name:
 *                 type: string
 *               price:
 *                 type: number
 *     responses:
 *       201:
 *         description: Product item created
 *       400:
 *         description: Invalid input
 */

/**
 * @openapi
 * /api/v1/productitems/{id}:
 *   get:
 *     summary: Get a product item by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: A single product item
 *       404:
 *         description: Product item not found
 *   put:
 *     summary: Update a product item by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               price:
 *                 type: number
 *     responses:
 *       200:
 *         description: Product item updated
 *       400:
 *         description: Invalid input
 *       404:
 *         description: Product item not found
 *   delete:
 *     summary: Delete a product item by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       204:
 *         description: Product item deleted
 *       404:
 *         description: Product item not found
 */

/**
 * Validation rules
 */
const createAndUpdateValidations = [
    body('name').isString().notEmpty().withMessage('name is required'),
    body('price').isFloat({ gt: 0 }).withMessage('price must be a positive number'),
];

router.get('/', productItemController.findAll);
router.post('/', createAndUpdateValidations, productItemController.create);
router.get('/:id', [param('id').isInt().withMessage('id must be an integer')], productItemController.findOne);
router.put('/:id', [param('id').isInt().withMessage('id must be an integer'), ...createAndUpdateValidations], productItemController.update);
router.delete('/:id', [param('id').isInt().withMessage('id must be an integer')], productItemController.delete);

module.exports = router;
