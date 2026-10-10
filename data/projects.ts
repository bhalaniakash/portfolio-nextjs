// Every statement below was checked against the public repository source
// (routes, controllers, migrations, composer.json) in October 2026.

export type ProjectVisual =
  | { kind: "screenshot"; src: string; width: number; height: number; alt: string; frame: "browser" | "plain" }
  | { kind: "illustration"; alt: string };

export type Project = {
  slug: string;
  title: string;
  kicker: string;
  year: string;
  period: string;
  status?: string;
  summary: string;
  role: string;
  team: string;
  problem: string;
  objectives: string[];
  stack: string[];
  features: string[];
  architecture: { label: string; detail: string }[];
  decisions: { challenge: string; solution: string }[];
  evidence: string[];
  repo: string;
  live?: string;
  visual: ProjectVisual;
};

export const projects: Project[] = [
  {
    slug: "walletwise",
    title: "WalletWise",
    kicker: "Personal finance platform",
    year: "2025",
    period: "March to July 2025",
    summary:
      "A Laravel application for tracking income and expenses, setting monthly budgets, scheduling payment reminders and reading spending through charts, with an admin area and a paid premium plan.",
    role: "Co-developer across the backend, dashboards and payment flow.",
    team: "Built with one collaborator in a shared repository.",
    problem:
      "Manual budgeting in notes or spreadsheets makes it hard to see where money goes each month, and easy to miss bills that are about to fall due.",
    objectives: [
      "Record income and expenses against categories.",
      "Give each user a monthly spending limit and savings target.",
      "Warn people before payments are due.",
      "Fund the product with an optional premium plan.",
    ],
    stack: ["Laravel 12", "PHP 8.2", "MySQL", "Blade", "Bootstrap", "Chart.js", "Razorpay", "JavaScript"],
    features: [
      "Income and expense records grouped by user-managed categories.",
      "A monthly budget with a spending limit and savings goal, one per calendar month.",
      "Payment reminders with amount, due date and repeat frequency.",
      "Income, expense and budget reports drawn as bar, pie and doughnut charts.",
      "An admin area for members, categories and messages sent through the contact form.",
      "A premium plan purchased through Razorpay, with daily jobs that send reminder emails and expire lapsed plans.",
    ],
    architecture: [
      { label: "Application", detail: "Laravel 12 MVC with Blade views and separate user, admin and public layouts." },
      { label: "Data", detail: "MySQL through Eloquent: users, categories, incomes, expenses, budgets, reminders, contact messages." },
      { label: "Access", detail: "Authenticated routes; admins are redirected to their own dashboard after sign-in." },
      { label: "Payments", detail: "Razorpay orders created on the server, signatures verified before the plan changes." },
      { label: "Scheduling", detail: "Two Artisan commands run daily from the Laravel scheduler." },
    ],
    decisions: [
      {
        challenge: "A payment confirmation coming from the browser cannot be trusted on its own.",
        solution:
          "The order is created server-side with the amount in paise, and the returned payment is checked with Razorpay's signature verification before the user's plan is upgraded. API keys are read from the environment, never the client.",
      },
      {
        challenge: "Users could create several budgets for the same month and make reports contradictory.",
        solution:
          "Budget creation validates the input and then checks for an existing budget in the current year and month before inserting, returning a clear message if one exists.",
      },
      {
        challenge: "Reminders are only useful if they arrive without the user opening the app.",
        solution:
          "A scheduled command emails premium users about reminders due within the next three days, and a second daily command expires premium plans that have lapsed.",
      },
      {
        challenge: "Monthly charts need totals, not thousands of rows in PHP.",
        solution:
          "Income and expense totals are aggregated in SQL with SUM grouped by month, and only the totals are handed to Chart.js.",
      },
    ],
    evidence: [
      "Public repository with 216 commits authored by Akash.",
      "8 application migrations dated March to April 2025 trace the data model as it grew.",
    ],
    repo: "https://github.com/bhalaniakash/WalletWise",
    visual: {
      kind: "screenshot",
      src: "/images/projects/walletwise.webp",
      width: 1600,
      height: 900,
      alt: "WalletWise landing page with the headline WalletWise and buttons to get started or explore features",
      frame: "browser",
    },
  },
  {
    slug: "realtime-chat",
    title: "Laravel Chat",
    kicker: "One-to-one messaging",
    year: "2025",
    period: "June 2025",
    status: "In progress: WebSocket delivery is configured but not yet switched on for messages.",
    summary:
      "A one-to-one messaging app built on Laravel 12 and Breeze, with text and file attachments, and the groundwork for real-time delivery through Laravel Reverb and Echo.",
    role: "Sole developer.",
    team: "Personal project.",
    problem:
      "Most chat clients are heavy for quick conversations and file hand-offs. The goal was a minimal, self-hosted conversation view that can grow into real-time messaging.",
    objectives: [
      "Authenticated users can start a conversation with any other user.",
      "Messages can carry text, a file, or both.",
      "Delivery moves to WebSockets without changing the data model.",
    ],
    stack: ["Laravel 12", "PHP 8.2", "Laravel Breeze", "Laravel Reverb", "Laravel Echo", "Bootstrap 5", "Vite"],
    features: [
      "Registration, sign-in and profile management through Laravel Breeze.",
      "A dashboard listing the people you can message.",
      "Conversation threads that load messages in both directions in chronological order.",
      "Text messages up to 1,000 characters, or a file attachment on its own.",
      "Attachments stored on Laravel's public disk with timestamped file names.",
    ],
    architecture: [
      { label: "Application", detail: "Laravel 12 with Breeze authentication pages and Bootstrap 5 conversation views in Blade." },
      { label: "Data", detail: "A messages table linking sender, recipient, body and optional attachment path." },
      { label: "Real time", detail: "An Echo client is configured for the Reverb broadcaster, and a test route dispatches a broadcastable event." },
      { label: "Storage", detail: "Uploaded files live on the public disk and are served through the storage link." },
    ],
    decisions: [
      {
        challenge: "A message may be just a file, just text, or both.",
        solution:
          "Validation uses required_without:attachment, so text is only required when no file is sent, and the recipient must exist in the users table.",
      },
      {
        challenge: "A conversation is two directions of the same relationship.",
        solution:
          "The thread query groups two conditions, sender to recipient and recipient to sender, and orders the result by creation time.",
      },
      {
        challenge: "Moving to real-time delivery without rewriting the app.",
        solution:
          "Reverb, the Echo client and a broadcastable test event are already in place. The MessageSent event is scaffolded; broadcasting it is the remaining step, and messages currently post and reload.",
      },
    ],
    evidence: ["Public repository with the conversation, attachment and broadcasting setup described here."],
    repo: "https://github.com/bhalaniakash/Chat_Application",
    visual: {
      kind: "illustration",
      alt: "Illustration of a two-person conversation with a file attachment, drawn for this portfolio rather than a screenshot",
    },
  },
  {
    slug: "tic-tac-toe",
    title: "Tic Tac Toe",
    kicker: "Server-authoritative game",
    year: "2025",
    period: "May 2025",
    summary:
      "A two-player game where Laravel owns the board: every move is sent to a JSON endpoint that validates it, applies it, checks for a winner and returns the new state.",
    role: "Sole developer.",
    team: "Personal project.",
    problem:
      "In a purely client-side game, the browser decides what counts as a legal move. This project moves that authority to the server as a small exercise in API design and state handling.",
    objectives: [
      "Store each game as a record on the server.",
      "Reject illegal moves at the API, not just in the UI.",
      "Keep the client a thin view over JSON responses.",
    ],
    stack: ["Laravel 12", "PHP 8.2", "Eloquent", "Blade", "JavaScript (fetch)", "CSS"],
    features: [
      "New games are created through a POST endpoint and stored with an empty nine-cell board.",
      "Moves are sent with the CSRF token to a per-game endpoint.",
      "The server rejects out-of-range cells, occupied cells and moves after a win with HTTP 400.",
      "Eight winning lines are checked after every move, and the turn alternates between X and O.",
    ],
    architecture: [
      { label: "Endpoints", detail: "GET / for the view, POST /game/new, POST /game/{id}/move." },
      { label: "Model", detail: "A Game record with the board cast to a PHP array, the current turn and the winner." },
      { label: "Client", detail: "Vanilla JavaScript renders the board from each JSON response." },
    ],
    decisions: [
      {
        challenge: "Preventing invalid moves even if someone calls the API directly.",
        solution:
          "The move endpoint validates the index as an integer from 0 to 8, then refuses the move if the cell is filled or the game already has a winner.",
      },
      {
        challenge: "Keeping the board easy to persist and read back.",
        solution: "The board is stored as JSON and cast to an array by Eloquent, so game logic works on a plain PHP array.",
      },
    ],
    evidence: ["Public repository containing the controller, model and view described here."],
    repo: "https://github.com/bhalaniakash/tic-tac-toe",
    visual: {
      kind: "screenshot",
      src: "/images/projects/tic-tac-toe.webp",
      width: 1212,
      height: 640,
      alt: "Tic Tac Toe board from the Laravel game with a finished round of X and O moves",
      frame: "plain",
    },
  },
];

