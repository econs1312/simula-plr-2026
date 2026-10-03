# Simulador PLR CAIXA 2026

Simulador da Participação nos Lucros e Resultados (PLR) dos empregados da Caixa Econômica Federal para o **Exercício 2026**, contemplando o cálculo da **1ª Parcela (Antecipação em Outubro/2026)** e da **2ª Parcela (Saldo em Março/2027)**.

---

## 📁 Estrutura do Projeto

O projeto foi organizado de forma modular, separando a camada de apresentação, estilos visuais e lógica de negócio:

```text
simula-plr-2026/
├── css/
│   └── styles.css        # Estilos customizados, variáveis CSS, glassmorphism e regras de impressão
├── js/
│   ├── config.js         # Parâmetros econômicos, reajuste CCT, bases, tetos e tabela progressiva de IRRF
│   ├── calculator.js     # Motor matemático isolado da PLR (Regra Básica, Adicional, PLR Social e IRRF)
│   └── app.js            # Controlador da interface (DOM, máscaras monetárias, eventos e cópia WhatsApp)
├── index.html            # Estrutura HTML semântica com layout responsivo
└── README.md             # Documentação do projeto
```

---

## 📊 Premissas e Parâmetros Utilizados (2026)

- **Reajuste CCT Bancários 2026:** **+4,60%** (INPC 12 meses até agosto/2026 de 4,00% + 0,60% de aumento real).
- **Lucro Líquido 1S2026 CAIXA:** R$ 7,368 bilhões.
- **Efetivo de Empregados:** 84.136 empregados.
- **Regra Básica FENABAN:**
  - Anual: 90% da RB reajustada + R$ 3.695,43 fixos (Teto: R$ 19.824,24).
  - Antecipação (60%): 54% da RB reajustada + R$ 2.217,26 fixos (Teto: R$ 11.894,55).
- **Parcela Adicional FENABAN:**
  - Linear (2,2% do lucro / efetivo): R$ 1.926,60 no 1º semestre.
  - Teto semestral (50% do teto anual): R$ 3.837,04.
- **PLR CAIXA Social:** Parcela exclusiva dos empregados da CAIXA distribuída de forma linear (valor igual para todos, sem distinção de cargo/salário), equivalente a até 4% do lucro líquido semestral e variável conforme o percentual de atingimento das metas corporativas (teto semestral de R$ 3.502,90 para 100% de metas).
- **Tributação (IRRF Exclusivo na Fonte):** Tabela progressiva exclusiva para PLR (Lei nº 10.101/2000 atualizada), com dedução por dependente legal de R$ 189,59/mês.
  - *Cálculo Cumulativo Real no Ano Civil:* A legislação da Receita Federal (Regime de Caixa / Solução COSIT nº 229/2014) determina que todos os pagamentos de PLR ocorridos no mesmo ano civil (a quitação da PLR 2025 paga em março/2026 somada à antecipação da PLR 2026 em outubro/2026) sejam acumulados para cálculo do imposto na folha oficial, com compensação do IR já retido. O simulador inclui essa apuração oficial por padrão, permitindo simular com fidelidade a retenção real de IRRF no contracheque de outubro/2026 (alíquota efetiva de 27,5% acumulada) para evitar surpresas no valor líquido em conta.

---

## 🚀 Como Executar

Por ser uma aplicação web estática sem necessidade de etapa de compilação (*build*):
1. Basta abrir o arquivo `index.html` em qualquer navegador web moderno; ou
2. Servir os arquivos através do **GitHub Pages** ou qualquer servidor estático HTTP.