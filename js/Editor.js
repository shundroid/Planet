(function() {
  var clickShortcutBtn, pla_ability_blocks, pla_ability_objs, pla_activeobj, pla_blockdescription, pla_footer, pla_header, s$, sc_column_len, sc_column_zero, sc_row_len, sc_row_zero, shortCuts;

  window.Shundroid = {
    JSON2SelectInnerHTML: function(json) {
      var JSON2Select_innerHTML, i, k, ref;
      JSON2Select_innerHTML = "";
      for (i = k = 0, ref = Object.keys(json).length; k < ref; i = k += 1) {
        if (Shundroid.IsJSON(json[Object.keys(json)[i]])) {
          JSON2Select_innerHTML += '<optgroup label="' + Object.keys(json)[i] + '">\n';
          JSON2Select_innerHTML += Shundroid.JSON2SelectInnerHTML(json[Object.keys(json)[i]]);
          JSON2Select_innerHTML += '</optgroup>\n';
        } else {
          JSON2Select_innerHTML += '<option value="' + Object.keys(json)[i] + '">' + json[Object.keys(json)[i]] + '</option>\n';
        }
      }
      return JSON2Select_innerHTML;
    },
    IsJSON: function(j) {
      if (j) {
        return j.constructor === {}.constructor;
      } else {
        return false;
      }
    }
  };

  s$ = Shundroid;

  window.Editor = {};

  Editor.Buffer = function() {
    var b;
    b = "";
    this.append = function(s) {
      return b += s;
    };
    this.BuffertoString = function() {
      return b;
    };
  };

  Editor.InputStage = function() {
    var appendorprepend, currentAr, footer, header, header_count, i, input_i, input_str, input_str_ar, k, l, lst, obj1, obj2, pla_ability_blocks, pla_ability_objs, ref, ref1, ref2, ref3, sc_column_len, sc_column_zero, sc_row_len, sc_row_zero;
    Editor.clearBlockdata();
    Editor.clearObjdata();
    pla_ability_blocks = pla_ability_objs = {};
    Editor.Zoom.IsZoomReset();
    fadebox.closeWindow("pla_outputbox");
    $("#pla_input_content").css("display", "none");
    input_str = $("#sc_output").val().replace(/;/g, "");
    input_str_ar = input_str.split("\n");
    sc_row_len = parseInt(input_str_ar[1].substring("// stageCTRL::edit sc_row_len=".length));
    sc_row_zero = parseInt(input_str_ar[2].substring("// stageCTRL::edit sc_row_zero=".length));
    sc_column_len = parseInt(input_str_ar[3].substring("// stageCTRL::edit sc_column_len=".length));
    sc_column_zero = parseInt(input_str_ar[4].substring("// stageCTRL::edit sc_column_zero=".length));
    header = "";
    header_count = 5;
    if (input_str_ar[5] !== "// stageCTRL::edit not_header") {
      while (input_str_ar[header_count] !== "// stageCTRL::edit /header") {
        header += input_str_ar[header_count] + "\n";
        header_count++;
      }
      $("#sc_header").val(header);
    }
    $("#sc_ground").text("");
    $("#pla_objects").html("");
    Editor.objcount = 0;
    Editor.createObjPoint();
    appendorprepend = $("#sc_add_select").val();
    $("#sc_add_select").val("1");
    for (i = k = ref = sc_row_zero, ref1 = sc_row_len + 1; k < ref1; i = k += 2) {
      Editor.sc_ground_createline(i);
    }
    lst = "";
    input_i = null;
    $('#prog1').val(0);
    $('#prog1').attr('max', input_str_ar.length - header_count);
    for (input_i = l = ref2 = header_count, ref3 = input_str_ar.length; l < ref3; input_i = l += 1) {
      $("#prog1").val(parseInt($('#prog1').val()) + 1);
      currentAr = input_str_ar[input_i];
      if (currentAr === "// stageCTRL::edit not_footer" || currentAr === "// stageCTRL::edit footer") {
        break;
      }
      if (currentAr.indexOf("//") !== -1) {
        continue;
      }
      if (!currentAr) {
        continue;
      }
      if (currentAr.indexOf("=") !== -1) {
        currentAr = currentAr.split("=")[0];
      }
      lst = currentAr.split(",");
      if (plaEditor.objData["list"].indexOf(lst[0]) !== -1) {
        Editor.createplaObject(lst[0], lst[1], lst[2]);
      } else {
        if (input_str_ar[input_i].substring(0, 1) === "*") {
          switch (lst[0]) {
            case '*skybox':
              $('#pla_skybox').val(lst[1]);
              $('#pla_skybox').change();
              break;
            case '*sound':
              $('#pla_sound').val(lst[1]);
              $('#pla_sound').change();
              break;
            case '*custom':
              if (lst[2].indexOf("obj") !== -1) {
                if (plaEditor.abilityOther.keys[lst[1]]) {
                  console.log("HOGE");
                  if (!pla_ability_objs[lst[2]]) {
                    pla_ability_objs[lst[2]] = (
                      obj1 = {},
                      obj1["" + plaEditor.abilityOther.keys[lst[1]]] = lst[3],
                      obj1
                    );
                  }
                }
              } else {
                if (plaEditor.abilityOther.keys[lst[1]]) {
                  if (!pla_ability_blocks[lst[2]]) {
                    pla_ability_blocks[lst[2]] = (
                      obj2 = {},
                      obj2["" + plaEditor.abilityOther.keys[lst[1]]] = lst[3],
                      obj2
                    );
                  }
                }
              }
              break;
            default:
              switch (lst[1]) {
                case 'camerahalstar':
                  $('#pla_camerahalstar').val(lst[2]);
              }
          }
        } else {
          console.log($("#td" + lst[2] + "_" + lst[1]));
          $("#td" + lst[2] + "_" + lst[1]).css('background-image', "url(\"" + plaEditor.blockData[lst[0]].filename + "\")").data('pla_blockname', lst[0]);
        }
      }
    }
    $('#prog1').val(0);
    $('#sc_add_select').val(appendorprepend);
    $('#sc_ground').css("width", ((Math.abs(sc_column_zero) + sc_column_len) / 2 * 48).toString() + "px");
    footer = "";
    if (input_str_ar[input_i] !== "// stageCTRL::edit not_footer") {
      input_i++;
      while (input_str_ar[input_i] !== "// stageCTRL::edit /footer") {
        footer += input_str_ar[input_i] + "\n";
        input_i++;
      }
      $('#sc_footer').val(footer);
    }
    console.log(Editor.objcount);
  };

  Editor.OutputStage = function() {
    var ab, bg, buffer, build_str, cQ, count, i, item, item2, j, k, l, len, len1, m, n, o, ref, ref1, ref2, ref3, ref4, ref5, ref6, text;
    build_str = "";
    buffer = new Editor.Buffer();
    buffer.append("// stageCTRL::edit PASTE START\n");
    buffer.append("// stageCTRL::edit sc_row_len=" + sc_row_len + "\n");
    buffer.append("// stageCTRL::edit sc_row_zero=" + sc_row_zero + "\n");
    buffer.append("// stageCTRL::edit sc_column_len=" + sc_column_len + "\n");
    buffer.append("// stageCTRL::edit sc_column_zero=" + sc_column_zero + "\n");
    if ($('sc_header').val() === "") {
      buffer.append("// stageCTRL::edit not_header\n");
    } else {
      buffer.append($('#sc_header').val());
      if ($('#sc_header').val().substring($('#sc_header').val().length - 1) !== "\n") {
        buffer.append("\n");
      }
      buffer.append("// stageCTRL::edit /header\n");
    }
    buffer.append("*skybox," + ($('#pla_skybox').val()) + ";\n");
    buffer.append("*sound," + ($('#pla_sound').val()) + ";\n");
    if ($('#pla_camerahalstar').val() !== "0") {
      buffer.append("*custom,camerahalstar," + ($('#pla_camerahalstar').val()) + ";\n");
    }
    console.log(Editor.objcount);
    $('#prog1').attr("max", (sc_row_len / 2) * (sc_column_len / 2));
    for (i = k = ref = sc_row_zero, ref1 = sc_row_len + 1; k < ref1; i = k += 2) {
      for (j = l = ref2 = sc_column_zero, ref3 = sc_column_len + 1; l < ref3; j = l += 2) {
        bg = $("#td" + i + "_" + j).css('background-image');
        text = new Editor.Buffer();
        $('#prog1').val(parseInt($('#prog1').val() + 1));
        if (bg === "none" || !bg) {
          continue;
        }
        text.append(($("#td" + i + "_" + j).data("pla-blockname")) + "," + j + "," + i);
        text.append(text.BuffertoString() === "" ? "" : "=td" + i + "_" + j + ";\n");
        buffer.append(text.BuffertoString());
        if (pla_ability_blocks["td" + i + "_" + j]) {
          ab = pla_ability_blocks["td" + i + "_" + j];
          count = 0;
          ref4 = Object.keys(ab);
          for (m = 0, len = ref4.length; m < len; m++) {
            item = ref4[m];
            console.log(item);
            buffer.append(Object.keys(ab)[count].replace(/.name./g, "td" + i + "_" + j).replace(/.value./g, ab[item]) + "\n");
            count++;
          }
        }
      }
    }
    $('#prog1').val(0);
    for (i = n = 0, ref5 = Editor.objcount; n < ref5; i = n += 1) {
      if ($("#obj" + i).data('pla-objname') === "placreatepoint" || !$("#obj" + i)) {
        continue;
      }
      cQ = $("#obj" + i);
      buffer.append($("#obj" + i).data('pla-objname').replace(/.slash./g, "/"));
      buffer.append("," + ($("#obj" + i).data('pla-obj-x')) + "," + ($("#obj" + i).data('pla-obj-y')) + "=obj" + i + ";\n");
      if (pla_ability_objs["obj" + i]) {
        ab = pla_ability_objs["obj" + i];
        count = 0;
        ref6 = Object.keys(ab);
        for (o = 0, len1 = ref6.length; o < len1; o++) {
          item2 = ref6[o];
          buffer.append(Object.keys(ab)[count].replace(/.name./g, "obj" + i).replace(/.value./g, ab[item2]) + "\n");
          count++;
        }
      }
    }
    if ($('#sc_footer').val() === "") {
      buffer.append("// stageCTRL::edit not_footer\n");
    } else {
      buffer.append("// stageCTRL::edit footer\n");
      buffer.append($('#sc_footer').val());
      buffer.append("// stageCTRL::edit /footer\n");
    }
    buffer.append("// stageCTRL::edit PASTE END\n");
    build_str = buffer.BuffertoString();
    $('#pla_input_content').css('display', 'none');
    $('#pla_output_content').css('display', 'block');
    $('#sc_output').val(build_str);
    return fadebox.showWindow("pla_outputbox");
  };

  $(function() {
    $('#sc_input_btn').click(Editor.InputStage);
    $('#sc_output_btn').click(Editor.OutputStage);
    $('#sc_ground_window').mousemove(Editor.objmove);
    $('#sc_add_column').click(function() {
      var i, k, ref, results;
      if ($('#sc_add_select').val() === "0") {
        return Editor.sc_ground_createcolumn(sc_column_len += 2);
      } else {
        Editor.sc_ground_createcolumn(sc_column_zero -= 2);
        results = [];
        for (i = k = 0, ref = Editor.objcount; k < ref; i = k += 1) {
          results.push($("#obj" + i).css('left', parseInt($("#obj" + i)).css('left') + 50));
        }
        return results;
      }
    });
  });

  Editor.sc_ground_createline = function(i) {
    var elem, j, k, ref, ref1;
    elem = $("<tr class=\"sc_box_tr\" data-scboxtr-num=\"" + i + "\" id=\"tr" + i + "\"></tr>");
    if ($('#sc_add_select').val() === "0") {
      $('#sc_ground').append(elem);
    } else {
      $('#sc_ground').prepend(elem);
    }
    for (j = k = ref = sc_column_zero, ref1 = sc_column_len + 1; k < ref1; j = k += 2) {
      $("#tr" + i).append($("<td class=\"sc_box_td\" data-scboxtd-num=\"" + j + "\" id=\"td" + i + "_" + j + "\" data-pla-blockname=\"none\"></td>"));
    }
  };

  Editor.sc_ground_createcolumn = function(j) {
    var add_elem, i, k, l, ref, ref1, ref2, ref3;
    if ($('#sc_add_select').val() === "0") {
      for (i = k = ref = sc_row_zero, ref1 = sc_row_len + 1; k < ref1; i = k += 2) {
        add_elem = "<td class=\"sc_box_td\" data-scboxtd-num=\"" + j + "\" id=\"td" + i + "_" + j + "\"></td>";
        $("#tr" + i).append($(add_elem));
      }
    } else {
      for (i = l = ref2 = sc_row_zero, ref3 = sc_row_len + 1; l < ref3; i = l += 2) {
        add_elem = "<td class=\"sc_box_td\" data-scboxtd-num=\"" + j + "\" id=\"td" + i + "_" + j + "\"></td>";
        $("#tr" + i).prepend($(add_elem));
      }
    }
  };

  Editor.createplaObject = function(name, _x, _y) {
    var b, height, left, obj, padding, top, width, x, y;
    width = plaEditor.objData[name].width;
    height = plaEditor.objData[name].height;
    x = parseInt(_x);
    y = parseInt(_y);
    padding = 6;
    b = 25;
    if (Editor.Zoom.IsZoom()) {
      b = 13;
    }
    left = padding + (b * (x + 1 + (-sc_column_zero)));
    top = padding + b * (sc_row_len - (y - 1));
    left -= width / 2;
    top -= height / 2;
    obj = $("<div id=\"obj" + Editor.objcount + "\" class=\"pla_obj\" style=\"background-image:url('" + plaEditor.objData[name].filename + "'); left: " + left + "px; top:" + top + "px; width: " + width + "px; height: " + height + "px;\" data-pla-objname=\"" + name + "\" data-pla-obj-x=\"" + _x + "\" data-pla-obj-y=\"" + _y + "\"></div>");
    $('#pla_objects').append(obj);
    Editor.objcount++;
  };

  pla_activeobj = "";

  Editor.objmove = function(e) {
    var b, left, obj_h, obj_w, padding, top, x, y;
    if (pla_activeobj !== "") {
      padding = 6;
      b = 25;
      if (Editor.Zoom.IsZoom()) {
        b = 13;
      }
      x = e.pageX - parseInt($(pla_activeobj).css('width')) / 2;
      y = e.pageY - parseInt($(pla_activeobj).css('height')) / 2;
      x -= (x - padding) % b;
      y -= (y - padding) % b;
      $(pla_activeobj).offset({
        left: x,
        top: y
      });
      left = parseInt($(pla_activeobj).css('left')) - padding;
      top = parseInt($(pla_activeobj).css('top')) - padding;
      left -= left % b;
      top -= top % b;
      $(pla_activeobj).css('left', left + padding).css('top', top + padding);
      obj_w = (parseInt($(pla_activeobj).css('width')) / 2 / b) - 1;
      obj_h = (parseInt($(pla_activeobj).css('height')) / 2 / b) - 1;
      return $(pla_activeobj).data('pla-obj-x', (left / b) + obj_w + sc_column_zero).data('pla-obj-y', 0 - ((top / b) - sc_row_len) - obj_h);
    }
  };

  Editor.objdelete = function() {
    var i, id, k, ref, ref1;
    id = parseInt($('.pla_obj_select').attr("id").substring(3));
    $('.pla_obj_select').remove();
    for (i = k = ref = id, ref1 = Editor.objcount; k < ref1; i = k += 1) {
      $("#obj" + i).attr('id', 'obj' + (i - 1).toString());
    }
    Editor.objcount--;
    Editor.abilityObj.deleteAbility($('#pla_obj_name').text());
    return $('#pla_obj_name').text("");
  };

  Editor.ObjPoint = null;

  Editor.createObjPoint = function() {
    Editor.createplaObject("placreatepoint", 0, 0);
    return Editor.ObjPoint = $("[data-pla-objname=placreatepoint]");
  };

  Editor.ability = {};

  Editor.abilityObj = {};

  Editor.ability.add = function() {
    var newAbility;
    if (!$('#pla_abilities_select').val()) {
      return;
    }
    if (!$('#pla_blockid').text()) {
      alert('ブロックが選択されていません');
      return;
    }
    newAbility = $('<div class="pla_ability" data-pla-ability="' + $('#pla_abilities_select').val() + '">' + '<span class="pla_ability_text">' + plaEditor.abilities[$('#pla_abilities_select').val()] + '</span>' + ' : ' + '<input type="' + plaEditor.abilityTypes[$('#pla_abilities_select').val()] + '" style="width: 100px;" />' + '</div>');
    $('#pla_abilities').append(newAbility);
    return Editor.ability.changeAbility($('#pla_blockid').text(), $('#pla_abilities_select').val(), 0);
  };

  Editor.abilityObj.add = function() {
    var newAbility;
    if (!$('#pla_abilities_select_obj').val()) {
      return;
    }
    if (!$('#pla_obj_name').text()) {
      alert('オブジェクトが選択されていません');
      return;
    }
    newAbility = $('<div class="pla_ability" data-pla-ability="' + $('#pla_abilities_select_obj').val() + '">' + '<span class="pla_ability_text">' + plaEditor.abilities[$('#pla_abilities_select_obj').val()] + '</span>' + ' : ' + '<input type="' + plaEditor.abilityTypes[$('#pla_abilities_select_obj').val()] + '" style="width: 100px;" />' + '</div>');
    $('#pla_abilities_obj').append(newAbility);
    return Editor.abilityObj.changeAbility($('#pla_obj_name').text(), $('#pla_abilities_select_obj').val(), 0);
  };

  Editor.ability.changeAbility = function(blockid, ability, value) {
    if (!pla_ability_blocks[blockid]) {
      pla_ability_blocks[blockid] = {};
    }
    return pla_ability_blocks[blockid][ability] = value;
  };

  Editor.abilityObj.changeAbility = function(objid, ability, value) {
    if (!pla_ability_objs[objid]) {
      pla_ability_objs[objid] = {};
    }
    return pla_ability_objs[objid][ability] = value;
  };

  Editor.ability.readAbility = function(blockid) {
    var additem, cur, item, k, ref;
    if (!pla_ability_blocks[blockid]) {
      return;
    }
    for (item = k = 0, ref = Object.keys(pla_ability_blocks[blockid]).length; k < ref; item = k += 1) {
      console.log(item);
      cur = Object.keys(pla_ability_blocks[blockid])[item];
      additem = $('<div class="pla_ability" data-pla-ability="' + cur + '">' + '<span class="pla_ability_text">' + plaEditor.abilities[cur] + '</span>' + ' : ' + '<input type="' + plaEditor.abilityTypes[cur] + '" style="width: 100px;" ' + 'value="' + pla_ability_blocks[blockid][cur] + '" />' + '</div>');
      $('#pla_abilities').append(additem);
    }
  };

  Editor.abilityObj.readAbility = function(objid) {
    var additem, cur, item, k, ref;
    if (!pla_ability_objs[objid]) {
      return;
    }
    additem = 0;
    for (item = k = 0, ref = Object.keys(pla_ability_objs[objid]).length; k < ref; item = k += 1) {
      cur = Object.keys(pla_ability_objs[objid])[item];
      additem = $('<div class="pla_ability" data-pla-ability="' + cur + '">' + '<span class="pla_ability_text">' + plaEditor.abilities[cur] + '</span>' + ' : ' + '<input type="' + plaEditor.abilityTypes[cur] + '" style="width: 100px;" ' + 'value="' + pla_ability_objs[objid][cur] + '" />' + '</div>');
      $('#pla_abilities_obj').append(additem);
    }
  };

  Editor.ability.deleteAbility = function(blockid) {
    if (!pla_ability_blocks[blockid]) {
      return;
    }
    return delete pla_ability_blocks[blockid];
  };

  Editor.abilityObj.deleteAbility = function(objid) {
    if (!pla_ability_objs[objid]) {
      return;
    }
    return delete pla_ability_objs[objid];
  };

  Editor.Zoom = {};

  (function() {
    var iszoom;
    iszoom = null;
    Editor.Zoom.IsZoom = function() {
      return iszoom;
    };
    Editor.Zoom.IsZoomReset = function() {
      return iszoom = false;
    };
    Editor.Zoom.Zoomout = function() {
      var i, k, objs, ref, results;
      if (Editor.Zoom.IsZoom()) {
        return;
      }
      iszoom = true;
      $("sc_ground tbody tr td").css("width", "24px").css("height", "24px");
      $('#sc_ground').css("width", ($('#sc_ground').width() / 2) + "px");
      $('#sc_ground tbody tr').css("height", "24px");
      objs = $('#pla_objects *');
      results = [];
      for (i = k = 0, ref = objs.length; k < ref; i = k += 1) {
        $(objs[i]).css("left", ((((parseInt(objs[i].style.left) - 6) / 50) * 26) + 6) + "px");
        $(objs[i]).css("top", ((((parseInt(objs[i].style.top) - 6) / 50) * 26) + 6) + "px");
        results.push($(objs[i]).css("width", (($(objs[i]).width() / 50) * 26) + "px").css("height", (($(objs[i]).height() / 50) * 26) + "px"));
      }
      return results;
    };
    return Editor.Zoom.Zoomin = function() {
      var i, k, objs, ref, results;
      if (!Editor.Zoom.IsZoom()) {
        return;
      }
      iszoom = false;
      $('#sc_ground tbody tr td').css("width", "48px").css("height", "48px");
      $('#sc_ground tbody tr').css("height", "48px");
      objs = $('#pla_objects *');
      results = [];
      for (i = k = 0, ref = objs.length; k < ref; i = k += 1) {
        $(objs[i]).css("left", ((((parseInt(objs[i].style.left) - 6) / 26) * 50) + 6) + "px");
        $(objs[i]).css("top", ((((parseInt(objs[i].style.top) - 6) / 26) * 50) + 6) + "px");
        results.push($(objs[i]).css("width", (($(objs[i]).width() / 26) * 50) + "px").css("height", (($(objs[i]).height() / 26) * 50) + "px"));
      }
      return results;
    };
  })();

  sc_row_len = sc_column_len = 14;

  sc_row_zero = sc_column_zero = 0;

  pla_header = pla_footer = "";

  plaEditor.objData = plaEditor.blockData = pla_blockdescription = plaEditor.abilityTypes = plaEditor.abilities = plaEditor.abilityOther = {};

  pla_ability_blocks = pla_ability_objs = {};

  Editor.objcount = 0;

  Editor.clearBlockdata = function() {
    $('#pla_blockname').text("");
    $('#pla_blockid').text("");
    $('#pla_blockpos').text("");
    $('#pla_blocktype').text("");
    $('#pla_blockdescription').text("");
    return $('#pla_abilities').html("");
  };

  Editor.clearObjdata = function() {
    $('#pla_obj_name').text("");
    return $('#pla_abilities_obj').html("");
  };

  Editor.start = function() {
    var i, k, ref;
    $('#sc_add_select').val("1");
    for (i = k = 0, ref = 8 * 2; k < ref; i = k += 2) {
      Editor.sc_ground_createline(i);
    }
    sc_row_len = sc_column_len = 14;
    $('#sc_add_select').val("0");
    $('#pla_skybox').val("sky-w1");
    $('#pla_mode_select').val("block");
    $('#pla_isgrid').prop("checked", true);
    $('#pla_sound').val("bgmz");
    $('#pla_objects_select').val("dokan");
  };

  $(function() {
    var adblc, isGKey, isSKey, isVisible, zeroclient;
    i18n.init(function(t) {
      $(document).i18n();
    });
    Editor.start();
    isSKey = false;
    isGKey = false;
    $(".pla_tooltip").tooltip();
    $(window).keydown(function(e) {
      var nextV, result;
      result = false;
      switch (e.keyCode) {
        case 83:
          isSKey = true;
          break;
        case 71:
          isGKey = true;
          break;
        case 112:
          $('#sc_output_btn').click();
          break;
        case 113:
          $('#pla_input_btn').click();
          break;
        case 9:
          nextV = $('#pla_mode_select option:selected').next().val() || $('#pla_mode_select > option:first').val();
          $('#pla_mode_select').val(nextV).change();
          break;
        default:
          result = true;
      }
      return result;
    });
    $(window).keyup(function(e) {
      var result;
      result = false;
      switch (e.keyCode) {
        case 83:
          isSKey = false;
          break;
        case 71:
          isGKey = false;
          break;
        default:
          result = true;
      }
      return result;
    });
    adblc = function(e, id) {
      var mode;
      if (!isSKey && !isGKey) {
        mode = $('#pla_mode').val();
        if (mode === "auto") {
          console.log($(id).css('background-image') === 'none' || !$(id).css('background-image'));
          mode = $(id).css('background-image') === 'none' || !$(id).css('background-image') ? "insert" : "delete";
        }
        if (mode === "insert") {
          $(id).css('background-image', "url(\"" + plaEditor.blockData[$('#sc_icon_select').val()].filename + "\")");
          return $(id).data('pla-blockname', $('#sc_icon_select').val());
        } else {
          $(id).css('background-image', "none");
          $(id).data('pla-blockname', "none");
          Editor.ability.deleteAbility($(id).attr("id"));
          if ($("#pla_blockid").text() === $(id).attr("id")) {
            return Editor.clearBlockdata();
          }
        }
      } else if (isSKey) {
        $('#pla_blockname').text($(id).data('pla-blockname'));
        $('#pla_blockpos').text(($(id).data('scboxtd-num')) + "," + ($(id).parent().data('scboxtr-num')));
        console.log($(id).data('pla-blockname'));
        if (pla_blockdescription[$(id).data('pla-blockname')]) {
          $('#pla_blocktype').text(pla_blockdescription[$(id).data('pla-blockname')].type || "不明");
          $('#pla_blockdescription').text(pla_blockdescription[$(id).data('pla-blockname')].description || "説明なし");
        }
        $('#pla_blockid').text($(id).attr("id"));
        $('#pla_abilities').html("");
        return Editor.ability.readAbility($('#pla_blockid').text());
      } else if (isGKey) {
        return $('#sc_icon_select').val($(id).data('pla-blockname'));
      }
    };
    $('#sc_ground').on("mousemove", ".sc_box_tr .sc_box_td", function(e) {
      $('#sc_pos').text("x: " + ($(this).data("scboxtd-num")) + " y: " + ($(this).parent().data("scboxtr-num")));
      if (e.buttons !== 1) {
        return;
      }
      if ($('#pla_isn').prop("checked")) {
        return adblc(e, "#" + ($(this).attr("id")));
      }
    }).on("click", ".sc_box_tr .sc_box_td", function(e) {
      if (!$('#pla_isn').prop("checked")) {
        return adblc(e, "#" + ($(this).attr("id")));
      }
    });
    $('#sc_add_row').click(function() {
      var i, k, ref, results;
      if ($('#sc_add_select').val() === "0") {
        return Editor.sc_ground_createline(sc_row_zero -= 2);
      } else {
        Editor.sc_ground_createline(sc_row_len += 2);
        results = [];
        for (i = k = 0, ref = Editor.objcount; k < ref; i = k += 1) {
          results.push($("#obj" + i).css("top", parseInt($("#obj" + i).css("top")) + 50));
        }
        return results;
      }
    });
    $('#pla_skybox').change(function() {
      return $('#sc_ground_window').css("background-image", "url(\"images/skybox/" + ($('#pla_skybox').val()) + ".png\")");
    });
    $('#pla_isgrid').change(function() {
      if ($('#pla_isgrid').prop("checked")) {
        return $('.sc_box_td').css('border', '1px solid gray');
      } else {
        return $('.sc_box_td').css('border', 'none');
      }
    });
    $('#pla_object_add').click(function() {
      return Editor.createplaObject($('#pla_object_name').data("name"), Editor.ObjPoint.data("pla-obj-x"), Editor.ObjPoint.data("pla-obj-y"));
    });
    $('#pla_obj_unselect').click(function() {
      $('.pla_obj_select').removeClass('pla_obj_select');
      return $('#pla_obj_name').text("");
    });
    $('#pla_sound_play').click(function() {
      return $('#pla_sound_elem')[0].play();
    });
    $('#pla_sound_stop').click(function() {
      $('#pla_sound_elem')[0].pause();
      return $('#pla_sound_elem')[0].currentTime = 0;
    });
    $('#pla_sound').change(function() {
      return $('#pla_sound_elem').attr("src", "sounds/" + ($('#pla_sound').val()) + ".wav");
    });
    $('#pla_objects').on("mousedown", ".pla_obj", function(e) {
      pla_activeobj = "#" + e.target.id;
      $('.pla_obj').removeClass('pla_obj_select');
      $(pla_activeobj).addClass('pla_obj_select');
      Editor.clearObjdata();
      $('#pla_obj_name').text(e.target.id);
      return Editor.abilityObj.readAbility(e.target.id);
    }).on("mouseup", ".pla_obj", function() {
      return pla_activeobj = "";
    }).on("mousemove", ".pla_obj", function(e) {
      return Editor.objmove(e);
    });
    $('#pla_mode_select').change(function() {
      var enabledItemId, i, items, k, ref, results;
      enabledItemId = -1;
      items = [$('#pla_footer_blockmode'), $('#pla_footer_objectmode'), $('#pla_footer_file')];
      switch ($(this).val()) {
        case "block":
          enabledItemId = 0;
          break;
        case "object":
          enabledItemId = 1;
          break;
        case "file":
          enabledItemId = 2;
      }
      if (enabledItemId !== -1) {
        results = [];
        for (i = k = 0, ref = items.length; k < ref; i = k += 1) {
          if (i === enabledItemId) {
            results.push(items[i].css("display", "inline-block"));
          } else {
            results.push(items[i].css("display", "none"));
          }
        }
        return results;
      }
    });
    $('#pla_obj_delete').click(Editor.objdelete);
    $('#sc_all_clear').click(function() {
      return $('.sc_box_td').css('background-image', 'none');
    });
    $('#sc_all_fill').click(function() {
      return $('.sc_box_td').css('background-image', "url(\"images/mapicons/" + ($('#sc_icon_select').val()) + ".png\")");
    });
    $('#sc_icon_select').tooltip();
    $('#pla_mode_select').tooltip();
    $('#pla_input_btn').click(function() {
      $('#pla_input_content').css("display", "block");
      $('#pla_output_content').css("display", "none");
      return fadebox.showWindow("pla_outputbox");
    });
    $('#sc_ground').hover(function() {
      return $(this).focus();
    });
    $('#pla_add_ability').click(Editor.ability.add);
    $('#pla_add_ability_obj').click(Editor.abilityObj.add);
    $('#pla_abilities').on("change", "div input", function() {
      return Editor.ability.changeAbility($('#pla_blockid').text(), $(this).parent().data("pla-ability"), $(this).val());
    });
    $('#pla_abilities_obj').on("change", "div input", function() {
      return Editor.abilityObj.changeAbility($('#pla_obj_name').text(), $(this).parent().data("pla-ability"), $(this).val());
    });
    $('#pla_object_select_btn').click(function() {
      return fadebox.showWindow("pla_object_dialog");
    });
    $('#pla_objects_select').change(function() {
      $('#pla_object_preview').attr("src", plaEditor.objData[$(this).val()].filename);
      return $('#pla_object_description').html(pla_blockdescription[$(this).val()] ? pla_blockdescription[$(this).val()].description : "説明はありません");
    });
    $('#pla_object_submit').click(function() {
      fadebox.closeWindow("pla_object_dialog");
      return $('#pla_object_name').text($("#pla_objects_select option:selected").text()).data("name", $("#pla_objects_select").val());
    });
    isVisible = true;
    $('#pla_object_visibility').click(function() {
      isVisible = !isVisible;
      return $('#pla_objects').css("display", isVisible ? "block" : "none");
    });
    zeroclient = new ZeroClipboard(document.getElementById("pla-copy"));
    zeroclient.on("ready", function(readyEvent) {
      console.log("ZERO ready");
      return zeroclient.on("aftercopy", function(event) {
        return console.log("copied");
      });
    });
  });

  $(function() {
    return $("#pla_tools_items tr td *").tooltip().click(clickShortcutBtn);
  });

  clickShortcutBtn = function() {
    if (shortCuts[this.dataset.plamode.replace(/-/g, "")] !== null) {
      return shortCuts[this.dataset.plamode.replace(/-/g, "")]();
    }
  };

  shortCuts = {
    blockauto: function() {
      $('#pla_isn').prop("checked", false);
      return $('#pla_mode').val("auto");
    },
    blockadd: function() {
      $('#pla_isn').prop("checked", false);
      return $('#pla_mode').val("insert");
    },
    blockdelete: function() {
      $('#pla_isn').prop("checked", false);
      return $('#pla_mode').val("delete");
    },
    paintadd: function() {
      $('#pla_isn').prop("checked", true);
      return $('#pla_mode').val("insert");
    },
    paintdelete: function() {
      $('#pla_isn').prop("checked", true);
      return $('#pla_mode').val("delete");
    },
    ioexport: function() {
      return $('#sc_output_btn').click();
    },
    ioimport: function() {
      return $('#pla_input_btn').click();
    },
    addlineup: function() {
      var b;
      b = $('#sc_add_select').val();
      $('#sc_add_select').val("1");
      $('#sc_add_row').click();
      return $('#sc_add_select').val(b);
    },
    addlineleft: function() {
      var b;
      b = $('#sc_add_select').val();
      $('#sc_add_select').val("1");
      $('#sc_add_column').click();
      return $('#sc_add_select').val(b);
    },
    addlineright: function() {
      var b;
      b = $('#sc_add_select').val();
      $('#sc_add_select').val("0");
      $('#sc_add_column').click();
      return $('#sc_add_select').val(b);
    },
    addlinedown: function() {
      var b;
      b = $('#sc_add_select').val();
      $('#sc_add_select').val("0");
      $('#sc_add_row').click();
      return $('#sc_add_select').val(b);
    },
    objshow: function() {
      return $('#pla_object_visibility').click();
    },
    showstart: function() {
      return fadebox.showWindow("pla_startup");
    },
    zoomout: function() {
      return Editor.Zoom.Zoomout();
    },
    zoomin: function() {
      return Editor.Zoom.Zoomin();
    },
    modeselect: function() {
      return fadebox.showWindow("pla_object_dialog");
    }
  };

}).call(this);
