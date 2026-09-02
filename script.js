let daftarSurat = [];
let nomorUrutan = 1;
let peranAktif = null;

// NAVIGASI
document.querySelectorAll('[data-page]').forEach(link => {
    link.addEventListener('click', e => {
        e.preventDefault();
        document.querySelectorAll('[data-page]').forEach(l => l.classList.remove('active'));
        link.classList.add('active');
        const halaman = link.dataset.page;
        document.querySelectorAll('.page-content').forEach(p => p.classList.add('hidden'));
        const konten = document.getElementById(`page-${halaman}`);
        if (konten) konten.classList.remove('hidden');
        document.getElementById('mobileMenu').classList.add('hidden');
    });
});
document.querySelectorAll('[data-goto]').forEach(link => {
    link.addEventListener('click', e => {
        e.preventDefault();
        document.querySelectorAll('[data-page]').forEach(l => l.classList.remove('active'));
        document.querySelector(`[data-page="${link.dataset.goto}"]`)?.classList.add('active');
        document.querySelectorAll('.page-content').forEach(p => p.classList.add('hidden'));
        document.getElementById(`page-${link.dataset.goto}`)?.classList.remove('hidden');
    });
});
document.getElementById('menuToggle').addEventListener('click', () => {
    document.getElementById('mobileMenu').classList.toggle('hidden');
});

// MASUK / KELUAR
function masukPengurus() {
    peranAktif = 'pengurus';
    document.getElementById('menuVerifikasi').style.display = 'block';
    document.getElementById('menuVerifikasiMobile').style.display = 'block';
    document.getElementById('btnMasukWarga').classList.add('hidden');
    document.getElementById('btnMasukPengurus').classList.add('hidden');
    document.getElementById('btnKeluar').classList.remove('hidden');
    document.getElementById('btnMasukWargaMobile').classList.add('hidden');
    document.getElementById('btnMasukPengurusMobile').classList.add('hidden');
    document.getElementById('btnKeluarMobile').classList.remove('hidden');
    alert('✅ Masuk sebagai Pengurus berhasil!');
}
function masukWarga() {
    peranAktif = 'warga';
    document.getElementById('menuVerifikasi').style.display = 'none';
    document.getElementById('menuVerifikasiMobile').style.display = 'none';
    document.getElementById('btnMasukWarga').classList.add('hidden');
    document.getElementById('btnMasukPengurus').classList.add('hidden');
    document.getElementById('btnKeluar').classList.remove('hidden');
    document.getElementById('btnMasukWargaMobile').classList.add('hidden');
    document.getElementById('btnMasukPengurusMobile').classList.add('hidden');
    document.getElementById('btnKeluarMobile').classList.remove('hidden');
    alert('✅ Masuk sebagai Warga berhasil!');
}
function keluar() {
    peranAktif = null;
    document.getElementById('menuVerifikasi').style.display = 'none';
    document.getElementById('menuVerifikasiMobile').style.display = 'none';
    document.getElementById('btnMasukWarga').classList.remove('hidden');
    document.getElementById('btnMasukPengurus').classList.remove('hidden');
    document.getElementById('btnKeluar').classList.add('hidden');
    document.getElementById('btnMasukWargaMobile').classList.remove('hidden');
    document.getElementById('btnMasukPengurusMobile').classList.remove('hidden');
    document.getElementById('btnKeluarMobile').classList.add('hidden');
    alert('✅ Berhasil Keluar');
}
document.getElementById('btnMasukWarga').onclick = masukWarga;
document.getElementById('btnMasukPengurus').onclick = masukPengurus;
document.getElementById('btnKeluar').onclick = keluar;
document.getElementById('btnMasukWargaMobile').onclick = masukWarga;
document.getElementById('btnMasukPengurusMobile').onclick = masukPengurus;
document.getElementById('btnKeluarMobile').onclick = keluar;

// PREVIEW NAMA FILE
function pasangPreview(idInput, idPreview) {
    const input = document.getElementById(idInput);
    const preview = document.getElementById(idPreview);
    if (!input || !preview) return;
    input.addEventListener('change', () => {
        if (input.files[0]) {
            preview.innerHTML = `<i class="fa fa-check-circle text-green-500 text-xl mb-1"></i><p class="text-green-600 text-sm">${input.files[0].name}</p>`;
        } else {
            preview.innerHTML = `<i class="fa fa-cloud-upload text-2xl text-gray-400 mb-1"></i><p>Klik pilih file</p>`;
        }
    });
}
pasangPreview('fileKtp', 'previewKtp');
pasangPreview('fileKk', 'previewKk');
pasangPreview('fileLain', 'previewLain');

// LANGKAH FORMULIR
function tampilLangkah(no) {
    for (let i=1; i<=5; i++) {
        const el = document.getElementById(`langkah-${i}`);
        if (el) {
            if (i < no) { el.className = 'w-9 h-9 rounded-full flex items-center justify-center mx-auto mb-1 bg-green-600 text-white text-sm'; }
            else if (i === no) { el.className = 'w-9 h-9 rounded-full flex items-center justify-center mx-auto mb-1 bg-blue-600 text-white text-sm'; }
            else { el.className = 'w-9 h-9 rounded-full flex items-center justify-center mx-auto mb-1 bg-gray-200 text-gray-500 text-sm'; }
        }
    }
    document.getElementById('bagian-wilayah').classList.toggle('hidden', no!==1);
    document.getElementById('bagian-surat').classList.toggle('hidden', no!==2);
    document.getElementById('bagian-data').classList.toggle('hidden', no!==3);
    document.getElementById('bagian-unggah').classList.toggle('hidden', no!==4);
    document.getElementById('bagian-kirim').classList.toggle('hidden', no!==5);
}
tampilLangkah(1);

