import type {
  ExpertiseLevel,
  GoalType,
  OptionGroup,
  SkillTemplate,
  StackOption,
  TestingDepth,
  WizardState,
} from './types';

export const STORAGE_KEY = 'roadmap-generator-session-v1';

export const EXPERTISE_ORDER: ExpertiseLevel[] = ['novice', 'competent', 'polishing'];

export const EXPERTISE_PROFILES: Record<
  ExpertiseLevel,
  { label: string; summary: string; multiplier: number }
> = {
  novice: {
    label: 'Novice',
    summary: 'Learning from scratch and building confidence step by step.',
    multiplier: 1.45,
  },
  competent: {
    label: 'Competent',
    summary: 'Already shipped projects and now leveling up with structure.',
    multiplier: 1.05,
  },
  polishing: {
    label: 'Polishing Up',
    summary: 'Strengthening existing experience for advanced production skills.',
    multiplier: 0.78,
  },
};

export const GOAL_LABELS: Record<GoalType, { label: string; summary: string }> = {
  'job-ready': {
    label: 'Job Ready',
    summary: 'Prioritize portfolio-worthy breadth across the full stack.',
  },
  'project-builder': {
    label: 'Project Builder',
    summary: 'Ship practical applications quickly with focused tooling.',
  },
  'scale-architect': {
    label: 'Scale Architect',
    summary: 'Design for resilience, observability, and growth.',
  },
};

export const TESTING_DEPTH_LABELS: Record<TestingDepth, { label: string; summary: string }> = {
  starter: {
    label: 'Starter',
    summary: 'Unit tests and critical API checks.',
  },
  standard: {
    label: 'Standard',
    summary: 'Unit, integration, and E2E for key journeys.',
  },
  strict: {
    label: 'Strict',
    summary: 'Add contracts, load tests, and security checks.',
  },
};

export const FRONTEND_OPTIONS: StackOption[] = [
  {
    id: 'react',
    group: 'frontend',
    label: 'React',
    description: 'Flexible component architecture for modern web apps.',
    cch: 64,
    tags: ['Component model', 'Ecosystem depth'],
  },
  {
    id: 'nextjs',
    group: 'frontend',
    label: 'Next.js',
    description: 'Production-ready React framework with SSR, routing, and edge options.',
    cch: 74,
    minExpertise: 'competent',
    tags: ['SSR/SSG', 'Full-stack React'],
  },
  {
    id: 'vue',
    group: 'frontend',
    label: 'Vue',
    description: 'Progressive framework with approachable syntax and strong DX.',
    cch: 60,
    tags: ['Simple learning curve', 'Composition API'],
  },
  {
    id: 'angular',
    group: 'frontend',
    label: 'Angular',
    description: 'Opinionated TypeScript framework for large enterprise applications.',
    cch: 80,
    minExpertise: 'competent',
    tags: ['Enterprise patterns', 'Dependency injection'],
  },
];

export const BACKEND_OPTIONS: StackOption[] = [
  {
    id: 'node-express',
    group: 'backend',
    label: 'Node + Express',
    description: 'Fast path to API development with JavaScript/TypeScript.',
    cch: 56,
    tags: ['Simple setup', 'Huge package ecosystem'],
  },
  {
    id: 'node-nest',
    group: 'backend',
    label: 'Node + NestJS',
    description: 'Structured backend architecture for larger TypeScript services.',
    cch: 72,
    minExpertise: 'competent',
    tags: ['Modular architecture', 'Enterprise alignment'],
  },
  {
    id: 'python-django',
    group: 'backend',
    label: 'Python + Django',
    description: 'Batteries-included framework for full-featured server apps.',
    cch: 62,
    tags: ['Admin panel', 'Rapid development'],
  },
  {
    id: 'python-fastapi',
    group: 'backend',
    label: 'Python + FastAPI',
    description: 'High-performance async APIs with modern type hints.',
    cch: 64,
    minExpertise: 'competent',
    tags: ['Async I/O', 'Data and ML friendly'],
  },
  {
    id: 'java-spring',
    group: 'backend',
    label: 'Java + Spring Boot',
    description: 'Enterprise-grade backend platform for robust domain services.',
    cch: 86,
    minExpertise: 'polishing',
    tags: ['Enterprise standard', 'Strong ecosystem'],
  },
  {
    id: 'go-gin',
    group: 'backend',
    label: 'Go + Gin',
    description: 'Efficient low-latency APIs with straightforward deployment.',
    cch: 70,
    minExpertise: 'competent',
    tags: ['Performance', 'Cloud-native fit'],
  },
  {
    id: 'rust-axum',
    group: 'backend',
    label: 'Rust + Axum',
    description: 'Memory-safe high-performance services for advanced workloads.',
    cch: 92,
    minExpertise: 'polishing',
    tags: ['Safety', 'Max performance'],
  },
];

