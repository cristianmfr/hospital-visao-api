# Agendamento

A especificação de "Agendamento" inclui endpoints que permitem gerenciar agendamentos no sistema.

## Definição

Um agendamento representa uma consulta ou atendimento agendado. Este conceito abrange todos os tipos de agendamentos médicos, odontológicos e de outras áreas da saúde.

O agendamento é o item central de qualquer sistema de agendamento, pois representa o compromisso entre cliente e a empresa em um determinado horário e data.

Esses dados são fundamentais para organizar o fluxo de atendimentos, permitindo o controle eficiente de horários, confirmações, cancelamentos e o acompanhamento do status de cada agendamento pela interface web.

O registro de um agendamento contém pelo menos a data, hora e estado do agendamento. O registro também pode conter informações sobre o cliente, profissional, serviço, localidade, especialidade, convênio, e quaisquer outras entidades relacionadas.

A funcionalidade de listagem de agendamentos constitui um elemento central entre o nosso sistema e plataformas de terceiros. Por meio destes endpoints, é possível:

- Facilitar o envio automatizado e contextualizado de comunicações relacionadas a agendamentos diretamente para os clientes, promovendo maior engajamento e transparência no relacionamento;
- Prover à interface web uma visualização atualizada dos agendamentos, permitindo que operadores e gestores acompanhem o status e os detalhes de cada atendimento agendado;
- Enriquecer o fluxo de conversação com o cliente, fornecendo informações personalizadas durante as interações, o que contribui para uma experiência mais fluida, assertiva e alinhada às melhores práticas de atendimento.

## Objeto

O objeto de `Appointment` representa um agendamento no sistema.

> **Atenção**
> Embora a relação com o objeto de `client` seja opcional, é altamente recomendado que esta exista sempre que possível.
>
> A existência desse objeto é fundamental para que o sistema possa enviar mensagens outbound (por exemplo, via WhatsApp) ao cliente, permitindo a comunicação ativa como confirmações de agendamento, lembretes e outras notificações importantes definidas pelo operador da interface web.
>
> Nosso sistema se baseia no objeto de `client` dentro do objeto de `appointment`, para extrair o dado de `phone` (e se aplicável, o dado de `allPhones`). Usamos esses dados de telefone para decidir para qual de seus canais de comunicação vamos enviar a mensagem.

Os objetos relacionados são opcionais, mas idealmente todas as relações possíveis devem ser preenchidas; para melhor aproveitamento da integração.

| Atributo          | Tipo   | Opcional | Descrição                                   |
| ----------------- | ------ | -------- | ------------------------------------------- |
| `id`              | string | Não      | O identificador único para o agendamento.   |
| `date`            | string | Não      | A data do agendamento.                      |
| `hour`            | string | Não      | A hora do agendamento.                      |
| `endHour`         | string | Sim      | A hora de término do agendamento.           |
| `state`           | string | Não      | O estado do agendamento.                    |
| `classification`  | string | Sim      | A classificação do agendamento.             |
| `client`          | object | Sim      | O cliente associado ao agendamento.         |
| `location`        | object | Sim      | A localidade onde ocorrerá o agendamento.   |
| `specialty`       | object | Sim      | A especialidade do agendamento.             |
| `healthInsurance` | object | Sim      | O convênio associado ao agendamento.        |
| `professional`    | object | Sim      | O profissional que realizará o atendimento. |
| `service`         | object | Sim      | O serviço que será prestado.                |

## Endpoints

### Obter uma lista de agendamentos

Lista todos os agendamentos, opcionalmente filtrados por parâmetros de consulta.

Os parametros de `start` e `end` são usados para filtrar os agendamentos por um intervalo de tempo. A implementação do sistema de terceiro deve considerar que o intervalo de tempo é fechado, ou seja, o agendamento do dia `start` e o dia `end` devem ser incluídos na busca.

Os parametros de filtro (`location`, `service`, `professional`, `client`) são usados para filtrar os agendamentos que contém essas relações. Por exemplo, se o parametro `location` for informado, o sistema deve retornar apenas os agendamentos que possuem uma relação com a localidade informada.

O parametro `minimal` é um booleano opcional que indica se a lista de agendamentos pode omitir informações que não são necessárias para a interface web, como relações com outras entidades. Este parametro existe por questões de performance. A listagem de agendamentos na interface web pode acarretar em carregamento lento, caso o período de busca for muito longo.

