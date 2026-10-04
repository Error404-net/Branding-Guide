(function () {
  'use strict';
  var select = document.getElementById('gravatarVariant');
  if (!select) return;
  function update() {
    var file = 'gravatar/avatar-' + select.value + '-1024.png';
    document.querySelectorAll('[data-gravatar-preview]').forEach(function (img) {
      img.src = file;
      img.alt = 'ERROR404.NET ' + select.options[select.selectedIndex].text + ' avatar';
    });
    document.getElementById('gravatarDownload').href = file;
    document.getElementById('gravatarSource').href = file.replace('.png', '.svg');
  }
  select.addEventListener('change', update);
  update();
})();
