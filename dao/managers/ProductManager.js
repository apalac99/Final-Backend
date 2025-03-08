import { ProductModel } from '../models/product.model.js';


export class ProductManager {
  /**
   * Obtiene una lista de productos paginada y filtrada.
   * @param {number} limit - Límite de productos por página.
   * @param {number} page - Número de página.
   * @param {string} sort - Ordenamiento (asc o desc).
   * @param {string} query - Filtro por categoría.
   * @returns {Object} - Objeto con los productos y metadatos de paginación.
   */
  async getProducts(limit = 10, page = 1, sort, query) {
    try {
      const filter = query ? { category: query } : {};
      const sortOptions = sort === 'asc' ? { price: 1 } : sort === 'desc' ? { price: -1 } : {};

      const options = {
        limit,
        page,
        sort: sortOptions,
        lean: true,
      };

      const result = await ProductModel.paginate(filter, options);
      return result;
    } catch (error) {
      console.error('Error al obtener los productos:', error.message);
      throw error;
    }
  }

  /**
   * Obtiene un producto por su ID.
   * @param {string} productId - ID del producto.
   * @returns {Object} - Producto encontrado.
   * @throws {Error} - Si el producto no existe.
   */
  async getProductById(productId) {
    try {
      const product = await ProductModel.findById(productId);
      if (!product) throw new Error('Producto no encontrado');
      return product;
    } catch (error) {
      console.error('Error al obtener el producto por ID:', error.message);
      throw error;
    }
  }

  /**
   * Agrega un nuevo producto.
   * @param {Object} productData - Datos del producto.
   * @returns {Object} - Producto creado.
   * @throws {Error} - Si los datos son inválidos o el código ya existe.
   */
  async addProduct(productData) {
    try {
      // Validar campos obligatorios
      const requiredFields = ['title', 'description', 'code', 'price', 'stock', 'category'];
      for (const field of requiredFields) {
        if (!productData[field]) {
          throw new Error(`El campo "${field}" es obligatorio.`);
        }
      }

      // Validar que el código sea único
      const existingProduct = await ProductModel.findOne({ code: productData.code });
      if (existingProduct) {
        throw new Error(`El código "${productData.code}" ya está en uso.`);
      }

      // Crear y guardar el nuevo producto
      const newProduct = new ProductModel(productData);
      await newProduct.save();
      return newProduct;
    } catch (error) {
      console.error('Error al agregar el producto:', error.message);
      throw error;
    }
  }

  /**
   * Actualiza un producto existente.
   * @param {string} productId - ID del producto.
   * @param {Object} productData - Datos actualizados del producto.
   * @returns {Object} - Producto actualizado.
   * @throws {Error} - Si el producto no existe.
   */
  async updateProduct(productId, productData) {
    try {
      const updatedProduct = await ProductModel.findByIdAndUpdate(
        productId,
        productData,
        { new: true }
      );
      if (!updatedProduct) throw new Error('Producto no encontrado');
      return updatedProduct;
    } catch (error) {
      console.error('Error al actualizar el producto:', error.message);
      throw error;
    }
  }

  /**
   * Elimina un producto por su ID.
   * @param {string} productId - ID del producto.
   * @returns {Object} - Producto eliminado.
   * @throws {Error} - Si el producto no existe.
   */
  async deleteProduct(productId) {
    try {
      const deletedProduct = await ProductModel.findByIdAndDelete(productId);
      if (!deletedProduct) throw new Error('Producto no encontrado');
      return deletedProduct;
    } catch (error) {
      console.error('Error al eliminar el producto:', error.message);
      throw error;
    }
  }
}