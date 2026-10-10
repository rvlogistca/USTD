# USTD Network — starter de frontend e API

Este pacote fornece uma base executável com frontend, API Express e botões de teste. **Não é uma blockchain pronta nem implanta contrato.** O endereço e Chain ID foram reutilizados dos dados fornecidos, mas precisam ser confirmados na rede real.

## Requisitos
- Node.js 20 ou superior
- Endpoint RPC oficial da rede USTD para Chain ID 4644, caso queira validar o estado da rede no servidor
- VPS com HTTPS para uso público

## Executar localmente
```bash
cp .env.example .env
npm install
npm start
```
Abra `http://localhost:3000`. Teste `GET /api/health` e `POST /api/links`.

## Testar a API
```bash
curl http://localhost:3000/api/health
curl -X POST http://localhost:3000/api/links \
  -H 'Content-Type: application/json' \
  -d '{"uri":"/common.ethereum"}'
```

A rota `/api/links` atualmente valida e ecoa o caminho permitido. Ela **não** se conecta a um registro externo de links nem resolve `/common.ethereum`; implemente essa integração usando a especificação real do serviço antes de produção.

## VPS Linux (exemplo Ubuntu)
Instale Node.js 20+ usando uma fonte oficial apropriada à sua distribuição. Depois:
```bash
unzip ustd-network-starter.zip
cd ustd-network-starter
cp .env.example .env
nano .env
npm install
npm start
```
Para produção, execute com um gerenciador de processos (por exemplo, systemd ou PM2), coloque Nginx/Caddy na frente e configure HTTPS, firewall e atualizações. Não exponha portas administrativas.

## Configuração necessária
- `USTD_RPC_URL`: endpoint RPC oficial e funcional. Não invente nem publique tokens privados.
- `USTD_CHAIN_ID=4644`
- `USTD_CONTRACT_ADDRESS`: endereço fornecido, sujeito a confirmação.
- `CORS_ORIGINS`: origens exatas autorizadas.

## MetaMask
O frontend pede conexão e verifica o Chain ID retornado. Não adiciona uma rede automaticamente porque o nome, URL RPC, símbolo nativo e explorador oficiais não foram confirmados. Não assine transações até validar esses dados e o bytecode do contrato.

## Segurança antes de produção
- Configure HTTPS e CORS para o domínio real.
- Adicione rate limiting, logs, monitoramento e testes.
- Nunca coloque chaves privadas, frases-semente ou credenciais RPC secretas no frontend.
- Audite o contrato e confirme o endereço no explorador oficial.
- O health check mostra se a variável RPC foi configurada; não testa por si só a disponibilidade do RPC nem prova que o contrato existe.
