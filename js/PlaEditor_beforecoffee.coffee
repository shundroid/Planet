window.plaEditor = {}
do ->
  plaEditor.getPackbyAjax = ->
    return new Promise (resolve) ->
      xhr = new XMLHttpRequest()
      xhr.overrideMimeType('application/json');
      xhr.open "GET", "plapacks.json", true
      xhr.onreadystatechange = ->
        if xhr.readyState is 4 and xhr.status is 200
          resolve JSON.parse(xhr.responseText).packs
        return
      xhr.send null
      return
  plaEditor.get