```
GET /appointments
```

#### Parâmetros de Consulta

| Parâmetro      | Tipo    | Opcional | Descrição                                              |
| -------------- | ------- | -------- | ------------------------------------------------------ |
| `start`        | string  | Não      | Data de início para busca.                             |
| `end`          | string  | Não      | Data de fim para busca.                                |
| `location`     | string  | Sim      | Filtrar por ID de localidade.                          |
| `service`      | string  | Sim      | Filtrar por ID de serviço.                             |
| `professional` | string  | Sim      | Filtrar por ID de profissional.                        |
| `client`       | string  | Sim      | Filtrar por ID de cliente.                             |
| `state`        | string  | Sim      | Filtrar por estado de agendamento.                     |
| `minimal`      | boolean | Sim      | Retornar dados reduzidos, por questões de performance. |

#### Resposta

Um array JSON de objetos `Appointment`.

```json
[
  {
    "id": "123",
    "date": "2025-06-25",
    "hour": "09:00",
    "endHour": "09:30",
    "state": "CONFIRMED",
    "classification": "Primeira consulta",
    "client": {
      "id": "456",
      "name": "João Silva",
      "phone": "5511999999999"
    },
    "location": {
      "id": "789",
      "address": "Rua das Flores, 123"
    },
    "professional": {
      "id": "101",
      "name": "Dr. Maria Santos"
    },
    "service": {
      "id": "202",
      "name": "Consulta Médica"
    }
  }
]
```

### Obter um agendamento por ID

Recupera um único agendamento pelo seu ID. O ID do agendamento é passado como um parâmetro no caminho.

O campo `id` utilizado neste endpoint é populado pelo nosso sistema, normalmente a partir do resultado de outros endpoints que retornam objetos `Appointment`. Por exemplo, o endpoint de listagem de agendamentos retorna um array de objetos `Appointment`, cada um com seu próprio `id`.

```
GET /appointments/{id}
```

#### Parâmetros de Caminho

| Parâmetro | Tipo   | Descrição                             |
| --------- | ------ | ------------------------------------- |
| `id`      | string | O ID do agendamento a ser recuperado. |

#### Resposta

Um único objeto `Appointment`.

```json
{
  "id": "123",
  "date": "2025-06-25",
  "hour": "09:00",
  "endHour": "09:30",
  "state": "CONFIRMED",
  "classification": "Primeira consulta",
  "client": {
    "id": "456",
    "name": "João Silva",
    "phone": "5511999999999"
  },
  "location": {
    "id": "789",
    "address": "Rua das Flores, 123"
  },
  "professional": {
    "id": "101",
    "name": "Dr. Maria Santos"
  },
  "service": {
    "id": "202",
    "name": "Consulta Médica"
  }
}
```

### Alterar o estado de um agendamento

Altera o estado de um agendamento específico no sistema.

Este endpoint permite atualizar o estado de agendamento de um agendamento existente. A mudança de estado é uma operação fundamental para fluxos de confirmação, cancelamento e outras operações relacionadas a agendamentos.

```
PATCH /appointments/{id}/state
```

#### Parâmetros de caminho

| Parâmetro | Tipo   | Obrigatório | Descrição                            |
| --------- | ------ | ----------- | ------------------------------------ |
| `id`      | string | Sim         | O identificador único do agendamento |

#### Corpo da requisição

O corpo da requisição deve conter um objeto JSON com a seguinte estrutura:

| Propriedade | Tipo | Obrigatório | Descrição                    |
| ----------- | ---- | ----------- | ---------------------------- |
| `state`     | enum | Sim         | O novo estado de agendamento |

##### Exemplo de requisição

```json
{
  "state": "CONFIRMED"
}
```

#### Resposta

Em caso de sucesso, retorna uma mensagem de sucesso. O conteúdo da resposta não é relevante para nossa integração.

```
"Appointment state updated successfully"
```

**Nota:** Qualquer resposta que não seja um status 200 OK será ser tratada como um erro.

### Alterar a data e hora de um agendamento

Altera a data e hora de um agendamento específico no sistema.

Este endpoint permite atualizar a data e hora de um agendamento existente. A mudança de horário é uma operação fundamental para reagendamentos e ajustes de agenda; seja por interface web ou por conversação automatizada com o cliente.

