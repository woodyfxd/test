import React, { useState } from 'react';
import { X, Dog, Cat, ShieldAlert, Sparkles } from 'lucide-react';

const PRESET_PHOTOS = {
  dog: 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=400',
  cat: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=400'
};

export default function NewPetModal({ isOpen, onClose, onSave, clients = [] }) {
  if (!isOpen) return null;

  const [name, setName] = useState('');
  const [species, setSpecies] = useState('dog');
  const [breed, setBreed] = useState('');
  const [gender, setGender] = useState('male');
  const [age, setAge] = useState('');
  const [chipNumber, setChipNumber] = useState('');
  const [diet, setDiet] = useState('');
  const [medications, setMedications] = useState('');
  const [character, setCharacter] = useState('');
  const [vaccinationExpiry, setVaccinationExpiry] = useState('2027-06-01');
  const [rabiesVaccine, setRabiesVaccine] = useState('Nobivac Rabies');
  const [photoUrl, setPhotoUrl] = useState(PRESET_PHOTOS.dog);
  const [clientId, setClientId] = useState(clients[0]?.id || '');
  const [clientName, setClientName] = useState('');
  const [clientPhone, setClientPhone] = useState('');

  const handleSpeciesChange = (sp) => {
    setSpecies(sp);
    setPhotoUrl(PRESET_PHOTOS[sp] || PRESET_PHOTOS.dog);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({
      name,
      species,
      breed: breed || (species === 'dog' ? 'Метис' : 'Европейская короткошерстная'),
      gender,
      age: age || '2 года',
      chipNumber,
      diet: diet || 'Стандартный рацион',
      medications,
      character: character || 'Спокойный, социализированный',
      vaccinationExpiry,
      rabiesVaccine,
      photoUrl,
      clientId: clientId || 'c-1',
      clientName: clientName || 'Новый клиент',
      clientPhone: clientPhone || '+7 (999) 000-00-00'
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-start justify-between pb-3 border-b border-slate-100">
          <div>
            <h2 className="text-lg font-bold text-slate-800">Регистрация нового питомца</h2>
            <p className="text-xs text-slate-500">Заполнение ветеринарного профиля и рациона питания</p>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 font-bold p-1">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          {/* Species Select */}
          <div>
            <label className="block font-semibold text-slate-700 mb-1">Вид животного:</label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => handleSpeciesChange('dog')}
                className={`p-2.5 rounded-xl border flex items-center justify-center gap-2 font-medium transition-all ${
                  species === 'dog' ? 'border-emerald-600 bg-emerald-50 text-emerald-800 font-bold' : 'border-slate-200 text-slate-600'
                }`}
              >
                <Dog className="w-4 h-4" /> Собака
              </button>
              <button
                type="button"
                onClick={() => handleSpeciesChange('cat')}
                className={`p-2.5 rounded-xl border flex items-center justify-center gap-2 font-medium transition-all ${
                  species === 'cat' ? 'border-emerald-600 bg-emerald-50 text-emerald-800 font-bold' : 'border-slate-200 text-slate-600'
                }`}
              >
                <Cat className="w-4 h-4" /> Кошка
              </button>
            </div>
          </div>

          {/* Name & Breed */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Кличка питомца *</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Например: Арчи"
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-emerald-500 font-medium"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Порода</label>
              <input
                type="text"
                value={breed}
                onChange={(e) => setBreed(e.target.value)}
                placeholder="Например: Лабрадор"
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          {/* Gender & Age */}
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Пол</label>
              <select
                value={gender}
                onChange={(e) => setGender(e.target.value)}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-emerald-500"
              >
                <option value="male">Самец / Кобель</option>
                <option value="female">Самка / Сука</option>
              </select>
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Возраст</label>
              <input
                type="text"
                value={age}
                onChange={(e) => setAge(e.target.value)}
                placeholder="2 года"
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-emerald-500"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Номер микрочипа</label>
              <input
                type="text"
                value={chipNumber}
                onChange={(e) => setChipNumber(e.target.value)}
                placeholder="643098..."
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-emerald-500 font-mono"
              />
            </div>
          </div>

          {/* Diet & Allergies */}
          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Рацион кормления & Аллергии:
            </label>
            <textarea
              rows={2}
              value={diet}
              onChange={(e) => setDiet(e.target.value)}
              placeholder="Марка корма, граммовка, кратность кормления. Укажите, если есть аллергия (например: Аллергия на курицу!)"
              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-emerald-500"
            />
          </div>

          {/* Medications */}
          <div>
            <label className="block font-semibold text-slate-700 mb-1">Медикаменты или витамины:</label>
            <input
              type="text"
              value={medications}
              onChange={(e) => setMedications(e.target.value)}
              placeholder="Название препарата, дозировка и время приема"
              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-emerald-500"
            />
          </div>

          {/* Vaccine Date & Photo */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Срок действия прививки:</label>
              <input
                type="date"
                value={vaccinationExpiry}
                onChange={(e) => setVaccinationExpiry(e.target.value)}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-emerald-500"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Ссылка на фото:</label>
              <input
                type="text"
                value={photoUrl}
                onChange={(e) => setPhotoUrl(e.target.value)}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          {/* Owner details */}
          <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 space-y-2">
            <span className="font-semibold text-slate-800">Данные владельца:</span>
            <div className="grid grid-cols-2 gap-2">
              <input
                type="text"
                placeholder="ФИО владельца"
                value={clientName}
                onChange={(e) => setClientName(e.target.value)}
                className="p-2 bg-white border border-slate-200 rounded-lg text-xs"
              />
              <input
                type="text"
                placeholder="Телефон WhatsApp"
                value={clientPhone}
                onChange={(e) => setClientPhone(e.target.value)}
                className="p-2 bg-white border border-slate-200 rounded-lg text-xs"
              />
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
              Сохранить карточку питомца
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
