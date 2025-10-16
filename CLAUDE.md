# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Hospital Visão API - A NestJS REST API for managing medical appointments (atendimentos) for a hospital system. The API integrates with a legacy MySQL database (stiloweb32) that uses Portuguese table/column names.

## Development Commands

```bash
# Start development server with watch mode
pnpm start:dev

# Build the project
pnpm build

# Start production server
pnpm start:prod

# Run tests
pnpm test

# Run tests in watch mode
pnpm test:watch

# Run tests with coverage
pnpm test:cov

# Run e2e tests
pnpm test:e2e

# Lint and format code (using Biome)
pnpm biome check --write
```

## Architecture

### Module Structure

The application follows NestJS modular architecture with feature-based modules located in `src/modules/`. Currently implements:

- **AppointmentsModule**: Main feature module for medical appointments
  - Controller: `appointments.controller.ts` - REST endpoints
  - Service: `appointments.service.ts` - Business logic with TypeORM queries
  - Model: `appointment.model.ts` - TypeORM entity mapping to `dad_atendimento` table
  - DTOs: Query parameters and response transformation

### Database Architecture

Uses TypeORM with MySQL. Key characteristics:

- **Legacy Database**: Connects to existing `stiloweb32` database with Portuguese naming conventions
- **No Synchronization**: `synchronize: false` - schema is managed externally via SQL DDL
- **Entity Registration**: All entities must be added to `src/config/database.config.ts` entities array
- **Timezone**: Set to UTC ('Z') for consistent date handling

**Main Tables** (see `src/docs/hospital-visao-ddl.sql` for full schema):
- `dad_atendimento`: Appointments/consultations (main entity)
- `dad_paciente`: Patients
- `dad_medico`: Doctors
- `dad_especialidade`: Medical specialties
- `dad_convenio`: Health insurance
- `dad_exame`: Medical exams
- `dad_cirurgia`: Surgeries

### Configuration

Environment variables required (via `.env`):
- `DB_HOST`: MySQL host
- `DB_USERNAME`: Database user
- `DB_PASSWORD`: Database password
- `DB_DATABASE`: Database name (likely "stiloweb32")
- `NODE_ENV`: Controls logging (development enables query logging)

### Code Style

Uses Biome for formatting and linting:
- **Indentation**: Tabs
- **Quotes**: Single quotes
- **Semicolons**: As needed (asNeeded)
- **Explicit any**: Allowed (noExplicitAny: off)

### Data Transformation Patterns

The AppointmentsService demonstrates the pattern used:
1. Use TypeORM QueryBuilder with `getRawMany()` for complex joins
2. Transform Portuguese column names to English API responses
3. Map legacy enum values to modern conventions (e.g., CONFIRMADO → CONFIRMED)
4. Calculate derived fields (e.g., endHour from startTime + 30 minutes)
5. Clean/format data (e.g., remove phone number formatting)

### Adding New Entities

When adding new TypeORM entities:
1. Create entity in appropriate module under `models/`
2. Add entity class to imports in `src/config/database.config.ts` line 14
3. Remember `synchronize: false` means schema changes must be done via SQL

### API Response Structure

Controllers should return DTOs that transform legacy Portuguese field names to English REST API conventions. See `appointments-response.dto.ts` for the nested object structure pattern.

## Testing

Tests are configured with Jest:
- Test files: `*.spec.ts` (located alongside source files)
- Root directory: `src/`
- Coverage output: `coverage/`
- No e2e tests exist yet
