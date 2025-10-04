# AetherScore Repository Structure

```mermaid
graph TB
    subgraph "Root Configuration"
        A[package.json] --> B[vite.config.ts]
        A --> C[tsconfig.json]
        A --> D[postcss.config.js]
        E[index.html] --> F[index.tsx]
        G[index.local.html]
        H[metadata.json]
        I[DEVELOPMENT.md]
        J[README.md]
        K[ROADMAP.md]
    end

    subgraph "Application Entry"
        F --> L[App.tsx]
    end

    subgraph "Pages"
        L --> M[pages/DashboardPage.tsx]
        L --> N[pages/CapsulePage.tsx]
    end

    subgraph "Components"
        M --> O[components/Header.tsx]
        M --> P[components/CreateCapsuleModal.tsx]
        N --> Q[components/PartEditor.tsx]
        N --> O
    end

    subgraph "State Management"
        M --> R[stores/useCapsuleStore.ts]
        N --> R
        P --> R
        Q --> R
    end

    subgraph "Utilities"
        R --> S[utils/capsuleManager.ts]
        S --> T[types/index.ts]
    end

    subgraph "Styling"
        F --> U[src/index.css]
    end

    subgraph "Dependencies"
        V[React 18.3.1]
        W[React Router DOM 6.23.1]
        X[Zustand 4.5.2]
        Y[abcjs 6.2.2]
        Z[Framer Motion 11.2.10]
        AA[Tailwind CSS 4.1.14]
        AB[Vite 7.1.9]
    end

    style A fill:#e1f5ff
    style L fill:#ffe1f5
    style M fill:#fff5e1
    style N fill:#fff5e1
    style R fill:#e1ffe1
    style S fill:#f5e1ff
