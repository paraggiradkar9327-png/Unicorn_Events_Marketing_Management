// ─── BRAND DATA ───────────────────────────────────────────────
// front = shown by default  |  back = revealed on hover flip

const brandPairs = [
    {
        front: { name: 'ADANI', image: './assets/brandIcon/adani-1.png', alt: 'Adani' },
        back: { name: 'ABD', image: './assets/brandIcon/abd-logo.png', alt: 'ABD' }
    },
    {
        front: { name: 'AUDI', image: './assets/brandIcon/audi-1.png', alt: 'Audi' },
        back: { name: 'BACARDI', image: './assets/brandIcon/bacardi-1.png', alt: 'Bacardi' }
    },
    {
        front: { name: 'CEAT', image: './assets/brandIcon/ceat-logo.png', alt: 'CEAT' },
        back: { name: 'DIAGEO', image: './assets/brandIcon/diageo-logo.png', alt: 'Diageo' }
    },
    {
        front: { name: 'EICHER', image: './assets/brandIcon/eicher-logo.png', alt: 'Eicher' },
        back: { name: 'ITC', image: './assets/brandIcon/itc-1.png', alt: 'ITC' }
    },
    {
        front: { name: 'KONKAN', image: './assets/brandIcon/konkan-1.png', alt: 'Konkan' },
        back: { name: 'MAHARASHTRA POLICE', image: './assets/brandIcon/maha-police-2.png', alt: 'Maharashtra Police' }
    },
    {
        front: { name: 'MAHINDRA', image: './assets/brandIcon/mahindra-logo.png', alt: 'Mahindra' },
        back: { name: 'MERCEDES-BENZ', image: './assets/brandIcon/mercedes-benz.png', alt: 'Mercedes-Benz' }
    },
    {
        front: { name: 'MORARJEE', image: './assets/brandIcon/morariee-logo1.png', alt: 'Morarjee' },
        back: { name: 'RADIOCITY', image: './assets/brandIcon/radiocity-1.png', alt: 'Radiocity' }
    }
];

// ─── RENDER ───────────────────────────────────────────────────
window.renderBrandGrid = function () {
    const grid = document.querySelector('.brand-grid');
    if (!grid) {
        console.warn('brands.js: .brand-grid not found');
        return;
    }

    grid.innerHTML = brandPairs.map(pair => `
    <div class="brand-card">
      <div class="brand-inner">

        <div class="brand-front">
          <img src="${pair.front.image}" alt="${pair.front.alt}" loading="lazy">
          <p>${pair.front.name}</p>
        </div>

        <div class="brand-back">
          <img src="${pair.back.image}" alt="${pair.back.alt}" loading="lazy">
          <div class="brand-back-divider"></div>
          <p>${pair.back.name}</p>
        </div>

      </div>
    </div>
  `).join('');

    console.log('brands.js: rendered', brandPairs.length, 'flip cards ✓');
};

// auto-init
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', window.renderBrandGrid);
} else {
    window.renderBrandGrid();
}