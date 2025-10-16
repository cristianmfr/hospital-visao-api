# Cliente

A especificação de "Cliente" inclui cinco endpoints que permitem recuperar e manipular informações sobre os clientes.

## Definição

Um cliente representa uma pessoa que busca atendimento ou serviços de saúde através do sistema de agendamento. Este conceito abrange todos os tipos de pacientes que podem utilizar os serviços da organização; como pacientes de consultas médicas, exames, tratamentos, procedimentos, etc.

O registro de um cliente contém pelo menos o nome. O registro também pode conter informações sobre telefone, CPF, data de nascimento, e-mail, imagem e outras informações adicionais.

Esses dados são utilizados pelo sistema para identificar e listar clientes durante o processo de agendamento, para permitir a busca e recuperação de informações do paciente, e facilitar a comunicação entre o sistema e o cliente através de diferentes canais.

## Objeto

O objeto de `Client` representa um cliente/paciente da organização.

Não temos restrições sobre o formato dos campos `name` e `description`. Não utilizamos esses campos para validações ou filtros internos. Estes campos são apenas para fins de apresentação e identificação do cliente.

> **Atenção**
> Embora o dado de telefone não seja obrigatório, é altamente recomendado que seja cadastrado sempre que possível.
>
> O número de telefone é fundamental para que o sistema possa enviar mensagens outbound (por exemplo, via WhatsApp) ao cliente, permitindo a comunicação ativa como confirmações de agendamento, lembretes e outras notificações importantes definidas pelo operador da interface web.

O campo de `phone` pode conter um número de telefone válido, no formato de telefone.

O campo de `allPhones` pode ser um array de números de telefone, no formato de telefone. Aplicável caso o cliente o sistema de terceiro permita o cadastro de mais de um número de telefone por cliente. Esse dado pode ser mostrado na interface do operador da interface web.

O campo de `cpf` pode conter um CPF válido, podendo ser formatado com pontos e hífens ou não.

O campo de `birthday` pode conter a data de nascimento do cliente, no formato de data.

| Atributo      | Tipo   | Opcional | Descrição                                  |
| ------------- | ------ | -------- | ------------------------------------------ |
| `id`          | string | Não      | O identificador único para o cliente       |
| `name`        | string | Não      | O nome do cliente                          |
| `description` | string | Sim      | Descrição ou observações sobre o cliente   |
| `phone`       | string | Sim      | Número de telefone principal               |
| `allPhones`   | array  | Sim      | Array de números de telefone, se aplicável |
| `cpf`         | string | Sim      | CPF do cliente                             |
| `image`       | string | Sim      | URL da imagem/foto do cliente              |
| `email`       | string | Sim      | Endereço de e-mail do cliente              |
| `birthday`    | string | Sim      | Data de nascimento                         |

## Endpoints

### Obter uma lista de clientes

Lista todos os clientes, opcionalmente filtrados por parâmetros de paginação.

```
GET /clients
```

#### Parâmetros de Paginação

| Parâmetro | Tipo    | Opcional | Descrição                                                    |
| --------- | ------- | -------- | ------------------------------------------------------------ |
| `limit`   | integer | Sim      | Número máximo de resultados a serem retornados               |
| `offset`  | integer | Sim      | Deslocamento a partir do qual os resultados serão retornados |

#### Resposta

Um array JSON de objetos `Client`.

```json
[
  {
    "id": "123",
    "name": "João Silva",
    "description": "Cliente regular",
    "phone": "5511999999999",
    "allPhones": ["5511999999999", "5521999999999"],
    "cpf": "123.456.789-00",
    "image": "https://example.com/photo.jpg",
    "email": "joao@example.com",
    "birthday": "1990-01-01",
    "externalId": "ext123"
  }
]
```

### Buscar clientes por termo

Busca clientes que correspondam ao termo de pesquisa fornecido. A busca pode ser realizada por nome, CPF, telefone ou e-mail do cliente.

O tipo do termo a ser usado (CPF, telefone ou e-mail) é definido pela configuração da integração, definida pela interface web.

A busca deve ser exata, ou seja, o endpoint deve retornar apenas os clientes que correspondem exatamente ao termo de pesquisa. Por exemplo, se o termo de pesquisa for o telefone `5511999999999`, o endpoint deve retornar os clientes que possuem esse telefone no cadastro.

```
GET /clients/search
```

#### Parâmetros de Consulta

| Parâmetro | Tipo    | Opcional | Descrição                                                    |
| --------- | ------- | -------- | ------------------------------------------------------------ |
| `term`    | string  | Não      | Termo de pesquisa para buscar clientes                       |
| `limit`   | integer | Sim      | Número máximo de resultados a serem retornados               |
| `offset`  | integer | Sim      | Deslocamento a partir do qual os resultados serão retornados |

#### Resposta

Um array JSON de objetos `Client` que correspondem ao termo de pesquisa.

```json
[
  {
    "id": "123",
    "name": "João Silva",
    "description": "Cliente regular",
    "phone": "5511999999999",
    "allPhones": ["5511999999999", "5521999999999"],
    "cpf": "123.456.789-00",
    "image": "https://example.com/photo.jpg",
    "email": "joao@example.com",
    "birthday": "1990-01-01",
    "externalId": "ext123"
  }
]
```

### Obter um cliente por ID

Recupera um único cliente pelo seu ID. O ID do cliente é passado como um parâmetro no caminho.

