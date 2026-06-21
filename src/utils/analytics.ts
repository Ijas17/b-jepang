/**
 * Utility untuk memuat Google Analytics (GA4) secara dinamis
 * Menggunakan Environment Variable VITE_GA_MEASUREMENT_ID
 */

export function initGA(): void {
  // Hanya jalankan di browser
  if (typeof window === 'undefined') return;

  const measurementId = (import.meta as any).env?.VITE_GA_MEASUREMENT_ID || 'G-75EF3VLMH6';
  
  if (!measurementId) {
    console.log("ℹ️ Google Analytics (GA4): ID Pengukuran tidak terdeteksi (Halaman berjalan offline/tanpa tracking).");
    return;
  }

  try {
    // 1. Masukkan script gtag.js dari Google
    const script1 = document.createElement('script');
    script1.async = true;
    script1.src = `https://www.googletagmanager.com/gtag/js?id=${measurementId}`;
    document.head.appendChild(script1);

    // 2. Inisialisasi konfigurasi dataLayer global
    const script2 = document.createElement('script');
    script2.text = `
      window.dataLayer = window.dataLayer || [];
      function gtag(){window.dataLayer.push(arguments);}
      gtag('js', new Date());
      gtag('config', '${measurementId}', {
        page_path: window.location.pathname,
        send_page_view: true
      });
    `;
    document.head.appendChild(script2);

    console.log(`✅ Google Analytics (GA4) berhasil dimuat menggunakan ID: ${measurementId}`);
  } catch (error) {
    console.error("❌ Gagal memuat Google Analytics:", error);
  }
}

/**
 * Kirim custom event ke Google Analytics (misal: klik fitur, play audio, ganti tab pelajaran)
 */
export function trackEvent(action: string, category: string, label?: string): void {
  if (typeof window === 'undefined') return;
  
  const anyWindow = window as any;
  if (typeof anyWindow.gtag === 'function') {
    anyWindow.gtag('event', action, {
      event_category: category,
      event_label: label,
    });
  }
}
