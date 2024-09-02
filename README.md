
# Weather API

Esta é uma API de previsão do tempo que utiliza a API da Visual Crossing para obter dados meteorológicos e armazena os resultados em um cache Redis para otimizar o desempenho.

## Índice

- [Descrição](#descrição)
- [Instalação](#instalação)
- [Configuração](#configuração)
- [Uso](#uso)
- [Cache com Redis](#cache-com-redis)
- [Scripts](#scripts)

## Descrição

A `Weather API` permite que os usuários obtenham informações meteorológicas de uma cidade específica. A API primeiro verifica se os dados estão armazenados no cache Redis para evitar solicitações desnecessárias à API externa. Se os dados não estiverem em cache, a API faz uma solicitação à Visual Crossing para buscar as informações mais recentes e as armazena em Redis.

## Instalação

Para instalar o projeto, siga os passos abaixo:

1. Clone o repositório:
   ```bash
   git clone https://github.com/AlfredoLSN/Wheather-API
   cd Weather-API
   ```

2. Instale as dependências:
   ```bash
   npm install
   ```

## Configuração

Antes de rodar o projeto, você precisa configurar as variáveis de ambiente:

1. Crie um arquivo `.env` na raiz do projeto com base no arquivo `.env.example`:
   ```bash
   cp .env.example .env
   ```

2. Substitua `YOUR_API_KEY` no arquivo `.env` pela sua chave da API da Visual Crossing.

## Uso

Para iniciar o servidor, use o comando abaixo:

```bash
npm run dev
```

O servidor estará rodando em `http://localhost:3333`.

### Endpoints

- `GET /` - Retorna uma mensagem "Hello World!".
- `GET /weather/:city` - Retorna as informações meteorológicas da cidade especificada.

### Exemplo de Requisição

```bash
curl http://localhost:3333/weather/London
```

### Exemplo de Resposta

```json
{
    "address": "London, England, United Kingdom",
    "max": "23",
    "min": "15",
    "description": "Clear throughout the day."
}
```

## Cache com Redis

### O que é Redis?

Redis é um banco de dados NoSQL de chave-valor, que funciona como um cache in-memory altamente eficiente. Ele é usado para armazenar dados temporários que podem ser recuperados rapidamente, evitando a necessidade de acessar fontes de dados mais lentas, como APIs externas ou bancos de dados tradicionais.

### Como o Redis é usado neste projeto?

Neste projeto, o Redis é utilizado para armazenar as informações meteorológicas de cada cidade consultada. Quando uma solicitação é feita para `/weather/:city`, o fluxo é o seguinte:

1. **Verificação do Cache:** A API verifica se as informações sobre a cidade já estão armazenadas no Redis.
   - Se estiverem, os dados são retornados diretamente do Redis, proporcionando uma resposta extremamente rápida.
   - Se não estiverem, a API faz uma chamada à Visual Crossing para obter as informações mais recentes.

2. **Armazenamento no Cache:** Se a API obtiver dados da Visual Crossing, eles são armazenados no Redis com um tempo de expiração de 12 horas (43.200 segundos). Isso significa que novas solicitações para a mesma cidade, dentro desse período, serão atendidas a partir do cache.

### Configuração do Redis

O Redis pode ser configurado localmente ou usando Docker. O arquivo `docker-compose.yml` incluído no projeto permite levantar um contêiner Redis rapidamente:

```bash
docker-compose up -d
```

Isso iniciará um contêiner Redis que será acessível na porta `6379`.

## Scripts

- `npm run dev`: Inicia o servidor em modo de desenvolvimento.

