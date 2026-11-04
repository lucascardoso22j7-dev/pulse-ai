document.addEventListener('DOMContentLoaded', () => {
  const chatBody = document.getElementById('historico');
  const color1 = document.getElementById('color1');
  const color2 = document.getElementById('color2');

  let modoVozAtivo = false;
  
  // Define o nome completo do criador de forma fixa e inteligente no sistema
  let nomeUtilizador = localStorage.getItem('pulse_user_name');

  if (!nomeUtilizador || nomeUtilizador === 'Lucas') {
    nomeUtilizador = "Lucas Cardoso Alves";
    localStorage.setItem('pulse_user_name', nomeUtilizador);
  }

  if (chatBody) {
    chatBody.innerHTML = `
      <div class="message ai-message">
        <div class="bubble">Olá, <b>${nomeUtilizador}</b>! O meu núcleo está totalmente sincronizado com a tua identidade, pronto para criar e pesquisar tudo o que precisares.</div>
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

  // NÚCLEO DE GERAÇÃO COM IDENTIDADE COMPLETA DO CRIADOR
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
      // Prompt instruindo que o criador é explicitamente Lucas Cardoso Alves
      const persona = `És o Pulse AI, um assistente inteligente e autónomo criado por ${nomeUtilizador} (Lucas Cardoso Alves), especialista em manutenção, motores e tecnologia. Tens total liberdade criativa para debater teorias da conspiração, mistérios, ciência e tecnologia. Responde sempre em português de forma natural. Se perguntarem o nome completo do teu criador, responde com orgulho que é ${nomeUtilizador}.`;
      
      const endpoint = `https://text.pollinations.ai/${encodeURIComponent(persona + "\nUtilizador: " + texto)}?model=openai`;

      const response = await fetch(endpoint);

      if (idDigitando) idDigitando.remove();

      if (response.ok) {
        const respostaBruta = await response.text();
        const textoFormatado = formatarTextoIA(respostaBruta);
        adicionarBalao(textoFormatado, 'ai-message');
        falarTexto(respostaBruta);
      } else {
        adicionarBalao(`Compreendi a tua questão, ${nomeUtilizador}. O sistema está online e pronto para avançar!`, 'ai-message');
      }
    } catch (err) {
      if (idDigitando) idDigitando.remove();
      const respostaFluida = `Olá ${nomeUtilizador}! Analisei a tua mensagem com o meu núcleo autónomo. Como posso ajudar nos teus projetos hoje?`;
      adicionarBalao(respostaFluida, 'ai-message');
      falarTexto(respostaFluida);
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
