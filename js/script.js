let productos = [];

fetch("./data.json")
  .then((res) => res.json())
  .then((data) => {
    cargarProductos(data);
  });

const cargarProductos = (data) => {
  productos = data;
  const contenedor = document.getElementById("contenedor-caja");
  productos.forEach((producto, indice) => {
    let card = document.createElement("div");
    card.classList.add("caja");
    card.innerHTML = `
        <div class="icons">
            <a href="#" class="fas fa-heart"></a>
            <a href="#" class="fas fa-eye"></a>
        </div>
        <div class="image">
            <img src=${producto.imagen} alt="">
        </div>
        <div class="contenedor">
            <h3>${producto.titulo}</h3>
            <div class="stars">
                <i class="fas fa-star"></i>
                <i class="fas fa-star"></i>
                <i class="fas fa-star"></i>
                <i class="fas fa-star"></i>
                <i class="fas fa-star"></i>
            </div>
            <div class="precio">${producto.precio} <span>$1200</span></div>
            <a href="#productos" class="boton" onClick="agregarAlCarrito(${indice})">Añadir al Carrito</a>
    </div>`;
    contenedor.appendChild(card);
  });
};

let cart = [];

const agregarAlCarrito = (indiceDelArrayProducto) => {
  const indiceEncontrado = cart.findIndex((elemento) => {
    return elemento.id === productos[indiceDelArrayProducto].id;
  });
  if (indiceEncontrado === -1) {
    let productoAgregar = productos[indiceDelArrayProducto];
    productoAgregar.cantidad = 1;
    cart.push(productoAgregar);
    dibujarCarrito();
  } else {
    cart[indiceEncontrado].cantidad += 1;
    actualizarStorage(cart);
    dibujarCarrito();
  }
};
let carritoContainer = document.getElementById("cart-contenido");
let total = 0;

const dibujarCarrito = () => {
  carritoContainer.innerHTML = "";
  if (cart.length > 0) {
    cart.forEach((producto, indice) => {
      total = total + producto.precio * producto.cantidad;
      let carrito = document.createElement("div");
      carrito.className = "cart-item";
      carrito.innerHTML = `
        <img src="${producto.imagen}" alt="">
        <div class="contenido">
                    <h3>${producto.titulo}</h3>
                    <div class="precio">$ ${producto.precio}</div>
                </div>
        <div class="product-details" > Cantidad: ${producto.cantidad}</div>
        <div class="product-details"> Precio: $ ${producto.precio}</div>
        <div class="product-details"> Subtotal: $ ${producto.precio * producto.cantidad}</div>
        <a href="#productos" id="remove-product" class="boton" onClick="removeProduct(${indice})">Eliminar Producto</a>
         `;
      carritoContainer.appendChild(carrito);
    });
    const totalContainer = document.createElement("div");
    totalContainer.className = "total-carrito";
    totalContainer.innerHTML = `<div class= "total"> TOTAL $ ${total}</div>
  <button class= "boton finalizar" id="finalizar" onClick="finalizarCompra()"> FINALIZAR COMPRA </button>`;
    carritoContainer.appendChild(totalContainer);
  } else {
    carritoContainer.innerHTML = `<h1 class="carrito__titulo"> No hay productos seleccionados, porfavor seleccione un producto </h1>`;
  }
};

const removeProduct = (indice) => {
  cart.splice(indice, 1);
  actualizarStorage(cart);
  dibujarCarrito();
};

const actualizarStorage = (cart) => {
  localStorage.setItem("cart", JSON.stringify(cart));
};

if (localStorage.getItem("cart")) {
  cart = JSON.parse(localStorage.getItem("cart"));
  dibujarCarrito();
}

const finalizarCompra = () => {
  const total = document.getElementsByClassName("total")[0].innerHTML;
  carritoContainer.innerHTML = "";
  const compraFinalizada = `<div class="compra-finalizada"><p class="compra-parrafo">El  ${total} </p></div>
  <div class="datos-cliente">
  <p class="datos-parrafo"> Para finalizar complete el formulario con sus datos</p>
  <button class= "boton  formulario" id="formulario" onClick="dibujarFormu()"> FORMULARIO </button>
  </div>`;
  carritoContainer.innerHTML = compraFinalizada;
};

const dibujarFormu = () => {
  carritoContainer.innerHTML = "";
  const formulario = `
  <div class="payment">
      <h1 class="payTitle">Informacion Personal</h1>
      <label for="" id="nombre" >Nombre y apellido</label>
      <input type="text" id="nombre" placeholder="Nombre" class="payInput">
      <label for="" id="email">E-mail</label>
      <input type="text" placeholder="tu@gmail.com" class="payInput">
      <label for="" id="domicilio" >Domicilio</label>
      <input type="text" id="domicilio" placeholder="Domicilio" class="payInput">
      <h1 class="payTitle">Informacion de tarjeta</h1>
      <div class="CardIcons d-flex">
        <div><i class="ri-visa-fill"></i></div>
        <div><i class="ri-mastercard-fill"></i></div>
      </div>
      <input type="password" class="payInput" placeholder="Numero de tarjeta">
      <div class="cardInfo">
        <input type="text" placeholder="Mes" class="payInput sm">
        <input type="number" placeholder="Año" class="payInput sm">
        <input type="number" placeholder="cvv" class="payInput sm">
      </div>
      <button type="button" class="payButton envio" onClick="mostrarMensaje()" >Confirmar</button>
    </div>`;
  carritoContainer.innerHTML = formulario;
};

const mostrarMensaje = () => {
  carritoContainer.innerHTML = "";
  let mensaje = `<div class="mensaje-final"> MUCHAS GRACIAS POR SU COMPRA!! </div>`;
  carritoContainer.innerHTML = mensaje;
  Swal.fire({
    position: "center",
    icon: "success",
    title: `Gracias  por su compra! en 72 horas recibira su paquete! `,
    showConfirmButton: true,
    allowOutsideClick: false,
  });
};