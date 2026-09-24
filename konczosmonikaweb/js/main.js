/* ==========================================================================
   Konczosné Megyeri Mónika - TEST • LÉLEK • SZELLEM
   Master JavaScript Interactivity
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {

  // 1. Mobile Menu Toggle
  const mobileToggle = document.querySelector('.mobile-nav-toggle');
  const navMenu = document.querySelector('.nav-menu');

  if (mobileToggle && navMenu) {
    mobileToggle.addEventListener('click', () => {
      navMenu.classList.toggle('active');
      const isOpen = navMenu.classList.contains('active');
      mobileToggle.innerHTML = isOpen ? '✕' : '☰';
      document.body.style.overflow = isOpen ? 'hidden' : '';
    });

    // Close menu when clicking link
    document.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('active');
        mobileToggle.innerHTML = '☰';
        document.body.style.overflow = '';
      });
    });
  }

  // 2. Tab Switching System (Expanse Therapy deep dives)
  const tabButtons = document.querySelectorAll('.tab-btn');
  const tabContents = document.querySelectorAll('.tab-content');

  tabButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const targetTab = btn.getAttribute('data-tab');

      tabButtons.forEach(b => b.classList.remove('active'));
      tabContents.forEach(c => c.classList.remove('active'));

      btn.classList.add('active');
      const activeContent = document.getElementById(targetTab);
      if (activeContent) {
        activeContent.classList.add('active');
      }
    });
  });

  // 3. Auto-Select Service from URL (e.g. kapcsolat.html?service=angyalkartya-60)
  const serviceSelect = document.getElementById('booking-service');
  if (serviceSelect) {
    const urlParams = new URLSearchParams(window.location.search);
    const selectedService = urlParams.get('service');
    if (selectedService) {
      serviceSelect.value = selectedService;
    }
  }

  // 4. Appointment Form Handling (Netlify Forms AJAX)
  const bookingForm = document.getElementById('appointment-form');
  if (bookingForm) {
    bookingForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const submitBtn = bookingForm.querySelector('button[type="submit"]');
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerText = 'Küldés folyamatban... ⏳';
      }

      const formData = new FormData(bookingForm);

      fetch('/', {
        method: 'POST',
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams(formData).toString()
      })
      .then(() => {
        bookingForm.innerHTML = `
          <div style="text-align: center; padding: 2.5rem 1.5rem; background: rgba(230, 215, 195, 0.25); border-radius: 16px; border: 1.5px solid var(--accent-gold); margin-top: 1rem;">
            <div style="font-size: 3rem; margin-bottom: 0.5rem;">✨</div>
            <h3 style="color: var(--purple-dark); font-size: 1.8rem; margin-bottom: 0.8rem; font-family: var(--font-script);">Köszönjük az időpontfoglalási igényedet!</h3>
            <p style="font-size: 1.1rem; color: var(--text-dark); line-height: 1.7; max-width: 550px; margin: 0 auto;">
              Az üzenetedet sikeresen megkaptuk.<br>Hamarosan felvesszük veled a kapcsolatot a megadott elérhetőségeiden!
            </p>
          </div>
        `;
      })
      .catch((error) => {
        alert('Hiba történt az üzenet küldése során. Kérlek, próbáld újra vagy keress minket telefonon/e-mailben!');
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.innerText = 'Időpontfoglalási igény elküldése 📩';
        }
      });
    });
  }

  // 5. Active Link Highlighting
  const currentPath = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-link').forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPath || (currentPath === '' && href === 'index.html')) {
      link.classList.add('active');
    }
  });

});
