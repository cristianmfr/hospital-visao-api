# Agenda

A especificação de "Agenda" inclui um endpoint que permite consultar horários disponíveis para agendamentos no sistema.

## Definição

A agenda representa a disponibilidade de horários para agendamentos em um determinado período. Este conceito abrange todos os tipos de consultas e atendimentos que podem ser agendados, permitindo que clientes e operadores identifiquem os melhores horários disponíveis.

Esses dados são fundamentais para o processo de agendamento, pois permitem que o sistema apresente opções de horários disponíveis baseadas em critérios específicos como profissional, serviço, localidade, convênio médico e outros quaisquer outros filtros futuros.

Este endpoint será utilizado antes de criar um novo agendamento ou de editar um agendamento existente. Dessa forma, garante-se que o horário escolhido pelo cliente ou operador está realmente disponível no sistema de terceiros, evitando conflitos de agenda e melhorando a experiência do usuário.

## Objeto

O objeto de `Schedule` representa a agenda de horários disponíveis para agendamento, dentro do intervalo especificado.

Esse objeto é retornado como um objeto JSON, onde as chaves são datas e os valores são arrays de intervalos de hora. Na ausência de horários disponíveis para uma determinada data, a chave pode ser omitida ou o valor pode ser um array vazio.

### Exemplos

**Horários disponíveis para o dia 25 de junho de 2025:**

```json
{
  "2025-06-25": [
    {
      "start": "09:00",
      "end": "09:30"
    }
  ]
}
```

**Nenhum horário disponível:**

```json
{
  "2025-06-25": []
}
```

Ou

```json
{}
```

## Endpoints

### Obter horários disponíveis

Lista os horários disponíveis para agendamento em um período específico, opcionalmente filtrados por parâmetros de consulta.

Os parâmetros de `start` e `end` são usados para definir o período de busca dos horários disponíveis. A implementação do sistema de terceiro deve considerar que o intervalo de tempo é fechado, ou seja, os horários do dia `start` e do dia `end` devem ser incluídos na busca.

Os parâmetros de filtro (`professional`, `service`, `location`, `healthInsurance`, `specialty`, `client`, `plan`) são usados para filtrar os horários disponíveis baseados nessas entidades. Por exemplo, se o parâmetro `professional` for informado, o sistema deve retornar apenas os horários disponíveis para aquele profissional específico.

A combinação de filtros permite que o sistema apresente horários altamente específicos, facilitando o processo de agendamento e garantindo que apenas horários realmente disponíveis sejam oferecidos.

```
GET /schedule
```

#### Parâmetros de Consulta

| Parâmetro         | Tipo   | Opcional | Descrição                                         |
| ----------------- | ------ | -------- | ------------------------------------------------- |
| `start`           | string | Não      | Data de início para busca de horários disponíveis |
| `end`             | string | Não      | Data de fim para busca de horários disponíveis    |
| `professional`    | string | Sim      | Filtrar por ID de profissional                    |
| `service`         | string | Sim      | Filtrar por ID de serviço                         |
| `location`        | string | Sim      | Filtrar por ID de localidade                      |
| `healthInsurance` | string | Sim      | Filtrar por ID de convênio                        |
| `specialty`       | string | Sim      | Filtrar por ID de especialidade                   |
| `client`          | string | Sim      | Filtrar por ID de cliente                         |
| `plan`            | string | Sim      | Filtrar por ID de plano                           |

#### Resposta

Um objeto JSON onde as chaves são datas e os valores são arrays de intervalos de hora.

```json
{
  "2025-06-25": [
    {
      "start": "09:00",
      "end": "09:30"
    },
    {
      "start": "10:00",
      "end": "10:30"
    },
    {
      "start": "14:00",
      "end": "14:30"
    }
  ],
  "2025-06-26": [
    {
      "start": "08:00",
      "end": "08:30"
    },
    {
      "start": "15:00",
      "end": "15:30"
    }
  ],
  "2025-06-27": []
}
```
