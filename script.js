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
        <div class="bubble">Olá, <b>${nomeUtilizador}</b>! O motor de alta velocidade e o gerador de imagens estão ativos. O que vamos ver ou criar hoje?</div>
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
    return texto
      .replace(/###\s*(.*?)/g, '<br><br><b>◆ $1</b><br>')
      .replace(/##\s*(.*?)/g, '<br><br><b>■ $1</b><br>')
      .replace(/\*\*(.*?)\*\*/g, '<b>$1</b>')
      .replace(/\*/g, '•')
      .replace(/\n/g, '<br>');
  }

  // MOTOR DE RESPOSTA RÁPIDA LOCAL (Caso a IA externe demore mais de 3.5 segundos)
  function gerarRespostaInstantanea(texto) {
    const t = texto.toLowerCase();
    if (t.includes('multímetro') || t.includes('multimetro') || t.includes('capacitor')) {
      return `<b>◆ Guia Rápido para Multímetro em Capacitores:</b><br><br>• <b>Função Capacitância:</b> Escolha um multímetro digital que possua a escala marcada com o símbolo <b>μF</b> ou <b>nF</b>.<br>• <b>Como testar:</b> Descarregue o capacitor por segurança, coloque o seletor na escala adequada e conecte as pontas de prova nos terminais.<br>• <b>Modelos recomendados:</b> Multímetros digitais automáticos como o <i>Aneng SZ01</i> ou <i>Fluke 101</i> são excelentes para bancadas e oficinas.`;
    }
    if (t.includes('olá') || t.includes('ola')) {
      return `Olá, ${nomeUtilizador}! Tudo em ordem por aqui. Em que posso ajudar nos seus projetos hoje?`;
    }
    return `Analisando a sua questão sobre "${texto}": como assistente avançado do ${nomeUtilizador}, estou operando em alta velocidade para estruturar informações técnicas e projetos práticos. Como deseja prosseguir?`;
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

    // VERIFICA SE O USUÁRIO PEDIU UMA FOTO / IMAGEM
    const tLower = texto.toLowerCase();
    if (tLower.includes('foto') || tLower.includes('imagem') || t.includes('mostre') || t.includes('mande uma')) {
      const HTMLPontinhosImg = `<div class="typing-dots"><span></span><span></span><span></span></div>`;
      const idDigImg = adicionarBalao(HTMLPontinhosImg, 'ai-message digitando');

      setTimeout(() => {
        if (idDigImg) idDigImg.remove();
        // Gera a imagem usando a API gratuita de imagens do Pollinations baseada no texto do usuário
        const urlImagemGerada = `https://image.pollinations.ai/prompt/${encodeURIComponent(texto)}?width=600&height=350&nologo=true`;
        const htmlComFoto = `Aqui está a imagem solicitada:<br><img src="${urlImagemGerada}" style="width:100%; border-radius:8px; margin-top:8px; background:#000;" alt="Imagem Gerada">`;
        adicionarBalao(htmlComFoto, 'ai-message');
        falarTexto("Aqui está a imagem que você pediu.");
      }, 1500); // Responde em 1.5 segundos com a imagem gerada
      return;
    }

    const HTMLPontinhos = `<div class="typing-dots"><span></span><span></span><span></span></div>`;
    const idDigitando = adicionarBalao(HTMLPontinhos, 'ai-message digitando');

    let respostaEntregue = false;

    // TIMEOUT DE 3.5 SEGUNDOS (Garante resposta ultrarrápida sem travamentos)
    const timerRapido = setTimeout(() => {
      if (!respostaEntregue) {
        respostaEntregue = true;
        if (idDigitando) idDigitando.remove();
        const respLocal = gerarRespostaInstantanea(texto);
        adicionarBalao(respLocal, 'ai-message');
        falarTexto(respLocal);
      }
    }, 3500);

    try {
      const promptSistema = `Você é o Pulse AI, um assistente virtual veloz criado por ${nomeUtilizador} (Lucas Cardoso Alves). Responda em português brasileiro de forma direta, organizada em tópicos curtos.`;
      const url = `https://text.pollinations.ai/${encodeURIComponent(promptSistema + "\nPergunta: " + texto)}`;

      const response = await fetch(url);
      
      if (response.ok && !respostaEntregue) {
        const respostaBruta = await response.text();
        if (respostaBruta && respostaBruta.length > 3) {
          respostaEntregue = true;
          clearTimeout(timerRapido);
          if (idDigitando) idDigitando.remove();
          const textoFormatado = formatarTextoIA(respostaBruta);
          adicionarBalao(textoFormatado, 'ai-message');
          falarTexto(respostaBruta);
        }
      }
    } catch (err) {
      // O timeout de segurança já lida com o erro se falhar
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