export const DATABASE_OPTIONS: StackOption[] = [
  {
    id: 'postgresql',
    group: 'database',
    label: 'PostgreSQL',
    description: 'Balanced default for relational workloads and complex queries.',
    cch: 44,
    tags: ['SQL standard', 'Production default'],
  },
  {
    id: 'mysql',
    group: 'database',
    label: 'MySQL',
    description: 'Reliable relational option with broad hosting support.',
    cch: 40,
    tags: ['Mature ecosystem', 'Operational familiarity'],
  },
  {
    id: 'mongodb',
    group: 'database',
    label: 'MongoDB',
    description: 'Document-oriented model that fits rapidly evolving schemas.',
    cch: 42,
    tags: ['Flexible schema', 'Developer velocity'],
  },
  {
    id: 'dynamodb',
    group: 'database',
    label: 'DynamoDB',
    description: 'Managed key-value/document store for cloud-scale throughput.',
    cch: 52,
    minExpertise: 'competent',
    tags: ['Serverless scale', 'Operational simplicity'],
  },
];

export const OPTION_GROUPS: Record<OptionGroup, StackOption[]> = {
  frontend: FRONTEND_OPTIONS,
  backend: BACKEND_OPTIONS,
  database: DATABASE_OPTIONS,
};

export const DEFAULT_WIZARD_STATE: WizardState = {
  expertise: null,
  goal: 'job-ready',
  frontendId: null,
  backendId: null,
  databaseId: null,
  weeklyHours: 8,
  includeRealtime: false,
  includeDevops: true,
  includeEnterprise: false,
  testingDepth: 'standard',
};

export const CORE_FOUNDATION_SKILLS: SkillTemplate[] = [
  {
    id: 'core-internet',
    title: 'Web Foundations and HTTP',
    explanation: 'Understand browser runtime, HTTP lifecycle, caching, and status design.',
    cch: 22,
    tier: 'core',
  },
  {
    id: 'core-git',
    title: 'Git Workflow and Collaboration',
    explanation: 'Feature branches, pull requests, rebasing discipline, and release tagging.',
    cch: 14,
    tier: 'core',
  },
  {
    id: 'core-typescript',
    title: 'TypeScript for Maintainability',
    explanation: 'Model data contracts and reduce integration bugs with strict typing.',
    cch: 20,
    tier: 'recommended',
  },
  {
    id: 'core-debugging',
    title: 'Debugging and Runtime Diagnostics',
    explanation: 'Trace bugs with logs, breakpoints, and actionable error handling.',
    cch: 16,
    tier: 'core',
  },
  {
    id: 'core-architecture',
    title: 'System Thinking and Tradeoffs',
    explanation: 'Break features into modules and choose patterns based on constraints.',
    cch: 18,
    tier: 'recommended',
  },
];

