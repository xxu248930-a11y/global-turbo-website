
(function () {
  const WATERMARK_TEXT = "Guangzhou Tianhe District Yuming Co., Ltd.";

  if (window.__siteWatermarkInitialized) return;
  window.__siteWatermarkInitialized = true;

  function updateSize(img) {
    const wrapper = img.parentElement;

    if (!wrapper || !wrapper.classList.contains("site-watermark-wrapper")) {
      return;
    }

    const rect = img.getBoundingClientRect();

    if (rect.width > 0 && rect.height > 0) {
      wrapper.style.width = rect.width + "px";
      wrapper.style.height = rect.height + "px";
    }
  }

  function protectImage(img) {
    if (!(img instanceof HTMLImageElement)) return;
    if (img.dataset.watermarkReady === "true") return;
    if (!img.parentNode) return;

    const rect = img.getBoundingClientRect();

    if (rect.width <= 0 || rect.height <= 0) return;

    const oldDisplay = getComputedStyle(img).display;
    const wrapper = document.createElement("span");

    wrapper.className = "site-watermark-wrapper";

    wrapper.style.cssText = `
      position: relative;
      display: ${oldDisplay === "inline" ? "inline-block" : "block"};
      width: ${rect.width}px;
      height: ${rect.height}px;
      max-width: 100%;
      vertical-align: middle;
      overflow: hidden;
      box-sizing: border-box;
    `;

    img.parentNode.insertBefore(wrapper, img);
    wrapper.appendChild(img);

    img.dataset.watermarkReady = "true";
    img.setAttribute("draggable", "false");

    const watermark = document.createElement("span");

    watermark.textContent = WATERMARK_TEXT;
    watermark.setAttribute("aria-hidden", "true");

    watermark.style.cssText = `
      position: absolute;
      inset: 0;
      display: flex;
      align-items: center;
      justify-content: center;
      overflow: hidden;
      pointer-events: none;
      user-select: none;
      color: rgba(255,255,255,0.58);
      font-size: clamp(8px, 1.6vw, 16px);
      font-weight: bold;
      letter-spacing: 0.3px;
      text-shadow: 1px 1px 3px rgba(0,0,0,0.75);
      transform: rotate(-25deg);
      z-index: 10;
      white-space: nowrap;
    `;

    wrapper.appendChild(watermark);

    if (resizeObserver) {
      resizeObserver.observe(img);
    }
  }

  const resizeObserver = typeof ResizeObserver !== "undefined"
    ? new ResizeObserver(entries => {
        entries.forEach(entry => {
          updateSize(entry.target);
        });
      })
    : null;

  function scanImages() {
    document.querySelectorAll("img").forEach(img => {
      if (img.dataset.watermarkReady === "true") return;

      if (resizeObserver) {
        if (img.dataset.watermarkObserved !== "true") {
          img.dataset.watermarkObserved = "true";
          resizeObserver.observe(img);
        }
      }

      protectImage(img);
    });
  }

  document.addEventListener("load", function (event) {
    if (event.target instanceof HTMLImageElement) {
      protectImage(event.target);
    }
  }, true);

  document.addEventListener("contextmenu", function (event) {
    if (event.target.closest(".site-watermark-wrapper")) {
      event.preventDefault();
    }
  });

  document.addEventListener("dragstart", function (event) {
    if (event.target.closest(".site-watermark-wrapper")) {
      event.preventDefault();
    }
  });

  scanImages();

  const mutationObserver = new MutationObserver(scanImages);

  mutationObserver.observe(document.documentElement, {
    childList: true,
    subtree: true
  });

  window.addEventListener("load", scanImages);
  window.addEventListener("resize", scanImages);
})();
