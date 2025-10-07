const ProductService = require('../services/productService');

const ProductController = {
    // GET /api/v1/products
    async findAll(req, res) {
        try {
            const products = await ProductService.getAll();
            res.json(products);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    // GET /api/v1/products/:id
    async findOne(req, res) {
        try {
            const product = await ProductService.getById(req.params.id);
            if (!product) return res.status(404).json({ error: 'Product not found' });
            res.json(product);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    // POST /api/v1/products
    async create(req, res) {
        try {
            const product = await ProductService.create(req.body);
            res.status(201).json(product);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    // PUT /api/v1/products/:id/
    async update(req, res) {
        try {
            const { id } = req.params;
            const updatedProduct = await ProductService.update(id, req.body);
            if (!updatedProduct) return res.status(404).json({ error: 'Product not found' });
            res.json(updatedProduct);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    // DELETE /api/v1/products/:id/
    async delete(req, res) {
        try {
            const { id } = req.params;
            const deleted = await ProductService.delete(id);
            if (!deleted) return res.status(404).json({ error: 'Product not found' });
            res.status(204).send(); // 204 No Content
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    // GET /api/v1/products/:id/full
    // Returns product + list of items
    async getProductWithItems(req, res) {
        try {
            const { id } = req.params;
            const product = await ProductService.getProductWithItems(id);
            res.json(product);
        } catch (error) {
            res.status(404).json({ error: error.message });
        }
    },

    // POST /api/v1/products/:id/compositions
    async addComposition(req, res) {
        try {
            const { id } = req.params;
            const { item_id, quantity, unit } = req.body;
            const composition = await ProductService.addComposition(id, item_id, quantity, unit);
            res.status(201).json(composition);
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    },

    // GET /api/v1/products/:id/compositions
    async getCompositions(req, res) {
        try {
            const { id } = req.params;
            const compositions = await ProductService.getCompositions(id);
            res.json(compositions);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    // GET /api/v1/products/:id/compositions
    async deleteCompositions(req, res) {
        try {
            const { id } = req.params;
            const deleted = await ProductService.deleteCompositions(id);
            if (!deleted) return res.status(404).json({ error: 'Composition not found' });
            res.status(204).send(); // 204 No Content
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
};

module.exports = ProductController;
