// ===== Test maker =====
const ICONS = { test:'🔘', open:'✍️', match:'🔗', gaps:'✏️', image:'🖼️', audio:'🎧', text:'📝' };
const TYPE_KEYS = ['test','open','match','gaps','image','audio','text'];

// Доступность типов заданий по предметам ('essay' / 'code' — подпись для открытого ответа)
const SUBJECTS = {
  'Математика':   { test:1, open:1, match:1, gaps:0, image:1, audio:0 },
  'Русский язык': { test:1, open:'essay', match:1, gaps:1, image:1, audio:1 },
  'Қазақ тілі':   { test:1, open:'essay', match:1, gaps:1, image:1, audio:1 },
  'English':      { test:1, open:'essay', match:1, gaps:1, image:1, audio:1 },
  'Химия / Физика': { test:1, open:1, match:1, gaps:0, image:1, audio:0 },
  'Биология / Гео': { test:1, open:1, match:1, gaps:1, image:1, audio:0 },
  'История':      { test:1, open:1, match:1, gaps:1, image:1, audio:0 },
  'Информатика':  { test:1, open:'code', match:1, gaps:1, image:1, audio:0 }
};
const allowed = (subj, k) => k === 'text' || !!(subj && subj[k]);

const CYR = ['А','Б','В','Г','Д','Е','Ж','З','И','К'];