export const FRONTEND_SKILLS_BY_OPTION: Record<string, SkillTemplate[]> = {
  react: [
    {
      id: 'fe-react-components',
      title: 'Component Architecture in React',
      explanation: 'Build composable UI primitives with clear ownership and boundaries.',
      cch: 24,
      tier: 'core',
    },
    {
      id: 'fe-react-state',
      title: 'State and Async Data Flows',
      explanation: 'Coordinate local state, server state, and side effects safely.',
      cch: 22,
      tier: 'core',
    },
    {
      id: 'fe-react-perf',
      title: 'Performance and Rendering Strategy',
      explanation: 'Control re-renders, split bundles, and improve interaction latency.',
      cch: 18,
      tier: 'recommended',
    },
  ],
  nextjs: [
    {
      id: 'fe-next-routing',
      title: 'App Router and Rendering Modes',
      explanation: 'Use SSR, static generation, and route boundaries intentionally.',
      cch: 28,
      tier: 'core',
    },
    {
      id: 'fe-next-server',
      title: 'Server Components and Actions',
      explanation: 'Move logic to the server when it improves performance or security.',
      cch: 24,
      tier: 'recommended',
    },
    {
      id: 'fe-next-edge',
      title: 'Caching and Edge Delivery',
      explanation: 'Control cache behavior and optimize for global response times.',
      cch: 18,
      tier: 'advanced',
      minExpertise: 'competent',
    },
  ],
  vue: [
    {
      id: 'fe-vue-composition',
      title: 'Composition API and Reusability',
      explanation: 'Model feature logic in composables to keep components lean.',
      cch: 22,
      tier: 'core',
    },
    {
      id: 'fe-vue-routing',
      title: 'Routing and State Patterns',
      explanation: 'Handle route-driven UIs and scalable state structures.',
      cch: 18,
      tier: 'recommended',
    },
    {
      id: 'fe-vue-tooling',
      title: 'Build Tooling and Runtime Profiling',
      explanation: 'Tune build output and investigate rendering bottlenecks.',
      cch: 16,
      tier: 'recommended',
    },
  ],
  angular: [
    {
      id: 'fe-angular-modules',
      title: 'Angular Modules and Dependency Injection',
      explanation: 'Structure large applications with predictable module boundaries.',
      cch: 28,
      tier: 'core',
    },
    {
      id: 'fe-angular-rxjs',
      title: 'RxJS Streams and Reactive Architecture',
      explanation: 'Model async interactions using streams, operators, and cancellation.',
      cch: 24,
      tier: 'recommended',
    },
    {
      id: 'fe-angular-enterprise',
      title: 'Enterprise UI Governance',
      explanation: 'Adopt style guides, internal libraries, and release workflows.',
      cch: 20,
      tier: 'advanced',
      minExpertise: 'competent',
    },
  ],
};

