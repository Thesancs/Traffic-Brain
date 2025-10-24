# Integração com APIs Oficiais

Este projeto expõe endpoints e utilitários para conectar contas de anúncio via OAuth2, armazenar tokens de forma segura e sincronizar KPIs consolidados.

## 1. Pré-requisitos

Configure as credenciais em variáveis de ambiente (ou no painel de secrets do Vercel):

- **Meta Ads**: `META_APP_ID`, `META_APP_SECRET`
- **Google Ads**: `GOOGLE_ADS_CLIENT_ID`, `GOOGLE_ADS_CLIENT_SECRET`, `GOOGLE_ADS_DEVELOPER_TOKEN`, `GOOGLE_ADS_LOGIN_CUSTOMER_ID` *(opcional para MCC)*
- **TikTok Ads**: `TIKTOK_APP_ID`, `TIKTOK_APP_SECRET`
- **Armazenamento seguro**: `INTEGRATIONS_ENCRYPTION_KEY` (chave base64 de 32 bytes) e credenciais do `@vercel/kv` (`KV_REST_API_URL`, `KV_REST_API_TOKEN`, `KV_REST_API_READ_ONLY_TOKEN`).

Sem a chave de criptografia os tokens são mantidos apenas em memória para a sessão atual.

## 2. Fluxo de Autorização OAuth2

1. Obtenha a URL de login chamando `GET /api/oauth/{platform}/authorize?redirectUri=<URL>`.
2. Redirecione o usuário para o link retornado.
3. Receba o `code` de autorização na sua `redirectUri` e envie `POST /api/oauth/{platform}/callback` com:
   ```json
   {
     "code": "...",
     "redirectUri": "https://app.example.com/oauth/callback",
     "accountId": "1234567890",
     "businessManagerId": "meta-bm-1"
   }
   ```
4. O token será criptografado e armazenado; futuras sincronizações usarão esse registro.

## 3. Sincronização de KPIs

- **Manual**: `POST /api/integrations/sync` com `platforms`, `selections` (ID do Business Manager) e `range` opcional.
- **Dashboard**: `POST /api/dashboard/kpis` (o front-end utiliza este endpoint automaticamente ao alterar filtros).
- **Agendamento**: defina a periodicidade via `POST /api/integrations/schedule` com `{ "frequency": "hourly" | "daily" | "custom", "cron": "0 * * * *" }`. Consulte o estado atual com `GET /api/integrations/schedule`.

## 4. Exportação

O botão **Exportar Planilha** gera um arquivo `KPI_<data>.xlsx` contendo colunas de custo, CPM, CTR, conversões, CPA médio e faturamento para as plataformas filtradas.

## 5. BM (Business Manager)

- O dashboard lista automaticamente os BMs disponíveis em `src/app/dashboard/data.ts`.
- O usuário pode alternar entre BMs sem refazer o login; basta selecionar no dropdown.
- O estado da seleção é mantido durante a sessão.

## 6. Considerações de Segurança

- Tokens são criptografados com AES-256-GCM antes de persistirem no KV.
- Sem KV configurado, o `TokenStore` utiliza fallback em memória (útil para desenvolvimento local).
- Recomenda-se limitar os escopos solicitados e rotacionar a chave `INTEGRATIONS_ENCRYPTION_KEY` periodicamente.

## 7. Próximos Passos

- Configurar um cron externo (Vercel Cron ou GitHub Actions) para chamar `POST /api/integrations/sync` utilizando o agendamento armazenado.
- Incluir webhooks de eventos para atualizações imediatas quando cada plataforma oferecer suporte.
