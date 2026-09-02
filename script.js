let daftarSuratMasuk = [];
let nomorPengajuanTerakhir = null;
let peranAktif = null;
let dataForm = {};

// === NAVIGASI HALAMAN ===
const navLinks = document.querySelectorAll('[data-page]');
const gotoLinks = document.querySelectorAll('[data-goto]');
const pages = document.querySelectorAll('.page-content');

function tampilkanHalaman(nama) {
    pages.forEach(p => p.classList.add('hidden'));
    document.getElementById(`page-${nama}`).classList.remove('hidden');
    navLinks.forEach(l => l.classList.toggle('active', l.dataset.page === nama));
    window.scrollTo({top:0, behavior:'smooth'});
}

navLinks.forEach(l => {
    l.addEventListener('click', e => {
        e.preventDefault();
        tampilkanHalaman(l.dataset.page);
        document.getElementById('mobileMenu').classList.add('hidden');
    });
});
gotoLinks.forEach(l => {
    l.addEventListener('click', e => {
        e.preventDefault();
        tampilkanHalaman(l.dataset.goto);
    });
});
document.getElementById('menuToggle').onclick = () => document.getElementById('mobileMenu').classList.toggle('hidden');

// === MASUK / KELUAR ===
function masukSebagai(peran) {
    peranAktif = peran;
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
        alert('✅ Masuk sebagai Pengurus — SiLAWA siap verifikasi & buat PDF!');
    } else {
        document.getElementById('menuVerifikasi').style.display = 'none';
        alert('✅ Masuk sebagai Warga — Silakan ajukan surat.');
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
    tampilkanHalaman('beranda');
    alert('✅ Berhasil keluar dari SiLAWA.');
}
document.getElementById('btnMasukWarga').onclick = () => masukSebagai('warga');
document.getElementById('btnMasukPengurus').onclick = () => masukSebagai('pengurus');
document.getElementById('btnKeluar').onclick = keluar;
document.getElementById('btnMasukWargaMobile').onclick = () => { masukSebagai('warga'); document.getElementById('mobileMenu').classList.add('hidden'); };
document.getElementById('btnMasukPengurusMobile').onclick = () => { masukSebagai('pengurus'); document.getElementById('mobileMenu').classList.add('hidden'); };
document.getElementById('btnKeluarMobile').onclick = () => { keluar(); document.getElementById('mobileMenu').classList.add('hidden'); };

// === PREVIEW UPLOAD ===
function setupFilePreview(id, prevId) {
    const inp = document.getElementById(id), prev = document.getElementById(prevId);
    inp.onchange = () => {
        if (inp.files[0]) prev.innerHTML = `<i class="fa fa-check-circle text-secondary"></i> ${inp.files[0].name}`;
        else prev.innerHTML = '<i class="fa fa-cloud-upload"></i> Klik pilih file';
    };
}
setupFilePreview('fileKtp','previewKtp');
setupFilePreview('fileKK','previewKK');
document.getElementById('fileLain').onchange = e => {
    document.getElementById('previewLain').innerHTML = e.target.files[0] ? `<i class="fa fa-check-circle text-secondary"></i> ${e.target.files[0].name}` : '<i class="fa fa-paperclip"></i> Pilih jika ada';
};

// === LANGKAH FORMULIR ===
function setLangkah(n) {
    for(let i=1; i<=5; i++) {
        const el = document.getElementById(`langkah-${i}`);
        el.className = 'w-9 h-9 rounded-full flex items-center justify-center mx-auto mb-1 text-sm';
        el.classList.add(i<n ? 'step-done' : i===n ? 'step-active' : 'bg-neutral-200','text-neutral-500');
    }
}
function sembunyiSemua() {
    ['bagian-wilayah','bagian-jenis','bagian-diri','bagian-unggah','bagian-konfirmasi'].forEach(id=>document.getElementById(id).classList.add('hidden'));
}

