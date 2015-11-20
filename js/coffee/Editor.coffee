# shundroid.js
window.Shundroid =
  JSON2SelectInnerHTML: (json) ->
    JSON2Select_innerHTML = ""
    for i in [0...Object.keys(json).length] by 1
      if Shundroid.IsJSON json[Object.keys(json)[i]]
        JSON2Select_innerHTML += '<optgroup label="' + Object.keys(json)[i] + '">\n'
        JSON2Select_innerHTML += Shundroid.JSON2SelectInnerHTML(json[Object.keys(json)[i]])
        JSON2Select_innerHTML += '</optgroup>\n'
      else
        JSON2Select_innerHTML += '<option value="' + Object.keys(json)[i] + '">' + json[Object.keys(json)[i]] + '</option>\n'
    return JSON2Select_innerHTML
  IsJSON: (j) ->
    if j
      return j.constructor is {}.constructor
    else
      return false
s$ = Shundroid

window.Editor = {}

#planetIO.js

Editor.Buffer = () ->
  b = "";
  @append = (s) ->
    b += s
  @BuffertoString = ->
    return b
  return

# class Editor.Buffer
#   b: ""
#   append: (s) ->
#     @b += s
#   BuffertoString: ->
#     return @b
Editor.InputStage = ->
  Editor.clearBlockdata()
  Editor.clearObjdata()
  pla_ability_blocks = pla_ability_objs = {}

  Editor.Zoom.IsZoomReset()

  fadebox.closeWindow "pla_outputbox"

  $("#pla_input_content").css "display", "none"
  input_str = $("#sc_output").val().replace /;/g, ""
  input_str_ar = input_str.split "\n"
  sc_row_len = parseInt input_str_ar[1].substring("// stageCTRL::edit sc_row_len=".length)
  sc_row_zero = parseInt input_str_ar[2].substring("// stageCTRL::edit sc_row_zero=".length)
  sc_column_len = parseInt input_str_ar[3].substring("// stageCTRL::edit sc_column_len=".length)
  sc_column_zero = parseInt input_str_ar[4].substring("// stageCTRL::edit sc_column_zero=".length)

  header = ""
  header_count = 5
  if input_str_ar[5] isnt "// stageCTRL::edit not_header"
    while input_str_ar[header_count] isnt "// stageCTRL::edit /header"
      header += input_str_ar[header_count] + "\n"
      header_count++
    $("#sc_header").val header

  $("#sc_ground").text ""
  $("#pla_objects").html ""
  Editor.objcount = 0
  Editor.createObjPoint()

  appendorprepend = $("#sc_add_select").val()
  $("#sc_add_select").val "1"
  for i in [sc_row_zero...sc_row_len + 1] by 2
    Editor.sc_ground_createline i
  lst = ""
  input_i = null
  $('#prog1').val 0
  $('#prog1').attr 'max', input_str_ar.length - header_count
  for input_i in [header_count...input_str_ar.length] by 1
    $("#prog1").val parseInt($('#prog1').val()) + 1
    currentAr = input_str_ar[input_i]
    if currentAr is "// stageCTRL::edit not_footer" or currentAr is "// stageCTRL::edit footer"
      break
    if currentAr.indexOf("//") isnt -1
      continue
    if !currentAr
      continue
    if currentAr.indexOf("=") isnt -1
      currentAr = currentAr.split("=")[0]
    lst = currentAr.split ","
    if plaEditor.objData["list"].indexOf(lst[0]) isnt -1
      Editor.createplaObject lst[0], lst[1], lst[2]
    else
      if input_str_ar[input_i].substring(0, 1) is "*"
        switch lst[0]
          when '*skybox'
            $('#pla_skybox').val lst[1]
            $('#pla_skybox').change()
          when '*sound'
            $('#pla_sound').val lst[1]
            $('#pla_sound').change()
          when '*custom'
            if lst[2].indexOf("obj") isnt -1
              if plaEditor.abilityOther.keys[lst[1]]
                console.log "HOGE"
                if !pla_ability_objs[lst[2]]
                  pla_ability_objs[lst[2]] =
                    "#{plaEditor.abilityOther.keys[lst[1]]}": lst[3]
            else
              if plaEditor.abilityOther.keys[lst[1]]
                if !pla_ability_blocks[lst[2]]
                  pla_ability_blocks[lst[2]] =
                    "#{plaEditor.abilityOther.keys[lst[1]]}": lst[3]
          else
            switch lst[1]
              when 'camerahalstar'
                $('#pla_camerahalstar').val lst[2]
      else
        console.log $("#td#{lst[2]}_#{lst[1]}")
        $("#td#{lst[2]}_#{lst[1]}").css('background-image', "url(\"#{plaEditor.blockData[lst[0]].filename}\")").data 'pla_blockname', lst[0]
  $('#prog1').val 0
  $('#sc_add_select').val appendorprepend
  $('#sc_ground').css "width", ((Math.abs(sc_column_zero) + sc_column_len) / 2 * 48).toString() + "px"

  footer = ""
  if input_str_ar[input_i] isnt "// stageCTRL::edit not_footer"
    input_i++
    while input_str_ar[input_i] isnt "// stageCTRL::edit /footer"
      footer += input_str_ar[input_i] + "\n"
      input_i++
    $('#sc_footer').val footer
  console.log Editor.objcount
  return

