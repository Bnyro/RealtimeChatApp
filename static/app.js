let $ = document.querySelector.bind(document);
let conn;

window.onload = function () {
  function appendLog(item) {
    var doScroll =
      $("#log").scrollTop >
      $("#log").scrollHeight - $("#log").clientHeight - 1;
    $("#log").appendChild(item);
    if (doScroll) {
      $("#log").scrollTop = $("#log").scrollHeight - $("#log").clientHeight;
    }
  }

  $("#form").onsubmit = function () {
    if (!conn || !$("#msg").value || !$("#name").value) return false;
    conn.send(`${$("#name").value.replace(":", "")}: ${$("#msg").value}`);
    $("#msg").value = "";
    return false;
  };

  if (window["WebSocket"]) {
    conn = new WebSocket("ws://" + document.location.host + "/ws");
    conn.onclose = function (evt) {
      var item = document.createElement("div");
      item.innerHTML = "<b>Connection closed.</b>";
      appendLog(item);
    };
    conn.onmessage = function (evt) {
      var messages = evt.data.split("\n");
      for (var i = 0; i < messages.length; i++) {
        var container = document.createElement("div");
        var name = document.createElement("span");
        name.innerText = messages[i].split(": ")[0] + ": ";
        container.appendChild(name);
        container.innerHTML += messages[i].split(": ")[1];
        appendLog(container);
      }
    };
  } else {
    var item = document.createElement("div");
    item.innerHTML = "<b>Your browser does not support WebSockets.</b>";
    appendLog(item);
  }
};