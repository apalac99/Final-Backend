# Final-Backend

Solicitud
Con base en nuestra implementación actual de productos, modificar el método GET / para que cumpla con los siguientes puntos:
Deberá poder recibir por query params un limit (opcional), una page (opcional), un sort (opcional) y un query (opcional)
-limit permitirá devolver sólo el número de elementos solicitados al momento de la petición, en caso de no recibir limit, éste será de 10.
page permitirá devolver la página que queremos buscar, en caso de no recibir page, ésta será de 1

query, el tipo de elemento que quiero buscar (es decir, qué filtro aplicar), en caso de no recibir query, realizar la búsqueda general
sort: asc/desc, para realizar ordenamiento ascendente o descendente por precio, en caso de no recibir sort, no realizar ningún ordenamiento


El método GET deberá devolver un objeto con el siguiente formato:
{
	status:success/error
payload: Resultado de los productos solicitados
totalPages: Total de páginas
prevPage: Página anterior
nextPage: Página siguiente
page: Página actual
hasPrevPage: Indicador para saber si la página previa existe
hasNextPage: Indicador para saber si la página siguiente existe.
prevLink: Link directo a la página previa (null si hasPrevPage=false)
nextLink: Link directo a la página siguiente (null si hasNextPage=false)
}


Se deberá poder buscar productos por categoría o por disponibilidad, y se deberá poder realizar un ordenamiento de estos productos de manera ascendente o descendente por precio.

Además, agregar al router de carts los siguientes endpoints:
DELETE api/carts/:cid/products/:pid deberá eliminar del carrito el producto seleccionado.
PUT api/carts/:cid deberá actualizar el carrito con un arreglo de productos con el formato especificado arriba.
PUT api/carts/:cid/products/:pid deberá poder actualizar SÓLO la cantidad de ejemplares del producto por cualquier cantidad pasada desde req.body

DELETE api/carts/:cid deberá eliminar todos los productos del carrito 
Esta vez, para el modelo de Carts, en su propiedad products, el id de cada producto generado dentro del array tiene que hacer referencia al modelo de Products. Modificar la ruta /:cid para que al traer todos los productos, los traiga completos mediante un “populate”. De esta manera almacenamos sólo el Id, pero al solicitarlo podemos desglosar los productos asociados.

Modificar la vista index.handlebars en el router de views ‘/products’, creada en la pre-entrega anterior, para visualizar todos los productos con su respectiva paginación. Además, cada producto mostrado puede resolverse de dos formas:
Llevar a una nueva vista con el producto seleccionado con su descripción completa, detalles de precio, categoría, etc. Además de un botón para agregar al carrito.
Sugerencia de la ruta: “/products/:pid”.
Contar con el botón de “agregar al carrito” directamente, sin necesidad de abrir una página adicional con los detalles del producto.

Además, agregar una vista en ‘/carts/:cid (cartId) para visualizar un carrito específico, donde se deberán listar SOLO los productos que pertenezcan a dicho carrito.


///////////////////////////////////////////


Estructura

── config/
│   └── db.js
│
├── public/
│   └─ js/
│       └─realTimeProducts.js
├── dao/
│   ├── models/
│   │   ├── cart.model.js
│   │   └── product.model.js
│   ├── managers/
│      ├── CartManager.js
│      └── ProductManager.js
│
├── routes/
│   ├── carts.router.js
│   ├── products.router.js
│   └── views.router.js
│
├── views/
│   ├── layouts/
│   │   └── main.handlebars
│   ├── cart.handlebars
│   ├── home.handlebars
│   ├── index.handlebars
│   └── realTimeProducts.handlebars
│
├── .env
├── .gitignore
├── app.js
├── package.json
├── package-lock.json
└── README.md

Página de Inicio:
URL: http://localhost:8080/
Descripción: Esta es la página principal de tu tienda, donde se mostrarán los productos disponibles.
Productos en Tiempo Real:
URL: http://localhost:8080/realtimeproducts
Descripción: Esta página mostrará los productos en tiempo real, actualizándose a medida que se agregan o eliminan productos.
Lista de Productos:
URL: http://localhost:8080/products
Descripción: Aquí podrás ver una lista de todos los productos disponibles en tu tienda.
Carrito de Compras:
URL: http://localhost:8080/cart
Descripción: Esta página mostrará los productos que has agregado a tu carrito de compras.
