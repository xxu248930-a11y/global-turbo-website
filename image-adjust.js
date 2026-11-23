
(function () {
  "use strict";

  function prepareProductImages() {
    const images = document.querySelectorAll(
      "#featured-products .featured-card img"
    );

    images.forEach(function (img) {
      if (img.dataset.smartImageReady === "true") return;

      img.dataset.smartImageReady = "true";

      img.style.width = "100%";
      img.style.height = "220px";
      img.style.objectFit = "contain";
      img.style.objectPosition = "center";
      img.style.display = "block";
      img.style.imageRendering = "auto";
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", prepareProductImages);
  } else {
    prepareProductImages();
  }

  window.addEventListener("load", prepareProductImages);
})();

