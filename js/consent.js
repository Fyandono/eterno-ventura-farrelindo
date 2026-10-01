/**
 * PT ETERNO VENTURA FARRELINDO - COOKIE CONSENT & ANALYTICS
 * Banner persetujuan cookie (vanilla-cookieconsent v3.1.0, js/vendor/) dan
 * Google Analytics 4 dari project Firebase `eterno-ventura-farrelindo`.
 * GA baru dimuat setelah pengunjung menyetujui kategori `analytics`.
 */

(function () {
  // Measurement ID GA4. Kosongkan untuk menonaktifkan analytics dan banner cookie.
  const GA_MEASUREMENT_ID = 'G-BJ1KDQQBCR';
  const COOKIES_URL = 'cookies.html';

  if (!GA_MEASUREMENT_ID || !window.CookieConsent) return;

  // --- 1. Google Analytics 4 ---
  let analyticsLoaded = false;

  function loadAnalytics() {
    if (analyticsLoaded) {
      window.gtag('consent', 'update', { analytics_storage: 'granted' });
      return;
    }
    analyticsLoaded = true;

    window.dataLayer = window.dataLayer || [];
    window.gtag = function gtag() {
      // gtag.js membutuhkan objek `arguments`, bukan array.
      window.dataLayer.push(arguments);
    };

    window.gtag('consent', 'default', {
      analytics_storage: 'granted',
      ad_storage: 'denied',
      ad_user_data: 'denied',
      ad_personalization: 'denied',
    });
    window.gtag('js', new Date());
    window.gtag('config', GA_MEASUREMENT_ID, {
      allow_google_signals: false,
      allow_ad_personalization_signals: false,
    });

    const script = document.createElement('script');
    script.async = true;
    script.src = 'https://www.googletagmanager.com/gtag/js?id=' + encodeURIComponent(GA_MEASUREMENT_ID);
    document.head.appendChild(script);
  }

  function revokeAnalytics() {
    if (analyticsLoaded) window.gtag('consent', 'update', { analytics_storage: 'denied' });
  }

  function syncAnalytics() {
    if (CookieConsent.acceptedCategory('analytics')) loadAnalytics();
    else revokeAnalytics();
  }

  // --- 2. Banner mengikuti tema terang/gelap situs ---
  const rootEl = document.documentElement;

  function syncTheme() {
    rootEl.classList.toggle('cc--darkmode', rootEl.getAttribute('data-theme') === 'dark');
  }

  syncTheme();
  new MutationObserver(syncTheme).observe(rootEl, { attributes: true, attributeFilter: ['data-theme'] });

  // --- 3. Cookie Consent ---
  const moreInfo = 'Informasi lebih lanjut ada di <a href="' + COOKIES_URL + '">Kebijakan Cookie</a>.';

  CookieConsent.run({
    revision: 1,
    cookie: { name: 'cc_cookie', expiresAfterDays: 365, sameSite: 'Lax' },
    guiOptions: {
      consentModal: { layout: 'box', position: 'bottom left', equalWeightButtons: true },
      preferencesModal: { layout: 'box', equalWeightButtons: true },
    },
    categories: {
      necessary: { enabled: true, readOnly: true },
      analytics: {
        autoClear: { cookies: [{ name: /^_ga/ }] },
      },
    },
    onConsent: syncAnalytics,
    onChange: syncAnalytics,
    language: {
      default: 'id',
      translations: {
        id: {
          consentModal: {
            title: 'Kami menggunakan cookie',
            description:
              'Kami menggunakan cookie analitik untuk memahami cara pengunjung menggunakan situs ini dan meningkatkan layanan kami. Cookie ini hanya aktif jika Anda menyetujuinya. ' +
              moreInfo,
            acceptAllBtn: 'Terima semua',
            acceptNecessaryBtn: 'Tolak semua',
            showPreferencesBtn: 'Pengaturan',
          },
          preferencesModal: {
            title: 'Pengaturan cookie',
            acceptAllBtn: 'Terima semua',
            acceptNecessaryBtn: 'Tolak semua',
            savePreferencesBtn: 'Simpan pilihan',
            closeIconLabel: 'Tutup',
            sections: [
              {
                title: 'Cookie yang diperlukan',
                description:
                  'Diperlukan agar situs berfungsi, termasuk menyimpan pilihan cookie Anda. Tidak dapat dinonaktifkan.',
                linkedCategory: 'necessary',
              },
              {
                title: 'Cookie analitik',
                description:
                  'Membantu kami memahami jumlah pengunjung dan halaman yang paling sering dibuka melalui Google Analytics. Data dikumpulkan secara agregat.',
                linkedCategory: 'analytics',
              },
              { description: moreInfo },
            ],
          },
        },
      },
    },
  });

  // --- 4. Tombol "Pengaturan Cookie" (footer) ---
  document.querySelectorAll('[data-cookie-settings]').forEach((button) => {
    button.addEventListener('click', () => CookieConsent.showPreferences());
  });
})();
