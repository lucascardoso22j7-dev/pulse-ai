document.addEventListener('DOMContentLoaded', () => {
  const chatBody = document.getElementById('historico');
  const color1 = document.getElementById('color1');
  const color2 = document.getElementById('color2');

  // SISTEMA DE NOME PERSONALIZADO
  let nomeUtilizador = localStorage.getItem('pulse_user_name');

  if (!nomeUtilizador) {
    nomeUtilizador = prompt("Olá! Seja bem-vindo ao Pulse AI. Qual é o seu nome?") || "Visitante";
    localStorage.setItem('pulse_user_name', nomeUtilizador);
  }

  if (chatBody) {
    chatBody.innerHTML = `
      <div class="message ai-message">
        <div class="bubble">Olá, <b>${nomeUtilizador}</b>! O <b>Pulse AI</b> está pronto. Podes digitar ou usar o microfone para falar comigo por voz!</div>
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
      return "Pronto! Degradê <b>Verde e Roxo</b> aplicado no fundo do chat!";
    }
    if (t.includes('azul') && t.includes('rosa')) {
      aplicarDegradeChat('#0072ff', '#ec4899');
      return "Degradê <b>Azul e Rosa</b> ativado!";
    }
    return null;
  }

  // BOTÃO (+) E MENU FLUTUANTE
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

  // RECONHECIMENTO DE VOZ (CHAT POR VOZ)
  const btnVoz = document.getElementById('btnVoz');
  const inputPergunta = document.getElementById('pergunta');

  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

  if (SpeechRecognition && btnVoz) {
    const recognition = new SpeechRecognition();
    recognition.lang = 'pt-BR';
    recognition.continuous = false;

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

    recognition.onerror = () => {
      btnVoz.classList.remove('ouvindo');
    };

    recognition.onend = () => {
      btnVoz.classList.remove('ouvindo');
    };
  } else if (btnVoz) {
    btnVoz.style.display = 'none'; // Oculta se o navegador não suportar voz
  }

  // CHAT HÍBRIDO (APIS E MOTOR RÁPIDO)
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

    // Comandos locais de cores
    const respCor = aplicarCoresPorTexto(texto);
    if (respCor) {
      setTimeout(() => adicionarBalao(respCor, 'ai-message'), 100);
      return;
    }

    // Indicador de 3 pontinhos vermelhos a saltar
    const HTMLPontinhos = `<div class="typing-dots"><span></span><span></span><span></span></div>`;
    const idDigitando = adicionarBalao(HTMLPontinhos, 'ai-message digitando');

    // Sistema Híbrido: tenta IA Externa em tempo real e alterna se demorar
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 4000);

      const promptSistema = encodeURIComponent(`És o Pulse AI, assistente inteligente de ${nomeUtilizador}. Responde rápido e direto em português, sem asteriscos.`);
      const promptUsuario = encodeURIComponent(texto);
      
      const response = await fetch(`https://text.pollinations.ai/${promptSistema}%20${promptUsuario}?model=openai`, {
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);

      if (idDigitando) idDigitando.remove();

      if (response.ok) {
        const respostaTexto = await response.text();
        adicionarBalao(formatarTextoIA(respostaTexto), 'ai-message');
      } else {
        adicionarBalao(`Entendi a tua pergunta, ${nomeUtilizador}! Como posso ajudar a aprofundar esse assunto?`, 'ai-message');
      }
    } catch (error) {
      if (idDigitando) idDigitando.remove();
      adicionarBalao(`Olá ${nomeUtilizador}! Módulo inteligente ativo. Como posso ajudar no teu projeto hoje?`, 'ai-message');
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