```
PATCH /appointments/{id}/time
```

#### Parâmetros de caminho

| Parâmetro | Tipo   | Obrigatório | Descrição                            |
| --------- | ------ | ----------- | ------------------------------------ |
| `id`      | string | Sim         | O identificador único do agendamento |

#### Corpo da requisição

O corpo da requisição deve conter um objeto JSON com a seguinte estrutura:

| Propriedade | Tipo   | Obrigatório | Descrição                  |
| ----------- | ------ | ----------- | -------------------------- |
| `date`      | string | Sim         | A nova data do agendamento |
| `hour`      | string | Sim         | A nova hora do agendamento |

##### Exemplo de requisição

```json
{
  "date": "2025-06-26",
  "hour": "14:30"
}
```

#### Resposta

Em caso de sucesso, retorna uma mensagem de sucesso. O conteúdo da resposta não é relevante para nossa integração.

```
"Appointment time updated successfully"
```

**Nota:** Qualquer resposta que não seja um status 200 OK será ser tratada como um erro.

### Criar um novo agendamento

Cria um novo agendamento no sistema de terceiros.

```
POST /appointments
```

#### Corpo da Requisição

O corpo da requisição será um objeto JSON contendo os dados do agendamento a ser criado.

A data e hora do agendamento são sempre obrigatórias e serão informadas no corpo da requisição. Esses dados são obtidos previamente através do endpoint de Agenda, que retorna os horários disponíveis para agendamento.

**Como funciona:**

1. Antes de criar um agendamento, nosso sistema consulta o endpoint de Agenda
2. O sistema busca por horários disponíveis dentro de um intervalo de tempo específico
3. Se um serviço específico foi selecionado (por exemplo), a busca inclui o ID do serviço para filtrar apenas horários compatíveis
4. Os dados do horário selecionado (data e hora) são então enviados na criação do agendamento

O ID de `client` será o ID de um `client` previamente cadastro no sistema, a partir do endpoint de Cliente.

Todos os outros dados são opcionais na especificação. Esses dados (como profissional, serviço, localidade, convênio, plano) só estarão presentes caso o cliente ou o operador da interface tenha selecionado essas informações corretamente durante o processo de agendamento.

A responsabilidade de garantir que esses dados sejam coletados e selecionados no fluxo de agendamento é por configuração do produto, não da especificação da API. A especificação vai definir a estrutura mínima de dados que devem ser enviados para criar um agendamento.

| Atributo          | Tipo   | Opcional | Descrição                                        |
| ----------------- | ------ | -------- | ------------------------------------------------ |
| `date`            | string | Não      | A data do agendamento                            |
| `hour`            | string | Não      | A hora do agendamento                            |
| `client`          | string | Não      | O ID do cliente associado ao agendamento         |
| `professional`    | string | Sim      | O ID do profissional que realizará o agendamento |
| `service`         | string | Sim      | O ID do serviço que será prestado                |
| `location`        | string | Sim      | O ID da localidade onde ocorrerá o agendamento   |
| `healthInsurance` | string | Sim      | O ID do convênio associado ao agendamento        |
| `plan`            | string | Sim      | O ID do plano associado ao agendamento           |

##### Exemplo de Requisição

```json
{
  "date": "2025-06-25",
  "hour": "14:30",
  "client": "client123",
  "professional": "prof456",
  "service": "service789",
  "location": "loc101",
  "healthInsurance": "conv202",
  "plan": "plan303"
}
```

#### Resposta

Em caso de sucesso, retorna o objeto `Appointment` criado a partir dos dados enviados.

```json
{
  "id": "appointment456",
  "date": "2025-06-25",
  "hour": "14:30",
  "endHour": "15:00",
  "state": "WAITING",
  "classification": "Primeira consulta",
  "client": {
    "id": "client123",
    "name": "João Silva",
    "phone": "5511999999999"
  },
  "professional": {
    "id": "prof456",
    "name": "Dr. Maria Santos"
  },
  "service": {
    "id": "service789",
    "name": "Consulta Médica"
  },
  "location": {
    "id": "loc101",
    "address": "Rua das Flores, 123"
  },
  "healthInsurance": {
    "id": "conv202",
    "name": "Convênio ABC"
  }
}
```

**Nota:** Qualquer resposta que não seja um status 200 OK será ser tratada como um erro.
