/**
 * PT ETERNO VENTURA FARRELINDO - MAIN JAVASCRIPT
 * High performance, zero external framework dependencies
 */

document.addEventListener('DOMContentLoaded', () => {
  // --- 0. Dark / Light Mode Toggle ---
  const themeToggle = document.getElementById('themeToggle');
  const rootEl = document.documentElement;

  function applyTheme(theme) {
    rootEl.setAttribute('data-theme', theme);
    try {
      localStorage.setItem('evf-theme', theme);
    } catch (e) {
      /* localStorage unavailable (private mode, etc.) - theme still applies for this session */
    }
    if (themeToggle) {
      const isLight = theme === 'light';
      themeToggle.setAttribute('aria-pressed', String(isLight));
      themeToggle.setAttribute('aria-label', isLight ? 'Ganti ke mode gelap' : 'Ganti ke mode terang');
    }
  }

  if (themeToggle) {
    // Sync the toggle's ARIA state with whatever the inline head script already applied
    applyTheme(rootEl.getAttribute('data-theme') || 'light');

    themeToggle.addEventListener('click', () => {
      const current = rootEl.getAttribute('data-theme') === 'dark' ? 'dark' : 'light';
      applyTheme(current === 'light' ? 'dark' : 'light');
    });
  }

  // --- 1. Sticky Navbar & Scroll Spy ---
  const navbar = document.getElementById('navbar');
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('section[id]');
  const backToTop = document.getElementById('backToTop');

  window.addEventListener('scroll', () => {
    const scrollY = window.pageYOffset;

    // Navbar blur background
    if (scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }

    // Back to top visibility
    if (backToTop) {
      if (scrollY > 400) {
        backToTop.classList.add('visible');
      } else {
        backToTop.classList.remove('visible');
      }
    }

    // Scroll spy
    sections.forEach(current => {
      const sectionHeight = current.offsetHeight;
      const sectionTop = current.offsetTop - 120;
      const sectionId = current.getAttribute('id');

      if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
        navLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${sectionId}`) {
            link.classList.add('active');
          }
        });
      }
    });
  });

  // Back to top click
  if (backToTop) {
    backToTop.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // --- 2. Mobile Menu Toggle ---
  const mobileToggle = document.getElementById('mobileToggle');
  const navMenu = document.getElementById('navMenu');
  const navOverlay = document.getElementById('navOverlay');

  function closeMobileMenu() {
    navMenu.classList.remove('open');
    if (navOverlay) navOverlay.classList.remove('active');
    mobileToggle.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }

  function openMobileMenu() {
    navMenu.classList.add('open');
    if (navOverlay) navOverlay.classList.add('active');
    mobileToggle.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
  }

  if (mobileToggle && navMenu) {
    mobileToggle.addEventListener('click', () => {
      if (navMenu.classList.contains('open')) {
        closeMobileMenu();
      } else {
        openMobileMenu();
      }
    });

    // Close menu when clicking links
    navLinks.forEach(link => {
      link.addEventListener('click', closeMobileMenu);
    });

    // Close menu when clicking the dimmed backdrop
    if (navOverlay) {
      navOverlay.addEventListener('click', closeMobileMenu);
    }

    // Close menu with Escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && navMenu.classList.contains('open')) {
        closeMobileMenu();
        mobileToggle.focus();
      }
    });
  }

  // --- 3. Scroll Reveal Animations (IntersectionObserver) ---
  const revealElements = document.querySelectorAll('.reveal');
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        observer.unobserve(entry.target);
      }
    });
  }, {
    root: null,
    threshold: 0.15,
    rootMargin: '0px 0px -40px 0px'
  });

  revealElements.forEach(el => revealObserver.observe(el));

  // --- 4. Animated Metric Counters ---
  const counters = document.querySelectorAll('.counter');
  let countersAnimated = false;

  const countObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !countersAnimated) {
        countersAnimated = true;
        counters.forEach(counter => {
          const target = parseFloat(counter.getAttribute('data-target'));
          const prefix = counter.getAttribute('data-prefix') || '';
          const suffix = counter.getAttribute('data-suffix') || '';
          const decimals = parseInt(counter.getAttribute('data-decimals') || '0', 10);
          const duration = 2000;
          const stepTime = 20;
          const steps = duration / stepTime;
          const increment = target / steps;
          let current = 0;

          const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
              current = target;
              clearInterval(timer);
            }
            const formatted = decimals > 0 
              ? current.toFixed(decimals).replace('.', ',')
              : Math.floor(current).toString();
            counter.innerText = `${prefix}${formatted}${suffix}`;
          }, stepTime);
        });
      }
    });
  }, { threshold: 0.5 });

  const metricsSection = document.querySelector('.metrics-strip');
  if (metricsSection) {
    countObserver.observe(metricsSection);
  }

  // --- 5. Portfolio Table: load data from JSON, then Search & Filter ---
  // Data pekerjaan dikelola di data/portfolio.json agar mudah di-maintain.
  // Setiap objek: { paket, klien, waktu, kategori }. Tambah/hapus baris di file itu.
  const searchInput = document.getElementById('tableSearch');
  const filterPills = document.querySelectorAll('.filter-pill');
  const tableBody = document.getElementById('portfolioTableBody');
  const countDisplay = document.getElementById('projectCount');
  const allPill = document.querySelector('.filter-pill[data-filter="all"]');
  let tableRows = []; // diisi setelah data dirender

  function filterProjects() {
    const searchTerm = searchInput ? searchInput.value.toLowerCase().trim() : '';
    const activeFilter = document.querySelector('.filter-pill.active')?.getAttribute('data-filter') || 'all';

    let matchCount = 0;
    tableRows.forEach(row => {
      const text = row.innerText.toLowerCase();
      const category = row.getAttribute('data-category') || '';

      const matchesSearch = text.includes(searchTerm);
      const matchesCategory = activeFilter === 'all' || category.includes(activeFilter);

      if (matchesSearch && matchesCategory) {
        row.style.display = '';
        matchCount++;
      } else {
        row.style.display = 'none';
      }
    });

    if (countDisplay) {
      countDisplay.innerText = matchCount;
    }
  }

  function renderPortfolio(projects) {
    if (!tableBody) return;
    tableBody.innerHTML = '';

    projects.forEach((job, index) => {
      const tr = document.createElement('tr');
      tr.setAttribute('data-category', job.kategori || '');

      const noCell = document.createElement('td');
      noCell.textContent = String(index + 1).padStart(2, '0');

      const paketCell = document.createElement('td');
      paketCell.className = 'job-name';
      paketCell.textContent = job.paket || '';

      const klienCell = document.createElement('td');
      klienCell.textContent = job.klien || '';

      const waktuCell = document.createElement('td');
      waktuCell.style.textAlign = 'center';
      waktuCell.textContent = job.waktu || '';

      tr.append(noCell, paketCell, klienCell, waktuCell);
      tableBody.appendChild(tr);
    });

    tableRows = Array.from(tableBody.querySelectorAll('tr'));

    // Sinkronkan jumlah pada label "Semua (n)" dan hitungan awal
    if (allPill) allPill.textContent = `Semua (${projects.length})`;
    filterProjects();
  }

  function showPortfolioError() {
    if (!tableBody) return;
    const tr = document.createElement('tr');
    const td = document.createElement('td');
    td.colSpan = 4;
    td.style.textAlign = 'center';
    td.style.padding = '2rem 1rem';
    td.textContent = 'Data portofolio belum dapat dimuat. Pastikan halaman diakses melalui server (bukan file lokal langsung).';
    tr.appendChild(td);
    tableBody.appendChild(tr);
  }

  if (tableBody) {
    fetch('data/portfolio.json')
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then((data) => {
        if (Array.isArray(data)) {
          renderPortfolio(data);
        } else {
          showPortfolioError();
        }
      })
      .catch(() => showPortfolioError());
  }

  if (searchInput) {
    searchInput.addEventListener('input', filterProjects);
  }

  filterPills.forEach(pill => {
    pill.addEventListener('click', () => {
      filterPills.forEach(p => {
        p.classList.remove('active');
        p.setAttribute('aria-pressed', 'false');
      });
      pill.classList.add('active');
      pill.setAttribute('aria-pressed', 'true');
      filterProjects();
    });
  });

  // --- 6. Lightbox Modal for Documentation & Certificates ---
  const lightbox = document.getElementById('lightboxModal');
  const lightboxImg = document.getElementById('lightboxImg');
  const lightboxCap = document.getElementById('lightboxCap');
  const lightboxClose = document.getElementById('lightboxClose');
  const lightboxPrev = document.getElementById('lightboxPrev');
  const lightboxNext = document.getElementById('lightboxNext');
  // Hanya kartu utama (.gallery-item / tombol legalitas) yang bisa diklik untuk
  // membuka lightbox. Kartu "-extra" tersembunyi dan hanya menyumbang foto
  // tambahan ke dalam grup navigasinya, tidak berdiri sebagai kartu sendiri.
  const galleryItems = document.querySelectorAll('.gallery-item[data-lightbox-src], .legal-badge-btn[data-lightbox-src]');
  let lastFocusedElement = null;
  // Foto-foto dengan data-lightbox-group yang sama (satu lokasi/instansi)
  // dikelompokkan agar bisa dinavigasi dengan tombol next/prev di lightbox.
  let currentGroup = [];
  let currentIndex = -1;

  function getGroupFor(item) {
    const groupKey = item.getAttribute('data-lightbox-group');
    if (!groupKey) return [item];
    return Array.from(document.querySelectorAll(`[data-lightbox-group="${groupKey}"]`));
  }

  function renderLightbox(item) {
    const src = item.getAttribute('data-lightbox-src');
    const caption = item.getAttribute('data-lightbox-caption') || '';
    if (lightboxImg && src) {
      lightboxImg.src = src;
      lightboxImg.alt = caption;
      if (lightboxCap) lightboxCap.innerText = caption;
    }
  }

  function updateNavVisibility() {
    const hasNav = currentGroup.length > 1;
    if (lightboxPrev) lightboxPrev.hidden = !hasNav;
    if (lightboxNext) lightboxNext.hidden = !hasNav;
  }

  function openLightbox(item) {
    if (!lightbox || !lightboxImg) return;
    currentGroup = getGroupFor(item);
    currentIndex = currentGroup.indexOf(item);
    if (currentIndex === -1) currentIndex = 0;

    lastFocusedElement = document.activeElement;
    renderLightbox(item);
    updateNavVisibility();
    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden';
    if (lightboxClose) lightboxClose.focus();
  }

  function showRelative(offset) {
    if (!currentGroup.length) return;
    currentIndex = (currentIndex + offset + currentGroup.length) % currentGroup.length;
    renderLightbox(currentGroup[currentIndex]);
  }

  function closeLightbox() {
    lightbox.classList.remove('active');
    document.body.style.overflow = '';
    if (lastFocusedElement) lastFocusedElement.focus();
  }

  galleryItems.forEach(item => {
    item.addEventListener('click', () => openLightbox(item));

    // Keyboard support for elements that aren't native buttons (e.g. gallery cards)
    if (item.tagName !== 'BUTTON' && item.getAttribute('role') === 'button') {
      item.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          openLightbox(item);
        }
      });
    }
  });

  if (lightboxPrev) {
    lightboxPrev.addEventListener('click', (e) => {
      e.stopPropagation();
      showRelative(-1);
    });
  }

  if (lightboxNext) {
    lightboxNext.addEventListener('click', (e) => {
      e.stopPropagation();
      showRelative(1);
    });
  }

  if (lightboxClose && lightbox) {
    lightboxClose.addEventListener('click', closeLightbox);

    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox) {
        closeLightbox();
      }
    });

    document.addEventListener('keydown', (e) => {
      if (!lightbox.classList.contains('active')) return;
      if (e.key === 'Escape') {
        closeLightbox();
      } else if (e.key === 'ArrowLeft') {
        showRelative(-1);
      } else if (e.key === 'ArrowRight') {
        showRelative(1);
      }
    });
  }

  // --- 7. Quick Consultation / Quote Form Direct to Email ---
  const quoteForm = document.getElementById('quoteForm');
  if (quoteForm) {
    quoteForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('clientName')?.value.trim() || '';
      const instansi = document.getElementById('clientInstansi')?.value.trim() || '';
      const service = document.getElementById('clientService')?.value || 'Konsultasi Umum';
      const message = document.getElementById('clientMessage')?.value.trim() || '';

      const emailBody = [
        'Halo PT Eterno Ventura Farrelindo,',
        '',
        'Saya ingin konsultasi mengenai layanan alih daya:',
        `- Nama: ${name}`,
        `- Instansi/Perusahaan: ${instansi}`,
        `- Kebutuhan Layanan: ${service}`,
        `- Catatan: ${message}`,
        '',
        'Mohon info dan tindak lanjutnya. Terima kasih.'
      ].join('\n');

      const subject = `Permintaan Penawaran - ${instansi || name || 'Calon Mitra'}`;
      window.location.href = `mailto:eternoindo@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(emailBody)}`;
    });
  }

  // --- 8. Fallback Logo Klien ---
  // Jika file logo gagal dimuat (salah nama / belum ada), sembunyikan gambar
  // agar ikon gedung default yang tampil, bukan gambar rusak.
  document.querySelectorAll('.client-chip-logo').forEach((logo) => {
    logo.addEventListener('error', () => {
      logo.setAttribute('hidden', '');
    });
  });

  /* --- Floating WhatsApp CTA dinonaktifkan sementara (lihat catatan). ---
     Untuk mengaktifkan kembali, buka kembali blok <a class="whatsapp-float"> di index.html. */
});
