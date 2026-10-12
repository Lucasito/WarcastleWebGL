// Service worker уведомлений WarCastle.
//
// Нужен ради одного: показывать уведомления через
// registration.showNotification (Plugins/WebGL/LocalNotifications.jslib).
// Без воркера Chrome на Android уведомлений не показывает вовсе, и только
// так работает значок строки состояния (badge).
//
// Запросы страницы не перехватывает (нет обработчика fetch) и ничего не
// кэширует: сборка игры обновляется как обычно.

self.addEventListener('install', function () {
  self.skipWaiting();
});

self.addEventListener('activate', function (event) {
  event.waitUntil(self.clients.claim());
});

// Нажатие на уведомление — вернуть игрока во вкладку с игрой (или открыть её).
self.addEventListener('notificationclick', function (event) {
  event.notification.close();
  event.waitUntil(
    self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then(function (list) {
      for (var i = 0; i < list.length; i++) {
        if ('focus' in list[i]) {
          return list[i].focus();
        }
      }
      if (self.clients.openWindow) {
        return self.clients.openWindow(self.registration.scope);
      }
    })
  );
});
