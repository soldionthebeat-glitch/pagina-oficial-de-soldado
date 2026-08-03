(() => {
  'use strict';

  /* Año dinámico en el footer */
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* Nav: fondo al scrollear */
  const nav = document.querySelector('.nav');
  const onScroll = () => nav.classList.toggle('scrolled', window.scrollY > 24);
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  /* Menú mobile */
  const toggle = document.querySelector('.nav-toggle');
  const links = document.querySelector('.nav-links');
  if (toggle && links) {
    toggle.addEventListener('click', () => {
      const open = links.classList.toggle('mobile-open');
      toggle.classList.toggle('open', open);
      toggle.setAttribute('aria-expanded', String(open));
    });
    links.querySelectorAll('a').forEach((a) =>
      a.addEventListener('click', () => {
        links.classList.remove('mobile-open');
        toggle.classList.remove('open');
        toggle.setAttribute('aria-expanded', 'false');
      })
    );
  }

  /* Animaciones de aparición */
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in');
          io.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12 }
  );
  document.querySelectorAll('.reveal').forEach((el) => io.observe(el));

  /* Música de fondo (volumen bajo) */
  const bgAudio = document.getElementById('bg-audio');
  const musicBtn = document.getElementById('music-btn');
  if (bgAudio && musicBtn) {
    bgAudio.volume = 0.02;

    const setPlaying = () => {
      musicBtn.classList.remove('paused');
      musicBtn.classList.add('playing');
      musicBtn.setAttribute('aria-label', 'Pausar música de fondo');
    };

    const setPaused = () => {
      musicBtn.classList.remove('playing');
      musicBtn.classList.add('paused');
      musicBtn.setAttribute('aria-label', 'Reproducir música de fondo');
    };

    const tryPlay = () => {
      if (bgAudio.paused) {
        bgAudio.play().then(setPlaying).catch(() => setPaused());
      }
    };

    musicBtn.addEventListener('click', () => {
      if (bgAudio.paused) {
        tryPlay();
      } else {
        bgAudio.pause();
        setPaused();
      }
    });

    document.addEventListener('click', (e) => {
      if (musicBtn.contains(e.target)) return;
      if (bgAudio.paused) tryPlay();
    }, { once: true });
  }

  /* Formulario: envío con EmailJS */
  const form = document.querySelector('.contacto-form');
  const status = document.querySelector('.form-status');
  if (form && status) {
    if (window.emailjs) emailjs.init('6eWG2SK48quvIIAg_');

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const nombre = form.nombre.value.trim();
      const mail = form.mail.value.trim();
      const mensaje = form.mensaje.value.trim();

      if (!nombre || !mail || !mensaje) {
        status.textContent = 'Completá todos los campos.';
        status.className = 'form-status err';
        return;
      }
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(mail)) {
        status.textContent = 'Mail inválido. Revisá el formato.';
        status.className = 'form-status err';
        return;
      }
      if (!window.emailjs) {
        status.textContent = 'Servicio de envío no disponible en este momento.';
        status.className = 'form-status err';
        return;
      }

      const btn = form.querySelector('.btn');
      const original = btn.textContent;
      btn.textContent = 'ENVIANDO...';
      btn.disabled = true;
      status.textContent = '';

      emailjs
        .send('service_xw2gxxb', 'template_6ojqnmb', {
          title: 'Contacto desde la web',
          name: nombre,
          email: mail,
          message: mensaje,
        })
        .then(() => {
          status.textContent = 'Mensaje enviado. Te respondemos a la brevedad.';
          status.className = 'form-status ok';
          form.reset();
        })
        .catch(() => {
          status.textContent = 'No se pudo enviar. Probá de nuevo o escribí por redes.';
          status.className = 'form-status err';
        })
        .finally(() => {
          btn.textContent = original;
          btn.disabled = false;
        });
    });
  }
})();
