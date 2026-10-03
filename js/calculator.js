/**
 * Motor de Cálculo da PLR CAIXA 2026
 * Responsável por toda a matemática de antecipação, saldo, regras de teto e IRRF progressivo.
 */
const PLRCalculator = {
  /**
   * Calcula o IRRF com base na tabela progressiva exclusiva da PLR
   * @param {number} base - Base de cálculo (Rendimentos Brutos - Deduções)
   * @returns {{ imposto: number, aliq: number }}
   */
  calcIRRF(base) {
    if (base <= 0) return { imposto: 0, aliq: 0 };

    for (const faixa of PLR_CONFIG.TABELA_IRRF) {
      if (base <= faixa.limite) {
        const imposto = Math.max(0, (base * faixa.aliquota) - faixa.deducao);
        return {
          imposto: imposto,
          aliq: faixa.aliquota * 100
        };
      }
    }

    const ultimaFaixa = PLR_CONFIG.TABELA_IRRF[PLR_CONFIG.TABELA_IRRF.length - 1];
    return {
      imposto: Math.max(0, (base * ultimaFaixa.aliquota) - ultimaFaixa.deducao),
      aliq: ultimaFaixa.aliquota * 100
    };
  },

  /**
   * Executa a simulação completa da PLR
   * @param {Object} params
   * @param {number} params.rbAnt - Remuneração-Base anterior ao reajuste
   * @param {number} params.socialSem - PLR Social informada para o semestre
   * @param {string} params.tipoAdicional - 'calculada' (R$ 1.926,60) ou 'teto' (R$ 3.837,04)
   * @param {number} params.dependentes - Quantidade de dependentes para IR
   * @param {number} params.pensao - Valor de pensão alimentícia judicial
   * @returns {Object} Resultados discriminados por parcela e totais
   */
  calcular({ rbAnt, socialSem, tipoAdicional, dependentes, pensao }) {
    if (rbAnt <= 0) {
      return null;
    }

    // Aplicação do reajuste salarial da CCT (+4,60%)
    const aumento = rbAnt * PLR_CONFIG.REAJUSTE;
    const rbNova = rbAnt + aumento;

    // ----------------------------------------------------
    // 1. Antecipação (20/10/2026) - 1ª Parcela
    // ----------------------------------------------------
    const basicaAntCalc = (0.54 * rbNova) + PLR_CONFIG.FIXO_BASICA_ANT;
    const basicaAnt = Math.min(basicaAntCalc, PLR_CONFIG.TETO_BASICA_ANT);

    const adicAnt = (tipoAdicional === 'teto')
      ? PLR_CONFIG.TETO_ADIC_SEM
      : PLR_CONFIG.ADICIONAL_CALCULADA_SEM;

    const socialAnt = socialSem;
    const brutoAnt = basicaAnt + adicAnt + socialAnt;

    const deducaoDep = (dependentes || 0) * PLR_CONFIG.DEDUCAO_DEP;
    const baseIrrfAnt = Math.max(0, brutoAnt - deducaoDep - (pensao || 0));
    const { imposto: irrfAnt, aliq: aliqAnt } = this.calcIRRF(baseIrrfAnt);
    const liqAnt = brutoAnt - irrfAnt;

    // ----------------------------------------------------
    // 2. Parâmetros Anuais Consolidados (Exercício 2026)
    // ----------------------------------------------------
    const basicaAnualCalc = (0.90 * rbNova) + PLR_CONFIG.FIXO_BASICA_ANUAL;
    const basicaAnual = Math.min(basicaAnualCalc, PLR_CONFIG.TETO_BASICA_ANUAL);

    const adicAnual = (tipoAdicional === 'teto')
      ? PLR_CONFIG.TETO_ADIC_ANUAL
      : (PLR_CONFIG.ADICIONAL_CALCULADA_SEM * 2);

    const socialAnual = socialSem * 2;
    const brutoAnual = basicaAnual + adicAnual + socialAnual;

    // ----------------------------------------------------
    // 3. Saldo Março/2027 - 2ª Parcela
    // ----------------------------------------------------
    const basicaSaldo = Math.max(0, basicaAnual - basicaAnt);
    const adicSaldo = Math.max(0, adicAnual - adicAnt);
    const socialSaldo = socialSem;
    const brutoSaldo = basicaSaldo + adicSaldo + socialSaldo;

    const baseIrrfSaldo = Math.max(0, brutoSaldo - deducaoDep - (pensao || 0));
    const { imposto: irrfSaldo, aliq: aliqSaldo } = this.calcIRRF(baseIrrfSaldo);
    const liqSaldo = brutoSaldo - irrfSaldo;

    // ----------------------------------------------------
    // 4. Totais e IRRF Consolidado
    // ----------------------------------------------------
    const irrfTotal = irrfAnt + irrfSaldo;
    const liqTotal = liqAnt + liqSaldo;

    return {
      reajuste: {
        taxa: PLR_CONFIG.REAJUSTE,
        aumento,
        rbNova
      },
      antecipacao: {
        basica: basicaAnt,
        adicional: adicAnt,
        social: socialAnt,
        bruto: brutoAnt,
        irrf: irrfAnt,
        aliq: aliqAnt,
        liquido: liqAnt
      },
      saldo: {
        basica: basicaSaldo,
        adicional: adicSaldo,
        social: socialSaldo,
        bruto: brutoSaldo,
        irrf: irrfSaldo,
        aliq: aliqSaldo,
        liquido: liqSaldo
      },
      total: {
        basica: basicaAnual,
        adicional: adicAnual,
        social: socialAnual,
        bruto: brutoAnual,
        irrf: irrfTotal,
        liquido: liqTotal
      }
    };
  }
};

if (typeof window !== 'undefined') {
  window.PLRCalculator = PLRCalculator;
}
if (typeof module !== 'undefined' && module.exports) {
  module.exports = PLRCalculator;
}
