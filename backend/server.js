const express = require('express');
const http = require('http');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const { Server } = require('socket.io');
const db = require('./database');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE']
  }
});

app.use(cors());
app.use(express.json({ limit: '10mb' }));

// Helper to trigger automated WhatsApp message
function triggerAutomatedMessage(triggerType, data) {
  try {
    const templates = db.get('autoMessageTemplates');
    const template = templates.find(t => t.trigger === triggerType && t.enabled);
    if (!template) return null;

    let text = template.textTemplate;
    // Replace placeholders
    Object.keys(data).forEach(key => {
      text = text.replace(new RegExp(`{{${key}}}`, 'g'), data[key] || '');
    });

    // Find or create conversation for client
    const conversations = db.get('whatsappConversations');
    let conv = conversations.find(c => c.clientId === data.clientId || c.phone === data.phone);

    const newMsg = {
      id: 'm-' + Date.now() + '-' + Math.floor(Math.random() * 1000),
      sender: 'system',
      senderName: 'Авто-система ZooHotel',
      text: text,
      timestamp: new Date().toISOString(),
      type: triggerType,
      status: 'delivered'
    };

    if (conv) {
      conv.messages.push(newMsg);
      conv.lastMessage = text;
      conv.lastTimestamp = newMsg.timestamp;
      db.save();
    } else {
      conv = {
        id: 'wa-conv-' + Date.now(),
        clientId: data.clientId || null,
        clientName: data.clientName || 'Клиент',
        phone: data.phone || '+7 (900) 000-00-00',
        unreadCount: 0,
        petName: data.petName || '',
        lastMessage: text,
        lastTimestamp: newMsg.timestamp,
        messages: [newMsg]
      };
      db.insert('whatsappConversations', conv);
    }

    io.emit('whatsapp:new_message', { conversationId: conv.id, message: newMsg });
    return newMsg;
  } catch (err) {
    console.error('Failed to trigger auto message:', err);
    return null;
  }
}

// ----------------- AUTH ROUTES -----------------
app.post('/api/auth/login', (req, res) => {
  const { username, password } = req.body;
  const users = db.get('users');
  const user = users.find(u => u.username === username);

  if (!user || user.password !== password) {
    return res.status(401).json({ error: 'Неверное имя пользователя или пароль' });
  }

  const { password: _, ...userWithoutPass } = user;
  res.json({ user: userWithoutPass, token: 'demo-token-' + user.id });
});

// Demo switch role
app.post('/api/auth/switch-demo', (req, res) => {
  const { role } = req.body;
  const users = db.get('users');
  const user = users.find(u => u.role === role) || users[0];
  const { password: _, ...userWithoutPass } = user;
  res.json({ user: userWithoutPass, token: 'demo-token-' + user.id });
});

app.get('/api/auth/users', (req, res) => {
  const users = db.get('users').map(({ password, ...u }) => u);
  res.json(users);
});

// ----------------- PETS ROUTES -----------------
app.get('/api/pets', (req, res) => {
  const pets = db.get('pets');
  const clients = db.get('clients');
  const enriched = pets.map(pet => {
    const client = clients.find(c => c.id === pet.clientId);
    return { ...pet, clientName: client ? client.name : 'Не указан', clientPhone: client ? client.phone : '' };
  });
  res.json(enriched);
});

app.get('/api/pets/:id', (req, res) => {
  const pet = db.get('pets').find(p => p.id === req.params.id);
  if (!pet) return res.status(404).json({ error: 'Питомец не найден' });
  const client = db.get('clients').find(c => c.id === pet.clientId);
  res.json({ ...pet, clientName: client ? client.name : '', clientPhone: client ? client.phone : '' });
});

app.post('/api/pets', (req, res) => {
  const newPet = {
    id: 'p-' + Date.now(),
    ...req.body,
    speciesLabel: req.body.species === 'cat' ? 'Кошка' : (req.body.species === 'dog' ? 'Собака' : 'Другое')
  };
  db.insert('pets', newPet);
  res.status(201).json(newPet);
});

app.put('/api/pets/:id', (req, res) => {
  const updated = db.update('pets', req.params.id, req.body);
  if (!updated) return res.status(404).json({ error: 'Питомец не найден' });
  res.json(updated);
});

app.delete('/api/pets/:id', (req, res) => {
  db.delete('pets', req.params.id);
  res.json({ success: true });
});

// ----------------- CLIENTS ROUTES -----------------
app.get('/api/clients', (req, res) => {
  const clients = db.get('clients');
  const pets = db.get('pets');
  const enriched = clients.map(c => ({
    ...c,
    pets: pets.filter(p => p.clientId === c.id)
  }));
  res.json(enriched);
});

