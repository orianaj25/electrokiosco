// =====================
// VARIABLES GLOBALES
// =====================
let productosGlobal = [];
let categoriaActual = null;
let carrito = JSON.parse(localStorage.getItem("carrito")) || [];


// =====================
// SIDEBAR TOGGLE
// =====================
const sidebar = document.getElementById("sidebar");
const toggleBtn = document.getElementById("toggleBtn");

toggleBtn.addEventListener("click", () => {
    sidebar.classList.toggle("oculto");
    toggleBtn.innerHTML = sidebar.classList.contains("oculto") ? "❯" : "❮";
});


// =====================
// 🧭 NAVEGACION
// =====================
function configurarNavegacion(){

    document.getElementById("navInicio")
        .addEventListener("click", () => {
            window.scrollTo({ top: 0, behavior: "smooth" });
        });

    document.getElementById("navProductos")
        .addEventListener("click", () => {
            document.getElementById("productos")
                .scrollIntoView({ behavior: "smooth" });
        });
}


// =====================
// 🛒 CARRITO UI
// =====================
function configurarCarritoUI(){

    const btnAbrir = document.getElementById("btnAbrirCarrito");
    const btnCerrar = document.getElementById("btnCerrarCarrito");
    const panel = document.getElementById("carritoPanel");
    const overlay = document.getElementById("overlayCarrito");

    btnAbrir.addEventListener("click", () => {
        panel.classList.add("abierto");
        overlay.classList.add("activo");
    });

    btnCerrar.addEventListener("click", cerrar);
    overlay.addEventListener("click", cerrar);

    function cerrar(){
        panel.classList.remove("abierto");
        overlay.classList.remove("activo");
    }
}


// =====================
// 🔔 TOAST
// =====================
function mostrarToast(texto){

    const toast = document.getElementById("toast");
    toast.textContent = texto;

    toast.classList.add("visible");

    setTimeout(() => {
        toast.classList.remove("visible");
    }, 1500);
}


// =====================
// INIT
// =====================
document.addEventListener("DOMContentLoaded", () => {

    configurarNavegacion();
    configurarCarritoUI();

    cargarCategorias();
    cargarTodosLosProductos();

    activarBuscador();
    configurarFinalizarPedido();

    actualizarCarrito(); // 🔥 restore
});


// =====================
// CARGAR PRODUCTOS
// =====================
function cargarTodosLosProductos(){
    fetch("/productos")
        .then(res => res.json())
        .then(data => {
            productosGlobal = data;
            mostrarProductosFiltrados();
        });
}


// =====================
// CATEGORIAS
// =====================
function cargarCategorias(){

    fetch("/categorias")
        .then(res => res.json())
        .then(data => {

            const lista = document.getElementById("listaCategorias");
            lista.innerHTML = "";

            data.forEach(cat => {

                let li = document.createElement("li");
                li.textContent = cat.nombre;

                li.addEventListener("click", () => seleccionarCategoria(cat, li));

                lista.appendChild(li);
            });
        });
}


// =====================
// SELECCIONAR CATEGORIA
// =====================
function seleccionarCategoria(cat, elemento){

    categoriaActual = cat;

    document.querySelectorAll("#listaCategorias li")
        .forEach(li => li.classList.remove("activa"));

    elemento.classList.add("activa");

    mostrarProductosFiltrados();
}


// =====================
// MOSTRAR PRODUCTOS
// =====================
function mostrarProductosFiltrados(){

    const contenedor = document.getElementById("productos");
    contenedor.innerHTML = "";

    let textoBusqueda = document.getElementById("buscarProducto").value || "";
    textoBusqueda = textoBusqueda.trim().toLowerCase();

    let filtrados = [...productosGlobal];

    if(textoBusqueda){

        categoriaActual = null;

        document.querySelectorAll("#listaCategorias li")
            .forEach(li => li.classList.remove("activa"));

        filtrados = filtrados.filter(p =>
            (p.nombre || "").toLowerCase().includes(textoBusqueda)
        );

        document.getElementById("tituloCategoria").textContent =
            "🔍 Resultados para: " + textoBusqueda;

    } else if(categoriaActual){

        filtrados = filtrados.filter(p =>
            p.categoria && p.categoria.id == categoriaActual.id
        );

        document.getElementById("tituloCategoria").textContent =
            "Productos en " + categoriaActual.nombre;
    }

    // =============================
    // RENDER
    // =============================
    filtrados.forEach(prod => {

        const existente = carrito.find(p => p.id === prod.id);
        const cantidad = existente ? existente.cantidad : 0;

        const textoBoton = cantidad > 0
            ? `+ Agregar (${cantidad})`
            : "Agregar";

        const claseBoton = cantidad > 0
            ? "btn-comprar agregado"
            : "btn-comprar";

        const card = document.createElement("div");
        card.className = "producto-card";

        card.innerHTML = `
            <img src="${prod.imagen}" class="producto-img">

            <div class="producto-info">
                <h3>${prod.nombre}</h3>

                <p class="descripcion">
                    ${prod.descripcion || ""}
                </p>

                <p class="precio">$${prod.precio}</p>

                <button class="${claseBoton}">
                    ${textoBoton}
                </button>
            </div>
        `;

        const btn = card.querySelector("button");

        btn.addEventListener("click", () => {

            agregarAlCarrito(prod);

            // 🔥 animación click
            btn.classList.add("click");
            setTimeout(() => btn.classList.remove("click"), 200);
        });

        contenedor.appendChild(card);
    });
}