Editor.OutputStage = ->
  build_str = ""
  buffer = new Editor.Buffer()
  buffer.append "// stageCTRL::edit PASTE START\n"
  buffer.append "// stageCTRL::edit sc_row_len=#{sc_row_len}\n"
  buffer.append "// stageCTRL::edit sc_row_zero=#{sc_row_zero}\n"
  buffer.append "// stageCTRL::edit sc_column_len=#{sc_column_len}\n"
  buffer.append "// stageCTRL::edit sc_column_zero=#{sc_column_zero}\n"

  if $('sc_header').val() is ""
    buffer.append "// stageCTRL::edit not_header\n"
  else
    buffer.append $('#sc_header').val()
    if $('#sc_header').val().substring($('#sc_header').val().length - 1) isnt "\n"
      buffer.append "\n"
    buffer.append "// stageCTRL::edit /header\n"

  buffer.append "*skybox,#{$('#pla_skybox').val()};\n"
  buffer.append "*sound,#{$('#pla_sound').val()};\n"

  if $('#pla_camerahalstar').val() isnt "0"
    buffer.append "*custom,camerahalstar,#{$('#pla_camerahalstar').val()};\n"

  console.log Editor.objcount
  $('#prog1').attr "max", (sc_row_len / 2) * (sc_column_len / 2)
  for i in [sc_row_zero...sc_row_len + 1] by 2
    for j in [sc_column_zero...sc_column_len + 1] by 2
      bg = $("#td#{i}_#{j}").css 'background-image'
      text = new Editor.Buffer()
      $('#prog1').val parseInt($('#prog1').val() + 1)
      if bg is "none" or !bg
        continue
      text.append "#{$("#td#{i}_#{j}").data "pla-blockname"},#{j},#{i}"
      text.append if text.BuffertoString() is "" then "" else "=td#{i}_#{j};\n"
      buffer.append text.BuffertoString()

      if pla_ability_blocks["td#{i}_#{j}"]
        ab = pla_ability_blocks["td#{i}_#{j}"]
        count = 0;
        for item in Object.keys(ab)
          console.log item
          buffer.append Object.keys(ab)[count].replace(/.name./g, "td#{i}_#{j}").replace(/.value./g, ab[item]) + "\n"
          count++
  $('#prog1').val 0

  #オブジェクト
  for i in [0...Editor.objcount] by 1
    if $("#obj#{i}").data('pla-objname') is "placreatepoint" or !$("#obj#{i}")
      continue
    cQ = $("#obj#{i}")
    buffer.append $("#obj#{i}").data('pla-objname').replace(/.slash./g, "/")
    buffer.append ",#{$("#obj#{i}").data('pla-obj-x')},#{$("#obj#{i}").data('pla-obj-y')}=obj#{i};\n"

    #属性
    if pla_ability_objs["obj#{i}"]
      ab = pla_ability_objs["obj#{i}"]
      count = 0
      for item2 in Object.keys(ab)
        buffer.append Object.keys(ab)[count].replace(/.name./g, "obj#{i}").replace(/.value./g, ab[item2]) + "\n"
        count++
  # footer
  if $('#sc_footer').val() is ""
    buffer.append "// stageCTRL::edit not_footer\n"
  else
    buffer.append "// stageCTRL::edit footer\n"
    buffer.append $('#sc_footer').val()
    buffer.append "// stageCTRL::edit /footer\n"
  buffer.append "// stageCTRL::edit PASTE END\n"
  build_str = buffer.BuffertoString()
  $('#pla_input_content').css 'display', 'none'
  $('#pla_output_content').css 'display', 'block'
  $('#sc_output').val build_str
  fadebox.showWindow "pla_outputbox"