app.post('/api/clients', (req, res) => {
  const newClient = {
    id: 'c-' + Date.now(),
    ...req.body
  };
  db.insert('clients', newClient);
  res.status(201).json(newClient);
});

// ----------------- ROOMS ROUTES -----------------
app.get('/api/rooms', (req, res) => {
  const rooms = db.get('rooms');
  const bookings = db.get('bookings');
  const pets = db.get('pets');

  const enriched = rooms.map(room => {
    let currentPet = null;
    let currentBooking = null;
    if (room.currentBookingId) {
      currentBooking = bookings.find(b => b.id === room.currentBookingId);
      if (currentBooking) {
        currentPet = pets.find(p => p.id === currentBooking.petId);
      }
    }
    return {
      ...room,
      currentPet,
      currentBooking
    };
  });
  res.json(enriched);
});

app.put('/api/rooms/:id', (req, res) => {
  const updated = db.update('rooms', req.params.id, req.body);
  if (!updated) return res.status(404).json({ error: 'Номер не найден' });
  io.emit('room:updated', updated);
  res.json(updated);
});

// ----------------- BOOKINGS ROUTES -----------------
app.get('/api/bookings', (req, res) => {
  const bookings = db.get('bookings');
  const pets = db.get('pets');
  const clients = db.get('clients');
  const rooms = db.get('rooms');

  const enriched = bookings.map(b => {
    const pet = pets.find(p => p.id === b.petId);
    const client = clients.find(c => c.id === b.clientId);
    const room = rooms.find(r => r.id === b.roomId);
    return {
      ...b,
      pet,
      client,
      room
    };
  });
  res.json(enriched);
});

app.post('/api/bookings', (req, res) => {
  const { petId, clientId, roomId, startDate, endDate, additionalServices = [], notes = '' } = req.body;
  const room = db.get('rooms').find(r => r.id === roomId);
  const pet = db.get('pets').find(p => p.id === petId);
  const client = db.get('clients').find(c => c.id === clientId);

  // Calculate days
  const start = new Date(startDate);
  const end = new Date(endDate);
  const diffTime = Math.abs(end - start);
  const days = Math.max(1, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));

  const dailyRate = room ? room.pricePerDay : 1500;
  const servicesTotal = additionalServices.reduce((sum, s) => sum + (Number(s.price) || 0), 0);
  const totalAmount = (dailyRate * days) + servicesTotal;

  const newBooking = {
    id: 'b-' + Date.now(),
    petId,
    clientId,
    roomId,
    startDate,
    endDate,
    days,
    dailyRate,
    additionalServices,
    totalAmount,
    paidAmount: 0,
    status: 'confirmed',
    checkInTime: null,
    notes
  };

  db.insert('bookings', newBooking);

  // Send automatic confirmation WhatsApp message
  triggerAutomatedMessage('booking_created', {
    clientId: client ? client.id : null,
    clientName: client ? client.name : 'Клиент',
    phone: client ? client.phone : '',
    bookingId: newBooking.id,
    petName: pet ? pet.name : 'Питомец',
    roomName: room ? room.name : '',
    startDate,
    endDate,
    totalAmount
  });

  io.emit('booking:created', newBooking);
  res.status(201).json(newBooking);
});

