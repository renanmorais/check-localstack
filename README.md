# Serverless + LocalStack Skeleton


### Requisitos
- Docker + Docker Compose
- Node.js 20
- Serverless Framework (npx funciona)


### Subir ambiente local
```bash
npm i
npm run dev:up
npm run deploy
npm run seed
npm test
# quando terminar
npm run remove
npm run dev:down


Endpoints úteis

LocalStack health: http://localhost:4566/_localstack/health

Invoke local: npm run invoke:httpPing

Lambda logs: serverless logs -f userCreated -t
