// js/app.js
// --------------------- DATA MODEL -------------------------

const EMOJIS_LIST = ['🗣️','✈️','🍽️','🛍️','💼','💬','🗺️','🏨','🏥','🚨','🚌','📚','🏠','😊','📱','🤝','🎉','🏋️','🌍','🎓','🏦','🎭','🏖️','🍕','🎵','💡','🧳','🔑','🌙','☀️','💘','⚡','👔','👤','🎓','💼','💊','🎨','👨‍👩‍👧','⏰','💑','📈'];

let categories = [];
let phrases = [];
let nextId = 1000;
let openSections = new Set();
let openSubcats = new Set();
let currentSearch = "";
let currentEditId = null;
let translateTimeout = null;

// Categorias padrão com a nova subcategoria Trends
const DEFAULT_CATEGORIES = [
  { id: "personal", name: "Personal", emoji: "👤", subcats: [
    { id: "about_me", name: "About Me", emoji: "👤" },
    { id: "about_me_trends", name: "Trends", emoji: "📈" },
    { id: "about_love", name: "About Love", emoji: "💘" },
    { id: "about_family", name: "About Family", emoji: "👨‍👩‍👧" },
    { id: "about_routine", name: "About Routine", emoji: "⏰" },
    { id: "lengths_speaking", name: "Lengths for Speaking", emoji: "🗣️" }
  ] },
  { id: "school", name: "School", emoji: "🎓", subcats: [
    { id: "college_ads", name: "College & Ads", emoji: "🎓" },
    { id: "arte_conversacao", name: "Arte da Conversação", emoji: "💬" }
  ] },
  { id: "work", name: "Work", emoji: "💼", subcats: [
    { id: "oxygen", name: "Oxygen", emoji: "💊" },
    { id: "lider_tintas", name: "Lider Tintas", emoji: "🎨" },
    { id: "voluntary", name: "Voluntary", emoji: "🤝" }
  ] },
  { id: "routine", name: "Rotina", emoji: "⏰", subcats: [
  { id: "morning", name: "Manhã", emoji: "🌅" },
  { id: "afternoon", name: "Tarde", emoji: "☀️" },
  { id: "evening_night", name: "Noite", emoji: "🌙" }
] }
];