export const BACKEND_SKILLS_BY_OPTION: Record<string, SkillTemplate[]> = {
  'node-express': [
    {
      id: 'be-express-routing',
      title: 'Routing, Middleware, and Validation',
      explanation: 'Build predictable request pipelines with schema-level validation.',
      cch: 24,
      tier: 'core',
    },
    {
      id: 'be-express-errors',
      title: 'Error Strategy and API Contracts',
      explanation: 'Define stable error payloads and resilient failure handling.',
      cch: 18,
      tier: 'recommended',
    },
    {
      id: 'be-express-scale',
      title: 'Service Layer and Folder Architecture',
      explanation: 'Prepare for maintainability before complexity grows.',
      cch: 16,
      tier: 'recommended',
    },
  ],
  'node-nest': [
    {
      id: 'be-nest-modules',
      title: 'Nest Modules and Providers',
      explanation: 'Use dependency injection and modularity for complex domains.',
      cch: 26,
      tier: 'core',
    },
    {
      id: 'be-nest-testing',
      title: 'Controller and Service Testing',
      explanation: 'Test modules in isolation and ensure contract stability.',
      cch: 20,
      tier: 'recommended',
    },
    {
      id: 'be-nest-architecture',
      title: 'Domain Boundaries for Teams',
      explanation: 'Organize bounded contexts and reduce coupling across services.',
      cch: 20,
      tier: 'advanced',
      minExpertise: 'competent',
    },
  ],
  'python-django': [
    {
      id: 'be-django-models',
      title: 'Models, ORM, and Admin',
      explanation: 'Use Django ORM and admin tooling for rapid backend delivery.',
      cch: 24,
      tier: 'core',
    },
    {
      id: 'be-django-rest',
      title: 'Django REST Framework',
      explanation: 'Design APIs with serializers, permissions, and throttling.',
      cch: 20,
      tier: 'recommended',
    },
    {
      id: 'be-django-jobs',
      title: 'Background Jobs and Scheduling',
      explanation: 'Move heavy work to asynchronous processing safely.',
      cch: 18,
      tier: 'recommended',
    },
  ],
  'python-fastapi': [
    {
      id: 'be-fastapi-routing',
      title: 'Typed Endpoints and Validation',
      explanation: 'Leverage type hints and schema generation for reliable APIs.',
      cch: 24,
      tier: 'core',
    },
    {
      id: 'be-fastapi-async',
      title: 'Async Patterns and Throughput',
      explanation: 'Write non-blocking handlers and optimize latency hotspots.',
      cch: 20,
      tier: 'recommended',
    },
    {
      id: 'be-fastapi-deploy',
      title: 'Operational Hardening',
      explanation: 'Tune workers, observability, and zero-downtime rollouts.',
      cch: 20,
      tier: 'advanced',
      minExpertise: 'competent',
    },
  ],
  'java-spring': [
    {
      id: 'be-spring-core',
      title: 'Spring Boot Domain Services',
      explanation: 'Model robust domain logic with strong boundaries and patterns.',
      cch: 30,
      tier: 'core',
    },
    {
      id: 'be-spring-data',
      title: 'Spring Data and Transaction Strategy',
      explanation: 'Control consistency and persistence behavior under load.',
      cch: 24,
      tier: 'recommended',
    },
    {
      id: 'be-spring-observability',
      title: 'Production Observability',
      explanation: 'Instrument metrics, traces, and health checks for operability.',
      cch: 22,
      tier: 'advanced',
      minExpertise: 'polishing',
    },
  ],
  'go-gin': [
    {
      id: 'be-go-http',
      title: 'Go HTTP Services and Concurrency',
      explanation: 'Build services with goroutines, channels, and efficient handlers.',
      cch: 28,
      tier: 'core',
    },
    {
      id: 'be-go-ops',
      title: 'Profiling and Runtime Tuning',
      explanation: 'Use profiling tools to optimize latency and memory behavior.',
      cch: 20,
      tier: 'recommended',
    },
    {
      id: 'be-go-contracts',
      title: 'Contract-Driven Service Boundaries',
      explanation: 'Create stable interfaces for internal and external consumers.',
      cch: 18,
      tier: 'recommended',
    },
  ],
  'rust-axum': [
    {
      id: 'be-rust-ownership',
      title: 'Ownership Model for Service Design',
      explanation: 'Use ownership and borrowing to build safe service logic.',
      cch: 34,
      tier: 'core',
    },
    {
      id: 'be-rust-async',
      title: 'Async Runtime and Throughput',
      explanation: 'Build non-blocking endpoints and control backpressure patterns.',
      cch: 24,
      tier: 'recommended',
    },
    {
      id: 'be-rust-prod',
      title: 'Production Hardening in Rust',
      explanation: 'Tune performance and deployment strategy for critical workloads.',
      cch: 22,
      tier: 'advanced',
      minExpertise: 'polishing',
    },
  ],
};

export const DATABASE_SKILLS_BY_OPTION: Record<string, SkillTemplate[]> = {
  postgresql: [
    {
      id: 'db-postgres-schema',
      title: 'Schema Design and Relational Modeling',
      explanation: 'Model data integrity with keys, constraints, and migrations.',
      cch: 20,
      tier: 'core',
    },
    {
      id: 'db-postgres-indexing',
      title: 'Indexing and Query Optimization',
      explanation: 'Read query plans and tune indexes for real workloads.',
      cch: 18,
      tier: 'recommended',
    },
  ],
  mysql: [
    {
      id: 'db-mysql-schema',
      title: 'Relational Modeling in MySQL',
      explanation: 'Build normalized schemas and safe migration workflows.',
      cch: 18,
      tier: 'core',
    },
    {
      id: 'db-mysql-ops',
      title: 'Replication and Operational Basics',
      explanation: 'Understand backups, replication, and availability strategy.',
      cch: 16,
      tier: 'recommended',
    },
  ],
  mongodb: [
    {
      id: 'db-mongo-model',
      title: 'Document Modeling and Aggregations',
      explanation: 'Design document structures that fit read/write patterns.',
      cch: 18,
      tier: 'core',
    },
    {
      id: 'db-mongo-indexing',
      title: 'Indexing Strategy and Query Performance',
      explanation: 'Use index design to keep flexible schemas scalable.',
      cch: 18,
      tier: 'recommended',
    },
  ],
  dynamodb: [
    {
      id: 'db-dynamo-partitions',
      title: 'Partition Keys and Access Patterns',
      explanation: 'Model data around query patterns to avoid hot partitions.',
      cch: 22,
      tier: 'core',
      minExpertise: 'competent',
    },
    {
      id: 'db-dynamo-scaling',
      title: 'Capacity Modes and Cost Governance',
      explanation: 'Balance throughput, latency, and spend across workloads.',
      cch: 18,
      tier: 'advanced',
      minExpertise: 'competent',
    },
  ],
};

