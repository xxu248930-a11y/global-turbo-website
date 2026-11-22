
(function () {
  const WATERMARK_TEXT = "turbocharger.cc.cd";

  function protectImage(img) {
    if (img.dataset.watermarkReady === "true") return;
    if (!img.parentNode) return;

    const rect = img.getBoundingClientRect();
    if (rect.width === 0) return;

    const oldDisplay = getComputedStyle(img).display;
    const wrapper = document.createElement("span");

    wrapper.className = "site-watermark-wrapper";
    wrapper.style.cssText = `
      position: relative;
      display: ${oldDisplay === "block" ? "block" : "inline-block"};
      width: ${rect.width}px;
      max-width: 100%;
      vertical-align: middle;
      overflow: hidden;
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
      color: rgba(255,255,255,0.65);
      font-size: clamp(12px, 3vw, 24px);
      font-weight: bold;
      letter-spacing: 1px;
      text-shadow: 1px 1px 3px rgba(0,0,0,0.7);
      transform: rotate(-25deg);
      z-index: 10;
      white-space: nowrap;
    `;

    wrapper.appendChild(watermark);
  }

  function scanImages() {
    document.querySelectorAll("img").forEach(protectImage);
  }

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

  const observer = new MutationObserver(scanImages);
  observer.observe(document.documentElement, {
    childList: true,
    subtree: true
  });

  window.addEventListener("load", scanImages);
})();
