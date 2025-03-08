import express from 'express';
import { ProductManager } from '../dao/managers/ProductManager.js';

const router = express.Router();
const productManager = new ProductManager();

router.get('/', async (req, res) => {
  const { limit = 10, page = 1, sort, query } = req.query;
  const products = await productManager.getProducts(limit, page, sort, query);
  res.json(products);
});

router.get('/:pid', async (req, res) => {
  const product = await productManager.getProductById(req.params.pid);
  res.json(product);
});


router.post('/', async (req, res) => {
  try {
    const newProduct = await productManager.addProduct(req.body);
    res.status(201).json(newProduct);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.put('/:pid', async (req, res) => {
  const updatedProduct = await productManager.updateProduct(req.params.pid, req.body);
  res.json(updatedProduct);
});

router.delete('/:pid', async (req, res) => {
  const deletedProduct = await productManager.deleteProduct(req.params.pid);
  res.json(deletedProduct);
});

export default router;