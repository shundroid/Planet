window.editorUI = {}
do ->
  initStatus = 0;
  editorUI.init = (d) ->
    switch initStatus
      when 0
        editorUI.attachListener()
        editorUI.getPack().then (a) ->
          initStatus++
          editorUI.init(a)
      when 1
        editorUI.processPackdata d
        editorUI.initElements()
        editorUI.initTray()

  editorUI.attachListener = ->
    document.getElementById("show-inspector").addEventListener "click", editorUI.showInspector
    return
  editorUI.isInspectorDisplayed = false
  editorUI.isInspectorAnimationLocking = false;
  editorUI.showInspector = ->
    if editorUI.isInspectorAnimationLocking
      return
    # document.getElementById("sc_inspector").className = "inspector-clicked"
    defaultTransform = if editorUI.isInspectorDisplayed then "translate(100%)" else "translate(0)"
    document.getElementById("sc_inspector").style.transform = defaultTransform
    anim = document.getElementById("sc_inspector").animate [
        {transform: if editorUI.isInspectorDisplayed then "translate(0)" else "translate(100%)"},
        {transform: defaultTransform}
      ],
      duration: 500
    editorUI.isInspectorAnimationLocking = true;
    anim.onfinish = =>
      editorUI.isInspectorAnimationLocking = false;
      @innerHTML = "<i class=\"fa fa-#{if editorUI.isInspectorDisplayed then "bars" else "times"}\"></i>"
      editorUI.isInspectorDisplayed = !editorUI.isInspectorDisplayed
      return
    return

  editorUI.getPack = ->
    return new Promise (resolve) ->
      plaEditor.getPackListbyAjax().then (res) ->
        plaEditor.getPackModulebyAjax(res[0]).then (d) ->
          resolve(d)
          return
        return
  editorUI.processPackdata = (d) ->
    module = d
    plaEditor.objData = module.objs
    plaEditor.descriptions = module.descriptions
    plaEditor.blockData = module.blocks
    plaEditor.abilityTypes = module.abilities.keys
    plaEditor.abilityOther = module.abilities
    plaEditor.abilities = module.abilities.selectelement
    return
  editorUI.initElements = ->
    document.getElementById('pla_objects_select').innerHTML = 
      plaEditor.JSONElem2Select(plaEditor.moduleData2JSONElement(plaEditor.objData))
    console.log document.getElementById('sc_icon_select').innerHTML
    document.getElementById('sc_icon_select').innerHTML =
      plaEditor.JSONElem2Select(plaEditor.moduleData2JSONElement(plaEditor.blockData))
    selectPickerInner = plaEditor.JSONElem2Select(plaEditor.abilities)
    $('#pla_abilities_select')
      .html(selectPickerInner).selectpicker()
    $('#pla_abilities_select_obj')
      .html(selectPickerInner).selectpicker()
    Editor.createObjPoint()
    return
  editorUI.initTray = ->
    return
  
  document.addEventListener "DOMContentLoaded", editorUI.init
  return


        
        # od = plaEditor.getObjdata() or {}
        # od["list"] = Object.keys pla_objdata
        # od["select"] = {}
        # for s in [0...pla_objdata["list"].length] by 1
        #   _target = null
        #   current = pla_objdata[pla_objdata["list"][s]]
        #   if current.hidden
        #     continue
        #   if current.type
        #     # 改善可能
        #     if pla_objdata["select"][current.type]
        #       pla_objdata["select"][current.type][pla_objdata["list"][s]] = current.name
        #     else
        #       pla_objdata["select"][current.type] = {}
        #       pla_objdata["select"][current.type][pla_objdata["list"][s]] = current.name
        #   else
        #     pla_objdata["select"][pla_objdata["list"][s]] = current.name

        # pla_blockdata["list"] = Object.keys(pla_blockdata)
        # pla_blockdata["select"] = {}
        # for i in [0...pla_blockdata["list"].length] by 1
        #   tmp = pla_blockdata["list"][i]
        #   pla_blockdata["select"][tmp] = pla_blockdata[tmp].name
        # $('#sc_icon_select').html s$.JSON2SelectInnerHTML(pla_blockdata.select)

