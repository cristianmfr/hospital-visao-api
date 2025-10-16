# Plano

A especificação de "Plano" inclui um endpoint que permite recuperar informações sobre os planos cadastrados no sistema.

## Definição

Um plano representa um plano específico oferecido por uma operadora de saúde ou convênio médico. Este conceito abrange todos os tipos de planos de saúde oferecidos pelas operadoras; como planos individuais, empresariais, familiares, etc.

Esses dados podem ser apresentados ao cliente final durante o processo de agendamento e em mensagens estruturadas. O sistema utiliza essas informações para permitir que os clientes escolham o plano desejado e entendam qual cobertura específica irá utilizar.

O campo de plano é amplamente utilizado em diversos outros endpoints do sistema, principalmente como um parâmetro de filtro. Por exemplo, ao buscar profissionais, serviços ou horários disponíveis, é possível informar o identificador de um plano para restringir os resultados apenas àquela cobertura específica.

## Objeto

O objeto de `Plan` representa um plano da organização.

Não temos restrições sobre o formato do campo `name`. Não utilizamos esse campo para validações ou filtros internos. Este campo é apenas para fins de apresentação ao cliente final.

| Atributo | Tipo   | Opcional | Descrição                          |
| -------- | ------ | -------- | ---------------------------------- |
| `id`     | string | Não      | O identificador único para o plano |
| `name`   | string | Não      | O nome do plano                    |

## Endpoints

### Obter uma lista de planos

Lista todos os planos, opcionalmente filtrados por parâmetros de consulta.

```
GET /plans
```

#### Parâmetros de Consulta

| Parâmetro         | Tipo   | Opcional | Descrição                      |
| ----------------- | ------ | -------- | ------------------------------ |
| `healthInsurance` | string | Sim      | Filtrar por ID de convênio     |
| `location`        | string | Sim      | Filtrar por ID de localidade   |
| `professional`    | string | Sim      | Filtrar por ID de profissional |

#### Resposta

Um array JSON de objetos `Plan`.

```json
[
  {
    "id": "123",
    "name": "Plano Individual"
  },
  {
    "id": "456",
    "name": "Plano Familiar"
  }
]
```
