// CONEXÃO COM A API DO GEMINI
const GEMINI_API_KEY = "AQ.Ab8RN6INMeJJShoj7TwXio3fO2VORrh2lFF1PUjEXqArXGLEng"; 
const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`;

// ELEMENTOS DO DOM
const chatBody = document.getElementById('chat-tab');
const chatInput = document.getElementById('chat-input');
const sendBtn = document.getElementById('send-btn');
const clearBtn = document.getElementById('clear-btn');
const plusBtn = document.getElementById('plus-btn');
const anexoMenu = document.getElementById('anexo-menu');
const menuStudioBtn = document.getElementById('menu-studio-btn');
const backChatBtn = document.getElementById('back-chat-btn');
const studioTab = document.getElementById('studio-tab');
const bgColorPicker = document.getElementById('bg-color-picker');

// ENVIAR MENSAGEM PARA A IA (GEMINI)
async function enviarMensagem() {
  const texto = chatInput.value.trim();
  if (!texto) return;

  // 1. Mostrar mensagem do utilizador no chat
  adicionarBolha(texto, 'user-message');
  chatInput.value = '';

  // 2. Criar bolha de carregamento da IA
  const loadingDiv = document.createElement('div');
  loadingDiv.className = 'message ai-message';
  loadingDiv.innerHTML = `<div class="bubble"><i>A pensar...</i></div>`;
  chatBody.appendChild(loadingDiv);
  chatBody.scrollTop = chatBody.scrollHeight;

  try {
    // 3. Chamada à API do Gemini
    const response = await fetch(GEMINI_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: `Tu és o assistente virtual do sistema Pulse AI. És perito em automóveis, orçamentos detalhados de funilaria/pintura mecânica para oficinas e criação de conteúdos/memes. Responde de forma clara, prestativa e amigável ao seguinte pedido: ${texto}`
          }]
        }]
      })
    });

    const data = await response.json();
    loadingDiv.remove();

    if (data.candidates && data.candidates[0].content.parts[0].text) {
      const respostaIA = data.candidates[0].content.parts[0].text;
      adicionarBolha(respostaIA, 'ai-message');
    } else {
      adicionarBolha("Desculpa, não consegui processar a tua resposta agora. Verifica se a tua chave de API está correta.", 'ai-message');
    }

  } catch (erro) {
    loadingDiv.remove();
    adicionarBolha("Erro de conexão com a IA. Tenta novamente em instantes.", 'ai-message');
    console.error("Erro na API Gemini:", erro);
  }
}

// FUNÇÃO PARA ADICIONAR BOLHAS NO CHAT
function adicionarBolha(texto, classe) {
  const msgDiv = document.createElement('div');
  msgDiv.className = `message ${classe}`;
  
  // Converte quebras de linha em <br>
  const textoFormatado = texto.replace(/\n/g, '<br>');
  msgDiv.innerHTML = `<div class="bubble">${textoFormatado}</div>`;
  
  chatBody.appendChild(msgDiv);
  chatBody.scrollTop = chatBody.scrollHeight;
}

// EVENTOS DE CLIQUE E TECLADO
sendBtn.addEventListener('click', enviarMensagem);

chatInput.addEventListener('keypress', (e) => {
  if (e.key === 'Enter' && !e.shiftKey) {
    e.preventDefault();
    enviarMensagem();
  }
});

// ALTERAR COR DE FUNDO
bgColorPicker.addEventListener('input', (e) => {
  chatBody.style.background = e.target.value;
});

// MENU DE ANEXOS (+)
plusBtn.addEventListener('click', () => {
  anexoMenu.classList.toggle('active');
});

// NAVEGAÇÃO CHAT <-> ESTÚDIO
menuStudioBtn.addEventListener('click', () => {
  anexoMenu.classList.remove('active');
  chatBody.classList.remove('active');
  studioTab.classList.add('active');
});

backChatBtn.addEventListener('click', () => {
  studioTab.classList.remove('active');
  chatBody.classList.add('active');
});

// LIMPAR CHAT
clearBtn.addEventListener('click', () => {
  chatBody.innerHTML = `
    <div class="message ai-message">
      <div class="bubble">Olá! Bem-vindo ao <b>Pulse AI</b>. Eu sou o seu assistente inteligente. Como posso te ajudar hoje?</div>
    </div>
  `;
});
