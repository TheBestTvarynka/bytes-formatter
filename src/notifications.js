
const showNotification = ({ text, type, timeout }) => {
  const id = Date.now().toString();
  const notification = document.createElement('div');

  const notificationText = document.createElement('span');
  notificationText.innerHTML = text;

  notification.appendChild(notificationText);
  notification.classList.add(type);
  notification.classList.add('notification');
  notification.id = id;

  document.getElementById('notifications').appendChild(notification);

  notification.addEventListener('click', () =>
    document.getElementById('notifications').removeChild(notification)
  );

  setTimeout(() => {
    document.getElementById('notifications').removeChild(notification);
  }, timeout || 3000);
};
