// ===== EXPLORE =====

let exploreRendered = false;

function renderExplore() {
    if (exploreRendered) return;
    exploreRendered = true;

    const grid = document.getElementById('explore-grid');
    if (!grid) return;
    grid.innerHTML = '';

    // Mix all posts + extra unsplash images
    const extraImages = [
        { image: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400&q=80', caption: 'Deep in the forest 🌲', likes: 3210 },
        { image: 'https://images.unsplash.com/photo-1518791841217-8f162f1912da?w=400&q=80', caption: 'Cute kitten day 🐱', likes: 8742 },
        { image: 'https://images.unsplash.com/photo-1504754524776-8f4f37790ca0?w=400&q=80', caption: 'Avocado toast ✨', likes: 2901 },
        { image: 'https://images.unsplash.com/photo-1518020382113-a7e8fc38eac9?w=400&q=80', caption: 'Adorable duo 🐶', likes: 11200 },
        { image: 'https://images.unsplash.com/photo-1519125323398-675f0ddb6308?w=400&q=80', caption: 'Wonder 🌸', likes: 4500 },
        { image: 'https://images.unsplash.com/photo-1503023345310-bd7c1de61c7d?w=400&q=80', caption: 'Studio vibes 🎵', likes: 6820 },
    ];

    const allItems = [
        ...POSTS.map(p => ({ image: p.image, caption: p.caption, likes: p.likes })),
        ...extraImages
    ];

    // Shuffle
    for (let i = allItems.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [allItems[i], allItems[j]] = [allItems[j], allItems[i]];
    }

    allItems.forEach((item, idx) => {
        const cell = document.createElement('div');
        cell.className = 'explore-cell';

        const img = document.createElement('img');
        img.src = item.image;
        img.alt = item.caption;
        img.loading = 'lazy';
        img.onerror = () => { img.src = 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&q=80'; };

        const overlay = document.createElement('div');
        overlay.className = 'explore-cell-overlay';
        overlay.innerHTML = `<span>❤️ ${formatCount(item.likes)}</span>`;

        cell.appendChild(img);
        cell.appendChild(overlay);

        // Click to open post if it matches a real post
        const matchPost = POSTS.find(p => p.image === item.image);
        if (matchPost) {
            cell.addEventListener('click', () => {
                navigate('feed');
                requestAnimationFrame(() => {
                    const el = document.getElementById(`post-card-${matchPost.id}`);
                    el?.scrollIntoView({ behavior: 'smooth', block: 'center' });
                });
            });
        }

        grid.appendChild(cell);
    });
}
