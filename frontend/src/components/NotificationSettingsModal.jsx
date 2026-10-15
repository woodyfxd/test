import React, { useState, useEffect } from 'react';
import { 
  Bell, 
  Smartphone, 
  Monitor, 
  Send, 
  CheckCircle, 
  AlertTriangle, 
  MessageSquare, 
  Bot, 
  Save, 
  Sparkles, 
  X,
  Volume2
} from 'lucide-react';
import { requestNotificationPermission, sendSystemNotification, playNotificationSound } from '../utils/notifications';

export default function NotificationSettingsModal({ 
  isOpen, 
  onClose, 
  settings, 
  onSaveSettings, 
  onSendTestNotification 
}) {
  if (!isOpen) return null;

  const [localSettings, setLocalSettings] = useState(settings || {});
  const [permissionState, setPermissionState] = useState(
    'Notification' in window ? Notification.permission : 'unsupported'
  );
  const [testSent, setTestSent] = useState(false);

  useEffect(() => {
    if (settings) setLocalSettings(settings);
    if ('Notification' in window) {
      setPermissionState(Notification.permission);
    }
  }, [settings]);

  const handleRequestPermission = async () => {
    const res = await requestNotificationPermission();
    setPermissionState(res);
    if (res === 'granted') {
      sendSystemNotification('🐾 ZooHotel CRM: Уведомления активированы!', {
        body: 'Теперь вы будете получать всплывающие напоминания на компьютер и телефон.'
      });
    }
  };

  const handleTest = () => {
    playNotificationSound();
    sendSystemNotification('⏰ ZooHotel: Тестовое напоминание смены', {
      body: 'Кормление питомца Байкал (Хаски) в 18:00. Номер: Премиум «Олимп»'
    });
    onSendTestNotification({
      title: '⏰ Напоминание смены: Кормление Байкала',
      body: 'Номер Премиум «Олимп». Корм: Acana Lamb 180г без курицы.'
    });
    setTestSent(true);
    setTimeout(() => setTestSent(false), 4000);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSaveSettings(localSettings);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-start justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center">
              <Bell className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-800">Уведомления на компьютер и телефон</h2>
              <p className="text-xs text-slate-500">Настройка системных всплывающих окон, мобильного Push и Telegram</p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 font-bold p-1">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          
          {/* Channel 1: Desktop OS Notifications (Windows / macOS / Linux) */}
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2.5 font-bold text-slate-800 text-sm">
                <Monitor className="w-4 h-4 text-emerald-600" />
                <span>1. Всплывающие уведомления Windows / Mac</span>
              </div>
              <span className={`text-[11px] px-2 py-0.5 rounded-full font-semibold ${
                permissionState === 'granted' 
                  ? 'bg-emerald-100 text-emerald-800' 
                  : permissionState === 'denied' 
                  ? 'bg-rose-100 text-rose-800' 
                  : 'bg-amber-100 text-amber-800'
              }`}>
                {permissionState === 'granted' ? '✓ Разрешено в системе' : permissionState === 'denied' ? 'Заблокировано браузером' : 'Требует разрешения'}
              </span>
            </div>

            <p className="text-slate-500 leading-relaxed text-[11px]">
              Всплывают в правом нижнем углу Windows даже если вкладка браузера свернута или вы работаете в другой программе.
            </p>

            {permissionState !== 'granted' && (
              <button
                type="button"
                onClick={handleRequestPermission}
                className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold px-3 py-1.5 rounded-lg text-xs shadow-xs transition-colors flex items-center gap-1.5"
              >
                <Bell className="w-3.5 h-3.5" />
                Разрешить системные уведомления
              </button>
            )}
          </div>

          {/* Channel 2: Mobile Phone (PWA & Android / iOS Push) */}
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2.5 font-bold text-slate-800 text-sm">
                <Smartphone className="w-4 h-4 text-blue-600" />
                <span>2. Мобильный телефон (Экран блокировки)</span>
              </div>
              <span className="text-[11px] bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full font-semibold">
                PWA & Push активны
              </span>
            </div>

            <p className="text-slate-500 leading-relaxed text-[11px]">
              На телефоне откройте <strong>http://localhost:5000</strong> (или локальный IP компьютера в Wi-Fi сети) и выберите в меню браузера <strong>«Добавить на главный экран»</strong>. CRM установится как мобильное приложение со звуковыми оповещениями и вибрацией.
            </p>
          </div>

          {/* Channel 3: Telegram Bot for Staff */}
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2.5 font-bold text-slate-800 text-sm">
                <Bot className="w-4 h-4 text-sky-600" />
                <span>3. Telegram-бот дежурной смены</span>
              </div>
              <label className="flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={localSettings.telegramBotEnabled}
                  onChange={(e) => setLocalSettings({ ...localSettings, telegramBotEnabled: e.target.checked })}
                  className="rounded text-sky-600 focus:ring-sky-500 w-4 h-4"
                />
              </label>
            </div>

            <p className="text-slate-500 text-[11px]">
              Мгновенная доставка всех напоминаний (кормление, прием таблеток, выгул) в закрытую Telegram-группу сотрудников или личные сообщения.
            </p>

            {localSettings.telegramBotEnabled && (
              <div className="grid grid-cols-2 gap-2 pt-1">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-0.5">Название группы / чата:</label>
                  <input
                    type="text"
                    value={localSettings.telegramStaffGroup || ''}
                    onChange={(e) => setLocalSettings({ ...localSettings, telegramStaffGroup: e.target.value })}
                    className="w-full p-2 bg-white border border-slate-200 rounded-lg text-xs"
                    placeholder="ZooHotel Смена"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-0.5">Chat ID группы в Telegram:</label>
                  <input
                    type="text"
                    value={localSettings.telegramChatId || ''}
                    onChange={(e) => setLocalSettings({ ...localSettings, telegramChatId: e.target.value })}
                    className="w-full p-2 bg-white border border-slate-200 rounded-lg text-xs font-mono"
                    placeholder="-100..."
                  />
                </div>
              </div>
            )}
          </div>

          {/* Channel 4: WhatsApp Staff Alert */}
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2.5 font-bold text-slate-800 text-sm">
                <MessageSquare className="w-4 h-4 text-emerald-600" />
                <span>4. Экстренные SMS / WhatsApp оповещения</span>
              </div>
              <label className="flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={localSettings.whatsappStaffAlertsEnabled}
                  onChange={(e) => setLocalSettings({ ...localSettings, whatsappStaffAlertsEnabled: e.target.checked })}
                  className="rounded text-emerald-600 focus:ring-emerald-500 w-4 h-4"
                />
              </label>
            </div>

            {localSettings.whatsappStaffAlertsEnabled && (
              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-0.5">Номер телефона старшего смены:</label>
                <input
                  type="text"
                  value={localSettings.whatsappStaffNumber || ''}
                  onChange={(e) => setLocalSettings({ ...localSettings, whatsappStaffNumber: e.target.value })}
                  className="w-full p-2 bg-white border border-slate-200 rounded-lg text-xs font-mono"
                  placeholder="+7 (999) 000-00-00"
                />
              </div>
            )}
          </div>

          {/* Test Button & Save Actions */}
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-slate-100">
            <button
              type="button"
              onClick={handleTest}
              className="w-full sm:w-auto bg-amber-500 hover:bg-amber-600 text-white font-semibold px-4 py-2 rounded-xl transition-all shadow-xs flex items-center justify-center gap-1.5"
            >
              <Volume2 className="w-4 h-4" />
              Отправить тестовый сигнал (Звук + Push)
            </button>

            <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
              <button
                type="button"
                onClick={onClose}
                className="px-3 py-2 text-slate-600 hover:bg-slate-100 rounded-xl font-medium"
              >
                Отмена
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-xl shadow-xs transition-colors"
              >
                Сохранить настройки
              </button>
            </div>
          </div>

          {testSent && (
            <div className="p-2.5 bg-emerald-50 text-emerald-800 rounded-lg text-center font-medium border border-emerald-200">
              ✓ Системное уведомление отправлено: проверьте правый нижний угол экрана и звук!
            </div>
          )}
        </form>
      </div>
    </div>
  );
}
