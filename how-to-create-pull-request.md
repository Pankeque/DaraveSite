# Como Criar um Pull Request no GitHub

## Passo 1: Acesse o Repositório
1. Abra o navegador e acesse: https://github.com/Pankeque/DaraveSite
2. Verifique se você está logado na sua conta GitHub

## Passo 2: Navegue para a Branch
1. Clique no menu "Branch: main" (ou "Branch: session/agent_bf2a56c0-9a23-4aeb-96f5-913a5b73f537" se já estiver na branch correta)
2. Se estiver na branch main, selecione a branch `session/agent_bf2a56c0-9a23-4aeb-96f5-913a5b73f537`

## Passo 3: Compare as Branches
1. Clique no botão "Compare & pull request"
2. Você será direcionado para a página de comparação de branches

## Passo 4: Preencha as Informações do Pull Request
1. **Título**: Adicione um título claro para o pull request (ex: "Add support for custom logo images")
2. **Descrição**: Preencha a descrição com as informações abaixo:

```
This PR adds support for custom logo images. Changes include:

1. Updated Home.tsx to use logo-navbar.png for the navigation bar
2. Updated Home.tsx to use logo-hero.png for the hero section
3. Updated Home.tsx to use logo-navbar.png for the footer

Note: Logo images (logo-navbar.png and logo-hero.png) must be added to client/public/ directory before the website will display them correctly.

## How to add logo images:

1. Prepare your logo images:
   - logo-navbar.png (small size: 40x40px to 80x80px, transparent background)
   - logo-hero.png (large size: 800x200px or bigger, transparent background)

2. Add images to repository:
   ```bash
   git add client/public/logo-navbar.png client/public/logo-hero.png
   git commit -m "Add logo images"
   git push origin session/agent_bf2a56c0-9a23-4aeb-96f5-913a5b73f537
   ```

## Changes Made

- Updated social media buttons with proper logos and links
- Fetch and update portfolio cards with real data from provided links
- Remove play button from landing page video section
- Make MobileMenu appear on desktop without navbar buttons
- Connect blog system to blog buttons
- Add bot invite links to Ticketmatics and Visucord dashboards
- Create dashboard systems with database for Ticketmatics and Visucord
- Document how to add custom logo images
- Fix navbar z-index to prevent overlap issues
```

## Passo 5: Review e Merge
1. Verifique se todas as informações estão corretas
2. Clique no botão "Create pull request"
3. Faça um review das mudanças
4. Se tudo estiver ok, clique no botão "Merge pull request"
5. Confirme o merge

## Passo 6: Verificar o Resultado
1. Após o merge, acesse a branch main
2. Verifique se as mudanças foram aplicadas corretamente
3. Teste o site para verificar se os logos estão sendo exibidos

## Problemas Comuns
- **Não vê a branch**: Certifique-se de que a branch `session/agent_bf2a56c0-9a23-4aeb-96f5-913a5b73f537` foi pushada para o repositório
- **Imagens não aparecem**: Verifique se as imagens de logo foram adicionadas ao diretório `client/public/`
- **Conflicts**: Se houver conflitos, resolva-os antes de mergear

## Próximos Passos
Após mergear o pull request, você pode:
1. Atualizar a branch main localmente: `git pull origin main`
2. Testar o site com as novas funcionalidades
3. Adicionar as imagens de logo se ainda não tiver feito

Boa sorte com o pull request!
