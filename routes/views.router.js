import express from 'express';
import { ProductManager } from '../dao/managers/ProductManager.js';
import { CartManager } from '../dao/managers/CartManager.js';

const router = express.Router();
const productManager = new ProductManager();
const cartManager = new CartManager();

// Ruta para la raíz (/)
router.get('/', async (req, res) => {
  try {
    const products = await productManager.getProducts(10, 1);
    res.render('home', { products: products.docs, defaultCartId: req.app.locals.defaultCartId }); // Pasa el ID del carrito por defecto
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).send('Error fetching products');
  }
});

// Ruta para /products
router.get('/products', async (req, res) => {
  const { limit = 10, page = 1, sort, query } = req.query;
  try {
    const products = await productManager.getProducts(limit, page, sort, query);
    res.render('index', { products: products.docs, ...products });
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).send('Error fetching products');
  }
});

// Ruta para /cart
router.get('/cart', async (req, res) => {
  try {
    const cart = await cartManager.getCartById(req.app.locals.defaultCartId); // Usa el ID del carrito por defecto
    res.render('cart', { cart });
  } catch (error) {
    console.error('Error fetching cart:', error);
    res.status(500).send('Error fetching cart');
  }
});

// Ruta para /realtimeproducts
router.get('/realtimeproducts', async (req, res) => {
  try {
    const products = await productManager.getProducts(10, 1);
    res.render('realTimeProducts', { products: products.docs });
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).send('Error fetching products');
  }
});

export default router;