// ===== FEED =====

function renderFeed() {
    const feed = document.getElementById('posts-feed');
    if (!feed) return;
    feed.innerHTML = '';
    POSTS.forEach(post => {
        feed.appendChild(createPostCard(post));
    });
}

function createPostCard(post) {
    const user = getUserById(post.userId);
    const card = document.createElement('div');
    card.className = 'post-card';
    card.id = `post-card-${post.id}`;

    card.innerHTML = `
    <div class="post-header">
      <div class="post-avatar-wrap">
        <img src="${user.avatar}" alt="${user.username}" class="post-avatar" onclick="navigate('profile')" />
      </div>
      <div class="post-user-info">
        <span class="post-username" onclick="navigate('profile')">${user.username}</span>
        ${post.location ? `<span class="post-location">${post.location}</span>` : ''}
      </div>
      <button class="post-more-btn" title="More options">•••</button>
    </div>

    <div class="post-image-wrap" id="img-wrap-${post.id}">
      <img src="${post.image}" alt="${escapeHtml(post.caption)}" class="post-image" loading="lazy" />
      <div class="post-heart-overlay" id="heart-overlay-${post.id}">❤️</div>
    </div>

    <div class="post-actions">
      <button class="post-action-btn like-btn ${post.liked ? 'liked' : ''}"
              id="like-btn-${post.id}"
              onclick="toggleLike(${post.id})">
        <span class="heart-icon">${post.liked ? '❤️' : '🤍'}</span>
      </button>
      <button class="post-action-btn" onclick="openPostModal(${post.id})" title="Comment">💬</button>
      <button class="post-action-btn" onclick="sharePost(${post.id})" title="Share">✈️</button>
      <button class="post-action-btn post-save-btn" id="save-btn-${post.id}"
              onclick="toggleSave(${post.id})" title="Save">
        ${post.saved ? '🔖' : '🏷️'}
      </button>
    </div>

    <div class="post-likes-count" id="likes-count-${post.id}">
      ${formatCount(post.likes)} likes
    </div>

    <div class="post-caption">
      <strong onclick="navigate('profile')">${user.username}</strong>
      ${renderCaption(post.caption)}
    </div>

    ${renderCommentsPreview(post)}

    <div class="post-time">${post.time}</div>

    <div class="post-comment-input-row">
      <input type="text"
             class="post-comment-input"
             id="comment-input-${post.id}"
             placeholder="Add a comment…"
             oninput="toggleCommentBtn(${post.id})" />
      <button class="post-comment-submit"
              id="comment-submit-${post.id}"
              onclick="addComment(${post.id})">Post</button>
    </div>
  `;

    // Double-tap / double-click to like
    const imgWrap = card.querySelector('.post-image-wrap');
    let lastTap = 0;
    imgWrap.addEventListener('dblclick', () => doubleTapLike(post.id));
    imgWrap.addEventListener('touchend', () => {
        const now = Date.now();
        if (now - lastTap < 300) doubleTapLike(post.id);
        lastTap = now;
    });

    return card;
}

