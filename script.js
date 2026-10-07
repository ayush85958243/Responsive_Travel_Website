/* =========================================================
   WANDERVISTA TRAVELS — SCRIPT
   ========================================================= */
document.addEventListener('DOMContentLoaded', () => {

  /* ---------- Preloader ---------- */
  const preloader = document.getElementById('preloader');
  window.addEventListener('load', () => {
    setTimeout(() => preloader && preloader.classList.add('loaded'), 300);
  });
  // Fallback in case 'load' already fired
  setTimeout(() => preloader && preloader.classList.add('loaded'), 2500);

  /* ---------- Navbar scroll state ---------- */
  const navbar = document.getElementById('mainNavbar');
  const toggleNavbarState = () => {
    if (window.scrollY > 60) navbar.classList.add('scrolled');
    else navbar.classList.remove('scrolled');
  };
  toggleNavbarState();
  window.addEventListener('scroll', toggleNavbarState);

  /* ---------- Collapse mobile menu after clicking a link ---------- */
  document.querySelectorAll('#navMenu .nav-link').forEach(link => {
    link.addEventListener('click', () => {
      const menu = document.getElementById('navMenu');
      if (menu.classList.contains('show')) {
        bootstrap.Collapse.getOrCreateInstance(menu).hide();
      }
    });
  });

  /* ---------- Active link on scroll ---------- */
  const sections = document.querySelectorAll('section[id], header[id]');
  const navLinks = document.querySelectorAll('.navbar-nav .nav-link');
  const setActiveLink = () => {
    let current = '';
    sections.forEach(sec => {
      const top = sec.offsetTop - 140;
      if (window.scrollY >= top) current = sec.getAttribute('id');
    });
    navLinks.forEach(link => {
      link.classList.toggle('active', link.getAttribute('href') === `#${current}`);
    });
  };
  window.addEventListener('scroll', setActiveLink);
  setActiveLink();

  /* ---------- Search bar toggle ---------- */
  const searchToggle = document.getElementById('searchToggle');
  const navSearchBar = document.getElementById('navSearchBar');
  const closeSearch = document.getElementById('closeSearch');
  if (searchToggle) {
    searchToggle.addEventListener('click', () => {
      navSearchBar.classList.toggle('open');
      if (navSearchBar.classList.contains('open')) {
        navSearchBar.querySelector('input').focus();
      }
    });
  }
  if (closeSearch) {
    closeSearch.addEventListener('click', () => navSearchBar.classList.remove('open'));
  }

  /* ---------- Scroll reveal animations ---------- */
  const revealEls = document.querySelectorAll('.reveal');
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });
  revealEls.forEach(el => revealObserver.observe(el));

  /* ---------- Booking search form (hero) ---------- */
  const bookingForm = document.getElementById('bookingForm');
  if (bookingForm) {
    bookingForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const dest = document.getElementById('bookDestination').value || 'your next destination';
      document.querySelector('#destinations').scrollIntoView({ behavior: 'smooth' });
      // Simple visual feedback
      const btn = bookingForm.querySelector('.booking-submit');
      const original = btn.innerHTML;
      btn.innerHTML = `<i class="fa-solid fa-check"></i> Searching ${dest}`;
      setTimeout(() => { btn.innerHTML = original; }, 2200);
    });
  }

  /* ---------- Countdown timer for Special Offer ---------- */
  const countdownEl = document.getElementById('countdown');
  if (countdownEl) {
    // Countdown target: 5 days from first page load, persisted in sessionStorage
    // so the timer doesn't reset on every reload during a visit.
    let deadline = sessionStorage.getItem('wv_offer_deadline');
    if (!deadline) {
      deadline = Date.now() + (5 * 24 * 60 * 60 * 1000);
      sessionStorage.setItem('wv_offer_deadline', deadline);
    } else {
      deadline = parseInt(deadline, 10);
    }

    const dEl = document.getElementById('cdDays');
    const hEl = document.getElementById('cdHours');
    const mEl = document.getElementById('cdMinutes');
    const sEl = document.getElementById('cdSeconds');

    const pad = (n) => String(n).padStart(2, '0');

    const updateCountdown = () => {
      const distance = deadline - Date.now();
      if (distance <= 0) {
        dEl.textContent = hEl.textContent = mEl.textContent = sEl.textContent = '00';
        clearInterval(timer);
        return;
      }
      const days = Math.floor(distance / (1000 * 60 * 60 * 24));
      const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((distance % (1000 * 60)) / 1000);
      dEl.textContent = pad(days);
      hEl.textContent = pad(hours);
      mEl.textContent = pad(minutes);
      sEl.textContent = pad(seconds);
    };
    updateCountdown();
    const timer = setInterval(updateCountdown, 1000);
  }

  /* ---------- Animated statistics counters ---------- */
  const statNumbers = document.querySelectorAll('.stat-number');
  const animateCount = (el) => {
    const target = parseInt(el.getAttribute('data-target'), 10);
    const suffix = el.getAttribute('data-suffix') || '';
    const duration = 1800;
    const start = performance.now();

    const step = (now) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
      const value = Math.floor(eased * target);
      el.textContent = value.toLocaleString('en-IN') + suffix;
      if (progress < 1) requestAnimationFrame(step);
      else el.textContent = target.toLocaleString('en-IN') + suffix;
    };
    requestAnimationFrame(step);
  };

  const statObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCount(entry.target);
        statObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.6 });
  statNumbers.forEach(el => statObserver.observe(el));

  /* ---------- Newsletter form validation ---------- */
  const newsletterForm = document.getElementById('newsletterForm');
  const newsletterMsg = document.getElementById('newsletterMsg');
  if (newsletterForm) {
    newsletterForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const emailInput = document.getElementById('newsletterEmail');
      const email = emailInput.value.trim();
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      if (!emailPattern.test(email)) {
        newsletterMsg.textContent = 'Please enter a valid email address.';
        newsletterMsg.classList.add('error');
        return;
      }
      newsletterMsg.classList.remove('error');
      newsletterMsg.textContent = `Thanks! A confirmation has been sent to ${email}.`;
      newsletterForm.reset();
    });
  }

  /* ---------- Contact form validation ---------- */
  const contactForm = document.getElementById('contactForm');
  const contactSuccess = document.getElementById('contactSuccess');
  if (contactForm) {
    const fields = contactForm.querySelectorAll('input, textarea');

    fields.forEach(field => {
      field.addEventListener('blur', () => field.classList.add('touched'));
    });

    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      let valid = true;
      fields.forEach(field => {
        field.classList.add('touched');
        if (!field.checkValidity()) valid = false;
      });

      if (!valid) {
        contactSuccess.classList.remove('show');
        const firstInvalid = contactForm.querySelector(':invalid');
        if (firstInvalid) firstInvalid.focus();
        return;
      }

      contactSuccess.classList.add('show');
      contactForm.reset();
      fields.forEach(field => field.classList.remove('touched'));
    });
  }

  /* ---------- Back to top button ---------- */
  const backToTop = document.getElementById('backToTop');
  if (backToTop) {
    backToTop.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

});
