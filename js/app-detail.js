(function () {
  function getSlug() {
    var path = location.pathname.replace(/\/$/, '');
    var parts = path.split('/').filter(Boolean);
    return parts[parts.length - 1] || '';
  }
  function escapeHtml(s) {
    var div = document.createElement('div');
    div.textContent = s;
    return div.innerHTML;
  }
  function init() {
    var slug = window.APP_SLUG || getSlug();
    var app = window.CREDIBLE_APPS && window.CREDIBLE_APPS.find(function (a) { return a.slug === slug; });
    var base = '';
    var parts = location.pathname.replace(/\/$/, '').split('/').filter(Boolean);
    if (parts.length > 1) parts.pop();
    if (parts.length) base = '/' + parts.join('/');
    if (!base) base = '.';

    var hero = document.getElementById('app-detail-hero');
    var body = document.getElementById('app-detail-body');
    if (!app) {
      if (hero) hero.innerHTML = '<p class="section-title">App not found</p><a href="' + base + '/">Back to home</a>';
      if (body) body.innerHTML = '';
      return;
    }

    var iconHtml = app.iconUrl
      ? '<img class="app-detail-icon-img" src="' + escapeHtml(app.iconUrl) + '" alt="">'
      : '<span class="app-detail-icon">' + (app.icon || '📱') + '</span>';
    if (hero) {
      hero.innerHTML =
        '<nav class="breadcrumb"><a href="' + base + '/">Home</a> / ' + escapeHtml(app.name) + '</nav>' +
        '<span class="app-detail-icon">' + iconHtml + '</span>' +
        '<h1 class="section-title">' + escapeHtml(app.name) + '</h1>' +
        '<p class="app-detail-tagline">' + escapeHtml(app.tagline) + '</p>' +
        '<a href="' + app.playUrl + '" target="_blank" rel="noopener" class="app-detail-cta">Get it on Google Play</a>';
    }
    if (body) {
      var descHtml = '<p>' + escapeHtml(app.description) + '</p>';
      if (app.screenshots && app.screenshots.length) {
        descHtml += '<div class="app-screenshots"><h3>Screenshots</h3><div class="app-screenshots-list">' +
          app.screenshots.map(function (url) {
            return '<img src="' + escapeHtml(url) + '" alt="" loading="lazy" class="app-screenshot">';
          }).join('') + '</div></div>';
      }
      body.innerHTML = descHtml;
    }
    document.title = app.name + ' | Credible Technologies Apps';
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