document.getElementById('btnLanjutWilayah').onclick = () => {
    const f = ['provinsi','kabupaten','kecamatan','kelurahan','rw','rt','alamatLengkap'];
    if(f.some(id=>!document.getElementById(id).value)) return alert('Lengkapi semua data wilayah!');
    sembunyiSemua(); document.getElementById('bagian-jenis').classList.remove('hidden'); setLangkah(2);
};
document.getElementById('btnKembaliJenis').onclick = () => { sembunyiSemua(); document.getElementById('bagian-wilayah').classList.remove('hidden'); setLangkah(1); };
document.getElementById('btnLanjutJenis').onclick = () => {
    if(!document.getElementById('jenisSurat').value) return alert('Pilih jenis surat!');
    sembunyiSemua(); document.getElementById('bagian-diri').classList.remove('hidden'); setLangkah(3);
};
document.getElementById('btnKembaliDiri').onclick = () => { sembunyiSemua(); document.getElementById('bagian-jenis').classList.remove('hidden'); setLangkah(2); };
document.getElementById('btnLanjutDiri').onclick = () => {
    if(!document.getElementById('nik').value || document.getElementById('nik').value.length!==16) return alert('NIK harus 16 digit!');
    sembunyiSemua(); document.getElementById('bagian-unggah').classList.remove('hidden'); setLangkah(4);
};
document.getElementById('btnKembaliUnggah').onclick = () => { sembunyiSemua(); document.getElementById('bagian-diri').classList.remove('hidden'); setLangkah(3); };
document.getElementById('btnLanjutUnggah').onclick = () => {
    if(!document.getElementById('fileKtp').files[0] || !document.getElementById('fileKK').files[0]) return alert('Unggah KTP & KK!');
    dataForm = {
        no: `SURAT-${Date.now()}`,
        prov: document.getElementById('provinsi').value,
        kab: document.getElementById('kabupaten').value,
        kec: document.getElementById('kecamatan').value,
        kel: document.getElementById('kelurahan').value,
        rw: document.getElementById('rw').value,
        rt: document.getElementById('rt').value,
        alamat: document.getElementById('alamatLengkap').value,
        jenis: document.getElementById('jenisSurat').selectedOptions[0].textContent,
        keperluan: document.getElementById('keperluan').value||'-',
        nama: document.getElementById('nama').value,
        nik: document.getElementById('nik').value,
        tl: document.getElementById('tempatLahir').value,
        tgll: document.getElementById('tglLahir').value,
        jk: document.getElementById('jk').value,
        agama: document.getElementById('agama').value,
        pekerjaan: document.getElementById('pekerjaan').value||'-',
        kontak: document.getElementById('kontak').value
    };
    document.getElementById('ringkasanData').innerHTML = `
        <p><strong>No:</strong> ${dataForm.no}</p>
        <p><strong>Wilayah:</strong> ${dataForm.prov} → ${dataForm.kab} → ${dataForm.kec} → ${dataForm.kel} → ${dataForm.rt}/${dataForm.rw}</p>
        <p><strong>Surat:</strong> ${dataForm.jenis}</p>
        <p><strong>Nama:</strong> ${dataForm.nama}</p>
        <p><strong>NIK:</strong> ${dataForm.nik}</p>
    `;
    sembunyiSemua(); document.getElementById('bagian-konfirmasi').classList.remove('hidden'); setLangkah(5);
};
document.getElementById('btnKembaliKonfirmasi').onclick = () => { sembunyiSemua(); document.getElementById('bagian-unggah').classList.remove('hidden'); setLangkah(4); };

// === KIRIM FORM ===
document.getElementById('formSurat').onsubmit = e => {
    e.preventDefault();
    nomorPengajuanTerakhir = dataForm.no;
    daftarSuratMasuk.push({...dataForm, status:'Menunggu Verifikasi', tgl: new Date().toLocaleDateString('id-ID')});
    alert(`✅ PENGAJUAN BERHASIL!\n\n📋 Nomor: ${dataForm.no}\n\nSimpan nomor ini untuk cek status!`);
    e.target.reset(); sembunyiSemua(); document.getElementById('bagian-wilayah').classList.remove('hidden'); setLangkah(1); tampilkanHalaman('beranda');
    renderDaftarSurat();
};