# ui.js
$ ->
  $('#sc_input_btn').click Editor.InputStage
  $('#sc_output_btn').click Editor.OutputStage

  $('#sc_ground_window').mousemove Editor.objmove

  $('#sc_add_column').click ->
    if $('#sc_add_select').val() is "0"
      Editor.sc_ground_createcolumn sc_column_len += 2
    else
      Editor.sc_ground_createcolumn sc_column_zero -= 2
      # オブジェクトを移動させる
      for i in [0...Editor.objcount] by 1
        $("#obj#{i}").css 'left', parseInt($("#obj#{i}")).css('left') + 50
  return

# grid.js
Editor.sc_ground_createline = (i) ->
  elem = $("<tr class=\"sc_box_tr\" data-scboxtr-num=\"#{i}\" id=\"tr#{i}\"></tr>")
  if $('#sc_add_select').val() is "0"
    $('#sc_ground').append(elem)
  else
    $('#sc_ground').prepend(elem)
  for j in [sc_column_zero...sc_column_len + 1] by 2
    $("#tr#{i}").append $("<td class=\"sc_box_td\" data-scboxtd-num=\"#{j}\" id=\"td#{i}_#{j}\" data-pla-blockname=\"none\"></td>")
  return

Editor.sc_ground_createcolumn = (j) ->
  if $('#sc_add_select').val() is "0"
    for i in [sc_row_zero...sc_row_len + 1] by 2
      add_elem = "<td class=\"sc_box_td\" data-scboxtd-num=\"#{j}\" id=\"td#{i}_#{j}\"></td>"
      $("#tr#{i}").append $(add_elem)
  else
    for i in [sc_row_zero...sc_row_len + 1] by 2
      add_elem = "<td class=\"sc_box_td\" data-scboxtd-num=\"#{j}\" id=\"td#{i}_#{j}\"></td>"
      $("#tr#{i}").prepend $(add_elem)
  return

# obj.js
Editor.createplaObject = (name, _x, _y) -> 
  width = plaEditor.objData[name].width; height = plaEditor.objData[name].height
  x = parseInt _x; y = parseInt _y
  padding = 6; b = 25
  if Editor.Zoom.IsZoom()
    b = 13
  left = padding + (b * (x + 1 + (-sc_column_zero))); top = padding + b * (sc_row_len - (y - 1))
  left -= width / 2; top -= height / 2
  obj = $("<div id=\"obj#{Editor.objcount}\" class=\"pla_obj\" style=\"background-image:url('#{plaEditor.objData[name].filename}'); left: #{left}px; top:#{top}px; width: #{width}px; height: #{height}px;\" data-pla-objname=\"#{name}\" data-pla-obj-x=\"#{_x}\" data-pla-obj-y=\"#{_y}\"></div>")
  $('#pla_objects').append obj
  Editor.objcount++
  return
pla_activeobj = ""
Editor.objmove = (e) ->
  if pla_activeobj isnt ""
    padding = 6; b = 25
    if Editor.Zoom.IsZoom()
      b = 13
    x = e.pageX - parseInt($(pla_activeobj).css('width')) / 2; y = e.pageY - parseInt($(pla_activeobj).css('height')) / 2
    x -= (x - padding) % b; y -= (y - padding) % b
    $(pla_activeobj).offset(
      left: x
      top: y
    )

    # 補正
    left = parseInt($(pla_activeobj).css('left')) - padding
    top = parseInt($(pla_activeobj).css('top')) - padding
    left -= left % b
    top -= top % b
    $(pla_activeobj).css('left', left + padding).css 'top', top + padding

    obj_w = (parseInt($(pla_activeobj).css('width')) / 2 / b) - 1
    obj_h = (parseInt($(pla_activeobj).css('height')) / 2 / b) - 1
    $(pla_activeobj).data('pla-obj-x', (left / b) + obj_w + sc_column_zero).data 'pla-obj-y', 0 - ((top / b) - sc_row_len) - obj_h

