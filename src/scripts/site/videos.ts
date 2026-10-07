/** Swap a video thumbnail for the YouTube player when it is clicked. */
export function initVideos(): void {
  document.addEventListener('click', (event) => {
    if (event.defaultPrevented || event.button !== 0) return;
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;

    const link = (event.target as Element).closest<HTMLAnchorElement>('a[data-video-id]');
    const id = link?.dataset.videoId;
    if (!link || !id) return;

    event.preventDefault();

    const player = document.createElement('iframe');
    player.className = 'video-frame';
    player.src = `https://www.youtube-nocookie.com/embed/${encodeURIComponent(id)}?autoplay=1&rel=0`;
    player.title = link.dataset.videoTitle ?? 'YouTube video';
    player.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share';
    player.allowFullscreen = true;

    // The row widens so the player is not thumbnail-sized
    link.closest('[data-video-row]')?.classList.add('is-playing');
    link.replaceWith(player);
    player.focus();
    document.dispatchEvent(new CustomEvent('cube:content-changed'));
  });
}
