const brands = [
    { name: 'Adani', short: 'ADANI', color: '#00a3e0', industry: 'Energy & Infra', logo: './assets/brandIcon/adani-1.png' },
    { name: 'Audi', short: 'AUDI', color: '#cc0000', industry: 'Automotive', logo: './assets/brandIcon/audi-1.png' },
    { name: 'CEAT', short: 'CEAT', color: '#e63329', industry: 'Tyre Industry', logo: './assets/brandIcon/ceat-logo.png' },
    { name: 'Eicher', short: 'EICHER', color: '#cc1418', industry: 'Commercial Vehicles', logo: './assets/brandIcon/eicher-logo.png' },
    { name: 'Konkan', short: 'KNK', color: '#d4000a', industry: 'Manufacturing', logo: './assets/brandIcon/konkan-1.png' },
    { name: 'Mahindra', short: 'M&M', color: '#c0c0c0', industry: 'Automotive', logo: './assets/brandIcon/mahindra-logo.png' },
    { name: 'Morarjee', short: 'MRJ', color: '#5b3ea6', industry: 'Textile', logo: './assets/brandIcon/morariee-logo1.png' },
    { name: 'Tata', short: 'TATA', color: '#1a5fce', industry: 'Conglomerate', logo: './assets/brandIcon/tata-logo.png' },
    { name: 'ITC', short: 'ITC', color: '#c8a84b', industry: 'FMCG & Hotels', logo: './assets/brandIcon/itc-1.png' },
    { name: 'ABD', short: 'ABD', color: '#c8a84b', industry: 'Alcoholic Beverages', logo: './assets/brandIcon/abd-logo.png' },
    { name: 'Bacardi', short: 'BACARDI', color: '#c8a84b', industry: 'Alcoholic Beverages', logo: './assets/brandIcon/bacardi-1.png' },
    { name: 'Maharashtra Police', short: 'MP', color: '#c8a84b', industry: 'Law Enforcement', logo: './assets/brandIcon/maha-police-2.png' },
    { name: 'Mercedes-benz', short: 'MB', color: '#c8a84b', industry: 'Automotive', logo: './assets/brandIcon/mercedes-benz.png' },
    { name: 'Radiocity', short: 'RC', color: '#c8a84b', industry: 'Media & Entertainment', logo: './assets/brandIcon/radiocity-1.png' },
    { name: 'Rio', short: 'RIO', color: '#00a3e0', industry: 'Alcoholic Beverages', logo: './assets/brandIcon/rio-strong-logo.png' },
    { name: 'Seagrams', short: 'SEAGRAMS', color: '#cc0000', industry: 'Alcoholic Beverages', logo: './assets/brandIcon/seagrams-logo.png' },
    { name: 'Ultratech', short: 'UTECH', color: '#5b3ea6', industry: 'Textile', logo: './assets/brandIcon/ultratech-1.png' },
];

/* ═══════════════════════════════════════════
   LAYOUT CONFIG
═══════════════════════════════════════════ */
const SCENE = 580;
const CX = SCENE / 2;
const CY = SCENE / 2;
const R1 = 118;
const R2 = 208;
const S1 = 58;
const S2 = 64;
const SPD1 = 0.30;
const SPD2 = -0.18;

/* ═══════════════════════════════════════════
   DOM REFS
═══════════════════════════════════════════ */
const scene = document.getElementById('scene');
const tip = document.getElementById('tip');
const tipLogoWrap = document.getElementById('tipLogoWrap');
const tipName = document.getElementById('tipName');
const tipCat = document.getElementById('tipCat');

/* ═══════════════════════════════════════════
   BUILD NODES
═══════════════════════════════════════════ */
function appendFallback(el, brand) {
    const fb = document.createElement('span');
    fb.className = 'fallback';
    fb.textContent = brand.short;
    fb.style.color = brand.color;
    el.appendChild(fb);
}