// === BUAT PDF DENGAN TANDA TANGAN ELEKTRONIK ===
function buatPDF(noSurat) {
    const s = daftarSuratMasuk.find(x=>x.no===noSurat);
    if(!s) return alert('Data tidak ditemukan!');
    document.getElementById('pdfNoSurat').textContent = s.no;
    document.getElementById('pdfTanggal').textContent = new Date().toLocaleDateString('id-ID');
    document.getElementById('pdfAlamatWilayah').textContent = `${s.prov} — ${s.kab} — ${s.kec} — ${s.kelurahan||s.kel}`;
    document.getElementById('pdfNama').textContent = s.nama;
    document.getElementById('pdfNIK').textContent = s.nik;
    document.getElementById('pdfTTL').textContent = `${s.tl}, ${s.tgll}`;
    document.getElementById('pdfJK').textContent = s.jk;
    document.getElementById('pdfAgama').textContent = s.agama;
    document.getElementById('pdfPekerjaan').textContent = s.pekerjaan;
    document.getElementById('pdfAlamat').textContent = s.alamat;
    document.getElementById('pdfKeperluan').textContent = s.keperluan;
    document.getElementById('pdfNamaRT').textContent = `Pengurus ${s.rt}`;
    document.getElementById('pdfNamaRW').textContent = `Pengurus ${s.rw}`;

    const el = document.getElementById('areaPdf').querySelector('.pdf-surat');
    el.style.display = 'block';
    html2pdf().from(el).set({
        margin: 10, filename: `${s.no}.pdf`, image: {type:'jpeg', quality:0.98},
        html2canvas: {scale:2, useCORS:true}, jsPDF: {unit:'mm', format:'a4', orientation:'portrait'}
    }).save().then(()=>alert(`✅ PDF BERHASIL DIUNDUH!\n\n📋 Surat: ${s.no}\n✍️ Tanda Tangan Elektronik RT/RW sudah tercantum.`));
}

// === TAMPIL DAFTAR SURAT DI HALAMAN VERIFIKASI ===
function renderDaftarSurat() {
    const list = document.getElementById('daftarSurat');
    if(!daftarSuratMasuk.length) {
        list.innerHTML = '<div class="text-center text-neutral-500 py-8"><i class="fa fa-inbox text-4xl mb-3 text-neutral-300"></i><p>Belum ada surat yang masuk</p></div>'; return;
    }
    list.innerHTML = daftarSuratMasuk.map(s => `
        <div class="border border-neutral-200 rounded-lg p-4">
            <p class="font-semibold">${s.no}</p>
            <p class="text-sm">${s.nama} — ${s.jenis}</p>
            <p class="text-sm text-neutral-500">${s.rt}/${s.rw} — ${s.tgl}</p>
            <span class="inline-block px-2 py-1 bg-amber-100 text-amber-700 text-xs rounded-full mt-2">${s.status}</span>
            <div class="mt-3 flex gap-2">
                <button class="btn btn-success text-sm" onclick="buatPDF('${s.no}')"><i class="fa fa-file-pdf-o mr-1"></i> Setujui & Unduh PDF</button>
            </div>
        </div>`).join('');
}

// === CEK STATUS ===
document.getElementById('btnCariStatus').onclick = () => {
    const q = document.getElementById('cariNomor').value.trim();
    const hasil = document.getElementById('hasilCariStatus');
    if(!q) return hasil.innerHTML = '<p class="text-red-500">Masukkan Nomor atau NIK!</p>';
    const s = daftarSuratMasuk.find(x=>x.no===q || x.nik===q);
    if(s) hasil.innerHTML = `<div class="text-left bg-green-50 p-3 rounded-lg"><p class="font-semibold text-green-700">✅ Ditemukan!</p><p><strong>No:</strong> ${s.no}</p><p><strong>Status:</strong> ${s.status}</p></div>`;
    else hasil.innerHTML = '<p class="text-neutral-500">Belum terdaftar atau belum diverifikasi</p>';
};