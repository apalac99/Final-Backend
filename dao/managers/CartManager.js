import { CartModel } from '../models/cart.model.js';

export class CartManager {
  async createCart() {
    const newCart = new CartModel({ products: [] });
    await newCart.save();
    return newCart;
  }

  async getCartById(cartId) {
    const cart = await CartModel.findById(cartId).populate('products.product');
    if (!cart) throw new Error('Carrito no encontrado');
    return cart;
  }

  async addProductToCart(cartId, productId, quantity = 1) {
    const cart = await CartModel.findById(cartId);
    if (!cart) throw new Error('Carrito no encontrado');

    const productIndex = cart.products.findIndex(
      (p) => p.product.toString() === productId
    );

    if (productIndex !== -1) {
      cart.products[productIndex].quantity += quantity;
    } else {
      cart.products.push({ product: productId, quantity });
    }

    await cart.save();
    return cart;
  }

  async deleteProductFromCart(cartId, productId) {
    const cart = await CartModel.findById(cartId);
    if (!cart) throw new Error('Carrito no encontrado');

    cart.products = cart.products.filter(
      (p) => p.product.toString() !== productId
    );
    await cart.save();
    return cart;
  }

  async updateCart(cartId, products) {
    const cart = await CartModel.findById(cartId);
    if (!cart) throw new Error('Carrito no encontrado');

    cart.products = products;
    await cart.save();
    return cart;
  }

  async deleteAllProductsFromCart(cartId) {
    const cart = await CartModel.findById(cartId);
    if (!cart) throw new Error('Carrito no encontrado');

    cart.products = [];
    await cart.save();
    return cart;
  }
}