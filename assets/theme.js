/* Light / dark toggle.
   The first visit follows the system setting. A click switches mode and remembers it
   (a small inline script in each page's <head> applies the saved choice before the
   page is drawn, so there is no flash). Without JavaScript there is no button and the
   page simply follows the system setting. */
(function () {
  var root = document.documentElement;
  var mq = window.matchMedia ? window.matchMedia('(prefers-color-scheme: dark)') : null;
  var MOON = '<svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z"/></svg>';
  var SUN = '<svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/></svg>';

  function current() { return root.dataset.theme || (mq && mq.matches ? 'dark' : 'light'); }

  var button = document.createElement('button');
  button.type = 'button';
  button.className = 'theme-toggle';

  // The button names the mode it switches to.
  function render() {
    var dark = current() === 'dark';
    button.innerHTML = (dark ? SUN : MOON) + '<span>' + (dark ? 'Light mode' : 'Dark mode') + '</span>';
  }

  button.addEventListener('click', function () {
    var next = current() === 'dark' ? 'light' : 'dark';
    root.dataset.theme = next;
    try { localStorage.setItem('theme', next); } catch (e) {}
    render();
  });
  if (mq && mq.addEventListener) mq.addEventListener('change', render);

  render();
  document.body.insertBefore(button, document.body.firstChild);
})();
