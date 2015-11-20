var plaEditor = {};

!function() {
  plaEditor.getPackListbyAjax = function() {
    return new Promise((resolve) => {
      var xhr = new XMLHttpRequest();
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
  plaEditor.getPackModulebyAjax = function(name) {
    return new Promise((resolve) => {
      var xhr = new XMLHttpRequest();
      xhr.overrideMimeType('application/json');
      xhr.open("GET", "pack/" + name + "/packinfo.json");
      xhr.onreadystatechange = () => {
        if (xhr.readyState === 4 && xhr.status === 200) {
          resolve(JSON.parse(xhr.responseText));
        }
      }
      xhr.send(null);
    });
  };
  plaEditor.objData = {};
  plaEditor.blockData = {};
  plaEditor.descriptions = {};
  plaEditor.abilities = {};
  plaEditor.abilityTypes = {};
  plaEditor.abilityOther = {};
  
  plaEditor.moduleData2JSONElement = function(data) {
    var od = data;
    od["list"] = Object.keys(od);
    od["select"] = {};
    for (var s = 0; s < od["list"].length; s++) {
      // var _target = null;
      var current = od[od["list"][s]];
      if (current.hidden) {
        continue;
      }
      if (current.type)
        // 改善可能
        if (od["select"][current.type]) {
          od["select"][current.type][od["list"][s]] = current.name;
        } else {
          od["select"][current.type] = {}
          od["select"][current.type][od["list"][s]] = current.name;
        }
      else {
        od["select"][od["list"][s]] = current.name;
      }
    }
    return od["select"];
  };
  plaEditor.JSONElem2Select = (json) => {
    var result = "";
    for (var i = 0; i < Object.keys(json).length; i++) {
      if (plaEditor.IsJSON(json[Object.keys(json)[i]])) {
        result += '<optgroup label="' + Object.keys(json)[i] + '">\n';
        result += plaEditor.JSONElem2Select(json[Object.keys(json)[i]]);
        result += '</optgroup>\n';
      } else {
        result += '<option value="' + Object.keys(json)[i] + '">' + json[Object.keys(json)[i]] + '</option>\n';
      }
    }
    return result;
  }
  plaEditor.IsJSON = (j) => {
    if (j) {
      return j.constructor === {}.constructor;
    } else {
      return false;
    }
  }
}();
