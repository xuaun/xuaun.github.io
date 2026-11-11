# xuaun.github.io

Portfolio of João Araujo, Digital Accessibility Specialist and Front-End Developer. Live at <https://xuaun.github.io/>.

[Versão em português abaixo.](#português)

## What it is

A single-page portfolio in English (`/`) and Portuguese (`/pt/`), plus a printable résumé (`/cv/` and `/pt/cv/`) generated from the same data.

## How it is built

- **React 19, TypeScript, and Vite.** Every page is prerendered to static HTML, so the content is readable before, or without, JavaScript.
- **React Aria Components** for the interactive controls: the project filter and the theme toggle.
- **Motion** for the animations: the section indicator, the project filter, the theme icon, and the link hover nudges.
- **Tailwind CSS v4** with colour tokens in OKLCH, defined in `src/styles.css`.

## Accessibility decisions

- Text contrast is at least 4.5:1 in both themes.
- One focus style everywhere, 3px and never removed. A skip link is the first focusable element.
- In-page links move keyboard focus to the target section, not only the scroll position.
- Content is visible by default. Scroll reveals and transforms only run when the visitor has not asked for reduced motion.
- No link opens a new tab, and no control is icon-only.
- The language switch is a real link with `lang` and `hreflang`; each page declares its own `lang`.

## Run it locally

```bash
npm install
npm run dev
```

`npm run build` type-checks, builds, and prerenders into `dist/`. Pushing to `main` deploys through `.github/workflows/deploy.yml`.

## Edit the content

All text lives in `src/content/en.ts` and `src/content/pt.ts`. Both files follow the `Content` type in `src/content/types.ts`, so a missing translation fails the build.

---

## Português

Portfólio de João Araujo, Especialista em Acessibilidade Digital e Desenvolvedor Front-End. No ar em <https://xuaun.github.io/pt/>.

### O que é

Um portfólio de página única em inglês (`/`) e português (`/pt/`), com um currículo imprimível (`/cv/` e `/pt/cv/`) gerado a partir dos mesmos dados.

### Como é feito

- **React 19, TypeScript e Vite.** Todas as páginas são pré-renderizadas em HTML estático, então o conteúdo pode ser lido antes do JavaScript, ou sem ele.
- **React Aria Components** nos controles interativos: o filtro de projetos e o alternador de tema.
- **Motion** nas animações: o indicador de seção, o filtro de projetos, o ícone de tema e o movimento dos links ao passar o mouse.
- **Tailwind CSS v4** com tokens de cor em OKLCH, definidos em `src/styles.css`.

### Decisões de acessibilidade

- O contraste de texto é de pelo menos 4,5:1 nos dois temas.
- Um único estilo de foco, de 3px, nunca removido. O link de pular é o primeiro elemento focável.
- Os links internos levam o foco do teclado até a seção de destino, e não só a rolagem.
- O conteúdo é visível por padrão. As revelações ao rolar e os movimentos só acontecem quando a pessoa não pediu movimento reduzido.
- Nenhum link abre em nova aba e nenhum controle é só ícone.
- A troca de idioma é um link de verdade, com `lang` e `hreflang`; cada página declara o próprio `lang`.

### Rodar localmente

```bash
npm install
npm run dev
```

`npm run build` verifica os tipos, gera o build e pré-renderiza em `dist/`. Um push na `main` publica pelo `.github/workflows/deploy.yml`.

### Editar o conteúdo

Todo o texto fica em `src/content/en.ts` e `src/content/pt.ts`. Os dois arquivos seguem o tipo `Content` em `src/content/types.ts`, então uma tradução faltando quebra o build.
