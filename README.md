# TWAM Spotify Project

Este é um projeto desenvolvido no âmbito da disciplina de Tecnologias Web e Aplicações Móveis (TWAM). É uma aplicação web construída com React que interage com a API do Spotify e utiliza uma base de dados local simulada (JSON Server) para gerir utilizadores e avaliações de playlists.

## 🚀 Funcionalidades

- **Autenticação Spotify**: Login seguro utilizando a API do Spotify.
- **Gestão de Playlists**: Visualizar, criar e gerir playlists diretamente da conta Spotify.
- **Sistema de Reviews**: Os utilizadores podem deixar avaliações e comentários em playlists.
- **Perfis de Utilizador**: Diferentes tipos de utilizadores (ex: Criador de Playlists).
- **Interface Moderna**: Design responsivo e agradável utilizando Tailwind CSS.

## 🛠️ Tecnologias Utilizadas

- **Frontend**: React, TypeScript, Vite
- **Estilos**: Tailwind CSS, Lucide React, React Icons
- **Routing**: React Router DOM
- **HTTP Client**: Axios
- **Notificações**: React Hot Toast
- **Backend (Mock)**: JSON Server

## ⚙️ Pré-requisitos

Antes de começar, certifica-te de que tens instalado:
- [Node.js](https://nodejs.org/) (versão 16 ou superior)
- npm (geralmente vem com o Node.js)

## 📦 Instalação e Configuração

1. **Clonar o repositório**
   ```bash
   git clone https://github.com/SEU_USERNAME/twam-project.git
   cd twam-project
   ```

2. **Instalar dependências**
   ```bash
   npm install
   ```

3. **Configurar Variáveis de Ambiente**
   - Cria um ficheiro `.env` na raiz do projeto (podes copiar o `.env.example`).
   - Adiciona o teu Client ID do Spotify.
   ```env
   VITE_SPOTIFY_CLIENT_ID=o_teu_client_id_aqui
   ```
   > **Nota**: Precisas de registar uma aplicação no [Spotify for Developers](https://developer.spotify.com/dashboard/) e configurar o Redirect URI para `http://127.0.0.1:5173/callback`.

4. **Configurar a Base de Dados Local**
   - O projeto usa `json-server` para simular uma base de dados.
   - Cria um ficheiro `db.json` na raiz do projeto copiando o exemplo:
   ```bash
   cp db.example.json db.json
   ```
   *(No Windows, podes simplesmente copiar e colar o ficheiro e renomeá-lo)*

## ▶️ Como Executar

Para a aplicação funcionar corretamente, precisas de correr **dois terminais** simultaneamente:

### Terminal 1: Servidor da Base de Dados (JSON Server)
Este comando inicia a API falsa na porta 3001.
```bash
npx json-server --watch db.json --port 3001
```

### Terminal 2: Aplicação Frontend (Vite)
Este comando inicia a aplicação React.
```bash
npm run dev
```

A aplicação estará disponível em: `http://127.0.0.1:5173`

## 📂 Estrutura do Projeto

```
src/
├── assets/         # Imagens e recursos estáticos
├── components/     # Componentes reutilizáveis (Modais, Cards, Headers)
├── hooks/          # Custom hooks (ex: useAuth)
├── mock/           # Dados fictícios para testes
├── pages/          # Páginas da aplicação (Home, Profile, Playlists)
├── services/       # Lógica de comunicação com APIs (Spotify, JSON Server)
└── main.tsx        # Ponto de entrada da aplicação
```

## 📝 Licença

Este projeto é para fins educativos.
