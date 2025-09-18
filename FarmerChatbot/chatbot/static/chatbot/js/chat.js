async function sendMessage() {
  const msgInput = document.getElementById("message");
  const chatBox = document.getElementById("chat-box");
  const lang = document.getElementById("lang").value;
  const msg = msgInput.value.trim();
  if (!msg) return;

  // add user msg
  let userDiv = document.createElement("div");
  userDiv.className = "message user";
  userDiv.textContent = msg;
  chatBox.appendChild(userDiv);
  chatBox.scrollTop = chatBox.scrollHeight;
  msgInput.value = "";

  // send to backend
  let res = await fetch("/api/chat/", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ user_id: "demo", message: msg, language: lang })
  });
  let data = await res.json();

  // add bot reply
  let botDiv = document.createElement("div");
  botDiv.className = "message bot";
  botDiv.textContent = data.reply;
  chatBox.appendChild(botDiv);
  chatBox.scrollTop = chatBox.scrollHeight;
}
