import React, { useState } from 'react';
import { 
  Dog, 
  Cat, 
  Search, 
  Plus, 
  ShieldAlert, 
  Activity, 
  Utensils, 
  Pill, 
  Smile, 
  Phone, 
  Calendar,
  CheckCircle,
  FileText
} from 'lucide-react';

export default function PetsManagement({ 
  pets = [], 
  onNewPet, 
  onEditPet 
}) {
  const [search, setSearch] = useState('');
  const [speciesFilter, setSpeciesFilter] = useState('all');
  const [selectedPet, setSelectedPet] = useState(null);

  const filteredPets = pets.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase()) ||
                          p.breed.toLowerCase().includes(search.toLowerCase()) ||
                          (p.clientName && p.clientName.toLowerCase().includes(search.toLowerCase()));
    const matchesSpecies = speciesFilter === 'all' || p.species === speciesFilter;
    return matchesSearch && matchesSpecies;
  });

  return (
    <div className="space-y-6">
      {/* Header & Search */}
      <div className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-800">Реестр питомцев и ветеринарные карточки</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Учет рациона питания, прививок, характера и индивидуальных рекомендаций специалистов
          </p>
        </div>

        <button
          onClick={onNewPet}
          className="flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white px-3.5 py-2 rounded-lg text-xs font-semibold shadow-xs transition-colors"
        >
          <Plus className="w-4 h-4" />
          Зарегистрировать питомца
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            placeholder="Поиск по кличке, породе или владельцу..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-white rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
          />
        </div>

        <div className="flex bg-white p-1 rounded-xl border border-slate-200 text-xs font-medium">
          <button
            onClick={() => setSpeciesFilter('all')}
            className={`px-3 py-1.5 rounded-lg transition-all ${speciesFilter === 'all' ? 'bg-emerald-50 text-emerald-700 font-semibold' : 'text-slate-600 hover:text-slate-900'}`}
          >
            Все ({pets.length})
          </button>
          <button
            onClick={() => setSpeciesFilter('dog')}
            className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1 ${speciesFilter === 'dog' ? 'bg-emerald-50 text-emerald-700 font-semibold' : 'text-slate-600 hover:text-slate-900'}`}
          >
            <Dog className="w-3.5 h-3.5" /> Собаки
          </button>
          <button
            onClick={() => setSpeciesFilter('cat')}
            className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1 ${speciesFilter === 'cat' ? 'bg-emerald-50 text-emerald-700 font-semibold' : 'text-slate-600 hover:text-slate-900'}`}
          >
            <Cat className="w-3.5 h-3.5" /> Кошки
          </button>
        </div>
      </div>

      {/* Pets Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredPets.map(pet => {
          const hasAllergy = pet.diet && pet.diet.toLowerCase().includes('аллерг');
          return (
            <div 
              key={pet.id} 
              className="bg-white rounded-xl border border-slate-200/80 shadow-xs overflow-hidden hover:border-slate-300 transition-all flex flex-col justify-between"
            >
              <div>
                {/* Photo and Primary Info */}
                <div className="relative h-44 bg-slate-100 overflow-hidden">
                  <img 
                    src={pet.photoUrl} 
                    alt={pet.name} 
                    className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                  />
                  <div className="absolute top-3 left-3 flex gap-1">
                    <span className="bg-slate-900/75 backdrop-blur-xs text-white text-[11px] font-medium px-2 py-0.5 rounded-full flex items-center gap-1">
                      {pet.species === 'dog' ? <Dog className="w-3 h-3 text-amber-300" /> : <Cat className="w-3 h-3 text-pink-300" />}
                      {pet.speciesLabel}
                    </span>
                    {hasAllergy && (
                      <span className="bg-rose-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 shadow-sm">
                        <ShieldAlert className="w-3 h-3" /> Аллергия
                      </span>
                    )}
                  </div>
                  <div className="absolute bottom-2 right-2 bg-white/90 backdrop-blur-xs text-slate-800 text-[10px] font-mono px-2 py-0.5 rounded-md shadow-xs">
                    Чип: {pet.chipNumber || 'Не чипирован'}
                  </div>
                </div>

                {/* Content Details */}
                <div className="p-4 space-y-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-bold text-base text-slate-800">{pet.name}</h3>
                      <p className="text-xs text-slate-500">{pet.breed} • {pet.age}</p>
                    </div>
                    <span className="text-xs text-slate-400 font-medium bg-slate-50 px-2 py-0.5 rounded border border-slate-100">
                      {pet.gender === 'male' ? 'Кобель / Самец' : 'Сука / Самка'}
                    </span>
                  </div>

                  {/* Owner info */}
                  <div className="bg-slate-50 p-2.5 rounded-lg text-xs space-y-1 border border-slate-100">
                    <div className="flex items-center justify-between text-slate-600">
                      <span className="text-slate-400">Владелец:</span>
                      <span className="font-semibold text-slate-800">{pet.clientName}</span>
                    </div>
                    {pet.clientPhone && (
                      <div className="flex items-center justify-between text-slate-600">
                        <span className="text-slate-400">Телефон:</span>
                        <span className="font-mono text-emerald-700">{pet.clientPhone}</span>
                      </div>
                    )}
                  </div>

                  {/* Feeding & Diet */}
                  <div className="text-xs space-y-1">
                    <div className="flex items-center gap-1.5 font-semibold text-slate-700">
                      <Utensils className="w-3.5 h-3.5 text-amber-600" />
                      <span>Рацион и диета:</span>
                    </div>
                    <p className={`text-[11px] p-2 rounded-lg leading-relaxed ${
                      hasAllergy ? 'bg-rose-50 text-rose-900 border border-rose-100' : 'bg-slate-50 text-slate-600'
                    }`}>
                      {pet.diet || 'Обычное кормление'}
                    </p>
                  </div>

                  {/* Medications if any */}
                  {pet.medications && (
                    <div className="text-xs space-y-1">
                      <div className="flex items-center gap-1.5 font-semibold text-slate-700">
                        <Pill className="w-3.5 h-3.5 text-blue-600" />
                        <span>Медикаменты и витамины:</span>
                      </div>
                      <p className="text-[11px] bg-blue-50 text-blue-900 p-2 rounded-lg leading-relaxed border border-blue-100">
                        {pet.medications}
                      </p>
                    </div>
                  )}

                  {/* Vaccine info */}
                  <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1 border-t border-slate-100">
                    <span>Вакцинация действует:</span>
                    <span className="font-medium text-emerald-700 flex items-center gap-1">
                      <CheckCircle className="w-3 h-3 text-emerald-600" />
                      до {pet.vaccinationExpiry || '2027'}
                    </span>
                  </div>
                </div>
              </div>

              {/* View full card action */}
              <div className="p-4 pt-0">
                <button
                  onClick={() => setSelectedPet(pet)}
                  className="w-full text-center text-xs font-semibold text-slate-700 hover:text-emerald-700 hover:bg-emerald-50 py-2 rounded-lg border border-slate-200 transition-colors"
                >
                  Открыть полную медкарту
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal: Full Pet Card & Vet / Cynologist / Felinologist logs */}
      {selectedPet && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-start justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <img 
                  src={selectedPet.photoUrl} 
                  alt={selectedPet.name} 
                  className="w-14 h-14 rounded-xl object-cover border border-slate-200"
                />
                <div>
                  <h2 className="text-lg font-bold text-slate-800">{selectedPet.name}</h2>
                  <p className="text-xs text-slate-500">{selectedPet.breed} • {selectedPet.age} • Владелец: {selectedPet.clientName}</p>
                </div>
              </div>
              <button 
                onClick={() => setSelectedPet(null)}
                className="text-slate-400 hover:text-slate-600 text-lg font-bold p-1"
              >
                ✕
              </button>
            </div>

            {/* Specialist Notes Section */}
            <div className="space-y-3 text-xs">
              <div className="bg-emerald-50/60 p-3.5 rounded-xl border border-emerald-100">
                <div className="font-bold text-emerald-900 flex items-center gap-1.5 mb-1">
                  <Activity className="w-4 h-4 text-emerald-700" />
                  Заключение ветеринарного врача:
                </div>
                <p className="text-emerald-800 leading-relaxed">
                  {selectedPet.vetNotes || 'Первичный осмотр пройден без патологий. Питомец здоров.'}
                </p>
                <div className="mt-2 text-[11px] text-emerald-700/80">
                  Вакцина: {selectedPet.rabiesVaccine || 'Комплексная'} • Обработка от паразитов: {selectedPet.parasiteTreatmentDate || 'Сентябрь 2026'}
                </div>
              </div>

              {selectedPet.cynologistNotes && (
                <div className="bg-amber-50/60 p-3.5 rounded-xl border border-amber-100">
                  <div className="font-bold text-amber-900 flex items-center gap-1.5 mb-1">
                    <Dog className="w-4 h-4 text-amber-700" />
                    Заметки и программа кинолога:
                  </div>
                  <p className="text-amber-800 leading-relaxed">
                    {selectedPet.cynologistNotes}
                  </p>
                </div>
              )}

              {selectedPet.felinologistNotes && (
                <div className="bg-pink-50/60 p-3.5 rounded-xl border border-pink-100">
                  <div className="font-bold text-pink-900 flex items-center gap-1.5 mb-1">
                    <Cat className="w-4 h-4 text-pink-700" />
                    Заметки фелинолога по адаптации и поведению:
                  </div>
                  <p className="text-pink-800 leading-relaxed">
                    {selectedPet.felinologistNotes}
                  </p>
                </div>
              )}

              <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200/80">
                <div className="font-bold text-slate-800 flex items-center gap-1.5 mb-1">
                  <Smile className="w-4 h-4 text-slate-600" />
                  Психологический портрет и привычки:
                </div>
                <p className="text-slate-600 leading-relaxed">
                  {selectedPet.character || 'Дружелюбный, спокойный.'}
                </p>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex justify-end">
              <button
                onClick={() => setSelectedPet(null)}
                className="bg-slate-800 hover:bg-slate-900 text-white text-xs font-semibold px-4 py-2 rounded-xl transition-colors"
              >
                Закрыть карточку
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
