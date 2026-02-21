// ===== APP ENTRY POINT =====

let currentPage = 'feed';
let activePostId = null;  // for detail modal

// ---- Navigation ----
function navigate(page) {
    const pages = document.querySelectorAll('.page');
    pages.forEach(p => p.classList.remove('active'));
    document.getElementById(`page-${page}`)?.classList.add('active');

    // Sidebar
    document.querySelectorAll('.nav-item[data-page]').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.page === page);
    });

    // Bottom nav
    document.querySelectorAll('.bn-item[data-page]').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.page === page);
    });

    currentPage = page;

    // Render correct page
    if (page === 'explore') renderExplore();
    if (page === 'profile') renderProfile(CURRENT_USER);
}

// ---- Theme ----
function toggleTheme() {
    const html = document.documentElement;
    const isDark = html.getAttribute('data-theme') === 'dark';
    html.setAttribute('data-theme', isDark ? 'light' : 'dark');
    localStorage.setItem('pixgram-theme', isDark ? 'light' : 'dark');

    const icon = document.getElementById('theme-icon');
    const iconMob = document.getElementById('theme-icon-mobile');
    const newIcon = isDark ? '🌙' : '☀️';
    const label = document.querySelector('#theme-toggle .nav-label');
    if (icon) icon.textContent = newIcon;
    if (iconMob) iconMob.textContent = newIcon;
    if (label) label.textContent = isDark ? 'Dark Mode' : 'Light Mode';
}

// ---- Toast ----
function showToast(msg, duration = 2500) {
    const t = document.getElementById('toast');
    t.textContent = msg;
    t.classList.add('show');
    clearTimeout(t._timer);
    t._timer = setTimeout(() => t.classList.remove('show'), duration);
}

// ---- Init ----
document.addEventListener('DOMContentLoaded', () => {
    // Restore theme
    const saved = localStorage.getItem('pixgram-theme') || 'light';
    document.documentElement.setAttribute('data-theme', saved);
    const icon = document.getElementById('theme-icon');
    const iconMob = document.getElementById('theme-icon-mobile');
    const label = document.querySelector('#theme-toggle .nav-label');
    if (saved === 'dark') {
        if (icon) icon.textContent = '☀️';
        if (iconMob) iconMob.textContent = '☀️';
        if (label) label.textContent = 'Light Mode';
    }

    renderStories();
    renderFeed();
    renderSuggestions();

    // Navigate to feed
    navigate('feed');
});

// ---- Post Detail Modal ----
function openPostModal(postId) {
    activePostId = postId;
    const post = POSTS.find(p => p.id === postId);
    const user = getUserById(post.userId);

    document.getElementById('post-detail-image').src = post.image;
    document.getElementById('post-detail-image').alt = post.caption;
    document.getElementById('post-detail-avatar').src = user.avatar;
    document.getElementById('post-detail-username').textContent = user.username;
    document.getElementById('post-detail-location').textContent = post.location || '';

    // Comments
    const commentsEl = document.getElementById('post-detail-comments');
    commentsEl.innerHTML = '';
    // Caption as first "comment"
    const capDiv = document.createElement('div');
    capDiv.className = 'post-comment-row';
    capDiv.innerHTML = `<span class="post-comment-user">${user.username}</span><span>${escapeHtml(post.caption)}</span>`;
    commentsEl.appendChild(capDiv);

    post.comments.forEach(c => {
        const div = document.createElement('div');
        div.className = 'post-comment-row';
        div.style.marginBottom = '8px';
        div.innerHTML = `<span class="post-comment-user">${c.username}</span><span>${escapeHtml(c.text)}</span>`;
        commentsEl.appendChild(div);
    });

    // Actions
    const actionsEl = document.getElementById('post-detail-actions');
    actionsEl.innerHTML = `
    <button class="post-action-btn like-btn ${post.liked ? 'liked' : ''}"
            onclick="toggleLike(${post.id}); renderDetailActions()">
      <span class="heart-icon">${post.liked ? '❤️' : '🤍'}</span>
    </button>
    <button class="post-action-btn" onclick="focusDetailComment()">💬</button>
    <button class="post-action-btn post-save-btn ${post.saved ? 'saved' : ''}"
            onclick="toggleSave(${post.id}); renderDetailActions()">
      ${post.saved ? '🔖' : '🏷️'}
    </button>
    <div style="flex:1"></div>
    <div style="font-size:14px;font-weight:700;">${formatCount(post.likes)} likes</div>
  `;

    document.getElementById('post-modal').style.display = 'flex';
    document.body.style.overflow = 'hidden';
}

function renderDetailActions() {
    if (!activePostId) return;
    const post = POSTS.find(p => p.id === activePostId);
    const actionsEl = document.getElementById('post-detail-actions');
    if (!actionsEl) return;
    actionsEl.innerHTML = `
    <button class="post-action-btn like-btn ${post.liked ? 'liked' : ''}"
            onclick="toggleLike(${post.id}); renderDetailActions()">
      <span class="heart-icon">${post.liked ? '❤️' : '🤍'}</span>
    </button>
    <button class="post-action-btn" onclick="focusDetailComment()">💬</button>
    <button class="post-action-btn post-save-btn"
            onclick="toggleSave(${post.id}); renderDetailActions()">
      ${post.saved ? '🔖' : '🏷️'}
    </button>
    <div style="flex:1"></div>
    <div style="font-size:14px;font-weight:700;">${formatCount(post.likes)} likes</div>
  `;
}

function focusDetailComment() {
    document.getElementById('post-detail-comment-box')?.focus();
}

function postDetailComment() {
    const input = document.getElementById('post-detail-comment-box');
    const text = input?.value?.trim();
    if (!text || !activePostId) return;
    const post = POSTS.find(p => p.id === activePostId);
    post.comments.push({ username: CURRENT_USER.username, text, time: 'now' });
    input.value = '';
    // Re-render comments
    const commentsEl = document.getElementById('post-detail-comments');
    const div = document.createElement('div');
    div.className = 'post-comment-row';
    div.style.marginBottom = '8px';
    div.innerHTML = `<span class="post-comment-user">${CURRENT_USER.username}</span><span>${escapeHtml(text)}</span>`;
    commentsEl.appendChild(div);
    commentsEl.scrollTop = commentsEl.scrollHeight;
    // Refresh feed card
    refreshPostCard(activePostId);
}

function closePostModal(event) {
    if (event && event.target !== document.getElementById('post-modal')) return;
    document.getElementById('post-modal').style.display = 'none';
    document.body.style.overflow = '';
    activePostId = null;
}

// ---- Utility ----
function escapeHtml(str) {
    return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
}
