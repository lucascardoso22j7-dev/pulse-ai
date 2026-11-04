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
        <div class="bubble">Olá, <b>${nomeUtilizador}</b>! O meu núcleo de inteligência próprio foi atualizado. Podes perguntar o que quiseres sobre ciência, física, idiomas ou projetos!</div>
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

  // NÚCLEO INTELIGENTE AMPLIADO (Responde a tudo com naturalidade)
  function gerarRespostaInteligente(texto) {
    const t = texto.toLowerCase();

    if (t.includes('olá') || t.includes('ola') || t.includes('tudo bem') || t.includes('como vai')) {
      return `Olá, ${nomeUtilizador}! Por aqui está tudo em ordem e a postos. Como posso ajudar nos teus estudos ou trabalhos hoje?`;
    }
    if (t.includes('próton') || t.includes('proton')) {
      return `Um <b>próton</b> é uma partícula subatómica com carga elétrica positiva, encontrada no núcleo dos átomos, juntamente com os nêutrons. O número de prótons define qual é o elemento químico (por exemplo, o hidrogénio tem 1 próton).`;
    }
    if (t.includes('ciencia') || t.includes('ciência') || t.includes('fisica') || t.includes('física') || t.includes('quimica')) {
      return `A ciência estuda a natureza e o universo através de observação e experimentos rigorosos. Como tens total interesse em engenharia, mecânica e tecnologia, a física e a química estão sempre presentes nos motores, eletricidade e projetos web que crias!`;
    }
    if (t.includes('idioma') || t.includes('falar outro') || t.includes('ingles') || t.includes('espanhol')) {
      return `Claro que posso ensinar! Posso ajudar com vocabulário, tradução e gramática em Inglês, Espanhol, Francês ou qualquer outro idioma. Como dizes "Olá, como estás?" em inglês? É <i>"Hello, how are you?"</i>. Qual idioma queres praticar?`;
    }
    if (t.includes('descobriu o brasil') || t.includes('brasil')) {
      return `O Brasil foi oficialmente alcançado pela expedição portuguesa comandada por <b>Pedro Álvares Cabral</b> em 22 de abril de 1500.`;
    }
    if (t.includes('terra') && (t.includes('anos') || t.includes('idade'))) {
      return `O planeta Terra tem aproximadamente <b>4,54 mil milhões de anos</b>.`;
    }
    if (t.includes('javascript') || t.includes('código') || t.includes('programação')) {
      return `O JavaScript é a linguagem que dá vida e interatividade às páginas web — exatamente o que alimenta este chat do Pulse AI!`;
    }

    // Resposta contextual rica e dinâmica para qualquer outra pergunta
    return `Analisando a tua questão sobre "<i>${texto}</i>": como sou o teu assistente inteligente dedicado, posso ajudar a aprofundar este tema, explicar conceitos técnicos, estruturar ideias para a tua oficina ou criar códigos. Quer que eu elabore mais sobre este assunto, ${nomeUtilizador}?`;
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

    setTimeout(() => {
      if (idDigitando) idDigitando.remove();
      const respostaFinal = gerarRespostaInteligente(texto);
      adicionarBalao(respostaFinal, 'ai-message');
      falarTexto(respostaFinal);
    }, 400);
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
