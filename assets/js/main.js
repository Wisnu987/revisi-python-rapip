let currentGalleryIndex = 0;

function renderFilterButtons() {
  const container = document.getElementById('team-filter-container');
  if (!container || typeof membersData === 'undefined') return;

  const cities = [...new Set(membersData.map(m => m.asal_kota))];

  let html = `
    <button id="filter-all" onclick="filterTeam('all')" class="team-filter-btn px-4 py-2 rounded-xl text-xs font-bold bg-sky-500 text-slate-950 hover:text-white transition">
      All ${membersData.length} Leads
    </button>
  `;

  cities.forEach(city => {
    const cityKey = city.toLowerCase();
    html += `
      <button id="filter-${cityKey}" onclick="filterTeam('${cityKey}')" class="team-filter-btn px-4 py-2 rounded-xl text-xs text-slate-400 hover:text-white transition">
        ${city}
      </button>
    `;
  });

  container.innerHTML = html;
}

// RENDER KARTU ANGGOTA (KOTAK FOTO PROFIL BISA DIKLIK LANGSUNG UNTUK ZOOM)
function renderMembers(filterCity = 'all') {
  const container = document.getElementById('team-cards-container');
  if (!container) return;

  const filteredData = filterCity === 'all' 
    ? membersData 
    : membersData.filter(m => m.asal_kota.toLowerCase() === filterCity.toLowerCase());

  container.innerHTML = filteredData.map((member) => {
    const initials = member.nama.split(' ').map(n => n[0]).slice(0, 2).join('');

    return `
    <div class="cyber-member-card relative group border border-slate-800/90 hover:border-slate-700 rounded-2xl p-5 shadow-xl transition-all duration-300 overflow-hidden font-mono text-xs flex flex-col justify-between">
      
      <div class="space-y-4 relative z-10">
        <div class="flex flex-col sm:flex-row items-center sm:items-start gap-4">
          
          <!-- KOTAK FOTO PROFIL (DIKLIK LANGSUNG UNTUK PERBESAR) -->
          <div onclick="openImageModal('${member.foto}', '${member.nama}', 'Foto Profil — ${member.nama}')" 
               title="Klik untuk memperbesar foto" 
               class="w-28 h-28 sm:w-32 sm:h-32 rounded-2xl bg-slate-900 border-2 border-slate-700/80 group-hover:border-sky-400 p-1 flex items-center justify-center overflow-hidden shrink-0 shadow-lg shadow-sky-500/10 transition duration-300 cursor-pointer relative">
            <img src="${member.foto}" alt="${member.nama}" 
                 onerror="this.onerror=null; this.parentElement.innerHTML='<div class=&quot;w-full h-full bg-slate-900 flex items-center justify-center text-sky-400 font-mono text-xl font-bold border border-slate-800&quot;>${initials}</div>';" 
                 class="w-full h-full object-cover rounded-xl group-hover:scale-105 transition-transform duration-300">
          </div>
          
          <div class="space-y-2 text-center sm:text-left flex-1 min-w-0">
            <h3 class="text-white text-base sm:text-lg font-bold font-sans tracking-tight leading-snug break-words">${member.nama}</h3>
            <p class="text-xs font-mono text-sky-400/90 font-medium tracking-wide">NIM: ${member.nim || '-'}</p>
            <span class="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-slate-900/90 border border-slate-800 text-slate-300 text-[10px] font-bold">
              <span class="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
              📍 ${member.asal_kota}
            </span>
          </div>
        </div>

        <!-- KODE BIODATA RINGKAS (PYTHON FORMAT) -->
        <div class="bg-slate-950/90 p-3.5 rounded-xl border border-slate-800/90 space-y-1 text-emerald-400 font-mono relative overflow-hidden shadow-inner">
          <div class="absolute top-0 right-0 px-2 py-0.5 bg-slate-900 text-[9px] text-slate-500 border-b border-l border-slate-800 rounded-bl">py</div>
          <p><span class="text-sky-400">nama</span> = <span class="text-slate-200">"${member.nama}"</span></p>
          <p><span class="text-sky-400">nim</span> = <span class="text-slate-200">"${member.nim || '-'}"</span></p>
          <p><span class="text-sky-400">tanggal_lahir</span> = <span class="text-slate-200">"${member.tanggal_lahir}"</span></p>
          <p><span class="text-sky-400">asal_kota</span> = <span class="text-slate-200">"${member.asal_kota}"</span></p>
        </div>
      </div>

      <!-- MEDIA SOSIAL & AKSES CV ATS -->
      <div class="flex flex-wrap items-center justify-between gap-3 pt-3 mt-4 border-t border-slate-800/80 relative z-10">
        <div class="flex items-center gap-3 text-slate-400">
          <a href="${member.instagram}" target="_blank" rel="noopener noreferrer" class="hover:text-pink-400 flex items-center gap-1 transition-colors" title="Instagram">
            <svg class="w-4 h-4 fill-current text-pink-500" viewBox="0 0 24 24">
              <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
            </svg>
            <span>Instagram</span>
          </a>

          <a href="${member.linkedin}" target="_blank" rel="noopener noreferrer" class="hover:text-sky-400 flex items-center gap-1 transition-colors" title="LinkedIn">
            <svg class="w-4 h-4 fill-current text-sky-400" viewBox="0 0 24 24">
              <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
            </svg>
            <span>LinkedIn</span>
          </a>
        </div>
        
        <div class="flex items-center gap-1.5 shrink-0">
          <button onclick="openCvModal('${member.cv}', '${member.nama}')" class="px-2.5 py-1.5 bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 rounded-lg text-[11px] font-bold flex items-center gap-1 transition whitespace-nowrap">
            <i data-lucide="eye" class="w-3.5 h-3.5 text-sky-400"></i> Lihat CV
          </button>
          <a href="${member.cv}" download class="px-2.5 py-1.5 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold rounded-lg text-[11px] flex items-center gap-1 shadow transition whitespace-nowrap">
            <i data-lucide="download" class="w-3.5 h-3.5"></i> Unduh
          </a>
        </div>
      </div>

    </div>
  `;
  }).join('');

  if (window.lucide) lucide.createIcons();
}

