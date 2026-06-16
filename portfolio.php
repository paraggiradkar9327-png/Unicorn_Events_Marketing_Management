<?php
$categories = ['Events', 'Branding', 'Activation', 'Wedding'];
?>

<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Portfolio — Unicorn Events</title>

    <meta name="description"
        content="Explore Unicorn Events portfolio featuring events, branding, activations and weddings." />

    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>

    <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700&family=Inter:wght@300;400;500;600&display=swap"
        rel="stylesheet">

    <link rel="stylesheet" href="./css/style.css">
    <link rel="stylesheet" href="./css/portfolio.css">
</head>

<body>

    <!-- NAVBAR -->
    <div data-component="navbar"></div>

    <section class="portfolio-section">
        <div class="container">

            <div class="section-header">
                <span class="sub-title">OUR WORK</span>
                <h2>Featured Portfolio</h2>
            </div>

            <div class="portfolio-filter">
                <button class="filter-btn active" data-filter="all">All</button>
                <button class="filter-btn" data-filter="Events">Events</button>
                <button class="filter-btn" data-filter="Branding">Branding</button>
                <button class="filter-btn" data-filter="Activation">Activation</button>
                <button class="filter-btn" data-filter="Wedding">Wedding</button>
            </div>

            <div class="portfolio-grid" id="portfolioGrid">

                <?php
                foreach ($categories as $category) {

                    $images = glob(
                        "assets/portfolio/$category/*.{jpg,jpeg,png,webp,JPG,JPEG,PNG,WEBP}",
                        GLOB_BRACE
                    );

                    foreach ($images as $image) {
                        ?>

                        <div class="portfolio-item"
                             data-category="<?php echo $category; ?>">

                            <img src="<?php echo $image; ?>"
                                 alt="<?php echo basename($image); ?>"
                                 loading="lazy">

                        </div>

                        <?php
                    }
                }
                ?>

            </div>

        </div>
    </section>

    <!-- IMAGE POPUP -->
    <div class="image-popup" id="imagePopup">
        <span class="close-popup">&times;</span>
        <img id="popupImage" src="" alt="">
    </div>

    <!-- FOOTER -->
    <div data-component="footer"></div>

    <script src="js/components.js"></script>

    <script>

        // Filter Portfolio
        const filterBtns = document.querySelectorAll('.filter-btn');
        const portfolioItems = document.querySelectorAll('.portfolio-item');

        filterBtns.forEach(btn => {

            btn.addEventListener('click', () => {

                const filter = btn.dataset.filter;

                filterBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');

                portfolioItems.forEach(item => {

                    if (
                        filter === 'all' ||
                        item.dataset.category === filter
                    ) {
                        item.style.display = 'block';
                    } else {
                        item.style.display = 'none';
                    }

                });

            });

        });


        // Image Popup
        const popup = document.getElementById('imagePopup');
        const popupImage = document.getElementById('popupImage');
        const closePopup = document.querySelector('.close-popup');

        document.querySelectorAll('.portfolio-item img').forEach(img => {

            img.addEventListener('click', () => {

                popup.style.display = 'flex';
                popupImage.src = img.src;

            });

        });

        closePopup.addEventListener('click', () => {

            popup.style.display = 'none';

        });

        popup.addEventListener('click', (e) => {

            if (e.target === popup) {
                popup.style.display = 'none';
            }

        });

    </script>

</body>

</html>
