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
        img: "https://tse3.mm.bing.net/th/id/OIP.sBiTEljeYWrK23289V3g2QHaHa?rs=1&pid=ImgDetMain&o=7&rm=3",
        categorias: ["base", "piel"]
      },
      {
        nombre: "Labial Matte Ink",
        descripcion: "Labial líquido de larga duración con acabado mate intenso.",
        precio: 5800,
        img: "https://http2.mlstatic.com/D_NQ_NP_703416-MLC75842844141_042024-O.webp",
        categorias: ["labial", "labios"]
      },
      {
        nombre: "Corrector HD Pro",
        descripcion: "Corrector de alta cobertura que disimula ojeras e imperfecciones sin marcar líneas.",
        precio: 4200,
        img: "https://tse4.mm.bing.net/th/id/OIP.n8O473eSRNYNi5A7edPWZAAAAA?rs=1&pid=ImgDetMain&o=7&rm=3",
        categorias: ["corrector", "piel"]
      },
      {
        nombre: "Rubor Peach Glow",
        descripcion: "Rubor compacto tono durazno con acabado satinado y efecto saludable.",
        precio: 3900,
        img: "https://tse2.mm.bing.net/th/id/OIP.LYAMXa9hLAWHjxZzCdJC2AHaHN?rs=1&pid=ImgDetMain&o=7&rm=3",
        categorias: ["rubor"]
      },
      {
        nombre: "Iluminador Golden Shine",
        descripcion: "Iluminador en polvo con destellos dorados para un glow radiante.",
        precio: 5100,
        img: "https://cdn.sistemawbuy.com.br/arquivos/cad5cc7133685cdd8d0d7880d11cba96/produtos/6681b947ee8eb/iluminador-trava-na-beleza-m3e7yo3xu9-6681b94fd78f0.jpg",
        categorias: ["iluminador"]
      },
      {
        nombre: "Paleta de Sombras Nude Dreams",
        descripcion: "Paleta de 12 tonos neutros ideales para looks de día y noche.",
        precio: 9800,
        img: "https://tse3.mm.bing.net/th/id/OIP.disUgaL_bzWePBto7I2A9QHaHa?rs=1&pid=ImgDetMain&o=7&rm=3",
        categorias: ["sombras"]
      },
      {
        nombre: "Máscara de Pestañas Volume Max",
        descripcion: "Rímel con efecto volumen extremo y larga duración.",
        precio: 4600,
        img: "https://tse1.mm.bing.net/th/id/OIP.ZBp4rSYMoum6hJoClxb7HwHaHa?rs=1&pid=ImgDetMain&o=7&rm=3",
        categorias: ["rimel"]
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
        const imgInput = document.getElementById("prodImg");
        const file = imgInput.files[0];

        // Obtener categorías seleccionadas
        const catSelect = document.getElementById("prodCategory");
        const categorias = Array.from(catSelect.selectedOptions).map(opt => opt.value);

        // Agregar producto
        if (!file) {
          alert("Seleccioná una imagen");
          return;
        }

        const reader = new FileReader();

        reader.onload = function(event) {
          const imgBase64 = event.target.result;
        
          productos.push({
            nombre,
            descripcion,
            precio,
            img: imgBase64,
            categorias
          });
        
          saveProductos();
          renderProductos();
          addProdForm.reset();
        };

        reader.readAsDataURL(file);

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
          <div class="img-container">
            <img src="${prod.img}" alt="${prod.nombre}">
          </div>
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
