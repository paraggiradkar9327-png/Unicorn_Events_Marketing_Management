const portfolioData = [
    {
        title: "Corporate Event",
        category: "Events",
        image: "assets/portfolioImage/event-port-1.webp"
    },
    {
        title: "Brand Campaign",
        category: "Branding",
        image: "assets/branding-port-2.webp"
    },
    {
        title: "Brand Activation",
        category: "Activation",
        image: "assets/activation-port-1.webp"
    },
    {
        title: "Luxury Wedding",
        category: "Wedding",
        image: "assets/wedding-port-8.webp"
    },
    {
        title: "Corporate Event",
        category: "Events",
        image: "assets/event-port-img-1.webp"
    },
    {
        title: "Brand Campaign",
        category: "Branding",
        image: "assets/branding-port-2.webp"
    }
];

const portfolioGrid = document.getElementById("portfolioGrid");
const filterBtns = document.querySelectorAll(".filter-btn");

const imagePopup = document.getElementById("imagePopup");
const popupImage = document.getElementById("popupImage");
const closePopup = document.querySelector(".close-popup");

function renderPortfolio(filter = "all") {

    const filteredItems =
        filter === "all"
            ? portfolioData
            : portfolioData.filter(item => item.category === filter);

    portfolioGrid.innerHTML = filteredItems
        .map(item => `
            <div class="portfolio-card">
                <img src="${item.image}" alt="${item.title}">
               
                    <div class="portfolio-content">
                        <span>${item.category}</span>
                        <h3>${item.title}</h3>
                    </div>
              
            </div>
        `)
        .join("");
}

filterBtns.forEach(btn => {
    btn.addEventListener("click", () => {

        filterBtns.forEach(b =>
            b.classList.remove("active")
        );

        btn.classList.add("active");

        renderPortfolio(btn.dataset.filter);
    });
});

document.addEventListener("click", function (e) {

    if (e.target.closest(".portfolio-card img")) {
        popupImage.src = e.target.src;
        imagePopup.classList.add("active");
        document.body.style.overflow = "hidden";
    }

});

closePopup.addEventListener("click", () => {
    imagePopup.classList.remove("active");
    document.body.style.overflow = "auto";
});

imagePopup.addEventListener("click", (e) => {
    if (e.target === imagePopup) {
        imagePopup.classList.remove("active");
        document.body.style.overflow = "auto";
    }
});

renderPortfolio();