"""
Comprehensive Tech & Skills Taxonomy covering 8 standard domains:
- Programming
- Technical Skills
- Frameworks
- Databases
- Cloud
- Tools
- Soft Skills
- Domain Skills
"""

from typing import Dict, List, Any, Optional

SKILL_CATEGORIES = [
    "Programming",
    "Technical Skills",
    "Frameworks",
    "Databases",
    "Cloud",
    "Tools",
    "Soft Skills",
    "Domain Skills"
]

SKILL_DEFINITIONS: Dict[str, Dict[str, Any]] = {
    # ==================== PROGRAMMING ====================
    "Python": {
        "category": "Programming",
        "aliases": ["python", "python3", "python 3", "py"],
        "importance": "Critical",
        "why_it_matters": "Core foundational language widely used for backend services, AI/ML pipelines, scripting, and data processing.",
        "suggested_learning_topic": "Asynchronous Python (asyncio), Type Hinting, Clean Architecture, and FastAPI/Django",
        "equivalents": ["Python 3", "Python2"]
    },
    "JavaScript": {
        "category": "Programming",
        "aliases": ["javascript", "js", "ecmascript", "es6", "es2020", "vanilla js"],
        "importance": "Critical",
        "why_it_matters": "Universal language of the web, powering frontend UI and Node.js backend runtimes.",
        "suggested_learning_topic": "Modern ES6+ syntax, Closures, Event Loop, Promises & Async/Await",
        "equivalents": ["TypeScript", "Node.js"]
    },
    "TypeScript": {
        "category": "Programming",
        "aliases": ["typescript", "ts"],
        "importance": "Critical",
        "why_it_matters": "Provides static type safety, reducing runtime errors and significantly improving maintainability in enterprise scale codebases.",
        "suggested_learning_topic": "Advanced Generics, Conditional Types, Type Narrowing, and Strict Mode configs",
        "equivalents": ["JavaScript"]
    },
    "Java": {
        "category": "Programming",
        "aliases": ["java", "core java", "java 8", "java 11", "java 17", "java 21"],
        "importance": "Critical",
        "why_it_matters": "Standard enterprise backend language with robust concurrency models and high-throughput virtual machines.",
        "suggested_learning_topic": "Spring Boot 3, Java Virtual Machine (JVM) tuning, Streams API, and Concurrency",
        "equivalents": ["Kotlin", "Scala", "C#"]
    },
    "Go": {
        "category": "Programming",
        "aliases": ["golang", "go"],
        "importance": "High",
        "why_it_matters": "Exceptional concurrency model via Goroutines and low footprint make it ideal for microservices and cloud infrastructure.",
        "suggested_learning_topic": "Goroutines, Channels, Context management, and building REST/gRPC microservices in Go",
        "equivalents": ["Rust", "C++"]
    },
    "Rust": {
        "category": "Programming",
        "aliases": ["rust", "rustlang"],
        "importance": "High",
        "why_it_matters": "Memory-safe systems programming language offering C/C++ performance without garbage collection pauses.",
        "suggested_learning_topic": "Borrow checker, Ownership model, Lifetimes, and Tokio async runtime",
        "equivalents": ["C++", "Go"]
    },
    "C++": {
        "category": "Programming",
        "aliases": ["c++", "cpp", "c/c++"],
        "importance": "High",
        "why_it_matters": "Crucial for performance-critical systems, computer vision, game engines, and low-latency financial systems.",
        "suggested_learning_topic": "Modern C++ (C++20), RAII, Smart Pointers, Template Metaprogramming, and STL algorithms",
        "equivalents": ["C", "Rust"]
    },
    "C#": {
        "category": "Programming",
        "aliases": ["c#", "csharp", ".net", "dotnet"],
        "importance": "High",
        "why_it_matters": "Powerhouse language for enterprise web applications, desktop apps, and Azure cloud infrastructure.",
        "suggested_learning_topic": ".NET 8 Web APIs, Entity Framework Core, Dependency Injection, and LINQ",
        "equivalents": ["Java"]
    },
    "SQL": {
        "category": "Programming",
        "aliases": ["sql", "structured query language", "tsql", "plsql"],
        "importance": "Critical",
        "why_it_matters": "Standard declarative language for querying, transforming, and managing relational data stores.",
        "suggested_learning_topic": "Window Functions, Common Table Expressions (CTEs), Index Optimization, and Query Execution Plans",
        "equivalents": ["PostgreSQL", "MySQL"]
    },
    "PHP": {
        "category": "Programming",
        "aliases": ["php", "php8"],
        "importance": "Medium",
        "why_it_matters": "Powers a significant portion of web backends and content management systems globally.",
        "suggested_learning_topic": "Modern PHP 8.x attributes, Composer, Laravel or Symfony architecture",
        "equivalents": []
    },
    "Ruby": {
        "category": "Programming",
        "aliases": ["ruby", "ruby on rails", "rails"],
        "importance": "Medium",
        "why_it_matters": "Prioritizes developer happiness and rapid prototype delivery through convention over configuration.",
        "suggested_learning_topic": "Ruby meta-programming, Active Record patterns, and Rails API mode",
        "equivalents": []
    },
    "Kotlin": {
        "category": "Programming",
        "aliases": ["kotlin"],
        "importance": "High",
        "why_it_matters": "First-class language for Android development and modern alternative to Java on the JVM.",
        "suggested_learning_topic": "Kotlin Coroutines, Flow API, Jetpack Compose, and Ktor",
        "equivalents": ["Java"]
    },
    "Swift": {
        "category": "Programming",
        "aliases": ["swift", "swiftui"],
        "importance": "High",
        "why_it_matters": "Native language for iOS, iPadOS, macOS, and watchOS software development.",
        "suggested_learning_topic": "SwiftUI architecture, Swift Concurrency (async/await, Actors), and Combine",
        "equivalents": []
    },

    # ==================== FRAMEWORKS & LIBRARIES ====================
    "React": {
        "category": "Frameworks",
        "aliases": ["react", "react.js", "reactjs"],
        "importance": "Critical",
        "why_it_matters": "Dominant library for building declarative, modular, high-performance web user interfaces.",
        "suggested_learning_topic": "Hooks (useMemo, useCallback), Custom Hooks, React 19 Actions, and State Management",
        "equivalents": ["Next.js", "Vue", "Angular"]
    },
    "Next.js": {
        "category": "Frameworks",
        "aliases": ["next.js", "nextjs", "next"],
        "importance": "High",
        "why_it_matters": "Industry standard full-stack React framework enabling Server-Side Rendering (SSR) and Server Components.",
        "suggested_learning_topic": "Next.js App Router, React Server Components (RSC), Server Actions, and Edge Middleware",
        "equivalents": ["React", "Remix"]
    },
    "Vue.js": {
        "category": "Frameworks",
        "aliases": ["vue", "vue.js", "vuejs", "vue 3"],
        "importance": "High",
        "why_it_matters": "Progressive, lightweight front-end framework featuring reactivity and an intuitive Single File Component design.",
        "suggested_learning_topic": "Vue 3 Composition API, Pinia state management, and Nuxt 3",
        "equivalents": ["React", "Angular"]
    },
    "Angular": {
        "category": "Frameworks",
        "aliases": ["angular", "angularjs", "angular 2+"],
        "importance": "High",
        "why_it_matters": "Comprehensive, battery-included enterprise frontend framework with built-in dependency injection and routing.",
        "suggested_learning_topic": "Angular Signals, Standalone Components, RxJS Observables, and Dependency Injection",
        "equivalents": ["React", "Vue.js"]
    },
    "FastAPI": {
        "category": "Frameworks",
        "aliases": ["fastapi", "fast api"],
        "importance": "Critical",
        "why_it_matters": "Modern, high-performance Python framework for building REST APIs with automatic OpenAPI docs and Pydantic validation.",
        "suggested_learning_topic": "Asynchronous route handlers, Dependency Injection, Pydantic v2 serialization, and JWT security",
        "equivalents": ["Django REST Framework", "Flask", "Express.js"]
    },
    "Django": {
        "category": "Frameworks",
        "aliases": ["django", "django rest framework", "drf"],
        "importance": "High",
        "why_it_matters": "Robust, high-level Python web framework encouraging rapid development and clean, pragmatic design.",
        "suggested_learning_topic": "Django ORM query optimization, Django REST Framework, Signals, and Celery async workers",
        "equivalents": ["FastAPI", "Flask"]
    },
    "Spring Boot": {
        "category": "Frameworks",
        "aliases": ["spring boot", "spring", "spring framework", "spring-boot"],
        "importance": "Critical",
        "why_it_matters": "Standard enterprise Java framework offering microservice scaffolding, security, and transaction management.",
        "suggested_learning_topic": "Spring Security 6, Spring Data JPA, Spring Cloud Microservices, and Actuator metrics",
        "equivalents": ["Micronaut", "Quarkus"]
    },
    "Node.js": {
        "category": "Frameworks",
        "aliases": ["node.js", "nodejs", "node"],
        "importance": "Critical",
        "why_it_matters": "Enables JavaScript execution server-side, powering scalable asynchronous network applications.",
        "suggested_learning_topic": "Event-driven architecture, Node.js Streams, Worker Threads, and Cluster module",
        "equivalents": ["Express.js", "NestJS"]
    },
    "Express.js": {
        "category": "Frameworks",
        "aliases": ["express", "express.js", "expressjs"],
        "importance": "High",
        "why_it_matters": "Minimalist, unopinionated web framework for Node.js commonly used for REST microservices.",
        "suggested_learning_topic": "Middleware chaining, routing architecture, error-handling middleware, and authentication",
        "equivalents": ["Fastify", "NestJS"]
    },
    "NestJS": {
        "category": "Frameworks",
        "aliases": ["nestjs", "nest.js"],
        "importance": "High",
        "why_it_matters": "Opinionated enterprise TypeScript framework built on top of Express/Fastify using modular architecture.",
        "suggested_learning_topic": "Dependency Injection, Guards, Interceptors, Pipes, and Microservice transports",
        "equivalents": ["Spring Boot", "Express.js"]
    },
    "Tailwind CSS": {
        "category": "Frameworks",
        "aliases": ["tailwind", "tailwind css", "tailwindcss"],
        "importance": "High",
        "why_it_matters": "Utility-first CSS framework enabling rapid, consistent, and responsive UI styling directly in markup.",
        "suggested_learning_topic": "Responsive breakpoints, Custom plugins, JIT engine, and Dark Mode theming",
        "equivalents": ["Bootstrap", "Material UI"]
    },

    # ==================== DATABASES ====================
    "PostgreSQL": {
        "category": "Databases",
        "aliases": ["postgresql", "postgres", "psql"],
        "importance": "Critical",
        "why_it_matters": "Leading open-source relational database renowned for reliability, SQL standard compliance, and JSON/ACID support.",
        "suggested_learning_topic": "B-Tree vs GIN Indexing, JSONB querying, Partitioning, and EXPLAIN ANALYZE tuning",
        "equivalents": ["MySQL", "SQL Server"]
    },
    "MySQL": {
        "category": "Databases",
        "aliases": ["mysql", "mariadb"],
        "importance": "High",
        "why_it_matters": "Widely deployed open-source relational database powering millions of web applications.",
        "suggested_learning_topic": "InnoDB engine internals, Replication, Query optimization, and Indexing strategies",
        "equivalents": ["PostgreSQL"]
    },
    "MongoDB": {
        "category": "Databases",
        "aliases": ["mongodb", "mongo"],
        "importance": "High",
        "why_it_matters": "Leading document-oriented NoSQL database designed for flexible schemas and horizontal scalability.",
        "suggested_learning_topic": "Aggregation Framework, Indexing strategies, Sharding, and Schema validation",
        "equivalents": ["DynamoDB", "Couchbase"]
    },
    "Redis": {
        "category": "Databases",
        "aliases": ["redis", "redis cache"],
        "importance": "Critical",
        "why_it_matters": "In-memory key-value data structure store used as a database, cache, message broker, and rate limiter.",
        "suggested_learning_topic": "Pub/Sub, Redis Streams, Cache Invalidation strategies, and Distributed Locking with Redlock",
        "equivalents": ["Memcached"]
    },
    "Elasticsearch": {
        "category": "Databases",
        "aliases": ["elasticsearch", "elastic search", "opensearch"],
        "importance": "High",
        "why_it_matters": "Distributed search and analytics engine for full-text search, logging, and metrics aggregation.",
        "suggested_learning_topic": "Inverted index concepts, Analyzers & Tokenizers, Query DSL, and Cluster sizing",
        "equivalents": ["OpenSearch", "Solr"]
    },
    "DynamoDB": {
        "category": "Databases",
        "aliases": ["dynamodb", "dynamo"],
        "importance": "High",
        "why_it_matters": "Fully managed NoSQL database service from AWS offering single-digit millisecond latency at any scale.",
        "suggested_learning_topic": "Single-table design, Partition and Sort keys, Global Secondary Indexes (GSIs)",
        "equivalents": ["MongoDB", "Cassandra"]
    },
    "SQLAlchemy": {
        "category": "Databases",
        "aliases": ["sqlalchemy", "sql-alchemy"],
        "importance": "High",
        "why_it_matters": "The Python SQL toolkit and Object Relational Mapper that provides a full suite of enterprise-level persistence patterns.",
        "suggested_learning_topic": "Async sessions, relationship lazy/eager loading (joinedload/selectinload), and Core queries",
        "equivalents": ["Prisma", "TypeORM", "Hibernate"]
    },

    # ==================== CLOUD & DEVOPS ====================
    "AWS": {
        "category": "Cloud",
        "aliases": ["aws", "amazon web services", "ec2", "s3", "lambda", "ecs", "eks"],
        "importance": "Critical",
        "why_it_matters": "Dominant cloud platform hosting millions of workloads across serverless, containers, and compute.",
        "suggested_learning_topic": "IAM best practices, S3, ECS/EKS containerization, Lambda serverless, and CloudWatch",
        "equivalents": ["GCP", "Azure"]
    },
    "Google Cloud Platform": {
        "category": "Cloud",
        "aliases": ["gcp", "google cloud", "google cloud platform", "bigquery", "cloud run"],
        "importance": "High",
        "why_it_matters": "Major cloud provider with industry-leading strengths in Kubernetes, Big Data, and AI/ML services.",
        "suggested_learning_topic": "Cloud Run, Google Kubernetes Engine (GKE), BigQuery, and Cloud IAM",
        "equivalents": ["AWS", "Azure"]
    },
    "Azure": {
        "category": "Cloud",
        "aliases": ["azure", "microsoft azure"],
        "importance": "High",
        "why_it_matters": "Premier cloud provider for enterprise workloads, Microsoft ecosystem integration, and OpenAI services.",
        "suggested_learning_topic": "Azure App Services, AKS, Azure Functions, and Entra ID (Azure AD)",
        "equivalents": ["AWS", "GCP"]
    },
    "Docker": {
        "category": "Cloud",
        "aliases": ["docker", "containerization", "docker-compose", "dockerfile"],
        "importance": "Critical",
        "why_it_matters": "Industry standard for packaging applications with all dependencies into reproducible, portable containers.",
        "suggested_learning_topic": "Multi-stage builds, Image size minimization, Docker Compose networking, and security scanning",
        "equivalents": ["Podman", "Kubernetes"]
    },
    "Kubernetes": {
        "category": "Cloud",
        "aliases": ["kubernetes", "k8s"],
        "importance": "Critical",
        "why_it_matters": "Defacto container orchestration platform automating deployment, scaling, and operations of container clusters.",
        "suggested_learning_topic": "Pods, Deployments, Services, Ingress controllers, Helm charts, and HPA autoscaling",
        "equivalents": ["Docker Swarm", "ECS"]
    },
    "Terraform": {
        "category": "Cloud",
        "aliases": ["terraform", "iac", "infrastructure as code"],
        "importance": "High",
        "why_it_matters": "Declarative Infrastructure as Code (IaC) tool enabling reproducible provisioning across multi-cloud environments.",
        "suggested_learning_topic": "State management, Reusable modules, Workspaces, and Provider configuration",
        "equivalents": ["Pulumi", "AWS CloudFormation"]
    },
    "CI/CD": {
        "category": "Cloud",
        "aliases": ["ci/cd", "ci cd", "continuous integration", "github actions", "gitlab ci", "jenkins"],
        "importance": "Critical",
        "why_it_matters": "Automates testing, linting, building, and deployment pipelines, ensuring fast and safe production releases.",
        "suggested_learning_topic": "GitHub Actions workflows, Secrets management, Caching build dependencies, and Canary releases",
        "equivalents": ["GitHub Actions", "Jenkins"]
    },

    # ==================== TOOLS ====================
    "Git": {
        "category": "Tools",
        "aliases": ["git", "github", "gitlab", "bitbucket", "version control"],
        "importance": "Critical",
        "why_it_matters": "Universal distributed version control system indispensable for collaborative software engineering.",
        "suggested_learning_topic": "Interactive rebase, Cherry-picking, Branching strategies (GitFlow/Trunk-based), and Merge conflict resolution",
        "equivalents": ["GitHub", "GitLab"]
    },
    "Linux": {
        "category": "Tools",
        "aliases": ["linux", "unix", "bash", "shell scripting", "ubuntu"],
        "importance": "Critical",
        "why_it_matters": "Dominant operating system powering modern cloud servers, containers, and deployment infrastructure.",
        "suggested_learning_topic": "Bash scripting, Process management (systemd, ps), File permissions, and Network utilities (curl, netstat)",
        "equivalents": ["Unix"]
    },
    "Postman": {
        "category": "Tools",
        "aliases": ["postman", "insomnia", "api testing"],
        "importance": "Medium",
        "why_it_matters": "Widely used platform for building, testing, documenting, and mocking REST & GraphQL APIs.",
        "suggested_learning_topic": "Automated collection testing, Environment variables, Newman CLI integration",
        "equivalents": ["Insomnia", "Swagger"]
    },
    "Jira": {
        "category": "Tools",
        "aliases": ["jira", "confluence", "agile tools", "linear"],
        "importance": "Medium",
        "why_it_matters": "Project and issue tracking software standard across Scrum and Kanban agile teams.",
        "suggested_learning_topic": "Backlog grooming, Sprint planning, Epic/Story point breakdown, and Release tracking",
        "equivalents": ["Linear", "Trello", "Asana"]
    },

    # ==================== TECHNICAL SKILLS ====================
    "REST APIs": {
        "category": "Technical Skills",
        "aliases": ["rest", "restful", "rest api", "rest apis", "restful api"],
        "importance": "Critical",
        "why_it_matters": "Foundational architectural style for networked hypermedia systems powering modern web service communications.",
        "suggested_learning_topic": "HTTP Status codes, Idempotency, Resource naming conventions, Pagination, and Rate limiting",
        "equivalents": ["GraphQL", "gRPC"]
    },
    "GraphQL": {
        "category": "Technical Skills",
        "aliases": ["graphql", "apollo", "apollo client"],
        "importance": "High",
        "why_it_matters": "Query language for APIs enabling clients to request exactly the data they need, solving over-fetching.",
        "suggested_learning_topic": "Schema definition (SDL), Resolvers, DataLoader N+1 prevention, and Mutations",
        "equivalents": ["REST APIs"]
    },
    "Microservices": {
        "category": "Technical Skills",
        "aliases": ["microservices", "microservice architecture", "distributed systems"],
        "importance": "Critical",
        "why_it_matters": "Architectural approach organizing applications as a collection of independently deployable, loosely coupled services.",
        "suggested_learning_topic": "Domain-Driven Design (DDD), Event-Driven architecture, Saga pattern, and Service discovery",
        "equivalents": ["Monolith"]
    },
    "Unit Testing": {
        "category": "Technical Skills",
        "aliases": ["unit testing", "test driven development", "tdd", "jest", "pytest", "junit"],
        "importance": "Critical",
        "why_it_matters": "Guarantees code reliability, facilitates safe refactoring, and documents individual software component behaviors.",
        "suggested_learning_topic": "Mocking & stubbing, Code coverage metrics, Pytest fixtures or Jest test runners",
        "equivalents": ["Pytest", "Jest", "TDD"]
    },
    "System Design": {
        "category": "Technical Skills",
        "aliases": ["system design", "software architecture", "high level design", "scalability"],
        "importance": "Critical",
        "why_it_matters": "Ability to architect highly scalable, fault-tolerant, resilient, and cost-effective distributed software systems.",
        "suggested_learning_topic": "Load balancing, Caching tiers, Database sharding, CAP theorem, and Eventual consistency",
        "equivalents": ["Software Architecture"]
    },
    "Data Structures & Algorithms": {
        "category": "Technical Skills",
        "aliases": ["data structures", "algorithms", "dsa"],
        "importance": "High",
        "why_it_matters": "Fundamental computer science building blocks for writing computationally efficient code with optimal space and time complexities.",
        "suggested_learning_topic": "Big-O analysis, Hash tables, Binary search trees, Graphs, and Dynamic programming",
        "equivalents": ["Algorithms"]
    },
    "Machine Learning": {
        "category": "Technical Skills",
        "aliases": ["machine learning", "ml", "deep learning", "nlp", "llm", "ai", "artificial intelligence", "pytorch", "tensorflow"],
        "importance": "High",
        "why_it_matters": "Powers automated intelligence, recommendations, predictions, and generative language applications.",
        "suggested_learning_topic": "LLM fine-tuning, RAG (Retrieval-Augmented Generation), Prompt Engineering, and PyTorch",
        "equivalents": ["Artificial Intelligence"]
    },

    # ==================== SOFT SKILLS ====================
    "Communication": {
        "category": "Soft Skills",
        "aliases": ["communication", "written communication", "verbal communication", "presentation skills"],
        "importance": "Critical",
        "why_it_matters": "Vital for cross-functional alignment, expressing technical tradeoffs clearly to stakeholders, and team cohesion.",
        "suggested_learning_topic": "Technical writing, Writing Architecture Decision Records (ADRs), and Executive summaries",
        "equivalents": ["Interpersonal Skills"]
    },
    "Team Leadership": {
        "category": "Soft Skills",
        "aliases": ["leadership", "team leadership", "mentorship", "mentoring", "tech lead"],
        "importance": "High",
        "why_it_matters": "Empowers junior and mid-level engineers, drives engineering culture, and unblocks team delivery milestones.",
        "suggested_learning_topic": "Conducting constructive code reviews, Pair programming, 1-on-1 coaching, and Technical roadmap planning",
        "equivalents": ["Mentorship"]
    },
    "Problem Solving": {
        "category": "Soft Skills",
        "aliases": ["problem solving", "analytical thinking", "critical thinking", "troubleshooting"],
        "importance": "Critical",
        "why_it_matters": "Core trait distinguishing top engineers: decomposing complex, ambiguous problems into solvable milestones.",
        "suggested_learning_topic": "Root cause analysis (5 Whys), Post-mortem incident analysis, and First-principles thinking",
        "equivalents": ["Critical Thinking"]
    },
    "Agile / Scrum": {
        "category": "Soft Skills",
        "aliases": ["agile", "scrum", "kanban", "sprint", "retrospectives"],
        "importance": "High",
        "why_it_matters": "Framework enabling iterative delivery, rapid feedback loops, and customer-aligned software development.",
        "suggested_learning_topic": "Scrum ceremonies, Story estimation, Kanban WIP limits, and Continuous retrospective improvements",
        "equivalents": ["Agile"]
    },

    # ==================== DOMAIN SKILLS ====================
    "Security & Auth": {
        "category": "Domain Skills",
        "aliases": ["security", "cybersecurity", "oauth", "jwt", "oauth2", "sso", "authentication", "authorization"],
        "importance": "Critical",
        "why_it_matters": "Protects user data, prevents catastrophic breaches, and ensures regulatory and compliance standards (SOC2, GDPR).",
        "suggested_learning_topic": "OWASP Top 10 vulnerabilities, OAuth 2.0 / OpenID Connect, RBAC authorization, and Encryption at rest/transit",
        "equivalents": ["Cybersecurity", "OAuth"]
    },
    "DevOps": {
        "category": "Domain Skills",
        "aliases": ["devops", "site reliability engineering", "sre", "monitoring", "observability", "prometheus", "grafana"],
        "importance": "High",
        "why_it_matters": "Bridges software engineering and system operations to maintain 99.99% uptime and rapid automated deployment cycles.",
        "suggested_learning_topic": "OpenTelemetry observability, Prometheus alerting metrics, SLO/SLA budgeting, and Incident response",
        "equivalents": ["SRE"]
    },
    "E-Commerce / FinTech": {
        "category": "Domain Skills",
        "aliases": ["fintech", "payments", "stripe", "banking", "e-commerce", "checkout"],
        "importance": "Medium",
        "why_it_matters": "Specialized domain requiring transaction idempotency, ledger consistency, and strict PCI-DSS compliance.",
        "suggested_learning_topic": "Payment processing lifecycles, Double-entry bookkeeping, and Distributed transactions",
        "equivalents": ["Payments"]
    }
}

