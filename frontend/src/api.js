import { io } from 'socket.io-client';

const API_BASE = '/api';

export const socket = io(window.location.origin, {
  transports: ['websocket', 'polling']
});

export const api = {
  // Auth
  async login(username, password) {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Ошибка авторизации');
    }
    return res.json();
  },

  async switchDemo(role) {
    const res = await fetch(`${API_BASE}/auth/switch-demo`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ role })
    });
    return res.json();
  },

  async getUsers() {
    const res = await fetch(`${API_BASE}/auth/users`);
    return res.json();
  },

  // Stats
  async getStats() {
    const res = await fetch(`${API_BASE}/dashboard/stats`);
    return res.json();
  },

  // Pets
  async getPets() {
    const res = await fetch(`${API_BASE}/pets`);
    return res.json();
  },

  async createPet(data) {
    const res = await fetch(`${API_BASE}/pets`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return res.json();
  },

  async updatePet(id, data) {
    const res = await fetch(`${API_BASE}/pets/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return res.json();
  },

  // Rooms
  async getRooms() {
    const res = await fetch(`${API_BASE}/rooms`);
    return res.json();
  },

  async updateRoom(id, data) {
    const res = await fetch(`${API_BASE}/rooms/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return res.json();
  },

  // Bookings
  async getBookings() {
    const res = await fetch(`${API_BASE}/bookings`);
    return res.json();
  },

  async createBooking(data) {
    const res = await fetch(`${API_BASE}/bookings`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return res.json();
  },

  async updateBooking(id, data) {
    const res = await fetch(`${API_BASE}/bookings/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return res.json();
  },

  // Tasks & Reminders
  async getTasks(role) {
    const url = role ? `${API_BASE}/tasks?role=${role}` : `${API_BASE}/tasks`;
    const res = await fetch(url);
    return res.json();
  },

  async createTask(data) {
    const res = await fetch(`${API_BASE}/tasks`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return res.json();
  },

  async completeTask(id, data) {
    const res = await fetch(`${API_BASE}/tasks/${id}/complete`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return res.json();
  },

  async deleteTask(id) {
    const res = await fetch(`${API_BASE}/tasks/${id}`, {
      method: 'DELETE'
    });
    return res.json();
  },

  // Clients
  async getClients() {
    const res = await fetch(`${API_BASE}/clients`);
    return res.json();
  },

  // WhatsApp
  async getConversations() {
    const res = await fetch(`${API_BASE}/whatsapp/conversations`);
    return res.json();
  },

  async getMessages(conversationId) {
    const res = await fetch(`${API_BASE}/whatsapp/conversations/${conversationId}/messages`);
    return res.json();
  },

  async sendMessage(data) {
    const res = await fetch(`${API_BASE}/whatsapp/messages`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return res.json();
  },

  async simulateIncomingWhatsApp(data) {
    const res = await fetch(`${API_BASE}/whatsapp/simulate-incoming`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return res.json();
  },

  async getAutoTemplates() {
    const res = await fetch(`${API_BASE}/whatsapp/templates`);
    return res.json();
  },

  async updateAutoTemplate(id, data) {
    const res = await fetch(`${API_BASE}/whatsapp/templates/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return res.json();
  },

  // Notification Channels & Push
  async getNotificationSettings() {
    const res = await fetch(`${API_BASE}/notifications/settings`);
    return res.json();
  },

  async updateNotificationSettings(data) {
    const res = await fetch(`${API_BASE}/notifications/settings`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return res.json();
  },

  async testSystemNotification(data = {}) {
    const res = await fetch(`${API_BASE}/notifications/test`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return res.json();
  }
};
