// Collapsible quotebox (details.qb)
//
// 1. Expand/collapse animation: the UA snaps <details> content in/out and
//    CSS cannot transition to height:auto — so we wrap the non-summary
//    content in .qb-body, drive open/close ourselves (preventDefault on
//    the summary click), transition the wrapper's measured pixel height,
//    and flip the open attribute only when the close animation ends.
//
// 2. Hover lock: after a click-close, the hover background stays hidden
//    until the pointer re-enters the bar. CSS :hover cannot distinguish
//    a continuing hover from a fresh one, so the class is managed here.
document.querySelectorAll("details.qb").forEach((details) => {
  const summary = details.querySelector("summary");
  if (!summary) return;

  // Wrap the quote content so it can be clipped while animating
  const body = document.createElement("div");
  body.className = "qb-body";
  while (summary.nextSibling) body.appendChild(summary.nextSibling);
  details.appendChild(body);

  const DURATION = 150; // matches the site-wide 0.15s ease
  let targetOpen = details.open;
  let pendingCleanup = null;

  // Transition body height to toPx, then settle at natural (auto) height.
  // `after` runs on completion only — an interrupted animation skips it.
  const run = (toPx, after) => {
    if (pendingCleanup) pendingCleanup();

    const from = body.getBoundingClientRect().height;
    body.style.height = from + "px";
    void body.offsetHeight; // reflow: commit the starting height
    body.style.height = toPx + "px";

    let ended = false;
    const finish = () => {
      if (ended) return;
      ended = true;
      clearTimeout(timer);
      body.removeEventListener("transitionend", onEnd);
      pendingCleanup = null;
      body.style.height = "";
      if (after) after();
    };
    const onEnd = (e) => {
      // our own background/transform transitions bubble up — filter them
      if (e.target === body && e.propertyName === "height") finish();
    };
    const timer = setTimeout(finish, DURATION + 100); // safety net
    body.addEventListener("transitionend", onEnd);
    pendingCleanup = () => {
      clearTimeout(timer);
      body.removeEventListener("transitionend", onEnd);
      pendingCleanup = null;
    };
  };

  const animateOpen = () => {
    const fresh = !details.open;
    if (fresh) {
      details.open = true;
      body.style.height = "0px"; // clamp before first paint (no flash)
    }
    run(body.scrollHeight, null);
  };

  const animateClose = () => {
    run(0, () => {
      details.open = false;
    });
  };

  const reducedMotion = () =>
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  summary.addEventListener("click", (e) => {
    e.preventDefault(); // we drive the toggle ourselves
    targetOpen = !targetOpen;

    if (targetOpen) {
      summary.classList.remove("qb-lock");
      if (reducedMotion()) {
        if (pendingCleanup) pendingCleanup();
        body.style.height = "";
        details.open = true;
        return;
      }
      animateOpen();
    } else {
      summary.classList.add("qb-lock"); // CSS scopes this to :not([open])
      if (reducedMotion()) {
        if (pendingCleanup) pendingCleanup();
        body.style.height = "";
        details.open = false;
        return;
      }
      animateClose();
    }
  });

  // Any boundary crossing counts as a fresh hover
  const unlock = () => summary.classList.remove("qb-lock");
  summary.addEventListener("mouseenter", unlock);
  summary.addEventListener("mouseleave", unlock);
});
