let penggunaSekarang = null;
let peranPengguna = 'warga';
let dataSementara = {};

// =============================================
// NAVIGASI HALAMAN
// =============================================
document.querySelectorAll('[data-page]').forEach(link => {
    link.addEventListener('click', e => {
        e.preventDefault();
        document.querySelectorAll('[data-page]').forEach(l => l.classList.remove('active'));
        link.classList.add('active');
        const halaman = link.dataset.page;
        document.querySelectorAll('.page-content').forEach(p => p.classList.add('hidden'));
        document.getElementById(`page-${halaman}`).classList.remove('hidden');
        document.getElementById('mobileMenu').classList.add('hidden');
        if (halaman === 'verifikasi') muatDaftarSurat();
    });
});

document.querySelectorAll('[data-goto]').forEach(link => {
    link.addEventListener('click', e => {
        e.preventDefault();
        document.querySelectorAll('[data-page]').forEach(l => l.classList.remove('active'));
        document.querySelector(`[data-page="${link.dataset.goto}"]`).classList.add('active');
        document.querySelectorAll('.page-content').forEach(p => p.classList.add('hidden'));
        document.getElementById(`page-${link.dataset.goto}`).classList.remove('hidden');
    });
});

document.getElementById('menuToggle').onclick = () => {
    document.getElementById('mobileMenu').classList.toggle('hidden');
};

// =============================================
// AUTENTIKASI: DAFTAR & MASUK
// =============================================
async function cekSesi() {
    const { data: { session } } = await supabase.auth.getSession();
    if (session) {
        penggunaSekarang = session.user;
        await muatDataPengguna();
        tampilkanSudahMasuk();
    }
}

async function muatDataPengguna() {
    const { data, error } = await supabase
        .from('pengguna')
        .select('*')
        .eq('id', penggunaSekarang.id)
        .single();
    
    if (data) {
        peranPengguna = data.peran;
        if (peranPengguna.includes('pengurus') || peranPengguna === 'admin') {
            document.getElementById('menuVerifikasi').style.display = 'block';
            document.getElementById('menuVerifikasiMobile').style.display = 'block';
        }
    }
}

function tampilkanSudahMasuk() {
    document.getElementById('btnMasuk').classList.add('hidden');
    document.getElementById('btnDaftar').classList.add('hidden');
    document.getElementById('btnKeluar').classList.remove('hidden');
    document.getElementById('namaPengguna').textContent = penggunaSekarang?.email || 'Pengguna';
    document.getElementById('namaPengguna').classList.remove('hidden');
    // Mobile
    document.getElementById('btnMasukMobile').classList.add('hidden');
    document.getElementById('btnDaftarMobile').classList.add('hidden');
    document.getElementById('btnKeluarMobile').classList.remove('hidden');
    document.getElementById('namaPenggunaMobile').textContent = penggunaSekarang?.email || 'Pengguna';
    document.getElementById('namaPenggunaMobile').classList.remove('hidden');
}

function tampilkanBelumMasuk() {
    penggunaSekarang = null;
    peranPengguna = 'warga';
    document.getElementById('menuVerifikasi').style.display = 'none';
    document.getElementById('menuVerifikasiMobile').style.display = 'none';
    document.getElementById('btnMasuk').classList.remove('hidden');
    document.getElementById('btnDaftar').classList.remove('hidden');
    document.getElementById('btnKeluar').classList.add('hidden');
    document.getElementById('namaPengguna').classList.add('hidden');
    // Mobile
    document.getElementById('btnMasukMobile').classList.remove('hidden');
    document.getElementById('btnDaftarMobile').classList.remove('hidden');
    document.getElementById('btnKeluarMobile').classList.add('hidden');
    document.getElementById('namaPenggunaMobile').classList.add('hidden');
}

