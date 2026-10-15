import React, { useState, useEffect } from 'react';
import { api, socket } from './api';
import Navbar from './components/Navbar';
import DashboardOverview from './components/DashboardOverview';
import BookingsChessboard from './components/BookingsChessboard';
import PetsManagement from './components/PetsManagement';
import StaffTasks from './components/StaffTasks';
import WhatsAppChat from './components/WhatsAppChat';
import AutoMessagesConfig from './components/AutoMessagesConfig';
import SpecialistDesk from './components/SpecialistDesk';
import ClientPortal from './components/ClientPortal';
import NewBookingModal from './components/NewBookingModal';
import NewPetModal from './components/NewPetModal';
import NewTaskModal from './components/NewTaskModal';
import NotificationSettingsModal from './components/NotificationSettingsModal';
import { sendSystemNotification, playNotificationSound } from './utils/notifications';
import { Bell, CheckCircle2, MessageSquare, Sparkles, User, ShieldCheck } from 'lucide-react';

export default function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [activeTab, setActiveTab] = useState('dashboard');
  
  // Data State
  const [stats, setStats] = useState(null);
  const [rooms, setRooms] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [pets, setPets] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [conversations, setConversations] = useState([]);
  const [templates, setTemplates] = useState([]);
  const [notificationSettings, setNotificationSettings] = useState(null);
  
  // Modals
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [isPetModalOpen, setIsPetModalOpen] = useState(false);
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [isNotificationModalOpen, setIsNotificationModalOpen] = useState(false);

  // Toast notification
  const [toast, setToast] = useState(null);

  const showToast = (title, message, iconType = 'info') => {
    setToast({ title, message, iconType });
    setTimeout(() => setToast(null), 4500);
  };

  // Initial load
  useEffect(() => {
    // Default login as manager for immediate overview
    handleSwitchRole('manager');
  }, []);

  // Fetch all core data
  const refreshData = async () => {
    try {
      const [sData, rData, bData, pData, tData, cData, tplData, nData] = await Promise.all([
        api.getStats(),
        api.getRooms(),
        api.getBookings(),
        api.getPets(),
        api.getTasks(),
        api.getConversations(),
        api.getAutoTemplates(),
        api.getNotificationSettings()
      ]);
      setStats(sData);
      setRooms(rData);
      setBookings(bData);
      setPets(pData);
      setTasks(tData);
      setConversations(cData);
      setTemplates(tplData);
      setNotificationSettings(nData);
    } catch (err) {
      console.error('Failed to load data:', err);
    }
  };

  // Set up WebSockets
  useEffect(() => {
    refreshData();

    // Multi-channel Desktop & Phone notifications from backend
    socket.on('staff:system_notification', (alert) => {
      sendSystemNotification(alert.title, { body: alert.body });
      showToast(alert.title, alert.body, 'bell');
    });

    socket.on('whatsapp:new_message', ({ conversationId, message, incoming }) => {
      // Refresh conversations
      api.getConversations().then(setConversations);
      api.getStats().then(setStats);

      if (incoming) {
        sendSystemNotification(`💬 WhatsApp от ${message.senderName}`, { body: message.text });
        showToast('💬 Новое сообщение WhatsApp', `${message.senderName}: "${message.text}"`, 'whatsapp');
      }
    });

    socket.on('task:created', (newTask) => {
      api.getTasks().then(setTasks);
      api.getStats().then(setStats);
      sendSystemNotification(`⏰ Напоминание: ${newTask.title}`, { body: `Время: ${newTask.scheduledTime} • ${newTask.petName}` });
      showToast('⏰ Новое напоминание', newTask.title, 'task');
    });

    socket.on('task:completed', (completedTask) => {
      api.getTasks().then(setTasks);
      api.getStats().then(setStats);
    });

    socket.on('booking:created', () => {
      refreshData();
    });

    socket.on('booking:updated', () => {
      refreshData();
    });

    return () => {
      socket.off('staff:system_notification');
      socket.off('whatsapp:new_message');
      socket.off('task:created');
      socket.off('task:completed');
      socket.off('booking:created');
      socket.off('booking:updated');
    };
  }, []);

  const handleSwitchRole = async (role) => {
    try {
      const res = await api.switchDemo(role);
      setCurrentUser(res.user);
      
      // Select appropriate default tab for the role
      if (role === 'manager') setActiveTab('dashboard');
      else if (role === 'admin') setActiveTab('chessboard');
      else if (role === 'sitter') setActiveTab('tasks');
      else if (role === 'cynologist' || role === 'felinologist' || role === 'vet') setActiveTab('specialists');
      else if (role === 'client') setActiveTab('client_portal');

      showToast('Смена роли', `Вы вошли как: ${res.user.name} (${role})`, 'role');
    } catch (err) {
      console.error('Role switch failed:', err);
    }
  };

  // Check-In handler
  const handleCheckIn = async (bookingId) => {
    try {
      await api.updateBooking(bookingId, { status: 'checked_in' });
      await refreshData();
      showToast('Гость заселен!', 'Номер переведен в статус Занят, ветеринару и зооняне созданы задачи, в WhatsApp владельцу отправлено приветствие.', 'checkin');
    } catch (err) {
      alert('Ошибка заселения: ' + err.message);
    }
  };

  // Check-Out handler
  const handleCheckOut = async (bookingId) => {
    try {
      await api.updateBooking(bookingId, { status: 'checked_out' });
      await refreshData();
      showToast('Выезд оформлен', 'Номер переведен в статус Санитарная уборка, задача добавлена зооняне.', 'checkout');
    } catch (err) {
      alert('Ошибка выезда: ' + err.message);
    }
  };

  // Complete Task handler
  const handleCompleteTask = async (taskId, data) => {
    try {
      await api.completeTask(taskId, data);
      await refreshData();
      showToast('Задача выполнена', data.sendWhatsAppReport ? 'Отчет отправлен в WhatsApp владельцу!' : 'Статус обновлен в чек-листе смены.');
    } catch (err) {
      alert('Ошибка сохранения задачи: ' + err.message);
    }
  };

  // WhatsApp Send Message
  const handleSendMessage = async (msgData) => {
    try {
      await api.sendMessage(msgData);
      const updatedConvs = await api.getConversations();
      setConversations(updatedConvs);
    } catch (err) {
      alert('Ошибка отправки сообщения: ' + err.message);
    }
  };

  // WhatsApp Simulate Incoming
  const handleSimulateIncoming = async (data) => {
    try {
      await api.simulateIncomingWhatsApp(data);
      const updatedConvs = await api.getConversations();
      setConversations(updatedConvs);
    } catch (err) {
      alert('Ошибка симуляции: ' + err.message);
    }
  };

  // Update Template
  const handleUpdateTemplate = async (id, data) => {
    try {
      await api.updateAutoTemplate(id, data);
      const updated = await api.getAutoTemplates();
      setTemplates(updated);
      showToast('Шаблон сохранен', 'Настройки авто-сообщения обновлены.');
    } catch (err) {
      alert('Ошибка обновления шаблона: ' + err.message);
    }
  };

  // New Booking Save
  const handleCreateBooking = async (bookingData) => {
    try {
      await api.createBooking(bookingData);
      await refreshData();
      showToast('Бронирование создано!', 'Подтверждение отправлено владельцу в WhatsApp.');
    } catch (err) {
      alert('Ошибка бронирования: ' + err.message);
    }
  };

  // New Pet Save
  const handleCreatePet = async (petData) => {
    try {
      await api.createPet(petData);
      await refreshData();
      showToast('Питомец зарегистрирован', `Карточка ${petData.name} создана в реестре.`);
    } catch (err) {
      alert('Ошибка регистрации: ' + err.message);
    }
  };

  // New Task Save
  const handleCreateTask = async (taskData) => {
    try {
      await api.createTask(taskData);
      await refreshData();
      showToast('Напоминание создано', `Назначено на ${taskData.scheduledTime}`);
    } catch (err) {
      alert('Ошибка добавления задачи: ' + err.message);
    }
  };

  // Save Notification Settings
  const handleSaveNotificationSettings = async (newSettings) => {
    try {
      const updated = await api.updateNotificationSettings(newSettings);
      setNotificationSettings(updated);
      showToast('Настройки сохранены', 'Каналы уведомлений обновлены.');
    } catch (err) {
      alert('Ошибка сохранения настроек: ' + err.message);
    }
  };

  const handleSendTestNotification = async (testData) => {
    try {
      await api.testSystemNotification(testData);
    } catch (err) {
      console.warn('Test notification error:', err);
    }
  };

  const unreadCount = conversations.reduce((acc, c) => acc + (c.unreadCount || 0), 0);
  const pendingTasksCount = tasks.filter(t => t.status === 'pending').length;

  return (
    <div className="min-h-screen bg-[#f8fafc] flex flex-col font-sans">
      {/* Navigation Header */}
      <Navbar
        currentUser={currentUser}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onSwitchRole={handleSwitchRole}
        onLogout={() => handleSwitchRole('manager')}
        unreadCount={unreadCount}
        pendingTasksCount={pendingTasksCount}
        onOpenNotificationSettings={() => setIsNotificationModalOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {activeTab === 'dashboard' && (
          <DashboardOverview
            stats={stats}
            rooms={rooms}
            tasks={tasks}
            bookings={bookings}
            onNavigateTab={setActiveTab}
            onNewBooking={() => setIsBookingModalOpen(true)}
          />
        )}

        {activeTab === 'chessboard' && (
          <BookingsChessboard
            rooms={rooms}
            bookings={bookings}
            onCheckIn={handleCheckIn}
            onCheckOut={handleCheckOut}
            onNewBooking={() => setIsBookingModalOpen(true)}
          />
        )}

        {activeTab === 'pets' && (
          <PetsManagement
            pets={pets}
            onNewPet={() => setIsPetModalOpen(true)}
          />
        )}

        {activeTab === 'tasks' && (
          <StaffTasks
            tasks={tasks}
            currentUser={currentUser}
            onCompleteTask={handleCompleteTask}
            onNewTask={() => setIsTaskModalOpen(true)}
          />
        )}

        {activeTab === 'whatsapp' && (
          <WhatsAppChat
            conversations={conversations}
            currentUser={currentUser}
            onSendMessage={handleSendMessage}
            onSimulateIncoming={handleSimulateIncoming}
          />
        )}

        {activeTab === 'automessages' && (
          <AutoMessagesConfig
            templates={templates}
            onUpdateTemplate={handleUpdateTemplate}
          />
        )}

        {activeTab === 'specialists' && (
          <SpecialistDesk
            pets={pets}
            currentUser={currentUser}
            onAddTask={handleCreateTask}
          />
        )}

        {activeTab === 'client_portal' && (
          <ClientPortal
            currentUser={currentUser}
            pets={pets}
            bookings={bookings}
            onNavigateTab={setActiveTab}
            onNewBooking={() => setIsBookingModalOpen(true)}
          />
        )}
      </main>

      {/* Modals */}
      <NewBookingModal
        isOpen={isBookingModalOpen}
        onClose={() => setIsBookingModalOpen(false)}
        pets={pets}
        rooms={rooms}
        onSave={handleCreateBooking}
      />

      <NewPetModal
        isOpen={isPetModalOpen}
        onClose={() => setIsPetModalOpen(false)}
        onSave={handleCreatePet}
      />

      <NewTaskModal
        isOpen={isTaskModalOpen}
        onClose={() => setIsTaskModalOpen(false)}
        pets={pets}
        rooms={rooms}
        onSave={handleCreateTask}
      />

      <NotificationSettingsModal
        isOpen={isNotificationModalOpen}
        onClose={() => setIsNotificationModalOpen(false)}
        settings={notificationSettings}
        onSaveSettings={handleSaveNotificationSettings}
        onSendTestNotification={handleSendTestNotification}
      />

      {/* Interactive Toast Notification Popup */}
      {toast && (
        <div className="fixed bottom-5 right-5 z-50 animate-bounce duration-300">
          <div className="bg-slate-900 text-white px-4 py-3 rounded-2xl shadow-2xl flex items-center space-x-3 border border-slate-700/80 max-w-sm">
            <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
              {toast.iconType === 'whatsapp' ? <MessageSquare className="w-4 h-4" /> : <Sparkles className="w-4 h-4" />}
            </div>
            <div className="text-xs">
              <div className="font-bold text-slate-100">{toast.title}</div>
              <div className="text-slate-300 truncate mt-0.5">{toast.message}</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
