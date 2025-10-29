# R75K0 Link Hub

Site estático estilo neon cyberpunk, inspirado em terminais hacker e sintetizadores vermelhos. A página abre com um splash R75K0 piscando e então revela um painel translúcido com a lista de links carregados dinamicamente.

## 🎨 Destaques
- Splash screen com efeito neon e flicker.
- Fundo em tela cheia com wallpaper cyberpunk + overlay escuro para contraste.
- Botões arredondados com brilho, hover suave, ripple e microinteração do gato.
- Links alimentados por JSON, permitindo edição rápida sem mexer no HTML.
- Modo reduzido de movimento respeitando `prefers-reduced-motion`.

## 📁 Estrutura
```
/
├── index.html
├── css/
│   └── styles.css
├── js/
│   └── main.js
├── data/
│   └── links.json
└── .github/workflows/
    └── deploy.yml
```

> **Nota:** As imagens são carregadas diretamente das URLs `https://i.imgur.com/25ssfgl.png` (gato) e `https://i.imgur.com/QsYDbWE.jpeg` (wallpaper). Caso queira hospedar versões próprias, atualize os caminhos diretamente no HTML ou CSS.

## 🔗 Editando os links
1. Abra `data/links.json`.
2. Adicione, remova ou ajuste objetos seguindo o formato:
   ```json
   {
     "label": "Texto do botão",
     "url": "https://destino.com"
   }
   ```
3. Para botões que copiam texto em vez de abrir links, use a propriedade `"copy"`:
   ```json
   {
     "label": "Discord",
     "copy": ".riskko"
   }
   ```
4. Salve o arquivo e recarregue a página — o JavaScript monta os botões automaticamente.

## 🖼️ Alterando imagens
- **Gato:** edite a tag `<img id="cyber-cat">` em `index.html` e troque o atributo `src` pela URL do novo arquivo.
- **Fundo:** ajuste a propriedade `background-image` do seletor `body::before` em `css/styles.css` para apontar para outro wallpaper (idealmente 1920×1080 ou maior).
- Para hospedar imagens no próprio repositório, basta adicioná-las a uma pasta (por exemplo `assets/`) e atualizar os caminhos nos arquivos acima.

## 🚀 Publicação no GitHub Pages
1. Garanta que o repositório esteja com o branch `main` publicado.
2. Faça commit das alterações:
   ```bash
   git add .
   git commit -m "feat: neon cyberpunk link hub"
   git push origin main
   ```
3. O workflow `Deploy static site` (arquivo `.github/workflows/deploy.yml`) enviará automaticamente o conteúdo para o GitHub Pages.
4. Acesse **Settings → Pages** para conferir o status. A URL final é https://riskko1124.github.io/r75k0-link/.

Pronto! Seu link-in-bio futurista estará atualizado assim que o deploy concluir.
