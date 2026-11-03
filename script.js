async function enviarMensagem() {
    const texto = inputPergunta.value.trim();
    if (!texto) return;

    adicionarBalao(texto, 'user-message');
    inputPergunta.value = '';

    // 1. Resposta rápida para comandos de cores
    const respCor = aplicarCoresPorTexto(texto);
    if (respCor) {
      setTimeout(() => adicionarBalao(respCor, 'ai-message'), 200);
      return;
    } 

    const tLower = texto.toLowerCase();

    // 2. Respostas locais instantâneas e naturais para cumprimentos e mecânica
    if (tLower.includes('olá') || tLower.includes('ola') || tLower.includes('tudo bem') || tLower.includes('como vai')) {
      setTimeout(() => {
        adicionarBalao("Tudo ótimo por aqui! O <b>Pulse AI</b> está a todo vapor[cite: 8]. Como posso ajudar nos teus projetos ou orçamentos hoje?", 'ai-message');
      }, 300);
      return;
    }

    if (tLower.includes('alternador') && (tLower.includes('transmissor') || tLower.includes('diferença'))) {
      setTimeout(() => {
        adicionarBalao(`⚡ <b>Diferença entre Alternador e Transmissor:</b><br><br>• <b>Alternador:</b> É um gerador elétrico do veículo acionado pelo motor. Ele converte energia mecânica em energia elétrica para recarregar a bateria.<br><br>• <b>Transmissor:</b> É o conjunto mecânico/eletrónico encarregado de transferir a força do motor para as rodas ou emitir dados de sensores.`, 'ai-message');
      }, 300);
      return;
    }

    if (tLower.includes('onix') || tLower.includes('funilaria') || tLower.includes('orçamento')) {
      setTimeout(() => adicionarBalao(`📄 <b>Orçamento Estimado de Funilaria:</b><br>• Funilaria e Pintura de Para-choque: R$ 650,00<br>• Martelinho de Ouro: R$ 250,00<br><b>Total: R$ 900,00</b> (Prazo: 2 dias)`, 'ai-message'), 300);
      return;
    }

    // 3. Efeito dos 3 pontinhos a saltar
    const HTMLPontinhos = `<div class="typing-dots"><span></span><span></span><span></span></div>`;
    const idDigitando = adicionarBalao(HTMLPontinhos, 'ai-message digitando');

    // Aumentamos o limite para 8 segundos para dar folga à API responder
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 8000);

    try {
      const response = await fetch(`https://text.pollinations.ai/${encodeURIComponent(texto)}?system=Você é o Pulse AI, um assistente inteligente, amigável e especialista em tecnologia e mecânica. Responda de forma direta em português, sem asteriscos.`, {
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);
      if (idDigitando) idDigitando.remove();

      if (response.ok) {
        const respostaIA = await response.text();
        adicionarBalao(formatarTextoIA(respostaIA), 'ai-message');
      } else {
        adicionarBalao("Estou a postos! O que vamos criar ou verificar agora?", 'ai-message');
      }
    } catch (error) {
      clearTimeout(timeoutId);
      if (idDigitando) idDigitando.remove();

      // Fallback amigável caso a rede oscile
      adicionarBalao("Estou por aqui e preparado! Como posso ajudar na oficina ou nos teus códigos hoje?", 'ai-message');
    }
  }
