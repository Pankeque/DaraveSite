# Como Adicionar Imagens de Logo ao Repositório

## Passo 1: Preparar as Imagens de Logo
Certifique-se de ter os seguintes arquivos de logo:

1. `logo-navbar.png` - Logo pequeno para a barra de navegação (tamanho recomendado: 40x40px a 80x80px, com fundo transparente)
2. `logo-hero.png` - Logo grande para a seção hero (tamanho recomendado: 800x200px ou maior, com fundo transparente)

## Passo 2: Adicionar as Imagens ao Repositório
Você pode adicionar as imagens de duas maneiras:

### Opção 1: Usando o Git via Terminal
1. Coloque os arquivos de logo na pasta `client/public/`
2. Adicione os arquivos ao git:
   ```bash
   git add client/public/logo-navbar.png client/public/logo-hero.png
   ```
3. Crie um commit:
   ```bash
   git commit -m "Add logo images"
   ```
4. Push para o repositório:
   ```bash
   git push origin session/agent_bf2a56c0-9a23-4aeb-96f5-913a5b73f537
   ```

### Opção 2: Usando o GitHub Desktop
1. Arraste e solte os arquivos de logo na pasta `client/public/`
2. Abra o GitHub Desktop
3. Verifique as mudanças na aba "Changes"
4. Adicione uma mensagem de commit (ex: "Add logo images")
5. Clique em "Commit" e depois em "Push origin"

## Passo 3: Verificar as Alterações
Depois de pushar as imagens, você pode verificar se elas estão no repositório com o comando:
```bash
git ls-files client/public
```
Você deve ver a saída:
```
client/public/favicon.png
client/public/logo-hero.png
client/public/logo-navbar.png
```

## Passo 4: Testar o Site
1. Reinicie o servidor de desenvolvimento:
   ```bash
   npm run dev
   ```
2. Abra o navegador e verifique se os logos estão sendo exibidos corretamente

## Problemas Comuns e Soluções
- **Imagens não aparecem**: Verifique se o nome dos arquivos está correto (logo-navbar.png e logo-hero.png) e se estão na pasta client/public
- **Tamanho inadequado**: Ajuste as classes CSS no arquivo client/src/pages/Home.tsx
- **Fundo branco**: Certifique-se de que as imagens têm fundo transparente (formato PNG)

## Próximos Passos
Após adicionar as imagens de logo, você pode:
1. Criar um Pull Request para mergear as mudanças com a branch principal
2. Testar o site em diferentes dispositivos para verificar a responsividade
3. Ajustar os tamanhos das imagens se necessário
