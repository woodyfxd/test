import React from 'react';
import { 
  Building2, 
  Users, 
  Calendar, 
  CheckSquare, 
  MessageSquare, 
  Sliders, 
  HeartHandshake, 
  Activity, 
  Dog, 
  Cat, 
  LogOut, 
  Bell, 
  Sparkles,
  UserCheck
} from 'lucide-react';

export const ROLE_LABELS = {
  manager: { label: 'Управляющий', color: 'bg-purple-100 text-purple-700 border-purple-300' },
  admin: { label: 'Администратор', color: 'bg-blue-100 text-blue-700 border-blue-300' },
  sitter: { label: 'Зооняня', color: 'bg-emerald-100 text-emerald-700 border-emerald-300' },
  cynologist: { label: 'Кинолог', color: 'bg-amber-100 text-amber-700 border-amber-300' },
  felinologist: { label: 'Фелинолог', color: 'bg-pink-100 text-pink-700 border-pink-300' },
  vet: { label: 'Врач (Ветеринар)', color: 'bg-red-100 text-red-700 border-red-300' },
  client: { label: 'Клиент (Владелец)', color: 'bg-indigo-100 text-indigo-700 border-indigo-300' }
};

export default function Navbar({ 
  currentUser, 
  activeTab, 
  setActiveTab, 
  onSwitchRole, 
  onLogout,
  unreadCount = 0,
  pendingTasksCount = 0,
  onOpenNotificationSettings
}) {
  const role = currentUser?.role || 'manager';

  // Define tabs based on role
  const getTabs = () => {
    switch (role) {
      case 'manager':
        return [
          { id: 'dashboard', label: 'Дашборд', icon: Activity },
          { id: 'chessboard', label: 'Шахматка номеров', icon: Calendar },
          { id: 'pets', label: 'Питомцы', icon: Dog },
          { id: 'tasks', label: 'Задачи и напоминания', icon: CheckSquare, badge: pendingTasksCount },
          { id: 'whatsapp', label: 'WhatsApp Чат', icon: MessageSquare, badge: unreadCount },
          { id: 'automessages', label: 'Автосообщения', icon: Sliders },
          { id: 'specialists', label: 'Специалисты', icon: HeartHandshake }
        ];
      case 'admin':
        return [
          { id: 'chessboard', label: 'Шахматка номеров', icon: Calendar },
          { id: 'pets', label: 'Питомцы и владельцы', icon: Dog },
          { id: 'tasks', label: 'Задачи смены', icon: CheckSquare, badge: pendingTasksCount },
          { id: 'whatsapp', label: 'WhatsApp с клиентами', icon: MessageSquare, badge: unreadCount },
          { id: 'automessages', label: 'Шаблоны сообщений', icon: Sliders }
        ];
      case 'sitter':
        return [
          { id: 'tasks', label: 'Чек-лист ухода (Смена)', icon: CheckSquare, badge: pendingTasksCount },
          { id: 'pets', label: 'Питомцы в отеле', icon: Dog },
          { id: 'whatsapp', label: 'Отчеты владельцам (WhatsApp)', icon: MessageSquare }
        ];
      case 'cynologist':
        return [
          { id: 'specialists', label: 'Дрессировка и занятия', icon: Dog },
          { id: 'tasks', label: 'План тренировок', icon: CheckSquare, badge: pendingTasksCount },
          { id: 'pets', label: 'Карточки собак', icon: Users }
        ];
      case 'felinologist':
        return [
          { id: 'specialists', label: 'Адаптация кошек', icon: Cat },
          { id: 'tasks', label: 'План ухода и снятия стресса', icon: CheckSquare, badge: pendingTasksCount },
          { id: 'pets', label: 'Карточки кошек', icon: Users }
        ];
      case 'vet':
        return [
          { id: 'specialists', label: 'Вет-осмотры и карантин', icon: Activity },
          { id: 'tasks', label: 'Лист назначений', icon: CheckSquare, badge: pendingTasksCount },
          { id: 'pets', label: 'Медкарты питомцев', icon: Users }
        ];
      case 'client':
        return [
          { id: 'client_portal', label: 'Личный кабинет', icon: Sparkles },
          { id: 'whatsapp', label: 'Чат с отелем (WhatsApp)', icon: MessageSquare, badge: unreadCount }
        ];
      default:
        return [];
    }
  };

  const tabs = getTabs();

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-40 shadow-xs">
      {/* Top tier: Brand, Demo Switcher, User info */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 border-b border-slate-100">
          
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center text-white shadow-md shadow-emerald-100">
              <span className="text-xl">🐾</span>
            </div>
            <div>
              <div className="font-bold text-lg text-slate-800 leading-tight flex items-center gap-2">
                ZooHotel <span className="text-emerald-600 font-semibold text-xs px-2 py-0.5 rounded-full bg-emerald-50">CRM 2.0</span>
              </div>
              <p className="text-xs text-slate-400">Гостиница для животных & Передержка</p>
            </div>
          </div>

          {/* Quick Demo Role Switcher */}
          <div className="hidden lg:flex items-center bg-slate-100/80 p-1 rounded-xl border border-slate-200/60 text-xs">
            <span className="px-2 font-medium text-slate-500 flex items-center gap-1">
              <UserCheck className="w-3.5 h-3.5 text-slate-400" /> Роль:
            </span>
            {Object.keys(ROLE_LABELS).map((rKey) => {
              const active = role === rKey;
              return (
                <button
                  key={rKey}
                  onClick={() => onSwitchRole(rKey)}
                  className={`px-2.5 py-1 rounded-lg transition-all font-medium ${
                    active 
                      ? 'bg-white shadow-xs text-slate-900 border border-slate-200/80' 
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
                  }`}
                  title={`Переключиться на роль: ${ROLE_LABELS[rKey].label}`}
                >
                  {ROLE_LABELS[rKey].label.split(' ')[0]}
                </button>
              );
            })}
          </div>

          {/* User badge & Actions */}
          <div className="flex items-center space-x-3">
            {/* Notification Channels Button */}
            <button
              onClick={onOpenNotificationSettings}
              title="Настройка уведомлений на компьютер и телефон (Windows, Push, Telegram)"
              className="flex items-center gap-1.5 px-2.5 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 rounded-xl border border-emerald-200/80 text-xs font-semibold transition-all shadow-2xs cursor-pointer active:scale-95"
            >
              <Bell className="w-3.5 h-3.5 text-emerald-600 animate-pulse" />
              <span className="hidden sm:inline">Оповещения</span>
            </button>

            <div className="text-right hidden sm:block">
              <div className="text-sm font-semibold text-slate-800">{currentUser?.name}</div>
              <span className={`inline-block text-[11px] font-medium px-2 py-0.2 rounded-md border ${ROLE_LABELS[role]?.color || 'bg-slate-100 text-slate-700'}`}>
                {ROLE_LABELS[role]?.label}
              </span>
            </div>
            <img 
              src={currentUser?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100'} 
              alt="Avatar" 
              className="w-9 h-9 rounded-full border border-slate-200 object-cover"
            />
            <button 
              onClick={onLogout}
              title="Выйти"
              className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Bottom tier: Role specific Navigation Tabs */}
        <div className="flex space-x-1 overflow-x-auto py-2 no-scrollbar">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 px-3.5 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${
                  isActive
                    ? 'bg-emerald-50 text-emerald-700 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-emerald-600' : 'text-slate-400'}`} />
                <span>{tab.label}</span>
                {tab.badge > 0 && (
                  <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold ${
                    isActive ? 'bg-emerald-600 text-white' : 'bg-rose-500 text-white'
                  }`}>
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
}
