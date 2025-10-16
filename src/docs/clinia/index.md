# Resumo da API Clinia - Endpoints e Schema do Banco

## Visão Geral

A Clinia é uma plataforma de comunicação automatizada para instituições de saúde que integra sistemas de agendamento via API REST. O desenvolvedor deve criar uma API que segue as especificações da Clinia, extraindo dados do sistema do cliente e transformando-os para o formato esperado.

## Endpoints da API

### 1. Localidades (/locations)

**Entidade**: Endereços físicos onde serviços são realizados

- `GET /locations` - Lista todas as localidades
  - Parâmetros: service, professional, specialty, client
- `GET /locations/{id}` - Obter localidade por ID

### 2. Convênios (/health-insurances)

**Entidade**: Planos de saúde e operadoras

- `GET /health-insurances` - Lista todos os convênios
  - Parâmetros: service, location, professional
- `GET /health-insurances/{id}` - Obter convênio por ID

### 3. Planos (/plans)

**Entidade**: Planos específicos oferecidos pelas operadoras

- `GET /plans` - Lista todos os planos
  - Parâmetros: healthInsurance, location, professional

### 4. Especialidades (/specialties)

**Entidade**: Áreas de conhecimento médico

- `GET /specialties` - Lista todas as especialidades
  - Parâmetros: healthInsurance, location, plan, professional
- `GET /specialties/{id}` - Obter especialidade por ID

### 5. Serviços (/services)

**Entidade**: Consultas, exames e procedimentos

- `GET /services` - Lista todos os serviços
  - Parâmetros: location, professional, healthInsurance, specialty, plan, client, enabled
- `GET /services/{id}` - Obter serviço por ID

### 6. Profissionais (/professionals)

**Entidade**: Médicos, dentistas e outros profissionais

- `GET /professionals` - Lista todos os profissionais
  - Parâmetros: location, service, healthInsurance, specialty, enabled
- `GET /professionals/{id}` - Obter profissional por ID

### 7. Clientes (/clients)

**Entidade**: Pacientes do sistema

- `GET /clients` - Lista todos os clientes
  - Parâmetros: limit, offset
- `GET /clients/search` - Buscar clientes por termo
  - Parâmetros: term, limit, offset
- `GET /clients/{id}` - Obter cliente por ID
- `POST /clients` - Criar novo cliente
- `PATCH /clients/{id}` - Atualizar cliente

### 8. Agenda (/schedule)

**Entidade**: Horários disponíveis para agendamento

- `GET /schedule` - Obter horários disponíveis
  - Parâmetros: start, end, professional, service, location, healthInsurance, specialty, client, plan

### 9. Agendamentos (/appointments)

**Entidade**: Consultas e atendimentos agendados

- `GET /appointments` - Lista todos os agendamentos
  - Parâmetros: start, end, location, service, professional, client, state, minimal
- `GET /appointments/{id}` - Obter agendamento por ID
- `POST /appointments` - Criar novo agendamento
- `PATCH /appointments/{id}/state` - Alterar estado do agendamento
- `PATCH /appointments/{id}/time` - Alterar data/hora do agendamento

## Schema do Banco de Dados

### Tabela: locations

```sql
CREATE TABLE locations (
    id VARCHAR PRIMARY KEY,
    name VARCHAR,
    address VARCHAR NOT NULL,
    city VARCHAR,
    state VARCHAR,
    cep VARCHAR,
    lat DECIMAL,
    long DECIMAL
);
```

### Tabela: health_insurances

```sql
CREATE TABLE health_insurances (
    id VARCHAR PRIMARY KEY,
    name VARCHAR NOT NULL,
    color VARCHAR
);
```

### Tabela: plans

```sql
CREATE TABLE plans (
    id VARCHAR PRIMARY KEY,
    name VARCHAR NOT NULL
);
```

### Tabela: specialties

```sql
CREATE TABLE specialties (
    id VARCHAR PRIMARY KEY,
    name VARCHAR NOT NULL
);
```

### Tabela: services

