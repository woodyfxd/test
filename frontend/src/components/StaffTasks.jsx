import React, { useState } from 'react';
import { 
  CheckSquare, 
  Clock, 
  Plus, 
  Send, 
  CheckCircle2, 
  Utensils, 
  Pill, 
  Dog, 
  Activity, 
  MessageSquare,
  Sparkles,
  Camera,
  UserCheck
} from 'lucide-react';

export default function StaffTasks({ 
  tasks = [], 
  currentUser, 
  onCompleteTask, 
  onNewTask 
}) {
  const [roleFilter, setRoleFilter] = useState(currentUser?.role === 'manager' ? 'all' : currentUser?.role);
  const [statusFilter, setStatusFilter] = useState('pending'); // pending, completed, all
  const [activeTaskModal, setActiveTaskModal] = useState(null);
  const [completionNote, setCompletionNote] = useState('');
  const [sendWhatsApp, setSendWhatsApp] = useState(true);

  const filteredTasks = tasks.filter(t => {
    const matchesRole = roleFilter === 'all' || t.targetRole === roleFilter || t.targetRole === 'all';
    const matchesStatus = statusFilter === 'all' || 
                          (statusFilter === 'pending' && t.status === 'pending') ||
                          (statusFilter === 'completed' && t.status === 'completed');
    return matchesRole && matchesStatus;
  });

  const handleOpenComplete = (task) => {
    setActiveTaskModal(task);
    setCompletionNote('');
    setSendWhatsApp(true);
  };

  const handleConfirmComplete = () => {
    if (!activeTaskModal) return;
    onCompleteTask(activeTaskModal.id, {
      completedByName: currentUser?.name || 'Сотрудник',
      completionNote: completionNote || 'Выполнено в полном объеме по стандарту',
      sendWhatsAppReport: sendWhatsApp
    });
    setActiveTaskModal(null);
  };

  const getTaskIcon = (title) => {
    const lower = title.toLowerCase();
    if (lower.includes('корм')) return <Utensils className="w-4 h-4 text-amber-500" />;
    if (lower.includes('лекарств') || lower.includes('осмотр') || lower.includes('таблет')) return <Pill className="w-4 h-4 text-blue-500" />;
    if (lower.includes('трениров') || lower.includes('выгул') || lower.includes('окд')) return <Dog className="w-4 h-4 text-emerald-500" />;
    if (lower.includes('фото')) return <Camera className="w-4 h-4 text-pink-500" />;
    return <Clock className="w-4 h-4 text-slate-400" />;
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-800">Задачи и напоминания для сотрудников</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Оперативный чек-лист смены: кормление по диете, прием медикаментов, выгул и тренировки
          </p>
        </div>

        <button
          onClick={onNewTask}
          className="flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white px-3.5 py-2 rounded-lg text-xs font-semibold shadow-xs transition-colors"
        >
          <Plus className="w-4 h-4" />
          Добавить напоминание
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-3 rounded-xl border border-slate-200 text-xs">
        {/* Role Select */}
        <div className="flex items-center gap-1.5 overflow-x-auto">
          <span className="text-slate-400 font-medium px-1">Назначение:</span>
          {[
            { id: 'all', label: 'Все отделы' },
            { id: 'sitter', label: 'Зооняня' },
            { id: 'cynologist', label: 'Кинолог' },
            { id: 'felinologist', label: 'Фелинолог' },
            { id: 'vet', label: 'Ветеринар' }
          ].map(rf => (
            <button
              key={rf.id}
              onClick={() => setRoleFilter(rf.id)}
              className={`px-3 py-1.5 rounded-lg transition-all font-medium ${
                roleFilter === rf.id ? 'bg-emerald-50 text-emerald-700 font-semibold' : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              {rf.label}
            </button>
          ))}
        </div>

        {/* Status Select */}
        <div className="flex bg-slate-100 p-1 rounded-lg">
          <button
            onClick={() => setStatusFilter('pending')}
            className={`px-3 py-1 rounded-md transition-all font-medium ${
              statusFilter === 'pending' ? 'bg-white shadow-xs text-slate-900' : 'text-slate-500'
            }`}
          >
            К исполнению ({tasks.filter(t => t.status === 'pending').length})
          </button>
          <button
            onClick={() => setStatusFilter('completed')}
            className={`px-3 py-1 rounded-md transition-all font-medium ${
              statusFilter === 'completed' ? 'bg-white shadow-xs text-slate-900' : 'text-slate-500'
            }`}
          >
            Выполненные
          </button>
          <button
            onClick={() => setStatusFilter('all')}
            className={`px-3 py-1 rounded-md transition-all font-medium ${
              statusFilter === 'all' ? 'bg-white shadow-xs text-slate-900' : 'text-slate-500'
            }`}
          >
            Все
          </button>
        </div>
      </div>

      {/* Task Cards List */}
      <div className="space-y-3">
        {filteredTasks.length === 0 ? (
          <div className="bg-white p-12 text-center rounded-xl border border-dashed border-slate-300 text-slate-400 text-xs">
            🎉 Все задачи по текущему фильтру успешно выполнены!
          </div>
        ) : (
          filteredTasks.map(task => {
            const isDone = task.status === 'completed';

            return (
              <div 
                key={task.id}
                className={`p-4 rounded-xl border transition-all bg-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 ${
                  isDone 
                    ? 'border-slate-200 bg-slate-50/50 opacity-70' 
                    : 'border-slate-200/90 shadow-xs hover:border-emerald-300'
                }`}
              >
                <div className="flex items-start space-x-3.5">
                  <div className="p-2.5 rounded-xl bg-slate-100 text-slate-700 mt-0.5">
                    {getTaskIcon(task.title)}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm text-slate-800">{task.title}</span>
                      <span className="font-mono text-emerald-800 text-xs font-bold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100">
                        ⏰ {task.scheduledTime}
                      </span>
                    </div>

                    <p className="text-xs text-slate-600 mt-1 max-w-2xl">{task.description}</p>

                    <div className="mt-2 flex flex-wrap items-center gap-3 text-[11px] text-slate-400">
                      <span>Номер: <strong className="text-slate-700">{task.roomName}</strong></span>
                      <span>•</span>
                      <span>Питомец: <strong className="text-slate-700">{task.petName}</strong></span>
                      <span>•</span>
                      <span className="bg-slate-100 text-slate-700 px-1.5 py-0.5 rounded">
                        Роль: {task.targetRole === 'sitter' ? 'Зооняня' : (task.targetRole === 'vet' ? 'Врач' : (task.targetRole === 'cynologist' ? 'Кинолог' : 'Фелинолог'))}
                      </span>
                    </div>

                    {isDone && task.completionNote && (
                      <div className="mt-2 text-xs bg-emerald-50 text-emerald-800 p-2 rounded-lg border border-emerald-100">
                        ✓ <strong>{task.completedByName}:</strong> {task.completionNote} ({new Date(task.completedAt).toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })})
                      </div>
                    )}
                  </div>
                </div>

                {/* Complete Button */}
                <div className="w-full sm:w-auto flex justify-end">
                  {!isDone ? (
                    <button
                      onClick={() => handleOpenComplete(task)}
                      className="flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold px-4 py-2 rounded-xl transition-colors shadow-xs active:scale-95 whitespace-nowrap"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      Отметить выполнение
                    </button>
                  ) : (
                    <span className="text-xs font-semibold text-emerald-700 bg-emerald-100 px-3 py-1.5 rounded-lg flex items-center gap-1">
                      <CheckCircle2 className="w-4 h-4" /> Выполнено
                    </span>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Complete Task Modal */}
      {activeTaskModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-start justify-between pb-2 border-b border-slate-100">
              <div>
                <h3 className="font-bold text-base text-slate-800">Завершение задачи</h3>
                <p className="text-xs text-slate-500">{activeTaskModal.title} • {activeTaskModal.petName}</p>
              </div>
              <button 
                onClick={() => setActiveTaskModal(null)}
                className="text-slate-400 hover:text-slate-600 font-bold p-1"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Отчет о выполнении:
                </label>
                <textarea
                  rows={3}
                  value={completionNote}
                  onChange={(e) => setCompletionNote(e.target.value)}
                  placeholder="Например: Питомец съел всю порцию с аппетитом, погуляли 40 минут, настроение бодрое..."
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-emerald-500 focus:bg-white"
                />
              </div>

              {/* Send WhatsApp checkbox */}
              <div className="bg-emerald-50/70 border border-emerald-200 p-3 rounded-xl flex items-start space-x-3">
                <input
                  type="checkbox"
                  id="wa_report"
                  checked={sendWhatsApp}
                  onChange={(e) => setSendWhatsApp(e.target.checked)}
                  className="mt-0.5 rounded text-emerald-600 focus:ring-emerald-500 w-4 h-4"
                />
                <label htmlFor="wa_report" className="text-xs text-slate-700 leading-snug cursor-pointer">
                  <strong className="text-emerald-900 flex items-center gap-1">
                    <MessageSquare className="w-3.5 h-3.5 text-emerald-600" />
                    Отправить отчет владельцу в WhatsApp
                  </strong>
                  Клиент мгновенно получит уведомление в чат гостиницы о том, что процедура или выгул выполнены!
                </label>
              </div>
            </div>

            <div className="pt-2 flex items-center justify-end gap-2 border-t border-slate-100">
              <button
                onClick={() => setActiveTaskModal(null)}
                className="px-3.5 py-2 text-xs font-medium text-slate-600 hover:bg-slate-100 rounded-xl"
              >
                Отмена
              </button>
              <button
                onClick={handleConfirmComplete}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-xl shadow-xs transition-colors"
              >
                Подтвердить и сохранить
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
