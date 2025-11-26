document.addEventListener("DOMContentLoaded", () => {
  if (window.location.pathname.includes("home.html")) {
    // --- Verificar rol guardado (usuario o admin) ---
    const rol = localStorage.getItem("rol");

    // Recuperar productos de maquillaje desde localStorage o usar algunos por defecto
    let productos = JSON.parse(localStorage.getItem("productos")) || [
      {
        nombre: "Base líquida Fit Me",
        descripcion: "Base de maquillaje Maybelline – Acabado natural y cobertura media.",
        precio: 7500,
        img: "img/base1.jpg",
        categorias: ["base", "piel"]
      },
      {
        nombre: "Labial Matte Ink",
        descripcion: "Labial líquido de larga duración con acabado mate intenso.",
        precio: 5800,
        img: "img/labial1.jpg",
        categorias: ["labial", "labios"]
      }
    ];

    // --- Referencias del DOM ---
    const productosContainer = document.getElementById("productos");
    const adminPanel = document.getElementById("adminPanel");

    // Si el usuario es admin, mostrar panel para agregar productos
    if (rol === "admin") {
      adminPanel.style.display = "block";

      const addProdForm = document.getElementById("addProdForm");
      addProdForm.addEventListener("submit", (e) => {
        e.preventDefault();
        const nombre = document.getElementById("prodName").value;
        const descripcion = document.getElementById("prodDesc").value;
        const precio = parseFloat(document.getElementById("prodPrice").value);
        const img = document.getElementById("prodImg").value;

        // Obtener categorías seleccionadas
        const catSelect = document.getElementById("prodCategory");
        const categorias = Array.from(catSelect.selectedOptions).map(opt => opt.value);

        // Agregar producto
        productos.push({ nombre, descripcion, precio, img, categorias });
        saveProductos();
        renderProductos();
        addProdForm.reset();
      });
    }

    // --- Guardar productos ---
    function saveProductos() {
      localStorage.setItem("productos", JSON.stringify(productos));
    }

    // --- FILTROS ---
    const searchInput = document.getElementById("searchInput");
    const filterCategory = document.getElementById("filterCategory");
    const minPrice = document.getElementById("minPrice");
    const maxPrice = document.getElementById("maxPrice");
    const applyFilters = document.getElementById("applyFilters");

    // Filtra los productos según los criterios seleccionados
    function getFilteredProductos() {
      const search = searchInput.value.toLowerCase();
      const category = filterCategory.value;
      const min = parseFloat(minPrice.value) || 0;
      const max = parseFloat(maxPrice.value) || Infinity;

      return productos.filter(prod => {
        const matchName = prod.nombre.toLowerCase().includes(search);
        const matchDesc = prod.descripcion.toLowerCase().includes(search);

        let matchCategory = true;
        if (category) {
          if (Array.isArray(prod.categorias)) {
            matchCategory = prod.categorias.includes(category);
          } else {
            matchCategory = prod.categoria === category;
          }
        }

        const matchPrice = prod.precio >= min && prod.precio <= max;

        return (matchName || matchDesc) && matchCategory && matchPrice;
      });
    }

    // --- Renderizar productos ---
    function renderProductos() {
      productosContainer.innerHTML = "";
      const productosFiltrados = getFilteredProductos();

      productosFiltrados.forEach((prod, index) => {
        const div = document.createElement("div");
        div.classList.add("producto");
        div.innerHTML = `
          <img src="${prod.img}" alt="${prod.nombre}">
          <h3>${prod.nombre}</h3>
          <p>${prod.descripcion}</p>
          <p><strong>Categorías:</strong> ${prod.categorias ? prod.categorias.join(", ") : "Sin definir"}</p>
          <span class="precio">$${prod.precio}</span>
          <button class="comprar">Agregar al carrito</button>
          ${rol === "admin" ? `<button class="eliminar" data-index="${index}">Eliminar</button>` : ""}
        `;
        productosContainer.appendChild(div);
      });

      // Botones de compra
      const botonesComprar = document.querySelectorAll(".comprar");
      botonesComprar.forEach((btn, idx) => {
        btn.addEventListener("click", () => addToCart(productosFiltrados[idx]));
      });

      // Botones de eliminar (solo admin)
      if (rol === "admin") {
        const botonesEliminar = document.querySelectorAll(".eliminar");
        botonesEliminar.forEach((btn) => {
          btn.addEventListener("click", () => {
            const idx = btn.getAttribute("data-index");
            productos.splice(idx, 1);
            saveProductos();
            renderProductos();
          });
        });
      }
    }

    // --- Carrito ---
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    const cartLink = document.getElementById("cartLink");
    const cartModal = document.getElementById("cartModal");
    const cartItems = document.getElementById("cartItems");
    const cartTotal = document.getElementById("cartTotal");
    const clearCartBtn = document.getElementById("clearCart");
    const closeCartBtn = document.getElementById("closeCart");

    function addToCart(prod) {
      const item = cart.find(p => p.nombre === prod.nombre);
      if (item) {
        item.cantidad++;
      } else {
        cart.push({ ...prod, cantidad: 1 });
      }
      saveCart();
      updateCartLink();
      renderCart();
    }

    function saveCart() {
      localStorage.setItem("cart", JSON.stringify(cart));
    }

    function updateCartLink() {
      const totalCantidad = cart.reduce((acc, item) => acc + item.cantidad, 0);
      cartLink.textContent = `Carrito (${totalCantidad})`;
    }

    function renderCart() {
      cartItems.innerHTML = "";
      let total = 0;

      cart.forEach(item => {
        const li = document.createElement("li");
        li.textContent = `${item.nombre} x${item.cantidad} - $${item.precio * item.cantidad}`;
        cartItems.appendChild(li);
        total += item.precio * item.cantidad;
      });

      cartTotal.textContent = `Total: $${total}`;
    }

    // --- Eventos del carrito ---
    updateCartLink();
    renderCart();

    cartLink.addEventListener("click", (e) => {
      e.preventDefault();
      cartModal.classList.add("open");
      renderCart();
    });

    closeCartBtn.addEventListener("click", () => cartModal.classList.remove("open"));
    clearCartBtn.addEventListener("click", () => {
      cart = [];
      saveCart();
      updateCartLink();
      renderCart();
    });

    // --- Logout ---
    const logoutBtn = document.getElementById("logoutBtn");
    logoutBtn.addEventListener("click", (e) => {
      e.preventDefault();
      localStorage.removeItem("logueado");
      localStorage.removeItem("rol");
      alert("Has cerrado sesión.");
      window.location.href = "index.html";
    });

    // --- Filtros dinámicos ---
    searchInput.addEventListener("input", renderProductos);
    applyFilters.addEventListener("click", renderProductos);

    const resetFilters = document.getElementById("resetFilters");
    resetFilters.addEventListener("click", () => {
      searchInput.value = "";
      filterCategory.value = "";
      minPrice.value = "";
      maxPrice.value = "";
      renderProductos();
    });

    // Render inicial
    renderProductos();
  }
});
