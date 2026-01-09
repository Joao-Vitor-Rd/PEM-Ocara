# Sistema de Gestão de Atendimentos — Procuradoria da Mulher de Ocara (PEM Ocara)

Sistema desktop para **digitalizar, centralizar e proteger** o fluxo de atendimentos da Procuradoria da Mulher de Ocara, com foco em **acolhimento humanizado**, **redução da revitimização** e **segurança de informações sensíveis**.

---

## Sumário

- [Visão Geral](#visão-geral)
- [Problema](#problema)
- [Objetivos de Negócio](#objetivos-de-negócio)
- [Público-alvo](#público-alvo)
- [Solução Proposta](#solução-proposta)
- [Principais Funcionalidades (Macro Requisitos)](#principais-funcionalidades-macro-requisitos)
- [Segurança e Níveis de Acesso](#segurança-e-níveis-de-acesso)
- [Relatórios e Exportação](#relatórios-e-exportação)
- [Considerações Técnicas](#considerações-técnicas)
- [Fora de Escopo](#fora-de-escopo)
- [Como Executar o Projeto (Dev)](#como-executar-o-projeto-dev)
- [Status do Projeto](#status-do-projeto)
- [Licença](#licença)

---

## Visão Geral

O **Sistema de Gestão de Atendimentos da Procuradoria da Mulher** foi idealizado para modernizar o atendimento prestado às vítimas de violência, substituindo processos manuais (papel e pastas físicas) por uma plataforma que:

- organiza atendimentos e acompanhamentos em um só lugar;
- protege o sigilo por meio de controle de acesso;
- facilita geração de relatórios e documentos;
- melhora a eficiência e o acolhimento (evitando revitimização).

---

## Problema

Atualmente, o atendimento e a gestão de denúncias ocorrem de forma **inteiramente manual**, o que gera gargalos como:

- **lentidão e retrabalho** no registro;
- risco de **revitimização**, pois a vítima pode precisar repetir o relato;
- **dificuldade de controle de acesso** a informações altamente sensíveis;
- **complexidade na geração de relatórios** e dados estatísticos.

---

## Objetivos de Negócio

- **Aumentar a eficiência operacional**  
  Automatizar registros, acompanhamentos e documentos, reduzindo tempo de tarefas manuais.

- **Melhorar a qualidade do acolhimento**  
  Centralizar histórico para reduzir repetição de relatos (revitimização) e promover um atendimento mais humano.

- **Fortalecer a segurança da informação**  
  Garantir sigilo e integridade com **níveis de permissão** e regras claras de acesso.

- **Apoiar decisões estratégicas**  
  Consolidar dados para relatórios e estatísticas, permitindo análises e planejamento de ações preventivas.

---

## Público-alvo

- **Usuários Primários (Equipe Técnica)**
  - Assistente Social
  - Assessora Jurídica
  - Psicóloga  
  Uso diário: registrar atendimentos, acompanhar casos e produzir relatórios/documentos.

- **Usuários Secundários**
  - Coordenador(a)
  - Procuradora  
  Uso gerencial: estatísticas, relatórios consolidados e prestação de contas.

- **Beneficiários Indiretos**
  - Vítimas (assistidas)
  - Rede de apoio (CRAS, CAPS, etc.)  
  Benefícios: atendimento mais ágil, seguro e bem estruturado.

---

## Solução Proposta

Desenvolvimento de um **sistema desktop centralizado**, operando **exclusivamente na rede interna** da Procuradoria da Mulher de Ocara, para digitalizar:

- cadastro e triagem inicial;
- registro e histórico de acompanhamentos;
- anexos e evidências;
- emissão de documentos e relatórios;
- estatísticas gerenciais.

---

## Principais Funcionalidades (Macro Requisitos)

### 1) Gestão de Atendimentos e Casos
- **Digitalização da Ficha de Atendimento** (campos obrigatórios)
- **Acompanhamento contínuo** (múltiplos registros ao longo do tempo)
- **Busca de casos** (nome, CPF, data etc.)
- **Número de protocolo único** (reforço de sigilo)
- **Anexos** (imagens, áudios, PDFs)
- **Documentos de encaminhamento** gerados automaticamente

### 2) Gestão de Usuários e Segurança
- Controle de acesso por **perfis e permissões** (detalhado abaixo)

### 3) Relatórios e Análise
- Relatórios estatísticos por:
  - tipo de violência
  - status de encaminhamentos
  - período
  - região/distrito

---

## Segurança e Níveis de Acesso

O sistema aplica controle baseado em perfis:

- **Perfil Técnico-Social**
  - acesso aos relatos e relatórios sociais

- **Perfil Técnico-Jurídico**
  - acesso aos dados e relatórios jurídicos

- **Perfil de Coordenação**
  - acesso a dados quantitativos/estatísticos
  - sem acesso ao conteúdo sensível dos relatos

> O objetivo é garantir o **mínimo privilégio necessário**, protegendo dados altamente sensíveis.

---

## Relatórios e Exportação

- **Exportação para PDF**
  - atendimentos
  - relatórios sociais
  - ofícios/documentos de encaminhamento

---

## Considerações Técnicas

- **Formato:** Aplicação Desktop
- **Operação:** Somente na **rede local interna**
- **Banco de dados:** Local (na rede interna), reforçando sigilo e reduzindo exposição externa
- **Infraestrutura:** Compatível com hardware padrão de escritório, priorizando baixo custo

---

## Fora de Escopo

- **Acesso externo e integrações diretas com rede de apoio** (CRAS, CAPS etc.)
- **APIs públicas** ou módulos de integração com sistemas externos **não** estão previstos neste ciclo

---

## Como Executar o Projeto (Dev)

> Este repositório possui `package.json`. Abaixo está um guia padrão (pode ser ajustado conforme o stack real do projeto).

### Pré-requisitos
- Node.js (LTS recomendado)
- npm (ou yarn/pnpm)

### Instalação
```bash
npm install
```

### Executar em modo desenvolvimento
```bash
npm run dev
```

### Build
```bash
npm run build
```

> Se você me disser qual framework desktop está sendo usado (Electron? Tauri? outro?) e quais scripts existem no `package.json`, eu ajusto esta seção para ficar 100% fiel ao projeto.

---

## Status do Projeto

Em desenvolvimento. O Documento de Visão define os fundamentos e requisitos macro para evolução do sistema.

---

## Licença

Consulte o arquivo [LICENCE](./LICENCE).
