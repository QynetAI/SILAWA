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

document.getElementById('btnLanjut3').onclick = () => {
    const nik = document.getElementById('nik').value.trim();
    if (!document.getElementById('nama').value.trim() || nik.length !== 16) {
        return alert('Nama wajib diisi & NIK harus 16 digit!');
    }
    tampilLangkah(4);
};
document.getElementById('btnKembali3').onclick = () => tampilLangkah(3);

document.getElementById('btnLanjut4').onclick = () => {
    const ktp = document.getElementById('fileKtp').files[0];
    const kk = document.getElementById('fileKk').files[0];
    if (!ktp || !kk) return alert('Unggah KTP & KK terlebih dahulu!');
    simpanDataSementara();
    tampilRingkasan();
    tampilLangkah(5);
};
document.getElementById('btnKembali4').onclick = () => tampilLangkah(4);

function simpanDataSementara() {
    dataSementara = {
        provinsi: document.getElementById('provinsi').value,
        kabupaten: document.getElementById('kabupaten').value,
        kecamatan: document.getElementById('kecamatan').value,
        kelurahan: document.getElementById('kelurahan').value,
        rw: document.getElementById('rw').value,
        rt: document.getElementById('rt').value,
        alamat_lengkap: document.getElementById('alamatLengkap').value,
        jenis_surat: document.getElementById('jenisSurat').value,
        keperluan: document.getElementById('keperluan').value || '-',
        nama_pemohon: document.getElementById('nama').value.trim(),
        nik_pemohon: document.getElementById('nik').value.trim(),
        tempat_lahir: document.getElementById('tempatLahir').value.trim(),
        tanggal_lahir: document.getElementById('tanggalLahir').value,
        jenis_kelamin: document.getElementById('jenisKelamin').value,
        agama: document.getElementById('agama').value,
        pekerjaan: document.getElementById('pekerjaan').value?.trim() || '-',
        kontak: document.getElementById('kontak').value.trim()
    };
}

function tampilRingkasan() {
    const r = dataSementara;
    document.getElementById('ringkasan').innerHTML = `
        <p><strong>Jenis Surat:</strong> ${r.jenis_surat}</p>
        <p><strong>Nama Pemohon:</strong> ${r.nama_pemohon}</p>
        <p><strong>NIK:</strong> ${r.nik_pemohon}</p>
        <p><strong>TTL:</strong> ${r.tempat_lahir}, ${r.tanggal_lahir}</p>
        <p><strong>Alamat:</strong> ${r.alamat_lengkap}</p>
        <p><strong>Wilayah:</strong> ${r.kelurahan}, ${r.kecamatan} — ${r.kabupaten}, ${r.provinsi}</p>
        <p><strong>RW/RT:</strong> ${r.rw} / ${r.rt}</p>
        <p><strong>Keperluan:</strong> ${r.keperluan}</p>
    `;
}

// =============================================
// KIRIM PENGAJUAN KE DATABASE + UPLOAD FILE
// =============================================
document.getElementById('formSurat').onsubmit = async e => {
    e.preventDefault();
    if (!document.getElementById('setuju').checked) return alert('Centang persetujuan terlebih dahulu!');
    if (!penggunaSekarang) {
        alert('⚠️ Silakan DAFTAR atau MASUK terlebih dahulu untuk mengajukan surat!');
        document.getElementById('btnDaftar').click();
        return;
    }

    try {
        // 1. Ambil nomor urut surat
        const { data: nomorData, error: errNomor } = await supabase
            .from('pengaturan').select('nilai').eq('kunci', 'urutan_surat').single();
        if (errNomor) throw errNomor;

        const urutan = String(parseInt(nomorData.nilai) + 1).padStart(5, '0');
        const nomorSurat = `SLW-${urutan}`;

        // 2. Upload dokumen ke Supabase Storage
        const fileKtp = document.getElementById('fileKtp').files[0];
        const fileKk = document.getElementById('fileKk').files[0];
        const fileLain = document.getElementById('fileLain')?.files[0];

        const namaFileKtp = `${nomorSurat}_KTP_${Date.now()}`;
        const namaFileKk = `${nomorSurat}_KK_${Date.now()}`;
        
        const { data: upKtp, error: eKtp } = await supabase.storage
            .from('dokumen')
            .upload(`${penggunaSekarang.id}/${namaFileKtp}`, fileKtp);
        const { data: upKk, error: eKk } = await supabase.storage
            .from('dokumen')
            .upload(`${penggunaSekarang.id}/${namaFileKk}`, fileKk);

        if (eKtp || eKk) throw new Error('Gagal upload dokumen!');

        // Ambil URL publik
        const { data: { publicUrl: urlKtp } } = supabase.storage
            .from('dokumen').getPublicUrl(`${penggunaSekarang.id}/${namaFileKtp}`);
        const { data: { publicUrl: urlKk } } = supabase.storage
            .from('dokumen').getPublicUrl(`${penggunaSekarang.id}/${namaFileKk}`);

        let urlLain = null;
        if (fileLain) {
            const namaFileLain = `${nomorSurat}_LAIN_${Date.now()}`;
            const { data: upLain } = await supabase.storage
                .from('dokumen')
                .upload(`${penggunaSekarang.id}/${namaFileLain}`, fileLain);
            const { data: { publicUrl: puLain } } = supabase.storage
                .from('dokumen').getPublicUrl(`${penggunaSekarang.id}/${namaFileLain}`);
            urlLain = puLain;
        }

        // 3. Simpan ke tabel pengajuan_surat
        const surat = {
            nomor_surat: nomorSurat,
            pembuat_id: penggunaSekarang.id,
            ...dataSementara,
            file_ktp: urlKtp,
            file_kk: urlKk,
            file_lain: urlLain
        };

        const { error: errSimpan } = await supabase.from('pengajuan_surat').insert([surat]);
        if (errSimpan) throw errSimpan;

        // 4. Update nomor urut
        await supabase.from('pengaturan').update({ nilai: urutan }).eq('kunci', 'urutan_surat');

        alert(`✅ PENGAJUAN BERHASIL!\n\nNomor Surat: ${nomorSurat}\nSimpan nomor ini untuk cek status & unduh PDF.`);

        // Reset form & kembali ke beranda
        tampilLangkah(1);
        document.getElementById('formSurat').reset();
        document.querySelectorAll('.page-content').forEach(p => p.classList.add('hidden'));
        document.getElementById('page-beranda').classList.remove('hidden');
        document.querySelectorAll('[data-page]').forEach(l => l.classList.remove('active'));
        document.querySelector('[data-page="beranda"]').classList.add('active');
        dataSementara = {};

    } catch (err) {
        alert('❌ Gagal Mengajukan: ' + err.message);
        console.error(err);
    }
};

