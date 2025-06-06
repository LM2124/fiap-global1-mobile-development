# 🔌 PowerOutage Tracker

## Integrantes do Projeto

- **RM 550695** - Gabriel Ferla
- **RM 97158** - Lucas Moreno Matheus  
- **RM 99389** - Victor Flávio Demarchi Viana

## Sobre o Projeto

O **PowerOutage Tracker** é um aplicativo mobile desenvolvido em React Native para registrar e visualizar informações sobre episódios de falta de energia causados por eventos naturais. 

Este projeto faz parte da **Global Solution FIAP** e tem como objetivo ajudar comunidades a documentar, analisar e se preparar melhor para interrupções no fornecimento de energia elétrica.

### 📱 Funcionalidades Principais

- **Panorama Geral**: Dashboard com resumo dos eventos registrados
- **Registro de Localização**: Cadastro de regiões afetadas pela falta de energia
- **Controle de Tempo**: Registro detalhado dos períodos de interrupção
- **Registro de Prejuízos**: Documentação dos danos causados pela falta de energia
- **Recomendações Inteligentes**: Orientações preventivas baseadas nas causas dos eventos

### 🛠️ Tecnologias Utilizadas

- **React Native** com TypeScript
- **Expo** para desenvolvimento multiplataforma
- **AsyncStorage** para persistência local de dados
- **React Navigation** para navegação entre telas
- **Ignite CLI** como boilerplate base

## 🚀 Como Executar o Projeto

### Pré-requisitos

- Node.js (versão 16 ou superior)
- npm ou yarn
- Expo CLI instalado globalmente
- Dispositivo móvel com Expo Go ou emulador configurado

### Instalação e Execução

1. **Clone o repositório e instale as dependências:**

```bash
npm install
```

2. **Execute o projeto:**

```bash
npm run start
```

3. **Para executar em dispositivos específicos:**

```bash
npm run build:ios:sim # iOS Simulator
npm run build:ios:dev # iOS Device  
npm run build:android # Android
```

### 📁 Estrutura do Projeto

```
app/
├── screens/           # Telas do aplicativo
│   ├── HomeScreen.tsx                 # Panorama Geral
│   ├── LocationFormScreen.tsx        # Registro de Localização
│   ├── InterruptionTimeFormScreen.tsx # Controle de Tempo
│   ├── DamagesFormScreen.tsx         # Registro de Prejuízos
│   └── RecommendationsScreen.tsx     # Recomendações
├── services/          # Serviços de dados
│   └── eventService.ts               # CRUD com AsyncStorage
├── components/        # Componentes reutilizáveis
├── navigators/        # Configuração de navegação
└── types/            # Definições TypeScript
```

### 🎯 Funcionalidades Implementadas

#### 1. **Dashboard Principal (HomeScreen)**
- Visualização de todos os eventos registrados
- Resumo estatístico dos dados
- Navegação para registro de novos eventos

#### 2. **Registro de Localização (LocationFormScreen)**
- Cadastro completo de regiões afetadas
- Campos para cidade, estado, CEP
- Coordenadas geográficas
- Validação de dados

#### 3. **Controle de Tempo (InterruptionTimeFormScreen)**
- Registro de início e fim da interrupção
- Seletores de data e hora intuitivos
- Cálculo automático da duração total
- Histórico de interrupções

#### 4. **Registro de Prejuízos (DamagesFormScreen)**
- Catalogação de danos por categoria
- Valores monetários com formatação brasileira
- Cálculo automático de totais
- Descrições detalhadas dos prejuízos

#### 5. **Sistema de Recomendações (RecommendationsScreen)**
- Recomendações personalizadas baseadas nas causas
- Categorização por nível de prioridade
- Contatos de emergência
- Dicas de prevenção específicas

### 💾 Persistência de Dados

O aplicativo utiliza **AsyncStorage** para armazenamento local, garantindo que todos os dados permaneçam disponíveis mesmo offline. As funcionalidades incluem:

- ✅ Criação de novos registros
- ✅ Listagem de eventos salvos
- ✅ Edição de registros existentes
- ✅ Exclusão de dados
- ✅ Backup automático local

### 🎨 Design e Interface

O aplicativo foi desenvolvido seguindo princípios de **UX/UI modernas**:

- Interface limpa e intuitiva
- Navegação fluida entre telas
- Feedback visual para ações do usuário
- Responsividade para diferentes tamanhos de tela
- Componentes reutilizáveis e consistentes

### 🔧 Arquitetura Técnica

- **Linguagem**: TypeScript para tipagem segura  
- **Framework**: React Native com Expo
- **Navegação**: React Navigation v6
- **Storage**: AsyncStorage para persistência local
- **Estado**: Hooks do React para gerenciamento de estado
- **Estilização**: StyleSheet nativo do React Native