// Frases padrão com as novas frases de Trends
const DEFAULT_PHRASES = [
  {id:1, en:"I study Software Engineering in college.", pt:"Eu estudo engenharia de software na faculdade.", cat:"school", subcat:"college_ads"},
  {id:2, en:"I'd like to do mine like that too.", pt:"Eu também gostaria de fazer o meu assim.", cat:"school", subcat:"college_ads"},
  {id:3, en:"Are you naked? For God's sake, I'm already tired of seeing dicks today.", pt:"Você está nu? Pelo amor de Deus, já estou cansado de ver pênis hoje.", cat:"personal", subcat:"lengths_speaking"},
  {id:4, en:"Man, why are you naked?", pt:"Por que você está pelado?", cat:"personal", subcat:"lengths_speaking"},
  {id:5, en:"In Brazil, my name is Kaiky, but abroad people call me Kaike, Kaique, Kike.", pt:"No Brasil, meu nome é Kaiky, mas fora me chamam de Kaike, Kaique, Kike.", cat:"personal", subcat:"about_me"},
  {id:6, en:"If I make mistakes, please correct me.", pt:"Se eu errar me corrija.", cat:"personal", subcat:"about_me"},
  {id:7, en:"I am scared.", pt:"Estou com medo.", cat:"personal", subcat:"about_me"},
  {id:8, en:"prove it to me", pt:"prove para mim", cat:"personal", subcat:"about_me"},
  {id:9, en:"Prove it to me—I'll believe it when I see it.", pt:"Prove para mim — só acredito vendo.", cat:"personal", subcat:"about_me"},
  {id:10, en:"I work with medical oxygen.", pt:"Eu trabalho com oxigênio medicinal.", cat:"work", subcat:"oxygen"},
  {id:11, en:"My job helps people breathe better.", pt:"Meu trabalho faz pessoas respirarem melhor.", cat:"work", subcat:"oxygen"},
  {id:12, en:"I deliver medical oxygen to patients at home.", pt:"Entrego oxigênio medicinal em casa.", cat:"work", subcat:"oxygen"},
  {id:13, en:"I'm in a relationship.", pt:"Estou em um relacionamento.", cat:"personal", subcat:"about_love"},
  {id:14, en:"I'm dating a 45-year-old woman.", pt:"Estou namorando uma mulher de 45 anos.", cat:"personal", subcat:"about_love"},
  {id:15, en:"She was my teacher back then.", pt:"Ela era minha professora naquela época.", cat:"personal", subcat:"about_love"},
  {id:16, en:"We've been together for almost five years.", pt:"Estamos juntos há quase cinco anos.", cat:"personal", subcat:"about_love"},
  {id:17, en:"I'm in my third semester of Software Engineering.", pt:"Estou no terceiro semestre de Engenharia de Software.", cat:"school", subcat:"college_ads"},
  {id:18, en:"Your hair is similar to mine.", pt:"Seu cabelo é parecido com o meu.", cat:"personal", subcat:"about_me"},
  {id:19, en:"I'm not an atheist, but I don't follow any religion.", pt:"Eu não sou ateu, mas não sigo religião.", cat:"personal", subcat:"about_me"},
  {id:20, en:"How did you get there?", pt:"Como você chegou aí?", cat:"personal", subcat:"about_me"},
  {id:21, en:"Where were you born?", pt:"Onde você nasceu?", cat:"personal", subcat:"about_me"},
  {id:22, en:"What is your country like?", pt:"Como é o seu país?", cat:"personal", subcat:"about_me"},
  {id:23, en:"Are you hitting on me? I already have a girlfriend.", pt:"Você está dando em cima de mim? Eu já tenho namorada.", cat:"personal", subcat:"about_love"},
  {id:24, en:"What brings you here?", pt:"O que te traz aqui?", cat:"personal", subcat:"about_me"},
  
  // NOVAS FRASES - TRENDS
  {id:25, en:"in that case", pt:"nesse caso", cat:"personal", subcat:"about_me_trends"},
  {id:26, en:"beats me", pt:"sei lá", cat:"personal", subcat:"about_me_trends"},
  {id:27, en:"then get on with it", pt:"então vamos logo com isso", cat:"personal", subcat:"about_me_trends"},
  {id:28, en:"messi is the shit", pt:"messi é o melhor", cat:"personal", subcat:"about_me_trends"},
  {id:29, en:"go crazy", pt:"manda ver / fique à vontade", cat:"personal", subcat:"about_me_trends"},
  {id:30, en:"where the hell you been?", pt:"onde diabos você esteve?", cat:"personal", subcat:"about_me_trends"},
  {id:31, en:"believe it or not!", pt:"acredite se quiser!", cat:"personal", subcat:"about_me_trends"},
  {id:32, en:"be my guest", pt:"fique à vontade", cat:"personal", subcat:"about_me_trends"},
  {id:33, en:"FYI", pt:"para sua informação", cat:"personal", subcat:"about_me_trends"},
  {id:34, en:"not too shabby", pt:"nada mal", cat:"personal", subcat:"about_me_trends"},
  {id:35, en:"I'm game", pt:"eu topo / eu tô dentro", cat:"personal", subcat:"about_me_trends"},
  {id:36, en:"first of all", pt:"primeiramente", cat:"personal", subcat:"about_me_trends"},
  {id:37, en:"I'm in a hurry", pt:"estou com pressa", cat:"personal", subcat:"about_me_trends"},
  {id:38, en:"BRB (be right back)", pt:"já volto", cat:"personal", subcat:"about_me_trends"},
  {id:39, en:"pretty please", pt:"porfavorzinho", cat:"personal", subcat:"about_me_trends"},
  {id:40, en:"bring it on", pt:"manda ver", cat:"personal", subcat:"about_me_trends"},
  {id:41, en:"cut it out", pt:"pare com isso", cat:"personal", subcat:"about_me_trends"},
  {id:42, en:"I wouldn't say that", pt:"eu não diria isso", cat:"personal", subcat:"about_me_trends"},
  {id:43, en:"for real?", pt:"é sério?", cat:"personal", subcat:"about_me_trends"},
  {id:44, en:"it makes no sense!", pt:"isso não faz sentido!", cat:"personal", subcat:"about_me_trends"},
  {id:45, en:"I feel you", pt:"eu te entendo", cat:"personal", subcat:"about_me_trends"},
  {id:46, en:"I gotcha", pt:"entendi / saquei", cat:"personal", subcat:"about_me_trends"},
  {id:47, en:"I don't get it", pt:"não entendi", cat:"personal", subcat:"about_me_trends"},
  {id:48, en:"hit me up", pt:"entre em contato", cat:"personal", subcat:"about_me_trends"},
  {id:49, en:"I'm screwed up", pt:"cometi um erro / estou enrolado", cat:"personal", subcat:"about_me_trends"},

  // ROTINA - MANHÃ (morning)
{id:100, en:"I usually wake up at 7 AM.", pt:"Eu normalmente acordo às 7 da manhã.", cat:"routine", subcat:"morning"},
{id:101, en:"My alarm goes off at 6:30.", pt:"Meu despertador toca às 6:30.", cat:"routine", subcat:"morning"},
{id:102, en:"I hit the snooze button twice.", pt:"Aperto a soneca duas vezes.", cat:"routine", subcat:"morning"},
{id:103, en:"I get out of bed around 7.", pt:"Eu saio da cama por volta das 7.", cat:"routine", subcat:"morning"},
{id:104, en:"I take a shower every morning.", pt:"Tomo banho toda manhã.", cat:"routine", subcat:"morning"},
{id:105, en:"I brush my teeth and wash my face.", pt:"Escovo os dentes e lavo o rosto.", cat:"routine", subcat:"morning"},
{id:106, en:"I have breakfast at 7:30.", pt:"Tomo café da manhã às 7:30.", cat:"routine", subcat:"morning"},
{id:107, en:"I drink a cup of coffee to wake up.", pt:"Bebo uma xícara de café para despertar.", cat:"routine", subcat:"morning"},
{id:108, en:"I get dressed for the day.", pt:"Me visto para o dia.", cat:"routine", subcat:"morning"},
{id:109, en:"I pack my bag before leaving.", pt:"Arrumo minha mochila antes de sair.", cat:"routine", subcat:"morning"},
{id:110, en:"I leave home at 8 AM.", pt:"Saio de casa às 8 da manhã.", cat:"routine", subcat:"morning"},
{id:111, en:"I commute to work by bus.", pt:"Vou para o trabalho de ônibus.", cat:"routine", subcat:"morning"},
{id:112, en:"I'm a morning person.", pt:"Sou uma pessoa matutina.", cat:"routine", subcat:"morning"},
{id:113, en:"I can't function without coffee.", pt:"Não funciono sem café.", cat:"routine", subcat:"morning"},
{id:114, en:"I like to exercise in the morning.", pt:"Gosto de me exercitar de manhã.", cat:"routine", subcat:"morning"},
{id:115, en:"I check my messages as soon as I wake up.", pt:"Verifico minhas mensagens assim que acordo.", cat:"routine", subcat:"morning"},

// ROTINA - TARDE (afternoon)
{id:116, en:"I have lunch around noon.", pt:"Almoço por volta do meio-dia.", cat:"routine", subcat:"afternoon"},
{id:117, en:"I take a short break after lunch.", pt:"Faço uma pausa curta após o almoço.", cat:"routine", subcat:"afternoon"},
{id:118, en:"I go back to work at 1 PM.", pt:"Volto ao trabalho às 13h.", cat:"routine", subcat:"afternoon"},
{id:119, en:"I have a meeting in the afternoon.", pt:"Tenho uma reunião à tarde.", cat:"routine", subcat:"afternoon"},
{id:120, en:"I feel tired around 3 PM.", pt:"Me sinto cansado por volta das 15h.", cat:"routine", subcat:"afternoon"},
{id:121, en:"I drink an afternoon coffee.", pt:"Bebo um café da tarde.", cat:"routine", subcat:"afternoon"},
{id:122, en:"I run errands in the afternoon.", pt:"Faço compras/recados à tarde.", cat:"routine", subcat:"afternoon"},
{id:123, en:"I study after work.", pt:"Estudo depois do trabalho.", cat:"routine", subcat:"afternoon"},
{id:124, en:"I go to the gym in the late afternoon.", pt:"Vou à academia no fim da tarde.", cat:"routine", subcat:"afternoon"},
{id:125, en:"I pick up my kids from school.", pt:"Busco meus filhos na escola.", cat:"routine", subcat:"afternoon"},
{id:126, en:"The afternoon goes by quickly.", pt:"A tarde passa rápido.", cat:"routine", subcat:"afternoon"},
{id:127, en:"I take a nap after lunch.", pt:"Tiro uma soneca após o almoço.", cat:"routine", subcat:"afternoon"},
{id:128, en:"I'm most productive in the afternoon.", pt:"Sou mais produtivo à tarde.", cat:"routine", subcat:"afternoon"},
{id:129, en:"I finish work at 6 PM.", pt:"Termino o trabalho às 18h.", cat:"routine", subcat:"afternoon"},

// ROTINA - NOITE (evening_night)
{id:130, en:"I get home around 7 PM.", pt:"Chego em casa por volta das 19h.", cat:"routine", subcat:"evening_night"},
{id:131, en:"I cook dinner for my family.", pt:"Cozinho o jantar para minha família.", cat:"routine", subcat:"evening_night"},
{id:132, en:"I have dinner at 8 PM.", pt:"Janto às 20h.", cat:"routine", subcat:"evening_night"},
{id:133, en:"I watch TV after dinner.", pt:"Assisto TV depois do jantar.", cat:"routine", subcat:"evening_night"},
{id:134, en:"I take a shower before bed.", pt:"Tomo banho antes de dormir.", cat:"routine", subcat:"evening_night"},
{id:135, en:"I scroll through social media at night.", pt:"Fico nas redes sociais à noite.", cat:"routine", subcat:"evening_night"},
{id:136, en:"I read a book before sleeping.", pt:"Leio um livro antes de dormir.", cat:"routine", subcat:"evening_night"},
{id:137, en:"I set my alarm for tomorrow.", pt:"Coloco o despertador para amanhã.", cat:"routine", subcat:"evening_night"},
{id:138, en:"I go to bed around 11 PM.", pt:"Vou para a cama por volta das 23h.", cat:"routine", subcat:"evening_night"},
{id:139, en:"I have trouble falling asleep.", pt:"Tenho dificuldade para pegar no sono.", cat:"routine", subcat:"evening_night"},
{id:140, en:"I'm a night owl.", pt:"Sou uma pessoa noturna.", cat:"routine", subcat:"evening_night"},
{id:141, en:"I need at least 7 hours of sleep.", pt:"Preciso de pelo menos 7 horas de sono.", cat:"routine", subcat:"evening_night"},
{id:142, en:"I plan my next day before sleeping.", pt:"Planejo meu próximo dia antes de dormir.", cat:"routine", subcat:"evening_night"},
{id:143, en:"I relax and unwind at night.", pt:"Eu relaxo e descontraio à noite.", cat:"routine", subcat:"evening_night"},
{id:144, en:"I turn off my phone an hour before bed.", pt:"Desligo meu celular uma hora antes de dormir.", cat:"routine", subcat:"evening_night"},
{id:145, en:"Good night, sleep well!", pt:"Boa noite, durma bem!", cat:"routine", subcat:"evening_night"},
{id:146, en:"I need to fix my sleep schedule.", pt:"Preciso arrumar meu horário de sono.", cat:"routine", subcat:"evening_night"},
];

