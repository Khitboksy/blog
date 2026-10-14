(function () {
  function fmt(s) {
    if (!isFinite(s)) return "0:00";
    const m = Math.floor(s / 60);
    const sec = Math.floor(s % 60);
    return m + ":" + String(sec).padStart(2, "0");
  }

  /* Lazy warming: create the <audio> only when the player nears the
     viewport (or is clicked). One shared observer for all players. */
  const warmMap = new WeakMap();
  const playerObserver =
    "IntersectionObserver" in window
      ? new IntersectionObserver(
          (entries) => {
            entries.forEach((entry) => {
              if (!entry.isIntersecting) return;
              const warm = warmMap.get(entry.target);
              if (warm) warm();
              playerObserver.unobserve(entry.target);
            });
          },
          { rootMargin: "200px 0px" },
        )
      : null;

  document.querySelectorAll(".audio-player").forEach((root) => {
    // Skip if already initialised
    if (root.dataset.initialised) return;
    root.dataset.initialised = "true";

    const src = root.getAttribute("data-src") || "";
    const cover = root.getAttribute("data-cover") || "";
    const label = root.getAttribute("data-label") || "";
    const defaultVolume = parseFloat(root.getAttribute("data-volume")) || 0.75;
    root.innerHTML = "";

    // ---- Album art (optional) ----
    if (cover) {
      const art = document.createElement("img");
      art.className = "ap-cover";
      art.src = cover;
      art.alt = "";
      root.appendChild(art);
    }

    // ---- Content area (label + controls) ----
    const content = document.createElement("div");
    content.className = "ap-content";
    root.appendChild(content);

    // ---- Label ----
    const lbl = document.createElement("div");
    lbl.className = "ap-label";
    lbl.textContent = label;
    content.appendChild(lbl);

    // ---- Controls row ----
    const row = document.createElement("div");
    row.className = "ap-controls";
    content.appendChild(row);

    // Play / pause
    const playBtn = document.createElement("button");
    playBtn.className = "ap-playpause";
    playBtn.setAttribute("aria-label", "Play / Pause");
    playBtn.innerHTML =
      '<svg class="ap-icon ap-icon-play" viewBox="0 0 24 24" fill="currentColor"><polygon points="5,3 19,12 5,21"/></svg>' +
      '<svg class="ap-icon ap-icon-pause" viewBox="0 0 24 24" fill="currentColor" style="display:none"><rect x="5" y="3" width="4" height="18"/><rect x="15" y="3" width="4" height="18"/></svg>';
    row.appendChild(playBtn);

    // Progress bar
    const progressWrap = document.createElement("div");
    progressWrap.className = "ap-progress-wrap";
    const progressBar = document.createElement("div");
    progressBar.className = "ap-progress-bar";
    const progressFilled = document.createElement("div");
    progressFilled.className = "ap-progress-filled";
    const progressHandle = document.createElement("div");
    progressHandle.className = "ap-progress-handle";
    progressBar.appendChild(progressFilled);
    progressBar.appendChild(progressHandle);
    progressWrap.appendChild(progressBar);
    row.appendChild(progressWrap);

    // Time
    const time = document.createElement("span");
    time.className = "ap-time";
    time.innerHTML =
      '<span class="ap-elapsed">0:00</span> / <span class="ap-total">0:00</span>';
    row.appendChild(time);

    // Volume
    const volWrap = document.createElement("div");
    volWrap.className = "ap-volume";
    volWrap.innerHTML =
      '<svg class="ap-icon ap-volume-icon" viewBox="0 0 24 24" fill="currentColor">' +
      '<polygon points="3,9 7,9 12,4 12,20 7,15 3,15"/>' +
      '<path d="M16 8.5c0 0 2.5 1.5 2.5 3.5s-2.5 3.5-2.5 3.5" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>' +
      "</svg>";
    const volBar = document.createElement("div");
    volBar.className = "ap-volume-bar";
    const volFilled = document.createElement("div");
    volFilled.className = "ap-volume-filled";
    volBar.appendChild(volFilled);
    volWrap.appendChild(volBar);
    row.appendChild(volWrap);

    // ---- References ----
    const iconPlay = playBtn.querySelector(".ap-icon-play");
    const iconPause = playBtn.querySelector(".ap-icon-pause");
    const elapsedEl = time.querySelector(".ap-elapsed");
    const totalEl = time.querySelector(".ap-total");

    let loaded = false;
    let volume = defaultVolume;
    volFilled.style.width = volume * 100 + "%";

    // Audio element — created on first need (viewport-approach or click)
    let audio = null;
    function ensureAudio() {
      if (audio) return audio;
      audio = document.createElement("audio");
      audio.preload = "metadata";
      audio.src = src;
      audio.volume = volume;
      root.appendChild(audio);

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
      audio.addEventListener("loadedmetadata", () => {
        totalEl.textContent = fmt(audio.duration);
      });
      audio.addEventListener("timeupdate", () => {
        const pct = audio.duration
          ? (audio.currentTime / audio.duration) * 100
          : 0;
        progressFilled.style.width = pct + "%";
        progressHandle.style.left = pct + "%";
        elapsedEl.textContent = fmt(audio.currentTime);
      });
      return audio;
    }
    warmMap.set(root, ensureAudio);
    if (playerObserver) playerObserver.observe(root);

    // ---- Play / pause ----
    playBtn.addEventListener("click", () => {
      const a = ensureAudio();
      if (!loaded) {
        a.load();
        loaded = true;
      }
      if (a.paused) a.play();
      else a.pause();
    });

    // ---- Seek ----
    let seeking = false;
    function seekFrom(e) {
      if (!audio || !audio.duration) return;
      const rect = progressWrap.getBoundingClientRect();
      const pct = Math.max(
        0,
        Math.min(1, (e.clientX - rect.left) / rect.width),
      );
      audio.currentTime = pct * audio.duration;
    }
    progressWrap.addEventListener("mousedown", (e) => {
      seeking = true;
      seekFrom(e);
    });
    document.addEventListener("mousemove", (e) => {
      if (seeking) seekFrom(e);
    });
    document.addEventListener("mouseup", () => {
      seeking = false;
    });

    // ---- Volume ----
    let volDragging = false;
    function volFrom(e) {
      const rect = volBar.getBoundingClientRect();
      volume = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
      if (audio) audio.volume = volume;
      volFilled.style.width = volume * 100 + "%";
    }
    volBar.addEventListener("mousedown", (e) => {
      volDragging = true;
      volFrom(e);
    });
    document.addEventListener("mousemove", (e) => {
      if (volDragging) volFrom(e);
    });
    document.addEventListener("mouseup", () => {
      volDragging = false;
    });
  });
})();
