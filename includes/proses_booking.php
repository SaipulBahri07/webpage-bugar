<?php
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    
    // 1. KONEKSI DATABASE
    $host     = "localhost";
    $user     = "root";
    $password = "";
    $db       = "page-bugar"; 

    $koneksi = mysqli_connect($host, $user, $password, $db);

    if (!$koneksi) {
        die("Koneksi Database Gagal: " . mysqli_connect_error());
    }

    // 2. TANGKAP DATA DARI FORM
    $nama      = mysqli_real_escape_string($koneksi, $_POST['nama']);
    $telepon   = mysqli_real_escape_string($koneksi, $_POST['telepon']); 
    $cabang    = mysqli_real_escape_string($koneksi, $_POST['cabang']);
    $tipe      = mysqli_real_escape_string($koneksi, $_POST['tipe_kunjungan']);
    $layanan   = mysqli_real_escape_string($koneksi, $_POST['layanan']);
    $alamat    = isset($_POST['alamat']) ? mysqli_real_escape_string($koneksi, $_POST['alamat']) : '-';
    $tanggal   = mysqli_real_escape_string($koneksi, $_POST['tanggal']);
    $waktu     = mysqli_real_escape_string($koneksi, $_POST['waktu']);
    $catatan   = isset($_POST['catatan']) ? mysqli_real_escape_string($koneksi, $_POST['catatan']) : '-';

    $jadwal_booking = $tanggal . " Pukul " . $waktu;

    // 3. SIMPAN KE DATABASE
    $sql_insert = "INSERT INTO booking (nama, no_wa, cabang, layanan, tanggal, alamat, tipe_kunjungan, catatan) 
                   VALUES ('$nama', '$telepon', '$cabang', '$layanan', '$jadwal_booking', '$alamat', '$tipe', '$catatan')";
    
    mysqli_query($koneksi, $sql_insert);

    // 4. KIRIM EMAIL MENGGUNAKAN API BREVO
    $api_key      = getenv('BREVO_API_KEY') ?: "YOUR_BREVO_API_KEY_HERE"; // <-- GANTI DENGAN API KEY BREVO KAMU
    $email_pusat  = "saipulbinudin07@gmail.com"; // <-- GANTI DENGAN EMAIL PENERIMA (PUSAT)
    $subjek_email = "[PENTING] Booking Baru - Cabang " . $cabang;
    
    $pesan_email  = "Halo Tim Pusat,\n\n";
    $pesan_email .= "Telah masuk pesanan booking baru dari form website:\n\n";
    $pesan_email .= "Nama         : $nama\n";
    $pesan_email .= "No Telp/WA   : $telepon\n";
    $pesan_email .= "Cabang       : $cabang\n";
    $pesan_email .= "Tipe Layanan : $tipe\n";
    $pesan_email .= "Layanan      : $layanan\n";
    $pesan_email .= "Jadwal       : $jadwal_booking\n";
    $pesan_email .= "Alamat/Hotel : $alamat\n";
    $pesan_email .= "Catatan      : $catatan\n\n";
    $pesan_email .= "Data ini juga telah otomatis tersimpan di dalam database MySQL.";

    // Format Data untuk API Brevo
    $data = array(
        "sender" => array(
            "name" => "Sistem Bugar Refleksi",
            "email" => "yusuf030106@gmail.com" // Email pengirim (usahakan pakai domain resmi website)
        ),
        "to" => array(
            array(
                "email" => $email_pusat,
                "name" => "Tim Manajemen Pusat"
            )
        ),
        "subject" => $subjek_email,
        "textContent" => $pesan_email
    );

    // Proses cURL untuk menembak API Brevo
    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, "https://api.brevo.com/v3/smtp/email");
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_POST, true);
    curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($data));
    curl_setopt($ch, CURLOPT_HTTPHEADER, array(
        "accept: application/json",
        "api-key: " . $api_key,
        "content-type: application/json"
    ));
    
    $response = curl_exec($ch);
    curl_close($ch);

    // Tutup koneksi Database
    mysqli_close($koneksi);

    // Mengembalikan status ke JavaScript
    echo "Proses Database & Email Brevo Berhasil";
} else {
    echo "Metode Tidak Diizinkan";
}
?>