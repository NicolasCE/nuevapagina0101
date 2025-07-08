const comidas = [
  {
    nombre: "Churrasco Italiano",
    precio: 3500,
    imagen: "images/churrasco_italiano.png",
    descripcion: "Pan frica con churrasco, palta, tomate y mayonesa.",
  },
  {
    nombre: "Completo Dinámico",
    precio: 2500,
    imagen: "images/completo_italiano.jpg",
    descripcion: "Vienesa, tomate, palta, mayonesa, chucrut y salsa americana.",
  },
  {
    nombre: "Barros Luco",
    precio: 3000,
    imagen: "images/barros_luco.jpg",
    descripcion: "Churrasco caliente con queso fundido en pan amasado.",
  },
];

const contenedor = document.getElementById("menu-comidas");
const carrito = [];
const carritoItems = document.getElementById("carrito-items");
const carritoTotal = document.getElementById("carrito-total");
const carritoVacio = document.getElementById("carrito-vacio");

// Mostrar comidas
comidas.forEach((comida, index) => {
  const col = document.createElement("div");
  col.className = "column is-one-third animate__animated animate__fadeInUp";
  col.style.setProperty("--animate-duration", "0.6s");

  col.innerHTML = `
    <div class="card">
      <div class="card-image">
        <figure class="image is-4by3">
          <img src="${comida.imagen}" alt="${comida.nombre}">
        </figure>
      </div>
      <div class="card-content">
        <p class="title is-4">${comida.nombre}</p>
        <p class="subtitle is-6">$${comida.precio.toLocaleString("es-CL")}</p>
        <p>${comida.descripcion}</p>
        <button class="button is-success mt-3" data-index="${index}">Agregar al carrito</button>
      </div>
    </div>
  `;

  contenedor.appendChild(col);
});

// Escuchar clicks en botones "Agregar al carrito"
document.addEventListener("click", function (e) {
  if (e.target.matches("button.is-success")) {
    const index = e.target.getAttribute("data-index");
    const producto = comidas[index];
    agregarAlCarrito(producto);

    // SweetAlert2
    Swal.fire({
      title: "Producto agregado 🛒",
      text: `${producto.nombre} fue agregado al carrito`,
      icon: "success",
      confirmButtonText: "OK",
      showClass: {
        popup: "animate__animated animate__fadeInDown",
      },
      hideClass: {
        popup: "animate__animated animate__fadeOutUp",
      },
    });
  }
});

// Agregar al carrito con manejo de cantidad
function agregarAlCarrito(producto) {
  const index = carrito.findIndex(item => item.nombre === producto.nombre);

  if (index !== -1) {
    // Si ya está, aumenta cantidad
    carrito[index].cantidad += 1;
  } else {
    // Si no está, agregar nuevo con cantidad 1
    carrito.push({ ...producto, cantidad: 1 });
  }

  actualizarCarrito();
}

// Actualizar carrito mostrando cantidades, subtotal y botones de control
function actualizarCarrito() {
  carritoItems.innerHTML = "";
  let total = 0;

  if (carrito.length === 0) {
    carritoVacio.style.display = "block";
    carritoTotal.textContent = "";
    return;
  }

  carritoVacio.style.display = "none";

  carrito.forEach((item, idx) => {
    const li = document.createElement("li");
    const subtotal = item.precio * item.cantidad;
    li.innerHTML = `
      🍽️ ${item.nombre} - $${item.precio.toLocaleString("es-CL")} x ${item.cantidad} = $${subtotal.toLocaleString("es-CL")}
      <button class="button is-small is-info ml-2" data-accion="sumar" data-index="${idx}">+</button>
      <button class="button is-small is-warning ml-1" data-accion="restar" data-index="${idx}">-</button>
      <button class="button is-small is-danger ml-1" data-accion="eliminar" data-index="${idx}">x</button>
    `;
    li.classList.add("animate__animated", "animate__fadeInLeft");
    carritoItems.appendChild(li);

    total += subtotal;
  });

  carritoTotal.textContent = `Total: $${total.toLocaleString("es-CL")}`;
}

