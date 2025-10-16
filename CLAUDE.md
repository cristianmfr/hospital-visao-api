# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a NestJS-based API for a hospital vision system (Hospital Visão). The project is currently in its initial setup phase with minimal modules configured.

## Development Commands

### Building and Running
- `pnpm run build` - Build the project
- `pnpm run start` - Start the application in production mode
- `pnpm run start:dev` - Start in development mode with file watching
- `pnpm run start:debug` - Start in debug mode with file watching
- `pnpm run start:prod` - Run the built production version from dist/

### Testing
- `pnpm test` - Run all tests
- `pnpm run test:watch` - Run tests in watch mode
- `pnpm run test:cov` - Run tests with coverage report
- `pnpm run test:debug` - Run tests with Node debugger attached
- `pnpm run test:e2e` - Run end-to-end tests

Note: Test files use the `.spec.ts` suffix and are located alongside source files in `src/`. E2E tests use a separate configuration in `test/jest-e2e.json`.

### Code Quality
- Biome is configured for formatting and linting (not ESLint/Prettier)
- Use tab indentation (not spaces)
- Use double quotes for strings
- Biome will automatically organize imports

## Architecture

### Application Structure
- **Entry point**: `src/main.ts` - Bootstraps the NestJS application on port 3333 (or PORT env variable)
- **Root module**: `src/app.module.ts` - Currently empty but will serve as the main dependency injection container
- **Module system**: Follow NestJS module architecture - organize features into modules with their own controllers, services, and DTOs

### TypeScript Configuration
- Target: ES2023
- Module system: NodeNext with ESM interop
- Decorators enabled (required for NestJS)
- Source maps enabled for debugging
- Strict null checks enabled
- Output directory: `dist/`

### NestJS CLI
- Schema collection: `@nestjs/schematics`
- Source root: `src`
- Build output is cleaned on each build

## Project Conventions

When adding new features:
1. Use NestJS CLI to generate modules, controllers, and services: `nest generate module <name>`, `nest generate controller <name>`, `nest generate service <name>`
2. Organize code by feature/domain modules
3. Follow NestJS dependency injection patterns
4. Use decorators for metadata and configuration
5. Format code with Biome using tab indentation and double quotes
