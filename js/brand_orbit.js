/* ═══════════════════════════════════════════════
   BRAND DATA — edit this array to add/update brands
   logo: URL to image (use '' to show text fallback)
   color: brand's primary color (used for fallback text + pill dot)
   industry: shown in tooltip subtitle
═══════════════════════════════════════════════ */
const brands = [
    { name: 'Adani', short: 'ADANI', color: '#00a3e0', industry: 'Energy & Infra', logo: 'https://upload.wikimedia.org/wikipedia/en/thumb/d/d5/Adani_Group_Logo.svg/320px-Adani_Group_Logo.svg.png' },
    { name: 'Audi', short: 'AUDI', color: '#cc0000', industry: 'Automotive', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/92/Audi-Logo_2016.svg/320px-Audi-Logo_2016.svg.png' },
    { name: 'CEAT', short: 'CEAT', color: '#e63329', industry: 'Tyre Industry', logo: 'https://upload.wikimedia.org/wikipedia/en/thumb/9/94/CEAT_logo.svg/320px-CEAT_logo.svg.png' },
    { name: 'Eicher', short: 'EICHER', color: '#cc1418', industry: 'Commercial Vehicles', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f1/Eicher_motors_logo.svg/320px-eicher_motors_logo.svg.png' },
    { name: 'Konkan', short: 'KNK', color: '#d4000a', industry: 'Manufacturing', logo: '' },
    { name: 'Mahindra', short: 'M&M', color: '#b0b0b0', industry: 'Automotive', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4d/Mahindra_Logo.svg/320px-Mahindra_Logo.svg.png' },
    { name: 'Morarjee', short: 'MRJ', color: '#5b3ea6', industry: 'Textile', logo: '' },
    { name: 'Tata', short: 'TATA', color: '#003087', industry: 'Conglomerate', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8e/Tata_logo.svg/320px-Tata_logo.svg.png' },
    { name: 'Bajaj', short: 'BAJAJ', color: '#003DA5', industry: 'Finance & Auto', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f5/Bajaj_Auto_logo.svg/320px-Bajaj_Auto_logo.svg.png' },
    { name: 'Godrej', short: 'GODREJ', color: '#009A44', industry: 'FMCG & Realty', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/32/Godrej_Logo.svg/320px-Godrej_Logo.svg.png' },
    { name: 'Hero', short: 'HERO', color: '#0033A0', industry: 'Two-Wheelers', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/Hero_MotoCorp_Logo.svg/320px-Hero_MotoCorp_Logo.svg.png' },
    { name: 'TVS', short: 'TVS', color: '#d4161c', industry: 'Automotive', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1f/TVS_Motor_Company_logo.svg/320px-TVS_Motor_Company_logo.svg.png' },
    { name: 'Bharat', short: 'BPE', color: '#FF671F', industry: 'Public Sector', logo: '' },
    { name: 'L&T', short: 'L&T', color: '#00539B', industry: 'Engineering & Infra', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6b/Larsen_%26_Toubro_logo.svg/320px-Larsen_%26_Toubro_logo.svg.png' },
    { name: 'Reliance', short: 'RIL', color: '#004990', industry: 'Energy & Retail', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/41/Reliance_Industries_Logo.svg/320px-Reliance_Industries_Logo.svg.png' },
    { name: 'ITC', short: 'ITC', color: '#c8a84b', industry: 'FMCG & Hotels', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/21/ITC_Limited_Logo.svg/320px-ITC_Limited_Logo.svg.png' },
];

/* ═══════════════════════════════════════════════
   ORBIT PLACEMENT HELPER
   Places nodes evenly around a circle.
   angleOffset: rotate start position (degrees)
═══════════════════════════════════════════════ */
function populateRing(spinnerEl, brandList, radius, counterAnim, angleOffset) {
    brandList.forEach((brand, i) => {
        const angle = (360 / brandList.length) * i + angleOffset;
        const rad = (angle * Math.PI) / 180;
        const cx = Math.cos(rad) * radius;
        const cy = Math.sin(rad) * radius;

        const node = document.createElement('div');
        node.className = 'orbit-node';
        node.style.marginLeft = (cx - (spinnerEl.classList.contains('spinner-1') ? 29 : 32)) + 'px';
        node.style.marginTop = (cy - (spinnerEl.classList.contains('spinner-1') ? 29 : 32)) + 'px';
        node.style.animation = counterAnim;

        if (brand.logo) {
            const img = document.createElement('img');
            img.src = brand.logo;
            img.alt = brand.name;
            img.onerror = () => {
                img.remove();
                const fb = document.createElement('span');
                fb.className = 'fallback';
                fb.textContent = brand.short;
                fb.style.color = brand.color;
                node.appendChild(fb);
            };
            node.appendChild(img);
        } else {
            const fb = document.createElement('span');
            fb.className = 'fallback';
            fb.textContent = brand.short;
            fb.style.color = brand.color;
            node.appendChild(fb);
        }

        /* tooltip */
        node.addEventListener('mouseenter', (e) => showTooltip(e, brand));
        node.addEventListener('mouseleave', hideTooltip);

        spinnerEl.appendChild(node);
    });
}

populateRing(
    document.getElementById('spinner1'),
    brands.slice(0, 8),
    110,
    'spinCCW 20s linear infinite',
    0
);
populateRing(
    document.getElementById('spinner2'),
    brands.slice(8),
    190,
    'spinCW 30s linear infinite',
    22
);

/* ═══════════════════════════════════════════════
   TOOLTIP
═══════════════════════════════════════════════ */
const tip = document.createElement('div');
tip.className = 'tooltip';
document.getElementById('orbitScene').appendChild(tip);

function showTooltip(e, brand) {
    tip.innerHTML = `${brand.name}<span>${brand.industry}</span>`;
    const scene = document.getElementById('orbitScene').getBoundingClientRect();
    const node = e.currentTarget.getBoundingClientRect();
    const tx = node.left - scene.left + node.width / 2;
    const ty = node.top - scene.top - 44;
    tip.style.left = tx + 'px';
    tip.style.top = ty + 'px';
    tip.style.transform = 'translateX(-50%) translateY(0)';
    tip.classList.add('show');
}
function hideTooltip() {
    tip.classList.remove('show');
}

