import React from 'react';
import { 
  Building2, 
  Calendar, 
  CheckSquare, 
  MessageSquare, 
  DollarSign, 
  TrendingUp, 
  Dog, 
  Cat, 
  AlertCircle,
  PlusCircle,
  Clock
} from 'lucide-react';

export default function DashboardOverview({ 
  stats, 
  rooms = [], 
  tasks = [], 
  bookings = [], 
  onNavigateTab, 
  onNewBooking 
}) {
  const occupiedRooms = rooms.filter(r => r.status === 'occupied');
  const availableRooms = rooms.filter(r => r.status === 'available');
  const cleaningRooms = rooms.filter(r => r.status === 'cleaning');

  return (
    <div className="space-y-6">
      {/* Top Banner & Quick Actions */}
      <div className="bg-gradient-to-r from-emerald-600 to-teal-700 rounded-2xl p-6 text-white shadow-lg flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Панель управления ZooHotel</h1>
          <p className="text-emerald-100 text-sm mt-1">
            Оперативная сводка гостиницы для животных: загрузка номеров, текущие гости и дежурные задачи
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={onNewBooking}
            className="flex items-center gap-2 bg-white text-emerald-700 hover:bg-emerald-50 px-4 py-2.5 rounded-xl font-semibold text-sm transition-all shadow-md active:scale-95"
          >
            <PlusCircle className="w-4 h-4 text-emerald-600" />
            Оформить бронирование
          </button>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Occupancy Card */}
        <div className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">Загрузка отеля</p>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-2xl font-bold text-slate-800">{stats?.occupancyRate || 0}%</span>
              <span className="text-xs text-slate-500 font-medium">({occupiedRooms.length} из {rooms.length} мест)</span>
            </div>
            <div className="w-full bg-slate-100 rounded-full h-1.5 mt-3">
              <div 
                className="bg-emerald-500 h-1.5 rounded-full transition-all duration-500" 
                style={{ width: `${stats?.occupancyRate || 0}%` }}
              />
            </div>
          </div>
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <Building2 className="w-6 h-6" />
          </div>
        </div>

        {/* Current Guests Card */}
        <div className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">Питомцев в отеле</p>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-2xl font-bold text-slate-800">{stats?.activeCheckIns || 0}</span>
              <span className="text-xs text-emerald-600 font-medium font-mono">на передержке</span>
            </div>
            <p className="text-xs text-slate-400 mt-2 flex items-center gap-1">
              <Dog className="w-3.5 h-3.5 text-slate-400" /> Собаки и <Cat className="w-3.5 h-3.5 text-slate-400" /> Кошки
            </p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center">
            <Dog className="w-6 h-6" />
          </div>
        </div>

        {/* Tasks Pending */}
        <div 
          onClick={() => onNavigateTab('tasks')}
          className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-xs flex items-center justify-between cursor-pointer hover:border-amber-300 transition-all"
        >
          <div>
            <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">Задачи смены</p>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-2xl font-bold text-amber-600">{stats?.pendingTasks || 0}</span>
              <span className="text-xs text-slate-500">к исполнению</span>
            </div>
            <p className="text-xs text-slate-400 mt-2 flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-amber-500" /> Кормления, выгул, вет-осмотр
            </p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
            <CheckSquare className="w-6 h-6" />
          </div>
        </div>

        {/* WhatsApp & Revenue */}
        <div 
          onClick={() => onNavigateTab('whatsapp')}
          className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-xs flex items-center justify-between cursor-pointer hover:border-emerald-300 transition-all"
        >
          <div>
            <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">WhatsApp Чат</p>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-2xl font-bold text-emerald-600">{stats?.unreadMessages || 0}</span>
              <span className="text-xs text-slate-500">непрочитанных</span>
            </div>
            <p className="text-xs text-emerald-700 font-medium mt-2 flex items-center gap-1">
              Авто-отчеты активны
            </p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <MessageSquare className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Two Column Layout: Current Rooms Grid & Shift Checklist */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left: Rooms Status Overview */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200/80 p-5 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-base font-bold text-slate-800">Текущая занятость номеров</h2>
              <p className="text-xs text-slate-500">Статус номеров и находящиеся в них питомцы</p>
            </div>
            <button
              onClick={() => onNavigateTab('chessboard')}
              className="text-xs font-medium text-emerald-600 hover:text-emerald-700 bg-emerald-50 px-2.5 py-1.5 rounded-lg"
            >
              Открыть шахматку →
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {rooms.map(room => {
              const isOccupied = room.status === 'occupied';
              const isCleaning = room.status === 'cleaning';
              return (
                <div 
                  key={room.id}
                  className={`p-4 rounded-xl border transition-all ${
                    isOccupied 
                      ? 'border-emerald-200 bg-emerald-50/30' 
                      : isCleaning 
                      ? 'border-amber-200 bg-amber-50/30' 
                      : 'border-slate-200 bg-white hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="font-semibold text-sm text-slate-800">{room.name}</div>
                      <span className="text-xs text-slate-400">{room.typeLabel} • {room.category}</span>
                    </div>
                    <span className={`text-[11px] font-medium px-2 py-0.5 rounded-full ${
                      isOccupied 
                        ? 'bg-emerald-100 text-emerald-800' 
                        : isCleaning 
                        ? 'bg-amber-100 text-amber-800' 
                        : 'bg-slate-100 text-slate-600'
                    }`}>
                      {isOccupied ? 'Заселен' : isCleaning ? 'Уборка' : 'Свободен'}
                    </span>
                  </div>

                  {isOccupied && room.currentPet ? (
                    <div className="mt-3 pt-3 border-t border-emerald-100 flex items-center space-x-3">
                      <img 
                        src={room.currentPet.photoUrl} 
                        alt={room.currentPet.name} 
                        className="w-10 h-10 rounded-full object-cover border border-emerald-200 shadow-xs"
                      />
                      <div>
                        <div className="text-xs font-bold text-slate-800 flex items-center gap-1">
                          {room.currentPet.name}
                          <span className="text-[10px] text-slate-400 font-normal">({room.currentPet.breed})</span>
                        </div>
                        <div className="text-[11px] text-emerald-700 font-medium">
                          До {room.currentBooking ? new Date(room.currentBooking.endDate).toLocaleDateString('ru-RU') : 'конца смены'}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                      <span>Стоимость в сутки:</span>
                      <span className="font-semibold text-slate-700">{room.pricePerDay} ₽</span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Urgent Reminders for Staff */}
        <div className="bg-white rounded-xl border border-slate-200/80 p-5 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-base font-bold text-slate-800">Ближайшие задачи</h2>
              <p className="text-xs text-slate-500">Расписание ухода на сегодня</p>
            </div>
            <button
              onClick={() => onNavigateTab('tasks')}
              className="text-xs font-medium text-emerald-600 hover:text-emerald-700 bg-emerald-50 px-2.5 py-1.5 rounded-lg"
            >
              Все задачи ({tasks.length})
            </button>
          </div>

          <div className="space-y-3">
            {tasks.slice(0, 5).map(task => {
              const isDone = task.status === 'completed';
              return (
                <div 
                  key={task.id}
                  className={`p-3 rounded-lg border text-xs transition-all ${
                    isDone 
                      ? 'bg-slate-50 border-slate-200 opacity-60' 
                      : 'bg-white border-slate-200/90 hover:border-emerald-300'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <span className="font-semibold text-slate-800 leading-snug">{task.title}</span>
                    <span className="font-mono text-emerald-700 font-bold bg-emerald-50 px-1.5 py-0.5 rounded ml-2">
                      {task.scheduledTime}
                    </span>
                  </div>
                  <p className="text-slate-500 mt-1 line-clamp-1">{task.description}</p>
                  <div className="mt-2 flex items-center justify-between text-[11px] text-slate-400">
                    <span>Питомец: <strong className="text-slate-700">{task.petName}</strong></span>
                    <span className={`px-1.5 py-0.5 rounded font-medium ${
                      isDone ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
                    }`}>
                      {isDone ? 'Выполнено' : 'Ожидает'}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </div>
  );
}
