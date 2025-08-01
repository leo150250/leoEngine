# LeoEngine

Este projeto apresenta o **LeoEngine**, um mini-motor gráfico para jogos 2D em JavaScript. O objetivo é fornecer uma base simples e eficiente para a criação de jogos clássicos, com foco em renderização, lógica e manipulação de recursos gráficos, baseando-se no workflow de programação do GameMakerStudio.

## Sobre o LeoEngine

O arquivo principal, `leoEngine.js`, implementa funcionalidades essenciais para desenvolvimento de jogos:

- **Renderização via Canvas**: Criação e gerenciamento automático do elemento `<canvas>` e do contexto 2D.
- **Sprites e Texturas**: Carregamento e manipulação de imagens para uso como sprites.
- **Instâncias**: Estrutura para objetos do jogo, incluindo lógica, posição e alarmes (eventos temporizados).
- **Eventos de Teclado**: Sistema para detectar e responder a teclas pressionadas.
- **Sistema de Recursos**: Controle do carregamento de imagens e sincronização do início do jogo.
- **Alarme/Eventos**: Execução de funções após determinado tempo, útil para animações e lógica.
- **RenderWindow**: Gerenciamento da janela principal do jogo, framerate e ciclo de atualização/desenho.

## Como Utilizar

1. Coloque o arquivo `leoEngine.js` na pasta do seu projeto.
2. Crie um arquivo js próprio para o seu jogo.
3. Crie um arquivo HTML que faça a chamada ao `leoEngine.js` e posteriormente ao js próprio para o seu jogo.

## Estrutura Recomendada

```
SeuProjeto/
├── leoEngine.js
├── seuJogo.js
├── (imagens e recursos)
└── index.html
```

## Créditos

Desenvolvido por Leandro Gabriel.  
Inspirado em jogos clássicos e exemplos de engines simples em JavaScript.

---
