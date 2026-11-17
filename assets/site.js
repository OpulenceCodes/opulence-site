// Opulence Media Agency site script
// Google Analytics: paste your measurement ID (looks like G-XXXXXXXXXX) between the quotes to switch it on.
var GA_ID = 'G-G9040NR5YC';
var CONTACT_EMAIL = 'david@opulencemediaagency.com';

(function () {
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (GA_ID) {
    var g = document.createElement('script');
    g.async = true;
    g.src = 'https://www.googletagmanager.com/gtag/js?id=' + encodeURIComponent(GA_ID);
    document.head.appendChild(g);
    window.dataLayer = window.dataLayer || [];
    window.gtag = function () { window.dataLayer.push(arguments); };
    window.gtag('js', new Date());
    window.gtag('config', GA_ID);
  }

  // Scroll reveal
  var targets = [];
  document.querySelectorAll('section').forEach(function (sec) {
    if (sec.id === 'top' || sec.querySelector('.op-track')) return;
    var kids = sec.children.length > 1 ? sec.children : (sec.firstElementChild ? sec.firstElementChild.children : []);
    Array.prototype.forEach.call(kids, function (el) { targets.push(el); });
  });
  if (!reduce && 'IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); }
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.05 });
    targets.forEach(function (el) { el.classList.add('rv'); io.observe(el); });
  }

  // Services wheel: click to pause, drag to spin
  var wheel = document.querySelector('[data-wheel]');
  if (wheel) {
    var rot = wheel.querySelector('[data-wheel-rot]');
    var spin = wheel.querySelector('[data-wheel-spin]');
    var label = document.querySelector('[data-wheel-label]');
    var btn = document.querySelector('[data-wheel-toggle]');
    var offset = 0, paused = false, drag = null;
    var setPaused = function (p) {
      paused = p;
      spin.classList.toggle('op-paused', p);
      if (label) label.textContent = p ? 'Play' : 'Pause';
    };
    if (reduce) setPaused(true);
    wheel.addEventListener('pointerdown', function (e) {
      drag = { y: e.clientY, o: offset, moved: false };
      try { wheel.setPointerCapture(e.pointerId); } catch (err) {}
    });
    wheel.addEventListener('pointermove', function (e) {
      if (!drag) return;
      var dy = e.clientY - drag.y;
      if (Math.abs(dy) > 5) drag.moved = true;
      if (drag.moved) { offset = drag.o - dy * 0.35; rot.style.transform = 'rotateX(' + offset.toFixed(1) + 'deg)'; }
    });
    wheel.addEventListener('pointerup', function () {
      var d = drag; drag = null;
      if (d && !d.moved) setPaused(!paused);
    });
    wheel.addEventListener('pointercancel', function () { drag = null; });
    if (btn) btn.addEventListener('click', function () { setPaused(!paused); });
  }

  // Approach cards: random tilt on hover
  if (!reduce) {
    document.querySelectorAll('.op-tilt').forEach(function (el) {
      el.addEventListener('mouseenter', function () {
        var a = 2 + Math.random() * 5;
        el.style.transform = 'rotate(' + (Math.random() < 0.5 ? -a : a).toFixed(1) + 'deg)';
      });
      el.addEventListener('mouseleave', function () { el.style.transform = 'rotate(0deg)'; });
    });
  }

  // Testimonials: load the YouTube player only when a visitor presses play
  document.querySelectorAll('.op-yt[data-yt]').forEach(function (a) {
    a.addEventListener('click', function (e) {
      e.preventDefault();
      var box = document.createElement('div');
      box.className = 'op-yt-frame';
      var f = document.createElement('iframe');
      f.src = 'https://www.youtube-nocookie.com/embed/' + encodeURIComponent(a.getAttribute('data-yt')) + '?autoplay=1&rel=0';
      f.title = (a.getAttribute('aria-label') || 'Video testimonial').replace(/^Play /, '');
      f.allow = 'accelerometer; autoplay; encrypted-media; picture-in-picture; fullscreen';
      f.allowFullscreen = true;
      box.appendChild(f);
      a.parentNode.replaceChild(box, a);
    });
  });

  // Start a project form
  var form = document.querySelector('[data-contact-form]');
  if (form) {
    var note = form.querySelector('[data-contact-note]');
    var submit = form.querySelector('button[type="submit"]');
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var data = {};
      new FormData(form).forEach(function (v, k) { data[k] = v; });
      submit.disabled = true;
      submit.textContent = 'Sending...';
      note.textContent = '';
      fetch(form.action, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      }).then(function (r) {
        if (!r.ok) throw new Error('send failed');
        form.reset();
        submit.textContent = 'Details sent';
        note.textContent = 'Thank you. We will reply by email with a plan and a price.';
        if (window.va) window.va('event', { name: 'Project enquiry sent' });
      }).catch(function () {
        submit.disabled = false;
        submit.textContent = 'Send project details';
        note.textContent = 'Sorry, that did not send. Please email ' + CONTACT_EMAIL + ' and we will pick it up from there.';
      });
    });
  }
})();
