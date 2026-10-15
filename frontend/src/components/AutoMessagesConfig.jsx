import React, { useState } from 'react';
import { 
  Sliders, 
  Check, 
  Sparkles, 
  Save, 
  Clock, 
  MessageSquare, 
  Info, 
  ToggleLeft, 
  ToggleRight 
} from 'lucide-react';

export default function AutoMessagesConfig({ 
  templates = [], 
  onUpdateTemplate 
}) {
  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState('');
  const [successSavedId, setSuccessSavedId] = useState(null);

  const handleStartEdit = (tpl) => {
    setEditingId(tpl.id);
    setEditText(tpl.textTemplate);
  };

  const handleSave = (tpl) => {
    onUpdateTemplate(tpl.id, {
      ...tpl,
      textTemplate: editText
    });
    setEditingId(null);
    setSuccessSavedId(tpl.id);
    setTimeout(() => setSuccessSavedId(null), 3000);
  };

  const handleToggle = (tpl) => {
    onUpdateTemplate(tpl.id, {
      ...tpl,
      enabled: !tpl.enabled
    });
  };

  const availableTags = [
    { tag: '{{clientName}}', desc: 'Имя клиента' },
    { tag: '{{petName}}', desc: 'Кличка питомца' },
    { tag: '{{roomName}}', desc: 'Название номера' },
    { tag: '{{startDate}}', desc: 'Дата заезда' },
    { tag: '{{endDate}}', desc: 'Дата выезда' },
    { tag: '{{totalAmount}}', desc: 'Сумма бронирования' }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-800">Автоматические сообщения WhatsApp</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Настройка триггеров и шаблонов для автоотправки сообщений владельцам животных
          </p>
        </div>

        <div className="bg-emerald-50 text-emerald-800 px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 border border-emerald-200">
          <Sparkles className="w-4 h-4 text-emerald-600" />
          Все триггеры отправляются без задержек
        </div>
      </div>

      {/* Available Variables Hint */}
      <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs">
        <div className="font-semibold text-slate-700 flex items-center gap-1.5 mb-2">
          <Info className="w-4 h-4 text-blue-500" />
          Доступные переменные для подстановки в шаблоны:
        </div>
        <div className="flex flex-wrap gap-2">
          {availableTags.map((item, idx) => (
            <span key={idx} className="bg-white border border-slate-200 px-2 py-1 rounded-md text-slate-600">
              <code className="text-emerald-700 font-bold">{item.tag}</code> — {item.desc}
            </span>
          ))}
        </div>
      </div>

      {/* Templates List */}
      <div className="space-y-4">
        {templates.map(tpl => {
          const isEditing = editingId === tpl.id;
          const isJustSaved = successSavedId === tpl.id;

          return (
            <div 
              key={tpl.id}
              className={`p-5 rounded-xl border transition-all bg-white ${
                tpl.enabled ? 'border-slate-200/90 shadow-xs' : 'border-slate-200 bg-slate-50/50 opacity-60'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
                <div className="flex items-center space-x-3">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                    tpl.enabled ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-200 text-slate-400'
                  }`}>
                    <MessageSquare className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-slate-800">{tpl.name}</h3>
                    <span className="text-[11px] text-slate-400 font-mono">Триггер: {tpl.trigger}</span>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <button
                    onClick={() => handleToggle(tpl)}
                    className={`flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors ${
                      tpl.enabled 
                        ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200' 
                        : 'bg-slate-200 text-slate-600 hover:bg-slate-300'
                    }`}
                  >
                    {tpl.enabled ? 'Включено' : 'Выключено'}
                  </button>

                  {!isEditing && (
                    <button
                      onClick={() => handleStartEdit(tpl)}
                      className="text-xs font-medium text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 px-2.5 py-1.5 rounded-lg"
                    >
                      Редактировать
                    </button>
                  )}
                </div>
              </div>

              {/* Template Body */}
              <div className="mt-4">
                {isEditing ? (
                  <div className="space-y-3">
                    <textarea
                      rows={3}
                      value={editText}
                      onChange={(e) => setEditText(e.target.value)}
                      className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-emerald-500 focus:bg-white"
                    />

                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => setEditingId(null)}
                        className="px-3 py-1.5 text-xs text-slate-600 hover:bg-slate-100 rounded-lg"
                      >
                        Отмена
                      </button>
                      <button
                        onClick={() => handleSave(tpl)}
                        className="flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold px-3.5 py-1.5 rounded-lg shadow-xs"
                      >
                        <Save className="w-3.5 h-3.5" />
                        Сохранить шаблон
                      </button>
                    </div>
                  </div>
                ) : (
                  <div>
                    <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 text-xs text-slate-700 whitespace-pre-line leading-relaxed font-sans">
                      {tpl.textTemplate}
                    </div>

                    {isJustSaved && (
                      <div className="mt-2 text-xs text-emerald-700 font-medium flex items-center gap-1">
                        <Check className="w-3.5 h-3.5" /> Шаблон успешно сохранен и активирован
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
