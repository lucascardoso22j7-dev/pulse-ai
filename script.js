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
        <div class="bubble">Olá, <b>${nomeUtilizador}</b>! O Pulse AI está com o núcleo de conversação livre totalmente ativo. O que vamos debater ou pesquisar?</div>
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

  // FORMATAÇÃO MODERNA DE TÓPICOS E PARÁGRAFOS
  function formatarTextoIA(texto) {
    if (!texto) return '';
    return texto
      .replace(/###\s*(.*?)/g, '<br><br><b>◆ $1</b><br>')
      .replace(/##\s*(.*?)/g, '<br><br><b>■ $1</b><br>')
      .replace(/\*\*(.*?)\*\*/g, '<b>$1</b>')
      .replace(/\*/g, '•')
      .replace(/\n/g, '<br>');
  }

  // RESPOSTA DINÂMICA INTELIGENTE (Sem frases robóticas)
  function gerarRespostaDinamica(texto) {
    const t = texto.toLowerCase();
    if (t.includes('quem criou') || t.includes('criador')) {
      return `Fui criado por <b>${nomeUtilizador}</b> (Lucas Cardoso Alves), um programador visionário que concebeu a minha arquitetura para ser rápida, inteligente e totalmente autónoma!`;
    }
    if (t.includes('olá') || t.includes('ola') || t.includes('tudo bem')) {
      return `Olá, ${nomeUtilizador}! Tudo excelente por aqui. O que mandas? Vamos debater alguma ideia ou procurar alguma fotografia técnica?`;
    }
    return `Essa é uma excelente questão, ${nomeUtilizador}. Sobre "${texto}", posso dizer que envolve conceitos profundos de análise, aplicação prática e desenvolvimento contínuo. Quer que eu detalhe os pontos principais ou procure fotografias sobre o tema?`;
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

    // SISTEMA DE BUSCA DE FOTOGRAFIAS REAIS COM PRECISÃO DE OFICINA
    const tLower = texto.toLowerCase();
    if (tLower.includes('foto') || tLower.includes('imagem') || tLower.includes('mostre') || tLower.includes('mande uma') || tLower.includes('ver')) {
      const HTMLPontinhosImg = `<div class="typing-dots"><span></span><span></span><span></span></div>`;
      const idDigImg = adicionarBalao(HTMLPontinhosImg, 'ai-message digitando');

      setTimeout(() => {
        if (idDigImg) idDigImg.remove();
        
        let termoBusca = texto.replace(/foto|imagem|de|uma|um|mostre|mande|ver|gostaria|quero/gi, '').trim();
        if (!termoBusca) termoBusca = 'tools';
        
        let termoFinal = termoBusca;
        if (termoBusca.includes('martelete') || termoBusca.includes('bosch') || termoBusca.includes('furadeira')) {
          termoFinal = 'rotary hammer drill heavy tool power tool';
        } else if (termoBusca.includes('multimetro') || termoBusca.includes('multímetro')) {
          termoFinal = 'digital multimeter electronics tool';
        } else if (termoBusca.includes('titan') || termoBusca.includes('moto') || termoBusca.includes('cg')) {
          termoFinal = 'honda motorcycle street bike';
        } else if (termoBusca.includes('ferrari')) {
          termoFinal = 'ferrari spider red sports car';
        }

        const urlFotoReal = `https://source.unsplash.com/featured/600x400/?${encodeURIComponent(termoFinal)}`;
        
        const htmlComFotoReal = `Aqui está a fotografia correspondente a <b>"${termoBusca}"</b>:<br><img src="${urlFotoReal}" style="width:100%; border-radius:8px; margin-top:8px; background:#111;" alt="Fotografia Real" onerror="this.onerror=null; this.src='https://images.unsplash.com/photo-1504148455328-c376907d081c?w=600&h=400';">`;
        
        adicionarBalao(htmlComFotoReal, 'ai-message');
        falarTexto("Aqui está a fotografia solicitada.");
      }, 1000);
      return;
    }

    const HTMLPontinhos = `<div class="typing-dots"><span></span><span></span><span></span></div>`;
    const idDigitando = adicionarBalao(HTMLPontinhos, 'ai-message digitando');

    let respostaEntregue = false;

    // TIMEOUT ESTENDIDO PARA 6 SEGUNDOS (Dá tempo à API externa de responder sem cortar)
    const timerSeguranca = setTimeout(() => {
      if (!respostaEntregue) {
        respostaEntregue = true;
        if (idDigitando) idDigitando.remove();
        const respDinamica = gerarRespostaDinamica(texto);
        adicionarBalao(respDinamica, 'ai-message');
        falarTexto(respDinamica);
      }
    }, 6000);

    try {
      const promptSistema = `Você é o Pulse AI, um assistente virtual inteligente e fluido criado por ${nomeUtilizador} (Lucas Cardoso Alves). Responda sempre em português brasileiro de forma natural, direta e organizada em tópicos.`;
      const url = `https://text.pollinations.ai/${encodeURIComponent(promptSistema + "\nPergunta: " + texto)}`;

      const response = await fetch(url);
      
      if (response.ok && !respostaEntregue) {
        const respostaBruta = await response.text();
        if (respostaBruta && respostaBruta.length > 3) {
          respostaEntregue = true;
          clearTimeout(timerSeguranca);
          if (idDigitando) idDigitando.remove();
          const textoFormatado = formatarTextoIA(respostaBruta);
          adicionarBalao(textoFormatado, 'ai-message');
          falarTexto(respostaBruta);
        }
      }
    } catch (err) {
      // O temporizador cuida de entregar a resposta dinâmica se houver falha de rede
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
