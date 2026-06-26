document.querySelectorAll('.post-content pre').forEach((pre) => {
  const btn = document.createElement('button');
  btn.className = 'copy-btn';
  const img = document.createElement('img');
  img.src = '/blog/icons/copy.svg';
  img.width = 16;
  img.height = 16;
  img.alt = 'Copy code';
  btn.appendChild(img);
  btn.addEventListener('click', async () => {
    const code = pre.querySelector('code');
    if (!code) return;
    try {
      await navigator.clipboard.writeText(code.textContent);
      btn.innerHTML = 'Copied!';
      setTimeout(() => { btn.innerHTML = ''; btn.appendChild(img); }, 2000);
    } catch {
      btn.innerHTML = 'Failed';
      setTimeout(() => { btn.innerHTML = ''; btn.appendChild(img); }, 2000);
    }
  });
  pre.appendChild(btn);
});