// Update booking status (Check-in, Check-out, etc.)
app.put('/api/bookings/:id', (req, res) => {
  const { status, paidAmount, notes } = req.body;
  const booking = db.get('bookings').find(b => b.id === req.params.id);
  if (!booking) return res.status(404).json({ error: 'Бронирование не найдено' });

  const prevStatus = booking.status;
  const pet = db.get('pets').find(p => p.id === booking.petId);
  const client = db.get('clients').find(c => c.id === booking.clientId);
  const room = db.get('rooms').find(r => r.id === booking.roomId);

  const updates = {};
  if (status) updates.status = status;
  if (paidAmount !== undefined) updates.paidAmount = paidAmount;
  if (notes !== undefined) updates.notes = notes;

  if (status === 'checked_in' && prevStatus !== 'checked_in') {
    updates.checkInTime = new Date().toISOString();
    // Update room status
    db.update('rooms', booking.roomId, { status: 'occupied', currentBookingId: booking.id });

    // Auto create check-in tasks for staff
    // 1. Vet initial check
    db.insert('tasks', {
      id: 't-' + Date.now() + '-vet',
      title: `Вводный осмотр при заселении: ${pet ? pet.name : 'Питомец'}`,
      description: `Первичный осмотр: термометрия, проверка ветпаспорта, кожного покрова, составление листа наблюдения.`,
      targetRole: 'vet',
      assignedTo: 'u-6',
      petId: booking.petId,
      petName: pet ? `${pet.name} (${pet.breed})` : 'Питомец',
      roomId: booking.roomId,
      roomName: room ? room.name : 'Номер',
      scheduledTime: new Date().toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' }),
      isOverdue: false,
      status: 'pending',
      completedAt: null,
      completedByName: null,
      completionNote: null
    });

    // 2. Feeding task for sitter
    db.insert('tasks', {
      id: 't-' + Date.now() + '-sitter',
      title: `График кормления: ${pet ? pet.name : 'Питомец'}`,
      description: `Рацион: ${pet ? pet.diet : 'Кормление по стандарту'}. Проверить свежую воду.`,
      targetRole: 'sitter',
      assignedTo: 'u-3',
      petId: booking.petId,
      petName: pet ? `${pet.name} (${pet.breed})` : 'Питомец',
      roomId: booking.roomId,
      roomName: room ? room.name : 'Номер',
      scheduledTime: '18:00',
      isOverdue: false,
      status: 'pending',
      completedAt: null,
      completedByName: null,
      completionNote: null
    });

    // Auto send WhatsApp message
    triggerAutomatedMessage('checkin_welcome', {
      clientId: client ? client.id : null,
      clientName: client ? client.name : 'Клиент',
      phone: client ? client.phone : '',
      petName: pet ? pet.name : 'Питомец',
      roomName: room ? room.name : 'Номер'
    });
  } else if (status === 'checked_out' && prevStatus !== 'checked_out') {
    // Room needs cleaning
    db.update('rooms', booking.roomId, { status: 'cleaning', currentBookingId: null });

    // Task for cleaning
    db.insert('tasks', {
      id: 't-' + Date.now() + '-clean',
      title: `Санитарная обработка и дезинфекция номера ${room ? room.name : ''}`,
      description: `Кварцевание, влажная дезинфекция поверхностей, замена текстиля после выезда ${pet ? pet.name : 'питомца'}.`,
      targetRole: 'sitter',
      assignedTo: 'u-3',
      petId: booking.petId,
      petName: pet ? pet.name : '',
      roomId: booking.roomId,
      roomName: room ? room.name : '',
      scheduledTime: new Date().toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' }),
      isOverdue: false,
      status: 'pending',
      completedAt: null,
      completedByName: null,
      completionNote: null
    });
  }

  const updated = db.update('bookings', req.params.id, updates);
  io.emit('booking:updated', updated);
  io.emit('task:list_updated');
  res.json(updated);
});

// ----------------- TASKS & REMINDERS ROUTES -----------------
app.get('/api/tasks', (req, res) => {
  const { role } = req.query;
  let tasks = db.get('tasks');
  if (role && role !== 'manager' && role !== 'admin') {
    tasks = tasks.filter(t => t.targetRole === role || t.targetRole === 'all');
  }
  res.json(tasks);
});

app.post('/api/tasks', (req, res) => {
  const newTask = {
    id: 't-' + Date.now(),
    isOverdue: false,
    status: 'pending',
    completedAt: null,
    completedByName: null,
    completionNote: null,
    ...req.body
  };
  db.insert('tasks', newTask);
  io.emit('task:created', newTask);
  broadcastStaffNotification({
    title: `⏰ Напоминание: ${newTask.title}`,
    body: `Время: ${newTask.scheduledTime} • ${newTask.petName} (${newTask.description || ''})`,
    role: newTask.targetRole
  });
  res.status(201).json(newTask);
});

