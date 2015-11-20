(function() {
  var Planet;

  Planet = {};

  (function() {
    var abilities, idcount, prefabs;
    prefabs = {};
    idcount = 0;
    abilities = {};
    return Planet = {
      AddPrefab: function(id, blockname, x, y) {
        if (prefabs[id]) {
          throw "Your specified ID is defined. So it doesn't make a prefab.";
          return;
        }
        prefabs[id] = {
          blockname: blockname,
          x: x,
          y: y
        };
      },
      MovePrefab: function(id, newX, newY) {
        var ref;
        if (!prefabs[id]) {
          throw "Your specified Prefab is undefined.";
          return;
        }
        ref = [newX, newY], prefabs[id].x = ref[0], prefabs[id].y = ref[1];
      },
      DeletePrefab: function(id) {
        if (!prefabs[id]) {
          throw "Your specified Prefab is undefined.";
          return;
        }
        delete prefabs[id];
      },
      GetPrefabFromID: function(id) {
        if (!prefabs[id]) {
          throw "Your specified Prefab is undefined.";
          return;
        }
        return prefabs[id];
      },
      GenerateID: function() {
        idcount++;
        return idcount - 1;
      },
      AttachAbility: function(id, abilityName, abilityValue) {
        if (abilities[id] && abilities[id][abilityName]) {
          throw "Your specified ability is defined. So it doesn't make a prefab.";
          return;
        }
        if (!abilities[id]) {
          abilities[id] = {};
        }
        abilities[id][abilityName] = abilityValue;
      },
      ChangeAbilityValue: function(id, abilityName, abilityValue) {
        if (!abilities[id] || !abilities[id][abilityName]) {
          throw "Your specified ability is undefined.";
          return;
        }
        abilities[id][abilityName] = abilityValue;
      },
      DeleteAbility: function(id, abilityName) {
        if (!abilities[id] || !abilities[id][abilityName]) {
          throw "Your specified ability is undefined.";
          return;
        }
        delete abilities[id][abilityName];
      },
      GetAbilitiesFromID: function(id) {
        if (!abilities[id]) {
          throw "Your specified ability is undefined.";
          return;
        }
        return abilities[id];
      },
      GetAbilityListFromID: function(id) {
        if (!abilities[id]) {
          throw "Your specified ability is undefined.";
          return;
        }
        return Object.keys(abilities[id]);
      },
      GetAbilityFromIDAndName: function(id, name) {
        if (!abilities[id] || !abilities[id][name]) {
          throw "Your specified ability is undefined.";
          return;
        }
        return abilities[id][name];
      }
    };
  })();

}).call(this);
