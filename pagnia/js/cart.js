document.addEventListener("DOMContentLoaded", () => {
  // --- Modo oscuro persistente ---
  if (localStorage.getItem("darkMode") === "true") {
    document.body.classList.add("dark-mode");
  }

  let cart = JSON.parse(localStorage.getItem("cart")) || [];

  const cartItems = document.getElementById("cartItems");
  const cartTotal = document.getElementById("cartTotal");
  const clearCartBtn = document.getElementById("clearCart");
  const checkoutBtn = document.getElementById("checkoutBtn");
  const logoutBtn = document.getElementById("logoutBtn");

  function renderCart() {
    cartItems.innerHTML = "";
    let total = 0;

    if (cart.length === 0) {
      cartItems.innerHTML = "<li>El carrito está vacío </li>";
    } else {
      cart.forEach((item, index) => {
        const li = document.createElement("li");
        li.classList.add("cart-item");
        li.innerHTML = `
          <img src="${item.img}" alt="${item.nombre}">
          <div>
            <h3>${item.nombre}</h3>
            <p><strong>Precio:</strong> $${item.precio}</p>
            <p><strong>Cantidad:</strong> ${item.cantidad}</p>
          </div>
          <button class="removeItem" data-index="${index}">❌</button>
        `;
        cartItems.appendChild(li);
        total += item.precio * item.cantidad;
      });
    }

    cartTotal.textContent = `Total: $${total}`;
    saveCart();
  }

  function saveCart() {
    localStorage.setItem("cart", JSON.stringify(cart));
  }

  // Vaciar carrito
  clearCartBtn.addEventListener("click", () => {
    cart = [];
    renderCart();
  });

  // Eliminar un item
  cartItems.addEventListener("click", (e) => {
    if (e.target.classList.contains("removeItem")) {
      const index = e.target.getAttribute("data-index");
      cart.splice(index, 1);
      renderCart();
    }
  });

  // Simular checkout
  checkoutBtn.addEventListener("click", () => {
    if (cart.length === 0) {
      alert("Tu carrito está vacío");
    } else {
      alert("Compra realizada con éxito ✅");
      cart = [];
      renderCart();
    }
  });

  // Logout
  logoutBtn.addEventListener("click", () => {
    localStorage.removeItem("logueado");
    localStorage.removeItem("rol");
    alert("Has cerrado sesión.");
    window.location.href = "index.html";
  });

  // Toggle modo oscuro
  const toggleDark = document.getElementById("toggleDark");
  if (toggleDark) {
    toggleDark.addEventListener("click", () => {
      document.body.classList.toggle("dark-mode");
      localStorage.setItem("darkMode", document.body.classList.contains("dark-mode"));
    });
  }

  renderCart();
});
