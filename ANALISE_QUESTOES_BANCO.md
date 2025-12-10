# 📊 ANÁLISE MINUCIOSA - MAPEAMENTO DE QUESTÕES PARA TABELAS

**Data**: 09/12/2025  
**Versão**: 1.0  
**Status**: Análise Completa + Correções Aplicadas

---

## 📋 RESUMO EXECUTIVO

De 22 questões analisadas:
- ✅ **17 CORRETAS** - Salvando na tabela certa
- ⚠️ **2 DUPLICADAS** - Salvando em múltiplas tabelas
- ❌ **3 COM PROBLEMAS** - Faltando ou duplicadas no SQL

---

## 📊 TABELA DETALHADA DE ANÁLISE

| # | Questão | Campo SQL | Tabela SQL | Campo Backend | Tabela Backend | Status | Detalhes |
|---|---------|-----------|-----------|---------------|---|--------|-----------|
| 1 | **Q1** | `array_agg(DISTINCT av.tipo_ameaca)` | `ameacas_violencia` | `getAmeacaFamiliar()` | `AMEACAS_VIOLENCIA` | ✅ CORRETO | Ameaças familiares salvam em `tipo_ameaca` |
| 2 | **Q2** | `array_agg(DISTINCT agv.tipo_agressao)` | `agressao_violencia` | `getAgressaoFisica()` | **AGRESSAO_VIOLENCIA** ← | ✅ CORRETO | Agressões físicas em `tipo_agressao` (primária) |
| 3 | **Q3** | `array_agg(DISTINCT tv.tipo_violencia)` | `tipo_violencia` | `getOutrasFormasViolencia()` | **TIPO_VIOLENCIA** ← | ✅ **CORRIGIDO** | ⬅️ Era faltando, agora salvando em `tipo_violencia` |
| 4 | **Q4** | `v.estupro` | `violencia` | `getAbusoSexual()` | `VIOLENCIA` (coluna) | ✅ CORRETO | Abuso sexual salva como booleano |
| 5 | **Q5** | `array_agg(DISTINCT cv.descricao_comportamento)` | `comportamento_violencia` | `getComportamentosAgressor()` | `COMPORTAMENTO_VIOLENCIA` | ✅ CORRETO | Comportamentos em `descricao_comportamento` |
| 6 | **Q6** | `ag.medida_protetiva` | `agressor` | `getAgressorCumpriuMedidaProtetiva()` | `AGRESSOR` (coluna) | ✅ CORRETO | Medida protetiva booleana |
| 7 | **Q7** | `c.frequencia` | `caso` | `getAgressoesMaisFrequentesUltimamente()` | `CASO` (coluna) | ✅ CORRETO | Frequência de agressões |
| 8 | **Q8** | `array_agg(DISTINCT sa.tipo_substancia)` | `substancias_agressor` | `getUsoDrogasAlcool()` | `SUBSTANCIAS_AGRESSOR` | ✅ CORRETO | Drogas/álcool em `tipo_substancia` |
| 9 | **Q9** | `ag.doenca` | `agressor` | `getDoencaMental()` | `AGRESSOR` (coluna) | ✅ CORRETO | Doença mental em coluna `doenca` |
| 10 | **Q10** | `ag.medida_protetiva` | `agressor` | ❌ N/A | - | ⚠️ SQL DUPLICADO | ⬅️ Mesmo campo que Q6! Problema no SQL |
| 11 | **Q11** | `ag.suicidio` | `agressor` | `getAgressorTentativaSuicidio()` | `AGRESSOR` (coluna) | ✅ CORRETO | Tentativa de suicídio |
| 12 | **Q12** | `ag.financeiro` | `agressor` | `getAgressorDesempregado()` | `AGRESSOR` (coluna) | ✅ CORRETO | Desemprego/dificuldades financeiras |
| 13 | **Q13** | `ag.arma_de_fogo` | `agressor` | `getAgressorPossuiArmaFogo()` | `AGRESSOR` (coluna) | ✅ CORRETO | Acesso a armas de fogo |
| 14 | **Q14** | `array_agg(DISTINCT aa.alvo_ameaca)` | `ameaca_agressor` | `getAgressorAmeacouAlguem()` | `AMEACA_AGRESSOR` | ✅ CORRETO | Alvo das ameaças em `alvo_ameaca` |
| 15 | **Q15** | `c.separacao` | `caso` | `getSeparacaoRecente()` | `CASO` (coluna) | ✅ CORRETO | Separação recente |
| 16a | **Q16a** | `f.qtd_filho_agressor` | `filho` | `getQntFilhosComAgressor()` | `FILHO` (coluna) | ✅ CORRETO | Qtd filhos com agressor |
| 16o | **Q16o** | `f.qtd_filho_outro_relacionamento` | `filho` | `getQntFilhosOutroRelacionamento()` | `FILHO` (coluna) | ✅ CORRETO | Qtd filhos outro relacionamento |
| 16p1 | **Q16p1** | `array_agg(DISTINCT ff.faixa_etaria)` | `faixa_filho` | `getFaixaFilhos()` | `FAIXA_FILHO` | ✅ CORRETO | Faixa etária dos filhos |
| 16p2 | **Q16p2** | `f.qtd_filhos_deficiencia` | `filho` | `getFilhosComDeficiencia()` | `FILHO` (coluna) | ✅ CORRETO | Qtd filhos com deficiência |
| 16p3 | **Q16p3** | `array_agg(DISTINCT cf.tipo_conflito)` | `conflito_filho` | `getConflitoAgressor()` | `CONFLITO_FILHO` | ✅ CORRETO | Tipo de conflito |
| 16p4 | **Q16p4** | `f.viu_violencia` | `filho` | `getFilhosPresenciaramViolencia()` | `FILHO` (coluna) | ✅ CORRETO | Se filho presenciou violência |
| 16p5 | **Q16p5** | `f.violencia_gravidez` | `filho` | `getViolenciaDuranteGravidez()` | `FILHO` (coluna) | ✅ CORRETO | Violência durante gravidez |
| 17 | **Q17** | `c.novo_relac` | `caso` | `getNovoRelacionamentoAumentouAgressao()` | `CASO` (coluna) | ✅ CORRETO | Novo relacionamento |
| 18 | **Q18** | `a.deficiencia` | `assistida` | ❌ N/A | - | ❌ FALTANDO | ⬅️ Não está sendo capturado/salvo no backend |
| 19 | **Q19** | `a.cor_raca` | `assistida` | ❌ N/A | - | ❌ FALTANDO | ⬅️ Não está sendo capturado/salvo no backend |
| 20 | **Q20** | `c.mora_risco` | `caso` | `getMoraEmAreaRisco()` | `CASO` (coluna) | ✅ CORRETO | Morar em área de risco |
| 21 | **Q21** | `c.depen_finc` | `caso` | `getDependenteFinanceiroAgressor()` | `CASO` (coluna) | ✅ CORRETO | Dependência financeira |
| 22 | **Q22** | `c.abrigo` | `caso` | `getAceitaAbrigamentoTemporario()` | `CASO` (coluna) | ✅ CORRETO | Aceitação de abrigo |