export function getProject(slug: string) {
  return projects.find((project) => project.slug === slug);
}

// In-house projects Akash worked on at Brainer Hub Solution, built to office
// requirements for the company's clients. The code and products belong to the
// company and its clients, so they are shown as text only: no screenshots,
// links or case-study pages. Details come from Akash's resume.
export type ResumeProject = {
  title: string;
  owner: string;
  kicker: string;
  summary: string;
  points: string[];
  stack: string[];
};

export const resumeProjects: ResumeProject[] = [
  {
    title: "HungerHop",
    owner: "Brainer Hub Solution, for a client",
    kicker: "Multi-tenant food delivery platform",
    summary:
      "An enterprise-level food ordering and delivery platform with separate roles for customers, restaurants, delivery partners and administrators.",
    points: [
      "Worked on a multi-tenant architecture in Laravel 12, following clean architecture principles.",
      "REST APIs, a wallet system, subscription modules, delivery tracking and restaurant management.",
      "Role-based access control, authentication and real-time order workflows.",
      "A database of 39+ relational tables with tenant-based isolation.",
    ],
    stack: ["Laravel 12", "REST APIs", "Multi-tenancy", "RBAC"],
  },
  {
    title: "Hospital Management System",
    owner: "Brainer Hub Solution, for a client",
    kicker: "Hospital administration platform",
    summary: "A platform for managing patients, doctors, appointments and medical records.",
    points: [
      "Worked on patient registration, appointment scheduling, billing and doctor management modules.",
      "Secure authentication and role-based access.",
      "Responsive dashboards and reporting.",
    ],
    stack: ["Laravel", "MySQL", "Bootstrap", "REST"],
  },
];
