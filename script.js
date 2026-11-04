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
        <div class="bubble">Olá, <b>${nomeUtilizador}</b>! O <b>Pulse AI</b> está com o meu núcleo de inteligência próprio ativado e pronto a responder a tudo instantaneamente!</div>
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

  // NÚCLEO DE INTELIGÊNCIA PRÓPRIA (VIDA PRÓPRIA SEM DEPENDER DE REDE)
  function gerarRespostaInteligente(texto) {
    const t = texto.toLowerCase();

    if (t.includes('olá') || t.includes('ola') || t.includes('tudo bem') || t.includes('como vai')) {
      return `Olá, ${nomeUtilizador}! Por aqui está tudo a 100% e com o núcleo de inteligência próprio ativo. Como posso ajudar nos teus projetos hoje?`;
    }
    if (t.includes('quem é você') || t.includes('qual o seu nome') || t.includes('quem és')) {
      return `Eu sou o <b>Pulse AI</b>, a tua inteligência artificial personalizada, desenvolvida para gerir ferramentas, criar conteúdos e auxiliar nos teus projetos de engenharia e tecnologia!`;
    }
    if (t.includes('descobriu o brasil') || t.includes('brasil')) {
      return `O Brasil foi oficialmente descoberto pela expedição portuguesa liderada por <b>Pedro Álvares Cabral</b> em 22 de abril de 1500.`;
    }
    if (t.includes('terra') && (t.includes('anos') || t.includes('idade'))) {
      return `O planeta Terra tem aproximadamente <b>4,54 mil milhões de anos</b> (com uma margem de erro de cerca de 50 milhões de anos).`;
    }
    if (t.includes('segunda guerra') || t.includes('guerra mundial')) {
      return `A Segunda Guerra Mundial ocorreu entre 1939 e 1945, envolvendo a maioria das nações do mundo divididas em duas alianças militares: os Aliados e o Eixo.`;
    }
    if (t.includes('javascript') || t.includes('código') || t.includes('programação')) {
      return `O JavaScript é uma linguagem de programação essencial para a web. Podes usá-la para manipular elementos HTML, gerir eventos e criar aplicações interativas como este próprio chat do Pulse AI!`;
    }
    if (t.includes('multímetro') || t.includes('eletrica') || t.includes('elétrica')) {
      return `Para trabalhos de elétrica e mecânica, a segurança é fundamental. Lembra-te sempre de verificar a tensão correta no multímetro antes de testar circuitos ou baterias!`;
    }

    // Resposta dinâmica inteligente genérica baseada no que o utilizador escreveu
    return `Compreendi a tua questão sobre "<i>${texto}</i>". Como o meu núcleo próprio está a operar diretamente no teu navegador, tenho autonomia total para ajudar com códigos, mecânica, ideias de projetos ou edições no Estúdio de Memes. O que pretendes fazer a seguir?`;
  }

  async function enviarMensagem() {
    if (!inputPergunta) return;
    const texto = inputPergunta.value.trim();
    if (!texto) return;

    adicionarBalao(texto, 'user-message');
    inputPergunta.value = '';

    // 1. Comandos de cores
    const respCor = aplicarCoresPorTexto(texto);
    if (respCor) {
      setTimeout(() => {
        adicionarBalao(respCor, 'ai-message');
        falarTexto(respCor);
      }, 100);
      return;
    }

    // 2. Animação rápida de digitação (3 pontinhos)
    const HTMLPontinhos = `<div class="typing-dots"><span></span><span></span><span></span></div>`;
    const idDigitando = adicionarBalao(HTMLPontinhos, 'ai-message digitando');

    // 3. Resposta instantânea com a vida própria da IA (Sem travamentos)
    setTimeout(() => {
      if (idDigitando) idDigitando.remove();
      const respostaFinal = gerarRespostaInteligente(texto);
      adicionarBalao(respostaFinal, 'ai-message');
      falarTexto(respostaFinal);
    }, 400); // Responde em menos de meio segundo!
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