Editor.objdelete = ->
  id = parseInt $('.pla_obj_select').attr("id").substring(3)
  $('.pla_obj_select').remove()

  # 前に詰める
  for i in [id...Editor.objcount] by 1
    $("#obj#{i}").attr 'id', 'obj' + (i - 1).toString()
  Editor.objcount--

  Editor.abilityObj.deleteAbility $('#pla_obj_name').text()
  $('#pla_obj_name').text ""

Editor.ObjPoint = null
Editor.createObjPoint = ->
  Editor.createplaObject "placreatepoint", 0, 0
  Editor.ObjPoint = $ "[data-pla-objname=placreatepoint]"

# ability.js
Editor.ability = {}
Editor.abilityObj = {}

Editor.ability.add = ->
  if !$('#pla_abilities_select').val()
    return
  if !$('#pla_blockid').text()
    alert 'ブロックが選択されていません'
    return
  newAbility = $('<div class="pla_ability" data-pla-ability="' + $('#pla_abilities_select').val() + '">' + '<span class="pla_ability_text">' + plaEditor.abilities[$('#pla_abilities_select').val()] + '</span>' + ' : ' + '<input type="' + plaEditor.abilityTypes[$('#pla_abilities_select').val()] + '" style="width: 100px;" />' + '</div>')
  $('#pla_abilities').append newAbility

  Editor.ability.changeAbility $('#pla_blockid').text(), $('#pla_abilities_select').val(), 0

Editor.abilityObj.add = ->
  if !$('#pla_abilities_select_obj').val()
    return
  if !$('#pla_obj_name').text()
    alert 'オブジェクトが選択されていません'
    return
  newAbility = $('<div class="pla_ability" data-pla-ability="' + $('#pla_abilities_select_obj').val() + '">' + '<span class="pla_ability_text">' + plaEditor.abilities[$('#pla_abilities_select_obj').val()] + '</span>' + ' : ' + '<input type="' + plaEditor.abilityTypes[$('#pla_abilities_select_obj').val()] + '" style="width: 100px;" />' + '</div>')
  $('#pla_abilities_obj').append newAbility

  Editor.abilityObj.changeAbility $('#pla_obj_name').text(), $('#pla_abilities_select_obj').val(), 0

Editor.ability.changeAbility = (blockid, ability, value) ->
  if !pla_ability_blocks[blockid] then pla_ability_blocks[blockid] = {}
  #console.log pla_ability_blocks)
  pla_ability_blocks[blockid][ability] = value;

Editor.abilityObj.changeAbility = (objid, ability, value) ->
  if !pla_ability_objs[objid] then pla_ability_objs[objid] = {}
  pla_ability_objs[objid][ability] = value;

Editor.ability.readAbility = (blockid) ->
  if !pla_ability_blocks[blockid]
    return
  for item in [0...Object.keys(pla_ability_blocks[blockid]).length] by 1
    console.log item
    cur = Object.keys(pla_ability_blocks[blockid])[item];
    additem = $(
      '<div class="pla_ability" data-pla-ability="' + cur + '">' +
      '<span class="pla_ability_text">' +
      plaEditor.abilities[cur] + 
      '</span>' +
      ' : ' +
      '<input type="' + plaEditor.abilityTypes[cur] + '" style="width: 100px;" ' +
      'value="' + pla_ability_blocks[blockid][cur] + '" />' +
      '</div>')
    $('#pla_abilities').append additem
  return

Editor.abilityObj.readAbility = (objid) ->
  if !pla_ability_objs[objid]
    return
  additem = 0
  for item in [0...Object.keys(pla_ability_objs[objid]).length] by 1
    cur = Object.keys(pla_ability_objs[objid])[item];
    additem = $(
      '<div class="pla_ability" data-pla-ability="' + cur + '">' +
      '<span class="pla_ability_text">' +
      plaEditor.abilities[cur] + 
      '</span>' +
      ' : ' +
      '<input type="' + plaEditor.abilityTypes[cur] + '" style="width: 100px;" ' +
      'value="' + pla_ability_objs[objid][cur] + '" />' +
      '</div>')
    $('#pla_abilities_obj').append additem
  return

Editor.ability.deleteAbility = (blockid) ->
  if !pla_ability_blocks[blockid]
    return
  delete pla_ability_blocks[blockid]

