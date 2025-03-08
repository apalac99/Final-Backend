import express from 'express';
import { CartManager } from '../dao/managers/CartManager.js';

const router = express.Router();
const cartManager = new CartManager();

router.post('/', async (req, res) => {
  const newCart = await cartManager.createCart();
  res.status(201).json(newCart);
});

router.get('/:cid', async (req, res) => {
  const cart = await cartManager.getCartById(req.params.cid);
  res.json(cart);
});

router.post('/:cid/product/:pid', async (req, res) => {
  const cart = await cartManager.addProductToCart(req.params.cid, req.params.pid);
  res.json(cart);
});

router.delete('/:cid/product/:pid', async (req, res) => {
  const cart = await cartManager.deleteProductFromCart(req.params.cid, req.params.pid);
  res.json(cart);
});

router.put('/:cid', async (req, res) => {
  const cart = await cartManager.updateCart(req.params.cid, req.body.products);
  res.json(cart);
});

router.delete('/:cid', async (req, res) => {
  const cart = await cartManager.deleteAllProductsFromCart(req.params.cid);
  res.json(cart);
});

export default router;