```sql
CREATE TABLE services (
    id VARCHAR PRIMARY KEY,
    name VARCHAR NOT NULL,
    price DECIMAL,
    duration INTEGER, -- em minutos
    description TEXT,
    preparation TEXT
);
```

### Tabela: professionals

```sql
CREATE TABLE professionals (
    id VARCHAR PRIMARY KEY,
    name VARCHAR NOT NULL,
    description TEXT,
    image VARCHAR, -- URL
    expertise VARCHAR,
    register VARCHAR
);
```

### Tabela: professional_specialties (relacionamento)

```sql
CREATE TABLE professional_specialties (
    professional_id VARCHAR REFERENCES professionals(id),
    specialty_id VARCHAR REFERENCES specialties(id),
    PRIMARY KEY (professional_id, specialty_id)
);
```

### Tabela: clients

```sql
CREATE TABLE clients (
    id VARCHAR PRIMARY KEY,
    name VARCHAR NOT NULL,
    description TEXT,
    phone VARCHAR, -- formato internacional: 5511999999999
    cpf VARCHAR,
    image VARCHAR, -- URL
    email VARCHAR,
    birthday DATE, -- formato: YYYY-MM-DD
    external_id VARCHAR
);
```

### Tabela: client_phones (para múltiplos telefones)

```sql
CREATE TABLE client_phones (
    client_id VARCHAR REFERENCES clients(id),
    phone VARCHAR NOT NULL,
    PRIMARY KEY (client_id, phone)
);
```

### Tabela: appointments

```sql
CREATE TABLE appointments (
    id VARCHAR PRIMARY KEY,
    date DATE NOT NULL, -- formato: YYYY-MM-DD
    hour TIME NOT NULL, -- formato: HH:mm
    end_hour TIME,
    state VARCHAR NOT NULL, -- WAITING, CONFIRMED, REJECTED, SHOW, NO_SHOW
    classification VARCHAR,
    client_id VARCHAR REFERENCES clients(id),
    location_id VARCHAR REFERENCES locations(id),
    specialty_id VARCHAR REFERENCES specialties(id),
    health_insurance_id VARCHAR REFERENCES health_insurances(id),
    professional_id VARCHAR REFERENCES professionals(id),
    service_id VARCHAR REFERENCES services(id),
    plan_id VARCHAR REFERENCES plans(id)
);
```

### Tabela: schedules (horários disponíveis)

```sql
CREATE TABLE available_slots (
    id VARCHAR PRIMARY KEY,
    date DATE NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    professional_id VARCHAR REFERENCES professionals(id),
    service_id VARCHAR REFERENCES services(id),
    location_id VARCHAR REFERENCES locations(id),
    is_available BOOLEAN DEFAULT TRUE
);
```

## Relacionamentos e Filtros

### Relacionamentos Many-to-Many

- Profissionais ↔ Especialidades
- Clientes ↔ Telefones (múltiplos)

### Filtros Comuns

- **Por localidade**: services, professionals, specialties, health-insurances, plans
- **Por profissional**: locations, services, specialties, health-insurances
- **Por serviço**: locations, professionals, health-insurances, specialties
- **Por convênio**: specialties, plans, professionals, services
- **Por especialidade**: locations, professionals, services

## Formatos de Dados

- **Data**: `YYYY-MM-DD` (ISO 8601)
- **Hora**: `HH:mm` (formato 24h)
- **ID**: string alfanumérica
- **Telefone**: formato internacional sem formatação (ex: `5511999999999`)
- **Estados de agendamento**: `WAITING`, `CONFIRMED`, `REJECTED`, `SHOW`, `NO_SHOW`

## Considerações Importantes

1. **Dados obrigatórios vs opcionais**: Nem todos os endpoints são obrigatórios - implemente apenas os que o sistema do cliente suporta
2. **Telefone do cliente**: Altamente recomendado para comunicação via WhatsApp
3. **Performance**: Use o parâmetro `minimal=true` em listagens grandes de agendamentos
4. **Origem dos dados**: Todos os dados devem vir do sistema do cliente, incluindo IDs originais
5. **Filtros**: Combine múltiplos filtros para consultas específicas (ex: profissional + serviço + localidade)
