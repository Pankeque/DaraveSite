#!/bin/bash

# Script de post-deploy para Vercel
# Use: npm run postdeploy (ou configure no Vercel Deploy Hook)

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
    echo "📝 O Vercel vai reconstruir o site automaticamente."
else
    echo "⚠️ Deploy hook retornou: HTTP $DEPLOY_CODE"
fi

echo ""
echo "📊 Monitore o deploy em:"
echo "   https://vercel.com/dashboard"
echo ""
echo "📊 Para solicitar reindexação manual no Google (consome quota):"
echo "   https://search.google.com/search-console/indexing-errors"
echo ""
echo "✨ Post-deploy concluído!"
echo ""
echo "ℹ️  Nota: O ping de sitemap foi Deprecated pelo Google em 2023."
echo "   O Google agora descobre atualizações automaticamente."