# Build Your Roadmap

Interactive app to help developers (beginner to advanced) build a practical full-stack learning roadmap from one place.

Repository: [nish349/build-your-roadmap](https://github.com/nish349/build-your-roadmap)

## Purpose

The goal is to guide any developer through skills, languages, frameworks, databases, security, cloud, and testing, then turn choices into a clear, structured learning path.

## Current Features

- Personalized 5-step wizard:
  - Expertise + goal
  - Frontend stack
  - Backend stack
  - Database
  - Time/depth preferences
- Expertise-based option filtering (`Novice`, `Competent`, `Polishing Up`)
- CCH-based time estimation with expertise multipliers
- Structured generated output:
  - Golden Path roadmap by category
  - Alternatives and next steps
  - Wise notes/recommendations
- Session persistence with `localStorage` (auto-save and resume)
- Mobile-friendly responsive UI

## Product Direction

- Add richer personalization (career tracks, preferred learning style)
- Add export/share options (PDF/JSON/link)
- Add resource mapping (courses/docs per roadmap item)
- Add progress tracking and milestone completion

## Master Full Stack Roadmap and Toolkit

### Frontend Development

- Core: `HTML5`, `CSS3`, `JavaScript (ES6+)`
- Frameworks: `React`, `Next.js`, `Angular`, `Vue`
- Styling: `Tailwind CSS`, `MUI/Chakra`, `Bootstrap`
- Tooling: `TypeScript`, `npm/yarn/pnpm`, `Vite/Webpack`
- Data fetching: `Fetch API`, `Axios`, `TanStack Query`

### Backend Engineering

- Node: `Express`, `NestJS`
- Python: `Django`, `FastAPI`, `Flask`
- Java: `Spring Boot`
- Go: `Gin/Echo`
- Rust: `Actix/Axum`
- API styles: `REST`, `GraphQL`, `tRPC`, `gRPC`
- Real-time/messaging: `WebSockets`, `SSE`, `WebRTC`, `Redis`, `RabbitMQ`, `Kafka`, `BullMQ`

### Data Persistence

- SQL: `PostgreSQL`, `MySQL`, `MariaDB`
- NoSQL: `MongoDB`
- Cache/key-value: `Redis`
- Wide-column/cloud scale: `Cassandra`, `DynamoDB`
- ORMs: `Prisma`, `TypeORM`, `Django ORM`, `SQLAlchemy`, `Hibernate/JPA`

### Authentication and Security

- Self-hosted: `Passport.js`, `NextAuth.js`, `Keycloak`
- Managed identity: `Auth0`, `Firebase Auth`, `Supabase Auth`, `AWS Cognito`
- Standards: `OAuth2`, `OIDC`, `JWT`
- Security baseline: `OWASP Top 10`

### Cloud, DevOps and Infrastructure

- Cloud: `AWS`, `GCP`, `Azure`, `Vercel`, `Netlify`
- IaC: `Terraform`, `CloudFormation`
- Containers/orchestration: `Docker`, `Podman`, `Docker Compose`, `Kubernetes`, `Helm`, `ECS/EKS`
- CI/CD: `GitHub Actions`, `GitLab CI`, `Jenkins`, `CircleCI`

### Testing Strategy

- Unit/integration: `Jest`, `Vitest`, `React Testing Library`, `PyTest`, `JUnit`, `Mockito`
- E2E/API: `Playwright`, `Cypress`, `Supertest`, `Postman/Newman`, `k6`

## Tech Stack

- `React` + `TypeScript`
- `Vite`
- `Tailwind CSS`
- `Lucide React`

## Getting Started

```bash
npm install
npm run dev
```

Open the local Vite URL printed in the terminal.

### Scripts

- `npm run dev` - start development server
- `npm run build` - type-check and production build
- `npm run preview` - preview production build
- `npm run lint` - run ESLint

## License

MIT License. See `LICENSE` for details.