// =============================================
// CEK STATUS PENGAJUAN
// =============================================
document.getElementById('btnCari').onclick = async () => {
    const kataKunci = document.getElementById('cariInput').value.trim();
    if (!kataKunci) return alert('Masukkan Nomor Surat atau NIK!');

    let { data, error } = await supabase
        .from('pengajuan_surat')
        .select('*')
        .or(`nomor_surat.eq.${kataKunci},nik_pemohon.eq.${kataKunci}`)
        .order('dibuat_pada', { ascending: false });

    const el = document.getElementById('hasilCari');
    if (error) return el.innerHTML = `<p class="text-red-500">❌ ${error.message}</p>`;
    if (!data || data.length === 0) return el.innerHTML = `<p class="text-gray-500">Surat tidak ditemukan</p>`;

    el.innerHTML = data.map(s => {
        const warna = s.status === 'Menunggu' ? 'bg-yellow-100 text-yellow-800' :
                      s.status === 'Diverifikasi' ? 'bg-green-100 text-green-800' :
                      s.status === 'Selesai' ? 'bg-blue-100 text-blue-800' : 'bg-red-100 text-red-800';
        return `
            <div class="border rounded-lg p-3 text-left mt-2">
                <p class="font-semibold">${s.nomor_surat}</p>
                <p class="text-sm">${s.jenis_surat}</p>
                <p class="text-sm">${s.nama_pemohon}</p>
                <span class="inline-block px-2 py-1 text-xs rounded-full mt-1 ${warna}">${s.status}</span>
                <p class="text-xs text-gray-500 mt-1">Dibuat: ${new Date(s.dibuat_pada).toLocaleDateString('id-ID')}</p>
                ${s.status === 'Selesai' ? `<button class="unduhPdf mt-2 px-3 py-1 bg-blue-600 text-white rounded text-sm" data-id="${s.id}">📄 Unduh PDF</button>` : ''}
            </div>
        `;
    }).join('');

    // Pasang tombol unduh PDF
    document.querySelectorAll('.unduhPdf').forEach(btn => {
        btn.onclick = async e => {
            const id = e.target.dataset.id;
            const surat = data.find(s => s.id === id);
            buatPDF(surat);
        };
    });
};

