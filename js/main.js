(function () {
  'use strict';

  // Base path for GitHub Pages (e.g. /website_credible or '' if at root)
  function getBase() {
    var b = document.querySelector('script[data-base]');
    if (b && b.getAttribute('data-base') !== '') return (b.getAttribute('data-base') || '').replace(/\/$/, '');
    var parts = location.pathname.replace(/\/$/, '').split('/').filter(Boolean);
    if (parts.length && parts[0] !== 'index.html') return '/' + parts[0];
    return '';
  }
  var BASE = getBase();

  // Scroll reveal
  function initReveal() {
    var reveals = document.querySelectorAll('.reveal');
    var options = { threshold: 0.1, rootMargin: '0px 0px -60px 0px' };
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) entry.target.classList.add('revealed');
      });
    }, options);
    reveals.forEach(function (el) { observer.observe(el); });
  }

  // Header scroll state
  function initHeader() {
    var header = document.querySelector('.site-header');
    if (!header) return;
    function update() {
      if (window.scrollY > 50) header.classList.add('scrolled');
      else header.classList.remove('scrolled');
    }
    window.addEventListener('scroll', function () { requestAnimationFrame(update); });
    update();
  }

  // Duplicate marquee content for infinite scroll
  function initMarquee() {
    var wrap = document.querySelector('.marquee-wrap .marquee');
    if (!wrap) return;
    var clone = wrap.cloneNode(true);
    wrap.parentNode.appendChild(clone);
  }

  // Render random suggested app line
  function renderSuggestedApp(el) {
    if (!window.CREDIBLE_APPS || !el) return;
    var featured = window.CREDIBLE_APPS.filter(function (a) { return a.featured; });
    var list = featured.length ? featured : window.CREDIBLE_APPS;
    if (!list.length) return;
    var pick = list[Math.floor(Math.random() * list.length)];
    var href = pick.playUrl || (BASE.replace(/\/$/, '') + '/' + pick.slug + '/');
    el.innerHTML =
      'Not sure where to start? Try ' +
      '<a href="' + escapeHtml(href) + '" target="_blank" rel="noopener">' +
      escapeHtml(pick.name) +
      '</a> today.';
  }

  // Render app grid from CREDIBLE_APPS
  function renderAppGrid(container) {
    if (!window.CREDIBLE_APPS || !container) return;
    var base = BASE.replace(/\/$/, '');
    container.innerHTML = window.CREDIBLE_APPS.map(function (app) {
      var href = base + '/' + app.slug + '/';
      var iconHtml = app.iconUrl
        ? '<img class="app-card-icon-img" src="' + escapeHtml(app.iconUrl) + '" alt="" loading="lazy">'
        : '<span class="app-card-icon">' + (app.icon || '📱') + '</span>';
      return (
        '<a class="app-card reveal" href="' + href + '">' +
          '<span class="app-card-icon">' + iconHtml + '</span>' +
          '<h3 class="app-card-title">' + escapeHtml(app.name) + '</h3>' +
          '<p class="app-card-desc">' + escapeHtml(app.shortDesc) + '</p>' +
          '<span class="app-card-cta">Get the app</span>' +
        '</a>'
      );
    }).join('');
    initReveal();
  }

  function escapeHtml(s) {
    var div = document.createElement('div');
    div.textContent = s;
    return div.innerHTML;
  }

  // Init
  document.addEventListener('DOMContentLoaded', function () {
    initReveal();
    initHeader();
    initMarquee();
    var suggested = document.getElementById('suggested-app');
    if (suggested) renderSuggestedApp(suggested);
    var grid = document.getElementById('app-grid');
    if (grid) renderAppGrid(grid);
  });
})();