document.getElementById('btnLanjut1').onclick = () => {
    const p = document.getElementById('provinsi').value;
    const k = document.getElementById('kabupaten').value;
    const kec = document.getElementById('kecamatan').value;
    const kel = document.getElementById('kelurahan').value;
    const rw = document.getElementById('rw').value;
    const rt = document.getElementById('rt').value;
    const al = document.getElementById('alamat').value;
    if (!p||!k||!kec||!kel||!rw||!rt||!al) { alert('Lengkapi data wilayah!'); return; }
    tampilLangkah(2);
};
document.getElementById('btnKembali1').onclick = () => tampilLangkah(1);

document.getElementById('btnLanjut2').onclick = () => {
    if (!document.getElementById('jenisSurat').value) { alert('Pilih jenis surat!'); return; }
    tampilLangkah(3);
};
document.getElementById('btnKembali2').onclick = () => tampilLangkah(2);

document.getElementById('btnLanjut3').onclick = () => {
    const nik = document.getElementById('nik').value;
    if (!document.getElementById('nama').value || nik.length!==16) { alert('Nama wajib diisi & NIK harus 16 digit!'); return; }
    tampilLangkah(4);
};
document.getElementById('btnKembali3').onclick = () => tampilLangkah(3);

document.getElementById('btnLanjut4').onclick = () => {
    if (!document.getElementById('fileKtp').files[0] || !document.getElementById('fileKk').files[0]) { alert('Unggah KTP & KK!'); return; }
    tampilRingkasan();
    tampilLangkah(5);
};
document.getElementById('btnKembali4').onclick = () => tampilLangkah(4);

function tampilRingkasan() {
    const jenis = document.getElementById('jenisSurat').selectedOptions[0].text;
    document.getElementById('ringkasan').innerHTML = `
        <p><strong>Nomor:</strong> SLW-${String(nomorUrutan).padStart(5,'0')}</p>
        <p><strong>Nama:</strong> ${document.getElementById('nama').value}</p>
        <p><strong>NIK:</strong> ${document.getElementById('nik').value}</p>
        <p><strong>Jenis Surat:</strong> ${jenis}</p>
        <p><strong>Wilayah:</strong> ${document.getElementById('kelurahan').value}, ${document.getElementById('kecamatan').value} — ${document.getElementById('kabupaten').value}</p>
        <p><strong>RW/RT:</strong> ${document.getElementById('rw').value} / ${document.getElementById('rt').value}</p>
    `;
}

// KIRIM FORMULIR
document.getElementById('formSurat').addEventListener('submit', e => {
    e.preventDefault();
    if (!document.getElementById('setuju').checked) { alert('Centang persetujuan!'); return; }
    const nomor = `SLW-${String(nomorUrutan).padStart(5,'0')}`;
    const surat = {
        nomor,
        tanggal: new Date().toLocaleDateString('id-ID', {day:'2-digit',month:'long',year:'numeric'}),
        nama: document.getElementById('nama').value,
        nik: document.getElementById('nik').value,
        tempatLahir: document.getElementById('tempatLahir').value,
        tglLahir: document.getElementById('tglLahir').value,
        jenisKelamin: document.getElementById('jenisKelamin').value,
        agama: document.getElementById('agama').value,
        pekerjaan: document.getElementById('pekerjaan').value || '-',
        alamat: document.getElementById('alamat').value,
        jenisSurat: document.getElementById('jenisSurat').selectedOptions[0].text,
        keperluan: document.getElementById('keperluan').value || '-',
        provinsi: document.getElementById('provinsi').value,
        kabupaten: document.getElementById('kabupaten').value,
        kecamatan: document.getElementById('kecamatan').value,
        kelurahan: document.getElementById('kelurahan').value,
        rw: document.getElementById('rw').value,
        rt: document.getElementById('rt').value,
        status: 'Menunggu'
    };
    daftarSurat.push(surat);
    nomorUrutan++;
    perbaruiDaftarSurat();
    alert(`✅ Pengajuan Berhasil!\n\nNomor: ${nomor}\nSimpan nomor ini untuk cek status.`);
    tampilLangkah(1);
    document.querySelectorAll('.page-content').forEach(p => p.classList.add('hidden'));
    document.getElementById('page-beranda').classList.remove('hidden');
    document.querySelectorAll('[data-page]').forEach(l => l.classList.remove('active'));
    document.querySelector('[data-page="beranda"]').classList.add('active');
    e.target.reset();
});

// DAFTAR SURAT UNTUK PENGURUS
function perbaruiDaftarSurat() {
    const el = document.getElementById('daftarSurat');
    if (daftarSurat.length === 0) {
        el.innerHTML = `<div class="text-center text-gray-500 py-8"><i class="fa
