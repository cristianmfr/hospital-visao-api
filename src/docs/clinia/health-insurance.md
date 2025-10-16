# Convênio

A especificação de "Convênio" inclui dois endpoints que permitem recuperar informações sobre os convênios cadastrados no sistema.

## Definição

Um convênio representa um plano de saúde ou seguro médico que oferece cobertura para serviços médicos. Este conceito abrange todas as operadoras de planos de saúde, seguros médicos e convênios médicos; como Unimed, Amil, SulAmérica, etc.

Esses dados podem ser apresentados ao cliente final durante o processo de agendamento e em mensagens estruturadas. O sistema utiliza essas informações para permitir que os clientes escolham o convênio desejado e entendam qual operadora irá cobrir o atendimento.

O campo de convênio é amplamente utilizado em diversos outros endpoints do sistema, principalmente como um parâmetro de filtro. Por exemplo, ao buscar profissionais, serviços ou horários disponíveis, é possível informar o identificador de um convênio para restringir os resultados apenas àquela operadora específica.

## Objeto

O objeto de `HealthInsurance` representa um convênio da organização.

Não temos restrições sobre o formato do campo `name`. Não utilizamos esse campo para validações ou filtros internos. Este campo é apenas para fins de apresentação ao cliente final.

| Atributo | Tipo   | Opcional | Descrição                             |
| -------- | ------ | -------- | ------------------------------------- |
| `id`     | string | Não      | O identificador único para o convênio |
| `name`   | string | Não      | O nome do convênio                    |

## Endpoints

### Obter uma lista de convênios

Lista todos os convênios, opcionalmente filtrados por parâmetros de consulta.

```
GET /health-insurances
```

#### Parâmetros de Consulta

| Parâmetro      | Tipo   | Opcional | Descrição                      |
| -------------- | ------ | -------- | ------------------------------ |
| `service`      | string | Sim      | Filtrar por ID de serviço      |
| `location`     | string | Sim      | Filtrar por ID de localidade   |
| `professional` | string | Sim      | Filtrar por ID de profissional |

#### Resposta

Um array JSON de objetos `HealthInsurance`.

```json
[
  {
    "id": "123",
    "name": "Unimed",
    "color": "#3d5aee"
  },
  {
    "id": "456",
    "name": "Amil",
    "color": "#ff6b6b"
  }
]
```

### Obter um convênio por ID

Recupera um único convênio pelo seu ID. O ID do convênio é passado como um parâmetro no caminho.

O campo `id` utilizado neste endpoint é populado pelo nosso sistema, normalmente a partir do resultado de outros endpoints que retornam objetos `HealthInsurance`. Por exemplo, o endpoint de listagem de convênios previamente mencionado retorna um array de objetos `HealthInsurance`, cada um com seu próprio `id`. Ele também pode existir dentro de outros objetos, como o `Appointment`.

```
GET /health-insurances/{id}
```

#### Parâmetros de Caminho

| Parâmetro | Tipo   | Descrição                         |
| --------- | ------ | --------------------------------- |
| `id`      | string | O ID do convênio a ser recuperado |

#### Resposta

Um único objeto `HealthInsurance`.

```json
{
  "id": "123",
  "name": "Unimed",
  "color": "#3d5aee"
}
```
