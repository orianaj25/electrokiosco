// =====================
// INICIO
// =====================
document.addEventListener("DOMContentLoaded", () => {

    cargarCategoriasAdmin();
    cargarCategoriasSelect();
    cargarProductos();
    cargarPedidos();
    previewImagen();
    document
        .getElementById("buscarProducto")
        .addEventListener("input", filtrarProductos);

    document
        .getElementById("buscarPedido")
        .addEventListener("input", filtrarPedidos);

    document
        .getElementById("fechaDesde")
        .addEventListener("change", filtrarPedidos);

    document
        .getElementById("fechaHasta")
        .addEventListener("change", filtrarPedidos);

    document
        .getElementById("filtroPago")
        .addEventListener("change", filtrarPedidos);

    document
        .getElementById("filtroEstado")
        .addEventListener("change", filtrarPedidos);

           document
                .getElementById("limpiarFiltros")
                .addEventListener("click", () => {

                    document.getElementById("buscarPedido").value = "";
                    document.getElementById("fechaDesde").value = "";
                    document.getElementById("fechaHasta").value = "";
                    document.getElementById("filtroPago").value = "";
                    document.getElementById("filtroEstado").value = "";

                    renderizarPedidos(pedidosGlobal);

                });

});

// =====================
// AUTO REFRESH PEDIDOS
// =====================
setInterval(() => {

    cargarPedidos();

}, 30000);


// =====================
// =====================
// CATEGORÍAS
// =====================
// =====================

function cargarCategoriasAdmin(){

    fetch("/categorias")
        .then(res => res.json())
        .then(data => {

            const lista =
                document.getElementById("listaAdminCategorias");

            lista.innerHTML = "";

            data.forEach(cat => {

                const li = document.createElement("li");

                li.innerHTML = `

                    <div class="categoria-item">

                        <span id="nombre-${cat.id}">
                            ${cat.nombre}
                        </span>

                        <input
                            type="text"
                            id="input-${cat.id}"
                            value="${cat.nombre}"
                            style="display:none"
                        >

                        <div class="acciones">

                            <button
                                class="btn-editar"
                                onclick="editarCategoria(${cat.id})"
                            >
                                Editar
                            </button>

                            <button
                                class="btn-guardar"
                                onclick="guardarEdicion(${cat.id})"
                                style="display:none"
                            >
                                Guardar
                            </button>

                            <button
                                class="btn-eliminar"
                                onclick="eliminarCategoria(${cat.id})"
                            >
                                Eliminar
                            </button>

                        </div>

                    </div>

                `;

                lista.appendChild(li);

            });

        });

}

function crearCategoria(){

    const input =
        document.getElementById("nombreCategoria");

    const nombre = input.value.trim();

    if(!nombre){

        alert("Ingrese un nombre");
        return;

    }

    fetch("/categorias", {

        method:"POST",

        headers:{
            "Content-Type":"application/json"
        },

        body: JSON.stringify({ nombre })

    })
    .then(res => {

        if(res.ok){

            input.value = "";

            cargarCategoriasAdmin();
            cargarCategoriasSelect();

        }

    });

}

function editarCategoria(id){

    const nombre =
        document.getElementById(`nombre-${id}`);

    const input =
        document.getElementById(`input-${id}`);

    nombre.style.display = "none";
    input.style.display = "inline-block";

    const botones =
        input.parentElement.querySelectorAll("button");

    botones[0].style.display = "none";
    botones[1].style.display = "inline-block";

}

function guardarEdicion(id){

    const input =
        document.getElementById(`input-${id}`);

    const nuevoNombre =
        input.value.trim();

    fetch(`/categorias/${id}`, {

        method:"PUT",

        headers:{
            "Content-Type":"application/json"
        },

        body: JSON.stringify({
            nombre: nuevoNombre
        })

    })
    .then(() => {

        cargarCategoriasAdmin();
        cargarCategoriasSelect();

    });

}

function eliminarCategoria(id){

    if(!confirm("¿Eliminar categoría?")) return;

    fetch(`/categorias/${id}`, {
        method:"DELETE"
    })
    .then(() => {

        cargarCategoriasAdmin();
        cargarCategoriasSelect();

    });

}

