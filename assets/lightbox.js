/* Click or tap a figure image to see it full screen.
   Without JavaScript the images simply stay as they are. */
(function () {
  var images = document.querySelectorAll("main figure img");
  if (!images.length || typeof HTMLDialogElement !== "function") return;

  var dialog = document.createElement("dialog");
  dialog.className = "lightbox";
  dialog.setAttribute("aria-label", "Enlarged figure");
  dialog.innerHTML =
    '<button class="lightbox-close" type="button" aria-label="Close">&times;</button>' +
    '<img class="lightbox-img" alt="">' +
    '<p class="lightbox-caption"></p>';
  document.body.appendChild(dialog);

  var big = dialog.querySelector(".lightbox-img");
  var caption = dialog.querySelector(".lightbox-caption");

  // Same numbering as the FIG. labels in makeover.css: captioned figures
  // in <main>, in page order, skipping any hidden at this screen size.
  function figureNumber(figure) {
    var n = 0;
    var all = document.querySelectorAll("main figure");
    for (var i = 0; i < all.length; i++) {
      if (all[i].querySelector("figcaption") && all[i].getClientRects().length) n++;
      if (all[i] === figure) return n;
    }
    return 0;
  }

  function open(img) {
    big.src = img.currentSrc || img.src;
    big.alt = img.alt;
    caption.textContent = "";

    var figure = img.closest("figure");
    var text = figure && figure.querySelector("figcaption");
    if (text) {
      var label = document.createElement("span");
      label.className = "lightbox-label";
      label.textContent = "FIG. " + String(figureNumber(figure)).padStart(2, "0");
      caption.appendChild(label);
      for (var i = 0; i < text.childNodes.length; i++) {
        caption.appendChild(text.childNodes[i].cloneNode(true));
      }
    }
    caption.hidden = !text;
    dialog.showModal();
  }

  function close() {
    // After pinch-zooming on a phone, a tap should not throw the view away
    if (window.visualViewport && window.visualViewport.scale > 1.01) return;
    dialog.close();
  }

  for (var i = 0; i < images.length; i++) {
    var img = images[i];
    if (img.closest("a")) continue;
    img.setAttribute("tabindex", "0");
    img.setAttribute("role", "button");
    img.setAttribute("aria-label", "Enlarge image: " + img.alt);
    img.addEventListener("click", function () { open(this); });
    img.addEventListener("keydown", function (e) {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        open(this);
      }
    });
  }

  dialog.addEventListener("click", close);
  dialog.querySelector(".lightbox-close").addEventListener("click", function (e) {
    e.stopPropagation();
    dialog.close();
  });
  dialog.addEventListener("close", function () {
    big.removeAttribute("src");
  });
})();
