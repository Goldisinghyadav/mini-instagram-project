// ===== SEARCH =====

function openSearch() {
    document.getElementById('search-modal').style.display = 'flex';
    document.body.style.overflow = 'hidden';
    setTimeout(() => document.getElementById('search-input')?.focus(), 60);
    handleSearch('');
}

function closeSearch(event) {
    if (event) {
        const card = document.querySelector('.search-card');
        if (card && card.contains(event.target)) return;
    }
    document.getElementById('search-modal').style.display = 'none';
    document.body.style.overflow = '';
    const input = document.getElementById('search-input');
    if (input) input.value = '';
}

function handleSearch(query) {
    const results = document.getElementById('search-results');
    if (!results) return;
    query = query.toLowerCase().trim();

    // Combine all users + tags
    const allUsers = [CURRENT_USER, ...USERS];
    const filteredUsers = query
        ? allUsers.filter(u =>
            u.username.toLowerCase().includes(query) ||
            u.name.toLowerCase().includes(query)
        )
        : allUsers.slice(0, 6);

    // Also search by hashtag
    const hashResults = query.startsWith('#') || query
        ? POSTS.filter(p => p.tags && p.tags.some(t => t.toLowerCase().includes(query.replace('#', ''))))
        : [];

    results.innerHTML = '';

    if (filteredUsers.length === 0 && hashResults.length === 0) {
        results.innerHTML = `<div class="search-empty">No results for "${query}"</div>`;
        return;
    }

    filteredUsers.forEach(user => {
        const item = document.createElement('div');
        item.className = 'search-result-item';
        item.innerHTML = `
      <img src="${user.avatar}" alt="${user.username}" class="search-result-avatar" />
      <div>
        <div class="search-result-username">${user.username}</div>
        <div class="search-result-name">${user.name} · ${formatCount(user.followers)} followers</div>
      </div>
    `;
        item.addEventListener('click', () => {
            closeSearch();
            if (user.id === CURRENT_USER.id) {
                navigate('profile');
            } else {
                // Render a different user's profile temporarily
                document.getElementById('profile-layout').innerHTML = '';
                navigate('profile');
                renderProfile(user);
            }
        });
        results.appendChild(item);
    });

    // Show tag results header if any
    if (hashResults.length > 0 && query) {
        const header = document.createElement('div');
        header.style.cssText = 'padding:8px 18px;font-size:12px;font-weight:600;color:var(--text-secondary);text-transform:uppercase;letter-spacing:.5px;border-top:1px solid var(--border-color);margin-top:4px';
        header.textContent = 'Hashtags';
        results.appendChild(header);

        const uniqueTags = [...new Set(hashResults.flatMap(p => p.tags).filter(t => t.toLowerCase().includes(query.replace('#', ''))))];
        uniqueTags.slice(0, 4).forEach(tag => {
            const item = document.createElement('div');
            item.className = 'search-result-item';
            item.innerHTML = `
        <div style="width:46px;height:46px;border-radius:50%;background:var(--accent-grad);display:flex;align-items:center;justify-content:center;font-size:20px;color:white;flex-shrink:0">#</div>
        <div>
          <div class="search-result-username">#${tag}</div>
          <div class="search-result-name">${hashResults.filter(p => p.tags.includes(tag)).length} posts</div>
        </div>
      `;
            item.addEventListener('click', () => {
                closeSearch();
                navigate('explore');
                showToast(`#${tag} – Showing explore`);
            });
            results.appendChild(item);
        });
    }
}
