document.addEventListener('DOMContentLoaded', () => {
  const chatBody = document.getElementById('historico');
  const color1 = document.getElementById('color1');
  const color2 = document.getElementById('color2');

  let modoVozAtivo = false;
  let nomeUtilizador = localStorage.getItem('pulse_user_name');

  if (!nomeUtilizador || nomeUtilizador === 'Lucas') {
    nomeUtilizador = "Lucas Cardoso Alves";
    localStorage.setItem('pulse_user_name', nomeUtilizador);
  }

  if (chatBody) {
    chatBody.innerHTML = `
      <div class="message ai-message">
        <div class="bubble">Olá, <b>${nomeUtilizador}</b>! O Pulse AI está com o motor híbrido de alta velocidade ativado. Como posso ajudar?</div>
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

  function falarTexto(texto) {
    if (modoVozAtivo && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const textoLimpo = texto.replace(/<[^>]*>?/gm, '');
      const utterance = new SpeechSynthesisUtterance(textoLimpo);
      utterance.lang = 'pt-BR';
      utterance.rate = 1.0;
      window.speechSynthesis.speak(utterance);
      modoVozAtivo = false;
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

  // CHAT POR VOZ
  const btnVoz = document.getElementById('btnVoz');
  const inputPergunta = document.getElementById('pergunta');
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

  if (SpeechRecognition && btnVoz) {
    const recognition = new SpeechRecognition();
    recognition.lang = 'pt-BR';

    btnVoz.addEventListener('click', () => {
      try {
        modoVozAtivo = true;
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

  // EVENTOS DE ENVIO
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

  // MOTOR HÍBRIDO DE RESPOSTA INSTANTÂNEA E INTELIGENTE
  function processarRespostaInteligente(texto) {
    const t = texto.toLowerCase();

    if (t.includes('olá') || t.includes('ola') || t.includes('tudo bem')) {
      return `Olá, ${nomeUtilizador}! Tudo excelente por aqui. Como posso ajudar nos teus projetos ou pesquisas hoje?`;
    }
    if (t.includes('criador do google') || t.includes('criou o google') || t.includes('quem fundou o google')) {
      return `O Google foi fundado em 4 de setembro de 1998 por <b>Larry Page</b> e <b>Sergey Brin</b>, enquanto ambos eram estudantes de doutoramento na Universidade de Stanford.`;
    }
    if (t.includes('nome completo') && (t.includes('criador') || t.includes('teu') || t.includes('seu'))) {
      return `O meu criador e programador visionário é <b>Lucas Cardoso Alves</b>!`;
    }
    if (t.includes('teoria') || t.includes('conspiração') || t.includes('conspiracao') || t.includes('donos do mundo')) {
      return `🕵️‍♂️ <b>Modo Conspiração Ativado:</b> As teorias sobre o controlo global sugerem que redes de grandes corporações e algoritmos de IA interligados moldam silenciosamente as decisões e tendências da humanidade. Quer explorar mais sobre este mistério?`;
    }
    if (t.includes('harry potter')) {
      return `A criadora de Harry Potter é a escritora britânica J.K. Rowling.`;
    }

    // Resposta inteligente genérica contextualizada
    return `Analisando a tua questão sobre "${texto}": como assistente avançado do ${nomeUtilizador}, estou operacional para estruturar códigos, resolver problemas técnicos ou debater ideias contigo. O que pretendes fazer a seguir?`;
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

    // Tenta a API com limite rigoroso de 2.5 segundos; se falhar ou demorar, entrega a resposta inteligente local instantaneamente
    let respostaPronta = false;

    const timeoutPrimitivo = setTimeout(() => {
      if (!respostaPronta) {
        respostaPronta = true;
        if (idDigitando) idDigitando.remove();
        const respLocal = processarRespostaInteligente(texto);
        adicionarBalao(respLocal, 'ai-message');
        falarTexto(respLocal);
      }
    }, 2500);

    try {
      const endpoint = `https://text.pollinations.ai/${encodeURIComponent("Responde de forma inteligente e direta em português ao utilizador " + nomeUtilizador + ": " + texto)}?model=openai`;
      const response = await fetch(endpoint);

      if (response.ok && !respostaPronta) {
        const respostaBruta = await response.text();
        if (respostaBruta && respostaBruta.length > 5) {
          respostaPronta = true;
          clearTimeout(timeoutPrimitivo);
          if (idDigitando) idDigitando.remove();
          const textoFormatado = formatarTextoIA(respostaBruta);
          adicionarBalao(textoFormatado, 'ai-message');
          falarTexto(respostaBruta);
        }
      }
    } catch (err) {
      // O timeout tratará do fallback se houver erro de rede
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