app.put('/api/tasks/:id/complete', (req, res) => {
  const { completedByName, completionNote, sendWhatsAppReport } = req.body;
  const task = db.get('tasks').find(t => t.id === req.params.id);
  if (!task) return res.status(404).json({ error: 'Задача не найдена' });

  const updated = db.update('tasks', req.params.id, {
    status: 'completed',
    completedAt: new Date().toISOString(),
    completedByName: completedByName || 'Сотрудник',
    completionNote: completionNote || 'Выполнено'
  });

  // If staff chose to notify owner via WhatsApp
  if (sendWhatsAppReport && task.petId) {
    const pet = db.get('pets').find(p => p.id === task.petId);
    if (pet && pet.clientId) {
      const client = db.get('clients').find(c => c.id === pet.clientId);
      if (client) {
        const reportText = `Отчет от персонала (${completedByName || 'Зооняня'}): Выполнено: "${task.title}". Комментарий: ${completionNote || 'Все в порядке, питомец чувствует себя замечательно!'}`;
        
        const conversations = db.get('whatsappConversations');
        let conv = conversations.find(c => c.clientId === client.id);
        const newMsg = {
          id: 'm-' + Date.now(),
          sender: 'staff',
          senderName: completedByName || 'Сотрудник ZooHotel',
          text: reportText,
          timestamp: new Date().toISOString(),
          type: 'task_report',
          status: 'sent'
        };
        if (conv) {
          conv.messages.push(newMsg);
          conv.lastMessage = reportText;
          conv.lastTimestamp = newMsg.timestamp;
          db.save();
          io.emit('whatsapp:new_message', { conversationId: conv.id, message: newMsg });
        }
      }
    }
  }

  io.emit('task:completed', updated);
  res.json(updated);
});

app.delete('/api/tasks/:id', (req, res) => {
  db.delete('tasks', req.params.id);
  io.emit('task:deleted', req.params.id);
  res.json({ success: true });
});

// ----------------- WHATSAPP ROUTES -----------------
app.get('/api/whatsapp/conversations', (req, res) => {
  const convs = db.get('whatsappConversations');
  res.json(convs);
});

app.get('/api/whatsapp/conversations/:id/messages', (req, res) => {
  const conv = db.get('whatsappConversations').find(c => c.id === req.params.id);
  if (!conv) return res.status(404).json({ error: 'Диалог не найден' });
  // Mark as read
  conv.unreadCount = 0;
  db.save();
  res.json(conv.messages);
});

// Outbound message to client
app.post('/api/whatsapp/messages', (req, res) => {
  const { conversationId, text, photoUrl, senderName = 'Администратор' } = req.body;
  const conversations = db.get('whatsappConversations');
  const conv = conversations.find(c => c.id === conversationId);
  if (!conv) return res.status(404).json({ error: 'Диалог не найден' });

  const newMsg = {
    id: 'm-' + Date.now(),
    sender: 'staff',
    senderName,
    text,
    photoUrl: photoUrl || null,
    timestamp: new Date().toISOString(),
    type: photoUrl ? 'photo_report' : 'text',
    status: 'sent'
  };

  conv.messages.push(newMsg);
  conv.lastMessage = text || 'Фотоотчет';
  conv.lastTimestamp = newMsg.timestamp;
  db.save();

  io.emit('whatsapp:new_message', { conversationId, message: newMsg });
  res.status(201).json(newMsg);
});

// Simulate incoming WhatsApp message from client
app.post('/api/whatsapp/simulate-incoming', (req, res) => {
  const { conversationId, text, clientName, phone, petName } = req.body;
  const conversations = db.get('whatsappConversations');
  let conv = conversations.find(c => c.id === conversationId);

  const incomingText = text || 'Добрый день! Подскажите, как сейчас настроение у нашего питомца?';
  const newMsg = {
    id: 'm-' + Date.now(),
    sender: 'client',
    senderName: clientName || (conv ? conv.clientName : 'Клиент'),
    text: incomingText,
    timestamp: new Date().toISOString(),
    type: 'text',
    status: 'delivered'
  };

  if (!conv) {
    conv = {
      id: 'wa-conv-' + Date.now(),
      clientId: null,
      clientName: clientName || 'Новый клиент',
      phone: phone || '+7 (999) 000-11-22',
      unreadCount: 1,
      petName: petName || 'Питомец',
      lastMessage: incomingText,
      lastTimestamp: newMsg.timestamp,
      messages: [newMsg]
    };
    db.insert('whatsappConversations', conv);
  } else {
    conv.messages.push(newMsg);
    conv.unreadCount = (conv.unreadCount || 0) + 1;
    conv.lastMessage = incomingText;
    conv.lastTimestamp = newMsg.timestamp;
    db.save();
  }

  io.emit('whatsapp:new_message', { conversationId: conv.id, message: newMsg, incoming: true });
  broadcastStaffNotification({
    title: `💬 WhatsApp от ${newMsg.senderName}`,
    body: incomingText
  });
  res.json({ success: true, conversation: conv, message: newMsg });
});

