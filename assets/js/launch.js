(function () {
  'use strict';

  var LAUNCH_DATE = new Date('2026-08-25T00:00:00+05:30');
  var WAITLIST_KEY = 'xyz-nutrition-vanta-belgian-dark-chocolate-waitlist';

  document.getElementById('year').textContent = new Date().getFullYear();

  /* ---------- Header scroll state ---------- */
  var header = document.getElementById('siteHeader');
  function onScroll() {
    header.classList.toggle('is-scrolled', window.scrollY > 8);
  }
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  /* ---------- Mobile nav ---------- */
  var navToggle = document.getElementById('navToggle');
  var mobileNav = document.getElementById('mobileNav');
  function closeNav() {
    mobileNav.classList.remove('is-open');
    navToggle.setAttribute('aria-expanded', 'false');
  }
  navToggle.addEventListener('click', function () {
    var isOpen = mobileNav.classList.toggle('is-open');
    navToggle.setAttribute('aria-expanded', String(isOpen));
  });
  mobileNav.querySelectorAll('a').forEach(function (a) {
    a.addEventListener('click', closeNav);
  });

  /* ---------- Countdown ---------- */
  var elDays = document.getElementById('cdDays');
  var elHours = document.getElementById('cdHours');
  var elMins = document.getElementById('cdMins');
  var elSecs = document.getElementById('cdSecs');

  function pad(n) { return String(n).padStart(2, '0'); }

  function tickCountdown() {
    var diff = LAUNCH_DATE.getTime() - Date.now();
    if (diff <= 0) {
      elDays.textContent = '00';
      elHours.textContent = '00';
      elMins.textContent = '00';
      elSecs.textContent = '00';
      return;
    }
    var totalSeconds = Math.floor(diff / 1000);
    var days = Math.floor(totalSeconds / 86400);
    var hours = Math.floor((totalSeconds % 86400) / 3600);
    var mins = Math.floor((totalSeconds % 3600) / 60);
    var secs = totalSeconds % 60;

    elDays.textContent = pad(days);
    elHours.textContent = pad(hours);
    elMins.textContent = pad(mins);
    elSecs.textContent = pad(secs);
  }
  tickCountdown();
  setInterval(tickCountdown, 1000);

  /* ---------- Notify forms ---------- */
  function isValidEmail(value) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
  }

  function saveEmail(email) {
    try {
      var list = JSON.parse(localStorage.getItem(WAITLIST_KEY) || '[]');
      if (list.indexOf(email) === -1) {
        list.push(email);
        localStorage.setItem(WAITLIST_KEY, JSON.stringify(list));
      }
    } catch (err) {
      /* localStorage unavailable — skip persistence */
    }
  }

  function showMessage(msgEl, type, text) {
    msgEl.textContent = text;
    msgEl.className = 'form-msg show ' + type;
  }

  function wireForm(formId, inputId, msgId) {
    var form = document.getElementById(formId);
    var input = document.getElementById(inputId);
    var msg = document.getElementById(msgId);
    if (!form) return;

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var email = input.value.trim();

      if (!isValidEmail(email)) {
        input.classList.add('invalid');
        showMessage(msg, 'error', 'Please enter a valid email address.');
        input.focus();
        return;
      }

      input.classList.remove('invalid');
      saveEmail(email);
      showMessage(msg, 'success', "You're on the list — we'll email you on launch day.");
      form.reset();
    });

    input.addEventListener('input', function () {
      input.classList.remove('invalid');
    });
  }

  wireForm('notifyFormHero', 'emailHero', 'formMsgHero');
  wireForm('notifyFormFooter', 'emailFooter', 'formMsgFooter');

  /* ---------- FAQ accordion ---------- */
  document.querySelectorAll('.faq-item').forEach(function (item) {
    var btn = item.querySelector('.faq-q');
    btn.addEventListener('click', function () {
      var isOpen = item.classList.contains('is-open');
      document.querySelectorAll('.faq-item.is-open').forEach(function (openItem) {
        if (openItem !== item) {
          openItem.classList.remove('is-open');
          openItem.querySelector('.faq-q').setAttribute('aria-expanded', 'false');
        }
      });
      item.classList.toggle('is-open', !isOpen);
      btn.setAttribute('aria-expanded', String(!isOpen));
    });
  });

  /* ---------- Scroll reveal ---------- */
  var revealEls = document.querySelectorAll('[data-reveal]');
  if ('IntersectionObserver' in window && revealEls.length) {
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });
    revealEls.forEach(function (el) { observer.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add('is-visible'); });
  }

  /* ---------- Smooth-scroll anchor links (account for fixed header) ---------- */
  document.querySelectorAll('a[href^="#"]').forEach(function (link) {
    link.addEventListener('click', function (e) {
      var id = link.getAttribute('href').slice(1);
      var target = id ? document.getElementById(id) : null;
      if (!target) return;
      e.preventDefault();
      var headerOffset = header.offsetHeight + 16;
      var top = target.getBoundingClientRect().top + window.pageYOffset - headerOffset;
      window.scrollTo({ top: top, behavior: 'smooth' });
    });
  });
})();
