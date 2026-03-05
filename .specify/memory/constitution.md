<!--
SYNC IMPACT REPORT
==================
Version change: 0.0.0 → 1.0.0 (MAJOR - Initial constitution)
Modified principles: None (initial creation)
Added sections:
  - Core Principles (10 principles)
  - Design & UX Standards
  - Development Workflow
  - Governance
Removed sections: None (initial creation)
Templates requiring updates:
  - .specify/templates/plan-template.md ✅ No changes needed (generic)
  - .specify/templates/spec-template.md ✅ No changes needed (generic)
  - .specify/templates/tasks-template.md ✅ No changes needed (generic)
Follow-up TODOs: None
-->

# Portfolio Rafay Constitution

## Core Principles

### I. Full-Stack Production-Ready Architecture
Every component MUST be production-grade from day one. The portfolio demonstrates
professional capabilities, so all code MUST follow industry best practices including
proper error handling, input validation, secure authentication, and scalable
patterns. No prototype or demo-quality code is acceptable.

**Rationale**: This portfolio serves as proof of professional development skills.

### II. CLI-Powered Rapid Development
All development workflows MUST leverage CLI tools for efficiency. Project
scaffolding, builds, deployments, and database migrations MUST be automatable
via command-line interfaces. This demonstrates modern developer productivity
skills and enables rapid iteration.

**Rationale**: CLI proficiency signals professional developer workflow mastery.

### III. Futuristic Neon-Glassmorphism UI
The visual design MUST use a white base (#FFFFFF) with neon pink (#FF00CC) and
neon purple (#7B00FF) accents combined with glassmorphism effects (blur,
transparency, subtle shadows). All UI components MUST adhere to this color
scheme and glassmorphic aesthetic consistently.

**Rationale**: Distinctive visual identity creates memorable first impressions.

### IV. 3D Carousel for Featured Projects
The homepage MUST feature a 3D carousel displaying only projects marked as
"featured". The carousel MUST provide smooth animations, depth effects, and
interactive navigation. Non-featured projects are excluded from this view.

**Rationale**: Curated showcase highlights best work without overwhelming visitors.

### V. Dual-Layer Project Display
Project pages MUST display featured projects in a top carousel, followed by a
grid layout showing all projects below. This ensures featured work receives
premium placement while maintaining access to the complete portfolio.

**Rationale**: Hierarchical presentation balances curation with comprehensiveness.

### VI. Interactive Services with WhatsApp CTA
Services MUST be presented as interactive cards with hover effects and
animations. Each service card MUST include a call-to-action that opens a
pre-filled WhatsApp message for immediate client engagement.

**Rationale**: Reduces friction for potential clients to initiate contact.

### VII. Admin Panel with Full CRUD
An authenticated admin panel MUST provide complete CRUD operations for:
Projects (title, description, images, links, featured toggle), Services
(name, description, pricing, icon), and Images (upload, delete, organize).
Featured status MUST be toggleable per project.

**Rationale**: Enables non-technical content management without code changes.

### VIII. Mobile-First Responsive Design
All layouts MUST be designed mobile-first, then progressively enhanced for
tablet and desktop viewports. Breakpoints MUST follow standard conventions
(320px, 768px, 1024px, 1440px). Touch targets MUST meet accessibility
standards (minimum 44x44px).

**Rationale**: Majority of traffic originates from mobile devices.

### IX. Smooth Animations with Framer Motion
All user interactions MUST include smooth animations powered by Framer Motion.
Page transitions, hover states, scroll effects, and micro-interactions MUST
feel fluid and responsive. Animation duration MUST stay between 150-400ms
for optimal perceived performance.

**Rationale**: Polished animations signal attention to detail and modern skills.

### X. Credential Security & Prompting
All API keys, database credentials, and secrets MUST be managed via environment
variables. The system MUST prompt users for required credentials during setup
with clear explanations of each credential's purpose and acquisition steps.
No credentials MAY be hardcoded or committed to version control.

**Rationale**: Security best practices prevent credential leaks and enable team collaboration.

## Design & UX Standards

**Color Palette**:
- Primary Background: #FFFFFF (White)
- Accent 1: #FF00CC (Neon Pink)
- Accent 2: #7B00FF (Neon Purple)
- Glassmorphism: rgba(255, 255, 255, 0.1) with backdrop-filter: blur(10px)

**Typography**: Modern sans-serif (Inter, Poppins, or similar)
**Spacing**: 8px grid system for consistent margins/padding
**Border Radius**: 12-24px for glassmorphic cards
**Shadows**: Soft, multi-layer shadows for depth perception

## Development Workflow

**Branch Naming**: `<issue-number>-<feature-name>` (e.g., `001-homepage-carousel`)
**Commit Messages**: Conventional Commits format (feat:, fix:, docs:, chore:)
**Code Reviews**: All changes require review before merge
**Testing**: Critical paths MUST have tests; UI components tested via Playwright/Cypress
**Build Pipeline**: Automated linting, type-checking, and build validation on PR

## Governance

This constitution supersedes all other development practices for this project.
Amendments require:
1. Proposed change with rationale
2. Impact assessment on existing features
3. Version bump according to semantic versioning
4. Documentation in SYNC IMPACT REPORT comment at top of this file

**Versioning Policy**:
- MAJOR: Backward-incompatible principle changes or removals
- MINOR: New principles or material expansions
- PATCH: Clarifications, wording improvements, typo fixes

**Compliance Review**: All PRs MUST be reviewed for constitution compliance.
Violations MUST be addressed before merge approval.

**Version**: 1.0.0 | **Ratified**: 2026-02-26 | **Last Amended**: 2026-02-26
