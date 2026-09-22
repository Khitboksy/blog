/**
 * Tooltip system
 *   .tooltip         - hover-based context tooltips (original behavior)
 *   .tooltip-media   - hover + click-toggle media tooltips
 *
 * Media tooltip rules:
 *   - Hover trigger  -> popup appears
 *   - Leave trigger  -> popup hides + audio stops (unless frozen or moving to popup)
 *   - Click trigger  -> popup freezes open (survives mouse-leave)
 *   - Click again    -> unfreeze, hide, stop audio
 *   - Click away     -> unfreeze, hide, stop audio
 *   - Hover popup    -> keeps it open (popup is in the hover zone)
 *   - Audio stops whenever popup hides
 */
(function () {
  /* Context tooltips  (.tooltip) - hover only */
  document.querySelectorAll(".tooltip").forEach((el) => {
    el.addEventListener("mouseenter", (e) => {
      const tooltipWidth =
        parseFloat(getComputedStyle(el, "::after").width) || 0;
      const rect = el.getClientRects()[0];
      if (!rect) return;
      const boundary = document.body.getBoundingClientRect().right;

      let left = e.clientX;
      const tipRight = left + tooltipWidth;
      if (tipRight > boundary - 12) left = boundary - 12 - tooltipWidth;
      if (left < 12) left = 12;

      el.style.setProperty("--tooltip-top", `${rect.top + 20}px`);
      el.style.setProperty("--tooltip-left", `${left}px`);
    });
    el.addEventListener("mouseleave", () => {
      el.style.setProperty("--tooltip-top", "-9999px");
      el.style.setProperty("--tooltip-left", "-9999px");
    });

    // Click/tap toggle for mobile
    el.addEventListener("click", (e) => {
      e.stopPropagation();
      const rect = el.getClientRects()[0];
      if (!rect) return;
      el.style.setProperty("--tooltip-top", `${rect.bottom + 6}px`);
      el.style.setProperty("--tooltip-left", `${rect.left}px`);
      el.classList.toggle("tooltip-active");
    });
  });

  document.addEventListener("click", () => {
    document.querySelectorAll(".tooltip-active").forEach((el) => {
      el.classList.remove("tooltip-active");
      el.style.setProperty("--tooltip-top", "-9999px");
      el.style.setProperty("--tooltip-left", "-9999px");
    });
  });

  /* Media tooltips  (.tooltip-media) - hover + click-toggle */

  /** Currently open media tooltip (only one at a time). */
  let activeMedia = null;

  /** Delay in ms before closing on hover-leave (allows mouse to travel to popup). */
  const HOVER_DELAY = 150;

  /** Hide + stop audio for the given media tooltip state object. */
  function closeMediaTooltip(state) {
    if (!state) return;
    clearTimeout(state.closeTimer);
    state.closeTimer = null;
    state.frozen = false;
    state.hovering = false;
    if (state.popup) {
      state.popup.classList.remove("visible");
      // Pause and reset audio
      const a = state.popup.querySelector("audio");
      if (a) {
        a.pause();
        a.currentTime = 0;
      }
    }
    state.trigger.classList.remove("active");
    if (activeMedia === state) activeMedia = null;
  }

  /** Schedule close with delay (cancelled if mouse enters popup/trigger). */
  function scheduleClose(state) {
    if (state.frozen) return;
    clearTimeout(state.closeTimer);
    state.closeTimer = setTimeout(() => {
      if (!state.hovering && !state.frozen) closeMediaTooltip(state);
    }, HOVER_DELAY);
  }

  /** Cancel any pending close. */
  function cancelClose(state) {
    clearTimeout(state.closeTimer);
    state.closeTimer = null;
  }

  /** Position popup below trigger, clamped to viewport. */
  function positionPopup(trigger, popup) {
    const rect = trigger.getBoundingClientRect();
    const pw = popup.offsetWidth || 280;
    const ph = popup.offsetHeight || 80;
    const vw = window.innerWidth;
    const vh = window.innerHeight;

    let top = rect.bottom + 6;
    let left = rect.left + rect.width / 2 - pw / 2;

    // Clamp horizontal
    if (left < 8) left = 8;
    if (left + pw > vw - 8) left = vw - 8 - pw;

    // If below viewport, flip above
    if (top + ph > vh - 8) top = rect.top - ph - 6;

    popup.style.top = top + "px";
    popup.style.left = left + "px";
  }

  /** Format seconds -> m:ss */
  function fmt(s) {
    if (!isFinite(s)) return "0:00";
    const m = Math.floor(s / 60);
    const sec = Math.floor(s % 60);
    return m + ":" + String(sec).padStart(2, "0");
  }

  /**
   * Build the minibar DOM inside a popup element.
   * Returns an object with references to the key elements.
   */
  function buildMinibar(popup, src, shortLabel) {
    popup.innerHTML = "";

    // Label
    const lbl = document.createElement("div");
    lbl.className = "tm-label";
    lbl.textContent = shortLabel || "";
    popup.appendChild(lbl);

    // Controls row
    const row = document.createElement("div");
    row.className = "tm-row";
    popup.appendChild(row);

    // Play / pause
    const playBtn = document.createElement("button");
    playBtn.className = "tm-playpause";
    playBtn.setAttribute("aria-label", "Play / Pause");
    playBtn.innerHTML =
      '<svg class="tm-icon tm-icon-play" viewBox="0 0 24 24" fill="currentColor"><polygon points="5,3 19,12 5,21"/></svg>' +
      '<svg class="tm-icon tm-icon-pause" viewBox="0 0 24 24" fill="currentColor" style="display:none"><rect x="5" y="3" width="4" height="18"/><rect x="15" y="3" width="4" height="18"/></svg>';
    row.appendChild(playBtn);

    // Progress
    const progressWrap = document.createElement("div");
    progressWrap.className = "tm-progress-wrap";
    const progressBar = document.createElement("div");
    progressBar.className = "tm-progress-bar";
    const progressFilled = document.createElement("div");
    progressFilled.className = "tm-progress-filled";
    const progressHandle = document.createElement("div");
    progressHandle.className = "tm-progress-handle";
    progressBar.appendChild(progressFilled);
    progressBar.appendChild(progressHandle);
    progressWrap.appendChild(progressBar);
    row.appendChild(progressWrap);

    // Time
    const time = document.createElement("span");
    time.className = "tm-time";
    time.textContent = "0:00";
    row.appendChild(time);

    // Volume icon + hover bar
    const volWrap = document.createElement("div");
    volWrap.className = "tm-volume";
    volWrap.innerHTML =
      '<svg class="tm-icon tm-volume-icon" viewBox="0 0 24 24" fill="currentColor">' +
      '<polygon points="3,9 7,9 12,4 12,20 7,15 3,15"/>' +
      '<path d="M16 8.5c0 0 2.5 1.5 2.5 3.5s-2.5 3.5-2.5 3.5" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>' +
      "</svg>";
    const volBar = document.createElement("div");
    volBar.className = "tm-volume-bar";
    const volFilled = document.createElement("div");
    volFilled.className = "tm-volume-filled";
    volBar.appendChild(volFilled);
    volWrap.appendChild(volBar);
    row.appendChild(volWrap);

    // Audio element
    const audio = document.createElement("audio");
    audio.preload = "metadata";
    audio.src = src;
    popup.appendChild(audio);

    return {
      playBtn,
      progressWrap,
      progressBar,
      progressFilled,
      progressHandle,
      time,
      volWrap,
      volBar,
      volFilled,
      audio,
    };
  }

  /** Wire up audio events and interaction for a minibar. */
  function wireMinibar(refs, popup) {
    const {
      playBtn,
      progressWrap,
      progressFilled,
      progressHandle,
      time,
      volWrap,
      volBar,
      volFilled,
      audio,
    } = refs;
    const iconPlay = playBtn.querySelector(".tm-icon-play");
    const iconPause = playBtn.querySelector(".tm-icon-pause");

    let loaded = false;

    // Play / pause toggle
    playBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      if (!loaded) {
        audio.load();
        loaded = true;
      }
      if (audio.paused) audio.play();
      else audio.pause();
    });

    audio.addEventListener("play", () => {
      iconPlay.style.display = "none";
      iconPause.style.display = "";
    });
    audio.addEventListener("pause", () => {
      iconPlay.style.display = "";
      iconPause.style.display = "none";
    });
    audio.addEventListener("ended", () => {
      iconPlay.style.display = "";
      iconPause.style.display = "none";
    });
    audio.addEventListener("timeupdate", () => {
      const pct = audio.duration
        ? (audio.currentTime / audio.duration) * 100
        : 0;
      progressFilled.style.width = pct + "%";
      progressHandle.style.left = pct + "%";
      time.textContent = fmt(audio.currentTime);
    });

    // Seek
    let seeking = false;
    function seekFrom(e) {
      const rect = progressWrap.getBoundingClientRect();
      const pct = Math.max(
        0,
        Math.min(1, (e.clientX - rect.left) / rect.width),
      );
      if (audio.duration) audio.currentTime = pct * audio.duration;
    }
    progressWrap.addEventListener("mousedown", (e) => {
      seeking = true;
      seekFrom(e);
      e.stopPropagation();
    });
    document.addEventListener("mousemove", (e) => {
      if (seeking) seekFrom(e);
    });
    document.addEventListener("mouseup", () => {
      seeking = false;
    });

    // Volume - icon hover/click reveals horizontal bar
    let volDragging = false;
    let volume = 1;
    audio.volume = volume;
    volFilled.style.width = "100%";

    function volFrom(e) {
      const rect = volBar.getBoundingClientRect();
      volume = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
      audio.volume = volume;
      volFilled.style.width = volume * 100 + "%";
    }

    // Click icon to toggle bar visibility
    const volIcon = volWrap.querySelector(".tm-volume-icon");
    volIcon.addEventListener("click", (e) => {
      e.stopPropagation();
      volWrap.classList.toggle("active");
    });

    volBar.addEventListener("mousedown", (e) => {
      volDragging = true;
      volFrom(e);
      e.stopPropagation();
    });
    document.addEventListener("mousemove", (e) => {
      if (volDragging) volFrom(e);
    });
    document.addEventListener("mouseup", () => {
      volDragging = false;
    });
  }

  /* Create tooltip state for each .tooltip-media */
  document.querySelectorAll(".tooltip-media").forEach((trigger) => {
    const src = trigger.getAttribute("data-src") || "";
    const mediaType = trigger.getAttribute("mediaType") || "audio";
    const shortLabel = trigger.getAttribute("data-short-label") || "";

    // Create popup container
    const popup = document.createElement("div");
    popup.className = "tooltip-media-popup";
    popup.setAttribute("role", "tooltip");
    document.body.appendChild(popup);

    const state = {
      trigger,
      popup,
      src,
      mediaType,
      frozen: false,
      hovering: false,
      closeTimer: null,
      minibarRefs: null,
    };

    // Build minibar immediately (audio structure)
    state.minibarRefs = buildMinibar(popup, src, shortLabel);
    wireMinibar(state.minibarRefs, popup);

    /* Trigger hover */
    trigger.addEventListener("mouseenter", () => {
      cancelClose(state);
      state.hovering = true;
      if (activeMedia && activeMedia !== state) closeMediaTooltip(activeMedia);
      activeMedia = state;
      trigger.classList.add("active");
      popup.classList.add("visible");
      positionPopup(trigger, popup);
      // Preload if data-autoplay is set (actual play requires a click)
      if (trigger.hasAttribute("data-autoplay")) {
        const a = popup.querySelector("audio");
        if (a && !a.dataset.preloaded) {
          a.load();
          a.dataset.preloaded = "true";
        }
      }
    });

    trigger.addEventListener("mouseleave", () => {
      state.hovering = false;
      // Don't close instantly — give mouse time to travel to popup
      scheduleClose(state);
    });

    /* Trigger click (freeze toggle) */
    trigger.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();
      if (state.frozen) {
        // Unfreeze → close
        closeMediaTooltip(state);
      } else {
        // Freeze open
        cancelClose(state);
        if (activeMedia && activeMedia !== state)
          closeMediaTooltip(activeMedia);
        activeMedia = state;
        state.frozen = true;
        state.hovering = true;
        trigger.classList.add("active");
        popup.classList.add("visible");
        positionPopup(trigger, popup);
        // Autoplay if data-autoplay is set
        if (trigger.hasAttribute("data-autoplay")) {
          const a = popup.querySelector("audio");
          if (a) {
            a.load();
            a.play();
          }
        }
      }
    });

    /* Popup hover keeps it open */
    popup.addEventListener("mouseenter", () => {
      cancelClose(state);
      state.hovering = true;
    });
    popup.addEventListener("mouseleave", () => {
      state.hovering = false;
      scheduleClose(state);
    });
  });

  /* Click-away: close frozen tooltip */
  document.addEventListener("click", (e) => {
    if (!activeMedia || !activeMedia.frozen) return;
    // If click is inside the popup or on the trigger, let those handlers deal with it
    if (
      activeMedia.popup.contains(e.target) ||
      activeMedia.trigger.contains(e.target)
    )
      return;
    closeMediaTooltip(activeMedia);
  });
})();
