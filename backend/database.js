const fs = require('fs');
const path = require('path');

const DB_FILE = path.join(__dirname, 'data.json');

// Initial seed data
const initialData = {
  users: [
    {
      id: 'u-1',
      username: 'manager',
      password: 'password123',
      name: 'Елена Васильева',
      role: 'manager',
      phone: '+7 (999) 111-22-33',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150'
    },
    {
      id: 'u-2',
      username: 'admin',
      password: 'password123',
      name: 'Анна Смирнова',
      role: 'admin',
      phone: '+7 (999) 222-33-44',
      avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150'
    },
    {
      id: 'u-3',
      username: 'sitter',
      password: 'password123',
      name: 'Мария Ковалева',
      role: 'sitter',
      phone: '+7 (999) 333-44-55',
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150'
    },
    {
      id: 'u-4',
      username: 'cynologist',
      password: 'password123',
      name: 'Алексей Громов',
      role: 'cynologist',
      phone: '+7 (999) 444-55-66',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150'
    },
    {
      id: 'u-5',
      username: 'felinologist',
      password: 'password123',
      name: 'Ольга Соколова',
      role: 'felinologist',
      phone: '+7 (999) 555-66-77',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'
    },
    {
      id: 'u-6',
      username: 'vet',
      password: 'password123',
      name: 'Дмитрий Николаев (Ветврач)',
      role: 'vet',
      phone: '+7 (999) 666-77-88',
      avatar: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=150'
    },
    {
      id: 'u-7',
      username: 'client',
      password: 'password123',
      name: 'Иван Петров',
      role: 'client',
      phone: '+7 (916) 789-01-23',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150'
    }
  ],
  clients: [
    {
      id: 'c-1',
      userId: 'u-7',
      name: 'Иван Петров',
      phone: '+7 (916) 789-01-23',
      whatsapp: '+7 (916) 789-01-23',
      email: 'ivan.petrov@mail.ru',
      emergencyContact: 'Жена Ольга: +7 (916) 111-00-22',
      notes: 'Постоянный клиент, просит присылать видео в WhatsApp каждый день после 18:00'
    },
    {
      id: 'c-2',
      name: 'Екатерина Морозова',
      phone: '+7 (925) 555-34-12',
      whatsapp: '+7 (925) 555-34-12',
      email: 'morozova.kat@gmail.com',
      emergencyContact: 'Брат Сергей: +7 (925) 999-88-77',
      notes: 'Кот Симба очень чувствителен к громким звукам'
    },
    {
      id: 'c-3',
      name: 'Михаил Захаров',
      phone: '+7 (903) 444-12-89',
      whatsapp: '+7 (903) 444-12-89',
      email: 'zaharov_m@yandex.ru',
      emergencyContact: 'Мама Нина Ивановна: +7 (903) 333-22-11',
      notes: 'Рекс на курсе дрессировки, попросил кинолога уделить внимание команде "Рядом"'
    }
  ],
  pets: [
    {
      id: 'p-1',
      clientId: 'c-1',
      name: 'Байкал',
      species: 'dog',
      speciesLabel: 'Собака',
      breed: 'Сибирский хаски',
      gender: 'male',
      age: '3 года',
      birthDate: '2023-04-10',
      chipNumber: '643098100234112',
      photoUrl: 'https://images.unsplash.com/photo-1537151625747-768eb6cf92b2?w=400',
      diet: 'Acana Lamb & Apple, 180г два раза в день (08:00 и 20:00). Аллергия на куриный белок!',
      medications: 'Витамины 8in1 Excel для шерсти — 1 таблетка утром во время еды',
      character: 'Очень энергичный, дружелюбный, тянет поводок при встрече с птицами. Обожает бегать.',
      vaccinationExpiry: '2027-02-15',
      rabiesVaccine: 'Nobivac Rabies (15.02.2026)',
      parasiteTreatmentDate: '2026-09-01',
      vetNotes: 'Здоров, уши чистые, зубы в норме. Контролировать питьевой режим после активных игр.',
      cynologistNotes: 'Работали над выдержкой и концентрацией. Рекомендуется выгул на шлейке.',
      felinologistNotes: ''
    },
    {
      id: 'p-2',
      clientId: 'c-2',
      name: 'Симба',
      species: 'cat',
      speciesLabel: 'Кошка',
      breed: 'Британская короткошерстная',
      gender: 'male',
      age: '2 года',
      birthDate: '2024-06-15',
      chipNumber: '643098200119984',
      photoUrl: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=400',
      diet: 'Royal Canin British Shorthair сухой + паштет ProPlan Delicate в 19:00',
      medications: 'Капли «Кот Баюн» по 4 капли в воду первые 2 дня для мягкой адаптации',
      character: 'Скромный, пугливый в незнакомой обстановке, любит сидеть на высоких полочках',
      vaccinationExpiry: '2027-05-10',
      rabiesVaccine: 'Purevax RCP (10.05.2026)',
      parasiteTreatmentDate: '2026-08-20',
      vetNotes: 'Стерилизован. Регулярная проверка лотка (склонность к МКБ при стрессе)',
      cynologistNotes: '',
      felinologistNotes: 'Проведен сеанс адаптации с феромонами Feliway. Кот начал мурчать на 2-й день.'
    },
    {
      id: 'p-3',
      clientId: 'c-3',
      name: 'Рекс',
      species: 'dog',
      speciesLabel: 'Собака',
      breed: 'Немецкая овчарка',
      gender: 'male',
      age: '4 года',
      birthDate: '2022-08-01',
      chipNumber: '643098300456123',
      photoUrl: 'https://images.unsplash.com/photo-1589941013453-ec89f33b5e95?w=400',
      diet: 'Monge Maxi Adult 250г 2 раза в день. Вода в свободном доступе.',
      medications: 'Артровет комплекс для суставов 1 капсула в обед',
      character: 'Умный, охранные качества, слушает команды с полуслова. С кобелями держится настороже.',
      vaccinationExpiry: '2026-12-01',
      rabiesVaccine: 'Eurican DAPPi-L (01.12.2025)',
      parasiteTreatmentDate: '2026-09-15',
      vetNotes: 'Дисплазия суставов исключена, суставы в хорошей форме.',
      cynologistNotes: 'Ежедневные 40-минутные занятия по ОКД. Отличный апортировочный рефлекс.',
      felinologistNotes: ''
    },
    {
      id: 'p-4',
      clientId: 'c-1',
      name: 'Луна',
      species: 'cat',
      speciesLabel: 'Кошка',
      breed: 'Мейн-кун',
      gender: 'female',
      age: '1.5 года',
      birthDate: '2025-03-20',
      chipNumber: '643098400876543',
      photoUrl: 'https://images.unsplash.com/photo-1533738363-b7f9aef128ce?w=400',
      diet: 'Grandorf 4 Meat Adult Cat + индейка отварная вечером (50г)',
      medications: 'Мальт-паста GimCat для вывода шерсти 3см через день',
      character: 'Ласковая, общительная гигантша, любит воду и играет с капельками',
      vaccinationExpiry: '2027-01-18',
      rabiesVaccine: 'Feligen CRP (18.01.2026)',
      parasiteTreatmentDate: '2026-09-10',
      vetNotes: 'Шерсть в идеальном состоянии, уши и глаза чистые.',
      cynologistNotes: '',
      felinologistNotes: 'Необходим большой закрытый лоток и высокое дерево для лазания.'
    }
  ],
  rooms: [
    {
      id: 'r-101',
      name: 'Кошачий Люкс «Мурлыка»',
      type: 'cat',
      typeLabel: 'Кошачий номер',
      category: 'Люкс',
      pricePerDay: 1600,
      capacity: 2,
      features: ['Панорамное стекло', 'Игровой комплекс 2.2м', 'Видеонаблюдение 24/7', 'Кондиционер'],
      status: 'occupied', // occupied, available, cleaning, maintenance
      currentBookingId: 'b-1'
    },
    {
      id: 'r-102',
      name: 'Кошачий Стандарт «Уют»',
      type: 'cat',
      typeLabel: 'Кошачий номер',
      category: 'Стандарт',
      pricePerDay: 1100,
      capacity: 1,
      features: ['Многоуровневые полочки', 'Уютная лежанка', 'Когтеточка'],
      status: 'available',
      currentBookingId: null
    },
    {
      id: 'r-103',
      name: 'Кошачий Стандарт «Лапки»',
      type: 'cat',
      typeLabel: 'Кошачий номер',
      category: 'Стандарт',
      pricePerDay: 1100,
      capacity: 1,
      features: ['Полочки из натурального дерева', 'Когтеточка', 'Отдельная вентиляция'],
      status: 'occupied',
      currentBookingId: 'b-3'
    },
    {
      id: 'r-201',
      name: 'Собачий Премиум «Олимп»',
      type: 'dog',
      typeLabel: 'Собачий номер',
      category: 'Люкс',
      pricePerDay: 2600,
      capacity: 1,
      features: ['Площадь 12 кв.м', 'Ортопедический диван', 'Web-камера для хозяина', 'Теплый пол'],
      status: 'occupied',
      currentBookingId: 'b-2'
    },
    {
      id: 'r-202',
      name: 'Собачий Комфорт «Дружок»',
      type: 'dog',
      typeLabel: 'Собачий номер',
      category: 'Стандарт',
      pricePerDay: 1800,
      capacity: 1,
      features: ['Теплый отапливаемый бокс', 'Окно на зеленую зону', 'Регулярная дезинфекция'],
      status: 'available',
      currentBookingId: null
    },
    {
      id: 'r-203',
      name: 'Собачий Вольер «Свобода»',
      type: 'dog',
      typeLabel: 'Собачий номер',
      category: 'С выгулом',
      pricePerDay: 2200,
      capacity: 1,
      features: ['Прямой выход на индивидуальную лужайку 20 кв.м', 'Утепленная будка-дом', 'Теневой навес'],
      status: 'available',
      currentBookingId: null
    },
    {
      id: 'r-301',
      name: 'Медицинский Изолятор / Карантин',
      type: 'all',
      typeLabel: 'Вет-бокс',
      category: 'Специальный',
      pricePerDay: 2000,
      capacity: 1,
      features: ['Бактерицидный рециркулятор Дезар-7', 'Кафельный пол с подогревом', 'Мониторинг ветврача'],
      status: 'available',
      currentBookingId: null
    }
  ],
  bookings: [
    {
      id: 'b-1',
      petId: 'p-2', // Симба
      clientId: 'c-2',
      roomId: 'r-101',
      startDate: '2026-10-14',
      endDate: '2026-10-21',
      days: 7,
      dailyRate: 1600,
      additionalServices: [
        { name: 'Адаптация фелинолога', price: 1500 },
        { name: 'Ежедневный видеоотчет WhatsApp', price: 0 }
      ],
      totalAmount: 12700,
      paidAmount: 5000,
      status: 'checked_in', // new, confirmed, checked_in, checked_out, cancelled
      checkInTime: '2026-10-14T10:30:00',
      notes: 'Кот освоился, лежит на верхнем ярусе.'
    },
    {
      id: 'b-2',
      petId: 'p-1', // Байкал
      clientId: 'c-1',
      roomId: 'r-201',
      startDate: '2026-10-13',
      endDate: '2026-10-20',
      days: 7,
      dailyRate: 2600,
      additionalServices: [
        { name: 'Индивидуальные занятия с кинологом (3 урока)', price: 4500 },
        { name: 'Груминг перед выездом', price: 3000 }
      ],
      totalAmount: 25700,
      paidAmount: 25700,
      status: 'checked_in',
      checkInTime: '2026-10-13T12:00:00',
      notes: 'Полная оплата произведена. Байкал бодр и активен.'
    },
    {
      id: 'b-3',
      petId: 'p-4', // Луна
      clientId: 'c-1',
      roomId: 'r-103',
      startDate: '2026-10-15',
      endDate: '2026-10-22',
      days: 7,
      dailyRate: 1100,
      additionalServices: [
        { name: 'Вычесывание шерсти зооняней 2 раза', price: 1000 }
      ],
      totalAmount: 8700,
      paidAmount: 4000,
      status: 'checked_in',
      checkInTime: '2026-10-15T11:00:00',
      notes: 'Заселилась сегодня, осмотрена врачом.'
    },
    {
      id: 'b-4',
      petId: 'p-3', // Рекс
      clientId: 'c-3',
      roomId: 'r-202',
      startDate: '2026-10-18',
      endDate: '2026-10-25',
      days: 7,
      dailyRate: 1800,
      additionalServices: [
        { name: 'Курс ОКД с кинологом', price: 6000 }
      ],
      totalAmount: 18600,
      paidAmount: 5000,
      status: 'confirmed',
      checkInTime: null,
      notes: 'Заезд через 3 дня. Автонапоминание в WhatsApp запланировано.'
    }
  ],
  tasks: [
    {
      id: 't-1',
      title: 'Утреннее кормление Байкала',
      description: 'Корм Acana Lamb 180г + витамины 8in1. Строго без курицы!',
      targetRole: 'sitter', // sitter, cynologist, felinologist, vet, all
      assignedTo: 'u-3',
      petId: 'p-1',
      petName: 'Байкал (Хаски)',
      roomId: 'r-201',
      roomName: 'Собачий Премиум «Олимп»',
      scheduledTime: '08:00',
      isOverdue: false,
      status: 'completed', // pending, in_progress, completed
      completedAt: '2026-10-15T08:15:00',
      completedByName: 'Мария Ковалева (Зооняня)',
      completionNote: 'Съел весь рацион с аппетитом, миску помыла, воду обновила.'
    },
    {
      id: 't-2',
      title: 'Вводный осмотр кошки Луны при заезде',
      description: 'Проверить температуру, чистоту ушных раковин, кожные покровы, ветпаспорт.',
      targetRole: 'vet',
      assignedTo: 'u-6',
      petId: 'p-4',
      petName: 'Луна (Мейн-кун)',
      roomId: 'r-103',
      roomName: 'Кошачий Стандарт «Лапки»',
      scheduledTime: '11:30',
      isOverdue: false,
      status: 'completed',
      completedAt: '2026-10-15T11:40:00',
      completedByName: 'Дмитрий Николаев (Ветврач)',
      completionNote: 'Температура 38.6°C, лимфоузлы в норме, чип верифицирован, допущена к заселению.'
    },
    {
      id: 't-3',
      title: 'Дневная тренировка Байкала (ОКД)',
      description: 'Отработка выдержки, движение рядом без натяжения поводка, апортировка на площадке.',
      targetRole: 'cynologist',
      assignedTo: 'u-4',
      petId: 'p-1',
      petName: 'Байкал (Хаски)',
      roomId: 'r-201',
      roomName: 'Собачий Премиум «Олимп»',
      scheduledTime: '14:00',
      isOverdue: false,
      status: 'pending',
      completedAt: null,
      completedByName: null,
      completionNote: null
    },
    {
      id: 't-4',
      title: 'Сеанс снижения стресса кота Симбы',
      description: 'Проверить работу диффузора Feliway, предложить лакомство с руки, провести спокойную игру дразнилкой.',
      targetRole: 'felinologist',
      assignedTo: 'u-5',
      petId: 'p-2',
      petName: 'Симба (Британец)',
      roomId: 'r-101',
      roomName: 'Кошачий Люкс «Мурлыка»',
      scheduledTime: '15:30',
      isOverdue: false,
      status: 'pending',
      completedAt: null,
      completedByName: null,
      completionNote: null
    },
    {
      id: 't-5',
      title: 'Дать медикаменты: Артровет для суставов',
      description: 'Дать 1 капсулу Артровет в кусочке лакомства или с обеденным рационом.',
      targetRole: 'vet',
      assignedTo: 'u-6',
      petId: 'p-3',
      petName: 'Рекс (Овчарка)',
      roomId: 'r-202',
      roomName: 'Ожидается заселение',
      scheduledTime: '13:00',
      isOverdue: false,
      status: 'pending',
      completedAt: null,
      completedByName: null,
      completionNote: null
    },
    {
      id: 't-6',
      title: 'Вечерний выгул Байкала (40 минут)',
      description: 'Выгул в закрытом манеже отеля, помыть лапы после прогулки.',
      targetRole: 'sitter',
      assignedTo: 'u-3',
      petId: 'p-1',
      petName: 'Байкал (Хаски)',
      roomId: 'r-201',
      roomName: 'Собачий Премиум «Олимп»',
      scheduledTime: '19:00',
      isOverdue: false,
      status: 'pending',
      completedAt: null,
      completedByName: null,
      completionNote: null
    },
    {
      id: 't-7',
      title: 'Вечерний фотоотчет владельцу Ивану в WhatsApp',
      description: 'Сделать 2 фото Байкала и Луны, написать краткий отчет о настроении и аппетите.',
      targetRole: 'sitter',
      assignedTo: 'u-3',
      petId: 'p-1',
      petName: 'Байкал и Луна',
      roomId: 'r-201',
      roomName: 'Номера 201 и 103',
      scheduledTime: '19:45',
      isOverdue: false,
      status: 'pending',
      completedAt: null,
      completedByName: null,
      completionNote: null
    }
  ],
  whatsappConversations: [
    {
      id: 'wa-conv-1',
      clientId: 'c-1',
      clientName: 'Иван Петров',
      phone: '+7 (916) 789-01-23',
      unreadCount: 0,
      petName: 'Байкал и Луна',
      lastMessage: 'Спасибо огромное! Байкал выглядит очень довольным!',
      lastTimestamp: '2026-10-15T12:10:00',
      messages: [
        {
          id: 'm-1',
          sender: 'system',
          senderName: 'Авто-система ZooHotel',
          text: 'Здравствуйте, Иван! Ваше бронирование номера Премиум «Олимп» для питомца Байкал с 13.10 по 20.10 успешно подтверждено! Ждем вас с 12:00. Ветпаспорт обязателен.',
          timestamp: '2026-10-12T14:00:00',
          type: 'auto_booking_confirm',
          status: 'read'
        },
        {
          id: 'm-2',
          sender: 'client',
          senderName: 'Иван Петров',
          text: 'Добрый день! Мы подъехали к гостинице, Байкал немного волнуется. Где припарковаться?',
          timestamp: '2026-10-13T11:50:00',
          type: 'text',
          status: 'read'
        },
        {
          id: 'm-3',
          sender: 'staff',
          senderName: 'Анна (Администратор)',
          text: 'Добрый день, Иван! Шлагбаум открыт, паркуйтесь прямо у главного входа, мы выходим вас встретить!',
          timestamp: '2026-10-13T11:52:00',
          type: 'text',
          status: 'read'
        },
        {
          id: 'm-4',
          sender: 'staff',
          senderName: 'Мария (Зооняня)',
          text: 'Отчет за 14 октября: Байкал отлично погулял днем, освоился в номере. Кушает свой корм с аппетитом, подружился с нашей командой. Вот свежее фото с прогулки!',
          photoUrl: 'https://images.unsplash.com/photo-1537151625747-768eb6cf92b2?w=600',
          timestamp: '2026-10-14T19:30:00',
          type: 'photo_report',
          status: 'read'
        },
        {
          id: 'm-5',
          sender: 'client',
          senderName: 'Иван Петров',
          text: 'Спасибо огромное! Байкал выглядит очень довольным!',
          timestamp: '2026-10-15T12:10:00',
          type: 'text',
          status: 'read'
        }
      ]
    },
    {
      id: 'wa-conv-2',
      clientId: 'c-2',
      clientName: 'Екатерина Морозова',
      phone: '+7 (925) 555-34-12',
      unreadCount: 1,
      petName: 'Симба',
      lastMessage: 'Подскажите, пожалуйста, Симба уже покушал влажный корм?',
      lastTimestamp: '2026-10-15T13:40:00',
      messages: [
        {
          id: 'm-201',
          sender: 'system',
          senderName: 'Авто-система ZooHotel',
          text: 'Здравствуйте, Екатерина! Симба успешно заселен в номер Люкс «Мурлыка». С ним работает наш специалист-фелинолог для быстрой и мягкой адаптации.',
          timestamp: '2026-10-14T11:00:00',
          type: 'auto_checkin',
          status: 'read'
        },
        {
          id: 'm-202',
          sender: 'client',
          senderName: 'Екатерина Морозова',
          text: 'Подскажите, пожалуйста, Симба уже покушал влажный корм?',
          timestamp: '2026-10-15T13:40:00',
          type: 'text',
          status: 'delivered'
        }
      ]
    },
    {
      id: 'wa-conv-3',
      clientId: 'c-3',
      clientName: 'Михаил Захаров',
      phone: '+7 (903) 444-12-89',
      unreadCount: 0,
      petName: 'Рекс',
      lastMessage: 'Напоминаем: заезд питомца Рекс запланирован на 18 октября.',
      lastTimestamp: '2026-10-15T09:00:00',
      messages: [
        {
          id: 'm-301',
          sender: 'system',
          senderName: 'Авто-система ZooHotel',
          text: 'Здравствуйте, Михаил! Напоминаем: заезд питомца Рекс запланирован на 18 октября. Кинолог Алексей уже подготовил индивидуальный план занятий по послушанию.',
          timestamp: '2026-10-15T09:00:00',
          type: 'auto_reminder_72h',
          status: 'read'
        }
      ]
    }
  ],
  autoMessageTemplates: [
    {
      id: 'tpl-1',
      trigger: 'booking_created',
      name: 'Бронирование создано',
      enabled: true,
      textTemplate: 'Здравствуйте, {{clientName}}! Бронирование №{{bookingId}} для питомца {{petName}} успешно создано на даты с {{startDate}} по {{endDate}}. Сумма к оплате: {{totalAmount}} руб.'
    },
    {
      id: 'tpl-2',
      trigger: 'booking_confirmed',
      name: 'Бронирование подтверждено',
      enabled: true,
      textTemplate: 'Здравствуйте, {{clientName}}! Ваше бронирование в ZooHotel подтверждено. Номер {{roomName}} ждет {{petName}}. Напоминаем взять ветпаспорт и любимую вещь питомца для уюта.'
    },
    {
      id: 'tpl-3',
      trigger: 'checkin_welcome',
      name: 'Заселение питомца',
      enabled: true,
      textTemplate: '{{clientName}}, рады сообщить: {{petName}} успешно заселился в номер {{roomName}}! Ветврач провел первичный осмотр. Зооняня уже рядом.'
    },
    {
      id: 'tpl-4',
      trigger: 'reminder_24h',
      name: 'Напоминание за 24 часа до заезда',
      enabled: true,
      textTemplate: 'Здравствуйте, {{clientName}}! Напоминаем, что завтра мы ждем {{petName}} в гостиницу для животных ZooHotel к назначенному времени.'
    },
    {
      id: 'tpl-5',
      trigger: 'daily_summary',
      name: 'Вечерний отчет за день',
      enabled: true,
      textTemplate: 'Добрый вечер, {{clientName}}! Отчет по питомцу {{petName}}: день прошел отлично, самочувствие прекрасное, прогулки и кормление строго по расписанию.'
    }
  ],
  notificationSettings: {
    systemDesktopEnabled: true,
    mobilePushEnabled: true,
    telegramBotEnabled: true,
    telegramBotToken: '7198234812:AAF_mock_token_zoohotel_demo',
    telegramChatId: '-100234567890',
    telegramStaffGroup: 'ZooHotel Дежурная смена (Telegram)',
    whatsappStaffAlertsEnabled: true,
    whatsappStaffNumber: '+7 (999) 111-22-33'
  }
};