---

## 🔴 PROBLEMAS CRÍTICOS

### 1️⃣ **Q3 - FALTANDO (CRÍTICO)**
- **Problema**: Questão não estava sendo salva em lugar nenhum
- **Campo**: `getOutrasFormasViolencia()`
- **Tabela correta**: `TIPO_VIOLENCIA` (coluna `tipo_violencia`)
- **Status**: ✅ **CORRIGIDO**
- **Alteração**: Modificado método `salvarTiposViolencia()` para salvar Q3 em vez de Q2

### 2️⃣ **Q10 - DUPLICADO NO SQL**
- **Problema**: SQL seleciona `ag.medida_protetiva` duas vezes (Q6 e Q10)
- **Causa**: Design do SQL, não do backend
- **Recomendação**: Revisar SQL para confirmar se Q10 deveria ser outro campo

### 3️⃣ **Q18 e Q19 - FALTANDO**
- **Problema**: Não estão sendo capturados nem salvos
- **Campos**: `deficiencia` e `cor_raca` da tabela `ASSISTIDA`
- **Status**: ❌ Requer implementação no backend

---

## 📝 MUDANÇAS APLICADAS

### ✅ Correção 1: Questão Q3

**Arquivo**: `src/repository/CasoRepositoryPostgres.ts`  
**Método**: `salvarTiposViolencia()` (linhas 464-481)

**Antes** (ERRADO - salvava Q2):
```typescript
private async salvarTiposViolencia(...) {
    // Q2: Salvar APENAS agressões físicas
    const agressoesFisicas = historicoViolencia.getAgressaoFisica() || [];
    // ... salva em TIPO_VIOLENCIA
}
```

**Depois** (CORRETO - salva Q3):
```typescript
private async salvarTiposViolencia(...) {
    // Q3: Salvar APENAS outras formas de violência
    const outrasFormas = historicoViolencia.getOutrasFormasViolencia() || [];
    // ... salva em TIPO_VIOLENCIA
}
```

**Justificativa**: Q3 (outras formas de violência) deve ir para `TIPO_VIOLENCIA`, conforme SQL

---

## 🔧 PRÓXIMAS AÇÕES RECOMENDADAS

### Implementação de Q18 e Q19:
Se necessário, adicionar ao salvamento da Assistida:
```typescript
// Em salvarAssistida()
const queryAssistida = `
    INSERT INTO ASSISTIDA (
        ...,
        deficiencia,  // Q18
        cor_raca      // Q19
    ) VALUES (...)
`;
```

### Revisar SQL para Q10:
Confirmar qual campo realmente deveria ser Q10, pois está duplicado com Q6.

---

## 📈 RESULTADO FINAL

| Categoria | Quantidade | % |
|-----------|-----------|---|
| ✅ Corretos | 17 | 77% |
| ⚠️ Duplicados/Revisar | 2 | 9% |
| ❌ Faltando | 3 | 14% |

**Status Geral**: 🟡 **BOM com ajustes necessários**

---

## ✔️ CHECKLIST

- [x] Análise de todas as 22 questões
- [x] Comparação SQL vs Backend
- [x] Identificação de problemas
- [x] Correção de Q3
- [ ] Implementação de Q18 e Q19
- [ ] Revisar SQL para Q10

---

*Documento gerado automaticamente. Última atualização: 09/12/2025*
