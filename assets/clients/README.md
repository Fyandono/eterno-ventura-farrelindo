# Logo Instansi Klien

Taruh file logo instansi di folder ini, lalu isi atribut `src` pada `<img class="client-chip-logo">`
di bagian Portofolio (index.html).

## Rekomendasi format
- Format: PNG transparan (atau SVG) agar rapi di mode gelap & terang.
- Ukuran: sisi terpanjang ± 200px, rasio bebas (akan otomatis di-fit).
- Penamaan (saran, huruf kecil, pisah dengan `-`):

| Klien                                   | Nama file yang disarankan          |
|-----------------------------------------|------------------------------------|
| Sekretariat DPRD Kota Bandung           | dprd-kota-bandung.png              |
| Dinas Cipta Karya Kota Bandung          | ciptakarya-kota-bandung.png        |
| Bapenda Kab. Bogor                      | bapenda-bogor.png                  |
| Bapenda Kab. Cianjur                    | bapenda-cianjur.png                |
| Dinas Bina Marga Kota Sukabumi          | binamarga-sukabumi.png             |
| BPSDM Kota Cimahi                       | bpsdm-cimahi.png                   |
| Diskar PB Kota Bandung                  | diskar-kota-bandung.png            |
| Kecamatan Cidadap Kota Bandung          | kecamatan-cidadap.png              |

## Cara mengaktifkan logo
1. Salin file logo ke folder ini (`assets/clients/`).
2. Buka `index.html`, cari blok `client-logos-strip`.
3. Pada chip terkait, isi `src="assets/clients/<nama-file>"` pada `<img class="client-chip-logo">`
   dan hapus atribut `hidden`.

> Catatan: gunakan hanya logo yang boleh dipakai. Untuk lambang instansi/pemerintah,
> pastikan penggunaannya sesuai izin/ketentuan yang berlaku.
