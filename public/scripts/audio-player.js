/**
 * Audio Player - Full bar.
 * Finds all <div class="audio-player"> elements and builds the player UI inside.
 *
 * Usage in markdown:
 *   <div class="audio-player"
 *        data-src="/blog/media/audio/track.mp3"
 *        data-label="Artist | Album -- Track">
 *   </div>
 */
(function () {
  function fmt(s) {
    if (!isFinite(s)) return "0:00";
    const m = Math.floor(s / 60);
    const sec = Math.floor(s % 60);
    return m + ":" + String(sec).padStart(2, "0");
  }

  document.querySelectorAll(".audio-player").forEach((root) => {
    // Skip if already initialised
    if (root.dataset.initialised) return;
    root.dataset.initialised = "true";

    const src = root.getAttribute("data-src") || "";
    const label = root.getAttribute("data-label") || "";
    root.innerHTML = "";

    // ---- Label ----
    const lbl = document.createElement("div");
    lbl.className = "ap-label";
    lbl.textContent = label;
    root.appendChild(lbl);

    // ---- Controls row ----
    const row = document.createElement("div");
    row.className = "ap-controls";
    root.appendChild(row);

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

    // Audio element
    const audio = document.createElement("audio");
    audio.preload = "metadata";
    audio.src = src;
    root.appendChild(audio);

    // ---- References ----
    const iconPlay = playBtn.querySelector(".ap-icon-play");
    const iconPause = playBtn.querySelector(".ap-icon-pause");
    const elapsedEl = time.querySelector(".ap-elapsed");
    const totalEl = time.querySelector(".ap-total");

    let loaded = false;

    // ---- Play / pause ----
    playBtn.addEventListener("click", () => {
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

    // ---- Time / progress ----
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

    // ---- Seek ----
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
    });
    document.addEventListener("mousemove", (e) => {
      if (seeking) seekFrom(e);
    });
    document.addEventListener("mouseup", () => {
      seeking = false;
    });

    // ---- Volume ----
    let volume = 1;
    audio.volume = volume;
    volFilled.style.width = "100%";

    let volDragging = false;
    function volFrom(e) {
      const rect = volBar.getBoundingClientRect();
      volume = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
      audio.volume = volume;
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
