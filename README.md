# Strategic Futures Lab

A scenario planning simulation app inspired by Shell's scenario planning methodology. Guide your organization through a structured 4-phase journey to analyze strategic uncertainties and develop robust action plans for multiple futures.

## What is Scenario Planning?

Scenario planning is a strategic discipline that helps organizations prepare for uncertainty by exploring multiple plausible futures rather than trying to predict a single one. Pioneered at Royal Dutch Shell in the 1970s, this methodology helped Shell anticipate both the 1973 and 1979 oil shocks—giving them a significant competitive advantage.

## The 4-Phase Journey

| Phase | Purpose | Key Activities |
|-------|---------|----------------|
| **Discover** | Frame the strategic question | Context setup, focal issue definition, PEST force scanning |
| **Design** | Build the scenario matrix | Select critical uncertainties, define axes, construct 2x2 matrix |
| **Develop** | Create scenario narratives | Write scenario stories, assess organizational impact, evaluate risks |
| **Decide** | Develop action plans | Assign response types, create strategic actions, generate final report |

## Features

- **AI-Powered Analysis**: Uses Claude API to generate contextual PEST (Political, Economic, Social, Technological) forces based on your organization's context
- **Interactive Scenario Matrix**: Drag-and-drop interface for building and exploring the 2x2 scenario matrix
- **Guided Learning**: Educational sidebar with guides, real-world examples, and practical tips at each step
- **Progress Persistence**: Your work is automatically saved to localStorage
- **Executive Design**: Dark theme with gold accents for a premium, focused experience

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **State Management**: Zustand with localStorage persistence
- **UI Components**: Radix UI primitives
- **Styling**: Tailwind CSS with custom gold/navy palette
- **Animations**: Framer Motion
- **AI Integration**: Anthropic Claude API
- **Drag & Drop**: dnd-kit

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- Anthropic API key

### Installation

```bash
# Clone the repository
git clone https://github.com/Shivak11/Scenario-planning-simulation.git
cd strategic-futures-lab

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
# Add your ANTHROPIC_API_KEY to .env.local

# Start the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to begin your scenario planning journey.

### Environment Variables

Create a `.env.local` file with:

```env
ANTHROPIC_API_KEY=your_api_key_here
```

## Available Scripts

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run start    # Start production server
npm run lint     # Run ESLint
```

## Project Structure

```
strategic-futures-lab/
├── app/
│   ├── api/                 # API routes (Claude integration)
│   ├── simulation/          # Simulation phase pages
│   │   ├── discover/        # Discover phase substeps
│   │   ├── design/          # Design phase substeps
│   │   ├── develop/         # Develop phase substeps
│   │   └── decide/          # Decide phase substeps
│   ├── layout.tsx           # Root layout
│   └── page.tsx             # Landing page
├── components/
│   └── simulation/          # Reusable simulation components
├── lib/
│   ├── store.ts             # Zustand state management
│   ├── types.ts             # TypeScript type definitions
│   └── utils.ts             # Utility functions
└── docs/                    # Component documentation
```

## Methodology Credits

This application is based on the scenario planning methodology developed at Royal Dutch Shell and documented in:

- *The Art of the Long View* by Peter Schwartz
- Shell's scenario planning publications

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
