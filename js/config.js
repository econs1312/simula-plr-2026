/**
 * Parâmetros Normativos e Econômicos - Simulador PLR CAIXA 2026
 * Fontes: Balanço CAIXA 1S2026 e Sentença Normativa CCT / TST
 */
const PLR_CONFIG = {
  // Reajuste CCT Bancários 2026 (INPC acumulado até Agosto/2026 + 0,60% de aumento real)
  REAJUSTE: 0.046, // 4,60%

  // Valores-base da CCT anterior (para aplicação do reajuste de 4,60%)
  FIXO_BASICA_BASE: 3532.92,
  TETO_BASICA_BASE: 18952.43,
  TETO_ADIC_BASE: 7336.60,

  // Indicadores do Balanço CAIXA 1S2026
  LUCRO_1S: 7368000000,          // R$ 7,368 bilhões
  EFETIVO_TOTAL: 84136,           // Empregados ativos
  ADICIONAL_CALCULADA_SEM: 1926.60, // 2,2% do lucro 1S linear por empregado
  DEDUCAO_DEP: 189.59,            // Dedução mensal por dependente legal para IRRF PLR

  // Faixas da Tabela Progressiva Exclusiva de IRRF para PLR
  TABELA_IRRF: [
    { limite: 7640.80, aliquota: 0.00, deducao: 0.00 },
    { limite: 9922.28, aliquota: 0.075, deducao: 573.06 },
    { limite: 13167.00, aliquota: 0.15, deducao: 1317.23 },
    { limite: 16380.38, aliquota: 0.225, deducao: 2304.76 },
    { limite: Infinity, aliquota: 0.275, deducao: 3123.78 }
  ]
};

// Valores derivados reajustados a 4,6%
PLR_CONFIG.FIXO_BASICA_ANUAL = PLR_CONFIG.FIXO_BASICA_BASE * (1 + PLR_CONFIG.REAJUSTE); // R$ 3.695,43
PLR_CONFIG.FIXO_BASICA_ANT   = 0.60 * PLR_CONFIG.FIXO_BASICA_ANUAL;                     // R$ 2.217,26
PLR_CONFIG.TETO_BASICA_ANUAL = PLR_CONFIG.TETO_BASICA_BASE * (1 + PLR_CONFIG.REAJUSTE); // R$ 19.824,24
PLR_CONFIG.TETO_BASICA_ANT   = 0.60 * PLR_CONFIG.TETO_BASICA_ANUAL;                     // R$ 11.894,55
PLR_CONFIG.TETO_ADIC_ANUAL   = PLR_CONFIG.TETO_ADIC_BASE * (1 + PLR_CONFIG.REAJUSTE);   // R$ 7.674,08
PLR_CONFIG.TETO_ADIC_SEM     = 0.50 * PLR_CONFIG.TETO_ADIC_ANUAL;                       // R$ 3.837,04

if (typeof window !== 'undefined') {
  window.PLR_CONFIG = PLR_CONFIG;
}
if (typeof module !== 'undefined' && module.exports) {
  module.exports = PLR_CONFIG;
}