// RENDER INITIATIVE LEAD (KOTAK FOTO PROFIL BISA DIKLIK LANGSUNG UNTUK ZOOM)
function renderInitiativeLead() {
  const container = document.getElementById('initiative-lead-container');
  if (!container || typeof initiativeLeadData === 'undefined') return;

  const initials = initiativeLeadData.nama
    ? initiativeLeadData.nama.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase()
    : 'LD';

  container.innerHTML = `
    <div class="cyber-card group rounded-2xl p-6 relative overflow-hidden space-y-5 font-mono text-xs">
        
        <!-- HEADER TAG -->
        <div class="flex items-center justify-between">
            <span class="px-2.5 py-1 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/30 text-[10px] font-bold uppercase tracking-wider">
                ● ${initiativeLeadData.tag || 'PJ Proxy Python'}
            </span>
            <span class="text-xs text-slate-400">${initiativeLeadData.node || 'Pekan Ilkomerz 62'}</span>
        </div>

        <div class="flex flex-col sm:flex-row items-center sm:items-start gap-4">
            
            <!-- KOTAK FOTO PROFIL LEAD (DIKLIK LANGSUNG UNTUK PERBESAR) -->
            <div onclick="openImageModal('${initiativeLeadData.foto}', '${initiativeLeadData.nama}', 'Foto Profil — ${initiativeLeadData.nama}')" 
                 title="Klik untuk memperbesar foto" 
                 class="w-28 h-28 sm:w-32 sm:h-32 rounded-2xl bg-slate-900 border-2 border-slate-700/80 group-hover:border-sky-400 p-1 flex items-center justify-center overflow-hidden shrink-0 shadow-lg shadow-sky-500/10 transition duration-300 cursor-pointer relative">
                <img src="${initiativeLeadData.foto}" alt="${initiativeLeadData.nama}" 
                    onerror="this.onerror=null; this.parentElement.innerHTML='<div class=&quot;w-full h-full bg-slate-900 flex items-center justify-center text-sky-400 font-mono text-xl font-bold border border-slate-800&quot;>${initials}</div>';" 
                    class="w-full h-full object-cover rounded-xl group-hover:scale-105 transition-transform duration-300">
            </div>

            <div class="space-y-2 text-center sm:text-left flex-1 min-w-0">
                <h3 class="text-white text-base sm:text-lg font-bold font-sans tracking-tight leading-snug break-words">
                    ${initiativeLeadData.nama}
                </h3>
                <p class="text-xs font-mono text-sky-400/90 font-medium tracking-wide">
                    NIM / NIP: ${initiativeLeadData.nim}
                </p>
                <span class="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-slate-950 border border-slate-800 text-slate-300 text-[10px] font-bold">
                    <span class="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                    📍 ${initiativeLeadData.lokasi}
                </span>
            </div>
        </div>

        <!-- KODE BIODATA PYTHON -->
        <div class="bg-slate-950/90 p-3.5 rounded-xl border border-slate-800/90 space-y-1 text-emerald-400 font-mono relative overflow-hidden shadow-inner">
            <div class="absolute top-0 right-0 px-2 py-0.5 bg-slate-900 text-[9px] text-slate-500 border-b border-l border-slate-800 rounded-bl">py</div>
            <p class="truncate"><span class="text-sky-400">nama</span> = <span class="text-slate-200">"${initiativeLeadData.nama}"</span></p>
            <p class="truncate"><span class="text-sky-400">nim</span> = <span class="text-slate-200">"${initiativeLeadData.nim}"</span></p>
            <p class="truncate"><span class="text-sky-400">tanggal_lahir</span> = <span class="text-slate-200">"${initiativeLeadData.tanggal_lahir}"</span></p>
            <p class="truncate"><span class="text-sky-400">asal_kota</span> = <span class="text-slate-200">"${initiativeLeadData.asal_kota}"</span></p>
        </div>

        <!-- FOOTER SOSMED -->
        <div class="flex items-center justify-between gap-3 pt-3 border-t border-slate-800/80">
            <div class="flex items-center gap-4 text-slate-400">
                ${initiativeLeadData.instagram ? `
                <a href="${initiativeLeadData.instagram}" target="_blank" rel="noopener noreferrer" class="hover:text-pink-400 flex items-center gap-1.5 transition-colors" title="Instagram">
                    <svg class="w-4 h-4 fill-current text-pink-500" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
                    <span>Instagram</span>
                </a>` : ''}
                ${initiativeLeadData.linkedin ? `
                <a href="${initiativeLeadData.linkedin}" target="_blank" rel="noopener noreferrer" class="hover:text-sky-400 flex items-center gap-1.5 transition-colors" title="LinkedIn">
                    <svg class="w-4 h-4 fill-current text-sky-400" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>
                    <span>LinkedIn</span>
                </a>` : ''}
            </div>
        </div>

    </div>
  `;

  if (window.lucide) lucide.createIcons();
}

