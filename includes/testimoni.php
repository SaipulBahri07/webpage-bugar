<?php
// Koneksi Database (Pastikan sesuai dengan pengaturan Anda)
$host = "localhost"; $user = "root"; $pass = ""; $db = "page-bugar";
$conn = mysqli_connect($host, $user, $pass, $db);

// Proses Simpan Testimoni
if (isset($_POST['kirim_testi'])) {
    $nama = mysqli_real_escape_string($conn, $_POST['nama']);
    $rating = (int)$_POST['rating'];
    $deskripsi = mysqli_real_escape_string($conn, $_POST['deskripsi']);
    $foto_name = "";

    if (isset($_FILES['foto']['name']) && $_FILES['foto']['name'] != "") {
        $fileName = time() . '_' . basename($_FILES['foto']['name']);
        $targetFilePath = "assets/uploads/" . $fileName;
        if (move_uploaded_file($_FILES["foto"]["tmp_name"], $targetFilePath)) {
            $foto_name = $fileName;
        }
    }

    $query = "INSERT INTO testimoni (nama, rating, deskripsi, foto) VALUES ('$nama', '$rating', '$deskripsi', '$foto_name')";
    if(mysqli_query($conn, $query)) {
        echo "<script>alert('Ulasan berhasil dikirim!'); window.location.href='index.php#testimoni';</script>";
    }
}
?>

<section class="testimonials" id="testimoni">
    <div class="section-header animate">
        <h2 class="section-title">Apa Kata Mereka?</h2>
        <p class="section-subtitle">Ulasan jujur dari pelanggan setia kami</p>
    </div>

    <div class="slider-container animate">
        <div class="testimonial-wrapper" id="testimonialWrapper">
            <?php
            $get_testi = mysqli_query($conn, "SELECT * FROM testimoni ORDER BY rating DESC, id DESC");
            if (mysqli_num_rows($get_testi) > 0) {
                while ($row = mysqli_fetch_assoc($get_testi)) {
                    $bintang = str_repeat('⭐', $row['rating']);
                    echo "<div class='testi-slide'>";
                    echo "  <div class='testi-card-modern'>";
        
                    echo "    <div class='testi-rating'>{$bintang}</div>";
                    echo "    <p class='testi-desc'>\"{$row['deskripsi']}\"</p>";
                    echo "    <h4 class='testi-name'>{$row['nama']}</h4>";
                    echo "  </div>";
                    echo "</div>";
                }
            }
            ?>
        </div>
    </div>

    <div style="text-align: center; margin-top: 3rem;">
        <button class="btn-open-modal" onclick="toggleModal(true)">Tulis Ulasan Anda ✍️</button>
    </div>

    <div class="modal-overlay" id="modalReview">
        <div class="modal-content">
            <span class="close-modal" onclick="toggleModal(false)">&times;</span>
            <h3>Berikan Penilaian</h3>
            <form action="#testimoni" method="POST" enctype="multipart/form-data">
                <div class="star-rating-box">
                    <input type="radio" name="rating" value="5" id="s5" required><label for="s5">★</label>
                    <input type="radio" name="rating" value="4" id="s4"><label for="s4">★</label>
                    <input type="radio" name="rating" value="3" id="s3"><label for="s3">★</label>
                    <input type="radio" name="rating" value="2" id="s2"><label for="s2">★</label>
                    <input type="radio" name="rating" value="1" id="s1"><label for="s1">★</label>
                </div>
                <input type="text" name="nama" placeholder="Nama Lengkap" required class="modal-input">
                <textarea name="deskripsi" placeholder="Ceritakan pengalaman Anda..." rows="4" required class="modal-input"></textarea>
               
                <button type="submit" name="kirim_testi" class="modal-submit">Kirim Sekarang</button>
            </form>
        </div>
    </div>
</section>