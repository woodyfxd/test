// Audio Chime using Web Audio API (pleasant two-tone bell chime)
export function playNotificationSound() {
  try {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return;
    const ctx = new AudioContext();

    // First note
    const osc1 = ctx.createOscillator();
    const gain1 = ctx.createGain();
    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(587.33, ctx.currentTime); // D5
    gain1.gain.setValueAtTime(0.15, ctx.currentTime);
    gain1.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.4);
    osc1.connect(gain1);
    gain1.connect(ctx.destination);
    osc1.start();
    osc1.stop(ctx.currentTime + 0.4);

    // Second note (higher pitch harmonious bell)
    const osc2 = ctx.createOscillator();
    const gain2 = ctx.createGain();
    osc2.type = 'sine';
    osc2.frequency.setValueAtTime(880, ctx.currentTime + 0.15); // A5
    gain2.gain.setValueAtTime(0.2, ctx.currentTime + 0.15);
    gain2.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.6);
    osc2.connect(gain2);
    gain2.connect(ctx.destination);
    osc2.start(ctx.currentTime + 0.15);
    osc2.stop(ctx.currentTime + 0.6);
  } catch (e) {
    console.warn('Audio playback not allowed or not supported:', e);
  }
}

// Request permission for OS Desktop & Mobile Browser Notifications
export async function requestNotificationPermission() {
  if (!('Notification' in window)) {
    return 'unsupported';
  }

  if (Notification.permission === 'granted') {
    return 'granted';
  }

  try {
    const permission = await Notification.requestPermission();
    return permission;
  } catch (e) {
    console.error('Failed to request notification permission:', e);
    return 'denied';
  }
}

// Show native OS / Mobile push notification
export function sendSystemNotification(title, options = {}) {
  // Always play sound & vibrate on phone
  playNotificationSound();

  if ('vibrate' in navigator) {
    try {
      navigator.vibrate([200, 100, 200]);
    } catch (e) {}
  }

  if (!('Notification' in window)) {
    console.warn('Notification API not supported by this browser.');
    return;
  }

  if (Notification.permission === 'granted') {
    try {
      // Check if service worker is active (for mobile push)
      if (navigator.serviceWorker && navigator.serviceWorker.controller) {
        navigator.serviceWorker.controller.postMessage({
          type: 'SHOW_NOTIFICATION',
          title,
          options: {
            body: options.body || '',
            icon: options.icon || 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=128',
            badge: options.badge || 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=64',
            vibrate: [200, 100, 200],
            tag: options.tag || 'zoohotel-alert',
            data: options.data || {}
          }
        });
      } else {
        // Standard Desktop OS notification
        const notification = new Notification(title, {
          body: options.body || '',
          icon: options.icon || 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=128',
          tag: options.tag || 'zoohotel-alert',
          silent: false
        });

        notification.onclick = function () {
          window.focus();
          if (options.onClick) options.onClick();
          notification.close();
        };
      }
    } catch (e) {
      console.warn('Native notification failed:', e);
    }
  }
}
