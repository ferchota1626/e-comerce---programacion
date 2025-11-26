(function() {
  const carousels = document.querySelectorAll('.carousel');

  carousels.forEach(carousel => {
    const track = carousel.querySelector('.carousel-track');
    const items = Array.from(track.children);
    const nextBtn = carousel.querySelector('.next');
    const prevBtn = carousel.querySelector('.prev');
    const total = items.length;

    let currentIndex = 0;
    let isAnimating = false; // ← bloqueo de animación

    // Función para mover el carrusel
    function updateCarousel() {
      isAnimating = true; // bloquear botones
      const offset = -currentIndex * 100;
      track.style.transform = `translateX(${offset}%)`;

      // Esperar al final de la animación CSS (0.8s)
      track.addEventListener(
        "transitionend",
        () => (isAnimating = false),
        { once: true } // se ejecuta solo una vez
      );
    }

    // Botón siguiente
    nextBtn.addEventListener('click', () => {
      if (isAnimating) return; // evita clics durante la animación
      currentIndex = (currentIndex + 1) % total;
      updateCarousel();
    });

    // Botón anterior
    prevBtn.addEventListener('click', () => {
      if (isAnimating) return;
      currentIndex = (currentIndex - 1 + total) % total;
      updateCarousel();
    });

    // Movimiento automático cada 5 segundos
    setInterval(() => {
      if (!isAnimating) {
        currentIndex = (currentIndex + 1) % total;
        updateCarousel();
      }
    }, 5000);
  });
})();