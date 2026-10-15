import React from 'react';
import { 
  Sparkles, 
  Dog, 
  Cat, 
  Calendar, 
  Clock, 
  ShieldCheck, 
  MessageSquare, 
  Heart, 
  CheckCircle,
  Plus
} from 'lucide-react';

export default function ClientPortal({ 
  currentUser, 
  pets = [], 
  bookings = [], 
  onNavigateTab, 
  onNewBooking 
}) {
  // Find client's pets (matches clientId or client name)
  const myPets = pets.filter(p => p.clientId === 'c-1' || (p.clientName && p.clientName.includes('Иван')));
  const myBookings = bookings.filter(b => b.clientId === 'c-1' || myPets.some(p => p.id === b.petId));

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-700 rounded-2xl p-6 text-white shadow-lg flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-emerald-200 text-xs font-semibold uppercase tracking-wider">
            <Sparkles className="w-4 h-4 text-amber-300" />
            Личный кабинет владельца питомца
          </div>
          <h1 className="text-2xl font-bold mt-1">Здравствуйте, {currentUser?.name || 'Иван'}!</h1>
          <p className="text-emerald-100 text-xs mt-1 max-w-xl leading-relaxed">
            Здесь вы можете в реальном времени следить за самочувствием вашего любимца в ZooHotel, просматривать фотоотчеты от зооняни и бронировать номера на следующие даты.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onNewBooking}
            className="bg-white text-emerald-800 hover:bg-emerald-50 px-4 py-2 rounded-xl text-xs font-bold shadow-md transition-all flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4 text-emerald-600" />
            Забронировать номер
          </button>
          <button
            onClick={() => onNavigateTab('whatsapp')}
            className="bg-emerald-800/80 hover:bg-emerald-800 text-white px-4 py-2 rounded-xl text-xs font-semibold shadow-xs transition-all flex items-center gap-1.5 border border-emerald-500/50"
          >
            <MessageSquare className="w-4 h-4 text-emerald-300" />
            Чат в WhatsApp
          </button>
        </div>
      </div>

      {/* Active Stays Section */}
      <div>
        <h2 className="text-base font-bold text-slate-800 mb-3 flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
          Текущее проживание в отеле
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {myBookings.filter(b => b.status === 'checked_in').map(b => (
            <div key={b.id} className="bg-white rounded-xl border border-emerald-300/80 p-5 shadow-xs bg-emerald-50/10 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <img 
                    src={b.pet?.photoUrl} 
                    alt={b.pet?.name} 
                    className="w-14 h-14 rounded-2xl object-cover border-2 border-emerald-200 shadow-xs"
                  />
                  <div>
                    <h3 className="font-bold text-base text-slate-800">{b.pet?.name}</h3>
                    <p className="text-xs text-slate-500">{b.pet?.breed}</p>
                    <span className="inline-block bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-full mt-1">
                      Сейчас в гостинице • Номер {b.room?.name}
                    </span>
                  </div>
                </div>
              </div>

              <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 text-xs space-y-1.5">
                <div className="flex justify-between text-slate-600">
                  <span className="text-slate-400">Период проживания:</span>
                  <span className="font-semibold text-slate-800">
                    с {new Date(b.startDate).toLocaleDateString('ru-RU')} по {new Date(b.endDate).toLocaleDateString('ru-RU')}
                  </span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span className="text-slate-400">Рацион:</span>
                  <span className="text-slate-700">{b.pet?.diet}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span className="text-slate-400">Назначенный куратор:</span>
                  <span className="font-medium text-emerald-700">Мария Ковалева (Зооняня)</span>
                </div>
              </div>

              {/* Status / Quick Report */}
              <div className="p-3 bg-white rounded-xl border border-emerald-100 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2 text-slate-700">
                  <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Утреннее кормление и прогулка завершены по графику</span>
                </div>
                <button
                  onClick={() => onNavigateTab('whatsapp')}
                  className="text-emerald-700 font-semibold hover:underline text-[11px] whitespace-nowrap ml-2"
                >
                  Фотоотчет в чате →
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* My Pets Grid */}
      <div>
        <h2 className="text-base font-bold text-slate-800 mb-3">Мои питомцы в системе</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {myPets.map(pet => (
            <div key={pet.id} className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs flex items-center space-x-4">
              <img 
                src={pet.photoUrl} 
                alt={pet.name} 
                className="w-16 h-16 rounded-xl object-cover border border-slate-200"
              />
              <div className="space-y-1 flex-1">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-sm text-slate-800">{pet.name}</h3>
                  <span className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full">
                    {pet.species === 'dog' ? '🐶 Собака' : '🐱 Кошка'}
                  </span>
                </div>
                <p className="text-xs text-slate-500">{pet.breed} • {pet.age}</p>
                <div className="text-[11px] text-slate-600 truncate">
                  Вакцинация: до {pet.vaccinationExpiry}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