// Database class
class Database {
  constructor() {
    this.data = null;
    this.init();
  }

  init() {
    try {
      if (fs.existsSync(DB_FILE)) {
        const raw = fs.readFileSync(DB_FILE, 'utf-8');
        this.data = JSON.parse(raw);
        if (!this.data.notificationSettings) {
          this.data.notificationSettings = initialData.notificationSettings;
          this.save();
        }
      } else {
        this.data = initialData;
        this.save();
      }
    } catch (e) {
      console.error('Error loading DB, resetting to initial seed:', e);
      this.data = initialData;
      this.save();
    }
  }

  save() {
    try {
      fs.writeFileSync(DB_FILE, JSON.stringify(this.data, null, 2), 'utf-8');
    } catch (e) {
      console.error('Failed to save DB:', e);
    }
  }

  get(collection) {
    return this.data[collection] || [];
  }

  set(collection, items) {
    this.data[collection] = items;
    this.save();
    return items;
  }

  insert(collection, item) {
    if (!this.data[collection]) {
      this.data[collection] = [];
    }
    this.data[collection].push(item);
    this.save();
    return item;
  }

  update(collection, id, updates) {
    const list = this.data[collection] || [];
    const index = list.findIndex(item => item.id === id);
    if (index !== -1) {
      list[index] = { ...list[index], ...updates };
      this.save();
      return list[index];
    }
    return null;
  }

  delete(collection, id) {
    const list = this.data[collection] || [];
    const filtered = list.filter(item => item.id !== id);
    this.data[collection] = filtered;
    this.save();
    return true;
  }
}

const db = new Database();

module.exports = db;
