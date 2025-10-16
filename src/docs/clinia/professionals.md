# Profissional

A especificação de "Profissional" inclui dois endpoints que permitem recuperar informações sobre os profissionais cadastrados no sistema.

## Definição

Um profissional representa uma pessoa que presta serviços ou atendimentos aos clientes. Este conceito abrange todos os tipos de profissionais das organizações; como médicos, dentistas, fisioterapeutas, psicólogos, etc.

O registro de um profissional contém pelo menos o nome do profissional. O registro também pode conter informações sobre descrição, imagem, especialidade, registro profissional e especialidades associadas.

Esses dados podem ser apresentados ao cliente final durante o processo de agendamento e em mensagens estruturadas. O sistema utiliza essas informações para permitir que os clientes escolham o profissional desejado e entendam qual especialista irá atendê-los.

## Objeto

O objeto de `Professional` representa um profissional da organização.

Não temos restrições sobre o formato dos campos `name`, `description`, `expertise` e `register`. Não utilizamos esses campos para validações ou filtros internos. Estes campos são apenas para fins de apresentação ao cliente final.

O campo `image` deve conter uma URL válida para a imagem do profissional, quando disponível.

A lista de especialidades do profissional é uma lista de objetos `Specialty`. Essa lista é opcional e pode ser vazia. Ela pode ser usada em contextos de apresentação ao cliente final, como por exemplo, para apresentar as especialidades do profissional, ou para filtros.

| Atributo      | Tipo   | Opcional | Descrição                                 |
| ------------- | ------ | -------- | ----------------------------------------- |
| `id`          | string | Não      | O identificador único para o profissional |
| `name`        | string | Não      | O nome do profissional                    |
| `description` | string | Sim      | A descrição ou biografia do profissional  |
| `image`       | string | Sim      | URL da imagem do profissional             |
| `expertise`   | string | Sim      | A expertise do profissional               |
| `register`    | string | Sim      | O número de registro profissional         |
| `specialties` | array  | Sim      | Lista de especialidades do profissional   |

## Endpoints

### Obter uma lista de profissionais

Lista todos os profissionais, opcionalmente filtrados por parâmetros de consulta.

O parâmetro `enabled` é um booleano que indica se o profissional está ativo ou não. O significado de "ativo" depende da implementação do sistema de terceiro.

Ele é usado para termos a possibilidade de filtrar os profissionais que não devem ser disponibilizados para o cliente final, mas que ainda estão cadastrados no sistema.

```
GET /professionals
```

#### Parâmetros de Consulta

| Parâmetro         | Tipo    | Opcional | Descrição                       |
| ----------------- | ------- | -------- | ------------------------------- |
| `location`        | string  | Sim      | Filtrar por ID de localidade    |
| `service`         | string  | Sim      | Filtrar por ID de serviço       |
| `healthInsurance` | string  | Sim      | Filtrar por ID de convênio      |
| `specialty`       | string  | Sim      | Filtrar por ID de especialidade |
| `enabled`         | boolean | Sim      | Filtrar por status de ativação  |

#### Resposta

Um array JSON de objetos `Professional`.

```json
[
  {
    "id": "123",
    "name": "Dr. João Silva",
    "description": "Médico cardiologista com mais de 10 anos de experiência",
    "image": "https://example.com/foto.png",
    "expertise": "Cardiologia",
    "register": "CRM 12345 SP",
    "specialties": [
      {
        "id": "456",
        "name": "Cardiologia"
      }
    ]
  }
]
```

### Obter um profissional por ID

Recupera um único profissional pelo seu ID. O ID do profissional é passado como um parâmetro no caminho.

O campo `id` utilizado neste endpoint é populado pelo nosso sistema, normalmente a partir do resultado de outros endpoints que retornam objetos `Professional`. Por exemplo, o endpoint de listagem de profissionais previamente mencionado retorna um array de objetos `Professional`, cada um com seu próprio `id`.

```
GET /professionals/{id}
```

#### Parâmetros de Caminho

| Parâmetro | Tipo   | Descrição                             |
| --------- | ------ | ------------------------------------- |
| `id`      | string | O ID do profissional a ser recuperado |

#### Resposta

Um único objeto `Professional`.

```json
{
  "id": "123",
  "name": "Dr. João Silva",
  "description": "Médico cardiologista com mais de 10 anos de experiência",
  "image": "https://example.com/images/joao-silva.jpg",
  "expertise": "Cardiologia",
  "register": "CRM 12345 SP",
  "specialties": [
    {
      "id": "456",
      "name": "Cardiologia"
    }
  ]
}
```
