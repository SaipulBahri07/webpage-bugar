document.addEventListener("DOMContentLoaded", function() {

    // ===== 1. LOADING SCREEN =====
    setTimeout(() => {
        const loader = document.querySelector('.loading-screen');
        if (loader) loader.classList.add('hidden');
    }, 1000);

    // Sistem Pengaman Loading
    setTimeout(() => {
        const loader = document.querySelector('.loading-screen');
        if (loader && !loader.classList.contains('hidden')) {
            loader.classList.add('hidden');
        }
    }, 3000);

    // ===== 2. DARK MODE TOGGLE =====
    const themeToggle = document.getElementById('themeToggle');
    const currentTheme = localStorage.getItem('theme');

    if (currentTheme === 'dark') {
        document.documentElement.setAttribute('data-theme', 'dark');
        if(themeToggle) themeToggle.textContent = '☀️';
    }

    if(themeToggle) {
        themeToggle.addEventListener('click', () => {
            let theme = document.documentElement.getAttribute('data-theme');
            if (theme === 'dark') {
                document.documentElement.removeAttribute('data-theme');
                localStorage.setItem('theme', 'light');
                themeToggle.textContent = '🌙';
            } else {
                document.documentElement.setAttribute('data-theme', 'dark');
                localStorage.setItem('theme', 'dark');
                themeToggle.textContent = '☀️';
            }
        });
    }

    // ===== 3. MOBILE MENU (DIJAMIN BISA DIKLIK) =====
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const navLinks = document.querySelector('.nav-links');

    if (mobileMenuBtn && navLinks) {
        mobileMenuBtn.addEventListener('click', function() {
            this.classList.toggle('active');
            navLinks.classList.toggle('active');
        });

        // Tutup menu otomatis jika salah satu link diklik
        const links = navLinks.querySelectorAll('a');
        links.forEach(link => {
            link.addEventListener('click', function() {
                mobileMenuBtn.classList.remove('active');
                navLinks.classList.remove('active');
            });
        });
    }

    // ===== 4. FILTER PAKET & HARGA (PERBAIKAN MOBILE) =====
    const toggleButtons = document.querySelectorAll('.toggle-btn');
    const contentPanels = {
        'paket': document.getElementById('paket-content'),
        'non-paket': document.getElementById('non-paket-content'),
        'panggilan': document.getElementById('panggilan-content')
    };

    // Pastikan saat awal, non-paket & panggilan disembunyikan
    if(contentPanels['non-paket']) contentPanels['non-paket'].classList.add('hidden-panel');
    if(contentPanels['panggilan']) contentPanels['panggilan'].classList.add('hidden-panel');

    toggleButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Hapus class active dari tombol lain
            toggleButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');

            const targetType = this.getAttribute('data-type');

            // Sembunyikan semua panel
            Object.values(contentPanels).forEach(panel => {
                if (panel) panel.classList.add('hidden-panel');
            });

            // Tampilkan panel yang dipilih
            if (contentPanels[targetType]) {
                contentPanels[targetType].classList.remove('hidden-panel');
            }
        });
    });

    // ===== 5. SCROLL EVENT & NAVBAR =====
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });

    let lastScrollTop = 0;
    window.addEventListener('scroll', () => {
        const navbar = document.querySelector('.navbar');
        let scrollTop = window.pageYOffset || document.documentElement.scrollTop;

        if (navbar) {
            if (scrollTop > lastScrollTop && scrollTop > 100) {
                navbar.style.transform = 'translateY(-100%)';
            } else {
                navbar.style.transform = 'translateY(0)';
            }
            if (scrollTop > 100) navbar.style.boxShadow = '0 2px 30px rgba(0, 0, 0, 0.1)';
            else navbar.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.05)';
        }
        lastScrollTop = scrollTop <= 0 ? 0 : scrollTop;

        const scrollTopBtn = document.querySelector('.scroll-top');
        if(scrollTopBtn) {
            if (window.scrollY > 500) scrollTopBtn.classList.add('show');
            else scrollTopBtn.classList.remove('show');
        }
    });

    // ===== 6. FAQ ACCORDION =====
    document.querySelectorAll('.faq-question').forEach(q => {
        q.addEventListener('click', () => {
            const item = q.parentElement;
            const isActive = item.classList.contains('active');
            document.querySelectorAll('.faq-item').forEach(i => i.classList.remove('active'));
            if (!isActive) item.classList.add('active');
        });
    });

    // ===== 7. ANIMASI SCROLL (OBSERVER) =====
    const observerOptions = { threshold: 0.1, rootMargin: '0px 0px -50px 0px' };
    const scrollObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate');
            }
        });
    }, observerOptions);

    document.querySelectorAll('.section-header, .feature-card, .price-card, .service-card, .gallery-item, .branch-card, .faq-item').forEach((el, index) => {
        if(!el.classList.contains('section-header')) {
            el.style.transitionDelay = `${(index % 3) * 0.1}s`;
        }
        scrollObserver.observe(el);
    });

}); // End of DOMContentLoaded

