import React, { useState } from 'react';
import { Calendar, DollarSign, Plus, X, Dog, Cat, Sparkles } from 'lucide-react';

export default function NewBookingModal({ 
  isOpen, 
  onClose, 
  pets = [], 
  rooms = [], 
  onSave 
}) {
  if (!isOpen) return null;

  const [petId, setPetId] = useState(pets[0]?.id || '');
  const [roomId, setRoomId] = useState(rooms[0]?.id || '');
  const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);
  
  // Default end date 5 days ahead
  const defaultEnd = new Date();
  defaultEnd.setDate(defaultEnd.getDate() + 5);
  const [endDate, setEndDate] = useState(defaultEnd.toISOString().split('T')[0]);

  const [selectedServices, setSelectedServices] = useState([
    { name: 'Ежедневный фотоотчет WhatsApp', price: 0, checked: true }
  ]);

  const [cynologyLessons, setCynologyLessons] = useState(false);
  const [grooming, setGrooming] = useState(false);
  const [transfer, setTransfer] = useState(false);
  const [notes, setNotes] = useState('');

  const selectedRoom = rooms.find(r => r.id === roomId);
  const selectedPet = pets.find(p => p.id === petId);

  // Calculate days
  const start = new Date(startDate);
  const end = new Date(endDate);
  const diffDays = Math.max(1, Math.ceil(Math.abs(end - start) / (1000 * 60 * 60 * 24)));

  const dailyRate = selectedRoom?.pricePerDay || 1500;
  const baseCost = dailyRate * diffDays;

  let extraCost = 0;
  if (cynologyLessons) extraCost += 3000;
  if (grooming) extraCost += 2500;
  if (transfer) extraCost += 1200;

  const totalCost = baseCost + extraCost;

  const handleSubmit = (e) => {
    e.preventDefault();
    const additionalServices = [
      { name: 'Ежедневный фотоотчет WhatsApp', price: 0 }
    ];
    if (cynologyLessons) additionalServices.push({ name: 'Индивидуальные занятия с кинологом', price: 3000 });
    if (grooming) additionalServices.push({ name: 'Груминг перед выездом', price: 2500 });
    if (transfer) additionalServices.push({ name: 'Зоотакси (трансфер)', price: 1200 });

    onSave({
      petId,
      clientId: selectedPet?.clientId || 'c-1',
      roomId,
      startDate,
      endDate,
      additionalServices,
      notes
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-start justify-between pb-3 border-b border-slate-100">
          <div>
            <h2 className="text-lg font-bold text-slate-800">Новое бронирование номера</h2>
            <p className="text-xs text-slate-500">Автоматический расчет дней, стоимости и отправка WhatsApp уведомления</p>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 font-bold p-1">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          {/* Select Pet */}
          <div>
            <label className="block font-semibold text-slate-700 mb-1">Выберите питомца:</label>
            <select
              value={petId}
              onChange={(e) => setPetId(e.target.value)}
              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-emerald-500 font-medium"
            >
              {pets.map(p => (
                <option key={p.id} value={p.id}>
                  {p.name} ({p.speciesLabel}, {p.breed}) — Владелец: {p.clientName}
                </option>
              ))}
            </select>
          </div>

          {/* Select Room */}
          <div>
            <label className="block font-semibold text-slate-700 mb-1">Выберите номер / бокс:</label>
            <select
              value={roomId}
              onChange={(e) => setRoomId(e.target.value)}
              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-emerald-500 font-medium"
            >
              {rooms.map(r => (
                <option key={r.id} value={r.id}>
                  {r.name} ({r.category}) — {r.pricePerDay} ₽/сутки {r.status === 'occupied' ? '• Сейчас занят' : '• Свободен'}
                </option>
              ))}
            </select>
          </div>

          {/* Dates */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Дата заезда:</label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-emerald-500"
                required
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Дата выезда:</label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-emerald-500"
                required
              />
            </div>
          </div>

          {/* Additional Services */}
          <div>
            <label className="block font-semibold text-slate-700 mb-1.5">Дополнительные услуги:</label>
            <div className="space-y-2 bg-slate-50 p-3 rounded-xl border border-slate-200">
              <label className="flex items-center space-x-2 text-slate-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={cynologyLessons}
                  onChange={(e) => setCynologyLessons(e.target.checked)}
                  className="rounded text-emerald-600 focus:ring-emerald-500"
                />
                <span>Индивидуальные занятия с кинологом (+3 000 ₽)</span>
              </label>

              <label className="flex items-center space-x-2 text-slate-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={grooming}
                  onChange={(e) => setGrooming(e.target.checked)}
                  className="rounded text-emerald-600 focus:ring-emerald-500"
                />
                <span>Груминг и спа перед выездом (+2 500 ₽)</span>
              </label>

              <label className="flex items-center space-x-2 text-slate-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={transfer}
                  onChange={(e) => setTransfer(e.target.checked)}
                  className="rounded text-emerald-600 focus:ring-emerald-500"
                />
                <span>Трансфер зоотакси туда/обратно (+1 200 ₽)</span>
              </label>
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="block font-semibold text-slate-700 mb-1">Пожелания клиента / примечания:</label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Особые пожелания по времени заезда, привычкам питомца..."
              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-emerald-500"
            />
          </div>

          {/* Pricing Summary */}
          <div className="bg-emerald-50 p-4 rounded-xl border border-emerald-200 flex items-center justify-between">
            <div>
              <div className="font-bold text-emerald-950 text-sm">Итоговый расчет:</div>
              <div className="text-[11px] text-emerald-800">
                {diffDays} суток × {dailyRate} ₽ {extraCost > 0 ? `+ доп. услуги (${extraCost} ₽)` : ''}
              </div>
            </div>
            <div className="text-xl font-bold text-emerald-800">
              {totalCost} ₽
            </div>
          </div>

          {/* Submit */}
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
              Подтвердить бронь
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
