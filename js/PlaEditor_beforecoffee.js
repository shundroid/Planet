(function() {
  window.plaEditor = {};

  (function() {
    plaEditor.getPackbyAjax = function() {
      return new Promise(function(resolve) {
        var xhr;
        xhr = new XMLHttpRequest();
        xhr.overrideMimeType('application/json');
        xhr.open("GET", "plapacks.json", true);
        xhr.onreadystatechange = function() {
          if (xhr.readyState === 4 && xhr.status === 200) {
            resolve(JSON.parse(xhr.responseText).packs);
          }
        };
        xhr.send(null);
      });
    };
    return plaEditor.get;
  })();

}).call(this);
