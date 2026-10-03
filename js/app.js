/**
 * Controlador de Interface e Interações - Simulador PLR CAIXA 2026
 */
document.addEventListener('DOMContentLoaded', () => {
  // Elementos do Formulário
  const rbInput = document.getElementById('rbInput');
  const tipoAdicional = document.getElementById('tipoAdicional');
  const socialInput = document.getElementById('socialInput');
  const depInput = document.getElementById('depInput');
  const pensaoInput = document.getElementById('pensaoInput');
  const checkAcumulo = document.getElementById('checkAcumulo');
  const plrMarcoInput = document.getElementById('plrMarcoInput');
  const boxPlrMarco = document.getElementById('boxPlrMarco');
  const badgeAcumulo = document.getElementById('badgeAcumulo');
  const btnLimpar = document.getElementById('btnLimpar');
  const btnCopiar = document.getElementById('btnCopiar');
  const copiadoAviso = document.getElementById('copiadoAviso');

  // Elementos do Reajuste
  const reajusteValorDisplay = document.getElementById('reajusteValorDisplay');
  const rbReajustadaDisplay = document.getElementById('rbReajustadaDisplay');

  // Cards Principais
  const cardLiqAnt = document.getElementById('cardLiqAnt');
  const cardBrutoAnt = document.getElementById('cardBrutoAnt');
  const cardIrrfAnt = document.getElementById('cardIrrfAnt');

  const cardLiqSaldo = document.getElementById('cardLiqSaldo');
  const cardBrutoSaldo = document.getElementById('cardBrutoSaldo');
  const cardIrrfSaldo = document.getElementById('cardIrrfSaldo');

  const cardLiqTotal = document.getElementById('cardLiqTotal');
  const cardBrutoTotal = document.getElementById('cardBrutoTotal');
  const cardIrrfTotal = document.getElementById('cardIrrfTotal');

  // Tabela Demonstrativa
  const detBasicaAnt = document.getElementById('detBasicaAnt');
  const detBasicaSaldo = document.getElementById('detBasicaSaldo');
  const detBasicaTotal = document.getElementById('detBasicaTotal');

  const detAdicAnt = document.getElementById('detAdicAnt');
  const detAdicSaldo = document.getElementById('detAdicSaldo');
  const detAdicTotal = document.getElementById('detAdicTotal');

  const detSocialAnt = document.getElementById('detSocialAnt');
  const detSocialSaldo = document.getElementById('detSocialSaldo');
  const detSocialTotal = document.getElementById('detSocialTotal');

  const detBrutoAnt = document.getElementById('detBrutoAnt');
  const detBrutoSaldo = document.getElementById('detBrutoSaldo');
  const detBrutoTotal = document.getElementById('detBrutoTotal');

  const detIrrfAnt = document.getElementById('detIrrfAnt');
  const detIrrfSaldo = document.getElementById('detIrrfSaldo');
  const detIrrfTotal = document.getElementById('detIrrfTotal');

  const detLiqAnt = document.getElementById('detLiqAnt');
  const detLiqSaldo = document.getElementById('detLiqSaldo');
  const detLiqTotal = document.getElementById('detLiqTotal');

  // ==========================================
  // Funções Auxiliares de Formatação Monetária
  // ==========================================
  function formatMoeda(val) {
    return (val || 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  }

  function parseMoeda(str) {
    if (!str) return 0;
    let limpo = str.toString().replace(/[^\d,.-]/g, '');
    if (limpo.includes(',') && limpo.includes('.')) {
      limpo = limpo.replace(/\./g, '').replace(',', '.');
    } else if (limpo.includes(',')) {
      limpo = limpo.replace(',', '.');
    }
    const val = parseFloat(limpo);
    return isNaN(val) ? 0 : val;
  }

  function aplicarMascara(input) {
    if (!input) return;
    input.addEventListener('blur', () => {
      const num = parseMoeda(input.value);
      if (num > 0) {
        input.value = num.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
      }
    });
  }

  aplicarMascara(rbInput);
  aplicarMascara(socialInput);
  aplicarMascara(pensaoInput);
  aplicarMascara(plrMarcoInput);

  if (checkAcumulo) {
    checkAcumulo.addEventListener('change', () => {
      if (boxPlrMarco) {
        boxPlrMarco.style.display = checkAcumulo.checked ? 'block' : 'none';
      }
      if (badgeAcumulo) {
        badgeAcumulo.style.display = checkAcumulo.checked ? 'inline-block' : 'none';
      }
      recalcular();
    });
  }

  // ==========================================
  // Atualização dos Resultados na Interface
  // ==========================================
  function recalcular() {
    const rbAnt = parseMoeda(rbInput.value);
    const socialSem = parseMoeda(socialInput.value);
    const dependentes = parseInt(depInput.value, 10) || 0;
    const pensao = parseMoeda(pensaoInput.value);
    const considerarMarco = checkAcumulo ? checkAcumulo.checked : true;
    const plrMarco = parseMoeda(plrMarcoInput ? plrMarcoInput.value : '');

    // Se o usuário não digitou o valor de março, exibe no placeholder a estimativa sugerida
    if (plrMarcoInput && !plrMarcoInput.value && rbAnt > 0) {
      const estMarco = Math.round(rbAnt * 1.05 * 100) / 100;
      plrMarcoInput.placeholder = `Est: ${formatMoeda(estMarco)}`;
    }

    // Estado Zerado
    if (rbAnt <= 0) {
      reajusteValorDisplay.innerText = '+ R$ 0,00';
      rbReajustadaDisplay.innerText = 'R$ 0,00';

      [cardLiqAnt, cardBrutoAnt, cardLiqSaldo, cardBrutoSaldo, cardLiqTotal, cardBrutoTotal,
       detBasicaAnt, detBasicaSaldo, detBasicaTotal, detAdicAnt, detAdicSaldo, detAdicTotal,
       detSocialAnt, detSocialSaldo, detSocialTotal, detBrutoAnt, detBrutoSaldo, detBrutoTotal,
       detLiqAnt, detLiqSaldo, detLiqTotal].forEach(el => {
        if (el) el.innerText = 'R$ 0,00';
      });

      [detIrrfAnt, detIrrfSaldo, detIrrfTotal, cardIrrfAnt, cardIrrfSaldo, cardIrrfTotal].forEach(el => {
        if (el) el.innerText = '- R$ 0,00';
      });
      return;
    }

    // Processamento do Cálculo
    const res = PLRCalculator.calcular({
      rbAnt,
      socialSem,
      tipoAdicional: tipoAdicional.value,
      dependentes,
      pensao,
      considerarMarco,
      plrMarco
    });

    if (!res) return;

    // Atualização do Reajuste
    reajusteValorDisplay.innerText = `+ ${formatMoeda(res.reajuste.aumento)}`;
    rbReajustadaDisplay.innerText = formatMoeda(res.reajuste.rbNova);

    // Cards de Resumo
    cardLiqAnt.innerText = formatMoeda(res.antecipacao.liquido);
    cardBrutoAnt.innerText = formatMoeda(res.antecipacao.bruto);
    if (cardIrrfAnt) cardIrrfAnt.innerText = `- ${formatMoeda(res.antecipacao.irrf)}`;

    cardLiqSaldo.innerText = formatMoeda(res.saldo.liquido);
    cardBrutoSaldo.innerText = formatMoeda(res.saldo.bruto);
    if (cardIrrfSaldo) cardIrrfSaldo.innerText = `- ${formatMoeda(res.saldo.irrf)}`;

    cardLiqTotal.innerText = formatMoeda(res.total.liquido);
    cardBrutoTotal.innerText = formatMoeda(res.total.bruto);
    if (cardIrrfTotal) cardIrrfTotal.innerText = `- ${formatMoeda(res.total.irrf)}`;

    // Tabela - Linha 1: Regra Básica
    detBasicaAnt.innerText = formatMoeda(res.antecipacao.basica);
    detBasicaSaldo.innerText = formatMoeda(res.saldo.basica);
    detBasicaTotal.innerText = formatMoeda(res.total.basica);

    // Tabela - Linha 2: Parcela Adicional
    detAdicAnt.innerText = formatMoeda(res.antecipacao.adicional);
    detAdicSaldo.innerText = formatMoeda(res.saldo.adicional);
    detAdicTotal.innerText = formatMoeda(res.total.adicional);

    // Tabela - Linha 3: PLR Social
    detSocialAnt.innerText = formatMoeda(res.antecipacao.social);
    detSocialSaldo.innerText = formatMoeda(res.saldo.social);
    detSocialTotal.innerText = formatMoeda(res.total.social);

    // Tabela - Linha 4: Total Bruto
    detBrutoAnt.innerText = formatMoeda(res.antecipacao.bruto);
    detBrutoSaldo.innerText = formatMoeda(res.saldo.bruto);
    detBrutoTotal.innerText = formatMoeda(res.total.bruto);

    // Tabela - Linha 5: IRRF
    detIrrfAnt.innerText = `- ${formatMoeda(res.antecipacao.irrf)}`;
    detIrrfSaldo.innerText = `- ${formatMoeda(res.saldo.irrf)}`;
    detIrrfTotal.innerText = `- ${formatMoeda(res.total.irrf)}`;

    // Tabela - Linha 6: Líquido em Conta
    detLiqAnt.innerText = formatMoeda(res.antecipacao.liquido);
    detLiqSaldo.innerText = formatMoeda(res.saldo.liquido);
    detLiqTotal.innerText = formatMoeda(res.total.liquido);
  }

  // ==========================================
  // Botão Limpar Campos
  // ==========================================
  btnLimpar.addEventListener('click', () => {
    rbInput.value = '';
    pensaoInput.value = '';
    depInput.value = '0';
    socialInput.value = '2.000,00';
    tipoAdicional.value = 'calculada';
    if (plrMarcoInput) {
      plrMarcoInput.value = '';
      plrMarcoInput.placeholder = 'Estimativa automática';
    }
    if (checkAcumulo) {
      checkAcumulo.checked = true;
      if (boxPlrMarco) boxPlrMarco.style.display = 'block';
      if (badgeAcumulo) badgeAcumulo.style.display = 'inline-block';
    }
    recalcular();
    rbInput.focus();
  });

  // ==========================================
  // Compartilhamento via WhatsApp
  // ==========================================
  btnCopiar.addEventListener('click', () => {
    const rbAnt = parseMoeda(rbInput.value);
    if (rbAnt <= 0) {
      alert('Por favor, informe a Remuneração-Base antes de copiar o demonstrativo.');
      rbInput.focus();
      return;
    }

    const considerarMarco = checkAcumulo ? checkAcumulo.checked : true;
    const plrMarco = parseMoeda(plrMarcoInput ? plrMarcoInput.value : '');

    const res = PLRCalculator.calcular({
      rbAnt,
      socialSem: parseMoeda(socialInput.value),
      tipoAdicional: tipoAdicional.value,
      dependentes: parseInt(depInput.value, 10) || 0,
      pensao: parseMoeda(pensaoInput.value),
      considerarMarco,
      plrMarco
    });

    const infoMarco = considerarMarco
      ? `• Acúmulo Ano Civil: Considerada PLR de Março/26 (${formatMoeda(res.acumuloMarco.plrMarcoUsada)})\n`
      : `• Tributação: Parcelas calculadas de forma isolada\n`;

    const texto = `*SIMULADOR PLR CAIXA 2026 (BALANÇO 1S2026)*\n` +
      `• RB Anterior (Agosto/26): ${formatMoeda(rbAnt)}\n` +
      `• Nova RB (+4,6% em Set/26): ${formatMoeda(res.reajuste.rbNova)}\n` +
      infoMarco +
      `• Lucro Líquido 1S26: R$ 7,368 bi | Quadro: 84.136 empregados\n\n` +
      `----------------------------------------\n` +
      `*1ª PARCELA: ANTECIPAÇÃO (20/10/2026)*\n` +
      `• Bruto: ${detBrutoAnt.innerText}\n` +
      `• IRRF Retido: ${detIrrfAnt.innerText}\n` +
      `*👉 LÍQUIDO EM CONTA: ${cardLiqAnt.innerText}*\n` +
      `----------------------------------------\n` +
      `*2ª PARCELA: SALDO FINAL (MARÇO/2027)*\n` +
      `• Bruto: ${detBrutoSaldo.innerText}\n` +
      `• IRRF Estimado: ${detIrrfSaldo.innerText}\n` +
      `*👉 LÍQUIDO ESTIMADO: ${cardLiqSaldo.innerText}*\n` +
      `----------------------------------------\n` +
      `*PLR TOTAL DO ANO (2026):*\n` +
      `• Bruto Total: ${cardBrutoTotal.innerText}\n` +
      `• IRRF Total: ${detIrrfTotal.innerText}\n` +
      `• Líquido Total: ${cardLiqTotal.innerText}\n\n` +
      `_⚠️ Regra da Folha da CAIXA e Receita Federal: O IRRF de outubro acumula com março no ano civil._\n` +
      `_Fontes: Balanço CAIXA 1S2026 e Sentença Normativa TST (23/09/2026)._`;

    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(texto).then(() => {
        mostrarAvisoCopiado();
      }).catch(() => {
        fallbackCopiar(texto);
      });
    } else {
      fallbackCopiar(texto);
    }
  });

  function fallbackCopiar(texto) {
    const ta = document.createElement('textarea');
    ta.value = texto;
    ta.style.position = 'fixed';
    ta.style.opacity = '0';
    document.body.appendChild(ta);
    ta.select();
    try {
      document.execCommand('copy');
      mostrarAvisoCopiado();
    } catch (e) {
      alert('Não foi possível copiar automaticamente. Selecione e copie o texto manualmente.');
    }
    document.body.removeChild(ta);
  }

  function mostrarAvisoCopiado() {
    copiadoAviso.classList.remove('hidden');
    copiadoAviso.classList.add('animate-fade-in');
    setTimeout(() => {
      copiadoAviso.classList.add('hidden');
      copiadoAviso.classList.remove('animate-fade-in');
    }, 3500);
  }

  // ==========================================
  // Registro de Eventos dos Inputs
  // ==========================================
  [rbInput, tipoAdicional, socialInput, depInput, pensaoInput, plrMarcoInput].forEach(el => {
    if (el) {
      el.addEventListener('input', recalcular);
      el.addEventListener('change', recalcular);
    }
  });

  // Executa o cálculo inicial
  recalcular();
});
