# Serviço

A especificação de "Serviço" inclui dois endpoints que permitem recuperar informações sobre os serviços cadastrados no sistema.

## Definição

Um serviço representa uma oferta de atendimento ou procedimento que pode ser agendado pelos clientes. Este conceito abrange todos os tipos de serviços oferecidos pelas organizações; como consultas médicas, exames, tratamentos, procedimentos, etc.

O registro de um serviço contém pelo menos o nome do serviço. O registro também pode conter informações sobre preço, duração estimada, descrição detalhada e instruções de preparação.

Esses dados podem ser apresentados ao cliente final durante o processo de agendamento e em mensagens estruturadas. O sistema utiliza essas informações para permitir que os clientes escolham o serviço desejado e entendam o que será incluído no pedido de agendamento.

## Objeto

O objeto de `Service` representa um serviço oferecido pela organização.

Não temos restrições sobre o formato dos campos `name`, `description` e `preparation`. Não utilizamos esses campos para validações ou filtros internos. Estes campos são apenas para fins de apresentação ao cliente final.

O campo de `duration` deve ser sempre um inteiro positivo. Ele vai indicar a duração do serviço em minutos.

| Atributo      | Tipo   | Opcional | Descrição                               |
| ------------- | ------ | -------- | --------------------------------------- |
| `id`          | string | Não      | O identificador único para o serviço    |
| `name`        | string | Não      | O nome do serviço                       |
| `price`       | number | Sim      | O preço do serviço, em reais (R$)       |
| `duration`    | number | Sim      | A duração estimada em minutos           |
| `description` | string | Sim      | A descrição detalhada do serviço        |
| `preparation` | string | Sim      | Instruções de preparação para o serviço |

## Endpoints

### Obter uma lista de serviços

Lista todos os serviços, opcionalmente filtrados por parâmetros de consulta.

O parâmetro `enabled` é um booleano que indica se o serviço está ativo ou não. O significado de "ativo" depende da implementação do sistema de terceiro.

Ele é usado para termos a possibilidade de filtrar os serviços que não devem ser disponibilizados para o cliente final, mas que ainda estão cadastrados no sistema.

```
GET /services
```

#### Parâmetros de Consulta

| Parâmetro         | Tipo    | Opcional | Descrição                       |
| ----------------- | ------- | -------- | ------------------------------- |
| `location`        | string  | Sim      | Filtrar por ID de localidade    |
| `professional`    | string  | Sim      | Filtrar por ID de profissional  |
| `healthInsurance` | string  | Sim      | Filtrar por ID de convênio      |
| `specialty`       | string  | Sim      | Filtrar por ID de especialidade |
| `plan`            | string  | Sim      | Filtrar por ID de plano         |
| `client`          | string  | Sim      | Filtrar por ID de cliente       |
| `enabled`         | boolean | Sim      | Filtrar por status de ativação  |

#### Resposta

Um array JSON de objetos `Service`.

```json
[
  {
    "id": "123",
    "name": "Consulta Médica",
    "price": 150.0,
    "duration": 30,
    "description": "Consulta médica geral com avaliação completa",
    "preparation": "Trazer exames recentes se houver"
  }
]
```

### Obter um serviço por ID

Recupera um único serviço pelo seu ID. O ID do serviço é passado como um parâmetro no caminho.

O campo `id` utilizado neste endpoint é populado pelo nosso sistema, normalmente a partir do resultado de outros endpoints que retornam objetos `Service`. Por exemplo, o endpoint de listagem de serviços previamente mencionado retorna um array de objetos `Service`, cada um com seu próprio `id`.

```
GET /services/{id}
```

#### Parâmetros de Caminho

| Parâmetro | Tipo   | Descrição                        |
| --------- | ------ | -------------------------------- |
| `id`      | string | O ID do serviço a ser recuperado |

#### Resposta

Um único objeto `Service`.

```json
{
  "id": "123",
  "name": "Consulta Médica",
  "price": 150.0,
  "duration": 30,
  "description": "Consulta médica geral com avaliação completa",
  "preparation": "Trazer exames recentes se houver"
}
```
