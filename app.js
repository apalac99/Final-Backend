import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import handlebars from 'express-handlebars';
import path from 'path';
import { fileURLToPath } from 'url';
import { connectDB } from './config/db.js';
import cartsRouter from './routes/carts.router.js';
import productsRouter from './routes/products.router.js';
import viewsRouter from './routes/views.router.js';
import { ProductManager } from './dao/managers/ProductManager.js';
import { CartManager } from './dao/managers/CartManager.js';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 8080;

// Conectar a la base de datos
connectDB();

// Configurar Handlebars
app.engine('handlebars', handlebars.engine());
app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname, 'views'));

// Middleware para archivos estáticos
app.use(express.static(path.join(__dirname, 'public')));

// Middleware para parsear JSON
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Crear un carrito por defecto al iniciar la aplicación
const cartManager = new CartManager();
let defaultCartId;

const createDefaultCart = async () => {
  try {
    const newCart = await cartManager.createCart();
    defaultCartId = newCart._id.toString(); // Guarda el ID del carrito por defecto
    console.log('Carrito por defecto creado con ID:', defaultCartId);
    app.locals.defaultCartId = defaultCartId; // Hacer el ID del carrito accesible en toda la aplicación
  } catch (error) {
    console.error('Error al crear el carrito por defecto:', error);
  }
};

// Llamar a la función para crear el carrito por defecto
createDefaultCart();

// Rutas
app.use('/api/carts', cartsRouter);
app.use('/api/products', productsRouter);
app.use('/', viewsRouter);

// Crear servidor HTTP y Socket.IO
const httpServer = createServer(app);
const io = new Server(httpServer);

// Lógica de Socket.IO
io.on('connection', (socket) => {
  console.log('Nuevo cliente conectado');

  // Escucha eventos para agregar o eliminar productos
  socket.on('addProduct', async (product) => {
    try {
      const productManager = new ProductManager();
      await productManager.addProduct(product);
      const products = await productManager.getProducts(10, 1);
      io.emit('updateProducts', products.docs); // Envía la lista actualizada a todos los clientes
    } catch (error) {
      console.error('Error adding product:', error);
    }
  });

  socket.on('deleteProduct', async (productId) => {
    try {
      const productManager = new ProductManager();
      await productManager.deleteProduct(productId);
      const products = await productManager.getProducts(10, 1);
      io.emit('updateProducts', products.docs); // Envía la lista actualizada a todos los clientes
    } catch (error) {
      console.error('Error deleting product:', error);
    }
  });
});

// Iniciar el servidor
httpServer.listen(PORT, () => {
  console.log(`Servidor escuchando en http://localhost:${PORT}`);
});