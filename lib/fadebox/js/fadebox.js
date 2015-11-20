var fadebox = {};
(function() {
  $(function() {
    $(".fb-titlebar").mousedown(mousedownWindowbar);
    $(".fb-titlebar").mouseup(mouseupWindowbar);
    $(".fb-window").mousedown(mousedownWindow);
    $(".fb-closebtn").click(closebtnClick);
    $(document).mousemove(moveWindowbar);
    initControl();
  });

  function initControl() {
    var ary = $(".fb-window");
    for (var i = 0; i < ary.length; i++) {
      var ele = $(ary[i]);
      if (ele.data("width")) {
        ele.css("width", ele.data("width"));
      }
      if (ele.data("height")) {
        ele.css("height", ele.data("height"));
      }
      if (ele.data("x")) {
        ele.css("left", ele.data("x"));
      }
      if (ele.data("y")) {
        ele.css("top", ele.data("y"));
      }
      // if (ele.data("zindex")) {
      //   ele.css("z-index", ele.data("zindex"));
      // }
      if (ele.data("show")) {
        if (ele.data("show") === "show") {
          ele.css("display", "block");
        }
      } else {
        ele.css("display", "block");
      }

      // fb-content
      var content = ele.children(".fb-content");
      if (content) {
        content.css("height", (ele.height() - 40) + "px");
      }
    }
  }
  function closebtnClick() {
    this.parentNode.parentNode.style.display = "none";
  }
  var sX, sY;
  var isMousedown = false;
  var elem;
  function mousedownWindowbar(e) {
    sX = e.pageX - this.parentNode.offsetLeft;
    sY = e.pageY - this.parentNode.offsetTop;
    elem = this;
    isMousedown = true;

    activeWindow(e.target.parentNode);
  }
  function mouseupWindowbar(e) {
    isMousedown = false;
  }

  function mousedownWindow(e) {
    activeWindow(e.target.parentNode);
  }
  function activeWindow(e) {
    passibleWindow();
    $(e).addClass("fb-active-window");
  }

  function passibleWindow() {
    $(".fb-active-window").removeClass("fb-active-window");
  }

  function moveWindowbar(e) {
    if (isMousedown) {
      $(elem.parentNode)
        .css("left", (e.pageX - sX) + "px")
        .css("top", (e.pageY - sY) + "px");
    }
  }
  fadebox.showWindow = function(id) {
    var win = $("#" + id);
    if (win !== null && win.attr("class").split(" ")[0] === "fb-window" && win.css("display") === "none") {
      win.css("display", "block");
    }
    activeWindow("#" + id);
  };
  fadebox.closeWindow = function(id) {
    var win = $("#" + id);
    if (win !== null && win.attr("class").split(" ")[0] === "fb-window" && win.css("display") === "block") {
      win.css("display", "none");
    }
}})();