// =====================
// 🛒 AGREGAR
// =====================
function agregarAlCarrito(producto){

    const existente = carrito.find(p => p.id === producto.id);

    if(existente){
        existente.cantidad++;
        mostrarToast(`+1 ${producto.nombre}`);
    } else {
        carrito.push({ ...producto, cantidad: 1 });
        mostrarToast(`Agregado: ${producto.nombre}`);
    }

    actualizarCarrito();
    mostrarProductosFiltrados();
}


// =====================
// 🧮 ACTUALIZAR CARRITO
// =====================
function actualizarCarrito(){

    let total = 0;
    let cantidad = 0;

    carrito.forEach(item => {
        total += item.precio * item.cantidad;
        cantidad += item.cantidad;
    });

    document.getElementById("totalCarrito").textContent = total.toFixed(2);
    document.getElementById("cantidadCarrito").textContent = cantidad;

    localStorage.setItem("carrito", JSON.stringify(carrito));

    renderCarrito();
}


// =====================
// 🧾 RENDER CARRITO PRO
// =====================
function renderCarrito(){

    const contenedor = document.getElementById("carritoItems");
    contenedor.innerHTML = "";

    carrito.forEach(item => {

        const div = document.createElement("div");
        div.className = "item-carrito";

        div.innerHTML = `
            <div class="item-info">
                <span>${item.nombre}</span>
                <small>$${item.precio * item.cantidad}</small>
            </div>

            <div class="item-controls">
                <button class="btn-cantidad" onclick="restarItem(${item.id})">−</button>
                <span class="cantidad">${item.cantidad}</span>
                <button class="btn-cantidad" onclick="sumarItem(${item.id})">+</button>
                <button class="btn-eliminar" onclick="eliminarItem(${item.id})">🗑</button>
            </div>
        `;

        contenedor.appendChild(div);
    });
}


// =====================
// ➕➖❌ ACCIONES
// =====================
function sumarItem(id){
    const item = carrito.find(p => p.id === id);
    item.cantidad++;
    actualizarCarrito();
    mostrarProductosFiltrados();
}

function restarItem(id){
    const item = carrito.find(p => p.id === id);
    item.cantidad--;

    if(item.cantidad <= 0){
        carrito = carrito.filter(p => p.id !== id);
    }

    actualizarCarrito();
    mostrarProductosFiltrados();
}

function eliminarItem(id){
    carrito = carrito.filter(p => p.id !== id);
    actualizarCarrito();
    mostrarProductosFiltrados();
}


// =====================
// 📦 FINALIZAR PEDIDO
// =====================
// =====================
// 📦 FINALIZAR PEDIDO
// =====================
function configurarFinalizarPedido(){

    const btn = document.getElementById("btnFinalizar");

    btn.addEventListener("click", async () => {

        if(carrito.length === 0){
            mostrarToast("Carrito vacío");
            return;
        }

        const items = carrito.map(p => ({
            productoId: p.id,
            cantidad: p.cantidad
        }));

        const pedido = { items };

        // =========================
        // 1️⃣ CREAR PEDIDO
        // =========================
        const resPedido = await fetch("/pedidos", {
            method:"POST",
            headers:{ "Content-Type":"application/json" },
            body: JSON.stringify(pedido)
        });

        if(!resPedido.ok){
            mostrarToast("Error al crear pedido");
            return;
        }

        // 🔥 pedido guardado
        const pedidoGuardado = await resPedido.json();

        // =========================
        // 2️⃣ CREAR PREFERENCIA MP
        // =========================
        const resMp = await fetch("/mercadopago/crear-preferencia", {
            method:"POST",
            headers:{ "Content-Type":"application/json" },
            body: JSON.stringify(pedidoGuardado)
        });

        const dataMp = await resMp.json();

        if(dataMp.url){

            carrito = [];
            actualizarCarrito();

            // 🚀 REDIRECCION MP
            window.location.href = dataMp.url;

        } else {

            mostrarToast("Error Mercado Pago");
        }

    });
}


// =====================
// 🔍 BUSCADOR
// =====================
function activarBuscador(){
    document.getElementById("buscarProducto")
        .addEventListener("input", mostrarProductosFiltrados);
}