/* Opens demos in a pop-up instead of a new page.
   Links keep their normal href, so they still work without JavaScript,
   with Ctrl/Cmd/middle-click (new tab), and in browsers without <dialog>. */
(function () {
  var links = document.querySelectorAll('a[data-demo]');
  if (!links.length || !window.HTMLDialogElement) return;

  var dialog = document.createElement('dialog');
  dialog.className = 'demo-modal';
  dialog.setAttribute('aria-labelledby', 'demo-modal-title');
  dialog.innerHTML =
    '<div class="demo-bar">' +
      '<p class="demo-title" id="demo-modal-title"></p>' +
      '<a class="demo-full" target="_blank" rel="noopener">Open in a new tab ↗</a>' +
      '<button type="button" class="demo-close" aria-label="Close the demo">✕</button>' +
    '</div>' +
    '<iframe class="demo-frame" title=""></iframe>';
  document.body.appendChild(dialog);

  var frame = dialog.querySelector('.demo-frame');
  var title = dialog.querySelector('.demo-title');
  var full = dialog.querySelector('.demo-full');
  var closeBtn = dialog.querySelector('.demo-close');
  var opener = null;
  full.href = links[0].href;                 // a real address from the start (set again on each open)

  function close() { dialog.close(); }

  dialog.addEventListener('close', function () {
    frame.src = 'about:blank';               // stop the demo running in the background
    document.documentElement.classList.remove('modal-open');
    if (opener) opener.focus();
  });
  closeBtn.addEventListener('click', close);
  // A click on the dark area around the pop-up closes it.
  dialog.addEventListener('click', function (e) { if (e.target === dialog) close(); });

  links.forEach(function (link) {
    link.addEventListener('click', function (e) {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      e.preventDefault();
      opener = link;
      title.textContent = link.getAttribute('data-demo-title') || link.textContent;
      frame.title = title.textContent;
      frame.src = link.getAttribute('data-demo');
      full.href = link.href;
      dialog.showModal();
      document.documentElement.classList.add('modal-open');
      closeBtn.focus();
    });
  });
})();
