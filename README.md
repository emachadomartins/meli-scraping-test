# Data Collector

## Objetivo da aplicação

Coletar dados de sites a partir de uma url solicitada e de uma lista de passos a ser executados

## Crawler

O crawler da aplicação executa a partir da biblioteca `puppeteer` do `NodeJS`.

É possivel executar a aplicação a partir da imagem docker (`crawler/Dockerfile` ou `data_collector_crawler` no arquivo `compose.yml`) ou a partir dos comandos:

```bash
cd crawler
npm install
npm run dev
```

Para atualizar a task a ser executada é necessário atualizar as informações `url` e `steps` do arquivo `crawler/debug/task.json`

O crawler também pode ser testado de forma assincrona a partir do front-end.

## Back-end

O Back-end da aplicação é uma api REST contruída utilizando a biblioteca `flask` do `python`.

É possivel executar a aplicação a partir da imagem docker (`back/Dockerfile` ou `data_collector_back` no arquivo `compose.yml`) ou a partir dos comandos:

```bash
cd back
poetry install
poetry run flask --app src/index run --debug
```

## Front-end

O Front-end da aplicação é uma página contruída utilizando a biblioteca `react` do `javascript`.

É possivel executar a aplicação a partir da imagem docker (`front/Dockerfile` ou `data_collector_front` no arquivo `compose.yml`) ou a partir dos comandos:

```bash
cd front
npm install
npm run start
```

## Deploy

A aplicação total também está disponível na url: [Data Collector](http://data-collector-front-lb-787301229.us-east-1.elb.amazonaws.com/)

As 3 partes da aplicação rodam em serviços ECS hospedados na AWS.

## Como testar

Ao acessar a url do [Front-end](http://data-collector-front-lb-787301229.us-east-1.elb.amazonaws.com/) é possivel visualizar dois inputs:

1. Url: link do site que será coletado.
2. Steps: uma lista de passos que o crawler deve executar no site formatado em JSON.

Logo abaixo, terá uma lista das 5 ultimas tarefas executadas pelo crawler e seus resultados.

Elas podem possuir 3 status:

1. Completo
2. Erro
3. Em processamento

As tarefas com o status completo apresentam também as informações coletadas pelo crawler e a lista de arquivos baixados durante a coleta, as tarefas com o status de erro apresentam a mensagem de erro durante a execução e as tarefas em processamento apenas mostram o status e se atualizarão quando a tarefa finalizar a execução.

## Passos aceitos

Os passos aceitos pelo crawler são os seguintes:

1. click
2. scroll
3. navigate
4. info
5. export
6. select
7. input
8. captcha
9. wait

### Click

Esse passo realiza um clique em um elemento.

#### Atributos

- **selector**: uma string que representa uma forma de encontrar um elemento na DOM do site. Ela pode seguir o formato de um parametro de `querySelector` (Ex: `div.element #el`) ou um comando javascript que retorne um elemento (Ex: `document.getElementById('product-title')`)

### Scroll

Executa um scroll dentro da DOM.

#### Atributos

- **distance** (opcional): valor em pixels que serão scrollados a cada iteração
- **delay** (opcional): tempo em milisegundos que será aguardado entre uma iteração e outra
- **direction** (opcional): aceita os seguintes valores:
  - `top`: Executa o scroll pro inicio da DOM.
  - `bottom`: Executa o scroll até o final da DOM.
  - `infinity`: Executa o scroll até o final e espera carregar mais conteúdo, repete isso até que não tenha mais nada a ser carregado
  - caso nenhum valor seja passado o crawler só irá dar scroll o valor de `distance`

### Navigate

Acessa uma determinada url. É adicionado automaticamente ao primeiro step da navegação.

#### Atributos

- **url** : Link que o crawler irá acessar
- **timeout**: Tempo que será esperado para considerar uma request como erro.

### Info

Step que executa um comando javascript na dom e salva seu resultado em um atributo que será salvo na coleta.

#### Atributos

- **key**: Nome da informação coletada (Ex: titulo, preço, cpf, etc.)
- **script**: comando javascript que será executado para retornar a informação desejada.

### Export

Passo que tira um screenshot do site e exporta o conteudo do html para arquivos. É executado automaticamente no fim de toda navegação.

#### Atributos

- **name** (opcional): nome que sera salvo o arquivo html.

### Select

Passo que seleciona uma option de um select

#### Atributos

- **selector**: uma string que representa uma forma de encontrar um elemento na DOM do site. Ela pode seguir o formato de um parametro de `querySelector` (Ex: `div.element #el`) ou um comando javascript que retorne um elemento (Ex: `document.getElementById('product-title')`)
- **option**: qual opção será selecionada. Pode ser o atributo `value` da option ou o texto

### Captcha

Passo que encontra um captcha, envia para a api de resolução e insere seu resultado em um input.

#### Atributos

- **type**: O tipo do captcha selecionado (`audio` ou `image`)
- **file_selector**: o selector de onde está o arquivo do captcha.
- **response_selector**: o selector do input onde será inserido o valor da resolução do captcha

### Wait

Espera alguns para executar o proximo passo.

#### Atributos

- **time**: A quantidade de milisegundos que será esperado.

### Atributos universais

Os seguintes atributos podem ser adicionados em qualquer step

- **wait**(opcional): A quantidade de milisegundos que será esperado antes de passar para o proximo step.
- **critical**(opcional): Valor booleano que indica o que fazer quando tiver um erro durante a execução do step (valor default: `false`)
  - `true`: estoura erro e encerra a execução.
  - `false`: adiciona o erro como warning nos logs da execução.

### Exemplos de Scripts

```json

```

## Rotas do Back-End

O back-end possui as seguintes rotas:

### **[PUT] /text**

Recebe um arquivo como parametro, converte em texto e retorna o resultado da conversão.

#### Parametros

- **file** (Body): Arquivo que será convertido
- **file_type** (Body): Tipo do arquivo que será convertido (Valores aceitos: `image`, `audio`, `pdf`)

### **[GET] /task**

Retorna as ultimas 5 tasks e seus resultados de execução.

### **[GET] /task/:id**

Retorna os resultados de uma task especifica.

#### Parametros

- **id** (Params): Id da task que está sendo buscada.

### **[GET] /task/:id/:file_name**

Retorna o conteudo de um arquivo da execução.

#### Parametros

- **id** (Params): Id da task que está sendo buscada.
- **file_name** (Params): nome do arquivo.

### **[POST] /task**

Recebe uma url e uma lista de steps e envia para o crawler executar via Amazon SQS.

#### Parametros

- **url** (Body): URL que será crawleada
- **steps** (Body): Lista de steps que seram executados, caso não seja enviado serão executados os passos default.
