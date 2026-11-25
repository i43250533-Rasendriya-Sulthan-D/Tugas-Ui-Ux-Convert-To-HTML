// Data Produk Beras Domba menggunakan foto asli dari Foto.zip
const PRODUCTS = [
  {
    id: 'bd-2.5',
    name: 'Beras Domba',
    badge: 'Best Seller',
    badgeClass: '',
    meta: 'Sertifikasi Organik SNI',
    desc: 'Beras pandan wangi pilihan, pulen alami, dan beraroma harum pandan segar saat dimasak.',
    specs: ['Pulen Harum Alami', 'Segar Simpan 6 Bln'],
    size: '2.5kg',
    price: 44000,
    img: 'assets/images/Foto/products/prod_1794227283.png'
  },
  {
    id: 'bd-3',
    name: 'Beras Domba',
    badge: 'Favorit Keluarga',
    badgeClass: 'amber',
    meta: 'Tekstur Lembut Ramah Cerna',
    desc: 'Beras premium dengan tekstur ekstra pulen dan butiran utuh, ideal untuk hidangan keluarga harian.',
    specs: ['Kadar Amilosa Rendah', 'Bebas Pengawet'],
    size: '3kg',
    price: 45000,
    img: 'assets/images/Foto/products/prod_1794227388.png'
  },
  {
    id: 'bd-5',
    name: 'Beras Domba',
    badge: 'Favorit Keluarga',
    badgeClass: 'amber',
    meta: 'Diet Diabetes & Kebugaran',
    desc: 'Beras organik bebas pestisida kimia, kaya nutrisi, dan sangat baik untuk gaya hidup sehat Anda.',
    specs: ['GI Rendah 54', 'Kaya Antioksidan'],
    size: '5kg',
    price: 70500,
    img: 'assets/images/Foto/products/prod_1794227432.png'
  },
  {
    id: 'bd-10',
    name: 'Beras Domba',
    badge: 'Pusaka Nusantara',
    badgeClass: '',
    meta: 'Bibit Murni Galur Delanggu',
    desc: 'Beras merah pilihan dengan indeks glikemik rendah dan serat tinggi untuk mendukung program diet.',
    specs: ['Jawa Tengah & Jawa', 'Varietas Asli'],
    size: '10kg',
    price: 139000,
    img: 'assets/images/Foto/products/prod_1794227525.png'
  },
  {
    id: 'bd-25',
    name: 'Beras Domba',
    badge: 'Pusaka Nusantara',
    badgeClass: '',
    meta: 'Bibit Murni Galur Delanggu',
    desc: 'Kemasan hemat besar berkualitas premium. Selalu bersih, higienis, dan terpercaya untuk porsi besar.',
    specs: ['Jawa Tengah & Jawa', 'Varietas Asli'],
    size: '25kg',
    price: 342500,
    img: 'assets/images/Foto/products/prod_1794227534.png'
  }
];

function formatRupiah(num) {
  return 'Rp ' + num.toLocaleString('id-ID');
}

function getCart() {
  try {
    return JSON.parse(localStorage.getItem('berasDombaCart') || '[]');
  } catch (e) {
    return [];
  }
}

function saveCart(cart) {
  localStorage.setItem('berasDombaCart', JSON.stringify(cart));
  updateCartBadge();
}

function updateCartBadge() {
  const cart = getCart();
  const totalQty = cart.reduce((acc, item) => acc + item.qty, 0);
  document.querySelectorAll('.cart-badge').forEach(el => {
    el.textContent = totalQty;
  });
}

function addToCart(productId) {
  const product = PRODUCTS.find(p => p.id === productId);
  if (!product) return;
  const cart = getCart();
  const existing = cart.find(item => item.id === productId);
  if (existing) {
    existing.qty += 1;
  } else {
    cart.push({ id: product.id, name: product.name, size: product.size, price: product.price, qty: 1 });
  }
  saveCart(cart);
  openCartModal();
}

function changeQty(productId, delta) {
  let cart = getCart();
  const item = cart.find(i => i.id === productId);
  if (!item) return;
  item.qty += delta;
  if (item.qty <= 0) {
    cart = cart.filter(i => i.id !== productId);
  }
  saveCart(cart);
  renderCartModal();
}

