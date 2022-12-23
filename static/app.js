let $ = document.querySelector.bind(document);
let conn;

class Message {
  constructor(author, text) {
    this.author = author;
    this.text = text;
  }

  static from(json) {
    return Object.assign(new Message(), json);
  }
}

window.onload = function () {
  function appendLog(item) {
    var doScroll =
      $("#log").scrollTop > $("#log").scrollHeight - $("#log").clientHeight - 1;
    $("#log").appendChild(item);
    if (doScroll) {
      $("#log").scrollTop = $("#log").scrollHeight - $("#log").clientHeight;
    }
  }

  $("#form").onsubmit = function () {
    if (!conn || !$("#msg").value || !$("#name").value) return false;
    let message = new Message(
      $("#name").value.replace(":", ""),
      $("#msg").value
    );
    conn.send(JSON.stringify(message));
    $("#msg").value = "";
    return false;
  };

  if (window["WebSocket"]) {
    conn = new WebSocket("ws://" + document.location.host + "/ws");
    conn.onclose = function (evt) {
      const item = document.createElement("div");
      item.innerHTML = "<b>Connection closed.</b>";
      appendLog(item);
    };
    conn.onmessage = function (evt) {
      const message = Message.from(JSON.parse(evt.data));
      const container = document.createElement("div");
      const name = document.createElement("span");
      name.innerText = message.author + ": ";
      container.appendChild(name);
      container.innerHTML += message.text;
      appendLog(container);
    };
  } else {
    const item = document.createElement("div");
    item.innerHTML = "<b>Your browser does not support WebSockets.</b>";
    appendLog(item);
  }
};
