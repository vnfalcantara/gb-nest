## Considerações
* Aplicação construida utilizando o NestJS
* Arquivos ".env" não estão no .gitignore por questões de praticidade

<br>

## Dependencias
* MongoDB
* Redis

<br>

## Usuário Default
* user: user@email.com
* pass: 123456

<br>

## Instalação
```bash
$ yarn install
```

## Scripts
```bash
# watch
$ yarn start:local

# Ambiente completo
$ docker-compose up
```

## Testes

```bash
# Unitários
$ yarn test

# Cobertura | coverage/lcov-report/index.html
$ yarn test:cov

# Integração
$ yarn test:e2e
```

# Endpoints
## Swagger
* http://localhost:3000/api

<br>

## Auth
method  | path | headers | body
------------- | ------------- | ------------- | -------------
POST  | /auth/login | - | {"email": "user@email.com", "password": "123456"}
GET  | /auth/profile | { Authorization: 'Bearer \<jwt-token\>' } | -

<br>

## User
method  | path | headers | body
------------- | ------------- | ------------- | -------------
POST  | /user | { Authorization: 'Bearer \<jwt-token\>' } | UserBodyDto
GET  | /user | { Authorization: 'Bearer \<jwt-token\>' } | -
GET  | /user/count | { Authorization: 'Bearer \<jwt-token\>' } | -
GET  | /user/:id | { Authorization: 'Bearer \<jwt-token\>' } | -
PUT  | /user/:id | { Authorization: 'Bearer \<jwt-token\>' } | UserBodyDto
DELETE  | /user/:id | { Authorization: 'Bearer \<jwt-token\>' } | -

<br>

## Purchase
method  | path | headers | body
------------- | ------------- | ------------- | -------------
POST  | /purchase | { Authorization: 'Bearer \<jwt-token\>' } | PurchaseBodyDto
GET  | /purchase | { Authorization: 'Bearer \<jwt-token\>' } | -
GET  | /purchase/count | { Authorization: 'Bearer \<jwt-token\>' } | -
GET  | /purchase/:id | { Authorization: 'Bearer \<jwt-token\>' } | -
PUT  | /purchase/:id | { Authorization: 'Bearer \<jwt-token\>' } | PurchaseBodyDto
DELETE  | /purchase/:id | { Authorization: 'Bearer \<jwt-token\>' } | -

<br>

## UserBodyDto
```javascript
{
  "name": "Foolano da Silva",
  "cpf": "11111111111",
  "email": "foolano@email.com",
  "password": "123456",
}
```

<br>

## PurchaseBodyDto
```javascript
{
  "code": 'abc123',
  "price": 999
}
```

<br>

## QueryParams
tipo  | exemplo | descrição 
------------- | ------------- | -------------
match  | [GET] /user?match[name]=Usuario | Retorna todos os documentos que derem match
fields  | [GET] /user?fields[name]=1 | Retorna somente a propriedade "name" de todos os documentos que derem match
options[sort]  | [GET] /user?options[sort]=name | Ordena os campos pela propriedade, de forma ascendente
options[sort]  | [GET] /user?options[sort]=-name | Ordena os campos pela propriedade, de forma descendente
options[skip]  | [GET] /user?options[skip]=2 | Desconsidera os dois primeiros documentos
options[limit]  | [GET] /user?options[limit]=1 | Limita o resultado a 1 documento