//
class Producto {
    constructor(id, nombre, precio, categoria, imagen) {
      this.id = id;
      this.nombre = nombre;
      this.precio = precio;
      this.categoria = categoria;
      this.imagen = imagen;
    }
  }


  class BaseDeDatos {
    constructor(){
        this.productos = [];
        this.agregarRegistro(1, "Manzanas", 400, "Frutas", "../images/manzanas.png");
        this.agregarRegistro(2, "Bananas", 900, "Frutas", "../images/bananas.png");
        this.agregarRegistro(3, "Frutillas", 800, "Frutas", "../images/frutillas.png");
        this.agregarRegistro(4, "Duraznos", 250, "Frutas", "../images/durazno.png");
        this.agregarRegistro(5, "Frambuesas", 400, "Frutas", "../images/frambuesas.png");
        this.agregarRegistro(6, "Blueberry", 600, "Frutas", "../images/blueberry.png");
        this.agregarRegistro(7, "Coco", 400, "Frutas", "../images/coco.png");
        this.agregarRegistro(8, "Kiwi", 400, "Frutas", "../images/kiwi.png");
        this.agregarRegistro(9, "Mango", 400, "Frutas", "../images/mango.png");
        this.agregarRegistro(10, "Maracuya", 400, "Frutas", "../images/maracuya.png");
        this.agregarRegistro(11, "Sandia", 400, "Frutas", "../images/sandia.png");
        this.agregarRegistro(12, "Uvas", 400, "Frutas", "../images/uva.png");
    }

    agregarRegistro(id, nombre, precio, categoria, imagen){
        const producto = new Producto(id, nombre, precio, categoria, imagen);
        this.productos.push(producto);
    }

    traerRegistros() {
        return this.productos;
    }

    registroPorId(id){
        return this.productos.find((producto)=> producto.id === id);
    }

    registroPorNombre(palabra){
        return this.productos.filter((producto) => producto.nombre.toLowerCase().includes(palabra.toLowerCase()));
    }
  }

  class Carrito {
    constructor() {
      // Storage
      const carritoStorage = JSON.parse(localStorage.getItem("carrito"));
      // Array donde estan almacenados productos 
      this.carrito = carritoStorage || [];
      this.total = 0;
      this.cantidadProductos = 0;
    
      this.listar();
    }
    // Método para saber si el producto ya se encuentra en el carrito
  estaEnCarrito({ id }) {
    return this.carrito.find((producto) => producto.id === id);
  }

  // Agregar al carrito
  agregar(producto) {
    const productoEnCarrito = this.estaEnCarrito(producto);
    if (!productoEnCarrito) {
      this.carrito.push({ ...producto, cantidad: 1 });
    } else {
      productoEnCarrito.cantidad++;
    }
    // Actualizar storage
    localStorage.setItem("carrito", JSON.stringify(this.carrito));
    //
    // Muestra productos en el HTML
    this.listar();
  }

  // Quitar del carrito
  quitar(id) {
    const indice = this.carrito.findIndex((producto) => producto.id === id);
    if (this.carrito[indice].cantidad > 1) {
      this.carrito[indice].cantidad--;
    } else {
      this.carrito.splice(indice, 1);
    }
    // Actualizar storage
    localStorage.setItem("carrito", JSON.stringify(this.carrito));

    // Muestra los productos en el HTML
    this.listar();
  }
  // Renderizar productos en el HTML
  listar() {
    // Reiniciar variables
    this.total = 0;
    this.cantidadProductos = 0;
    divCarrito.innerHTML = "";

    for (const producto of this.carrito) {
      divCarrito.innerHTML += `
        <div class="productoCarrito">
          <h2>${producto.nombre}</h2>
          <p>$${producto.precio}</p>
          <p>Cantidad: ${producto.cantidad}</p>
          <a href="#" class="btnQuitar" data-id="${producto.id}">Quitar del carrito</a>
        </div>
      `;
      // Actualizamos los totales
      this.total += producto.precio * producto.cantidad;
      this.cantidadProductos += producto.cantidad;
    }

    const botonesQuitar = document.querySelectorAll(".btnQuitar");
    for (const boton of botonesQuitar) {
      boton.addEventListener("click", (event) => {
        event.preventDefault();  
        const idProducto = Number(boton.dataset.id);
        this.quitar(idProducto);
      });
    }

    // Actualizo los contadores del HTML
    spanCantidadProductos.innerText = this.cantidadProductos;
    spanTotalCarrito.innerText = this.total;
  }
}

// Instanciamos la base de datos
const bd = new BaseDeDatos();
// Elementos
const spanCantidadProductos = document.querySelector("#cantidadProductos");
const spanTotalCarrito = document.querySelector("#totalCarrito");
const divProductos = document.querySelector("#productos");
const divCarrito = document.querySelector("#carrito");
const inputBuscar = document.querySelector("#inputBuscar");
const botonCarrito = document.querySelector("section h1");

// Instaciamos la clase Carrito
const carrito = new Carrito();


// Mostramos el catálogo de la base de datos apenas carga la página
cargarProductos(bd.traerRegistros());

// Función para mostrar para renderizar productos del catálogo o buscador
function cargarProductos(productos) {
  divProductos.innerHTML = "";
  for (const producto of productos) {
    divProductos.innerHTML += `
      <div class="producto">
        <h2>${producto.nombre}</h2>
        <p class="precio">$${producto.precio}</p>
        <div class="imagen">
          <img src="img/${producto.imagen}" width="100" />
          <img src="img/${producto.imagen}" />
        </div>
        <a href="#" class="btnAgregar" data-id="${producto.id}">Agregar al carrito</a>
      </div>
    `;
  }
  // Lista dinámica con todos los botones que haya en nuestro catálogo
  const botonesAgregar = document.querySelectorAll(".btnAgregar");
  // Recorremos botón por botón de cada producto en el catálogo y le agregamos
  // el evento click a cada uno
  for (const boton of botonesAgregar) {
    boton.addEventListener("click", (event) => {
      // Evita el comportamiento default de HTML
      event.preventDefault();
      // Guardo el dataset ID que está en el HTML del botón Agregar al carrito
      const idProducto = Number(boton.dataset.id);
      // Uso el método de la base de datos para ubicar el producto según el ID
      const producto = bd.registroPorId(idProducto);
      //
      carrito.agregar(producto);
    });
  }
}



// Buscador
document.addEventListener("DOMContentLoaded", function () {
    const inputBuscar = document.getElementById("inputBuscar");

    inputBuscar.addEventListener("input", (event) => {

        event.preventDefault();
        const palabra = inputBuscar.value;
        const productos = bd.registrosPorNombre(palabra);
        cargarProductos(productos);
    })
});



//ocultar/mostrar el carrito
  botonCarrito.addEventListener("click", (event) => {
    document.querySelector("section").classList.toggle("ocultar");
  })