// FILTER ANGGOTA KELOMPOK BERDASARKAN KOTA
function filterTeam(category) {
  document.querySelectorAll('.team-filter-btn').forEach(btn => {
    btn.classList.remove('bg-sky-500', 'text-slate-950', 'font-bold');
    btn.classList.add('text-slate-400', 'hover:text-white');
  });

  const activeBtn = document.getElementById('filter-' + category);
  if (activeBtn) {
    activeBtn.classList.remove('text-slate-400');
    activeBtn.classList.add('bg-sky-500', 'text-slate-950', 'font-bold');
  }

  renderMembers(category);
}

// RENDER CAROUSEL DOKUMENTASI
function updateGalleryShowcase() {
  if (typeof galleryData === 'undefined' || galleryData.length === 0) return;
  const item = galleryData[currentGalleryIndex];
  if (!item) return;

  const bgImg = document.getElementById('carousel-bg-image');
  const title = document.getElementById('carousel-title');
  const desc = document.getElementById('carousel-desc');
  const counter = document.getElementById('gallery-counter');
  const zoomBtn = document.getElementById('carousel-zoom-btn');
  const thumbsBar = document.getElementById('carousel-thumbnails-bar');

  if (bgImg) {
    bgImg.src = item.foto;
    bgImg.onerror = function() {
      this.onerror = null;
      this.src = 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=800&q=80';
    };
  }

  if (title) title.textContent = item.judul;
  if (desc) desc.textContent = item.deskripsi;
  if (counter) counter.textContent = `Slide ${currentGalleryIndex + 1} / ${galleryData.length}`;

  if (zoomBtn) {
    zoomBtn.onclick = () => openImageModal(item.foto, item.judul, item.deskripsi);
  }

  if (thumbsBar) {
    thumbsBar.innerHTML = galleryData.map((g, idx) => `
      <button onclick="setGallerySlide(${idx})" 
              aria-label="View slide ${idx + 1}"
              class="w-12 h-9 rounded-lg overflow-hidden border-2 transition ${idx === currentGalleryIndex ? 'border-amber-400 scale-105' : 'border-slate-800 opacity-60 hover:opacity-100'}">
        <img src="${g.foto}" onerror="this.onerror=null; this.src='https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=800&q=80';" class="w-full h-full object-cover">
      </button>
    `).join('');
  }

  if (window.lucide) lucide.createIcons();
}