Editor.abilityObj.deleteAbility = (objid) ->
  if !pla_ability_objs[objid]
    return
  delete pla_ability_objs[objid]

# zoom.js
Editor.Zoom = {}
do ->
  iszoom = null
  Editor.Zoom.IsZoom = ->
    return iszoom
  Editor.Zoom.IsZoomReset = ->
    iszoom = false
  Editor.Zoom.Zoomout = ->
    if Editor.Zoom.IsZoom()
      return
    iszoom = true

    $("sc_ground tbody tr td").css("width", "24px").css "height", "24px"
    $('#sc_ground').css "width", ($('#sc_ground').width() / 2) + "px"
    $('#sc_ground tbody tr').css "height", "24px"

    objs = $ '#pla_objects *'
    for i in [0...objs.length] by 1
      $(objs[i]).css "left", ((((parseInt(objs[i].style.left) - 6) / 50) * 26) + 6) + "px"
      $(objs[i]).css "top", ((((parseInt(objs[i].style.top) - 6) / 50) * 26) + 6) + "px"
      $(objs[i]).css("width", (($(objs[i]).width() / 50) * 26) + "px").css "height", (($(objs[i]).height() / 50) * 26) + "px"

  # TODO
  Editor.Zoom.Zoomin = ->
    if !Editor.Zoom.IsZoom()
      return
    iszoom = false
    $('#sc_ground tbody tr td').css("width", "48px").css "height", "48px"
    $('#sc_ground tbody tr').css "height", "48px"

    objs = $ '#pla_objects *'
    for i in [0...objs.length] by 1
      $(objs[i]).css "left", ((((parseInt(objs[i].style.left) - 6) / 26) * 50) + 6) + "px"
      $(objs[i]).css "top", ((((parseInt(objs[i].style.top) - 6) / 26) * 50) + 6) + "px"
      $(objs[i]).css("width", (($(objs[i]).width() / 26) * 50) + "px").css "height", (($(objs[i]).height() / 26) * 50) + "px"

# main.js
sc_row_len = sc_column_len = 14
sc_row_zero = sc_column_zero = 0
pla_header = pla_footer = ""

plaEditor.objData = plaEditor.blockData = pla_blockdescription = plaEditor.abilityTypes = plaEditor.abilities = plaEditor.abilityOther = {}
pla_ability_blocks = pla_ability_objs = {}

Editor.objcount = 0

Editor.clearBlockdata = ->
  $('#pla_blockname').text ""
  $('#pla_blockid').text ""
  $('#pla_blockpos').text ""
  $('#pla_blocktype').text ""
  $('#pla_blockdescription').text ""
  $('#pla_abilities').html ""

Editor.clearObjdata = ->
  $('#pla_obj_name').text ""
  $('#pla_abilities_obj').html ""

Editor.start = ->
  $('#sc_add_select').val　"1"
  for i in [0...8*2] by 2
    Editor.sc_ground_createline(i)
  sc_row_len = sc_column_len = 14
  $('#sc_add_select').val "0"
  $('#pla_skybox').val "sky-w1"
  $('#pla_mode_select').val "block"
  $('#pla_isgrid').prop "checked", true
  $('#pla_sound').val "bgmz"
  $('#pla_objects_select').val "dokan"


  return
