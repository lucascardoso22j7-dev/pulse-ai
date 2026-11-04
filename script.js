document.addEventListener('DOMContentLoaded', () => {
  const chatBody = document.getElementById('historico');
  const color1 = document.getElementById('color1');
  const color2 = document.getElementById('color2');

  let nomeUtilizador = localStorage.getItem('pulse_user_name');

  if (!nomeUtilizador) {
    nomeUtilizador = prompt("Olá! Seja bem-vindo ao Pulse AI. Qual é o seu nome?") || "Lucas";
    localStorage.setItem('pulse_user_name', nomeUtilizador);
  }

  if (chatBody) {
    chatBody.innerHTML = `
      <div class="message ai-message">
        <div class="bubble">Olá, <b>${nomeUtilizador}</b>! O <b>Pulse AI</b> está pronto. Podes falar comigo pelo microfone e eu respondo-te por voz!</div>
      </div>
    `;
  }

  function aplicarDegradeChat(c1, c2) {
    if (chatBody) {
      chatBody.style.background = `linear-gradient(135deg, ${c1}, ${c2}, #000000)`;
    }
  }

  if (color1 && color2) {
    color1.addEventListener('input', () => aplicarDegradeChat(color1.value, color2.value));
    color2.addEventListener('input', () => aplicarDegradeChat(color1.value, color2.value));
  }

  function aplicarCoresPorTexto(texto) {
    const t = texto.toLowerCase();
    if (t.includes('verde') && t.includes('roxo')) {
      aplicarDegradeChat('#00b09b', '#8e2de2');
      return "Pronto! Degradê Verde e Roxo aplicado!";
    }
    if (t.includes('azul') && t.includes('rosa')) {
      aplicarDegradeChat('#0072ff', '#ec4899');
      return "Degradê Azul e Rosa ativado!";
    }
    return null;
  }

  // FUNÇÃO PARA A IA FALAR EM VOZ ALTA (SÍNTESE DE VOZ)
  function falarTexto(texto) {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel(); // Para fala anterior se houver
      const textoLimpo = texto.replace(/<[^>]*>?/gm, ''); // Remove tags HTML
      const utterance = new SpeechSynthesisUtterance(textoLimpo);
      utterance.lang = 'pt-BR';
      utterance.rate = 1.0;
      window.speechSynthesis.speak(utterance);
    }
  }

  // BOTÃO (+) E MENU
  const btnMais = document.getElementById('btnMais');
  const menuAnexo = document.getElementById('menuAnexo');

  if (btnMais && menuAnexo) {
    btnMais.addEventListener('click', (e) => {
      e.stopPropagation();
      menuAnexo.classList.toggle('active');
    });
    document.addEventListener('click', () => menuAnexo.classList.remove('active'));
  }

  // NAVEGAÇÃO ENTRE ABAS
  const btnMenuMemes = document.getElementById('btnMenuMemes');
  const btnVoltarChat = document.getElementById('btnVoltarChat');
  const abaChat = document.getElementById('aba-chat');
  const abaMemes = document.getElementById('aba-memes');

  if (btnMenuMemes) {
    btnMenuMemes.addEventListener('click', () => {
      menuAnexo.classList.remove('active');
      if (abaChat) abaChat.classList.remove('active');
      if (abaMemes) abaMemes.classList.add('active');
    });
  }

  if (btnVoltarChat) {
    btnVoltarChat.addEventListener('click', () => {
      if (abaMemes) abaMemes.classList.remove('active');
      if (abaChat) abaChat.classList.add('active');
    });
  }

  // CHAT POR VOZ (Ouvir)
  const btnVoz = document.getElementById('btnVoz');
  const inputPergunta = document.getElementById('pergunta');
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

  if (SpeechRecognition && btnVoz) {
    const recognition = new SpeechRecognition();
    recognition.lang = 'pt-BR';

    btnVoz.addEventListener('click', () => {
      try {
        recognition.start();
        btnVoz.classList.add('ouvindo');
      } catch (err) {
        recognition.stop();
        btnVoz.classList.remove('ouvindo');
      }
    });

    recognition.onresult = (e) => {
      const textoVoz = e.results[0][0].transcript;
      inputPergunta.value = textoVoz;
      btnVoz.classList.remove('ouvindo');
      enviarMensagem();
    };

    recognition.onerror = () => btnVoz.classList.remove('ouvindo');
    recognition.onend = () => btnVoz.classList.remove('ouvindo');
  }

  // ENVIO DE MENSAGENS E PROCESSAMENTO DE IA
  const btnPerguntar = document.getElementById('btnPerguntar');
  const btnLimpar = document.getElementById('btnLimpar');

  if (btnPerguntar) {
    btnPerguntar.addEventListener('click', (e) => {
      e.preventDefault();
      enviarMensagem();
    });
  }

  if (inputPergunta) {
    inputPergunta.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') { 
        e.preventDefault(); 
        enviarMensagem(); 
      }
    });
  }

  if (btnLimpar) {
    btnLimpar.addEventListener('click', () => {
      if (chatBody) {
        chatBody.innerHTML = `<div class="message ai-message"><div class="bubble">Conversa reiniciada. Como posso ajudar, ${nomeUtilizador}?</div></div>`;
      }
    });
  }

  function formatarTextoIA(texto) {
    if (!texto) return '';
    return texto.replace(/\*\*(.*?)\*\*/g, '<b>$1</b>').replace(/\*/g, '').replace(/\n/g, '<br>');
  }

  async function enviarMensagem() {
    if (!inputPergunta) return;
    const texto = inputPergunta.value.trim();
    if (!texto) return;

    adicionarBalao(texto, 'user-message');
    inputPergunta.value = '';

    const respCor = aplicarCoresPorTexto(texto);
    if (respCor) {
      setTimeout(() => {
        adicionarBalao(respCor, 'ai-message');
        falarTexto(respCor);
      }, 100);
      return;
    }

    const HTMLPontinhos = `<div class="typing-dots"><span></span><span></span><span></span></div>`;
    const idDigitando = adicionarBalao(HTMLPontinhos, 'ai-message digitando');

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 4500);

      const promptSistema = encodeURIComponent(`És o Pulse AI, assistente inteligente de ${nomeUtilizador}. Responde de forma curta, direta e amigável em português sem usar asteriscos.`);
      const promptUsuario = encodeURIComponent(texto);
      
      const response = await fetch(`https://text.pollinations.ai/${promptSistema}%20${promptUsuario}?model=openai`, {
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);
      if (idDigitando) idDigitando.remove();

      if (response.ok) {
        const respostaTexto = await response.text();
        const textoFormatado = formatarTextoIA(respostaTexto);
        adicionarBalao(textoFormatado, 'ai-message');
        falarTexto(respostaTexto); // Fala a resposta em voz alta!
      } else {
        const msgPadrao = `Entendi, ${nomeUtilizador}. Como posso ajudar mais?`;
        adicionarBalao(msgPadrao, 'ai-message');
        falarTexto(msgPadrao);
      }
    } catch (error) {
      if (idDigitando) idDigitando.remove();
      const msgErro = `Olá ${nomeUtilizador}! Módulo de voz pronto. Como posso ajudar?`;
      adicionarBalao(msgErro, 'ai-message');
      falarTexto(msgErro);
    }
  }

  function adicionarBalao(texto, classe) {
    if (!chatBody) return;
    const div = document.createElement('div');
    div.className = `message ${classe}`;
    div.innerHTML = `<div class="bubble">${texto}</div>`;
    chatBody.appendChild(div);
    chatBody.scrollTop = chatBody.scrollHeight;
    return div;
  }
});