function openCartModal() {
  const modal = document.getElementById('cartModal');
  if (!modal) return;
  renderCartModal();
  modal.classList.add('show');
}

function closeCartModal() {
  const modal = document.getElementById('cartModal');
  if (modal) modal.classList.remove('show');
}

function renderCartModal() {
  const listEl = document.getElementById('cartItemsContainer');
  const totalEl = document.getElementById('cartTotalAmount');
  if (!listEl || !totalEl) return;

  const cart = getCart();
  if (cart.length === 0) {
    listEl.innerHTML = '<p style="color:#58665E; padding:20px 0; text-align:center;">Keranjang pesanan Anda masih kosong. Silakan pilih varian kemasan Beras Domba.</p>';
    totalEl.textContent = 'Rp 0';
    return;
  }

  let total = 0;
  listEl.innerHTML = cart.map(item => {
    const subtotal = item.price * item.qty;
    total += subtotal;
    return `
      <div class="cart-row">
        <div>
          <strong>${item.name} (${item.size})</strong>
          <div style="font-size:13px; color:#58665E;">${formatRupiah(item.price)} / kemasan</div>
        </div>
        <div class="qty-controls">
          <button class="qty-btn" onclick="changeQty('${item.id}', -1)">-</button>
          <span style="font-weight:700; min-width:20px; text-align:center;">${item.qty}</span>
          <button class="qty-btn" onclick="changeQty('${item.id}', 1)">+</button>
        </div>
      </div>
    `;
  }).join('');
  totalEl.textContent = formatRupiah(total);
}

function checkoutWhatsApp() {
  const cart = getCart();
  if (cart.length === 0) {
    alert('Keranjang Anda masih kosong.');
    return;
  }
  let lines = ['Halo CV Traktakan (Beras Domba), saya ingin memesan:'];
  let total = 0;
  cart.forEach((item, idx) => {
    const sub = item.price * item.qty;
    total += sub;
    lines.push(`${idx + 1}. ${item.name} Kemasan ${item.size} x ${item.qty} = ${formatRupiah(sub)}`);
  });
  lines.push(`Total Pesanan: ${formatRupiah(total)}`);
  alert(lines.join('\n') + '\n\nTerima kasih! Pesanan Anda siap diproses oleh tim CV Traktakan.');
  localStorage.removeItem('berasDombaCart');
  updateCartBadge();
  closeCartModal();
}

function openSearchModal() {
  const modal = document.getElementById('searchModal');
  if (modal) {
    modal.classList.add('show');
    const input = document.getElementById('searchInput');
    if (input) {
      input.value = '';
      filterSearchResults('');
      input.focus();
    }
  }
}

function closeSearchModal() {
  const modal = document.getElementById('searchModal');
  if (modal) modal.classList.remove('show');
}

function filterSearchResults(q) {
  const container = document.getElementById('searchResults');
  if (!container) return;
  const keyword = q.toLowerCase().trim();
  const filtered = PRODUCTS.filter(p =>
    p.name.toLowerCase().includes(keyword) ||
    p.size.toLowerCase().includes(keyword) ||
    p.meta.toLowerCase().includes(keyword) ||
    p.desc.toLowerCase().includes(keyword)
  );
  container.innerHTML = filtered.map(p => `
    <div class="cart-row">
      <div style="display:flex; align-items:center; gap:12px;">
        <img src="${p.img}" alt="${p.size}" style="width:44px; height:44px; object-fit:cover; border-radius:8px;" />
        <div>
          <strong>${p.name} - ${p.size}</strong>
          <div style="font-size:12.5px; color:#58665E;">${p.meta} • ${formatRupiah(p.price)}</div>
        </div>
      </div>
      <a href="katalog-produk.html" class="btn btn-primary" style="padding:7px 14px; font-size:12px;">Lihat</a>
    </div>
  `).join('') || '<p style="color:#58665E; padding:12px 0;">Produk tidak ditemukan.</p>';
}

document.addEventListener('DOMContentLoaded', () => {
  updateCartBadge();

  document.querySelectorAll('.faq-question').forEach(btn => {
    btn.addEventListener('click', () => {
      const item = btn.closest('.faq-item');
      item.classList.toggle('open');
    });
  });
});
