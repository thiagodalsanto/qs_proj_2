# RELATÓRIO DE QUALIDADE DE SOFTWARE PARA APLICAÇÃO REPARAÇÃO DE COMPONENTES ELETRÔNICOS

## Sumário
1. [Contextualização Sobre a Aplicação](#1-contextualização-sobre-a-aplicação)
2. [Extração de Requisitos](#2-extração-de-requisitos)
    - [Requisitos Funcionais](#21-requisitos-funcionais)
    - [Requisitos Não Funcionais](#22-requisitos-não-funcionais)
    - [Proposta de Requisitos Adicionais](#23-proposta-de-requisitos-adicionais)
3. [Correção com o ESLint](#3-correção-com-o-eslint)
4. [Testes Automatizados com (Jest ou Mocha)](#4-testes-automatizados-com-jest-ou-mocha)
5. [Análise da Aplicação com a ISO ...](#5-análise-da-aplicação-com-a-iso-)
6. [Conclusão](#6-conclusão)
7. [Referências](#7-referências)

## 1. Contextualização Sobre a Aplicação

A aplicação em análise é um sistema de gestão desenvolvido para atender às necessidades de um ambiente de reparação técnica, oferecendo ferramentas para gerenciamento de clientes, usuários e trabalhos (jobs). Seu principal objetivo é simplificar e automatizar processos, permitindo que os usuários realizem operações de forma eficiente e organizada. A aplicação é composta por várias funcionalidades interligadas, que vão desde a autenticação de usuários até a comunicação interna em tempo real, passando pela criação, edição e exclusão de registros.

No cerne da aplicação, encontramos uma interface intuitiva e responsiva, que permite aos usuários navegarem entre diferentes páginas, como a página de login, a página inicial (home), a página de clientes e a página de usuários. A página de login é responsável por autenticar os usuários, garantindo que apenas pessoas autorizadas tenham acesso ao sistema. Após o login, os usuários são redirecionados para a página inicial, onde podem visualizar e gerenciar trabalhos, incluindo a criação de novos jobs, a edição de informações existentes e a reabertura de trabalhos concluídos. A página de clientes permite o cadastro e gerenciamento de informações de clientes, como nome, email, morada, código postal e NIF. Já a página de usuários é destinada à administração de contas, permitindo a criação, edição e exclusão de usuários, além da definição de permissões de acesso.

A aplicação utiliza uma variedade de tecnologias modernas para garantir seu funcionamento eficiente. No front-end, são empregados HTML, CSS e JavaScript, com o auxílio de bibliotecas como jQuery e Bootstrap para facilitar a criação de interfaces responsivas e interativas. O uso de DataTables permite a exibição de dados em tabelas dinâmicas, com funcionalidades como paginação, ordenação e busca. No back-end, a aplicação é construída com Node.js e Express, que fornecem uma estrutura robusta para o desenvolvimento de APIs e o gerenciamento de rotas. A comunicação com o banco de dados é realizada através do MySQL, onde são armazenadas todas as informações necessárias para o funcionamento do sistema, como dados de usuários, clientes e trabalhos.

Uma das funcionalidades mais interessantes da aplicação é a integração com WebSocket, que permite a comunicação em tempo real entre os usuários. Essa funcionalidade é especialmente útil para enviar e receber mensagens instantâneas, facilitando a colaboração e a resolução de problemas em um ambiente de trabalho dinâmico. O WebSocket é configurado para funcionar em conjunto com o servidor HTTP, garantindo que as mensagens sejam transmitidas de forma rápida e eficiente.

Apesar de sua estrutura bem planejada, a aplicação apresenta alguns pontos que necessitam de atenção. Por exemplo, a funcionalidade de login automático, que tenta autenticar usuários pré-definidos com base no navegador utilizado, pode não funcionar corretamente em todos os cenários. Além disso, a validação de campos em formulários, como email e senha, pode não estar sendo realizada de forma consistente, o que pode levar a erros ou inconsistências nos dados. A funcionalidade de priorização de trabalhos, que permite aos usuários arrastarem e soltar itens para reordenar prioridades, também pode apresentar problemas de funcionamento. Por fim, a exclusão de registros, como usuários e clientes, pode não estar sendo tratada de forma adequada quando há dependências no banco de dados, como trabalhos associados a um cliente.

Este relatório tem como objetivo fornecer uma visão detalhada da aplicação, destacando seus pontos fortes e identificando áreas que necessitam de melhorias. Através da análise dos requisitos funcionais e não funcionais, bem como da avaliação das tecnologias utilizadas, esperamos contribuir para o aprimoramento do sistema, garantindo que ele continue a atender às necessidades dos usuários de forma eficiente e segura.

## 2. Extração de Requisitos

Este capítulo descreve os requisitos funcionais e não funcionais identificados para a aplicação voltada ao aluguer de carrinhos. Os requisitos foram definidos com base nas necessidades dos usuários e nas características esperadas do sistema, garantindo que a aplicação atenda tanto às funcionalidades específicas quanto aos padrões de qualidade e desempenho esperados. Os requisitos estão divididos em dois grupos: funcionais, que detalham as funcionalidades diretamente observáveis pelos usuários, e não funcionais, que definem os critérios técnicos e de qualidade para o sistema.

A identificação e a organização desses requisitos são etapas cruciais no processo de desenvolvimento de software, permitindo uma abordagem sistemática na construção do sistema e na avaliação de sua adequação às expectativas.

### 2.1. Requisitos Funcionais

Os requisitos funcionais descrevem as capacidades que o sistema deve possuir para cumprir seus objetivos operacionais. Eles definem as funcionalidades principais que serão diretamente utilizadas pelos usuários. No contexto da aplicação de aluguel de carrinhos, foram identificados os seguintes requisitos:

1. Acessar Aplicação: Permitir que os usuários façam login com nome de usuário/email e senha. Após o login bem-sucedido, o usuário seja redirecionado para a página inicial (home.html). O acesso a páginas restritas é bloqueado sem autenticação.
2.	Sair da Aplicação: Permitir que os usuários façam logout, encerrando a sessão e redirecionando para a página de login.
3.	Controlar Acesso: Restringir o acesso à página de usuários (users.html) apenas para administradores. Usuários comuns não podem acessar essa funcionalidade.
4.	Criar Usuários: Permitir que administradores criem usuários, definindo nome, nome de usuário, email, tipo de usuário (administrador ou operador) e senha.
5.	Editar Usuários: Permitir que administradores editem informações de usuários existentes, como nome, email e tipo de usuário.
6.	Excluir Usuários: Permitir que administradores excluam usuários do sistema.
7.	Listar Usuários: Exibir uma tabela com todos os usuários cadastrados, incluindo nome, nome de usuário, email, tipo de acesso e número de trabalhos associados.
8.	Criar Clientes: Permitir que usuários cadastrem novos clientes, definindo nome, email, morada, código postal e NIF.
9.	Editar Clientes: Permitir que usuários editem informações de clientes existentes.
10.	Excluir Clientes: Permitir que usuários excluam clientes do sistema.
11.	Listar Clientes: Exibir uma tabela com todos os clientes cadastrados, incluindo nome, email, NIF e número de trabalhos associados.
12.	Criar Trabalhos: Permitir que usuários criem trabalhos, definindo tipo de equipamento, marca, procedimento de reparação, notas, status e prioridade.
13.	Editar Trabalhos: Permitir que usuários editem informações de trabalhos existentes, incluindo status e prioridade.
14.	Reabrir Trabalhos: Permitir que usuários reabram trabalhos concluídos.
15.	Listar Trabalhos: Exibir uma tabela com todos os trabalhos, incluindo ID, descrição, criado por cliente, status, prioridade e notas.
16.	Priorizar Trabalhos: Permitir que usuários arrastem e soltem trabalhos para reordenar prioridades.
17.	Enviar Mensagens: Permitir que usuários enviem mensagens para outros usuários via WebSocket.
18.	Receber Mensagens: Exibir mensagens recebidas em tempo real.
19.	Observar Histórico Mensagens: Carregar o histórico de mensagens ao selecionar um usuário.
20.	Navegar: Fornece uma barra de navegação com links para as páginas de home, clientes e usuários (dependendo do nível de acesso).
21.	Observar Modais: Usar modais para criação, edição e exclusão de usuários, clientes e trabalhos.
22.	Validar Formulários: Validar campos obrigatórios e formatos de email, senha etc.
23.	Acessar de Forma Automática: O código tenta fazer login automaticamente com usuários pré-definidos (nunesd e renatoreis) dependendo do navegador. Isso pode não funcionar corretamente em todos os cenários.

### 2.2. Requisitos Não Funcionais

Os requisitos não funcionais descrevem as qualidades e restrições técnicas que o sistema deve respeitar. Eles asseguram que a aplicação não apenas funcione como esperado, mas também atenda a critérios de eficiência, usabilidade e compatibilidade. Para a aplicação de aluguer de carrinhos, foram definidos os seguintes requisitos não funcionais:

1.	Tempo de Resposta: A aplicação deve responder a requisições em menos de 2 segundos.
2.	Escalabilidade: A aplicação deve suportar até 100 usuários simultâneos.
3.	Autenticação Segura: As senhas devem ser armazenadas de forma segura (hash) no banco de dados.
4.	Proteção contra ataques: Implementar proteção contra SQL injection, XSS e CSRF.
5.	Controle de Sessão: As sessões devem ser gerenciadas de forma segura, com tempo de expiração e regeneração de IDs de sessão.
6.	Interface Responsiva: A interface deve ser responsiva e funcionar bem em dispositivos móveis e desktops.
7.	Feedback ao Usuário: Fornecer mensagens de erro claras e feedback visual para ações do usuário.
8.	Código Modular: O código deve ser modular, com separação clara entre front-end e back-end.
9.	Documentação: Manter documentação atualizada para facilitar a manutenção e o desenvolvimento futuro.
10.	Compatibilidade com Navegadores: A aplicação deve funcionar corretamente nos principais navegadores (Chrome, Firefox, Edge, Safari).

Com base nesses requisitos, busca-se assegurar que a aplicação ofereça uma experiência de uso satisfatória, atenda às necessidades funcionais específicas e esteja em conformidade com padrões de qualidade técnica. Essa estrutura de requisitos funcionais e não funcionais contribui para o desenvolvimento de uma solução robusta e eficiente.	

### 2.3. Proposta de Requisitos Adicionais

Aqui é apresentado uma proposta de requisitos adicionais para a aplicação de aluguel de carrinhos, identificados como melhorias ou novas funcionalidades que poderiam ampliar a eficiência, a segurança e a experiência do usuário. Os requisitos foram divididos em funcionais, que detalham novas capacidades diretamente visíveis e utilizáveis pelo usuário, e não funcionais, que estabelecem melhorias técnicas relacionadas à qualidade do sistema.

A introdução de novos requisitos busca não apenas expandir as funcionalidades da aplicação, mas também assegurar que a solução tecnológica continue a atender às demandas crescentes de segurança, usabilidade e praticidade. A seguir, os requisitos propostos são detalhados.

Os **requisitos não funcionais** adicionais visam melhorar a segurança e a usabilidade do aplicativo, garantindo maior confiabilidade e uma experiência mais agradável para os usuários:

1.	Recuperação de Senha: Permitir que os usuários recuperem suas senhas caso as esqueçam, enviando um link de redefinição por email.
2.	Perfil do Usuário: Adicionar uma página de perfil onde os usuários possam visualizar e editar suas informações pessoais, como nome, email e senha.
3.	Exportação de Dados: Permitir que os usuários exportem dados (clientes, trabalhos, usuários) em formatos como CSV ou PDF.
4.	Filtros Avançados na Listagem: Adicionar filtros avançados nas tabelas de clientes, usuários e trabalhos, permitindo buscar por status, prioridade, data etc.
5.	Notificações: Implementar um sistema de notificações para alertar os usuários sobre novas mensagens, atualizações de trabalhos ou prazos.
6.	Relatórios: Gerar relatórios detalhados sobre trabalhos concluídos, pendentes, tempo médio de reparação etc.
7.	Integração com E-mail: Enviar notificações por email para clientes quando um trabalho é criado, atualizado ou concluído.
8.	Histórico de Alterações: Manter um histórico de alterações para trabalhos, clientes e usuários, mostrando quem fez a alteração e quando.
9.	Autenticação de Dois Fatores (2FA): Adicionar uma camada extra de segurança com autenticação de dois fatores para o login.
10.	Suporte a Múltiplos Idiomas: Implementar suporte a múltiplos idiomas para tornar a aplicação acessível a usuários internacionais.

Os **requisitos funcionais** propostos visam introduzir novas capacidades ao sistema, aumentando sua utilidade e abrangência para os usuários:

1.	Backup Automático: Implementar um sistema de backup automático do banco de dados para evitar perda de dados.
2.	Monitoramento de Desempenho: Adicionar ferramentas de monitoramento para acompanhar o desempenho da aplicação e identificar gargalos.
3.	Testes Automatizados: Implementar testes automatizados (unitários, de integração e de interface) para garantir a qualidade do código.
4.	Logs Detalhados: Manter logs detalhados de todas as ações realizadas na aplicação para facilitar a depuração e auditoria.
5.	Segurança Avançada: Implementar medidas adicionais de segurança, como criptografia de dados em trânsito e em repouso.
6.	Documentação da API: Criar documentação detalhada da API para facilitar a integração com outros sistemas.
7.	Limitação de Tentativas de Login: Bloquear temporariamente contas após um número máximo de tentativas de login falhas para prevenir ataques de força bruta.
8.	Política de Privacidade e Termos de Uso: Adicionar páginas de política de privacidade e termos de uso para garantir conformidade com regulamentações.
9.	Suporte a Alta Disponibilidade: Garantir que a aplicação esteja disponível 24/7, com redundância de servidores e balanceamento de carga.
10.	Otimização para SEO: Melhorar a visibilidade da aplicação em mecanismos de busca, caso seja uma aplicação pública.

Os requisitos adicionais propostos visam aumentar a eficiência operacional da aplicação e proporcionar maior satisfação ao usuário. As melhorias sugeridas em segurança e usabilidade são especialmente relevantes em um contexto em que a proteção de dados e a experiência do usuário são aspectos centrais para a aceitação de uma solução tecnológica. Já as novas funcionalidades permitem ampliar a abrangência do serviço, oferecendo capacidades que alinham a aplicação às expectativas modernas de praticidade e inovação. A implementação desses requisitos representaria um avanço significativo no ciclo evolutivo do sistema.

## 3. Correção com o ESLint

## 4. Testes Automatizados com (Jest ou Mocha)

## 5. Análise da Aplicação com a ISO ...

## 6. Conclusão

## 7. Referências