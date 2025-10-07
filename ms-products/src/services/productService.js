// src/services/productService.js
const ProductEntity = require('../entities/Product');
const fetch = require('node-fetch');

const PRODUCT_ITEM_SERVICE_URL = process.env.PRODUCT_ITEM_SERVICE_URL || 'http://localhost:3000';

const ProductService = {
    async getAll() {
        return ProductEntity.findAll();
    },

    async getById(id) {
        return ProductEntity.findById(id);
    },

    async create(product) {
        return ProductEntity.insert(product);
    },

    async update(id, productData) {
        const existing = await ProductEntity.findById(id);
        if (!existing) return null;

        return ProductEntity.update(id, productData);
    },

    async delete(id) {
        const existing = await ProductEntity.findById(id);
        if (!existing) return null;

        return ProductEntity.delete(id);
    },

    async getProductWithItems(productId) {
        const product = await ProductEntity.findById(productId);
        if (!product) throw new Error('Product not found');

        const compositions = await ProductEntity.findCompositions(productId);

        const items = await Promise.all(
            compositions.map(async (comp) => {
                const res = await fetch(`${PRODUCT_ITEM_SERVICE_URL}/api/v1/productItems/${comp.item_id}`);
                if (!res.ok) throw new Error(`ProductItem ${comp.item_id} not found`);
                const itemData = await res.json();
                return { ...itemData, quantity: comp.quantity, unit: comp.unit };
            })
        );

        return { ...product, items };
    },

    async addComposition(productId, item_id) {
        // Validate remote productItem via API
        const response = await fetch(`${PRODUCT_ITEM_SERVICE_URL}/api/v1/productItems/${item_id}`);
        if (!response.ok) throw new Error('Invalid productItem ID');

        return ProductEntity.insertComposition(productId, item_id);
    },

    async getCompositions(productId) {
        return ProductEntity.findCompositions(productId);
    },

    async deleteCompositions(id) {
        const existing = await ProductEntity.findCompositions(id);
        if (!existing) return null;

        return ProductEntity.deleteCompositions(id);
    }
};

module.exports = ProductService;
