import React, { useState } from 'react';
import { 
  Dog, 
  Cat, 
  Activity, 
  CheckCircle, 
  AlertTriangle, 
  Pill, 
  Thermometer, 
  Award, 
  Smile, 
  Heart,
  Plus,
  Send,
  ShieldCheck
} from 'lucide-react';

export default function SpecialistDesk({ 
  pets = [], 
  currentUser, 
  onUpdatePetNotes, 
  onAddTask 
}) {
  const [activeTab, setActiveTab] = useState(
    currentUser?.role === 'cynologist' ? 'cynologist' :
    currentUser?.role === 'felinologist' ? 'felinologist' :
    currentUser?.role === 'vet' ? 'vet' : 'cynologist'
  );

  const [selectedPet, setSelectedPet] = useState(null);
  const [noteInput, setNoteInput] = useState('');

  const dogs = pets.filter(p => p.species === 'dog');
  const cats = pets.filter(p => p.species === 'cat');

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-800">Кабинет профильных специалистов</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Дрессировочные планы кинолога, программы мягкой адаптации кошек и ветеринарный журнал
          </p>
        </div>

        {/* Tab Buttons */}
        <div className="flex bg-slate-100 p-1 rounded-xl text-xs font-medium">
          <button
            onClick={() => setActiveTab('cynologist')}
            className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
              activeTab === 'cynologist' ? 'bg-amber-500 text-white shadow-xs font-semibold' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Dog className="w-3.5 h-3.5" />
            Кинолог ({dogs.length})
          </button>
          <button
            onClick={() => setActiveTab('felinologist')}
            className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
              activeTab === 'felinologist' ? 'bg-pink-500 text-white shadow-xs font-semibold' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Cat className="w-3.5 h-3.5" />
            Фелинолог ({cats.length})
          </button>
          <button
            onClick={() => setActiveTab('vet')}
            className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
              activeTab === 'vet' ? 'bg-emerald-600 text-white shadow-xs font-semibold' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Activity className="w-3.5 h-3.5" />
            Ветеринарный врач
          </button>
        </div>
      </div>

      {/* 1. CYNOLOGIST TAB */}
      {activeTab === 'cynologist' && (
        <div className="space-y-4">
          <div className="bg-amber-50 border border-amber-200 p-4 rounded-xl text-xs text-amber-900 flex items-start space-x-3">
            <Award className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <div className="font-bold text-sm">Центр кинологических тренировок и коррекции поведения</div>
              <p className="mt-0.5 leading-relaxed">
                Фиксируйте прогресс занятий ОКД, отработку выдержки, уровень социализации и реакцию собак на внешние раздражители.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {dogs.map(dog => (
              <div key={dog.id} className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs space-y-3">
                <div className="flex items-center space-x-3">
                  <img src={dog.photoUrl} alt={dog.name} className="w-12 h-12 rounded-xl object-cover border border-slate-200" />
                  <div>
                    <h3 className="font-bold text-sm text-slate-800">{dog.name}</h3>
                    <p className="text-xs text-slate-500">{dog.breed} • {dog.age}</p>
                  </div>
                </div>

                <div className="bg-slate-50 p-3 rounded-lg text-xs space-y-1">
                  <div className="font-semibold text-slate-700">Особенности темперамента:</div>
                  <p className="text-slate-600">{dog.character}</p>
                </div>

                <div className="bg-amber-50/70 p-3 rounded-lg text-xs space-y-1 border border-amber-100">
                  <div className="font-semibold text-amber-900">Индивидуальный план кинолога:</div>
                  <p className="text-amber-800">{dog.cynologistNotes || 'План занятий составляется на вводной тренировке.'}</p>
                </div>

                <div className="pt-2 flex items-center justify-between text-xs">
                  <span className="text-slate-400">Владелец: {dog.clientName}</span>
                  <button
                    onClick={() => {
                      onAddTask({
                        title: `Занятие по дрессировке: ${dog.name}`,
                        description: `Отработка команд, концентрация внимания, поощрение лакомством`,
                        targetRole: 'cynologist',
                        petId: dog.id,
                        petName: `${dog.name} (${dog.breed})`,
                        roomId: 'r-201',
                        roomName: 'Тренировочный манеж',
                        scheduledTime: '15:00'
                      });
                      alert(`Напоминание о тренировке с собакой ${dog.name} добавлено в расписание!`);
                    }}
                    className="bg-amber-500 hover:bg-amber-600 text-white font-semibold px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    Назначить тренировку
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 2. FELINOLOGIST TAB */}
      {activeTab === 'felinologist' && (
        <div className="space-y-4">
          <div className="bg-pink-50 border border-pink-200 p-4 rounded-xl text-xs text-pink-900 flex items-start space-x-3">
            <Heart className="w-5 h-5 text-pink-600 shrink-0 mt-0.5" />
            <div>
              <div className="font-bold text-sm">Программа мягкой адаптации и мониторинг кошек</div>
              <p className="mt-0.5 leading-relaxed">
                Шкала уровня стресса FAS (Fear, Anxiety, Stress), контроль диффузоров с феромонами Feliway, укрытия на разных ярусах и контроль аппетита.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {cats.map(cat => (
              <div key={cat.id} className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs space-y-3">
                <div className="flex items-center space-x-3">
                  <img src={cat.photoUrl} alt={cat.name} className="w-12 h-12 rounded-xl object-cover border border-slate-200" />
                  <div>
                    <h3 className="font-bold text-sm text-slate-800">{cat.name}</h3>
                    <p className="text-xs text-slate-500">{cat.breed} • {cat.age}</p>
                  </div>
                </div>

                <div className="bg-slate-50 p-3 rounded-lg text-xs space-y-1">
                  <div className="font-semibold text-slate-700">Поведение и характер:</div>
                  <p className="text-slate-600">{cat.character}</p>
                </div>

                <div className="bg-pink-50/70 p-3 rounded-lg text-xs space-y-1 border border-pink-100">
                  <div className="font-semibold text-pink-900">Протокол адаптации фелинолога:</div>
                  <p className="text-pink-800">{cat.felinologistNotes || 'Рекомендовано тихое обращение и адаптационный период.'}</p>
                </div>

                <div className="pt-2 flex items-center justify-between text-xs">
                  <span className="text-slate-400">Владелец: {cat.clientName}</span>
                  <button
                    onClick={() => {
                      onAddTask({
                        title: `Адаптационный сеанс: ${cat.name}`,
                        description: `Проверка диффузора Feliway, бережный контакт, лакомство`,
                        targetRole: 'felinologist',
                        petId: cat.id,
                        petName: `${cat.name} (${cat.breed})`,
                        roomId: 'r-101',
                        roomName: 'Кошачий сектор',
                        scheduledTime: '16:30'
                      });
                      alert(`Напоминание об адаптационном сеансе с кошкой ${cat.name} добавлено!`);
                    }}
                    className="bg-pink-500 hover:bg-pink-600 text-white font-semibold px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    Назначить сеанс
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 3. VETERINARIAN TAB */}
      {activeTab === 'vet' && (
        <div className="space-y-4">
          <div className="bg-emerald-50 border border-emerald-200 p-4 rounded-xl text-xs text-emerald-900 flex items-start space-x-3">
            <Activity className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
            <div>
              <div className="font-bold text-sm">Ветеринарный контроль и лист назначений</div>
              <p className="mt-0.5 leading-relaxed">
                Первичные осмотры при заселении, мониторинг срока действия вакцин от бешенства, обработка от экто- и эндопаразитов.
              </p>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
            <div className="p-4 border-b border-slate-100 font-bold text-sm text-slate-800">
              Сводная медицинская ведомость питомцев в гостинице
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold">
                  <tr>
                    <th className="p-3">Питомец</th>
                    <th className="p-3">Чип / Клеймо</th>
                    <th className="p-3">Вакцинация (бешенство)</th>
                    <th className="p-3">Аллергии и диета</th>
                    <th className="p-3">Медикаменты</th>
                    <th className="p-3 text-right">Действие</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {pets.map(p => {
                    const hasAllergy = p.diet && p.diet.toLowerCase().includes('аллерг');
                    return (
                      <tr key={p.id} className="hover:bg-slate-50/60">
                        <td className="p-3 flex items-center space-x-2.5">
                          <img src={p.photoUrl} alt={p.name} className="w-8 h-8 rounded-full object-cover border" />
                          <div>
                            <div className="font-bold text-slate-800">{p.name}</div>
                            <div className="text-[11px] text-slate-400">{p.breed}</div>
                          </div>
                        </td>
                        <td className="p-3 font-mono text-[11px] text-slate-600">
                          {p.chipNumber || 'Нет чипа'}
                        </td>
                        <td className="p-3">
                          <span className="bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded font-medium">
                            {p.rabiesVaccine || 'Привит'}
                          </span>
                        </td>
                        <td className="p-3">
                          <span className={hasAllergy ? 'text-rose-600 font-semibold' : 'text-slate-600'}>
                            {p.diet}
                          </span>
                        </td>
                        <td className="p-3">
                          {p.medications ? (
                            <span className="bg-blue-50 text-blue-700 px-2 py-0.5 rounded font-medium">
                              {p.medications}
                            </span>
                          ) : (
                            <span className="text-slate-400">—</span>
                          )}
                        </td>
                        <td className="p-3 text-right">
                          <button
                            onClick={() => {
                              onAddTask({
                                title: `Вет-осмотр и термометрия: ${p.name}`,
                                description: `Контроль состояния здоровья, слизистых, измерение температуры`,
                                targetRole: 'vet',
                                petId: p.id,
                                petName: `${p.name} (${p.breed})`,
                                roomId: 'r-301',
                                roomName: 'Вет-кабинет',
                                scheduledTime: '12:00'
                              });
                              alert(`Осмотр питомца ${p.name} добавлен в лист задач ветеринара!`);
                            }}
                            className="bg-emerald-600 hover:bg-emerald-700 text-white font-medium px-2.5 py-1 rounded-lg text-[11px]"
                          >
                            + Осмотр
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