export const API_AND_INTEGRATION_SKILLS: SkillTemplate[] = [
  {
    id: 'api-rest',
    title: 'REST API Design and Versioning',
    explanation: 'Model resources, idempotency, and version strategy cleanly.',
    cch: 22,
    tier: 'core',
  },
  {
    id: 'api-docs',
    title: 'OpenAPI and Contract Documentation',
    explanation: 'Keep APIs discoverable and aligned across teams.',
    cch: 14,
    tier: 'recommended',
  },
  {
    id: 'api-graphql',
    title: 'GraphQL for Client-Driven Data',
    explanation: 'Adopt GraphQL when frontend data shapes frequently evolve.',
    cch: 16,
    tier: 'advanced',
    minExpertise: 'competent',
  },
  {
    id: 'api-trpc',
    title: 'tRPC for End-to-End Type Safety',
    explanation: 'Use shared type contracts across frontend and backend services.',
    cch: 14,
    tier: 'recommended',
    minExpertise: 'competent',
  },
  {
    id: 'api-grpc',
    title: 'gRPC for Internal Service Communication',
    explanation: 'Apply schema-first RPC when internal throughput is critical.',
    cch: 18,
    tier: 'advanced',
    minExpertise: 'competent',
  },
];

export const REALTIME_SKILLS: SkillTemplate[] = [
  {
    id: 'realtime-websocket',
    title: 'WebSockets and Event Lifecycle',
    explanation: 'Handle bidirectional updates with robust connection management.',
    cch: 16,
    tier: 'recommended',
  },
  {
    id: 'realtime-broker',
    title: 'Message Broker Fundamentals',
    explanation: 'Queue asynchronous work to protect core request latency.',
    cch: 14,
    tier: 'recommended',
  },
];

export const ENTERPRISE_REALTIME_SKILLS: SkillTemplate[] = [
  {
    id: 'realtime-kafka',
    title: 'Kafka Event Streaming',
    explanation: 'Stream event data with partitioning and consumer-group design.',
    cch: 20,
    tier: 'advanced',
    minExpertise: 'competent',
  },
];

export const AUTH_SECURITY_SKILLS: SkillTemplate[] = [
  {
    id: 'auth-jwt',
    title: 'Authentication Flows and Token Strategy',
    explanation: 'Implement session, refresh, and token invalidation safely.',
    cch: 18,
    tier: 'core',
  },
  {
    id: 'auth-oidc',
    title: 'OAuth2 and OIDC Integration',
    explanation: 'Delegate identity with standards-based authorization patterns.',
    cch: 14,
    tier: 'recommended',
  },
  {
    id: 'auth-owasp',
    title: 'OWASP Top 10 Security Practices',
    explanation: 'Apply secure defaults across validation, auth, and storage.',
    cch: 18,
    tier: 'core',
  },
];

export const ENTERPRISE_AUTH_SKILLS: SkillTemplate[] = [
  {
    id: 'auth-keycloak',
    title: 'Enterprise IAM with Keycloak/Auth0',
    explanation: 'Centralize identity across multiple services and products.',
    cch: 16,
    tier: 'advanced',
    minExpertise: 'competent',
  },
];

export const DEVOPS_SKILLS: SkillTemplate[] = [
  {
    id: 'ops-cicd',
    title: 'CI/CD with GitHub Actions',
    explanation: 'Automate test, build, and deployment checks per commit.',
    cch: 16,
    tier: 'core',
  },
  {
    id: 'ops-docker',
    title: 'Containerization with Docker',
    explanation: 'Create reproducible builds and environment parity across stages.',
    cch: 18,
    tier: 'recommended',
  },
  {
    id: 'ops-cloud',
    title: 'Cloud Deployment Strategy',
    explanation: 'Choose runtime platform and rollout model based on workload.',
    cch: 16,
    tier: 'recommended',
  },
];