// ===== Тексты интерфейса и листа на трёх языках =====
const I18N = {
  ru: {
    // лист
    sor: (n, t) => `Суммативное оценивание за раздел (СОР) № ${n} ${t}`,
    soch: 'Суммативное оценивание за четверть (СОЧ)',
    subject: 'Предмет', quarter: 'Четверть', cls: 'Класс', fio: 'ФИО ученика',
    dateL: 'Дата выполнения', max: 'Максимальный балл', got: 'Набранный балл',
    date: (d, m, y) => `«${d}» ${m} ${y} г.`, dateBlank: '«____» _______________ ____ г.',
    months: ['января','февраля','марта','апреля','мая','июня','июля','августа','сентября','октября','ноября','декабря'],
    task: 'Задание', pt: 'б', keyL: 'Ключ', ansL: 'Ответ', teacherText: 'Текст (для учителя)',
    listen: 'Слушание', speak: 'Говорение', opt: 'абвгдежзик', let: CYR,
    empty: 'Добавьте задания слева — они появятся здесь.',
    subj: {'Математика':'Математика','Русский язык':'Русский язык','Қазақ тілі':'Казахский язык','English':'Английский язык','Химия / Физика':'Химия / Физика','Биология / Гео':'Биология / География','История':'История','Информатика':'Информатика'},
    // интерфейс
    u: {
      tagline:'Создавайте листы оценивания за минуты', newTop:'＋ Создать свой тест', keyChk:'Ключ (ответы)',
      print:'🖨 Печать / PDF', word:'📄 Word', saveB:'💾 Сохранить', openB:'📂 Открыть',
      settings:'⚙️ Настройки теста', newTest:'＋ Новый тест', kind:'Вид оценивания',
      sorOpt:'СОР — за раздел', sochOpt:'СОЧ — за четверть', numSor:'№ СОР', topic:'Тема / раздел',
      subject:'Предмет', choose:'— выберите предмет —', quarter:'Четверть', cls:'Класс',
      fio:'ФИО ученика (можно оставить пустым)', date:'Дата выполнения (можно оставить пустой)',
      addTask:'➕ Добавить задание', pickSubj:'(выберите предмет)', maxScore:'Максимальный балл:',
      noTasks:'Пока нет заданий.', noTasks2:'Нажмите на тип задания выше, чтобы добавить.',
      types:{test:'Тест',open:'Открытый ответ / Задача',match:'Соединить',gaps:'Текст с пропусками',image:'Работа с изображением',audio:'Слушание / Говорение',text:'Текст'},
      alt:{essay:'Эссе',code:'Код'},
      question:'Вопрос', taskText:'Текст задания', instr:'Инструкция', variants:'Варианты (отметьте правильные)',
      variant:'Вариант', addVar:'+ вариант', pairs:'Пары (слева — справа)', left:'Левый', right:'Правый', addPair:'+ пара',
      shuffle:'В листе правый столбец автоматически перемешивается.',
      gapsL:'Текст. Пропуски отмечайте звёздочками: Столица Казахстана — *Астана*',
      image:'Изображение', kindL:'Вид', audioText:'Текст для чтения вслух / аудиозаписи (для учителя)',
      lines:'Строк для ответа', ansKey:'Ответ для ключа', pts:'Баллы',
      tbTitle:'Заголовок (необязательно)', tbTitlePh:'Например: Прочитайте текст', tbText:'Текст',
      tbPh:'Вставьте или напишите текст — отрывок, условие, инструкцию...', tbHint:'Блок без баллов и без номера — отображается в листе рамкой.',
      confirmNew:'Создать новый тест с чистого листа?\nТекущий тест будет очищен. Если он нужен — сначала нажмите «Сохранить».',
      toastNew:'✨ Чистый лист готов — выберите предмет и добавляйте задания', toastWord:'📄 Файл Word скачан',
      toastJson:'💾 Тест сохранён в файл', toastOpen:'📂 Тест открыт', errOpen:'Не удалось открыть файл'
    }
  },
  kk: {
    sor: (n, t) => `Бөлім бойынша жиынтық бағалау (БЖБ) № ${n} ${t}`,
    soch: 'Тоқсан бойынша жиынтық бағалау (ТЖБ)',
    subject: 'Пән', quarter: 'Тоқсан', cls: 'Сынып', fio: 'Оқушының аты-жөні',
    dateL: 'Орындалған күні', max: 'Максималды балл', got: 'Жинаған балл',
    date: (d, m, y) => `${y} ж. «${d}» ${m}`, dateBlank: '____ ж. «____» _______________',
    months: ['қаңтар','ақпан','наурыз','сәуір','мамыр','маусым','шілде','тамыз','қыркүйек','қазан','қараша','желтоқсан'],
    task: 'Тапсырма', pt: 'б', keyL: 'Кілт', ansL: 'Жауап', teacherText: 'Мәтін (мұғалімге)',
    listen: 'Тыңдалым', speak: 'Айтылым', opt: 'абвгдежзик', let: CYR,
    empty: 'Сол жақтан тапсырмаларды қосыңыз.',
    subj: {'Математика':'Математика','Русский язык':'Орыс тілі','Қазақ тілі':'Қазақ тілі','English':'Ағылшын тілі','Химия / Физика':'Химия / Физика','Биология / Гео':'Биология / География','История':'Тарих','Информатика':'Информатика'},
    u: {
      tagline:'Бағалау парақтарын бірнеше минутта жасаңыз', newTop:'＋ Өз тестімді жасау', keyChk:'Кілт (жауаптар)',
      print:'🖨 Басып шығару / PDF', word:'📄 Word', saveB:'💾 Сақтау', openB:'📂 Ашу',
      settings:'⚙️ Тест баптаулары', newTest:'＋ Жаңа тест', kind:'Бағалау түрі',
      sorOpt:'БЖБ — бөлім бойынша', sochOpt:'ТЖБ — тоқсан бойынша', numSor:'БЖБ №', topic:'Тақырып / бөлім',
      subject:'Пән', choose:'— пәнді таңдаңыз —', quarter:'Тоқсан', cls:'Сынып',
      fio:'Оқушының аты-жөні (бос қалдыруға болады)', date:'Орындалған күні (бос қалдыруға болады)',
      addTask:'➕ Тапсырма қосу', pickSubj:'(пәнді таңдаңыз)', maxScore:'Максималды балл:',
      noTasks:'Әзірге тапсырма жоқ.', noTasks2:'Қосу үшін жоғарыдағы тапсырма түрін басыңыз.',
      types:{test:'Тест',open:'Ашық жауап / Есеп',match:'Сәйкестендіру',gaps:'Бос орындары бар мәтін',image:'Суретпен жұмыс',audio:'Тыңдалым / Айтылым',text:'Мәтін'},
      alt:{essay:'Эссе',code:'Код'},
      question:'Сұрақ', taskText:'Тапсырма мәтіні', instr:'Нұсқаулық', variants:'Нұсқалар (дұрыстарын белгілеңіз)',
      variant:'Нұсқа', addVar:'+ нұсқа', pairs:'Жұптар (сол жақ — оң жақ)', left:'Сол жақ', right:'Оң жақ', addPair:'+ жұп',
      shuffle:'Парақта оң жақ баған автоматты түрде араласады.',
      gapsL:'Мәтін. Бос орындарды жұлдызшамен белгілеңіз: Қазақстанның астанасы — *Астана*',
      image:'Сурет', kindL:'Түрі', audioText:'Дауыстап оқу мәтіні / аудиожазба (мұғалімге)',
      lines:'Жауап жолдарының саны', ansKey:'Кілттегі жауап', pts:'Балл',
      tbTitle:'Тақырып (міндетті емес)', tbTitlePh:'Мысалы: Мәтінді оқыңыз', tbText:'Мәтін',
      tbPh:'Мәтінді қойыңыз немесе жазыңыз — үзінді, шарт, нұсқаулық...', tbHint:'Баллсыз және нөмірсіз блок — парақта жақтаумен көрсетіледі.',
      confirmNew:'Жаңа тестті таза парақтан бастау керек пе?\nАғымдағы тест тазартылады. Қажет болса — алдымен «Сақтау» түймесін басыңыз.',
      toastNew:'✨ Таза парақ дайын — пәнді таңдап, тапсырмалар қосыңыз', toastWord:'📄 Word файлы жүктелді',
      toastJson:'💾 Тест файлға сақталды', toastOpen:'📂 Тест ашылды', errOpen:'Файлды ашу мүмкін болмады'
    }
  },
  en: {
    sor: (n, t) => `Summative Assessment for the Unit (SAU) No. ${n} ${t}`,
    soch: 'Summative Assessment for the Term (SAT)',
    subject: 'Subject', quarter: 'Term', cls: 'Grade', fio: "Student's full name",
    dateL: 'Date', max: 'Maximum score', got: 'Score obtained',
    date: (d, m, y) => `${d} ${m} ${y}`, dateBlank: '____ _______________ ____',
    months: ['January','February','March','April','May','June','July','August','September','October','November','December'],
    task: 'Task', pt: 'pts', keyL: 'Key', ansL: 'Answer', teacherText: 'Text (for the teacher)',
    listen: 'Listening', speak: 'Speaking', opt: 'abcdefghij', let: 'ABCDEFGHIJ'.split(''),
    empty: 'Add tasks on the left — they will appear here.',
    subj: {'Математика':'Mathematics','Русский язык':'Russian language','Қазақ тілі':'Kazakh language','English':'English','Химия / Физика':'Chemistry / Physics','Биология / Гео':'Biology / Geography','История':'History','Информатика':'Computer Science'},
    u: {
      tagline:'Create assessment sheets in minutes', newTop:'＋ Create my test', keyChk:'Key (answers)',
      print:'🖨 Print / PDF', word:'📄 Word', saveB:'💾 Save', openB:'📂 Open',
      settings:'⚙️ Test settings', newTest:'＋ New test', kind:'Assessment type',
      sorOpt:'SAU — per unit', sochOpt:'SAT — per term', numSor:'SAU No.', topic:'Topic / unit',
      subject:'Subject', choose:'— choose a subject —', quarter:'Term', cls:'Grade',
      fio:"Student's full name (optional)", date:'Date (optional)',
      addTask:'➕ Add a task', pickSubj:'(choose a subject)', maxScore:'Maximum score:',
      noTasks:'No tasks yet.', noTasks2:'Click a task type above to add one.',
      types:{test:'Multiple choice',open:'Open answer / Problem',match:'Matching',gaps:'Fill in the gaps',image:'Image task',audio:'Listening / Speaking',text:'Text'},
      alt:{essay:'Essay',code:'Code'},
      question:'Question', taskText:'Task text', instr:'Instruction', variants:'Options (tick the correct ones)',
      variant:'Option', addVar:'+ option', pairs:'Pairs (left — right)', left:'Left', right:'Right', addPair:'+ pair',
      shuffle:'The right column is shuffled automatically on the sheet.',
      gapsL:'Text. Mark gaps with asterisks: The capital of Kazakhstan is *Astana*',
      image:'Image', kindL:'Type', audioText:'Text to read aloud / audio script (for the teacher)',
      lines:'Answer lines', ansKey:'Answer for the key', pts:'Points',
      tbTitle:'Title (optional)', tbTitlePh:'E.g.: Read the text', tbText:'Text',
      tbPh:'Paste or write a text — passage, conditions, instructions...', tbHint:'A block without points or number — shown as a framed box on the sheet.',
      confirmNew:'Start a new test from a blank sheet?\nThe current test will be cleared. If you need it, click “Save” first.',
      toastNew:'✨ Blank sheet ready — choose a subject and add tasks', toastWord:'📄 Word file downloaded',
      toastJson:'💾 Test saved to file', toastOpen:'📂 Test opened', errOpen:'Could not open the file'
    }
  }
};
const LANGS = () => I18N[state.lang] || I18N.ru;
const U = () => LANGS().u;