// External webhook endpoint for real WhatsApp Providers (Green-API, WPPConnect, Cloud API)
app.post('/api/whatsapp/webhook', (req, res) => {
  console.log('Incoming WhatsApp webhook payload:', req.body);
  const payload = req.body;
  // Handle provider formats
  const senderPhone = payload.senderData?.chatId || payload.phone || payload.from || '+7 (999) 000-00-00';
  const text = payload.messageData?.textMessageData?.textMessage || payload.text || payload.body || 'Новое сообщение';

  const conversations = db.get('whatsappConversations');
  let conv = conversations.find(c => c.phone.replace(/\D/g, '') === senderPhone.replace(/\D/g, ''));

  const newMsg = {
    id: 'm-' + Date.now(),
    sender: 'client',
    senderName: conv ? conv.clientName : senderPhone,
    text,
    timestamp: new Date().toISOString(),
    type: 'text',
    status: 'delivered'
  };

  if (conv) {
    conv.messages.push(newMsg);
    conv.unreadCount = (conv.unreadCount || 0) + 1;
    conv.lastMessage = text;
    conv.lastTimestamp = newMsg.timestamp;
    db.save();
  }

  io.emit('whatsapp:new_message', { conversationId: conv ? conv.id : null, message: newMsg, incoming: true });
  broadcastStaffNotification({
    title: `💬 Входящий WhatsApp от ${newMsg.senderName}`,
    body: text
  });
  res.json({ status: 'ok' });
});

// Automated message templates
app.get('/api/whatsapp/templates', (req, res) => {
  res.json(db.get('autoMessageTemplates'));
});

app.put('/api/whatsapp/templates/:id', (req, res) => {
  const updated = db.update('autoMessageTemplates', req.params.id, req.body);
  res.json(updated);
});

// ----------------- DASHBOARD / STATS -----------------
app.get('/api/dashboard/stats', (req, res) => {
  const pets = db.get('pets');
  const rooms = db.get('rooms');
  const bookings = db.get('bookings');
  const tasks = db.get('tasks');
  const convs = db.get('whatsappConversations');

  const occupiedRooms = rooms.filter(r => r.status === 'occupied').length;
  const occupancyRate = Math.round((occupiedRooms / rooms.length) * 100);
  const pendingTasks = tasks.filter(t => t.status === 'pending').length;
  const unreadMessages = convs.reduce((sum, c) => sum + (c.unreadCount || 0), 0);
  const totalRevenue = bookings.reduce((sum, b) => sum + (b.paidAmount || 0), 0);

  res.json({
    totalPets: pets.length,
    activeCheckIns: occupiedRooms,
    totalRooms: rooms.length,
    occupancyRate,
    pendingTasks,
    unreadMessages,
    totalRevenue
  });
});

// ----------------- MULTI-CHANNEL NOTIFICATIONS (Desktop, Phone, Telegram) -----------------
function broadcastStaffNotification({ title, body, role = 'all', petName = '' }) {
  const settings = db.data.notificationSettings || {};
  
  // 1. Desktop & Mobile Push event via WebSockets
  io.emit('staff:system_notification', {
    title,
    body,
    role,
    petName,
    timestamp: new Date().toISOString()
  });

  // 2. Telegram Bot notification log / mock dispatch
  if (settings.telegramBotEnabled) {
    console.log(`[Telegram Bot Alert to Staff (${settings.telegramStaffGroup || 'Смена'})]: ${title} — ${body}`);
  }

  // 3. WhatsApp Staff Alerts log / mock dispatch
  if (settings.whatsappStaffAlertsEnabled) {
    console.log(`[WhatsApp Staff Alert (${settings.whatsappStaffNumber || 'Смена'})]: ${title} — ${body}`);
  }
}

app.get('/api/notifications/settings', (req, res) => {
  res.json(db.data.notificationSettings || {});
});

app.put('/api/notifications/settings', (req, res) => {
  db.data.notificationSettings = { ...(db.data.notificationSettings || {}), ...req.body };
  db.save();
  res.json(db.data.notificationSettings);
});

app.post('/api/notifications/test', (req, res) => {
  const { title = '🚨 Тестовое оповещение ZooHotel', body = 'Напоминание успешно доставлено на компьютер и телефон!' } = req.body;
  broadcastStaffNotification({ title, body });
  res.json({ success: true, message: 'Тестовое уведомление отправлено' });
});

// Serve frontend dist for unified production/standalone access
const distPath = path.join(__dirname, '../frontend/dist');
if (fs.existsSync(distPath)) {
  app.use(express.static(distPath));
  app.use((req, res, next) => {
    if (req.path.startsWith('/api') || req.path.startsWith('/socket.io')) return next();
    res.sendFile(path.join(distPath, 'index.html'));
  });
}

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`ZooHotel CRM Backend running on http://localhost:${PORT}`);
});
