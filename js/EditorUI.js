(function() {
  window.editorUI = {};

  (function() {
    var initStatus;
    initStatus = 0;
    editorUI.init = function(d) {
      switch (initStatus) {
        case 0:
          editorUI.attachListener();
          return editorUI.getPack().then(function(a) {
            initStatus++;
            return editorUI.init(a);
          });
        case 1:
          editorUI.processPackdata(d);
          editorUI.initElements();
          return editorUI.initTray();
      }
    };
    editorUI.attachListener = function() {
      document.getElementById("show-inspector").addEventListener("click", editorUI.showInspector);
    };
    editorUI.isInspectorDisplayed = false;
    editorUI.isInspectorAnimationLocking = false;
    editorUI.showInspector = function() {
      var anim, defaultTransform;
      if (editorUI.isInspectorAnimationLocking) {
        return;
      }
      defaultTransform = editorUI.isInspectorDisplayed ? "translate(100%)" : "translate(0)";
      document.getElementById("sc_inspector").style.transform = defaultTransform;
      anim = document.getElementById("sc_inspector").animate([
        {
          transform: editorUI.isInspectorDisplayed ? "translate(0)" : "translate(100%)"
        }, {
          transform: defaultTransform
        }
      ], {
        duration: 500
      });
      editorUI.isInspectorAnimationLocking = true;
      anim.onfinish = (function(_this) {
        return function() {
          editorUI.isInspectorAnimationLocking = false;
          _this.innerHTML = "<i class=\"fa fa-" + (editorUI.isInspectorDisplayed ? "bars" : "times") + "\"></i>";
          editorUI.isInspectorDisplayed = !editorUI.isInspectorDisplayed;
        };
      })(this);
    };
    editorUI.getPack = function() {
      return new Promise(function(resolve) {
        return plaEditor.getPackListbyAjax().then(function(res) {
          plaEditor.getPackModulebyAjax(res[0]).then(function(d) {
            resolve(d);
          });
        });
      });
    };
    editorUI.processPackdata = function(d) {
      var module;
      module = d;
      plaEditor.objData = module.objs;
      plaEditor.descriptions = module.descriptions;
      plaEditor.blockData = module.blocks;
      plaEditor.abilityTypes = module.abilities.keys;
      plaEditor.abilityOther = module.abilities;
      plaEditor.abilities = module.abilities.selectelement;
    };
    editorUI.initElements = function() {
      var selectPickerInner;
      document.getElementById('pla_objects_select').innerHTML = plaEditor.JSONElem2Select(plaEditor.moduleData2JSONElement(plaEditor.objData));
      console.log(document.getElementById('sc_icon_select').innerHTML);
      document.getElementById('sc_icon_select').innerHTML = plaEditor.JSONElem2Select(plaEditor.moduleData2JSONElement(plaEditor.blockData));
      selectPickerInner = plaEditor.JSONElem2Select(plaEditor.abilities);
      $('#pla_abilities_select').html(selectPickerInner).selectpicker();
      $('#pla_abilities_select_obj').html(selectPickerInner).selectpicker();
      Editor.createObjPoint();
    };
    editorUI.initTray = function() {};
    document.addEventListener("DOMContentLoaded", editorUI.init);
  })();

}).call(this);
