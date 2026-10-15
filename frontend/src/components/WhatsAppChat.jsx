import React, { useState, useEffect, useRef } from 'react';
import { 
  MessageSquare, 
  Send, 
  Image as ImageIcon, 
  Phone, 
  CheckCheck, 
  Bot, 
  Sparkles, 
  User, 
  Dog, 
  Cat, 
  Settings, 
  Search,
  Check,
  PlusCircle,
  HelpCircle
} from 'lucide-react';

export default function WhatsAppChat({ 
  conversations = [], 
  currentUser, 
  onSendMessage, 
  onSimulateIncoming 
}) {
  const [selectedConvId, setSelectedConvId] = useState(conversations[0]?.id || null);
  const [inputText, setInputText] = useState('');
  const [photoUrl, setPhotoUrl] = useState('');
  const [showPhotoInput, setShowPhotoInput] = useState(false);
  const [simText, setSimText] = useState('');
  const [showSimModal, setShowSimModal] = useState(false);
  const [search, setSearch] = useState('');

  const messagesEndRef = useRef(null);

  const selectedConv = conversations.find(c => c.id === selectedConvId) || conversations[0];

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [selectedConv?.messages]);

  const handleSend = (e) => {
    e?.preventDefault();
    if (!inputText.trim() && !photoUrl.trim()) return;

    onSendMessage({
      conversationId: selectedConv?.id,
      text: inputText,
      photoUrl: photoUrl || null,
      senderName: currentUser?.name || 'Администратор'
    });

    setInputText('');
    setPhotoUrl('');
    setShowPhotoInput(false);
  };

  const handleQuickTemplate = (text) => {
    setInputText(text);
  };

  const handleSimulate = () => {
    if (!selectedConv) return;
    onSimulateIncoming({
      conversationId: selectedConv.id,
      text: simText || 'Добрый день! Подскажите, как сейчас покушал питомец?',
      clientName: selectedConv.clientName,
      phone: selectedConv.phone
    });
    setSimText('');
    setShowSimModal(false);
  };

  const filteredConversations = conversations.filter(c => 
    c.clientName.toLowerCase().includes(search.toLowerCase()) ||
    c.petName.toLowerCase().includes(search.toLowerCase()) ||
    c.phone.includes(search)
  );

  return (
    <div className="space-y-4">
      {/* Top Banner with Simulation and Webhook Status */}
      <div className="bg-emerald-800 text-white p-4 rounded-xl shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex items-center space-x-3">
          <div className="w-9 h-9 rounded-xl bg-emerald-700 flex items-center justify-center text-white">
            <MessageSquare className="w-5 h-5 text-emerald-200" />
          </div>
          <div>
            <div className="font-bold text-sm flex items-center gap-2">
              WhatsApp Бизнес-Центр гостиницы
              <span className="text-[10px] bg-emerald-600/80 text-emerald-100 px-2 py-0.5 rounded-full font-mono">
                Онлайн • Webhook активен
              </span>
            </div>
            <p className="text-xs text-emerald-200">
              Приём и отправка сообщений, фотоотчетов няни и автоматических сервисных уведомлений
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowSimModal(true)}
            className="flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold px-3 py-1.5 rounded-lg transition-all shadow-xs"
            title="Протестировать получение сообщения от клиента"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            Симуляция входящего сообщения
          </button>
        </div>
      </div>

      {/* Main WhatsApp Window */}
      <div className="bg-white rounded-xl border border-slate-200/80 shadow-xs grid grid-cols-1 md:grid-cols-3 h-[620px] overflow-hidden">
        
        {/* Left: Dialogs List */}
        <div className="border-r border-slate-200 flex flex-col h-full bg-slate-50/50">
          <div className="p-3 border-b border-slate-200 bg-white">
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Поиск диалога..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 bg-slate-100 rounded-lg text-xs focus:outline-none focus:ring-1 focus:ring-emerald-500"
              />
            </div>
          </div>

          <div className="overflow-y-auto flex-1 divide-y divide-slate-100">
            {filteredConversations.map(conv => {
              const isSelected = selectedConv?.id === conv.id;
              return (
                <div
                  key={conv.id}
                  onClick={() => setSelectedConvId(conv.id)}
                  className={`p-3.5 cursor-pointer transition-colors flex items-start space-x-3 ${
                    isSelected ? 'bg-emerald-50/80 border-l-4 border-emerald-600' : 'hover:bg-slate-100/70'
                  }`}
                >
                  <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-sm shrink-0">
                    {conv.clientName.charAt(0)}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-xs text-slate-800 truncate">{conv.clientName}</span>
                      <span className="text-[10px] text-slate-400">
                        {conv.lastTimestamp ? new Date(conv.lastTimestamp).toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' }) : ''}
                      </span>
                    </div>

                    <div className="text-[11px] text-emerald-700 font-medium truncate flex items-center gap-1">
                      <span>🐾 {conv.petName}</span>
                    </div>

                    <p className="text-[11px] text-slate-500 truncate mt-0.5">
                      {conv.lastMessage}
                    </p>
                  </div>

                  {conv.unreadCount > 0 && (
                    <span className="bg-emerald-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full shrink-0">
                      {conv.unreadCount}
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Active Chat Area */}
        {selectedConv ? (
          <div className="md:col-span-2 flex flex-col h-full bg-[#efeae2]/40">
            
            {/* Chat Header */}
            <div className="p-3 bg-white border-b border-slate-200 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-9 h-9 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-sm">
                  {selectedConv.clientName.charAt(0)}
                </div>
                <div>
                  <div className="font-semibold text-xs text-slate-800 flex items-center gap-2">
                    {selectedConv.clientName}
                    <span className="text-[10px] text-slate-400 font-mono font-normal">{selectedConv.phone}</span>
                  </div>
                  <div className="text-[11px] text-emerald-700">
                    Питомец: <strong>{selectedConv.petName}</strong>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-[11px] bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-md font-medium">
                  WhatsApp Direct
                </span>
              </div>
            </div>

            {/* Messages Feed */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {selectedConv.messages.map((msg) => {
                const isFromHotel = msg.sender === 'staff' || msg.sender === 'system';
                const isSystem = msg.sender === 'system';

                return (
                  <div 
                    key={msg.id}
                    className={`flex flex-col ${isFromHotel ? 'items-end' : 'items-start'}`}
                  >
                    <div className={`max-w-[78%] rounded-2xl p-3 text-xs shadow-xs space-y-1.5 ${
                      isSystem
                        ? 'bg-amber-50 border border-amber-200/80 text-amber-950 rounded-tr-none'
                        : isFromHotel
                        ? 'bg-[#d9fdd3] text-slate-800 rounded-tr-none'
                        : 'bg-white text-slate-800 rounded-tl-none border border-slate-100'
                    }`}>
                      {/* Sender Tag */}
                      <div className="flex items-center justify-between text-[10px] font-semibold opacity-75 gap-2">
                        <span>{msg.senderName}</span>
                        {isSystem && <span className="bg-amber-200/60 px-1.5 rounded text-[9px]">Авто-триггер</span>}
                      </div>

                      {/* Photo if attached */}
                      {msg.photoUrl && (
                        <div className="rounded-xl overflow-hidden my-1">
                          <img 
                            src={msg.photoUrl} 
                            alt="Отчет" 
                            className="w-full max-h-56 object-cover rounded-lg"
                          />
                        </div>
                      )}

                      {/* Message text */}
                      <p className="whitespace-pre-line leading-relaxed">{msg.text}</p>

                      {/* Timestamp & Status */}
                      <div className="flex items-center justify-end space-x-1 text-[9px] text-slate-400 pt-0.5">
                        <span>{new Date(msg.timestamp).toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })}</span>
                        {isFromHotel && (
                          <CheckCheck className="w-3.5 h-3.5 text-blue-500" />
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
              <div ref={messagesEndRef} />
            </div>

            {/* Quick Templates Bar */}
            <div className="px-3 py-1.5 bg-white/80 border-t border-slate-200 flex items-center gap-1.5 overflow-x-auto text-[11px]">
              <span className="text-slate-400 font-medium whitespace-nowrap">Шаблоны:</span>
              <button
                onClick={() => handleQuickTemplate(`Здравствуйте! У питомца ${selectedConv.petName} все отлично: покушал с аппетитом, настроение бодрое, играем!`)}
                className="bg-slate-100 hover:bg-slate-200 px-2 py-1 rounded-md text-slate-700 whitespace-nowrap"
              >
                🍴 Покушал с аппетитом
              </button>
              <button
                onClick={() => handleQuickTemplate(`Отчет о прогулке: погуляли 45 минут в манеже, побегали за мячом, лапки помыли.`)}
                className="bg-slate-100 hover:bg-slate-200 px-2 py-1 rounded-md text-slate-700 whitespace-nowrap"
              >
                🌳 Прогулка завершена
              </button>
              <button
                onClick={() => handleQuickTemplate(`Добрый вечер! Отправляем вечерний фотоотчет, передаем привет от всей команды гостиницы!`)}
                className="bg-slate-100 hover:bg-slate-200 px-2 py-1 rounded-md text-slate-700 whitespace-nowrap"
              >
                📸 Вечерний привет
              </button>
            </div>

            {/* Photo Attachment URL Input */}
            {showPhotoInput && (
              <div className="p-2 bg-emerald-50 border-t border-emerald-100 flex items-center gap-2 text-xs">
                <span className="text-emerald-800 font-medium">Ссылка на фото:</span>
                <input
                  type="text"
                  placeholder="https://..."
                  value={photoUrl}
                  onChange={(e) => setPhotoUrl(e.target.value)}
                  className="flex-1 px-2.5 py-1 bg-white border border-emerald-200 rounded-lg text-xs focus:outline-none"
                />
                <button
                  onClick={() => setShowPhotoInput(false)}
                  className="text-slate-400 hover:text-slate-600 text-xs px-2"
                >
                  ✕
                </button>
              </div>
            )}

            {/* Input Bar */}
            <form onSubmit={handleSend} className="p-3 bg-white border-t border-slate-200 flex items-center space-x-2">
              <button
                type="button"
                onClick={() => setShowPhotoInput(!showPhotoInput)}
                title="Прикрепить фотоотчет"
                className={`p-2 rounded-lg transition-colors ${showPhotoInput ? 'bg-emerald-100 text-emerald-700' : 'text-slate-400 hover:text-slate-600 hover:bg-slate-100'}`}
              >
                <ImageIcon className="w-5 h-5" />
              </button>

              <input
                type="text"
                placeholder="Введите сообщение клиенту в WhatsApp..."
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                className="flex-1 bg-slate-100 rounded-xl px-3.5 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-emerald-500"
              />

              <button
                type="submit"
                disabled={!inputText.trim() && !photoUrl.trim()}
                className="bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white p-2 rounded-xl transition-all shadow-xs"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        ) : (
          <div className="md:col-span-2 flex items-center justify-center p-8 text-center text-slate-400 text-xs">
            Выберите диалог из списка слева для начала общения в WhatsApp
          </div>
        )}
      </div>

      {/* Modal: Simulate Incoming WhatsApp Message from Client */}
      {showSimModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-start justify-between pb-2 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <span className="text-xl">💬</span>
                <div>
                  <h3 className="font-bold text-sm text-slate-800">Симуляция сообщения от клиента</h3>
                  <p className="text-[11px] text-slate-500">Тестирование входящего WhatsApp запроса</p>
                </div>
              </div>
              <button 
                onClick={() => setShowSimModal(false)}
                className="text-slate-400 hover:text-slate-600 font-bold"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3">
              <div className="text-xs bg-slate-50 p-2.5 rounded-lg border border-slate-200">
                Отправитель: <strong>{selectedConv?.clientName || 'Клиент'}</strong> ({selectedConv?.phone || ''})
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Текст входящего сообщения:
                </label>
                <textarea
                  rows={3}
                  value={simText}
                  onChange={(e) => setSimText(e.target.value)}
                  placeholder="Например: Здравствуйте! Как себя чувствует наш хвостик? Пришлите, пожалуйста, фото!"
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-emerald-500 focus:bg-white"
                />
              </div>

              <div className="flex flex-wrap gap-1.5 text-[10px]">
                <button
                  type="button"
                  onClick={() => setSimText('Здравствуйте! Как дела у нашего питомца? Покушал ли он?')}
                  className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-2 py-1 rounded"
                >
                  "Как дела у питомца?"
                </button>
                <button
                  type="button"
                  onClick={() => setSimText('Добрый день! Можете прислать короткое видео с прогулки?')}
                  className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-2 py-1 rounded"
                >
                  "Пришлите видео с прогулки"
                </button>
              </div>
            </div>

            <div className="pt-2 flex items-center justify-end gap-2 border-t border-slate-100">
              <button
                onClick={() => setShowSimModal(false)}
                className="px-3 py-1.5 text-xs text-slate-600 hover:bg-slate-100 rounded-lg"
              >
                Отмена
              </button>
              <button
                onClick={handleSimulate}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-xl shadow-xs transition-colors flex items-center gap-1.5"
              >
                <Send className="w-3.5 h-3.5" />
                Отправить в CRM
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