```
GET /clients/{id}
```

#### Parâmetros de Caminho

| Parâmetro | Tipo   | Descrição                        |
| --------- | ------ | -------------------------------- |
| `id`      | string | O ID do cliente a ser recuperado |

#### Resposta

Um único objeto `Client`.

```json
{
  "id": "123",
  "name": "João Silva",
  "description": "Cliente regular",
  "phone": "5511999999999",
  "allPhones": ["5511999999999", "5521999999999"],
  "cpf": "123.456.789-00",
  "image": "https://example.com/photo.jpg",
  "email": "joao@example.com",
  "birthday": "1990-01-01",
  "externalId": "ext123"
}
```

### Criar um novo cliente

Cria um novo cliente no sistema de terceiros. Este endpoint envia dados para a API do sistema de terceiros para cadastrar um novo cliente.

```
POST /clients
```

#### Corpo da Requisição

O corpo da requisição será um objeto JSON contendo os dados do cliente a ser criado.

> **Atenção**
> Atualmente, a Clinia opera principalmente com sistemas que utilizam telefone como identificador, já que a grande maioria dos nossos clientes interage via WhatsApp.
>
> Por esse motivo, quase sempre teremos o dado de telefone disponível para cadastro do cliente, e por isso o dado é referenciado como não opcional. No entanto, é importante observar que, à medida que aprimorarmos nossas integrações com outros canais, como Instagram ou Facebook, o identificador de telefone não estará disponível, pois essas plataformas não fornecem necessariamente esse dado. Então essa obrigatoriedade pode ser alterada no futuro.

O campo de `phone` será o telefone internacional do cliente que iniciou uma conversação com o sistema.

O campo de `name` será uma string com alguma representação do nome do cliente. Caso nenhuma informação de nome seja fornecida durante a conversa com o cliente, o telefone será o nome do paciente.

Os campos de `healthInsurance` e `location` serão os IDs do convênio médico e da localização/unidade associada ao cliente. Estes dados serão enviados caso a conversa com o cliente tenha passado pelo processo de seleção de convênio médico e/ou localização/unidade. Estes dados são enviados caso o sistema de terceiro necessite dessas informações para cadastrar o cliente. Podem ser ignorados caso não sejam aplicáveis.

| Atributo          | Tipo   | Opcional | Descrição                                                    |
| ----------------- | ------ | -------- | ------------------------------------------------------------ |
| `name`            | string | Não      | O nome do cliente                                            |
| `phone`           | string | Não      | Número de telefone                                           |
| `email`           | string | Sim      | Endereço de e-mail do cliente                                |
| `birthday`        | string | Sim      | Data de nascimento                                           |
| `cpf`             | string | Sim      | CPF do cliente, sem formatação                               |
| `healthInsurance` | string | Sim      | ID do convênio médico associado ao cliente, se aplicável     |
| `location`        | string | Sim      | ID da localização/unidade associada ao cliente, se aplicável |

##### Exemplo de Requisição

```json
{
  "name": "Maria Silva Santos",
  "phone": "5511999999999",
  "email": "maria.silva@example.com",
  "birthday": "1985-03-15",
  "cpf": "12345678900",
  "healthInsurance": "conv123",
  "location": "loc456"
}
```

#### Resposta

Em caso de sucesso, retorna o objeto `Client` criado a partir dos dados enviados.

```json
{
  "id": "789",
  "name": "Maria Silva Santos",
  "phone": "5511999999999",
  "allPhones": ["5511999999999"],
  "cpf": "123.456.789-00",
  "email": "maria.silva@example.com",
  "birthday": "1985-03-15"
}
```

**Nota:** Qualquer resposta que não seja um status 200 OK será ser tratada como um erro.

### Atualizar um cliente por ID

Atualiza as informações de um cliente existente. Este endpoint envia dados para a API do sistema de terceiro para modificar as informações de um cliente específico.

```
PATCH /clients/{id}
```

#### Parâmetros de Caminho

| Parâmetro | Tipo   | Descrição                        |
| --------- | ------ | -------------------------------- |
| `id`      | string | O ID do cliente a ser atualizado |

#### Corpo da Requisição

O corpo da requisição será um objeto JSON contendo os campos que devem ser atualizados. Todas as chaves do objeto são opcionais.

| Atributo   | Tipo   | Opcional | Descrição                      |
| ---------- | ------ | -------- | ------------------------------ |
| `name`     | string | Sim      | O nome do cliente              |
| `email`    | string | Sim      | Endereço de e-mail do cliente  |
| `cpf`      | string | Sim      | CPF do cliente, sem formatação |
| `birthday` | string | Sim      | Data de nascimento             |

##### Exemplo de Requisição

```json
{
  "name": "Maria Silva Santos Oliveira",
  "email": "maria.oliveira@example.com",
  "cpf": "12345678900",
  "birthday": "1985-03-15"
}
```

#### Resposta

Em caso de sucesso, retorna o objeto `Client` atualizado com os dados modificados.

```json
{
  "id": "789",
  "name": "Maria Silva Santos Oliveira",
  "phone": "5511999999999",
  "allPhones": ["5511999999999"],
  "cpf": "123.456.789-00",
  "email": "maria.oliveira@example.com",
  "birthday": "1985-03-15"
}
```

**Nota:** Qualquer resposta que não seja um status 200 OK será tratada como um erro.