function renderCaption(caption) {
    return escapeHtml(caption).replace(/#(\w+)/g, '<span class="post-tags">#$1</span>');
}

function renderCommentsPreview(post) {
    if (!post.comments || post.comments.length === 0) return '';
    const shown = post.comments.slice(0, 2);
    let html = '';
    if (post.comments.length > 2) {
        html += `<div class="post-comments-preview" onclick="openPostModal(${post.id})">
      View all ${post.comments.length} comments
    </div>`;
    }
    shown.forEach(c => {
        html += `<div class="post-comment-row">
      <span class="post-comment-user">${c.username}</span>
      <span>${escapeHtml(c.text)}</span>
    </div>`;
    });
    return html;
}

// ---- Like ----
function toggleLike(postId) {
    const post = POSTS.find(p => p.id === postId);
    if (!post) return;
    post.liked = !post.liked;
    post.likes += post.liked ? 1 : -1;

    const btn = document.getElementById(`like-btn-${postId}`);
    const countEl = document.getElementById(`likes-count-${postId}`);

    if (btn) {
        btn.classList.toggle('liked', post.liked);
        const heartIcon = btn.querySelector('.heart-icon');
        if (heartIcon) {
            heartIcon.textContent = post.liked ? '❤️' : '🤍';
            btn.classList.remove('liked');
            void btn.offsetWidth;
            btn.classList.toggle('liked', post.liked);
        }
    }
    if (countEl) countEl.textContent = `${formatCount(post.likes)} likes`;

    if (post.liked) showToast('❤️ Added to liked posts');
}

function doubleTapLike(postId) {
    const post = POSTS.find(p => p.id === postId);
    if (!post || post.liked) return; // only like, not unlike

    const overlay = document.getElementById(`heart-overlay-${postId}`);
    if (overlay) {
        overlay.classList.remove('show');
        void overlay.offsetWidth;
        overlay.classList.add('show');
        setTimeout(() => overlay.classList.remove('show'), 700);
    }
    toggleLike(postId);
}

// ---- Save ----
function toggleSave(postId) {
    const post = POSTS.find(p => p.id === postId);
    if (!post) return;
    post.saved = !post.saved;

    const btn = document.getElementById(`save-btn-${postId}`);
    if (btn) btn.textContent = post.saved ? '🔖' : '🏷️';

    showToast(post.saved ? '🔖 Saved to your collection' : 'Removed from saved');
}

// ---- Comment ----
function toggleCommentBtn(postId) {
    const input = document.getElementById(`comment-input-${postId}`);
    const submit = document.getElementById(`comment-submit-${postId}`);
    if (submit) submit.classList.toggle('active', input?.value?.trim().length > 0);
}

function addComment(postId) {
    const input = document.getElementById(`comment-input-${postId}`);
    const text = input?.value?.trim();
    if (!text) return;

    const post = POSTS.find(p => p.id === postId);
    if (!post) return;
    post.comments.push({ username: CURRENT_USER.username, text, time: 'now' });
    input.value = '';
    toggleCommentBtn(postId);

    // Refresh card
    refreshPostCard(postId);
    showToast('💬 Comment added!');
}

function refreshPostCard(postId) {
    const old = document.getElementById(`post-card-${postId}`);
    if (!old) return;
    const post = POSTS.find(p => p.id === postId);
    if (!post) return;
    const newCard = createPostCard(post);
    old.replaceWith(newCard);
}

// ---- Share ----
function sharePost(postId) {
    const post = POSTS.find(p => p.id === postId);
    if (!post) return;
    // Try native share; fallback to toast
    if (navigator.share) {
        navigator.share({ title: 'Check this post on Pixgram!', text: post.caption }).catch(() => { });
    } else {
        showToast('🔗 Link copied to clipboard!');
    }
}

// ---- Suggestions ----
function renderSuggestions() {
    const container = document.getElementById('rp-suggestions');
    if (!container) return;
    container.innerHTML = '';

    SUGGESTIONS.forEach(user => {
        const div = document.createElement('div');
        div.className = 'rp-suggestion-item';
        div.innerHTML = `
      <img src="${user.avatar}" alt="${user.username}" class="rp-sug-avatar" />
      <div class="rp-sug-info">
        <div class="rp-sug-username">${user.username}</div>
        <div class="rp-sug-reason">Suggested for you</div>
      </div>
      <button class="rp-follow-btn ${user.following ? 'following' : ''}"
              id="sug-follow-${user.id}"
              onclick="toggleFollow(${user.id})">${user.following ? 'Following' : 'Follow'}</button>
    `;
        container.appendChild(div);
    });
}

function toggleFollow(userId) {
    const user = SUGGESTIONS.find(u => u.id === userId);
    if (!user) return;
    user.following = !user.following;
    const btn = document.getElementById(`sug-follow-${userId}`);
    if (btn) {
        btn.textContent = user.following ? 'Following' : 'Follow';
        btn.classList.toggle('following', user.following);
    }
    showToast(user.following ? `✅ Following ${user.username}` : `Unfollowed ${user.username}`);
}
