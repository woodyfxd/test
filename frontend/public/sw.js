// ZooHotel CRM Service Worker for Background Push Notifications
self.addEventListener('install', (event) => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim());
});

// Listen for message from main app
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SHOW_NOTIFICATION') {
    const { title, options } = event.data;
    self.registration.showNotification(title, {
      ...options,
      icon: 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=192',
      badge: 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=96',
      vibrate: [200, 100, 200],
      requireInteraction: true
    });
  }
});

// Click on notification focuses or opens CRM
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
      for (const client of clientList) {
        if (client.url && 'focus' in client) {
          return client.focus();
        }
      }
      if (clients.openWindow) {
        return clients.openWindow('/');
      }
    })
  );
});