// ===== 8. FUNGSI GLOBAL (DILUAR DOMContentLoaded) =====

// Fungsi Helper Booking
window.selectService = function(serviceName, locationType) {
    const layananEl = document.getElementById('bf_layanan');
    const tipeEl = document.getElementById('bf_tipe');
    
    if(tipeEl) {
        if (locationType.includes('Rumah')) tipeEl.value = 'Home Care';
        else if (locationType.includes('Hotel')) tipeEl.value = 'Hotel Visit';
        else tipeEl.value = 'Outlet';
        if(typeof onTipeChange === "function") onTipeChange();
    }
    
    if(layananEl) {
        const options = layananEl.options;
        for(let i=0; i<options.length; i++) {
            if(options[i].text.includes(serviceName) || options[i].value.includes(serviceName)) {
                layananEl.selectedIndex = i;
                break;
            }
        }
    }
};

// Logika Slider Testimoni
let currentSlide = 0;
window.moveSlide = function(direction) {
    const wrapper = document.getElementById('testimonialWrapper');
    const slides = document.querySelectorAll('.testi-slide');
    if (!wrapper || slides.length === 0) return;

    currentSlide += direction;
    if (currentSlide >= slides.length) currentSlide = 0;
    if (currentSlide < 0) currentSlide = slides.length - 1;

    wrapper.style.transform = `translateX(-${currentSlide * 100}%)`;
};
setInterval(() => { if(document.getElementById('testimonialWrapper')) moveSlide(1); }, 5000);

// Logika Modal Ulasan
window.toggleModal = function(show) {
    const modal = document.getElementById('modalReview');
    if (modal) {
        modal.style.display = show ? 'flex' : 'none';
        document.body.style.overflow = show ? 'hidden' : 'auto';
    }
};

window.onclick = function(event) {
    const modal = document.getElementById('modalReview');
    if (event.target == modal) {
        toggleModal(false);
    }
};

// Preview Foto Testimoni
window.previewFile = function() {
    const fileInput = document.getElementById('foto');
    const previewImg = document.getElementById('imagePreview');
    const uploadContent = document.getElementById('uploadContent');
    const removeBtn = document.getElementById('removeImageBtn');
    
    if (fileInput && fileInput.files[0]) {
        const reader = new FileReader();
        reader.onload = function(e) {
            previewImg.src = e.target.result;
            previewImg.style.display = 'block'; 
            removeBtn.style.display = 'flex'; 
            uploadContent.style.display = 'none'; 
        }
        reader.readAsDataURL(fileInput.files[0]);
    }
};

// Cancel/Hapus Foto Testimoni
window.removeImage = function(event) {
    event.preventDefault(); 
    event.stopPropagation(); 

    const fileInput = document.getElementById('foto');
    const previewImg = document.getElementById('imagePreview');
    const uploadContent = document.getElementById('uploadContent');
    const removeBtn = document.getElementById('removeImageBtn');

    if(fileInput) fileInput.value = ''; 
    if(previewImg) {
        previewImg.src = '';
        previewImg.style.display = 'none'; 
    }
    if(removeBtn) removeBtn.style.display = 'none'; 
    if(uploadContent) uploadContent.style.display = 'flex'; 
};
// Fungsi untuk memproses booking
function prosesBooking(event) {
    // Mencegah halaman refresh
    event.preventDefault(); 

    // Mengambil data dari form
    const form = document.getElementById('formBooking');
    const formData = new FormData(form);

    const nama = formData.get('nama');
    const layanan = formData.get('layanan');
    const tanggal = formData.get('tanggal');
    const cabang = formData.get('cabang');

    // 1. Eksekusi pengiriman ke database dan email secara diam-diam (Background)
    fetch('includes/proses_booking.php', {
        method: 'POST',
        body: formData
    }).then(response => {
        console.log("Data sedang diproses di server...");
    }).catch(error => {
        console.error("Terjadi kesalahan:", error);
    });

    // 2. Susun pesan untuk WhatsApp
    const pesan_wa = `Halo Bugar Refleksi Cabang ${cabang}, saya ingin konfirmasi booking:\n\nNama: ${nama}\nLayanan: ${layanan}\nTanggal: ${tanggal}\n\nTerima kasih.`;
    
    // Ganti dengan nomor WhatsApp penerima (Pusat/Cabang)
    const nomor_admin_wa = "6281234567890"; 
    
    const url_wa = `https://api.whatsapp.com/send?phone=${nomor_admin_wa}&text=${encodeURIComponent(pesan_wa)}`;

    // 3. Langsung lempar pelanggan ke WhatsApp seketika (Instan)
    window.location.href = url_wa;
}