function emptyState(lang, key) {
  return { type: 'СОР', num: '', topic: '', subject: '', quarter: '', cls: '',
           fio: '', date: '', key: !!key, lang: lang || 'ru', tasks: [] };
}
// совместимость со старыми сохранениями
function fix(s) {
  s = Object.assign(emptyState(), s || {});
  if (!SUBJECTS[s.subject]) s.subject = '';
  return s;
}

let state = fix(load());
let uid = Date.now();

const $ = s => document.querySelector(s);
const esc = s => String(s ?? '').replace(/[&<>"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const nl = s => esc(s).replace(/\n/g, '<br>');
const total = () => state.tasks.reduce((a, t) => a + (t.type === 'text' ? 0 : (+t.pts || 0)), 0);
const blank = n => '_'.repeat(n);
const isListen = m => m === 'listen' || m === 'Слушание';

function save() { try { localStorage.setItem('sorsoch', JSON.stringify(state)); } catch (e) {} }
function load() { try { return JSON.parse(localStorage.getItem('sorsoch')); } catch (e) { return null; } }

function toast(msg) {
  const el = $('#toast'); el.textContent = msg; el.classList.add('show');
  clearTimeout(toast.t); toast.t = setTimeout(() => el.classList.remove('show'), 2200);
}

function applyStatic() {
  const u = U();
  document.querySelectorAll('[data-i]').forEach(el => { el.textContent = u[el.dataset.i]; });
}

// ===== Создание заданий =====
function newTask(type) {
  const t = { id: ++uid, type, q: '', pts: 1 };
  if (type === 'test')  t.opts = [{t:'',c:false},{t:'',c:false},{t:'',c:false},{t:'',c:false}];
  if (type === 'match') t.pairs = [{l:'',r:''},{l:'',r:''},{l:'',r:''}];
  if (type === 'gaps')  t.text = '';
  if (type === 'open')  { t.lines = 5; t.ans = ''; }
  if (type === 'image') { t.src = ''; t.lines = 3; t.ans = ''; }
  if (type === 'audio') { t.mode = 'listen'; t.text = ''; t.lines = 4; t.ans = ''; }
  if (type === 'text')  { t.title = ''; t.text = ''; t.pts = 0; }
  return t;
}

// ===== Новый тест (чистый лист) =====
function newTest() {
  const dirty = state.tasks.length || state.topic || state.num || state.subject;
  if (dirty && !confirm(U().confirmNew)) return;
  state = emptyState(state.lang, state.key);
  refresh(true);
  window.scrollTo({ top: 0, behavior: 'smooth' });
  toast(U().toastNew);
}

// ===== Редактор =====
function renderEditor() {
  const u = U(), L = LANGS();
  const subj = SUBJECTS[state.subject];
  const alt = k => typeof subj?.[k] === 'string' ? ' (' + u.alt[subj[k]] + ')' : '';
  const adds = TYPE_KEYS.map(k =>
    `<button class="add ${k==='text'?'text':''}" data-act="add" data-type="${k}" ${allowed(subj, k) ? '' : 'disabled'}>
       <span class="ic">${ICONS[k]}</span><span>${u.types[k]}${alt(k)}</span></button>`
  ).join('');

  let n = 0;
  const cards = state.tasks.map(t => taskEditor(t, t.type === 'text' ? null : ++n)).join('');

  $('#editor').innerHTML = `
    <div class="ed-head"><h2>${u.settings}</h2>
      <button class="new" data-act="new">${u.newTest}</button></div>

    <label>${u.kind}</label>
    <select data-f="type">
      <option value="СОР" ${state.type==='СОР'?'selected':''}>${u.sorOpt}</option>
      <option value="СОЧ" ${state.type==='СОЧ'?'selected':''}>${u.sochOpt}</option>
    </select>
    ${state.type==='СОР' ? `
      <div class="row">
        <div style="flex:0 0 90px"><label>${u.numSor}</label><input data-f="num" value="${esc(state.num)}"></div>
        <div><label>${u.topic}</label><input data-f="topic" value="${esc(state.topic)}"></div>
      </div>` : ''}
    <label>${u.subject}</label>
    <select data-f="subject">
      <option value="">${u.choose}</option>
      ${Object.keys(SUBJECTS).map(s => `<option value="${s}" ${s===state.subject?'selected':''}>${L.subj[s]}</option>`).join('')}
    </select>
    <div class="row">
      <div><label>${u.quarter}</label><input data-f="quarter" value="${esc(state.quarter)}"></div>
      <div><label>${u.cls}</label><input data-f="cls" value="${esc(state.cls)}"></div>
    </div>
    <label>${u.fio}</label>
    <input data-f="fio" value="${esc(state.fio)}">
    <label>${u.date}</label>
    <input type="date" data-f="date" value="${esc(state.date)}">

    <div class="sec-title">${u.addTask} ${subj ? '' : `<span class="hint">${u.pickSubj}</span>`}</div>
    <div class="adds">${adds}</div>
    <div class="score">${u.maxScore} <b id="sum">${total()}</b></div>

    <div id="tasks">${cards || `<div class="empty-ed">${u.noTasks}<br>${u.noTasks2}</div>`}</div>`;
}

function taskEditor(t, n) {
  const u = U();
  const subj = SUBJECTS[state.subject] || {};
  let body = '';
  const q = (label = u.taskText) =>
    `<label>${label}</label><textarea data-id="${t.id}" data-f="q">${esc(t.q)}</textarea>`;

  if (t.type === 'text') {
    body = `<label>${u.tbTitle}</label>
      <input data-id="${t.id}" data-f="title" value="${esc(t.title)}" placeholder="${esc(u.tbTitlePh)}">
      <label>${u.tbText}</label>
      <textarea data-id="${t.id}" data-f="text" style="min-height:120px" placeholder="${esc(u.tbPh)}">${esc(t.text)}</textarea>
      <p class="hint">${u.tbHint}</p>`;
  } else if (t.type === 'test') {
    body = q(u.question) + `<label>${u.variants}</label>` +
      t.opts.map((o, i) => `<div class="opt">
        <input type="checkbox" data-id="${t.id}" data-f="opts" data-i="${i}" data-s="c" ${o.c?'checked':''}>
        <input data-id="${t.id}" data-f="opts" data-i="${i}" data-s="t" value="${esc(o.t)}" placeholder="${u.variant} ${i+1}">
        <button class="del" data-act="del-opt" data-id="${t.id}" data-i="${i}">×</button></div>`).join('') +
      `<button class="sec" data-act="add-opt" data-id="${t.id}">${u.addVar}</button>`;
  } else if (t.type === 'match') {
    body = q(u.instr) + `<label>${u.pairs}</label>` +
      t.pairs.map((p, i) => `<div class="opt">
        <input data-id="${t.id}" data-f="pairs" data-i="${i}" data-s="l" value="${esc(p.l)}" placeholder="${u.left}">
        <input data-id="${t.id}" data-f="pairs" data-i="${i}" data-s="r" value="${esc(p.r)}" placeholder="${u.right}">
        <button class="del" data-act="del-pair" data-id="${t.id}" data-i="${i}">×</button></div>`).join('') +
      `<button class="sec" data-act="add-pair" data-id="${t.id}">${u.addPair}</button>
       <p class="hint">${u.shuffle}</p>`;
  } else if (t.type === 'gaps') {
    body = q(u.instr) + `<label>${u.gapsL}</label>
      <textarea data-id="${t.id}" data-f="text" style="min-height:90px">${esc(t.text)}</textarea>`;
  } else {
    if (t.type === 'image') body += `<label>${u.image}</label><input type="file" accept="image/*" data-act="img" data-id="${t.id}">`;
    if (t.type === 'audio') body += `<label>${u.kindL}</label><select data-id="${t.id}" data-f="mode">
        <option value="listen" ${isListen(t.mode)?'selected':''}>${LANGS().listen}</option>
        <option value="speak" ${!isListen(t.mode)?'selected':''}>${LANGS().speak}</option></select>
        <label>${u.audioText}</label>
        <textarea data-id="${t.id}" data-f="text">${esc(t.text)}</textarea>`;
    body += q() + `<div class="row"><div><label>${u.lines}</label>
      <input type="number" min="0" data-id="${t.id}" data-f="lines" value="${t.lines}"></div>
      <div><label>${u.ansKey}</label><input data-id="${t.id}" data-f="ans" value="${esc(t.ans)}"></div></div>`;
  }
  const altTxt = t.type === 'open' && typeof subj.open === 'string' ? ' (' + u.alt[subj.open] + ')' : '';
  const title = t.type === 'text' ? `${ICONS.text} ${u.types.text}` : `${n}. ${ICONS[t.type]} ${u.types[t.type]}${altTxt}`;
  return `<div class="card t-${t.type}"><div class="card-h"><b>${title}</b>
    <div><button class="sec" data-act="up" data-id="${t.id}">↑</button>
    <button class="sec" data-act="down" data-id="${t.id}">↓</button>
    <button class="del" data-act="del" data-id="${t.id}">🗑</button></div></div>
    ${body}
    ${t.type === 'text' ? '' : `<label>${u.pts}</label><input type="number" min="0" step="0.5" data-id="${t.id}" data-f="pts" value="${t.pts}">`}</div>`;
}

// ===== Лист для печати =====
function seededShuffle(arr, seed) {
  const a = arr.map((v, i) => ({v, i})); let s = seed;
  for (let i = a.length - 1; i > 0; i--) { s = (s * 9301 + 49297) % 233280; const j = Math.floor(s / 233280 * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; }
  return a;
}

function renderPaper() {
  const s = state, key = s.key, T = LANGS();
  document.documentElement.lang = s.lang || 'ru';
  const d = s.date ? s.date.split('-') : null;
  const dateStr = d ? T.date(d[2], T.months[+d[1]-1], d[0]) : T.dateBlank;
  const subjName = T.subj[s.subject] || s.subject;
  const u = (v, n=20) => v ? `<span class="u">${esc(v)}</span>` : blank(n);

  let h = `<div class="meta">`;
  h += s.type === 'СОР'
    ? `<h1>${T.sor(u(s.num,3), u(s.topic,40))}</h1>`
    : `<h1>${T.soch}</h1>`;
  h += `<p>${T.subject}: ${u(subjName,24)}</p>
    <p>${T.quarter}: ${u(s.quarter,5)}</p><p>${T.cls}: ${u(s.cls,8)}</p>
    <p>${T.fio}: ${u(s.fio,50)}</p>
    <p>${T.dateL}: ${dateStr}</p>
    <p>${T.max}: <b>${total()}</b></p>
    <p>${T.got}: ______</p></div><hr>`;

  let n = 0;
  s.tasks.forEach(t => {
    if (t.type === 'text') {
      if (t.title || t.text) {
        h += `<div class="textblock">${t.title ? `<div class="tb-t">${esc(t.title)}</div>` : ''}<div>${nl(t.text)}</div></div>`;
      }
      return;
    }
    n++;
    h += `<div class="task"><div class="tt">${T.task} ${n}. <span class="pts">[${t.pts} ${T.pt}]</span></div>`;
    if (t.q) h += `<div>${nl(t.q)}</div>`;

    if (t.type === 'test') {
      h += `<div class="opts">` + t.opts.filter(o => o.t).map((o, i) =>
        `<div class="${key && o.c ? 'ans' : ''}">${T.opt[i]}) ${esc(o.t)}${key && o.c ? ' ✔' : ''}</div>`).join('') + `</div>`;
    } else if (t.type === 'match') {
      const ps = t.pairs.filter(p => p.l || p.r);
      const sh = seededShuffle(ps, t.id % 1000 + 7);
      h += `<table class="mt">` + ps.map((p, i) => `<tr><td>${i+1}. ${esc(p.l)}</td><td class="mid">${key ? '' : '——'}</td>
        <td>${T.let[i]}. ${esc(sh[i].v.r)}</td></tr>`).join('') + `</table>`;
      if (key) {
        h += `<div class="ans">${T.keyL}: ` + ps.map((p, i) => `${i+1}–${T.let[sh.findIndex(x => x.i === i)]}`).join(', ') + `</div>`;
      }
    } else if (t.type === 'gaps') {
      const txt = esc(t.text);
      h += `<div>` + txt.replace(/\*([^*]+)\*/g, (m, w) => key ? `<span class="ans">${w}</span>` : `<span class="u" style="min-width:${Math.max(60, w.length*9)}px"></span>`).replace(/\n/g,'<br>') + `</div>`;
    } else {
      if (t.type === 'audio') {
        h += `<div><i>${isListen(t.mode) ? T.listen : T.speak}</i></div>`;
        if (key && t.text) h += `<div class="ans">${T.teacherText}: ${nl(t.text)}</div>`;
      }
      if (t.type === 'image' && t.src) h += `<img src="${t.src}" alt="">`;
      if (key && t.ans) h += `<div class="ans">${T.ansL}: ${nl(t.ans)}</div>`;
      else if (+t.lines > 0) h += `<div class="lines">${'<div></div>'.repeat(+t.lines)}</div>`;
    }
    h += `</div>`;
  });
  if (!s.tasks.length) h += `<p class="empty">${T.empty}</p>`;
  $('#paper').innerHTML = h;
  const sum = $('#sum'); if (sum) sum.textContent = total();
}

function refresh(full) { if (full) renderEditor(); renderPaper(); save(); }

// ===== События =====
const ed = $('#editor');
ed.addEventListener('input', e => {
  const el = e.target, f = el.dataset.f; if (!f) return;
  const val = el.type === 'checkbox' ? el.checked : el.value;
  if (el.dataset.id) {
    const t = state.tasks.find(x => x.id == el.dataset.id);
    if (el.dataset.i !== undefined) t[f][el.dataset.i][el.dataset.s] = val;
    else t[f] = val;
  } else {
    state[f] = val;
    if (f === 'type' || f === 'subject') {
      if (f === 'subject') state.tasks = state.tasks.filter(t => allowed(SUBJECTS[val], t.type));
      return refresh(true);
    }
  }
  refresh(false);
});

ed.addEventListener('click', e => {
  const b = e.target.closest('button'); if (!b) return;
  const a = b.dataset.act, id = b.dataset.id;
  if (a === 'new') return newTest();
  const tasks = state.tasks, idx = tasks.findIndex(x => x.id == id), t = tasks[idx];
  if (a === 'add') tasks.push(newTask(b.dataset.type));
  else if (a === 'del') tasks.splice(idx, 1);
  else if (a === 'up' && idx > 0) [tasks[idx-1], tasks[idx]] = [tasks[idx], tasks[idx-1]];
  else if (a === 'down' && idx < tasks.length-1) [tasks[idx+1], tasks[idx]] = [tasks[idx], tasks[idx+1]];
  else if (a === 'add-opt') t.opts.push({t:'',c:false});
  else if (a === 'del-opt') t.opts.splice(b.dataset.i, 1);
  else if (a === 'add-pair') t.pairs.push({l:'',r:''});
  else if (a === 'del-pair') t.pairs.splice(b.dataset.i, 1);
  else return;
  refresh(true);
  if (a === 'add') { const cs = document.querySelectorAll('#tasks .card'); cs[cs.length-1]?.scrollIntoView({behavior:'smooth', block:'center'}); }
});

ed.addEventListener('change', e => {
  if (e.target.dataset.act !== 'img') return;
  const file = e.target.files[0]; if (!file) return;
  const r = new FileReader();
  r.onload = () => { state.tasks.find(x => x.id == e.target.dataset.id).src = r.result; refresh(false); };
  r.readAsDataURL(file);
});

$('#keyChk').addEventListener('change', e => { state.key = e.target.checked; refresh(false); });

// ===== Экспорт =====
function download(name, content, mime) {
  const a = document.createElement('a');
  a.href = URL.createObjectURL(new Blob([content], {type: mime}));
  a.download = name; a.click(); URL.revokeObjectURL(a.href);
}
function exportDoc() {
  const html = `<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:w="urn:schemas-microsoft-com:office:word"><head><meta charset="utf-8"><title>Test maker</title>
    <style>body{font-family:'Times New Roman';font-size:14pt}.lines div{border-bottom:1px solid #000;height:24pt}.u{border-bottom:1px solid #000}.textblock{border:1px solid #666;padding:6pt;margin:8pt 0}.tb-t{font-weight:bold}</style></head><body>${$('#paper').innerHTML}</body></html>`;
  const subj = (LANGS().subj[state.subject] || 'test').replace(/[\\/:*?"<>|]/g, '-');
  download(`Test maker - ${state.type} - ${subj}.doc`, '\ufeff' + html, 'application/msword');
  toast(U().toastWord);
}
function exportJson() { download('Test maker.json', JSON.stringify(state, null, 2), 'application/json'); toast(U().toastJson); }
$('#imp').addEventListener('change', e => {
  const f = e.target.files[0]; if (!f) return;
  const r = new FileReader();
  r.onload = () => {
    try { state = fix(JSON.parse(r.result)); $('#keyChk').checked = !!state.key; setLang(state.lang); toast(U().toastOpen); }
    catch (err) { alert(U().errOpen); }
    e.target.value = '';
  };
  r.readAsText(f);
});

// ===== Язык интерфейса и теста =====
function setLang(l) {
  state.lang = l;
  document.querySelectorAll('[data-lang]').forEach(b => b.classList.toggle('active', b.dataset.lang === l));
  applyStatic();
  refresh(true);
}
document.querySelectorAll('[data-lang]').forEach(b => b.addEventListener('click', () => setLang(b.dataset.lang)));

$('#keyChk').checked = !!state.key;
setLang(state.lang || 'ru');
