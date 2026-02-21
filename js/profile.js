// ===== PROFILE =====

function renderProfile(user) {
    const layout = document.getElementById('profile-layout');
    if (!layout) return;

    const isOwn = user.id === CURRENT_USER.id;

    layout.innerHTML = `
    <div class="profile-header">
      <div class="profile-avatar-wrap">
        <img src="${user.avatar}" alt="${user.username}" class="profile-avatar" />
      </div>
      <div class="profile-info">
        <div class="profile-username-row">
          <span class="profile-username">${user.username}</span>
          ${isOwn
            ? `<button class="profile-edit-btn" onclick="showToast('✏️ Edit profile coming soon!')">Edit Profile</button>
               <button class="profile-settings-btn" onclick="showToast('⚙️ Settings coming soon!')">⚙️</button>`
            : `<button class="profile-edit-btn" style="color:var(--blue);border-color:var(--blue)"
                       onclick="showToast('✅ Following ${user.username}!')">Follow</button>
               <button class="profile-settings-btn" onclick="showToast('💬 Message coming soon!')">💬</button>`
        }
        </div>
        <div class="profile-stats">
          <div class="profile-stat">
            <span class="stat-value">${user.posts.length || formatCount(CURRENT_USER.posts.length)}</span>
            <span class="stat-label">posts</span>
          </div>
          <div class="profile-stat">
            <span class="stat-value">${formatCount(user.followers)}</span>
            <span class="stat-label">followers</span>
          </div>
          <div class="profile-stat">
            <span class="stat-value">${formatCount(user.following)}</span>
            <span class="stat-label">following</span>
          </div>
        </div>
        <div class="profile-bio-name">${user.name}</div>
        <div class="profile-bio-text">${user.bio || ''}</div>
        ${user.website ? `<div class="profile-website"><a href="#" onclick="showToast('🌐 ${user.website}'); return false;">🔗 ${user.website}</a></div>` : ''}
      </div>
    </div>

    <div class="profile-posts-grid" id="profile-posts-grid">
      ${renderProfileGrid(user)}
    </div>
  `;
}

function renderProfileGrid(user) {
    const posts = user.posts && user.posts.length > 0
        ? user.posts
        : POSTS.filter(p => p.userId === user.id).map(p => ({ id: p.id, image: p.image }));

    if (!posts || posts.length === 0) {
        return `<div style="grid-column:span 3;text-align:center;padding:60px;color:var(--text-secondary)">
      <div style="font-size:48px;margin-bottom:12px">📸</div>
      <div style="font-size:16px;font-weight:600">No Posts Yet</div>
    </div>`;
    }

    return posts.map(p => {
        const fullPost = POSTS.find(fp => fp.id === p.id);
        const likes = fullPost ? formatCount(fullPost.likes) : '';
        const comments = fullPost ? fullPost.comments.length : 0;
        return `
      <div class="profile-post-cell" onclick="${fullPost ? `openPostModal(${fullPost.id})` : ''}">
        <img src="${p.image}" alt="Post" loading="lazy" />
        <div class="profile-post-overlay">
          ${likes ? `<span>❤️ ${likes}</span>` : ''}
          ${comments ? `<span>💬 ${comments}</span>` : ''}
        </div>
      </div>
    `;
    }).join('');
}
