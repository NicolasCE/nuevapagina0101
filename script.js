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

// Escuchar clicks en botones
document.addEventListener("click", function (e) {
  if (e.target.matches("button.is-success")) {
    const index = e.target.getAttribute("data-index");
    const producto = comidas[index];
    agregarAlCarrito(producto);

    // --- SweetAlert2 ---
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

// Agregar al carrito y actualizar vista
function agregarAlCarrito(producto) {
  carrito.push(producto);
  actualizarCarrito();
}

// Mostrar el carrito visualmente
function actualizarCarrito() {
  carritoItems.innerHTML = "";
  let total = 0;

  if (carrito.length === 0) {
    carritoVacio.style.display = "block";
    carritoTotal.textContent = "";
    return;
  }

  carritoVacio.style.display = "none";

  carrito.forEach((item) => {
    const li = document.createElement("li");
    li.textContent = `🍽️ ${item.nombre} - $${item.precio.toLocaleString(
      "es-CL"
    )}`;
    li.classList.add("animate__animated", "animate__fadeInLeft");
    li.style.setProperty("--animate-duration", "0.5s");
    li.style.setProperty("--animate-delay", "0.1s");
    carritoItems.appendChild(li);
    total += item.precio;
  });

  carritoTotal.textContent = `Total: $${total.toLocaleString("es-CL")}`;
}

// Escuchar el botón "Vaciar carrito" con confirmación
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





// Función para generar el mensaje de WhatsApp
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
    mensaje += `🍔 ${index + 1}. ${item.nombre} - $${item.precio.toLocaleString("es-CL")}\n`;
    total += item.precio;
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



