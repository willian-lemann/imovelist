Crie tests para esse fluxo, desde o login ate isso:

- Usuário clica "Fazer Upgrade" → chama POST /api/abacatepay/checkout

- API cria cobrança na AbacatePay → retorna URL de pagamento

- Usuário é redirecionado para a página da AbacatePay (PIX ou Cartão)
  Após pagamento, AbacatePay envia webhook billing.paid
  Webhook ativa a subscription do usuário no banco
