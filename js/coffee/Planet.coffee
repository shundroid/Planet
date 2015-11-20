Planet = {}
do ->
  prefabs = {}
  idcount = 0
  abilities = {}
  Planet =
    AddPrefab: (id, blockname, x, y) ->
      if prefabs[id]
        throw "Your specified ID is defined. So it doesn't make a prefab."
        return
      prefabs[id] = {blockname, x, y}
      return
    MovePrefab: (id, newX, newY) ->
      if !prefabs[id]
        throw "Your specified Prefab is undefined."
        return
      [prefabs[id].x, prefabs[id].y] = [newX, newY]
      return
    DeletePrefab: (id) ->
      if !prefabs[id]
        throw "Your specified Prefab is undefined."
        return
      delete prefabs[id]
      return
    GetPrefabFromID: (id) ->
      if !prefabs[id]
        throw "Your specified Prefab is undefined."
        return
      return prefabs[id]
    GenerateID: ->
      idcount++
      return idcount - 1
    AttachAbility: (id, abilityName, abilityValue) ->
      if abilities[id] and abilities[id][abilityName]
        throw "Your specified ability is defined. So it doesn't make a prefab."
        return
      if !abilities[id]
        abilities[id] = {}
      abilities[id][abilityName] = abilityValue
      return
    ChangeAbilityValue: (id, abilityName, abilityValue) ->
      if !abilities[id] or !abilities[id][abilityName]
        throw "Your specified ability is undefined."
        return
      abilities[id][abilityName] = abilityValue
      return
    DeleteAbility: (id, abilityName) ->
      if !abilities[id] or !abilities[id][abilityName]
        throw "Your specified ability is undefined."
        return
      delete abilities[id][abilityName]
      return
    GetAbilitiesFromID: (id) ->
      if !abilities[id]
        throw "Your specified ability is undefined."
        return
      return abilities[id]
    GetAbilityListFromID: (id) ->
      if !abilities[id]
        throw "Your specified ability is undefined."
        return
      return Object.keys(abilities[id])
    GetAbilityFromIDAndName: (id, name) ->
      if !abilities[id] or !abilities[id][name]
        throw "Your specified ability is undefined."
        return
      return abilities[id][name]






