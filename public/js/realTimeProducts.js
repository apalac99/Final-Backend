
const socket = io();

// Manejar el envío del formulario
document.getElementById('addProductForm').addEventListener('submit', (e) => {
  e.preventDefault();

  // Obtener los datos del formulario
  const formData = new FormData(e.target);
  const product = {
    title: formData.get('title'),
    description: formData.get('description'),
    code: formData.get('code'),
    price: parseFloat(formData.get('price')),
    stock: parseInt(formData.get('stock')),
    category: formData.get('category'),
    thumbnails: formData.get('thumbnails').split(','),
    status: true,
  };

  // Enviar el producto al servidor a través de Socket.IO
  socket.emit('addProduct', product);

  // Limpiar el formulario
  e.target.reset();
});

// Escuchar eventos para actualizar la lista de productos
socket.on('updateProducts', (products) => {
  const productList = document.getElementById('productList');
  productList.innerHTML = '';

  if (products.length > 0) {
    products.forEach((product) => {
      const productItem = document.createElement('div');
      productItem.classList.add('product');
      productItem.setAttribute('data-id', product._id);
      productItem.innerHTML = `
        <h2>${product.title}</h2>
        <p>Precio: $${product.price}</p>
        <p>Stock: ${product.stock}</p>
      `;
      productList.appendChild(productItem);
    });
  } else {
    productList.innerHTML = '<p>No hay productos disponibles.</p>';
  }
});