# Especialidade

A especificação de "Especialidade" inclui dois endpoints que permitem recuperar informações sobre as especialidades cadastradas no sistema.

## Definição

Uma especialidade representa uma área de conhecimento ou campo de atuação específico dentro de uma profissão. Este conceito abrange todas as especialidades médicas, odontológicas e de outras áreas da saúde; como cardiologia, dermatologia, ortopedia, psicologia, etc.

O registro de uma especialidade contém pelo menos o nome da especialidade. O registro também pode conter informações adicionais como descrição, código CBO (Classificação Brasileira de Ocupações), entre outros.

Esses dados podem ser apresentados ao cliente final durante o processo de agendamento e em mensagens estruturadas. O sistema utiliza essas informações para permitir que os clientes escolham a especialidade desejada e entendam qual área específica irá atendê-los.

O campo de especialidade é amplamente utilizado em diversos outros endpoints do sistema, principalmente como um parâmetro de filtro. Por exemplo, ao buscar profissionais, serviços ou horários disponíveis, é possível informar o identificador de uma especialidade para restringir os resultados apenas àquela área de atuação específica.

## Objeto

O objeto de `Specialty` representa uma especialidade da organização.

| Atributo | Tipo   | Opcional | Descrição                                  |
| -------- | ------ | -------- | ------------------------------------------ |
| `id`     | string | Não      | O identificador único para a especialidade |
| `name`   | string | Não      | O nome da especialidade                    |

## Endpoints

### Obter uma lista de especialidades

Lista todas as especialidades, opcionalmente filtradas por parâmetros de consulta.

```
GET /specialties
```

#### Parâmetros de Consulta

| Parâmetro         | Tipo   | Opcional | Descrição                      |
| ----------------- | ------ | -------- | ------------------------------ |
| `healthInsurance` | string | Sim      | Filtrar por ID de convênio     |
| `location`        | string | Sim      | Filtrar por ID de localidade   |
| `plan`            | string | Sim      | Filtrar por ID de plano        |
| `professional`    | string | Sim      | Filtrar por ID de profissional |

#### Resposta

Um array JSON de objetos `Specialty`.

```json
[
  {
    "id": "123",
    "name": "Cardiologia"
  },
  {
    "id": "456",
    "name": "Dermatologia"
  }
]
```

### Obter uma especialidade por ID

Recupera uma única especialidade pelo seu ID. O ID da especialidade é passado como um parâmetro no caminho.

O campo `id` utilizado neste endpoint é populado pelo nosso sistema, normalmente a partir do resultado de outros endpoints que retornam objetos `Specialty`. Por exemplo, o endpoint de listagem de especialidades previamente mencionado retorna um array de objetos `Specialty`, cada um com seu próprio `id`. Ele também pode existir dentro de outros objetos, como o `Professional`.

```
GET /specialties/{id}
```

#### Parâmetros de Caminho

| Parâmetro | Tipo   | Descrição                              |
| --------- | ------ | -------------------------------------- |
| `id`      | string | O ID da especialidade a ser recuperada |

#### Resposta

Um único objeto `Specialty`.

```json
{
  "id": "123",
  "name": "Cardiologia"
}
```
