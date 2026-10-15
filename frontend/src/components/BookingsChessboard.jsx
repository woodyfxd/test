import React, { useState } from 'react';
import { 
  Calendar, 
  Plus, 
  CheckCircle2, 
  LogOut, 
  Clock, 
  Dog, 
  Cat, 
  User, 
  Phone, 
  ShieldCheck,
  ChevronLeft,
  ChevronRight,
  Sparkles
} from 'lucide-react';

export default function BookingsChessboard({ 
  rooms = [], 
  bookings = [], 
  onCheckIn, 
  onCheckOut, 
  onNewBooking 
}) {
  const [filterType, setFilterType] = useState('all'); // all, dog, cat
  const [selectedBooking, setSelectedBooking] = useState(null);

  // Generate 10 days for calendar timeline
  const today = new Date();
  const days = Array.from({ length: 12 }, (_, i) => {
    const d = new Date(today);
    d.setDate(today.getDate() - 1 + i);
    return d;
  });

  const filteredRooms = rooms.filter(r => {
    if (filterType === 'all') return true;
    return r.type === filterType || r.type === 'all';
  });

  const getStatusBadge = (status) => {
    switch (status) {
      case 'checked_in':
        return <span className="bg-emerald-100 text-emerald-800 text-[11px] px-2 py-0.5 rounded-full font-medium">Заселен</span>;
      case 'confirmed':
        return <span className="bg-blue-100 text-blue-800 text-[11px] px-2 py-0.5 rounded-full font-medium">Подтверждено</span>;
      case 'checked_out':
        return <span className="bg-slate-100 text-slate-600 text-[11px] px-2 py-0.5 rounded-full font-medium">Выехал</span>;
      default:
        return <span className="bg-amber-100 text-amber-800 text-[11px] px-2 py-0.5 rounded-full font-medium">Новый</span>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-5 rounded-xl border border-slate-200/80 shadow-xs">
        <div>
          <h1 className="text-xl font-bold text-slate-800">Шахматка номеров и бронирований</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Календарная сетка занятости номеров, заселение и выписка гостей
          </p>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          {/* Filter dogs / cats */}
          <div className="flex bg-slate-100 p-1 rounded-lg text-xs font-medium">
            <button
              onClick={() => setFilterType('all')}
              className={`px-3 py-1.5 rounded-md transition-all ${filterType === 'all' ? 'bg-white shadow-xs text-slate-900' : 'text-slate-500 hover:text-slate-900'}`}
            >
              Все номера ({rooms.length})
            </button>
            <button
              onClick={() => setFilterType('dog')}
              className={`px-3 py-1.5 rounded-md transition-all flex items-center gap-1 ${filterType === 'dog' ? 'bg-white shadow-xs text-slate-900' : 'text-slate-500 hover:text-slate-900'}`}
            >
              <Dog className="w-3.5 h-3.5" /> Собачьи
            </button>
            <button
              onClick={() => setFilterType('cat')}
              className={`px-3 py-1.5 rounded-md transition-all flex items-center gap-1 ${filterType === 'cat' ? 'bg-white shadow-xs text-slate-900' : 'text-slate-500 hover:text-slate-900'}`}
            >
              <Cat className="w-3.5 h-3.5" /> Кошачьи
            </button>
          </div>

          <button
            onClick={onNewBooking}
            className="flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white px-3.5 py-2 rounded-lg text-xs font-semibold shadow-xs transition-colors"
          >
            <Plus className="w-4 h-4" />
            Новая бронь
          </button>
        </div>
      </div>

      {/* Chessboard / Matrix View */}
      <div className="bg-white rounded-xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="p-3 font-semibold text-slate-600 w-52 sticky left-0 bg-slate-50 z-10 border-r border-slate-200">
                  Номер / Бокс
                </th>
                {days.map((day, idx) => {
                  const isToday = day.toDateString() === today.toDateString();
                  return (
                    <th 
                      key={idx} 
                      className={`p-2 text-center min-w-[90px] border-r border-slate-200 ${
                        isToday ? 'bg-emerald-50/80 text-emerald-800 font-bold' : 'text-slate-600'
                      }`}
                    >
                      <div className="text-[10px] uppercase text-slate-400">
                        {day.toLocaleDateString('ru-RU', { weekday: 'short' })}
                      </div>
                      <div className="text-sm font-semibold">
                        {day.getDate()} {day.toLocaleDateString('ru-RU', { month: 'short' })}
                      </div>
                      {isToday && (
                        <span className="text-[9px] bg-emerald-600 text-white px-1.5 py-0.2 rounded-full inline-block mt-0.5">
                          Сегодня
                        </span>
                      )}
                    </th>
                  );
                })}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {filteredRooms.map(room => {
                const roomBookings = bookings.filter(b => b.roomId === room.id && b.status !== 'cancelled');

                return (
                  <tr key={room.id} className="hover:bg-slate-50/50 transition-colors">
                    {/* Room title & stats sticky column */}
                    <td className="p-3 sticky left-0 bg-white z-10 border-r border-slate-200 shadow-xs">
                      <div className="font-semibold text-slate-800">{room.name}</div>
                      <div className="text-[11px] text-slate-400 flex items-center justify-between mt-1">
                        <span>{room.category}</span>
                        <span className="font-semibold text-emerald-700">{room.pricePerDay} ₽/сут</span>
                      </div>
                    </td>

                    {/* Timeline grid columns */}
                    {days.map((day, dIdx) => {
                      const dayStr = day.toISOString().split('T')[0];
                      
                      // Check if there is an active booking on this date
                      const activeBooking = roomBookings.find(b => {
                        const start = b.startDate;
                        const end = b.endDate;
                        return dayStr >= start && dayStr <= end;
                      });

                      const isStart = activeBooking && activeBooking.startDate === dayStr;
                      const isCheckedIn = activeBooking?.status === 'checked_in';

                      return (
                        <td 
                          key={dIdx} 
                          className="p-1 border-r border-slate-100 h-16 align-middle text-center"
                        >
                          {activeBooking ? (
                            <div
                              onClick={() => setSelectedBooking(activeBooking)}
                              className={`p-1.5 rounded-lg text-left cursor-pointer transition-all shadow-xs border ${
                                isCheckedIn 
                                  ? 'bg-emerald-100/90 text-emerald-900 border-emerald-300 hover:bg-emerald-200' 
                                  : 'bg-blue-50 text-blue-900 border-blue-200 hover:bg-blue-100'
                              }`}
                            >
                              <div className="font-bold text-[11px] truncate flex items-center gap-1">
                                <span>{activeBooking.pet?.species === 'dog' ? '🐶' : '🐱'}</span>
                                {activeBooking.pet?.name || 'Питомец'}
                              </div>
                              <div className="text-[10px] text-slate-600 truncate">
                                {activeBooking.client?.name?.split(' ')[0] || 'Клиент'}
                              </div>
                            </div>
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-slate-200 hover:text-slate-400 text-lg">
                              •
                            </div>
                          )}
                        </td>
                      );
                    })}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Active Bookings List with Instant Check-in / Check-out */}
      <div className="bg-white rounded-xl border border-slate-200/80 p-5 shadow-xs">
        <h2 className="text-base font-bold text-slate-800 mb-4">Текущие и предстоящие бронирования</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {bookings.map(b => {
            const isCheckedIn = b.status === 'checked_in';
            const isConfirmed = b.status === 'confirmed';

            return (
              <div 
                key={b.id} 
                className={`p-4 rounded-xl border transition-all ${
                  isCheckedIn ? 'border-emerald-300 bg-emerald-50/20' : 'border-slate-200 bg-white'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3">
                    <img 
                      src={b.pet?.photoUrl || 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=100'} 
                      alt={b.pet?.name} 
                      className="w-12 h-12 rounded-xl object-cover border border-slate-200"
                    />
                    <div>
                      <div className="font-bold text-sm text-slate-800 flex items-center gap-1.5">
                        {b.pet?.name}
                        <span className="text-xs font-normal text-slate-400">({b.pet?.breed})</span>
                      </div>
                      <div className="text-xs text-slate-500 font-medium">
                        Владелец: {b.client?.name}
                      </div>
                    </div>
                  </div>
                  {getStatusBadge(b.status)}
                </div>

                <div className="mt-3 pt-3 border-t border-slate-100 text-xs space-y-1.5 text-slate-600">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Номер:</span>
                    <span className="font-semibold text-slate-700">{b.room?.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Период:</span>
                    <span className="font-medium text-slate-800">
                      {new Date(b.startDate).toLocaleDateString('ru-RU')} — {new Date(b.endDate).toLocaleDateString('ru-RU')} ({b.days} дн.)
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Стоимость:</span>
                    <span className="font-bold text-emerald-700">{b.totalAmount} ₽</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Оплачено:</span>
                    <span className="font-medium text-slate-700">{b.paidAmount} ₽</span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center gap-2">
                  {isConfirmed && (
                    <button
                      onClick={() => onCheckIn(b.id)}
                      className="w-full flex items-center justify-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold py-2 rounded-lg transition-colors shadow-xs"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      Заселить гостя
                    </button>
                  )}

                  {isCheckedIn && (
                    <button
                      onClick={() => onCheckOut(b.id)}
                      className="w-full flex items-center justify-center gap-1.5 bg-slate-800 hover:bg-slate-900 text-white text-xs font-semibold py-2 rounded-lg transition-colors shadow-xs"
                    >
                      <LogOut className="w-4 h-4" />
                      Оформить выезд
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