// =====================
// =====================
// PRODUCTOS
// =====================
// =====================

function cargarCategoriasSelect(){

    fetch("/categorias")
        .then(res => res.json())
        .then(data => {

            const select =
                document.getElementById("categoriaProducto");

            select.innerHTML = "";

            data.forEach(cat => {

                const option =
                    document.createElement("option");

                option.value = cat.id;
                option.textContent = cat.nombre;

                select.appendChild(option);

            });

        });

}

function previewImagen(){

    const input =
        document.getElementById("imagenProducto");

    const preview =
        document.getElementById("previewImagen");

    input.addEventListener("change", () => {

        const file = input.files[0];

        if(file){

            preview.src =
                URL.createObjectURL(file);

            preview.style.display = "block";

        }

    });

}

async function guardarProducto(){

    const nombre =
        document.getElementById("nombreProducto").value;

    const descripcion =
        document.getElementById("descripcionProducto").value;

    const precio =
        document.getElementById("precioProducto").value;

    const categoriaId =
        document.getElementById("categoriaProducto").value;

    const file =
        document.getElementById("imagenProducto").files[0];

    let rutaImagen = "";

    if(file){

        const formData = new FormData();

        formData.append("file", file);

        const res = await fetch("/productos/upload", {

            method:"POST",
            body: formData

        });

        rutaImagen = await res.text();

    }

    const producto = {

        nombre,
        descripcion,
        precio,

        imagen: rutaImagen,

        categoria:{
            id: categoriaId
        }

    };

    await fetch("/productos", {

        method:"POST",

        headers:{
            "Content-Type":"application/json"
        },

        body: JSON.stringify(producto)

    });

    alert("Producto guardado correctamente");

    limpiarFormulario();
    cargarProductos();

}

function limpiarFormulario(){

    document.getElementById("nombreProducto").value = "";
    document.getElementById("descripcionProducto").value = "";
    document.getElementById("precioProducto").value = "";
    document.getElementById("imagenProducto").value = "";

    document.getElementById("previewImagen")
        .style.display = "none";

}

function cargarProductos() {

    fetch("/productos")
        .then(res => res.json())
        .then(data => {

        productosGlobal = data;

            const lista =
                document.getElementById("listaProductosAdmin");

            lista.innerHTML = "";

            data.forEach(prod => {

                const li = document.createElement("li");

                li.innerHTML = `

                    <div class="producto-admin">

                        <div class="producto-fila">

                            <div class="producto-info">

                                <img
                                    src="${prod.imagen || '/img/sin-imagen.png'}"
                                    class="producto-img"
                                    alt="${prod.nombre}"
                                >

                                <div class="prod-texto">

                                    <h4>${prod.nombre}</h4>

                                    <p>$${prod.precio}</p>

                                </div>

                            </div>

                            <div class="acciones">

                                <button
                                    class="btn-editar"
                                    onclick="editarProducto(${prod.id})"
                                >
                                    Editar
                                </button>

                                <button
                                    class="btn-eliminar"
                                    onclick="eliminarProducto(${prod.id})"
                                >
                                    Eliminar
                                </button>

                            </div>

                        </div>

                        <div
                            class="edit-form"
                            id="edit-${prod.id}"
                            style="display:none"
                        >

                            <input
                                type="text"
                                id="edit-nombre-${prod.id}"
                                value="${prod.nombre}"
                                placeholder="Nombre"
                            >

                            <input
                                type="text"
                                id="edit-descripcion-${prod.id}"
                                value="${prod.descripcion || ''}"
                                placeholder="Descripción"
                            >

                            <input
                                type="number"
                                id="edit-precio-${prod.id}"
                                value="${prod.precio}"
                                placeholder="Precio"
                            >

                            <input
                                type="file"
                                id="edit-imagen-${prod.id}"
                            >

                            <button
                                class="btn-guardar"
                                onclick="guardarEdicionProducto(${prod.id})"
                            >
                                Guardar Cambios
                            </button>

                        </div>

                    </div>

                `;

                lista.appendChild(li);

            });

        })
        .catch(error => {

            console.error(
                "Error cargando productos:",
                error
            );

        });

}

