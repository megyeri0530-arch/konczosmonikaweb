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

  // 4. Appointment Form Handling
  const bookingForm = document.getElementById('appointment-form');
  if (bookingForm) {
    bookingForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const name = document.getElementById('booking-name').value;
      const email = document.getElementById('booking-email').value;
      const phone = document.getElementById('booking-phone').value;
      const service = document.getElementById('booking-service').selectedOptions[0].text;
      const date = document.getElementById('booking-date').value;

      // Simple elegant alert modal feedback
      alert(`Kedves ${name}!\n\nKöszönjük az időpontfoglalási igényedet!\nSzolgáltatás: ${service}\nTervezett dátum: ${date}\n\nHamarosan felvesszük veled a kapcsolatot a(z) ${email} e-mail címen vagy a(z) ${phone} telefonszámon!`);
      
      bookingForm.reset();
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