// =============================================
// HALAMAN VERIFIKASI PENGURUS
// =============================================
async function muatDaftarSurat() {
    if (!penggunaSekarang) {
        document.getElementById('daftarSurat').innerHTML = `<p class="text-gray-500">⚠️ Masuk sebagai Pengurus untuk melihat daftar surat</p>`;
        return;
    }

    const { data, error } = await supabase
        .from('pengajuan_surat')
        .select('*')
        .order('dibuat_pada', { ascending: false });

    if (error || !data || data.length === 0) {
        document.getElementById('daftarSurat').innerHTML = `<p class="text-gray-500">Belum ada surat masuk</p>`;
        return;
    }

    document.getElementById('daftarSurat').innerHTML = data.map(s => {
        const warna = s.status === 'Menunggu' ? 'bg-yellow-50 border-yellow-200' :
                      s.status === 'Diverifikasi' ? 'bg-green-50 border-green-200' :
                      s.status === 'Selesai' ? 'bg-blue-50 border-blue-200' : 'bg-red-50 border-red-200';
        return `
            <div class="border rounded-lg p-4 text-left ${warna}" data-surat-id="${s.id}">
                <div class="flex justify-between items-start">
                    <div>
                        <p class="font-bold">${s.nomor_surat} — ${s.jenis_surat}</p>
                        <p class="text-sm">${s.nama_pemohon} • NIK: ${s.nik_pemohon}</p>
                        <p class="text-sm">${s.rw} / ${s.rt} • ${s.kelurahan}, ${s.kecamatan}</p>
                        <p class="text-xs text-gray-500">Dibuat: ${new Date(s.dibuat_pada).toLocaleString('id-ID')}</p>
                    </div>
                    <span class="px-2 py-1 text-xs rounded-full bg-white border">${s.status}</span>
                </div>
                <div class="flex gap-2 mt-3">
                    <a href="${s.file_ktp}" target="_blank" class="text-sm text-blue-600">Lihat KTP</a>
                    <a href="${s.file_kk}" target="_blank" class="text-sm text-blue-600">Lihat KK</a>
                    ${s.file_lain ? `<a href="${s.file_lain}" target="_blank" class="text-sm text-blue-600">Lihat Dokumen Lain</a>` : ''}
                </div>
                ${s.status === 'Menunggu' ? `
                    <div class="flex gap-2 mt-3">
                        <button class="btnVerifikasi px-3 py-1 bg-green-600 text-white rounded text-sm" data-id="${s.id}">✅ Verifikasi & Buat PDF</button>
                        <button class="btnTolak px-3 py-1 bg-red-600 text-white rounded text-sm" data-id="${s.id}">❌ Tolak</button>
                    </div>
                ` : ''}
                ${s.status === 'Diverifikasi' || s.status === 'Selesai' ? `
                    <button class="btnCetakPdf mt-2 px-3 py-1 bg-blue-600 text-white rounded text-sm" data-surat='${JSON.stringify(s).replace(/'/g, "\\'")}'>📄 Unduh PDF</button>
                ` : ''}
            </div>
        `;
    }).join('');

    // Pasang event tombol
    document.querySelectorAll('.btnVerifikasi').forEach(btn => {
        btn.onclick = async e => {
            const id = e.target.dataset.id;
            const surat = data.find(s => s.id === id);
            await supabase.from('pengajuan_surat').update({
                status: 'Selesai',
                diverifikasi_oleh: penggunaSekarang.id,
                diverifikasi_pada: new Date().toISOString()
            }).eq('id', id);
            alert('✅ Surat Diverifikasi! PDF siap diunduh warga.');
            muatDaftarSurat();
        };
    });

    document.querySelectorAll('.btnTolak').forEach(btn => {
        btn.onclick = async e => {
            const id = e.target.dataset.id;
            const alasan = prompt('Masukkan alasan penolakan:');
            if (!alasan) return;
            await supabase.from('pengajuan_surat').update({
                status: 'Ditolak',
                catatan_verifikasi: alasan
            }).eq('id', id);
            alert('❌ Surat Ditolak');
            muatDaftarSurat();
        };
    });

    document.querySelectorAll('.btnCetakPdf').forEach(btn => {
        btn.onclick = e => {
            const surat = JSON.parse(e.target.dataset.surat);
            buatPDF(surat);
        };
    });
}

// =============================================
// BUAT PDF DENGAN TANDA TANGAN ELEKTRONIK
// =============================================
function buatPDF(s) {
    document.getElementById('pdfNo').textContent = s.nomor_surat;
    document.getElementById('pdfTgl').textContent = new Date().toLocaleDateString('id-ID', {day:'2-digit',month:'long',year:'numeric'});
    document.getElementById('pdfWilayah').textContent = `${s.kelurahan}, ${s.kecamatan} — ${s.kabupaten}, ${s.provinsi}`;
    document.getElementById('pdfNama').textContent = s.nama_pemohon;
    document.getElementById('pdfNik').textContent = s.nik_pemohon;
    document.getElementById('pdfTtl').textContent = `${s.tempat_lahir}, ${s.tanggal_lahir}`;
    document.getElementById('pdfJk').textContent = s.jenis_kelamin;
    document.getElementById('pdfAgama').textContent = s.agama;
    document.getElementById('pdfPekerjaan').textContent = s.pekerjaan;
    document.getElementById('pdfAlamat').textContent = s.alamat_lengkap;
    document.getElementById('pdfKeperluan').textContent = s.keperluan;
    document.getElementById('pdfRtTtd').textContent = s.rt;
    document.getElementById('pdfRwTtd').textContent = s.rw;

    const el = document.getElementById('isiPdf');
    el.style.display = 'block';
    el.style.position = 'static';

    html2pdf()
        .from(el)
        .set({
            margin: 10,
            filename: `${s.nomor_surat}_${s.jenis_surat.replace(/\s+/g,'_')}.pdf`,
            html2canvas: { scale: 2 },
            jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
        })
        .save();
}

// =============================================
// INISIALISASI SAAT HALAMAN DIBUKA
// =============================================
cekSesi();
