# Localidade

A especificação de "Localidade" inclui dois endpoints que permitem recuperar informações sobre as localidades cadastradas no sistema.

## Definição

Uma localidade representa um endereço físico onde os serviços ou atendimentos ao cliente são realizados. Este conceito abrange todos os pontos de prestação de serviços; como consultórios, laboratórios, etc.

O registro de uma localidade contém pelo menos o endereço completo da localidade. Além disso, o registro pode conter um nome amigável, a cidade, estado, CEP e, quando disponível, as coordenadas geográficas (latitude e longitude).

Esses dados serão apresentados ao cliente final. O texto a ser exibido é construído pelo nosso sistema, de acordo com as propriedades disponíveis da localidade. Por exemplo, se o nome (opcional) estiver presente, ele será priorizado na apresentação do texto. Caso contrário, usaremos o endereço completo.

## Objeto

O objeto de `Location` representa um local físico.

Não temos restrições sobre o formato dos campos `name`, `city`, `state` e `cep`. Não utilizamos esses campos para validações ou filtros internos. Estes campos são apenas para fins de apresentação ao cliente final.

| Atributo  | Tipo   | Opcional | Descrição                               |
| --------- | ------ | -------- | --------------------------------------- |
| `id`      | string | Não      | O identificador único para a localidade |
| `name`    | string | Sim      | O nome amigável da localidade           |
| `address` | string | Não      | O endereço completo da localidade       |
| `city`    | string | Sim      | A cidade onde a localidade está         |
| `state`   | string | Sim      | O estado ou província                   |
| `cep`     | string | Sim      | O código postal (CEP)                   |
| `lat`     | number | Sim      | A coordenada de latitude                |
| `long`    | number | Sim      | A coordenada de longitude               |

## Endpoints

### Obter uma lista de localidades

Lista todas as localidades, opcionalmente filtradas por parâmetros de consulta.

```
GET /locations
```

#### Parâmetros de Consulta

| Parâmetro      | Tipo   | Opcional | Descrição                       |
| -------------- | ------ | -------- | ------------------------------- |
| `service`      | string | Sim      | Filtrar por ID de serviço       |
| `professional` | string | Sim      | Filtrar por ID de profissional  |
| `specialty`    | string | Sim      | Filtrar por ID de especialidade |
| `client`       | string | Sim      | Filtrar por ID de cliente       |

#### Resposta

Um array JSON de objetos `Location`.

```json
[
  {
    "id": "123",
    "name": "Clinia",
    "address": "Av. Plinio Brasil Milano, 123",
    "city": "Porto Alegre",
    "state": "RS",
    "cep": "12345-678",
    "lat": 34.0522,
    "long": -118.2437
  }
]
```

### Obter uma localidade por ID

Recupera uma única localidade pelo seu ID. O ID da localidade é passado como um parâmetro no caminho.

O campo `id` utilizado neste endpoint é populado pelo nosso sistema, normalmente a partir do resultado de outros endpoints que retornam objetos `Location`. Por exemplo, o endpoint de listagem de localidades previamente mencionado retorna um array de objetos `Location`, cada um com seu próprio `id`.

```
GET /locations/{id}
```

#### Parâmetros de Caminho

| Parâmetro | Tipo   | Descrição                        |
| --------- | ------ | -------------------------------- |
| `id`      | string | O ID da localidade a ser listada |

#### Resposta

Um único objeto `Location`.

```json
{
  "id": "123",
  "name": "Clinia",
  "address": "Av. Plinio Brasil Milano, 123",
  "city": "Porto Alegre",
  "state": "RS",
  "cep": "12345-678",
  "lat": 34.0522,
  "long": -118.2437
}
```
