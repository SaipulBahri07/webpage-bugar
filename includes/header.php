<div class="loading-screen" id="loaderUtama">
    <img src="BUGAR REFLEKSII.png" height="180" alt="Loading Image" onerror="this.style.display='none'">
    <div class="spinner"></div>
</div>

<script>
    function hilangkanLoader() {
        var loader = document.getElementById('loaderUtama');
        if (loader) {
            loader.style.opacity = '0';
            loader.style.visibility = 'hidden';
            loader.style.pointerEvents = 'none'; // Memastikan layar bisa diklik setelah hilang
            loader.style.transition = 'all 0.5s ease';
        }
    }

    // Cara 1: Hilang otomatis setelah seluruh halaman & gambar selesai dimuat
    window.addEventListener('load', function() {
        hilangkanLoader();
    });

    // Cara 2: PENGAMAN (Failsafe). Jika sinyal lambat atau ada error, paksa hilang dalam 2 detik!
    setTimeout(function() {
        hilangkanLoader();
    }, 2000);
</script>

<nav class="navbar">
    <div class="nav-container">
        <a href="#home" class="logo">
            <img src="BUGAR REFLEKSII.png" alt="Logo" height="60" onerror="this.style.display='none'">
        </a>
        <ul class="nav-links">
            <li><a href="#home">Beranda</a></li>
            <li><a href="#paket">Paket</a></li>
            <li><a href="#layanan">Layanan</a></li>
            <li><a href="#testimoni">Testimoni</a></li>
            <li><a href="#booking">Booking</a></li>
            <li><a href="#cabang">Cabang</a></li>
            <li><a href="#kontak">Kontak</a></li>
        </ul>
        
        <button id="themeToggle" style="background:none; border:none; font-size:1.6rem; cursor:pointer; margin: 0 15px;">🌙</button>
        
        <button class="mobile-menu-btn" aria-label="Toggle Menu">
            <span></span>
            <span></span>
            <span></span>
        </button>
    </div>
</nav>

