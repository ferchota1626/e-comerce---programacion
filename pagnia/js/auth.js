document.addEventListener("DOMContentLoaded", () => {
  // --- Admin fijo ---
  const adminUser = { user: "admin", email: "admin@tienda.com", pass: "1234", rol: "admin" };
  localStorage.setItem("usuarioAdmin", JSON.stringify(adminUser));

  // --- Registro ---
  const registerForm = document.getElementById("registerForm");
  if (registerForm) {
    registerForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const user = document.getElementById("regUser").value;
      const email = document.getElementById("regEmail").value;
      const pass = document.getElementById("regPass").value;

      // Todos los registrados son usuarios normales
      const newUser = { user, email, pass, rol: "user" };
      localStorage.setItem("usuario", JSON.stringify(newUser));
      alert("Registro exitoso. Ahora podés iniciar sesión.");
      window.location.href = "index.html";
    });
  }

  // --- Login ---
  const loginForm = document.getElementById("loginForm");
  if (loginForm) {
    loginForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const user = document.getElementById("loginUser").value;
      const pass = document.getElementById("loginPass").value;

      // Revisar admin primero
      const admin = JSON.parse(localStorage.getItem("usuarioAdmin"));
      if (admin && admin.user === user && admin.pass === pass) {
        alert("Login exitoso como ADMIN");
        localStorage.setItem("logueado", "true");
        localStorage.setItem("rol", "admin");
        window.location.href = "home.html";
        return;
      }

      // Revisar usuarios normales
      const storedUser = JSON.parse(localStorage.getItem("usuario"));
      if (storedUser && storedUser.user === user && storedUser.pass === pass) {
        alert("Login exitoso");
        localStorage.setItem("logueado", "true");
        localStorage.setItem("rol", storedUser.rol || "user");
        window.location.href = "home.html";
      } else {
        alert("Usuario o contraseña incorrectos");
      }
    });
  }
});
