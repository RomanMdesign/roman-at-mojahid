// ===== script.js =====

const loginScreen = document.getElementById('login-screen');
const chatScreen = document.getElementById('chat-screen');
const loginForm = document.getElementById('login-form');
const usernameInput = document.getElementById('username-input');
const myNameDisplay = document.getElementById('my-name-display');
const logoutBtn = document.getElementById('logout-btn');
const usersList = document.getElementById('users-list');
const groupChatItem = document.getElementById('group-chat-item');
const currentChatName = document.getElementById('current-chat-name');
const messagesContainer = document.getElementById('messages-container');
const messageForm = document.getElementById('message-form');
const messageInput = document.getElementById('message-input');

let myUserId = null;
let myUsername = null;
let currentTarget = 'group'; // 'group' o user id
let currentTargetName = 'Group Chat';
let pollInterval = null;

// ---------- LOGIN ----------
loginForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const name = usernameInput.value.trim();
  if (!name) return;

  const res = await fetch('/api/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username: name })
  });
  const data = await res.json();

  myUserId = data.id;
  myUsername = data.username;
  localStorage.setItem('messenger_user_id', myUserId);
  localStorage.setItem('messenger_username', myUsername);

  startChat();
});

// I-check kung may naka-save nang session
window.addEventListener('load', () => {
  const savedId = localStorage.getItem('messenger_user_id');
  const savedName = localStorage.getItem('messenger_username');
  if (savedId && savedName) {
    myUserId = savedId;
    myUsername = savedName;
    startChat();
  }
});

function startChat() {
  loginScreen.classList.add('hidden');
  chatScreen.classList.remove('hidden');
  myNameDisplay.textContent = myUsername;
  loadUsers();
  loadMessages();
  if (pollInterval) clearInterval(pollInterval);
  pollInterval = setInterval(loadMessages, 3000);
}

// ---------- LOGOUT ----------
logoutBtn.addEventListener('click', () => {
  localStorage.removeItem('messenger_user_id');
  localStorage.removeItem('messenger_username');
  clearInterval(pollInterval);
  chatScreen.classList.add('hidden');
  loginScreen.classList.remove('hidden');
  usernameInput.value = '';
});

// ---------- LOAD USERS (para sa sidebar) ----------
async function loadUsers() {
  const res = await fetch(`/api/users?exclude=${myUserId}`);
  const users = await res.json();

  usersList.innerHTML = '';
  users.forEach(user => {
    const div = document.createElement('div');
    div.className = 'chat-item';
    div.dataset.target = user.id;
    div.dataset.name = user.username;
    div.innerHTML = `<span class="chat-icon">👤</span><span class="chat-label">${user.username}</span>`;
    div.addEventListener('click', () => switchChat(user.id, user.username, div));
    usersList.appendChild(div);
  });
}

// ---------- SWITCH CHAT (group o private) ----------
function switchChat(target, name, clickedEl) {
  currentTarget = target;
  currentTargetName = name;
  currentChatName.textContent = name;

  document.querySelectorAll('.chat-item').forEach(el => el.classList.remove('active'));
  clickedEl.classList.add('active');

  loadMessages();
}

groupChatItem.addEventListener('click', () => switchChat('group', 'Group Chat', groupChatItem));

// ---------- LOAD MESSAGES ----------
async function loadMessages() {
  if (!myUserId) return;
  const res = await fetch(`/api/messages?user_id=${myUserId}&target=${currentTarget}`);
  const messages = await res.json();

  messagesContainer.innerHTML = '';

  if (messages.length === 0) {
    messagesContainer.innerHTML = '<div class="empty-state">Wala pang mensahe. Magsimula ng usapan!</div>';
    return;
  }

  messages.forEach(msg => {
    const bubble = document.createElement('div');
    const isMine = String(msg.sender_id) === String(myUserId);
    bubble.className = `message-bubble ${isMine ? 'mine' : 'theirs'}`;

    let senderLabel = '';
    if (!isMine && currentTarget === 'group') {
      senderLabel = `<span class="sender-name">${msg.sender_name}</span>`;
    }

    bubble.innerHTML = `
      ${senderLabel}
      <span class="text">${escapeHtml(msg.text)}</span>
      <span class="timestamp">${msg.time}</span>
    `;
    messagesContainer.appendChild(bubble);
  });

  messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

// ---------- SEND MESSAGE ----------
messageForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const text = messageInput.value.trim();
  if (!text) return;

  await fetch('/api/messages', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      sender_id: myUserId,
      target: currentTarget,
      text: text
    })
  });

  messageInput.value = '';
  loadMessages();
});