// Tombol Auth
let modeModal = 'masuk';
document.getElementById('btnMasuk').onclick = () => {
    modeModal = 'masuk';
    document.getElementById('judulModal').textContent = 'Masuk ke SiLAWA';
    document.getElementById('kolomNama').classList.add('hidden');
    document.getElementById('modalMasuk').classList.remove('hidden');
};
document.getElementById('btnDaftar').onclick = () => {
    modeModal = 'daftar';
    document.getElementById('judulModal').textContent = 'Daftar Akun SiLAWA';
    document.getElementById('kolomNama').classList.remove('hidden');
    document.getElementById('modalMasuk').classList.remove('hidden');
};
document.getElementById('btnMasukMobile').onclick = () => document.getElementById('btnMasuk').click();
document.getElementById('btnDaftarMobile').onclick = () => document.getElementById('btnDaftar').click();
document.getElementById('tutupModal').onclick = () => {
    document.getElementById('modalMasuk').classList.add('hidden');
    document.getElementById('formAuth').reset();
};

// Proses Auth
document.getElementById('formAuth').onsubmit = async e => {
    e.preventDefault();
    const email = document.getElementById('authEmail').value.trim();
    const sandi = document.getElementById('authSandi').value;
    
    if (modeModal === 'daftar') {
        const nama = document.getElementById('authNama').value.trim();
        const nik = document.getElementById('authNik').value.trim();
        if (!nama || nik.length !== 16) { alert('Lengkapi Nama & NIK 16 digit!'); return; }

        const { data, error } = await supabase.auth.signUp({ email, password: sandi });
        if (error) return alert('Daftar Gagal: ' + error.message);

        // Simpan data pengguna
        await supabase.from('pengguna').insert([{
            id: data.user.id, nama_lengkap: nama, nik: nik, peran: 'warga'
        }]);
        alert('✅ Daftar Berhasil! Cek email untuk konfirmasi.');
    } else {
        const { data, error } = await supabase.auth.signInWithPassword({ email, password: sandi });
        if (error) return alert('Gagal Masuk: ' + error.message);
        alert('✅ Berhasil Masuk!');
    }
    document.getElementById('modalMasuk').classList.add('hidden');
    document.getElementById('formAuth').reset();
    await cekSesi();
};

// Keluar
document.getElementById('btnKeluar').onclick = async () => {
    await supabase.auth.signOut();
    tampilkanBelumMasuk();
    alert('✅ Berhasil Keluar');
};
document.getElementById('btnKeluarMobile').onclick = () => document.getElementById('btnKeluar').click();

// =============================================
// UPLOAD PREVIEW
// =============================================
function pasangPreview(idInput, idPreview) {
    const input = document.getElementById(idInput);
    const prev = document.getElementById(idPreview);
    if (!input || !prev) return;
    input.onchange = () => {
        if (input.files[0]) {
            prev.innerHTML = `<i class="fa fa-check-circle text-green-500 text-xl mb-1"></i><p class="text-green-600 text-sm">${input.files[0].name}</p>`;
        } else {
            prev.innerHTML = `<i class="fa fa-cloud-upload text-2xl text-gray-400"></i><p>Klik pilih file</p>`;
        }
    };
}
pasangPreview('fileKtp', 'prevKtp');
pasangPreview('fileKk', 'prevKk');
pasangPreview('fileLain', 'prevLain');

// =============================================
// LANGKAH FORMULIR
// =============================================
function tampilLangkah(no) {
    for (let i=1; i<=5; i++) {
        const el = document.getElementById(`langkah-${i}`);
        if (el) {
            if (i < no) el.className = 'w-9 h-9 rounded-full flex items-center justify-center mx-auto mb-1 bg-green-600 text-white text-sm';
            else if (i === no) el.className = 'w-9 h-9 rounded-full flex items-center justify-center mx-auto mb-1 bg-blue-600 text-white text-sm';
            else el.className = 'w-9 h-9 rounded-full flex items-center justify-center mx-auto mb-1 bg-gray-200 text-gray-500 text-sm';
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
    const f = ['provinsi','kabupaten','kecamatan','kelurahan','rw','rt','alamatLengkap'];
    if (f.some(id=>!document.getElementById(id).value)) return alert('Lengkapi semua data wilayah!');
    tampilLangkah(2);
};
document.getElementById('btnKembali1').onclick = () => tampilLangkah(1);

document.getElementById('btnLanjut2').onclick = () => {
    if (!document.getElementById('jenisSurat').value) return alert('Pilih jenis surat!');
    tampilLangkah(3);
};
document.getElementById('btnKembali2').onclick = () => tampilLangkah(2);

document.getElementById('btnLanjut3').on
