# AulaFácil 🎓

**Conectando quem ensina a quem quer aprender.**

O **AulaFácil** é um MVP educacional de plataforma web que aproxima **professores particulares freelancers** de **alunos e responsáveis** interessados em aulas. O projeto foi desenvolvido com apoio de inteligência artificial no [Lovable](https://lovable.dev), como entrega de um desafio da **DIO**, com foco na validação de uma ideia de negócio e na construção de um produto mínimo funcional.

**Aplicação publicada:** https://projetoaulafacil.lovable.app  
**Repositório:** https://github.com/MauroJr85/projetoaulafacil

> **Nota:** O AulaFácil é um protótipo desenvolvido exclusivamente para fins educacionais, como atividade do curso da DIO, utilizando inteligência artificial e ferramentas de desenvolvimento low-code. Não se destina à exploração comercial nem à prestação efetiva de serviços educacionais. As possibilidades de monetização apresentadas constituem apenas hipóteses acadêmicas.

## 1. A dor escolhida e a oportunidade de negócio

**Problema.** Professores autônomos precisam divulgar seus serviços e encontrar alunos. Ao mesmo tempo, estudantes e responsáveis podem ter dificuldade para localizar professores particulares compatíveis com suas necessidades. A busca e o primeiro contato frequentemente ocorrem de maneira dispersa, em indicações, redes sociais e mensagens.

**Solução.** O AulaFácil oferece um local para professores solicitarem a divulgação de seus serviços e para interessados consultarem os perfis disponíveis e enviarem pedidos de aula.

**Públicos atendidos:**
- **Professores freelancers:** profissionais que oferecem aulas particulares e desejam ampliar sua visibilidade.
- **Alunos e responsáveis:** pessoas que procuram reforço escolar e aulas particulares.

**Por que pode se tornar um negócio?** O serviço pode reduzir o atrito na descoberta de professores e na captação de interessados. Uma eventual monetização poderá ser estudada depois da validação da procura e da adesão dos professores, por exemplo com **planos premium** ou **destaque de perfis**. Esses mecanismos **não fazem parte do MVP**.

## 2. Tamanho de mercado: TAM, SAM e SOM

A estimativa inicial utiliza dados de educação como **referência do universo potencial**, não como medida da demanda efetiva por aulas particulares.

| Indicador | Referência ou hipótese | Interpretação |
|---|---|---|
| **TAM** — mercado total potencial | **Aproximadamente 33,1 milhões de matrículas** no ensino fundamental e médio no Brasil em 2025 | Universo educacional amplo, **não** número de potenciais clientes comprovados. |
| **SAM** — mercado inicialmente atendível | **Município do Rio de Janeiro (RJ)**, escolhido como recorte geográfico inicial | A quantidade de interessados em aulas particulares nesse recorte **ainda não foi estimada com dados específicos**. |
| **SOM** — mercado inicialmente alcançável | **Meta experimental:** 10 professores cadastrados e 30 solicitações de aulas em 90 dias | Meta de validação, **não** resultado já alcançado nem previsão de vendas. |

O TAM é baseado nos totais arredondados de **25,8 milhões de matrículas no ensino fundamental** e **7,3 milhões no ensino médio**, divulgados pelo Inep para 2025. Matrículas não equivalem necessariamente a pessoas únicas, clientes, procura por reforço escolar ou disposição de pagamento.

**Fontes de referência:**
- [Inep — Perfil dos estudantes da educação básica no Censo Escolar 2025](https://www.gov.br/inep/pt-br/centrais-de-conteudo/noticias/censo-escolar/conheca-o-perfil-dos-46-milhoes-de-estudantes-da-educacao-basica-no-dia-do-estudante)
- [Inep — Censo Escolar da Educação Básica 2025, notas estatísticas](https://download.inep.gov.br/publicacoes/institucionais/estatisticas_e_indicadores/notas_estatisticas_censo_escolar_da_educacao_basica_2025.pdf)
- [IBGE — Município do Rio de Janeiro](https://www.ibge.gov.br/cidades-e-estados/rj/rio-de-janeiro)

## 3. Business Model Canvas

| Bloco | Definição inicial |
|---|---|
| **Segmentos de clientes** | Professores particulares freelancers; alunos e responsáveis. |
| **Proposta de valor** | Facilitar a divulgação de professores e a solicitação de aulas particulares. |
| **Canais** | Aplicação web, redes sociais e WhatsApp. |
| **Relacionamento com clientes** | Descoberta de perfis pela plataforma e contato humano para combinar a aula. |
| **Fontes de receita** | Futuramente, planos premium para professores ou destaque de perfis; sem cobrança no MVP. |
| **Recursos principais** | Plataforma web, infraestrutura de dados e base de professores participantes. |
| **Atividades principais** | Receber e aprovar cadastros, apresentar perfis e acompanhar solicitações. |
| **Parcerias principais** | Professores autônomos e, futuramente, parceiros da área educacional. |
| **Estrutura de custos** | Hospedagem, manutenção da aplicação, divulgação e atendimento. |

## 4. Tese testada pelo MVP

**Hipótese central:** professores freelancers têm interesse em divulgar seus serviços numa plataforma digital e alunos/responsáveis utilizariam essa plataforma para encontrar um professor e solicitar uma aula.

A primeira versão foi planejada com apenas quatro fluxos:

1. **Cadastro de professores:** um professor solicita inclusão do perfil, sujeito a aprovação.
2. **Catálogo público:** interessados encontram os professores aprovados e podem filtrar por disciplina.
3. **Solicitação de aula:** o interessado escolhe um professor e envia um pedido de contato.
4. **Painel administrativo:** o responsável aprova/rejeita cadastros e acompanha o status das solicitações.

### O que ficou manual de propósito

- Conferência das informações dos professores e decisão de aprovação.
- Intermediação do contato inicial, quando necessária.
- Negociação de preço e condições das aulas.
- Confirmação de disponibilidade e agendamento.
- Realização da aula e recebimento do pagamento diretamente pelo professor.

**Fora do escopo:** pagamentos integrados, chat interno, avaliações, contas individuais de professores, notificações automáticas e agendamento automático. A opção por manter essas etapas fora do software reduz o custo e a complexidade antes de confirmar a hipótese de mercado.

## 5. Construção com IA — histórico real dos prompts

A ideia, o escopo do MVP e as instruções foram estruturados com apoio do ChatGPT. Os três textos abaixo reproduzem **integralmente os prompts enviados ao Lovable**, na ordem informada. O histórico evidencia a implementação inicial, um ajuste identificado durante os testes e uma dúvida operacional sobre o acesso administrativo.

### Prompt 1 — Implementação inicial

<details>
<summary>Ver prompt inicial completo</summary>

```text
Crie o AulaFácil, um MVP educacional de marketplace que conecta professores particulares freelancers a alunos e responsáveis.

Utilize Lovable Cloud como backend, com banco de dados e autenticação. Priorize uma implementação simples, funcional e responsiva.

1. Página inicial
Crie uma landing page moderna, nas cores azul, branco e verde, com:

Apresentação da plataforma e seus benefícios;
Botões "Encontrar professor" e "Sou professor";
Seção explicando como funciona;
Aviso de projeto demonstrativo e educacional.
2. Cadastro de professores
Formulário contendo nome, disciplina (Matemática, Português ou Inglês), modalidade (online/presencial), breve apresentação e WhatsApp.

Salvar os cadastros no banco com status "Pendente", aguardando aprovação administrativa.

3. Catálogo de professores
Exibir somente professores aprovados, com nome, disciplina, modalidade e apresentação.

Permitir filtrar por disciplina.

Cada perfil terá o botão "Solicitar aula", abrindo um formulário com nome do interessado/responsável, WhatsApp e mensagem opcional.

Salvar a solicitação vinculada ao professor escolhido.

4. Painel administrativo
Criar área privada /admin, com autenticação, permitindo:

Visualizar, aprovar e rejeitar professores;
Consultar solicitações de aulas;
Alterar status das solicitações: Novo, Contatado e Concluído.
5. Segurança e funcionamento
Utilizar Lovable Cloud e configurar RLS.
Permitir envio público de formulários, mas restringir consulta dos dados pessoais ao administrador.
Separar dados públicos dos contatos privados dos professores.
Proteger o painel e impedir criação pública de administradores.
Prever configuração manual e segura do primeiro administrador.
Validar campos e incluir consentimento para uso dos dados.
Não coletar dados pessoais de menores de idade.
Implementar persistência real, não apenas dados simulados.
6. Limitações
Não implementar pagamentos, chat, avaliações, notificações, contas individuais de professores ou integrações externas.

A negociação, o agendamento e o pagamento das aulas serão manuais, fora da plataforma.

Prioridade absoluta: entregar o fluxo completo: cadastro de professor → aprovação → catálogo público → solicitação de aula → acompanhamento administrativo.

Não adicione funcionalidades além das descritas nem gere imagens com IA.
```

</details>

### Prompt 2 — Ajuste de navegação e dados para testes

**Motivação registrada:** não havia botão para acessar o painel administrativo. Também foi solicitado criar pelo menos três professores de cada disciplina, totalizando **no mínimo nove perfis de teste**.

```text
não há um botão para acessar o admin do sistema. Crie ao menos 3 professores de cada disciplina para testes.
```

Esse pedido consta do histórico; os perfis utilizados devem ser identificados como dados de demonstração e não como profissionais reais. A execução exata da alteração deve ser conferida na aplicação.

### Prompt 3 — Esclarecimento do acesso administrativo

**Motivação registrada:** identificar como acessar a conta administrativa. Este terceiro texto é uma **pergunta de suporte**, não uma solicitação de implementação ou uma prova de que o acesso foi corrigido.

```text
quem é o admin desse sistema? como acesso a conta admin?
```

**Resultado informado:** após esses passos, o responsável relatou ter publicado o aplicativo e aprovado os testes funcionais do fluxo principal. As respostas do Lovable aos prompts e os detalhes de provisionamento do administrador não foram fornecidos para esta documentação; por isso, não são presumidos. Nenhuma credencial administrativa deve ser publicada no README.

## 6. Testes e resultado

**Status informado pelo responsável pelo projeto:** aplicativo publicado e fluxo funcional testado com aprovação.

| Fluxo | Resultado informado |
|---|---|
| Solicitação de cadastro de professor | Aprovado |
| Aprovação administrativa | Aprovado |
| Exibição no catálogo público | Aprovado |
| Envio de solicitação de aula | Aprovado |
| Acompanhamento no painel | Aprovado |

Esses resultados registram testes funcionais manuais. **Não representam, por si só, auditoria independente de segurança ou validação da demanda com clientes reais.**

### Evidências visuais

<img width="1366" height="1500" alt="01" src="https://github.com/user-attachments/assets/7f0d4f5f-ddcd-42d5-8715-f9b7847d011d" />
<img width="1366" height="950" alt="02" src="https://github.com/user-attachments/assets/aa065f88-995c-45c8-a304-8444e46c4a2f" />
<img width="1366" height="1310" alt="03" src="https://github.com/user-attachments/assets/2f253d8d-4a01-4e50-8593-6818d63ff72e" />
<img width="1366" height="633" alt="04" src="https://github.com/user-attachments/assets/43767532-a058-4f4f-874c-66a458f48356" />
<img width="1366" height="2344" alt="05" src="https://github.com/user-attachments/assets/4c2948fc-d9af-4e3e-9413-a140ecf5fe30" />

## 7. Tecnologias e execução local

- **Ferramenta de desenvolvimento:** Lovable.
- **Backend e persistência previstos no escopo:** Lovable Cloud.
- **Código-fonte:** disponível neste repositório, sincronizado com o projeto Lovable.

Para executar o projeto localmente, é necessário ter o Bun instalado. Na pasta raiz do repositório, execute:

```bash
bun install --frozen-lockfile
bun run dev
```

O comando de desenvolvimento depende das configurações e scripts presentes no projeto efetivamente versionado.

---

Desenvolvido como projeto educacional para o desafio da **DIO**, com apoio de **ChatGPT** no planejamento e **Lovable** na implementação.
