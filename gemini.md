I'll analyze the project to provide a comprehensive overview. Let me examine the key files to understand the project better.

Let me check the main source files to understand the implementation better.

# Server Survival - Project Overview

## Project Overview
Server Survival is an educational 3D simulation game that teaches cloud architecture principles through interactive gameplay. Players act as Cloud Architects, building and managing cloud infrastructure to handle various types of traffic while defending against DDoS attacks and managing resources.

## Goal
Create an engaging, educational experience that helps players understand:
- Cloud infrastructure components and their interactions
- Load balancing and traffic management
- Security considerations in cloud architecture
- Resource allocation and cost management

## Core Features
1. **Interactive 3D Environment**
   - Real-time visualization of cloud infrastructure
   - Dynamic traffic flow visualization
   - Service health monitoring

2. **Gameplay Mechanics**
   - Multiple traffic types (STATIC, READ, WRITE, UPLOAD, SEARCH, MALICIOUS)
   - Service management (WAF, SQS, ALB, Compute, Cache, Database, S3)
   - Resource allocation and upgrades
   - Budget and reputation system

3. **Educational Components**
   - Real-time feedback on architectural decisions
   - Tutorial system
   - Sandbox mode for experimentation

4. **Scoring & Progression**
   - Economic system with costs and rewards
   - Reputation management
   - High score tracking

## Tech Stack
### Frontend
- **Framework**: React 18+ with TypeScript
- **3D Rendering**: Three.js via @react-three/fiber and @react-three/drei
- **State Management**: Built-in React state management
- **Build Tool**: Vite
- **Styling**: CSS Modules / Styled Components

### Development Tools
- TypeScript for type safety
- ESLint + Prettier for code quality
- GitHub Actions for CI/CD
- Vite for development server and builds

## Project Structure
```
server-survival/
├── src/
│   ├── components/       # Reusable UI components
│   ├── entities/         # Game entities and objects
│   ├── services/         # Business logic and API services
│   ├── state/            # State management
│   ├── styles/           # Global styles and themes
│   ├── types/            # TypeScript type definitions
│   ├── utils/            # Utility functions
│   ├── App.tsx           # Main application component
│   └── main.tsx          # Application entry point
├── public/               # Static assets
├── assets/               # Game assets (models, textures, etc.)
└── docs/                 # Documentation
```

## Critical Handling Rules
1. **Error Boundaries**
   - Implement React Error Boundaries to prevent game crashes
   - Graceful degradation for unsupported browsers/features

2. **Performance**
   - Maintain 60 FPS during gameplay
   - Implement level-of-detail (LOD) for 3D models
   - Optimize render cycles and state updates

3. **State Management**
   - Single source of truth for game state
   - Immutable state updates
   - Time-travel debugging support

4. **Security**
   - Input validation
   - XSS protection
   - Secure WebSocket connections (if applicable)

## Success Criteria
1. **Technical**
   - Zero critical bugs in production
   - < 3s initial load time
   - > 90% test coverage
   - Full TypeScript coverage

2. **User Experience**
   - Intuitive controls and UI
   - Clear feedback for player actions
   - Smooth performance across devices

3. **Educational Value**
   - Clear demonstration of cloud concepts
   - Progressive difficulty curve
   - Helpful tutorials and tooltips

4. **Performance**
   - Consistent 60 FPS on mid-range devices
   - Efficient memory usage
   - Fast level loading

5. **Accessibility**
   - WCAG 2.1 AA compliance
   - Keyboard navigation support
   - Screen reader compatibility

Would you like me to elaborate on any of these aspects or proceed with specific updates to the project?