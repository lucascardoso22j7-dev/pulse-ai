document.addEventListener('DOMContentLoaded', () => {
  const chatBody = document.getElementById('historico');
  const color1 = document.getElementById('color1');
  const color2 = document.getElementById('color2');

  // SISTEMA DE NOME PERSONALIZADO (MEMORIZAÇÃO AUTOMÁTICA)
  let nomeUtilizador = localStorage.getItem('pulse_user_name');

  if (!nomeUtilizador) {
    nomeUtilizador = prompt("Olá! Seja bem-vindo ao Pulse AI. Qual é o seu nome?") || "Visitante";
    localStorage.setItem('pulse_user_name', nomeUtilizador);
  }

  // Exibir mensagem de boas-vindas personalizada ao carregar
  if (chatBody) {
    chatBody.innerHTML = `
      <div class="message ai-message">
        <div class="bubble">Olá, <b>${nomeUtilizador}</b>! O <b>Pulse AI</b> está pronto. Podes aceder às ferramentas no menu + ou ir diretamente para o estúdio de memes para criar edições virais!</div>
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

  // FERRAMENTAS DO MENU (+)
  const btnMenuOrcamento = document.getElementById('btnMenuOrcamento');
  const btnMenuCortes = document.getElementById('btnMenuCortes');
  const btnMenuImagem = document.getElementById('btnMenuImagem');
  const uploadEditarImagem = document.getElementById('uploadEditarImagem');

  if (btnMenuOrcamento) {
    btnMenuOrcamento.addEventListener('click', () => {
      menuAnexo.classList.remove('active');
      adicionarBalao(`📄 <b>Módulo de Orçamento de Funilaria:</b><br>Digite os detalhes do dano do veículo (ex: <i>"Amassado na porta do Onix"</i>) para gerar a estimativa de custos para o seu pai.`, 'ai-message');
    });
  }

  if (btnMenuCortes) {
    btnMenuCortes.addEventListener('click', () => {
      menuAnexo.classList.remove('active');
      adicionarBalao(`🎬 <b>Gerador de Cortes Automáticos:</b><br>Envie o vídeo bruto da sua galeria para a IA recortar os melhores momentos com legendas automáticas.`, 'ai-message');
    });
  }

  if (btnMenuImagem) {
    btnMenuImagem.addEventListener('click', () => {
      menuAnexo.classList.remove('active');
      adicionarBalao('🎨 Digite o comando do que deseja criar (ex: <i>"gerar imagem de um carro futurista neon"</i>):', 'ai-message');
    });
  }

  if (uploadEditarImagem) {
    uploadEditarImagem.addEventListener('change', (e) => {
      menuAnexo.classList.remove('active');
      if (e.target.files && e.target.files[0]) {
        const file = e.target.files[0];
        const imgUrl = URL.createObjectURL(file);
        adicionarBalao(`📷 <b>Foto carregada para edição:</b><br><img src="${imgUrl}" style="max-width:160px; border-radius:8px; margin-top:6px;"><br>O que deseja editar nela?`, 'ai-message');
      }
    });
  }

  // SISTEMA DE MEMES E VÍDEOS
  const btnImportarLink = document.getElementById('btnImportarLink');
  const linkMemeInput = document.getElementById('linkMemeInput');
  const playlistMemes = document.getElementById('playlistMemes');
  const novoVideoMeme = document.getElementById('novoVideoMeme');
  const uploadFotoMeme = document.getElementById('uploadFotoMeme');
  const painelFotoEdicao = document.getElementById('painelFotoEdicao');
  const imgMemePreview = document.getElementById('imgMemePreview');
  const btnGerarMemeComFoto = document.getElementById('btnGerarMemeComFoto');

  if (uploadFotoMeme) {
    uploadFotoMeme.addEventListener('change', (e) => {
      if (e.target.files && e.target.files[0]) {
        const file = e.target.files[0];
        const imgUrl = URL.createObjectURL(file);
        imgMemePreview.src = imgUrl;
        painelFotoEdicao.style.display = 'block';
        alert('Foto carregada! Agora clica em "Gerar Vídeo Editado".');
      }
    });
  }

  if (btnGerarMemeComFoto) {
    btnGerarMemeComFoto.addEventListener('click', () => {
      const idUnico = Math.floor(Math.random() * 899 + 100);
      const nomeNovoMeme = 'Meme Editado #' + idUnico;
      const urlVideoEditado = 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4';
      adicionarCardMemeNaTela(nomeNovoMeme, urlVideoEditado, '✨ Com Tua Foto');
      painelFotoEdicao.style.display = 'none';
      alert('Sucesso! Vídeo editado adicionado à galeria.');
    });
  }

  if (btnImportarLink && linkMemeInput) {
    btnImportarLink.addEventListener('click', () => {
      const url = linkMemeInput.value.trim();
      if (!url) { alert('Cole um link válido!'); return; }
      const idUnico = Math.floor(Math.random() * 899 + 100);
      adicionarCardMemeNaTela('Vídeo TikTok #' + idUnico, 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4', '📱 Link Importado');
      linkMemeInput.value = '';
      alert('Link importado com sucesso!');
    });
  }

  if (novoVideoMeme) {
    novoVideoMeme.addEventListener('change', (e) => {
      if (e.target.files && e.target.files[0]) {
        const file = e.target.files[0];
        const urlVideoReal = URL.createObjectURL(file);
        adicionarCardMemeNaTela(file.name.substring(0, 15), urlVideoReal, '📁 Aparelho');
        alert('Vídeo do aparelho adicionado!');
      }
    });
  }

  function adicionarCardMemeNaTela(nome, urlVideo, tipoBadge) {
    if (!playlistMemes) return;
    const card = document.createElement('div');
    card.className = 'meme-card active-meme';
    card.innerHTML = `
      <div class="badge-pessoas">${tipoBadge}</div>
      <video src="${urlVideo}" style="width:100%; height:90px; object-fit:cover; border-radius:6px; background:#000;" controls preload="metadata"></video>
      <span style="font-size:11px; font-weight:bold; display:block; margin-top:4px;">${nome}</span>
    `;
    document.querySelectorAll('.meme-card').forEach(c => c.classList.remove('active-meme'));
    card.addEventListener('click', (e) => {
      if (e.target.tagName === 'VIDEO') return;
      document.querySelectorAll('.meme-card').forEach(c => c.classList.remove('active-meme'));
      card.classList.add('active-meme');
      const vidEl = card.querySelector('video');
      if (vidEl) { vidEl.paused ? vidEl.play() : vidEl.pause(); }
    });
    playlistMemes.prepend(card);
  }

  // ==========================================
  // SISTEMA DO CHAT COM IA REAL E COMPLETA
  // ==========================================
  const btnPerguntar = document.getElementById('btnPerguntar');
  const inputPergunta = document.getElementById('pergunta');
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

    // 1. Comandos locais de cores rápidos
    const respCor = aplicarCoresPorTexto(texto);
    if (respCor) {
      setTimeout(() => adicionarBalao(respCor, 'ai-message'), 200);
      return;
    } 

    const tLower = texto.toLowerCase();

    // 2. Resposta local instantânea para orçamentos da oficina
    if (tLower.includes('onix') || tLower.includes('funilaria') || tLower.includes('orçamento')) {
      setTimeout(() => adicionarBalao(`📄 <b>Orçamento Estimado de Funilaria:</b><br>• Funilaria e Pintura de Para-choque: R$ 650,00<br>• Martelinho de Ouro: R$ 250,00<br><b>Total: R$ 900,00</b> (Prazo: 2 dias)`, 'ai-message'), 200);
      return;
    }

    // 3. Mostra os 3 pontinhos vermelhos a saltar na bolha
    const HTMLPontinhos = `<div class="typing-dots"><span></span><span></span><span></span></div>`;
    const idDigitando = adicionarBalao(HTMLPontinhos, 'ai-message digitando');

    // 4. Chamada à IA Livre com o nome do utilizador no contexto
    try {
      const promptSistema = encodeURIComponent(`És o Pulse AI, um assistente inteligente e prestativo. O utilizador com quem estás a falar chama-se ${nomeUtilizador}. Responde em português de forma direta, sem usar asteriscos.`);
      const promptUsuario = encodeURIComponent(texto);
      
      const response = await fetch(`https://text.pollinations.ai/${promptSistema}%20${promptUsuario}?model=openai`);

      if (idDigitando) idDigitando.remove();

      if (response.ok) {
        const respostaTexto = await response.text();
        adicionarBalao(formatarTextoIA(respostaTexto), 'ai-message');
      } else {
        adicionarBalao("Estou a ter um pequeno pico de acessos. Podes perguntar novamente?", 'ai-message');
      }
    } catch (error) {
      if (idDigitando) idDigitando.remove();
      console.error(error);
      adicionarBalao("Sem conexão no momento. Tenta novamente em alguns segundos!", 'ai-message');
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
