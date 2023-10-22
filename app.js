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
    constructor() {
      //Array para el cataglogo
        this.productos = [];

        //llamamos a la funcion asinc
        this.cargarRegistros();
    }

    //Funcion asinc para cargar product desde JSON
    async cargarRegistros() {
      const resultado = await fetch('./json/productos.json');
      this.productos = await resultado.json();
      cargarProductos(this.productos);
    }

    //Devuelve el catalogo de productos
    traerRegistros() {
        return this.productos;
    }

    //Devuelve un producto segun el ID
    registroPorId(id){
        return this.productos.find((producto)=> producto.id === id);
    }

    //Nos devuelve un array c todas las coincidencias
    registroPorNombre(palabra) {
        return this.productos.filter((producto) => 
        producto.nombre.toLowerCase().includes(palabra.toLowerCase()));
    }

    //Nos devuelve un array c product que tenga la categoria

    registroPorCategoria(categoria) {
      return this.productos.filter((producto) => producto.categoria == categoria);
    }
  }

  //Clase carrito

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

  //Vaciar el carrito 
  vaciar () {
    this.total = 0;
    this.cantidadProductos = 0;
    this.carrito = [];
    localStorage.setItem("carrito", JSON.stringify(this.carrito));
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
    if (this.cantidadProductos > 0) {
      //Que boton sea visible
      botonComprar.style.display = "block";
    } else {
      //Que boton sea no visible
      botonComprar.style.display = "none";
    } 


    //Lista de todos los botones con .querySelectorAll
    const botonesQuitar = document.querySelectorAll(".btnQuitar");
    for (const boton of botonesQuitar) {
      boton.addEventListener("click", (event) => {
        event.preventDefault(); 
        //Obtengo el id por el dataset 
        const idProducto = Number(boton.dataset.id);
        this.quitar(idProducto);
      });
    }

    // Actualizo los contadores del HTML
    spanCantidadProductos.innerText = this.cantidadProductos;
    spanTotalCarrito.innerText = this.total;
  }
}

// Elementos
const spanCantidadProductos = document.querySelector("#cantidadProductos");
const spanTotalCarrito = document.querySelector("#totalCarrito");
const divProductos = document.querySelector("#productos");
const divCarrito = document.querySelector("#carrito");
const inputBuscar = document.querySelector("#inputBuscar");
const botonCarrito = document.querySelector("section h1");
const botonComprar = document.querySelector("#botonComprar");
const botonesCategoria = document.querySelectorAll (".btnCategoria");
//const classList = document.querySelector (".btnCategoria");


// Instanciamos la base de datos
const bd = new BaseDeDatos();

// Instaciamos la clase Carrito
const carrito = new Carrito();


botonesCategoria.forEach((boton) => {
  boton.addEventListener("click",() => {
    const categoria = boton.dataset.categoria;
    //Quita el seleccionado anterior
    const botonSeleccionado = document.querySelector(".seleccionado");
    botonSeleccionado.classList.remove("seleccionado");
  
    //Se le agrega a este boton
    boton.classList.add("seleccionado");

    if (categoria == "Todos") {
      cargarProductos(bd.traerRegistros());
    } else {
      cargarProductos(bd.registrosPorCategoria(categoria));
    }

  });
});


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
         <img src="img/${producto.imagen}" width="120px"/>
        </div>
        <a href="#" class="btnAgregar" data-id="${producto.id}"> Agregar al carrito</a>
      </div>
    `;
  }
  // Lista con todos los botones que haya en nuestro catálogo
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

      //Toastify
      Toastify({
        text: `Pelicula agregada al carrito`,
        gravity: "bottom",
        position: "center",
        style: {
          background: "linear-gradient(to right, #0f665b,  #ff862b)",
        },
      }).showToast();
    });
  }
}


// Buscador

    inputBuscar.addEventListener("input",(event)=> {

        event.preventDefault();
        const palabra = inputBuscar.value;
        const productos = bd.registroPorNombre(palabra);
        cargarProductos(productos);
    });
//ocultar/mostrar el carrito
  botonCarrito.addEventListener("click", (event) => {
    document.querySelector("section").classList.toggle("ocultar");
  });

  //Boton comprar 
  botonComprar.addEventListener("click", (event) => {
    event.preventDefault();

    Swal.fire(
      {
        title: "Seguro que queres comprar estos productos?",
        showCancelButton: true,
        confirmButtonText: "Si, quiero",
        confirmButtonColor: "#0d5249",
        cancelButtonText: "No, no quiero",
      }).then((result) => {
        if (result.isConfirmed){
        carrito.vaciar();
        Swal.fire({
          title: "Compra realizada",
          text: "Su compra fue realizada con exito",
          buttonsStyling: "#0d5249",
          timer: 2000,
        });
      }
      })
    });
