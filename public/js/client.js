/* This client.js file was created followig the tutorial by Traversy Media (https://www.youtube.com/watch?v=jD7FnbI76Hg). Minor changes have been made.*/
const messageInput = document.getElementById('msg');
const chatForm = document.getElementById('chat-form');
const chatMessages = document.querySelector('.chat-messages');
const roomName = document.getElementById('room-name');
const userList = document.getElementById('users');
// Get username and room from URL
const {
  username,
  room
} = Qs.parse(location.search, {
  ignoreQueryPrefix: true
});
const socket = io();
// Join chatroom
socket.emit('joinRoom', {
  username,
  room
});
// Get room and users
socket.on('roomUsers', ({
  room,
  users
}) => {
  outputRoomName(room);
  outputUsers(users);
});
// Message from server
socket.on('message', message => {
  console.log(message);
  outputMessage(message);
  // Scroll down
  chatMessages.scrollTop = chatMessages.scrollHeight;
});
// Message submit
chatForm.addEventListener('submit', (e) => {
  e.preventDefault();
  // Get message text
  const msg = e.target.elements.msg.value;
  // Emit message to server
  socket.emit('chatMessage', msg);
  // Clear input
  e.target.elements.msg.value = '';
  e.target.elements.msg.focus();
});
// Output message to DOM
function outputMessage(message) {
  const div = document.createElement('div');
  div.classList.add('message');
  div.innerHTML = `<p class="meta">${message.username} <span>${message.time}</span></p>
    <p class="text">
        ${message.text}
    </p>`;
  document.querySelector('.chat-messages').appendChild(div);
}
// When the user starts typing
messageInput.addEventListener('keypress', () => {
  socket.emit('typing', {
    username, room
  });
});
// Listen for typing event from server
socket.on('typing', (data) => {
  const typingIndicator = document.getElementById('typingIndicator');
  typingIndicator.innerHTML = `${data.username} is typing...`;
  typingIndicator.style.display = 'block';
})
// When the user stops typing
chatForm.addEventListener('submit', () => {
  socket.emit('stopTyping', {
    room
  });
});
// Listen for 'stopTyping' event from server
socket.on('stopTyping', () => {
  const typingIndicator = document.getElementById('typingIndicator');
  typingIndicator.style.display = 'none'
});
// Add room name to DOM
function outputRoomName(room) {
  roomName.innerText = room;
}
// Add users to DOM
function outputUsers(users) {
  userList.innerHTML = `
    ${users.map(user => `<li>${user.username}</li>`).join('')}
  `;
}