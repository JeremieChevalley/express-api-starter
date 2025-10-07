// routes/products.js
const express = require('express');
const { body, param } = require('express-validator');
const productController = require('../controllers/productController');

const router = express.Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     ProductComposition:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           example: 1
 *         product_id:
 *           type: integer
 *           example: 1
 *         item_id:
 *           type: integer
 *           example: 2
 */

/**
 * @openapi
 * /products:
 *   get:
 *     summary: Retrieve a list of products
 *     responses:
 *       200:
 *         description: A list of product
 *   post:
 *     summary: Create a new product
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
 *         description: Product item
 *       400:
 *         description: Invalid input
 */

/**
 * @openapi
 * /products/{id}:
 *   get:
 *     summary: Get a product by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: A single product
 *       404:
 *         description: Product not found
 *   put:
 *     summary: Update a product by ID
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
 *         description: Product updated
 *       400:
 *         description: Invalid input
 *       404:
 *         description: Product not found
 *   delete:
 *     summary: Delete a product by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       204:
 *         description: Product deleted
 *       404:
 *         description: Product not found
 */

/**
 * @openapi
 * /products/{id}/compositions:
 *   get:
 *     summary: Get all composition items for a product
 *     tags: [Compositions]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Product ID
 *         schema:
 *           type: integer
 *           example: 1
 *     responses:
 *       '200':
 *         description: Array of product compositions
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/ProductComposition'
 *       '404':
 *         description: Product not found
 *
 *   post:
 *     summary: Add a composition item to a product
 *     tags: [Compositions]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the product to which the composition is added
 *         schema:
 *           type: integer
 *           example: 1
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               item_id:
 *                 type: integer
 *                 description: The ID of the product item to associate
 *                 example: 2
 *     responses:
 *       201:
 *         description: Composition successfully added
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ProductComposition'
 *       400:
 *         description: Validation error or missing data
 *       404:
 *         description: Product or item not found
 *
 *
 *   delete:
 *     summary: Delete all composition items for a specific product
 *     tags: [Compositions]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the product whose compositions should be deleted
 *         schema:
 *           type: integer
 *           example: 1
 *     responses:
 *       204:
 *         description: All compositions successfully deleted
 *       404:
 *         description: Product or composition not found
 */

/**
 * Validation rules
 */
const createAndUpdateValidationsProduct = [
    body('name').isString().notEmpty().withMessage('name is required'),
    body('price').isFloat({ gt: 0 }).withMessage('price must be a positive number'),
];

const createAndUpdateValidationsCompositions = [
    body('product_id').isString().notEmpty().withMessage('product id is required'),
    body('item_id').isString().notEmpty().withMessage('item id is required'),
];

// ---------------- Product ----------------
router.get('/', productController.findAll);
router.post('/', createAndUpdateValidationsProduct, productController.create);
router.get('/:id', [param('id').isInt()], productController.findOne);
router.put('/:id', [param('id').isInt(), createAndUpdateValidationsProduct], productController.update);
router.delete('/:id', [param('id').isInt()], productController.delete);
router.get('/:id/full', [param('id').isInt()], productController.getProductWithItems);

// ---------------- Composition ----------------
router.get('/:id/compositions',[param('id').isInt()], productController.getCompositions);
router.post('/:id/compositions', createAndUpdateValidationsCompositions, productController.addComposition);
router.delete('/:id/compositions', [param('id').isInt()], productController.deleteCompositions);

module.exports = router;
