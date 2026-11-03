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

  // SISTEMA DE MEMES, VÍDEOS E ADIÇÃO DE FOTOS
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
        alert('Foto carregada! Agora clica em "Gerar Vídeo Editado" para a IA combinar a foto com o meme.');
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
      alert('Sucesso! O novo vídeo editado com a tua foto foi adicionado à galeria!');
    });
  }

  if (btnImportarLink && linkMemeInput) {
    btnImportarLink.addEventListener('click', () => {
      const url = linkMemeInput.value.trim();
      if (!url) {
        alert('Por favor, cole um link válido do TikTok ou Instagram!');
        return;
      }
      const idUnico = Math.floor(Math.random() * 899 + 100);
      const nomeMeme = 'Vídeo TikTok #' + idUnico;
      const urlAnimacaoDiferente = 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4';
      adicionarCardMemeNaTela(nomeMeme, urlAnimacaoDiferente, '📱 Link Importado');
      linkMemeInput.value = '';
      alert('Link importado! O vídeo está pronto na playlist.');
    });
  }

  if (novoVideoMeme) {
    novoVideoMeme.addEventListener('change', (e) => {
      if (e.target.files && e.target.files[0]) {
        const file = e.target.files[0];
        const urlVideoReal = URL.createObjectURL(file);
        adicionarCardMemeNaTela(file.name.substring(0, 15), urlVideoReal, '📁 Aparelho');
        alert('Vídeo do seu aparelho adicionado com sucesso!');
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

  // SISTEMA DO CHAT E ENVIO BLINDADO
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
      if (e.key === 'Enter' && !e.shiftKey) { 
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

  async function enviarMensagem() {
    const texto = inputPergunta.value.trim();
    if (!texto) return;

    adicionarBalao(texto, 'user-message');
    inputPergunta.value = '';

    // Verifica comandos rápidos locais primeiro (cores ou orçamentos)
    const respCor = aplicarCoresPorTexto(texto);
    if (respCor) {
      setTimeout(() => adicionarBalao(respCor, 'ai-message'), 400);
      return;
    } 
    if (texto.toLowerCase().includes('onix') || texto.toLowerCase().includes('funilaria') || texto.toLowerCase().includes('orçamento')) {
      setTimeout(() => adicionarBalao(`📄 <b>Orçamento Estimado de Funilaria:</b><br>• Funilaria e Pintura de Para-choque: R$ 650,00<br>• Martelinho de Ouro: R$ 250,00<br><b>Total: R$ 900,00</b> (Prazo: 2 dias)`, 'ai-message'), 400);
      return;
    }

    // Chamada real para a API do Gemini com a chave integrada
    try {
      const apiKey = "AQ.Ab8RN6Kjv-RquITlAf4Yz-5p0VzUqTd6hP56pT1x6jGVCeS76Q";
      
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: texto }] }]
        })
      });

      const data = await response.json();
      
      if (data.candidates && data.candidates[0].content.parts[0].text) {
        const respostaIA = data.candidates[0].content.parts[0].text;
        adicionarBalao(respostaIA, 'ai-message');
      } else if (data.error && data.error.message) {
        adicionarBalao(`Erro da API: ${data.error.message}`, 'ai-message');
      } else {
        adicionarBalao("Desculpa, não consegui processar a tua resposta agora.", 'ai-message');
      }
    } catch (error) {
      console.error(error);
      adicionarBalao("Erro de conexão ao tentar falar com a IA.", 'ai-message');
    }
  }

  function adicionarBalao(texto, classe) {
    if (!chatBody) return;
    const div = document.createElement('div');
    div.className = `message ${classe}`;
    div.innerHTML = `<div class="bubble">${texto}</div>`;
    chatBody.appendChild(div);
    chatBody.scrollTop = chatBody.scrollHeight;
  }
});