def get_skill_info(skill_name: str) -> Optional[Dict[str, Any]]:
    """Lookup skill definition by canonical name or alias."""
    name_lower = skill_name.strip().lower()
    for canonical, defn in SKILL_DEFINITIONS.items():
        if canonical.lower() == name_lower:
            return {**defn, "canonical_name": canonical}
        for alias in defn.get("aliases", []):
            if alias.lower() == name_lower:
                return {**defn, "canonical_name": canonical}
    return None

def find_skills_in_text(text: str) -> Dict[str, List[str]]:
    """
    Scans text against the comprehensive taxonomy.
    Returns detected skills categorized by domain.
    """
    text_lower = f" {text.lower()} "
    detected: Dict[str, List[str]] = {cat: [] for cat in SKILL_CATEGORIES}
    seen_canonical = set()

    import re
    for canonical, defn in SKILL_DEFINITIONS.items():
        if canonical in seen_canonical:
            continue

        matched = False
        # Match canonical
        pat = r'(?<![a-zA-Z0-9#+])' + re.escape(canonical.lower()) + r'(?![a-zA-Z0-9#+])'
        if re.search(pat, text_lower):
            matched = True
        else:
            # Match aliases
            for alias in defn.get("aliases", []):
                pat_alias = r'(?<![a-zA-Z0-9#+])' + re.escape(alias.lower()) + r'(?![a-zA-Z0-9#+])'
                if re.search(pat_alias, text_lower):
                    matched = True
                    break

        if matched:
            seen_canonical.add(canonical)
            cat = defn.get("category", "Technical Skills")
            if cat not in detected:
                detected[cat] = []
            detected[cat].append(canonical)

    return detected