export const ENTERPRISE_DEVOPS_SKILLS: SkillTemplate[] = [
  {
    id: 'ops-terraform',
    title: 'Infrastructure as Code with Terraform',
    explanation: 'Track and evolve infrastructure changes through version control.',
    cch: 18,
    tier: 'advanced',
    minExpertise: 'competent',
  },
  {
    id: 'ops-k8s',
    title: 'Kubernetes Workload Orchestration',
    explanation: 'Scale services with health checks, autoscaling, and rollouts.',
    cch: 22,
    tier: 'advanced',
    minExpertise: 'competent',
  },
];

export const LIGHT_DEPLOYMENT_SKILLS: SkillTemplate[] = [
  {
    id: 'ops-light-hosting',
    title: 'Managed Hosting Deployment',
    explanation: 'Deploy quickly on managed platforms before deep DevOps investment.',
    cch: 10,
    tier: 'core',
  },
];

export const TESTING_SKILLS_BY_DEPTH: Record<TestingDepth, SkillTemplate[]> = {
  starter: [
    {
      id: 'test-unit',
      title: 'Unit Testing Basics',
      explanation: 'Protect core business logic with fast deterministic tests.',
      cch: 16,
      tier: 'core',
    },
    {
      id: 'test-api-smoke',
      title: 'API Smoke and Regression Checks',
      explanation: 'Validate critical endpoints on every release cycle.',
      cch: 12,
      tier: 'recommended',
    },
  ],
  standard: [
    {
      id: 'test-unit-standard',
      title: 'Unit and Integration Coverage',
      explanation: 'Verify behavior at module boundaries and data interfaces.',
      cch: 18,
      tier: 'core',
    },
    {
      id: 'test-e2e-standard',
      title: 'E2E Journeys with Playwright/Cypress',
      explanation: 'Protect user-critical flows from regression.',
      cch: 16,
      tier: 'recommended',
    },
    {
      id: 'test-api-standard',
      title: 'API Contract Validation',
      explanation: 'Keep clients and services aligned through interface tests.',
      cch: 14,
      tier: 'recommended',
    },
  ],
  strict: [
    {
      id: 'test-unit-strict',
      title: 'Comprehensive Unit and Integration Suite',
      explanation: 'Cover edge cases and cross-service behavior intentionally.',
      cch: 22,
      tier: 'core',
    },
    {
      id: 'test-e2e-strict',
      title: 'Critical Path E2E Automation',
      explanation: 'Automate production-like journeys and deployment gates.',
      cch: 18,
      tier: 'recommended',
    },
    {
      id: 'test-contract',
      title: 'Consumer-Driven Contracts',
      explanation: 'Detect integration breakage before deployment.',
      cch: 16,
      tier: 'advanced',
      minExpertise: 'competent',
    },
    {
      id: 'test-load-security',
      title: 'Load and Security Verification',
      explanation: 'Test failure thresholds and security assumptions proactively.',
      cch: 18,
      tier: 'advanced',
      minExpertise: 'competent',
    },
  ],
};

export const GOAL_SKILLS: Record<GoalType, SkillTemplate[]> = {
  'job-ready': [
    {
      id: 'goal-portfolio',
      title: 'Portfolio Project Storytelling',
      explanation: 'Present architecture, tradeoffs, and outcomes clearly.',
      cch: 12,
      tier: 'recommended',
    },
  ],
  'project-builder': [
    {
      id: 'goal-shipping',
      title: 'Rapid Delivery and Iteration',
      explanation: 'Define narrow milestones to ship product value quickly.',
      cch: 10,
      tier: 'recommended',
    },
  ],
  'scale-architect': [
    {
      id: 'goal-observability',
      title: 'Resilience and Incident Readiness',
      explanation: 'Design alerting, runbooks, and rollback procedures.',
      cch: 16,
      tier: 'advanced',
      minExpertise: 'competent',
    },
  ],
};
