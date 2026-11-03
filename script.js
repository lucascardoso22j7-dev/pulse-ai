document.addEventListener('DOMContentLoaded', () => {
  const chatBody = document.getElementById('historico');
  const color1 = document.getElementById('color1');
  const color2 = document.getElementById('color2');

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
        adicionarCardMemeNavTela(file.name.substring(0, 15), urlVideoReal, '📁 Aparelho');
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
  // SISTEMA DO CHAT E MOTOR INTELIGENTE INSTANTÂNEO
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
        chatBody.innerHTML = `<div class="message ai-message"><div class="bubble">Conversa reiniciada. Como posso ajudar?</div></div>`;
      }
    });
  }

  function enviarMensagem() {
    if (!inputPergunta) return;
    const texto = inputPergunta.value.trim();
    if (!texto) return;

    adicionarBalao(texto, 'user-message');
    inputPergunta.value = '';

    // 1. Comandos locais de cores
    const respCor = aplicarCoresPorTexto(texto);
    if (respCor) {
      setTimeout(() => adicionarBalao(respCor, 'ai-message'), 300);
      return;
    } 

    const tLower = texto.toLowerCase();

    // 2. Cria balão com efeito de "a digitar" (3 pontinhos vermelhos saltando)
    const HTMLPontinhos = `<div class="typing-dots"><span></span><span></span><span></span></div>`;
    const idDigitando = adicionarBalao(HTMLPontinhos, 'ai-message digitando');

    // 3. Motor inteligente local (sempre responde rápido e sem falhas de rede)
    setTimeout(() => {
      if (idDigitando) idDigitando.remove();

      let resposta = "";

      if (tLower.includes('multímetro') || tLower.includes('multimetro') || tLower.includes('medir')) {
        resposta = `⚡ <b>Como usar um Multímetro:</b><br><br>1. <b>Tensão Contínua (DCV):</b> Ajuste o seletor para medir baterias de carros (geralmente em 20V).<br>2. <b>Pontas de Prova:</b> Conecte a ponta preta no borne <b>COM</b> e a vermelha no <b>VΩmA</b>.<br>3. <b>Medição:</b> Encoste a ponta vermelha no polo positivo e a preta no negativo para verificar a carga.`;
      } 
      else if (tLower.includes('alternador') || tLower.includes('transmissor')) {
        resposta = `⚡ <b>Alternador vs Transmissor:</b><br><br>• <b>Alternador:</b> Gera energia elétrica no motor para alimentar o sistema e recarregar a bateria.<br>• <b>Transmissor:</b> Transfere a força mecânica do motor para as rodas ou transmite sinais de sensores.`;
      } 
      else if (tLower.includes('onix') || tLower.includes('funilaria') || tLower.includes('orçamento')) {
        resposta = `📄 <b>Orçamento Estimado de Funilaria:</b><br>• Funilaria e Pintura de Para-choque: R$ 650,00<br>• Martelinho de Ouro: R$ 250,00<br><b>Total: R$ 900,00</b> (Prazo: 2 dias)`;
      } 
      else if (tLower.includes('olá') || tLower.includes('ola') || tLower.includes('tudo bem') || tLower.includes('como vai')) {
        resposta = `Tudo ótimo por aqui! O <b>Pulse AI</b> está a todo vapor[cite: 8]. Como posso ajudar nos teus projetos ou na oficina hoje?`;
      } 
      else {
        resposta = `Compreendi a tua questão sobre "<i>${texto}</i>". O Pulse AI está com os módulos de oficina, código e ferramentas ativados. Como deseja avançar?`;
      }

      adicionarBalao(resposta, 'ai-message');
    }, 700);
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
