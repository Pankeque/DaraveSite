#!/bin/bash

# Script de post-deploy para reindexar sitemap no Google
# Use: npm run postdeploy (ou configure no Vercel)

SITE_URL="https://daravestudios.vercel.app"
SITEMAP_URL="$SITE_URL/sitemap.xml"
DEPLOY_HOOK="https://api.vercel.com/v1/integrations/deploy/prj_WJFvbmRw1Xsykp0rtNiYgTpgUPvI/108RsYA8tg"

echo "🚀 Iniciando post-deploy..."
echo ""

# 1. Acionar deploy hook do Vercel
echo "📦 Acionando deploy hook do Vercel..."
DEPLOY_RESPONSE=$(curl -s -w "\n%{http_code}" -X POST "$DEPLOY_HOOK")
DEPLOY_CODE=$(echo "$DEPLOY_RESPONSE" | tail -n1)

if [ "$DEPLOY_CODE" = "200" ] || [ "$DEPLOY_CODE" = "201" ]; then
    echo "✅ Deploy hook acionado com sucesso! (HTTP $DEPLOY_CODE)"
else
    echo "⚠️ Deploy hook retornou: HTTP $DEPLOY_CODE"
fi

echo ""

# 2. Enviar ping para o Google reindexar sitemap
echo "� Enviando ping para o Google reindexar sitemap..."
echo "📍 Sitemap: $SITEMAP_URL"

HTTP_CODE=$(curl -s -o /dev/null -w '%{http_code}' "https://www.google.com/ping?sitemap=$SITEMAP_URL")

if [ "$HTTP_CODE" = "200" ] || [ "$HTTP_CODE" = "204" ]; then
    echo "✅ Google recebeu o ping com sucesso! (HTTP $HTTP_CODE)"
    echo "📝 O Google vai começar a reindexar suas páginas em breve."
else
    echo "⚠️ Resposta do Google: HTTP $HTTP_CODE"
    echo "💡 O Google pode ter bloqueado ou haver um problema temporário."
fi

echo ""
echo "📊 Para verificar a reindexação, visite:"
echo "   https://search.google.com/search-console/indexing-errors?resource_id=sc-domain:daravestudios.vercel.app"
echo ""
echo "✨ Post-deploy concluído!"