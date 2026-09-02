// ==================================================
// DATA GLOBAL
// ==================================================
let daftarSuratMasuk = [];
let nomorPengajuanTerakhir = null;
let peranAktif = null;
let dataForm = {};

// ==================================================
// NAVIGASI HALAMAN
// ==================================================
const navLinks = document.querySelectorAll('[data-page]');
const gotoLinks = document.querySelectorAll('[data-goto]');
const pages = document.querySelectorAll('.page-content');

function tampilkanHalaman(nama) {
    pages.forEach(p => p.classList.add('hidden'));
    const halaman = document.getElementById(`page-${nama}`);
    if (halaman) halaman.classList.remove('hidden');
    navLinks.forEach(l => {
        l.classList.toggle('active', l.dataset.page === nama);
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Navigasi menu utama
navLinks.forEach(link => {
    link.addEventListener('click', e => {
        e.preventDefault();
        tampilkanHalaman(link.dataset.page);
        document.getElementById('mobileMenu').classList.add('hidden');
    });
});

// Tombol lompat halaman
gotoLinks.forEach(link => {
    link.addEventListener('click', e => {
        e.preventDefault();
        tampilkanHalaman(link.dataset.goto);
    });
});

// Tombol menu mobile
document.getElementById('menuToggle').addEventListener('click', () => {
    document.getElementById('mobileMenu').classList.toggle('hidden');
});

// ==================================================
// MASUK SEBAGAI WARGA / PENGURUS
// ==================================================
function masukSebagai(peran) {
    peranAktif = peran;
    // Sembunyikan/tampil tombol masuk
    document.getElementById('btnMasukWarga').classList.add('hidden');
    document.getElementById('btnMasukPengurus').classList.add('hidden');
    document.getElementById('btnKeluar').classList.remove('hidden');
    document.getElementById('btnMasukWargaMobile').classList.add('hidden');
    document.getElementById('btnMasukPengurusMobile').classList.add('hidden');
    document.getElementById('btnKeluarMobile').classList.remove('hidden');

    if (peran === 'pengurus') {
        document.getElementById('menuVerifikasi').style.display = 'block';
        document.getElementById('menuVerifikasiMobile').style.display = 'block';
        tampilkanHalaman('verifikasi');
        alert('✅ Masuk sebagai Pengurus RT/RW berhasil!\n\nAnda dapat memverifikasi surat & membuat PDF dengan Tanda Tangan Elektronik.');
    } else {
        document.getElementById('menuVerifikasi').style.display = 'none';
        document.getElementById('menuVerifikasiMobile').style.display = 'none';
        alert('✅ Masuk sebagai Warga berhasil!\n\nSilakan ajukan surat.');
    }
}

function keluar() {
    peranAktif = null;
    document.getElementById('btnMasukWarga').classList.remove('hidden');
    document.getElementById('btnMasukPengurus').classList.remove('hidden');
    document.getElementById('btnKeluar').classList.add('hidden');
    document.getElementById('btnMasukWargaMobile').classList.remove('hidden');
    document.getElementById('btnMasukPengurusMobile').classList.remove('hidden');
    document.getElementById('btnKeluarMobile').classList.add('hidden');
    document.getElementById('menuVerifikasi').style.display = 'none';
    document.getElementById('menuVerifikasiMobile').style.display = 'none';
    tampilkanHalaman('beranda');
    alert('✅ Berhasil keluar dari sistem SiLAWA.');
}

// Ikat tombol Masuk/Keluar
document.getElementById('btnMasukWarga').onclick = () => masukSebagai('warga');
document.getElementById('btnMasukPengurus').onclick = () => masukSebagai('pengurus');
document.getElementById('btnKeluar').onclick = keluar;
document.getElementById('btnMasukWargaMobile').onclick = () => { masukSebagai('warga'); document.getElementById('mobileMenu').classList.add('hidden'); };
document.getElementById('btnMasukPengurusMobile').onclick = () => { masukSebagai('pengurus'); document.getElementById('mobileMenu').classList.add('hidden'); };
document.getElementById('btnKeluarMobile').onclick = () => { keluar(); document.getElementById('mobileMenu').classList.add('hidden'); };

// ==================================================
// PREVIEW NAMA FILE UPLOAD
// ==================================================
function setupFilePreview(fileId, previewId) {
    const fileInput = document.getElementById(fileId);
    const previewDiv = document.getElementById(previewId);
    if (!fileInput || !previewDiv) return;

    fileInput.addEventListener('change', () => {
        if (fileInput.files && fileInput.files[0]) {
            const nama = fileInput.files[0].name;
            const ukuran = (fileInput.files[0].size / 1024 / 1024).toFixed(2);
            previewDiv.innerHTML = `<i class="fa fa-check-circle text-green-600 text-xl mb-1"></i><p class="text-green-600 font-medium text-sm">${nama}</p><p class="text-xs text-gray-500">${ukuran} MB</p>`;
        } else {
            previewDiv.innerHTML = `<i class="fa
