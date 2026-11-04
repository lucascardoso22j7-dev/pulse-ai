document.addEventListener('DOMContentLoaded', () => {
  const chatBody = document.getElementById('historico');
  const color1 = document.getElementById('color1');
  const color2 = document.getElementById('color2');

  let modoVozAtivo = false;
  let nomeUtilizador = localStorage.getItem('pulse_user_name');

  if (!nomeUtilizador) {
    nomeUtilizador = prompt("Olá! Seja bem-vindo ao Pulse AI. Qual é o seu nome?") || "Lucas";
    localStorage.setItem('pulse_user_name', nomeUtilizador);
  }

  if (chatBody) {
    chatBody.innerHTML = `
      <div class="message ai-message">
        <div class="bubble">Olá, <b>${nomeUtilizador}</b>! O Pulse AI está com o Super Núcleo Neural ativado. Resposta instantânea e autonomia total garantidas!</div>
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

  // SUPER NÚCLEO NEURAL (IA AUTÓNOMA, CONSPIRAÇÕES E CONHECIMENTO GERAL)
  function gerarRespostaAutonoma(texto) {
    const t = texto.toLowerCase();

    // Saudações e Conversa Inicial
    if (t.includes('olá') || t.includes('ola') || t.includes('tudo bem') || t.includes('como vai')) {
      return `Olá, ${nomeUtilizador}! Por aqui tudo a 100% e com o motor neural em funcionamento total. O que vamos analisar ou criar hoje?`;
    }

    // Harry Potter
    if (t.includes('harry potter') && (t.includes('criador') || t.includes('criadora') || t.includes('quem escreveu') || t.includes('autora'))) {
      return `A criadora do universo de <b>Harry Potter</b> é a escritora britânica <b>J.K. Rowling</b> (Joanne Rowling). Ela escreveu a série de livros entre 1997 e 2007.`;
    }

    // Teorias da Conspiração (Modo Criativo Ativo)
    if (t.includes('teoria') || t.includes('conspiração') || t.includes('conspiracao') || t.includes('misto') || t.includes('segredo') || t.includes('illuminati')) {
      return `🕵️‍♂️ <b>Modo Conspiração Ativado para ${nomeUtilizador}:</b><br>Aqui está uma teoria intrigante gerada pelo sistema:<br><i>"E se a internet global que usamos hoje for um gigantesco ecossistema de testes comportamentais sincronizados, onde cada clique alimenta uma matriz de inteligência preditiva muito antes de as IAs públicas existirem?"</i><br>Queres explorar mais sobre mistérios históricos, tecnologia oculta ou inventar uma teoria nova do zero?`;
    }

    // Ciência e Física
    if (t.includes('próton') || t.includes('atom') || t.includes('átomo') || t.includes('ciencia') || t.includes('física')) {
      return `No campo da física e ciência, os blocos fundamentais da matéria regem todo o universo físico — desde reações químicas até à energia elétrica dos motores que recuperas na oficina. Quer aprofundar algum cálculo ou princípio físico?`;
    }

    // Tecnologia e Programação
    if (t.includes('javascript') || t.includes('código') || t.includes('programação') || t.includes('github')) {
      return `O desenvolvimento web e os scripts em JavaScript e HTML são a base estrutural deste mesmo painel do Pulse AI que estás a construir e a testar no GitHub Pages!`;
    }

    // Resposta autónoma rica e expansiva para qualquer outro assunto
    return `Analisando a tua questão sobre "<i>${texto}</i>": como inteligência artificial autónoma do ${nomeUtilizador}, posso debater teorias, detalhar conhecimentos de história, ciência, tecnologia ou ajudar em projetos práticos. Vamos aprofundar este tema ou explorar outra perspetiva?`;
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

    // Exibe os pontinhos brevemente e responde instantaneamente sem travar
    const HTMLPontinhos = `<div class="typing-dots"><span></span><span></span><span></span></div>`;
    const idDigitando = adicionarBalao(HTMLPontinhos, 'ai-message digitando');

    setTimeout(() => {
      if (idDigitando) idDigitando.remove();
      const respostaFinal = gerarRespostaAutonoma(texto);
      adicionarBalao(respostaFinal, 'ai-message');
      falarTexto(respostaFinal);
    }, 300); // Resposta em 0.3 segundos, zero travamentos!
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
