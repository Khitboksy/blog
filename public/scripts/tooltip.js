document.querySelectorAll('.tooltip').forEach((el) => {
  el.addEventListener('mouseenter', (e) => {
    const tooltipWidth = parseFloat(getComputedStyle(el, '::after').width) || 0;
    const rect = el.getClientRects()[0];
    if (!rect) return;
    const boundary = document.body.getBoundingClientRect().right;

    let left = e.clientX;
    const tipRight = left + tooltipWidth;
    if (tipRight > boundary - 12) left = boundary - 12 - tooltipWidth;
    if (left < 12) left = 12;

    el.style.setProperty('--tooltip-top', `${rect.top + 20}px`);
    el.style.setProperty('--tooltip-left', `${left}px`);
  });
  el.addEventListener('mouseleave', () => {
    el.style.setProperty('--tooltip-top', '-9999px');
    el.style.setProperty('--tooltip-left', '-9999px');
  });
});