function buildNode(brand, size) {
    const el = document.createElement('div');
    el.className = 'orbit-node';
    el.style.width = size + 'px';
    el.style.height = size + 'px';

    if (brand.logo) {
        const img = document.createElement('img');
        img.src = brand.logo;
        img.alt = brand.name;
        img.onerror = () => { img.remove(); appendFallback(el, brand); };
        el.appendChild(img);
    } else {
        appendFallback(el, brand);
    }

    scene.appendChild(el);
    return el;
}

/* ── Create node objects ── */
const nodes = [
    ...brands.slice(0, 8).map((b, i) => ({
        brand: b,
        el: buildNode(b, S1),
        angle: (360 / 8) * i,
        speed: SPD1,
        r: R1,
        half: S1 / 2,
    })),
    ...brands.slice(8).map((b, i) => ({
        brand: b,
        el: buildNode(b, S2),
        angle: (360 / 8) * i + 22,
        speed: SPD2,
        r: R2,
        half: S2 / 2,
    })),
];

/* ═══════════════════════════════════════════
   TOOLTIP HELPER
   Populates tipLogoWrap with either an <img>
   or a text fallback for the given brand.
═══════════════════════════════════════════ */
function setTipContent(brand) {
    tipLogoWrap.innerHTML = '';

    if (brand.logo) {
        const img = document.createElement('img');
        img.src = brand.logo;
        img.alt = brand.name;
        img.onerror = () => {
            img.remove();
            const fb = document.createElement('span');
            fb.className = 'tip-fallback';
            fb.textContent = brand.short;
            fb.style.color = brand.color;
            tipLogoWrap.appendChild(fb);
        };
        tipLogoWrap.appendChild(img);
    } else {
        const fb = document.createElement('span');
        fb.className = 'tip-fallback';
        fb.textContent = brand.short;
        fb.style.color = brand.color;
        tipLogoWrap.appendChild(fb);
    }

    tipName.textContent = brand.name;
    tipCat.textContent = brand.industry;
}

/* ═══════════════════════════════════════════
   HOVER STATE
═══════════════════════════════════════════ */
let activeNode = null;
let scenePaused = false;

scene.addEventListener('mouseleave', () => {
    scenePaused = false;
    tip.classList.remove('visible');
    if (activeNode) {
        activeNode.el.classList.remove('hovered');
        activeNode = null;
    }
});

/* Attach enter / leave to every node */
nodes.forEach(n => {
    n.el.addEventListener('mouseenter', () => {
        /* Pause the whole orbit */
        scenePaused = true;

        /* Deactivate previous node if switching quickly */
        if (activeNode && activeNode !== n) {
            activeNode.el.classList.remove('hovered');
        }

        /* Activate this node */
        n.el.classList.add('hovered');
        activeNode = n;

        /* Populate & show tooltip */
        setTipContent(n.brand);
        tip.classList.add('visible');
    });

    n.el.addEventListener('mouseleave', () => {
        n.el.classList.remove('hovered');
        tip.classList.remove('visible');
        activeNode = null;
        scenePaused = false;
    });
});

/* ═══════════════════════════════════════════
   ANIMATION LOOP
═══════════════════════════════════════════ */
function tick() {
    nodes.forEach(n => {
        if (!scenePaused) n.angle += n.speed;

        const rad = n.angle * (Math.PI / 180);
        const x = CX + Math.cos(rad) * n.r - n.half;
        const y = CY + Math.sin(rad) * n.r - n.half;

        n.el.style.left = x + 'px';
        n.el.style.top = y + 'px';
    });

    /* Keep tooltip glued above the active node */
    if (activeNode) {
        const rad = activeNode.angle * (Math.PI / 180);
        const tx = CX + Math.cos(rad) * activeNode.r;
        const ty = CY + Math.sin(rad) * activeNode.r - activeNode.half - 12;
        tip.style.left = tx + 'px';
        tip.style.top = ty + 'px';
    }

    requestAnimationFrame(tick);
}

tick();