function editarProducto(id){

    const form =
        document.getElementById(`edit-${id}`);

    if(form.style.display === "flex"){

        form.style.display = "none";

    }else{

        form.style.display = "flex";

    }

}

async function guardarEdicionProducto(id){

    const nombre =
        document.getElementById(`edit-nombre-${id}`).value;

    const descripcion =
        document.getElementById(`edit-descripcion-${id}`).value;

    const precio =
        document.getElementById(`edit-precio-${id}`).value;

    const file =
        document.getElementById(`edit-imagen-${id}`).files[0];

    let rutaImagen = null;

    if(file){

        const formData = new FormData();

        formData.append("file", file);

        const res = await fetch("/productos/upload", {

            method:"POST",
            body: formData

        });

        rutaImagen = await res.text();

    }

    const producto = {
        nombre,
        descripcion,
        precio
    };

    if(rutaImagen){

        producto.imagen = rutaImagen;

    }

    await fetch(`/productos/${id}`, {

        method:"PUT",

        headers:{
            "Content-Type":"application/json"
        },

        body: JSON.stringify(producto)

    });

    alert("Producto actualizado");

    cargarProductos();

}

function eliminarProducto(id){

    if(!confirm("¿Eliminar producto?")) return;

    fetch(`/productos/${id}`, {
        method:"DELETE"
    })
    .then(() => cargarProductos());

}


// =====================
// =====================
// PEDIDOS
// =====================
// =====================

let pedidosGlobal = [];
let productosGlobal = [];

async function cargarPedidos(){

    try{

        const res = await fetch("/pedidos/admin");

        const data = await res.json();
        pedidosGlobal = data;

        renderizarPedidos(data);

    }catch(error){

        console.error(error);

        alert("Error cargando pedidos");

    }

}

async function verDetalle(id){

    try{

      const pedido =
          pedidosGlobal.find(p => p.id === id);

        if(!pedido){

            alert("Pedido no encontrado");
            return;

        }

        const estado =
            pedido.estado || "PENDIENTE";

        const detalle =
            document.getElementById("detallePedido");

        detalle.innerHTML = `

            <div class="detalle-header">

                <div class="detalle-info">

                    <p>
                        <strong>Pedido:</strong>
                        #${pedido.id}
                    </p>

                    <p>
                        <strong>Fecha:</strong>
                        ${formatearFecha(pedido.fecha)}
                    </p>

                </div>

                <div>

                    <span class="estado estado-${estado.toLowerCase()}">
                        ${estado}
                    </span>

                </div>

            </div>

            <table class="tabla-detalle">

                <thead>

                    <tr>

                        <th>Producto</th>

                        <th>Cantidad</th>

                        <th>Precio Unitario</th>

                        <th>Subtotal</th>

                    </tr>

                </thead>

                <tbody id="detalleBody"></tbody>

            </table>

        `;

        const detalleBody =
            document.getElementById("detalleBody");

        if(!pedido.detalles || pedido.detalles.length === 0){

            detalleBody.innerHTML = `

                <tr>

                    <td colspan="4">
                        No hay productos en el pedido
                    </td>

                </tr>

            `;

        }else{

            pedido.detalles.forEach(d => {

                detalleBody.innerHTML += `

                    <tr>

                        <td>
                            ${d.producto}
                        </td>

                        <td>
                            ${d.cantidad}
                        </td>

                        <td>
                            $${d.precioUnitario}
                        </td>

                        <td>
                            $${d.subtotal}
                        </td>

                    </tr>

                `;

            });

        }

        detalle.innerHTML += `

            <div class="total-final">

                Total:
                $${pedido.total}

            </div>

        `;

        document.getElementById("modalPedido")
            .style.display = "flex";

    }catch(error){

        console.error(error);

        alert("Error al cargar detalle");

    }

}

function cerrarModal(){

    document.getElementById("modalPedido")
        .style.display = "none";

}

async function cambiarEstado(id, estado){

    try{

        const response = await fetch(

            `/pedidos/${id}/estado?estado=${estado}`,

            {
                method:"PUT"
            }

        );

        if(response.ok){

            await cargarPedidos();

        }else{

            alert("Error al actualizar estado");

        }

    }catch(error){

        console.error(error);

        alert("Error de conexión");

    }

}

