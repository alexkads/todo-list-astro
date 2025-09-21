# 📝 Sistema de Lista de Tarefas

Um sistema completo de gerenciamento de tarefas desenvolvido com **AstroJS**, **Prisma ORM**, **SQLite** e sistema completo de autenticação e autorização.

## 🚀 Características

- ✅ **Autenticação completa** com JWT
- 👥 **Sistema de usuários** com perfis de acesso (USER/ADMIN)
- 📋 **CRUD completo de tarefas** com prioridades
- 🎨 **Interface moderna** com Tailwind CSS
- 🔒 **Middleware de proteção** de rotas
- 📱 **Design responsivo**
- 🗄️ **Banco SQLite** com Prisma ORM

## 🛠️ Tecnologias Utilizadas

- **AstroJS** - Framework web moderno
- **TypeScript** - Tipagem estática
- **Prisma ORM** - Object-Relational Mapping
- **SQLite** - Banco de dados
- **Tailwind CSS** - Framework CSS
- **JWT** - Autenticação via tokens
- **bcrypt** - Criptografia de senhas

## 📦 Instalação

1. **Clone o repositório** (ou use o diretório atual)
   ```bash
   cd todo-list-filippi
   ```

2. **Instale as dependências**
   ```bash
   npm install
   ```

3. **Configure o banco de dados**
   ```bash
   npx prisma generate
   npx prisma migrate dev --name init
   ```

4. **Execute o seed para criar usuários de teste**
   ```bash
   npm run db:seed
   ```

5. **Inicie o servidor de desenvolvimento**
   ```bash
   npm run dev
   ```

6. **Acesse o sistema**
   - Navegue para: `http://localhost:4321`

## 👤 Usuários de Teste

Após executar o seed, você terá os seguintes usuários disponíveis:

### Administrador
- **Email:** `admin@todolist.com`
- **Senha:** `admin123`
- **Perfil:** ADMIN

### Usuário Comum
- **Email:** `usuario@teste.com`
- **Senha:** `teste123`
- **Perfil:** USER
- **Inclui:** 3 tarefas de exemplo

## 📖 Como Usar

### 1. **Acesso ao Sistema**
- Acesse a página inicial
- Faça login com um dos usuários de teste ou crie uma nova conta

### 2. **Gerenciamento de Tarefas**
- **Criar:** Preencha o formulário na parte superior do dashboard
- **Visualizar:** Veja todas suas tarefas organizadas por status e prioridade
- **Editar:** Clique em "Editar" em qualquer tarefa
- **Marcar como concluída:** Use o checkbox ao lado da tarefa
- **Excluir:** Clique em "Excluir" (com confirmação)

### 3. **Funcionalidades das Tarefas**
- **Título** (obrigatório)
- **Descrição** (opcional)
- **Prioridade:** Baixa, Média, Alta, Urgente
- **Data de vencimento** (opcional)
- **Status:** Pendente/Concluída

## 🔧 Scripts Disponíveis

```bash
# Desenvolvimento
npm run dev              # Inicia servidor de desenvolvimento

# Build
npm run build           # Gera build de produção
npm run preview         # Visualiza build de produção

# Banco de dados
npm run db:seed         # Executa seed do banco
npm run db:studio       # Abre Prisma Studio (interface visual)

# Prisma
npx prisma generate     # Gera cliente Prisma
npx prisma migrate dev  # Executa migrations
npx prisma studio       # Interface visual do banco
```

## 📁 Estrutura do Projeto

```
src/
├── layouts/            # Layouts das páginas
├── pages/              # Páginas da aplicação
│   ├── api/           # Endpoints da API
│   │   ├── auth/      # Rotas de autenticação
│   │   └── todos/     # Rotas de tarefas
│   ├── dashboard.astro # Dashboard principal
│   ├── login.astro    # Página de login
│   ├── register.astro # Página de cadastro
│   └── index.astro    # Página inicial
├── lib/               # Utilitários e configurações
│   ├── auth.ts        # Funções de autenticação
│   ├── prisma.ts      # Cliente Prisma
│   └── session.ts     # Gerenciamento de sessão
├── scripts/           # Scripts utilitários
│   └── seed.ts        # Seed do banco de dados
├── middleware.ts      # Middleware de autenticação
└── env.d.ts          # Tipos TypeScript

prisma/
├── schema.prisma      # Schema do banco de dados
└── migrations/        # Histórico de migrations
```

## 🔐 Segurança

- **Senhas criptografadas** com bcrypt
- **Autenticação via JWT** com cookies httpOnly
- **Middleware de proteção** de rotas
- **Validação de dados** no frontend e backend
- **Autorização por perfil** de usuário

## 🌟 Funcionalidades Implementadas

### Autenticação
- [x] Registro de usuário
- [x] Login/Logout
- [x] Verificação de sessão
- [x] Proteção de rotas

### Tarefas
- [x] Criar tarefa
- [x] Listar tarefas
- [x] Editar tarefa
- [x] Excluir tarefa
- [x] Marcar como concluída
- [x] Sistema de prioridades
- [x] Data de vencimento

### Interface
- [x] Design responsivo
- [x] Interface intuitiva
- [x] Feedback visual
- [x] Modais de edição
- [x] Validação de formulários

## 🚀 Próximos Passos

Funcionalidades que podem ser implementadas:

- [ ] Filtros avançados de tarefas
- [ ] Busca de tarefas
- [ ] Categorias/tags
- [ ] Anexos em tarefas
- [ ] Notificações
- [ ] Compartilhamento de tarefas
- [ ] Relatórios e estatísticas
- [ ] API REST documentada
- [ ] Testes automatizados

## 📝 Licença

Este projeto foi desenvolvido para fins educacionais e demonstrativos.

---

Desenvolvido com ❤️ usando AstroJS e Prisma