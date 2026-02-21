// ===== STORIES =====

let currentStoryIndex = 0;
let storyTimer = null;
const STORY_DURATION = 5000; // ms

function renderStories() {
    const container = document.getElementById('stories-container');
    if (!container) return;
    container.innerHTML = '';

    STORIES.forEach((story, idx) => {
        const item = document.createElement('div');
        item.className = 'story-item';
        item.setAttribute('id', `story-item-${story.id}`);

        const ringWrap = document.createElement('div');
        ringWrap.className = 'story-ring-wrap' +
            (story.isOwn ? ' no-ring' : story.hasNew ? '' : ' seen');

        const avatar = document.createElement('img');
        avatar.src = story.avatar;
        avatar.alt = story.username;
        avatar.className = 'story-avatar';

        ringWrap.appendChild(avatar);

        if (story.isOwn) {
            const addBtn = document.createElement('div');
            addBtn.className = 'story-add-btn';
            addBtn.textContent = '+';
            ringWrap.appendChild(addBtn);
        }

        const label = document.createElement('span');
        label.className = 'story-label';
        label.textContent = story.isOwn ? 'Your story' : story.username;

        item.appendChild(ringWrap);
        item.appendChild(label);

        item.addEventListener('click', () => openStoryModal(idx));
        container.appendChild(item);
    });
}

function openStoryModal(idx) {
    currentStoryIndex = idx;
    document.getElementById('story-modal').style.display = 'flex';
    document.body.style.overflow = 'hidden';
    showStory(idx);
}

function showStory(idx) {
    clearTimeout(storyTimer);
    const story = STORIES[idx];
    if (!story) {
        closeStoryModal();
        return;
    }
    currentStoryIndex = idx;

    document.getElementById('story-image').src = story.image;
    document.getElementById('story-user-avatar').src = story.avatar;
    document.getElementById('story-username').textContent = story.username;
    document.getElementById('story-time').textContent = story.time;

    // Hide prev/next if on edges
    document.getElementById('story-prev-btn').style.display = idx === 0 ? 'none' : 'flex';
    document.getElementById('story-next-btn').style.display = idx === STORIES.length - 1 ? 'none' : 'flex';

    // Mark as seen
    story.hasNew = false;
    const ringWrap = document.querySelector(`#story-item-${story.id} .story-ring-wrap`);
    if (ringWrap && !story.isOwn) {
        ringWrap.classList.add('seen');
        ringWrap.classList.remove('');
    }

    // Animate progress bar
    const fill = document.getElementById('story-progress-fill');
    fill.style.transition = 'none';
    fill.style.width = '0%';
    // Force reflow
    fill.offsetWidth;
    fill.style.transition = `width ${STORY_DURATION}ms linear`;
    fill.style.width = '100%';

    // Auto advance
    storyTimer = setTimeout(() => nextStory(), STORY_DURATION);
}

function nextStory() {
    if (currentStoryIndex < STORIES.length - 1) {
        showStory(currentStoryIndex + 1);
    } else {
        closeStoryModal();
    }
}

function prevStory() {
    if (currentStoryIndex > 0) {
        showStory(currentStoryIndex - 1);
    }
}

function closeStoryModal(event) {
    if (event) {
        // Only close if clicking directly on overlay or via code
        const viewer = document.getElementById('story-viewer');
        if (viewer && viewer.contains(event.target)) return;
    }
    clearTimeout(storyTimer);
    document.getElementById('story-modal').style.display = 'none';
    document.body.style.overflow = '';
    // Reset progress
    const fill = document.getElementById('story-progress-fill');
    if (fill) { fill.style.transition = 'none'; fill.style.width = '0%'; }
}

// Close on ESC
document.addEventListener('keydown', e => {
    if (e.key === 'Escape') {
        if (document.getElementById('story-modal').style.display !== 'none') closeStoryModal();
        if (document.getElementById('post-modal').style.display !== 'none') closePostModal();
        if (document.getElementById('search-modal').style.display !== 'none') closeSearch();
    }
    if (e.key === 'ArrowRight') nextStory();
    if (e.key === 'ArrowLeft') prevStory();
});
