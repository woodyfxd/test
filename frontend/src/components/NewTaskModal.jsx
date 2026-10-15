import React, { useState } from 'react';
import { X, Clock, CheckSquare } from 'lucide-react';

export default function NewTaskModal({ 
  isOpen, 
  onClose, 
  pets = [], 
  rooms = [], 
  onSave 
}) {
  if (!isOpen) return null;

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [targetRole, setTargetRole] = useState('sitter');
  const [scheduledTime, setScheduledTime] = useState('14:00');
  const [petId, setPetId] = useState(pets[0]?.id || '');
  const [roomId, setRoomId] = useState(rooms[0]?.id || '');

  const selectedPet = pets.find(p => p.id === petId);
  const selectedRoom = rooms.find(r => r.id === roomId);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({
      title,
      description,
      targetRole,
      scheduledTime,
      petId: selectedPet?.id || null,
      petName: selectedPet ? `${selectedPet.name} (${selectedPet.breed})` : 'Общая задача',
      roomId: selectedRoom?.id || null,
      roomName: selectedRoom ? selectedRoom.name : 'Территория отеля'
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
        <div className="flex items-start justify-between pb-3 border-b border-slate-100">
          <div>
            <h2 className="text-lg font-bold text-slate-800">Новое напоминание для персонала</h2>
            <p className="text-xs text-slate-500">Постановка задачи в чек-лист дежурной смены</p>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 font-bold p-1">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
          <div>
            <label className="block font-semibold text-slate-700 mb-1">Название задачи *</label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Например: Дневное кормление и витамины"
              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-emerald-500 font-medium"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Исполнитель (Роль):</label>
              <select
                value={targetRole}
                onChange={(e) => setTargetRole(e.target.value)}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-emerald-500 font-medium"
              >
                <option value="sitter">Зооняня</option>
                <option value="cynologist">Кинолог</option>
                <option value="felinologist">Фелинолог</option>
                <option value="vet">Врач (Ветеринар)</option>
                <option value="all">Все сотрудники</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Время исполнения:</label>
              <input
                type="text"
                value={scheduledTime}
                onChange={(e) => setScheduledTime(e.target.value)}
                placeholder="14:00"
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-emerald-500 font-mono"
              />
            </div>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Привязать к питомцу:</label>
            <select
              value={petId}
              onChange={(e) => setPetId(e.target.value)}
              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-emerald-500"
            >
              <option value="">Без привязки к питомцу</option>
              {pets.map(p => (
                <option key={p.id} value={p.id}>
                  {p.name} ({p.breed})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Подробные указания:</label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Точная граммовка корма, дозировка лекарства или длительность выгула..."
              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div className="pt-2 flex justify-end space-x-2 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-xl font-medium"
            >
              Отмена
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-xl shadow-xs transition-colors"
            >
              Создать задачу
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