$ ->
  i18n.init (t) ->
    $(document).i18n()
    return

  Editor.start()
  isSKey = false; isGKey = false
  $(".pla_tooltip").tooltip()
  $(window).keydown (e) ->
    result = false
    switch e.keyCode
      when 83 #s
        isSKey = true
      when 71 #g
        isGKey = true
      when 112 # F1
        $('#sc_output_btn').click()
      when 113 # F2
        $('#pla_input_btn').click()
      when 9 # tab
        nextV = $('#pla_mode_select option:selected').next().val() or $('#pla_mode_select > option:first').val()
        $('#pla_mode_select').val(nextV).change()
      else
        result = true
    return result
  $(window).keyup (e) ->
    result = false
    switch e.keyCode
      when 83 #s
        isSKey = false
      when 71 #g
        isGKey = false
      else
        result = true
    return result
  adblc = (e, id) ->
    if !isSKey and !isGKey
      mode = $('#pla_mode').val()
      if mode is "auto"
        console.log ($(id).css('background-image') is 'none' or !$(id).css 'background-image')
        mode = if ($(id).css('background-image') is 'none' or !$(id).css 'background-image') then "insert" else "delete"
      if mode is "insert"
        $(id).css 'background-image', "url(\"#{plaEditor.blockData[$('#sc_icon_select').val()].filename}\")"
        $(id).data 'pla-blockname', $('#sc_icon_select').val()
      else
        $(id).css 'background-image', "none"
        $(id).data 'pla-blockname', "none"
        Editor.ability.deleteAbility $(id).attr("id")
        if $("#pla_blockid").text() is $(id).attr("id")
          Editor.clearBlockdata()
    else if isSKey
      $('#pla_blockname').text $(id).data('pla-blockname')
      $('#pla_blockpos').text "#{$(id).data('scboxtd-num')},#{$(id).parent().data('scboxtr-num')}"
      console.log $(id).data('pla-blockname')
      if pla_blockdescription[$(id).data('pla-blockname')]
        $('#pla_blocktype').text pla_blockdescription[$(id).data('pla-blockname')].type or "不明"
        $('#pla_blockdescription').text pla_blockdescription[$(id).data('pla-blockname')].description or "説明なし"
      $('#pla_blockid').text $(id).attr("id")
      $('#pla_abilities').html ""
      Editor.ability.readAbility $('#pla_blockid').text()
    else if isGKey
      $('#sc_icon_select').val $(id).data('pla-blockname')
  $('#sc_ground').on("mousemove", ".sc_box_tr .sc_box_td", (e) ->
    $('#sc_pos').text "x: #{$(@).data("scboxtd-num")} y: #{$(@).parent().data("scboxtr-num")}"
    if e.buttons isnt 1
      return
    if $('#pla_isn').prop("checked")
      adblc e, "##{$(@).attr("id")}"
  ).on "click", ".sc_box_tr .sc_box_td", (e) ->
    if !$('#pla_isn').prop "checked"
      adblc e, "##{$(@).attr("id")}"
  $('#sc_add_row').click ->
    if $('#sc_add_select').val() is "0"
      Editor.sc_ground_createline sc_row_zero -= 2
    else
      Editor.sc_ground_createline sc_row_len += 2
      for i in [0...Editor.objcount] by 1
        $("#obj#{i}").css "top", parseInt($("#obj#{i}").css "top") + 50
  $('#pla_skybox').change ->
    $('#sc_ground_window').css "background-image", "url(\"images/skybox/#{$('#pla_skybox').val()}.png\")"
  $('#pla_isgrid').change ->
    if $('#pla_isgrid').prop("checked")
      $('.sc_box_td').css 'border', '1px solid gray'
    else
      $('.sc_box_td').css 'border', 'none'
  $('#pla_object_add').click ->
    Editor.createplaObject $('#pla_object_name').data("name"), Editor.ObjPoint.data("pla-obj-x"), Editor.ObjPoint.data("pla-obj-y")
  $('#pla_obj_unselect').click ->
    $('.pla_obj_select').removeClass 'pla_obj_select'
    $('#pla_obj_name').text ""
  $('#pla_sound_play').click ->
    $('#pla_sound_elem')[0].play()
  $('#pla_sound_stop').click ->
    $('#pla_sound_elem')[0].pause()
    $('#pla_sound_elem')[0].currentTime = 0
  $('#pla_sound').change ->
    $('#pla_sound_elem').attr "src", "sounds/#{$('#pla_sound').val()}.wav"
  $('#pla_objects').on("mousedown", ".pla_obj", (e) ->
    pla_activeobj = "##{e.target.id}"
    $('.pla_obj').removeClass 'pla_obj_select'
    $(pla_activeobj).addClass 'pla_obj_select'
    Editor.clearObjdata()
    $('#pla_obj_name').text e.target.id
    Editor.abilityObj.readAbility(e.target.id)
  ).on("mouseup", ".pla_obj", ->
    pla_activeobj = ""
  ).on "mousemove", ".pla_obj", (e) ->
    Editor.objmove e
  $('#pla_mode_select').change ->
    enabledItemId = -1
    items = [$('#pla_footer_blockmode'), $('#pla_footer_objectmode'), $('#pla_footer_file')]
    switch $(@).val()
      when "block"
        enabledItemId = 0
      when "object"
        enabledItemId = 1
      when "file"
        enabledItemId = 2
    if enabledItemId isnt -1
      for i in [0...items.length] by 1
        if i is enabledItemId
          items[i].css "display", "inline-block"
        else
          items[i].css "display", "none"
  $('#pla_obj_delete').click Editor.objdelete
  $('#sc_all_clear').click ->
    $('.sc_box_td').css 'background-image', 'none'
  $('#sc_all_fill').click ->
    $('.sc_box_td').css 'background-image', "url(\"images/mapicons/#{$('#sc_icon_select').val()}.png\")"
  $('#sc_icon_select').tooltip()
  $('#pla_mode_select').tooltip()
  $('#pla_input_btn').click ->
    $('#pla_input_content').css "display", "block"
    $('#pla_output_content').css "display", "none"
    fadebox.showWindow "pla_outputbox"
  $('#sc_ground').hover ->
    $(@).focus()
  $('#pla_add_ability').click Editor.ability.add
  $('#pla_add_ability_obj').click Editor.abilityObj.add
  $('#pla_abilities').on "change", "div input", ->
    Editor.ability.changeAbility $('#pla_blockid').text(), $(@).parent().data("pla-ability"), $(@).val()
  $('#pla_abilities_obj') .on "change", "div input", ->
    Editor.abilityObj.changeAbility $('#pla_obj_name').text(), $(@).parent().data("pla-ability"), $(@).val()
  $('#pla_object_select_btn').click ->
    fadebox.showWindow "pla_object_dialog"
  $('#pla_objects_select').change ->
    $('#pla_object_preview').attr "src", plaEditor.objData[$(@).val()].filename
    $('#pla_object_description').html if pla_blockdescription[$(@).val()] then pla_blockdescription[$(@).val()].description else "説明はありません"
  $('#pla_object_submit').click ->
    fadebox.closeWindow "pla_object_dialog"
    $('#pla_object_name').text($("#pla_objects_select option:selected").text()).data "name", $("#pla_objects_select").val()


  # オブジェクトが表示されているか
  # [改善]
  isVisible = true
  $('#pla_object_visibility').click ->
    isVisible = !isVisible
    $('#pla_objects').css "display", if isVisible then "block" else "none"

  zeroclient = new ZeroClipboard(document.getElementById("pla-copy"))
  zeroclient.on "ready", (readyEvent) ->
    console.log "ZERO ready"
    zeroclient.on "aftercopy", (event) ->
      console.log "copied"
  return

