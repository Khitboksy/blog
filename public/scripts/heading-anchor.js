// Heading anchor links: injects a "#" copy-link into every heading of a post.
// Click = copy full URL with #hash to clipboard + smooth-scroll to the heading.
(function () {
  function initHeadingAnchors() {
    document
      .querySelectorAll('.post-content :is(h1, h2, h3, h4, h5, h6)')
      .forEach(function (heading) {
        if (
          heading.classList.contains('sr-only') ||
          heading.closest('.footnotes, [data-footnotes]') ||
          heading.querySelector('.heading-anchor')
        ) {
          return;
        }

        if (!heading.id) {
          var slug = (heading.textContent || '')
            .toLowerCase()
            .trim()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/(^-|-$)/g, '');
          if (slug) heading.id = slug;
        }
        if (!heading.id) return;

        var link = document.createElement('a');
        link.className = 'heading-anchor';
        link.href = '#' + heading.id;
        link.setAttribute(
          'aria-label',
          'Link to ' + (heading.textContent.trim() || 'section')
        );
        link.title = 'Copy link';

        var icon = document.createElement('span');
        icon.className = 'anchor-icon';
        icon.textContent = '#';

        link.appendChild(icon);

        var timer;
        link.addEventListener('click', async function (event) {
          event.preventDefault();
          // On Linux/Firefox a mouse-clicked link matches :focus-visible, which
          // would keep the anchor stuck visible after the confirmation window.
          // Keyboard activation has detail === 0, so it keeps focus (and the
          // visible anchor) for screen-keyboard users.
          if (event.detail > 0) {
            link.blur();
          }
          var url = new URL(window.location.href);
          url.hash = heading.id;
          history.pushState(null, '', url.hash);
          try {
            if (navigator.clipboard && window.isSecureContext) {
              await navigator.clipboard.writeText(url.href);
            } else {
              var textarea = document.createElement('textarea');
              textarea.value = url.href;
              textarea.style.position = 'fixed';
              textarea.style.left = '-9999px';
              textarea.style.top = '-9999px';
              textarea.style.opacity = '0';
              document.body.appendChild(textarea);
              textarea.focus();
              textarea.select();
              document.execCommand('copy');
              textarea.remove();
            }
            clearTimeout(timer);
            icon.textContent = '\u2713';
            link.classList.add('copied');
            timer = window.setTimeout(function () {
              link.classList.remove('copied');
              icon.textContent = '#';
            }, 1500);
          } catch (err) {
            console.error('Failed to copy link:', err);
          }
          heading.scrollIntoView({ behavior: 'smooth' });
        });

        heading.appendChild(link);
      });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initHeadingAnchors);
  } else {
    initHeadingAnchors();
  }
})();
