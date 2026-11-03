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

    // 2. Resposta rápida para dúvidas técnicas/mecânicas conhecidas
    if (tLower.includes('alternador') && (tLower.includes('transmissor') || tLower.includes('diferença'))) {
      setTimeout(() => {
        adicionarBalao(`⚡ <b>Diferença entre Alternador e Transmissor:</b><br><br>• <b>Alternador:</b> É um gerador elétrico do veículo acionado pelo motor. Ele converte energia mecânica em energia elétrica para recarregar a bateria e alimentar o sistema elétrico enquanto o veículo trabalha.<br><br>• <b>Transmissor:</b> É um componente mecânico ou eletrónico (como a caixa de velocidades/câmbio ou um transmissor de sinal) encarregado de transferir a força do motor para as rodas ou emitir dados de sensores.`, 'ai-message');
      }, 300);
      return;
    }

    if (tLower.includes('onix') || tLower.includes('funilaria') || tLower.includes('orçamento')) {
      setTimeout(() => adicionarBalao(`📄 <b>Orçamento Estimado de Funilaria:</b><br>• Funilaria e Pintura de Para-choque: R$ 650,00<br>• Martelinho de Ouro: R$ 250,00<br><b>Total: R$ 900,00</b> (Prazo: 2 dias)`, 'ai-message'), 300);
      return;
    }

    // 3. Indicador visual dos 3 pontinhos a saltar
    const HTMLPontinhos = `<div class="typing-dots"><span></span><span></span><span></span></div>`;
    const idDigitando = adicionarBalao(HTMLPontinhos, 'ai-message digitando');

    // Limite de tempo de resposta (2.5s)
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 2500);

    try {
      const response = await fetch(`https://text.pollinations.ai/${encodeURIComponent(texto)}?system=Você é o assistente Pulse AI. Responda de forma direta e curta em português.`, {
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);
      if (idDigitando) idDigitando.remove();

      if (response.ok) {
        const respostaIA = await response.text();
        adicionarBalao(respostaIA, 'ai-message');
      } else {
        adicionarBalao(`Entendi a sua dúvida sobre "${texto}". Como posso te ajudar a prosseguir?`, 'ai-message');
      }
    } catch (error) {
      clearTimeout(timeoutId);
      if (idDigitando) idDigitando.remove();

      adicionarBalao(`Compreendi o seu comando sobre "<i>${texto}</i>". Como posso ajudar no próximo passo?`, 'ai-message');
    }
  }