# tool.js
$ ->
  $("#pla_tools_items tr td *").tooltip().click clickShortcutBtn
clickShortcutBtn = ->
  if shortCuts[@dataset.plamode.replace(/-/g,"")] isnt null
    shortCuts[@dataset.plamode.replace(/-/g,"")]()
shortCuts =
  blockauto: ->
    $('#pla_isn').prop "checked", false
    $('#pla_mode').val "auto"
  blockadd: ->
    $('#pla_isn').prop "checked", false
    $('#pla_mode').val "insert"
  blockdelete: ->
    $('#pla_isn').prop "checked", false
    $('#pla_mode').val "delete"
  paintadd: ->
    $('#pla_isn').prop "checked", true
    $('#pla_mode').val "insert"
  paintdelete: ->
    $('#pla_isn').prop "checked", true
    $('#pla_mode').val "delete"
  ioexport: ->
    $('#sc_output_btn').click()
  ioimport: ->
    $('#pla_input_btn').click();
  addlineup: ->
    b = $('#sc_add_select').val()
    $('#sc_add_select').val "1"
    $('#sc_add_row').click()
    $('#sc_add_select').val b
  addlineleft: ->
    b = $('#sc_add_select').val()
    $('#sc_add_select').val "1"
    $('#sc_add_column').click()
    $('#sc_add_select').val b
  addlineright: ->
    b = $('#sc_add_select').val()
    $('#sc_add_select').val "0"
    $('#sc_add_column').click()
    $('#sc_add_select').val b
  addlinedown: ->
    b = $('#sc_add_select').val()
    $('#sc_add_select').val "0"
    $('#sc_add_row').click()
    $('#sc_add_select').val b
  objshow: ->
    $('#pla_object_visibility').click()
  showstart: ->
    fadebox.showWindow("pla_startup")
  zoomout: ->
    Editor.Zoom.Zoomout()
  zoomin: ->
    Editor.Zoom.Zoomin()
  modeselect: ->
    fadebox.showWindow "pla_object_dialog"