// Manejar clicks en botones +, -, eliminar dentro del carrito
carritoItems.addEventListener("click", function (e) {
  if (e.target.tagName === "BUTTON") {
    const accion = e.target.getAttribute("data-accion");
    const idx = parseInt(e.target.getAttribute("data-index"));

    if (accion === "sumar") {
      carrito[idx].cantidad += 1;
    } else if (accion === "restar") {
      carrito[idx].cantidad -= 1;
      if (carrito[idx].cantidad <= 0) {
        carrito.splice(idx, 1);
      }
    } else if (accion === "eliminar") {
      carrito.splice(idx, 1);
    }

    actualizarCarrito();
  }
});

// Botón Vaciar carrito con confirmación
document.getElementById("vaciar-carrito").addEventListener("click", () => {
  Swal.fire({
    title: "¿Vaciar carrito?",
    text: "Se eliminarán todos los productos del carrito.",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#d33",
    cancelButtonColor: "#3085d6",
    confirmButtonText: "Sí, vaciar",
    cancelButtonText: "Cancelar",
  }).then((result) => {
    if (result.isConfirmed) {
      carrito.length = 0;
      actualizarCarrito();

      Swal.fire({
        title: "Carrito eliminado",
        text: "Tu carrito ha sido vaciado correctamente.",
        icon: "success",
        showClass: {
          popup: "animate__animated animate__fadeInDown",
        },
        hideClass: {
          popup: "animate__animated animate__fadeOutUp",
        },
      });
    }
  });
});

// Cambiar tema claro/oscuro
document.getElementById("toggle-tema").addEventListener("click", () => {
  document.body.classList.toggle("modo-oscuro");

  const toggle = document.getElementById("toggle-tema");
  if (document.body.classList.contains("modo-oscuro")) {
    toggle.innerText = "☀️ Modo claro";
  } else {
    toggle.innerText = "🌙 Modo oscuro";
  }
});

// Función para generar el mensaje de WhatsApp con cantidades
function generarMensajeWhatsApp() {
  const nombre = document.getElementById("nombre-usuario").value.trim();
  const direccion = document.getElementById("direccion-usuario").value.trim();

  if (!nombre || !direccion) {
    Swal.fire({
      icon: "warning",
      title: "Faltan datos",
      text: "Por favor, completa tu nombre y dirección antes de enviar el pedido.",
    });
    return null;
  }

  if (carrito.length === 0) {
    Swal.fire({
      icon: "info",
      title: "Carrito vacío",
      text: "Agrega productos al carrito antes de hacer el pedido.",
    });
    return null;
  }

  let mensaje = `Hola! 👋 Mi nombre es ${nombre} y quiero pedir lo siguiente en La Ruta del Sabor:\n\n`;
  let total = 0;

  carrito.forEach((item, index) => {
    const subtotal = item.precio * item.cantidad;
    mensaje += `🍔 ${index + 1}. ${item.nombre} - $${item.precio.toLocaleString("es-CL")} x ${item.cantidad} = $${subtotal.toLocaleString("es-CL")}\n`;
    total += subtotal;
  });

  mensaje += `\n🧾 Total: $${total.toLocaleString("es-CL")}\n`;
  mensaje += `📍 Dirección: ${direccion}`;

  return encodeURIComponent(mensaje);
}

// Enviar mensaje por WhatsApp con formulario
document.getElementById("btn-wsp").addEventListener("click", function (e) {
  e.preventDefault();
  const numero = "56973851366"; // sin el +
  const mensajeCodificado = generarMensajeWhatsApp();

  if (mensajeCodificado) {
    const enlace = `https://wa.me/${numero}?text=${mensajeCodificado}`;
    window.open(enlace, "_blank");
  }
});


//mapita
// Modal de mapa
const btnMapa = document.getElementById("btn-mapa");
const modalMapa = document.getElementById("modal-mapa");
const modalClose = modalMapa.querySelector(".modal-close");
const modalBg = modalMapa.querySelector(".modal-background");

btnMapa.addEventListener("click", () => {
  modalMapa.classList.add("is-active");
});

modalClose.addEventListener("click", () => {
  modalMapa.classList.remove("is-active");
});

modalBg.addEventListener("click", () => {
  modalMapa.classList.remove("is-active");
});