// Função para carregar dados do localStorage
function loadData() {
  const storedCats = localStorage.getItem('rp_cats_v5');
  const storedPhrases = localStorage.getItem('rp_phrases_v5');
  
  if(storedCats) {
    categories = JSON.parse(storedCats);
  } else {
    categories = JSON.parse(JSON.stringify(DEFAULT_CATEGORIES));
  }
  
  if(storedPhrases) {
    phrases = JSON.parse(storedPhrases);
  } else {
    phrases = JSON.parse(JSON.stringify(DEFAULT_PHRASES));
  }
  
  // Garantir que todas as categorias tenham subcats
  categories = categories.map(cat => {
    if(!cat.subcats || cat.subcats.length === 0) {
      const defaultCat = DEFAULT_CATEGORIES.find(dc => dc.id === cat.id);
      if(defaultCat) {
        cat.subcats = defaultCat.subcats;
      } else {
        cat.subcats = [];
      }
    }
    return cat;
  });
  
  nextId = Math.max(...phrases.map(p=>p.id), 0, 1000) + 1;
  categories.forEach(c => openSections.add(c.id));
  persist();
}

function persist() {
  localStorage.setItem('rp_cats_v5', JSON.stringify(categories));
  localStorage.setItem('rp_phrases_v5', JSON.stringify(phrases));
}