function formatearFecha(fecha){

    if(!fecha) return "-";

    const f = new Date(fecha);

    return f.toLocaleString("es-AR", {

        day:"2-digit",
        month:"2-digit",
        year:"numeric",
        hour:"2-digit",
        minute:"2-digit"

    });

}

function filtrarProductos(){

    const texto =
        document.getElementById("buscarProducto")
        .value
        .toLowerCase();

    const lista =
        document.getElementById("listaProductosAdmin");

    lista.innerHTML = "";

    productosGlobal
        .filter(prod =>
            prod.nombre
                .toLowerCase()
                .includes(texto)
        )
        .forEach(prod => {

            const li =
                document.createElement("li");

            li.innerHTML = `

                <div class="producto-admin">

                    <div class="producto-fila">

                        <div class="producto-info">

                            <img
                                src="${prod.imagen || '/img/sin-imagen.png'}"
                                class="producto-img"
                            >

                            <div class="prod-texto">

                                <h4>${prod.nombre}</h4>

                                <p>$${prod.precio}</p>

                            </div>

                        </div>

                        <div class="acciones">

                            <button
                                class="btn-editar"
                                onclick="editarProducto(${prod.id})"
                            >
                                Editar
                            </button>

                            <button
                                class="btn-eliminar"
                                onclick="eliminarProducto(${prod.id})"
                            >
                                Eliminar
                            </button>

                        </div>

                    </div>

                </div>

            `;

            lista.appendChild(li);

        });

}

function renderizarPedidos(data){

    const tabla =
        document.getElementById("tablaPedidos");

    tabla.innerHTML = "";

    data.slice().reverse().forEach(pedido => {

        const estado =
            pedido.estado || "PENDIENTE";

        const tr =
            document.createElement("tr");

        tr.innerHTML = `

            <td>${pedido.id}</td>

            <td>
                ${formatearFecha(pedido.fecha)}
            </td>

            <td>
                $${pedido.total}
            </td>

            <td>

                <span class="metodo-pago-badge ${
                    pedido.metodoPago === 'MERCADOPAGO'
                        ? 'mp'
                        : 'efectivo'
                }">

                    ${
                        pedido.metodoPago === 'MERCADOPAGO'
                            ? '🟢 Mercado Pago'
                            : '🟡 Efectivo'
                    }

                </span>

            </td>

            <td>

                <span class="estado estado-${estado.toLowerCase()}">
                    ${estado}
                </span>

            </td>

            <td class="acciones-tabla">

                <button
                    class="btn-ver"
                    onclick="verDetalle(${pedido.id})"
                >
                    Ver
                </button>

                ${estado !== "ENTREGADO" ? `

                    <button
                        class="btn-entregado"
                        onclick="cambiarEstado(${pedido.id}, 'ENTREGADO')"
                    >
                        Entregado
                    </button>

                ` : ""}

            </td>

        `;

        tabla.appendChild(tr);

    });

}

function filtrarPedidos(){

    const idBusqueda =
        document.getElementById("buscarPedido")
        .value
        .trim();

    const pago =
        document.getElementById("filtroPago")
        .value;

    const estado =
        document.getElementById("filtroEstado")
        .value;

    const fechaDesde =
        document.getElementById("fechaDesde")
        .value;

    const fechaHasta =
        document.getElementById("fechaHasta")
        .value;

    const pedidosFiltrados =
        pedidosGlobal.filter(pedido => {

            const coincideId =
                !idBusqueda ||
                pedido.id
                    .toString()
                    .includes(idBusqueda);

            const coincidePago =
                !pago ||
                pedido.metodoPago === pago;

            const coincideEstado =
                !estado ||
                pedido.estado === estado;

            let coincideFecha = true;

            const fechaPedido =
                pedido.fecha
                    ? pedido.fecha.substring(0,10)
                    : "";

            if(fechaDesde){

                coincideFecha =
                    coincideFecha &&
                    fechaPedido >= fechaDesde;

            }

            if(fechaHasta){

                coincideFecha =
                    coincideFecha &&
                    fechaPedido <= fechaHasta;

            }

            return (
                coincideId &&
                coincidePago &&
                coincideEstado &&
                coincideFecha
            );

        });

    renderizarPedidos(pedidosFiltrados);

}