function nextGallerySlide() {
  if (typeof galleryData === 'undefined' || galleryData.length === 0) return;
  currentGalleryIndex = (currentGalleryIndex + 1) % galleryData.length;
  updateGalleryShowcase();
}

function prevGallerySlide() {
  if (typeof galleryData === 'undefined' || galleryData.length === 0) return;
  currentGalleryIndex = (currentGalleryIndex - 1 + galleryData.length) % galleryData.length;
  updateGalleryShowcase();
}

function setGallerySlide(idx) {
  currentGalleryIndex = idx;
  updateGalleryShowcase();
}

// MODAL PREVIEW ATS CV (OPTIMIZED FOR MOBILE & DESKTOP)
function openCvModal(pdfUrl, nama) {
  const modal = document.getElementById('cv-modal');
  const iframe = document.getElementById('cv-iframe');
  const title = document.getElementById('cv-modal-title');

  if (modal && iframe) {
    const fullPdfUrl = new URL(pdfUrl, window.location.href).href;

    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

    if (isMobile && !window.location.hostname.includes('localhost') && !window.location.hostname.includes('127.0.0.1')) {
      iframe.src = `https://docs.google.com/gview?embedded=true&url=${encodeURIComponent(fullPdfUrl)}`;
    } else {
      iframe.src = pdfUrl;
    }

    if (title) title.innerHTML = `<i data-lucide="file-text" class="w-4 h-4"></i> ATS CV Preview — ${nama}`;
    modal.classList.remove('hidden');
    if (window.lucide) lucide.createIcons();
  }
}

function closeCvModal() {
  const modal = document.getElementById('cv-modal');
  const iframe = document.getElementById('cv-iframe');
  if (modal && iframe) {
    iframe.src = '';
    modal.classList.add('hidden');
  }
}

// MODAL LIGHTBOX FOTO DOKUMENTASI / FOTO PROFIL
function openImageModal(fotoUrl, judul, deskripsi) {
  const modal = document.getElementById('image-modal');
  const img = document.getElementById('image-modal-src');
  const title = document.getElementById('image-modal-title');
  const desc = document.getElementById('image-modal-desc');

  if (modal && img) {
    img.src = fotoUrl;
    img.onerror = function() {
      this.onerror = null;
      this.src = 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=800&q=80';
    };
    if (title) title.innerHTML = `<i data-lucide="image" class="w-4 h-4"></i> ${judul}`;
    if (desc) desc.textContent = deskripsi;
    modal.classList.remove('hidden');
    if (window.lucide) lucide.createIcons();
  }
}

function closeImageModal() {
  const modal = document.getElementById('image-modal');
  const img = document.getElementById('image-modal-src');
  if (modal && img) {
    img.src = '';
    modal.classList.add('hidden');
  }
}

// HELPER MODALS & NAV TOGGLES
function openAboutModal() { document.getElementById('about-modal')?.classList.remove('hidden'); }
function closeAboutModal() { document.getElementById('about-modal')?.classList.add('hidden'); }

function toggleMobileMenu() {
  const menu = document.getElementById('mobile-menu');
  if (menu) menu.classList.toggle('hidden');
}

function handleContactSubmit(e) {
  e.preventDefault();
  alert('Transmission sent successfully to Proxy Python Node!');
  closeContactModal();
}

// INITIALIZE APP ON DOM LOAD
document.addEventListener('DOMContentLoaded', () => {
  renderInitiativeLead();
  renderFilterButtons();
  renderMembers('all');
  updateGalleryShowcase();

  const mobileBtn = document.getElementById('mobile-menu-btn');
  if (mobileBtn) {
    mobileBtn.addEventListener('click', toggleMobileMenu);
  }
});