// Função de tradução
async function autoTranslate(text) {
  if(!text || text.trim().length<2) return "";
  try {
    const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=pt&dt=t&q=${encodeURIComponent(text)}`;
    const res = await fetch(url);
    const data = await res.json();
    return data[0]?.map(x=>x[0]).join('') || "";
  } catch{ return ""; }
}

function triggerAutoTranslate() {
  const enInput = document.getElementById('phraseEn');
  const preview = document.getElementById('translatePreview');
  const val = enInput.value;
  if(!val.trim()){ preview.innerHTML = "🔮 Tradução automática..."; return; }
  preview.innerHTML = "🌀 traduzindo...";
  clearTimeout(translateTimeout);
  translateTimeout = setTimeout(async () => {
    const translated = await autoTranslate(val);
    if(translated) {
      preview.innerHTML = `🇧🇷 ${translated}`;
      const ptField = document.getElementById('phrasePt');
      if(!ptField.dataset.manual) ptField.value = translated;
    } else { preview.innerHTML = "⚠️ não foi possível traduzir"; }
  }, 500);
}

// Funções de toggle
window.toggleSection = function(id) {
  if(openSections.has(id)) openSections.delete(id);
  else openSections.add(id);
  render();
}

window.toggleSubcat = function(subcatId, event) {
  if(event) event.stopPropagation();
  if(openSubcats.has(subcatId)) openSubcats.delete(subcatId);
  else openSubcats.add(subcatId);
  render();
}

window.toggleUncategorized = function(id, event) {
  if(event) event.stopPropagation();
  const content = document.getElementById(id + '_content');
  if(!content) return;
  const isVisible = content.style.display === 'block';
  content.style.display = isVisible ? 'none' : 'block';
  if(!window._uncatState) window._uncatState = {};
  window._uncatState[id] = !isVisible;
}

// Utilitários
function escapeHtml(str) { 
  return String(str).replace(/[&<>]/g, function(m){
    if(m==='&') return '&amp;'; 
    if(m==='<') return '&lt;'; 
    if(m==='>') return '&gt;'; 
    return m;
  });
}

function highlightText(text, query) { 
  const escText = escapeHtml(text); 
  const escQ = query.replace(/[.*+?^${}()|[\]\\]/g,'\\$&'); 
  return escText.replace(new RegExp(`(${escQ})`,'gi'),'<mark>$1</mark>'); 
}

function showToast(msg) {
  const toast = document.getElementById('toastMsg');
  toast.innerText = msg; 
  toast.classList.add('show');
  setTimeout(()=>toast.classList.remove('show'),2500);
}

// Áudio
let currentUtterance = null;

window.speakPhraseById = function(id) {
  const phrase = phrases.find(p=>p.id===id);
  if(!phrase) return;
  if(currentUtterance) window.speechSynthesis.cancel();
  const utter = new SpeechSynthesisUtterance(phrase.en);
  utter.lang='en-US'; 
  utter.rate=0.9;
  window.speechSynthesis.speak(utter);
  currentUtterance = utter;
  showToast(`🔊 Speaking: ${phrase.en.substring(0,50)}`);
}

window.downloadAudioById = function(id) {
  const phrase = phrases.find(p=>p.id===id);
  if(!phrase) return;
  const url = `https://translate.google.com/translate_tts?ie=UTF-8&q=${encodeURIComponent(phrase.en)}&tl=en&client=tw-ob`;
  const a = document.createElement('a'); 
  a.href=url; 
  a.download = `phrase_${phrase.id}.mp3`; 
  a.click();
  showToast("⬇️ Download iniciado");
}

// Renderização principal
function render() {
  const container = document.getElementById('categoriesContainer');
  const search = currentSearch.toLowerCase().trim();
  let html = "";
  
  for(let cat of categories) {
    let catPhrases = phrases.filter(p=>p.cat === cat.id);
    let filtered = search ? catPhrases.filter(p=>p.en.toLowerCase().includes(search) || p.pt.toLowerCase().includes(search)) : catPhrases;
    const isOpen = search ? filtered.length>0 : openSections.has(cat.id);
    const openClass = isOpen ? "open" : "";
    
    html += `<div class="category-card ${openClass}" data-catid="${cat.id}">
      <div class="category-header" onclick="toggleSection('${cat.id}')">
        <div class="cat-left">
          <span class="cat-arrow">▶</span>
          <span class="cat-emoji">${cat.emoji || '📁'}</span>
          <span class="cat-name">${escapeHtml(cat.name)}</span>
          <span class="cat-badge">${filtered.length}</span>
        </div>
        <div class="cat-actions" onclick="event.stopPropagation()">
          <button class="cat-icon-btn" onclick="openAddSubcat('${cat.id}')" title="Adicionar subcategoria">📂+</button>
          <button class="cat-icon-btn" onclick="openAddPhraseWithCat('${cat.id}')" title="Adicionar frase">+</button>
          <button class="cat-icon-btn" onclick="deleteCategoryPrompt('${cat.id}')" title="Remover categoria">🗑</button>
        </div>
      </div>
      <div class="category-body">`;
    
    if(filtered.length===0 && !search){
      html += `<div class="empty-cat">✨ Nenhuma frase — clique + para adicionar</div>`;
    } else {
      const subcats = cat.subcats || [];
      if(subcats.length > 0) {
        for(let subcat of subcats) {
          let subcatPhrases = filtered.filter(p => p.subcat === subcat.id);
          const subcatOpen = search ? subcatPhrases.length>0 : openSubcats.has(subcat.id);
          html += `<div class="subcategory-group ${subcatOpen ? 'open' : ''}" data-subcatid="${subcat.id}">
            <div class="subcategory-header" onclick="toggleSubcat('${subcat.id}', event)">
              <div class="subcategory-title">
                <span class="subcat-arrow">▶</span>
                <span>${subcat.emoji || '📂'}</span>
                <span>${escapeHtml(subcat.name)}</span>
                <span class="cat-badge">${subcatPhrases.length}</span>
              </div>
              <div class="subcategory-actions" onclick="event.stopPropagation()">
                <button class="subcat-icon-btn" onclick="editSubcat('${cat.id}', '${subcat.id}')" title="Editar subcategoria">✏️</button>
                <button class="subcat-icon-btn del" onclick="deleteSubcat('${cat.id}', '${subcat.id}')" title="Remover subcategoria">🗑</button>
              </div>
            </div>
            <div class="subcategory-phrases">`;
          
          for(let p of subcatPhrases){
            const enHighlight = search ? highlightText(p.en,search) : escapeHtml(p.en);
            const ptHighlight = search ? highlightText(p.pt,search) : escapeHtml(p.pt);
            html += `<div class="phrase-item" data-pid="${p.id}">
              <div class="phrase-content">
                <div class="phrase-texts">
                  <div class="phrase-en">${enHighlight}</div>
                  <div class="phrase-pt">${ptHighlight}</div>
                </div>
                <div class="phrase-actions">
                  <button class="icon-btn play" onclick="speakPhraseById(${p.id})">🔊</button>
                  <button class="icon-btn dl" onclick="downloadAudioById(${p.id})">⬇️</button>
                  <button class="icon-btn" onclick="editPhrase(${p.id})">✏️</button>
                  <button class="icon-btn del" onclick="deletePhraseQuick(${p.id})">🗑</button>
                </div>
              </div>
            </div>`;
          }
          if(subcatPhrases.length === 0 && !search){
            html += `<div class="empty-cat" style="padding:16px">✨ Nenhuma frase nesta subcategoria</div>`;
          }
          html += `<div class="add-phrase-footer" style="margin-top:8px"><button onclick="openAddPhraseWithSubcat('${cat.id}', '${subcat.id}')">➕ Adicionar frase em ${escapeHtml(subcat.name)}</button></div>
            </div>
          </div>`;
        }
      }
      
      let uncategorized = filtered.filter(p => !p.subcat || p.subcat === "");
      if(uncategorized.length > 0) {
        html += `<div class="subcategory-group">
          <div class="subcategory-header" onclick="toggleUncategorized('uncat_${cat.id}', event)">
            <div class="subcategory-title">
              <span class="subcat-arrow">▶</span>
              <span>📄</span>
              <span>Sem subcategoria</span>
              <span class="cat-badge">${uncategorized.length}</span>
            </div>
          </div>
          <div class="subcategory-phrases" id="uncat_${cat.id}_content" style="display:none">`;
        for(let p of uncategorized){
          const enHighlight = search ? highlightText(p.en,search) : escapeHtml(p.en);
          const ptHighlight = search ? highlightText(p.pt,search) : escapeHtml(p.pt);
          html += `<div class="phrase-item"><div class="phrase-content"><div class="phrase-texts"><div class="phrase-en">${enHighlight}</div><div class="phrase-pt">${ptHighlight}</div></div><div class="phrase-actions"><button class="icon-btn play" onclick="speakPhraseById(${p.id})">🔊</button><button class="icon-btn dl" onclick="downloadAudioById(${p.id})">⬇️</button><button class="icon-btn" onclick="editPhrase(${p.id})">✏️</button><button class="icon-btn del" onclick="deletePhraseQuick(${p.id})">🗑</button></div></div></div>`;
        }
        html += `<div class="add-phrase-footer" style="margin-top:8px"><button onclick="openAddPhraseWithCat('${cat.id}')">➕ Adicionar frase sem subcategoria</button></div>
          </div>
        </div>`;
      }
    }
    html += `</div></div>`;
  }
  container.innerHTML = html;
  
  if(window._uncatState) {
    for(let id in window._uncatState) {
      const el = document.getElementById(id + '_content');
      if(el) el.style.display = window._uncatState[id] ? 'block' : 'none';
    }
  }
}

// Subcategoria functions
window.openAddSubcat = function(catId) {
  document.getElementById('subcatModalTitle').innerText = "➕ Nova Subcategoria";
  document.getElementById('subcatName').value = "";
  document.getElementById('subcatEmoji').value = "📂";
  document.getElementById('subcatParentCat').value = catId;
  document.getElementById('subcatEditId').value = "";
  document.getElementById('subcatDeleteBtn').style.display = "none";
  document.getElementById('subcatModal').classList.add('open');
}

window.editSubcat = function(catId, subcatId) {
  const cat = categories.find(c => c.id === catId);
  if(!cat) return;
  const subcat = cat.subcats.find(s => s.id === subcatId);
  if(!subcat) return;
  document.getElementById('subcatModalTitle').innerText = "✏️ Editar Subcategoria";
  document.getElementById('subcatName').value = subcat.name;
  document.getElementById('subcatEmoji').value = subcat.emoji || "📂";
  document.getElementById('subcatParentCat').value = catId;
  document.getElementById('subcatEditId').value = subcatId;
  document.getElementById('subcatDeleteBtn').style.display = "inline-flex";
  document.getElementById('subcatModal').classList.add('open');
}

window.deleteSubcat = function(catId, subcatId) {
  if(confirm("Remover esta subcategoria? Todas as frases dela ficarão sem subcategoria.")) {
    const cat = categories.find(c => c.id === catId);
    if(cat) {
      cat.subcats = cat.subcats.filter(s => s.id !== subcatId);
      phrases.forEach(p => {
        if(p.cat === catId && p.subcat === subcatId) {
          p.subcat = "";
        }
      });
      persist();
      render();
      showToast("🗑 Subcategoria removida");
    }
  }
}

function saveSubcat() {
  const name = document.getElementById('subcatName').value.trim();
  const emoji = document.getElementById('subcatEmoji').value.trim() || "📂";
  const catId = document.getElementById('subcatParentCat').value;
  const editId = document.getElementById('subcatEditId').value;
  
  if(!name) { showToast("⚠️ Nome da subcategoria obrigatório"); return; }
  
  const cat = categories.find(c => c.id === catId);
  if(!cat) return;
  
  if(editId) {
    const idx = cat.subcats.findIndex(s => s.id === editId);
    if(idx !== -1) {
      cat.subcats[idx] = { ...cat.subcats[idx], name, emoji };
    }
  } else {
    const newId = name.toLowerCase().replace(/[^a-z0-9]/g,'-') + "-" + Date.now();
    cat.subcats.push({ id: newId, name, emoji });
  }
  
  persist();
  render();
  closeModals();
  showToast(editId ? "✅ Subcategoria atualizada" : "✅ Subcategoria criada");
}

function deleteSubcatFromModal() {
  const catId = document.getElementById('subcatParentCat').value;
  const editId = document.getElementById('subcatEditId').value;
  if(editId && confirm("Remover esta subcategoria?")) {
    const cat = categories.find(c => c.id === catId);
    if(cat) {
      cat.subcats = cat.subcats.filter(s => s.id !== editId);
      phrases.forEach(p => {
        if(p.cat === catId && p.subcat === editId) p.subcat = "";
      });
      persist();
      render();
      closeModals();
      showToast("🗑 Subcategoria removida");
    }
  }
}

// Modal Phrase functions
function updateSubcatSelect(catId) {
  const subcatSelect = document.getElementById('phraseSubcat');
  const cat = categories.find(c => c.id === catId);
  subcatSelect.innerHTML = '<option value="">-- Sem subcategoria --</option>';
  if(cat && cat.subcats) {
    cat.subcats.forEach(sub => {
      subcatSelect.innerHTML += `<option value="${sub.id}">${sub.emoji} ${escapeHtml(sub.name)}</option>`;
    });
  }
}

function populateCatSelect(selectedId){
  const select = document.getElementById('phraseCat');
  select.innerHTML = categories.map(c=>`<option value="${c.id}" ${c.id===selectedId ? 'selected' : ''}>${c.emoji} ${escapeHtml(c.name)}</option>`).join('');
}

window.openAddPhraseWithCat = function(catId){
  openAddPhraseWithSubcat(catId, "");
}

window.openAddPhraseWithSubcat = function(catId, subcatId) {
  currentEditId = null;
  document.getElementById('phraseModalTitle').innerText = "📝 Nova Frase";
  document.getElementById('phraseEn').value = "";
  document.getElementById('phrasePt').value = "";
  document.getElementById('translatePreview').innerHTML = "🔮 Tradução automática...";
  document.getElementById('editPhraseId').value = "";
  document.getElementById('modalDeleteBtn').style.display = "none";
  populateCatSelect(catId);
  updateSubcatSelect(catId);
  document.getElementById('phraseSubcat').value = subcatId;
  document.getElementById('phraseModal').classList.add('open');
  document.getElementById('phraseEn').focus();
  delete document.getElementById('phrasePt').dataset.manual;
}

window.editPhrase = function(id) {
  const p = phrases.find(x=>x.id===id);
  if(!p) return;
  currentEditId = id;
  document.getElementById('phraseModalTitle').innerText = "✏️ Editar Frase";
  document.getElementById('phraseEn').value = p.en;
  document.getElementById('phrasePt').value = p.pt;
  document.getElementById('translatePreview').innerHTML = "";
  document.getElementById('editPhraseId').value = id;
  document.getElementById('modalDeleteBtn').style.display = "inline-flex";
  populateCatSelect(p.cat);
  updateSubcatSelect(p.cat);
  document.getElementById('phraseSubcat').value = p.subcat || "";
  document.getElementById('phraseModal').classList.add('open');
  document.getElementById('phrasePt').dataset.manual = '1';
}

window.deletePhraseQuick = function(id) {
  if(confirm("Excluir esta frase?")){
    phrases = phrases.filter(p=>p.id!==id);
    persist();
    render();
    showToast("🗑 Removida");
  }
}

async function savePhraseModal() {
  const en = document.getElementById('phraseEn').value.trim();
  const pt = document.getElementById('phrasePt').value.trim();
  const cat = document.getElementById('phraseCat').value;
  const subcat = document.getElementById('phraseSubcat').value || "";
  const editId = document.getElementById('editPhraseId').value;
  if(!en){ showToast("⚠️ Frase em inglês obrigatória"); return; }
  let finalPt = pt;
  if(!finalPt){
    finalPt = await autoTranslate(en);
  }
  if(editId){
    const idx = phrases.findIndex(p=>p.id==editId);
    if(idx!==-1) phrases[idx] = {...phrases[idx], en, pt:finalPt||pt, cat, subcat};
  } else {
    phrases.push({ id: nextId++, en, pt: finalPt || pt, cat, subcat });
  }
  persist(); 
  render(); 
  closeModals(); 
  showToast(editId?"✅ atualizada":"✅ adicionada!");
}

function modalDeleteHandler() {
  const id = document.getElementById('editPhraseId').value;
  if(id && confirm("Remover permanentemente?")){
    phrases = phrases.filter(p=>p.id!=id);
    persist(); 
    render(); 
    closeModals(); 
    showToast("🗑 Frase excluída");
  }
}

// Category functions
let selectedEmoji = "📁";

window.openCatModal = function() {
  selectedEmoji = EMOJIS_LIST[0];
  renderEmojiPicker();
  document.getElementById('catName').value = "";
  document.getElementById('catModal').classList.add('open');
}

function renderEmojiPicker() {
  const grid = document.getElementById('emojiPickerGrid');
  grid.innerHTML = EMOJIS_LIST.map(e => `<span class="emoji-option ${e===selectedEmoji ? 'selected':''}" onclick="selectEmoji('${e}')">${e}</span>`).join('');
}

window.selectEmoji = function(emoji) { 
  selectedEmoji = emoji; 
  renderEmojiPicker(); 
}

function saveCategory() {
  const name = document.getElementById('catName').value.trim();
  if(!name){ showToast("Nome da categoria"); return; }
  const id = name.toLowerCase().replace(/[^a-z0-9]/g,'-') + "-"+Date.now();
  categories.push({ id, name, emoji: selectedEmoji, subcats: [] });
  openSections.add(id);
  persist(); 
  render(); 
  closeModals(); 
  showToast("📁 Categoria criada");
}

window.deleteCategoryPrompt = function(id) {
  const cat = categories.find(c=>c.id===id);
  const count = phrases.filter(p=>p.cat===id).length;
  if(confirm(`Excluir "${cat?.name}" e suas ${count} frase(s)?`)){
    categories = categories.filter(c=>c.id!==id);
    phrases = phrases.filter(p=>p.cat!==id);
    openSections.delete(id);
    persist(); 
    render(); 
    showToast("🗑 Categoria removida");
  }
}

// Search and controls
function handleSearch() { 
  currentSearch = document.getElementById('searchInput').value; 
  render(); 
}

function expandAll() { 
  categories.forEach(c=>openSections.add(c.id)); 
  render(); 
}

function collapseAll() { 
  openSections.clear(); 
  render(); 
}

function exportData() {
  const data = JSON.stringify({categories, phrases}, null, 2);
  const blob = new Blob([data], {type:'application/json'});
  const a = document.createElement('a'); 
  a.href = URL.createObjectURL(blob); 
  a.download = "english_roleplay.json"; 
  a.click(); 
  showToast("📦 Exportado");
}

function importData(e) {
  const file = e.target.files[0];
  if(!file) return;
  const reader = new FileReader();
  reader.onload = ev => {
    try {
      const json = JSON.parse(ev.target.result);
      if(json.categories) categories = json.categories;
      if(json.phrases) { 
        json.phrases.forEach(p => { 
          if(!phrases.find(x=>x.en===p.en)) phrases.push({...p, id: nextId++}); 
        }); 
      }
      persist(); 
      render(); 
      showToast("✅ Importado");
    } catch(e) { 
      showToast("Arquivo inválido");
    }
  };
  reader.readAsText(file);
}

function closeModals() { 
  document.querySelectorAll('.modal-overlay').forEach(m => m.classList.remove('open')); 
}

// Event Listeners
document.getElementById('searchInput').addEventListener('input', handleSearch);
document.getElementById('expandAllBtn').addEventListener('click', expandAll);
document.getElementById('collapseAllBtn').addEventListener('click', collapseAll);
document.getElementById('exportBtn').addEventListener('click', exportData);
document.getElementById('importFile').addEventListener('change', importData);
document.getElementById('newCatBtn').addEventListener('click', openCatModal);
document.getElementById('newPhraseTopBtn').addEventListener('click', () => openAddPhraseWithCat(categories[0]?.id || 'personal'));
document.getElementById('closePhraseModal').addEventListener('click', closeModals);
document.getElementById('modalCancelBtn').addEventListener('click', closeModals);
document.getElementById('modalSaveBtn').addEventListener('click', savePhraseModal);
document.getElementById('modalDeleteBtn').addEventListener('click', modalDeleteHandler);
document.getElementById('closeCatModal').addEventListener('click', closeModals);
document.getElementById('catCancelBtn').addEventListener('click', closeModals);
document.getElementById('catSaveBtn').addEventListener('click', saveCategory);
document.getElementById('phraseEn').addEventListener('input', triggerAutoTranslate);
document.getElementById('phrasePt').addEventListener('input', function() { this.dataset.manual = '1'; });
document.getElementById('closeSubcatModal')?.addEventListener('click', closeModals);
document.getElementById('subcatCancelBtn')?.addEventListener('click', closeModals);
document.getElementById('subcatSaveBtn')?.addEventListener('click', saveSubcat);
document.getElementById('subcatDeleteBtn')?.addEventListener('click', deleteSubcatFromModal);
document.getElementById('phraseCat')?.addEventListener('change', function() { updateSubcatSelect(this.value); });

// Inicialização
loadData();
render();