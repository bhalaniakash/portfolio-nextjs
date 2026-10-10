// WalletWise as it is actually built: a single Laravel application (a
// monolith), one database, one payment provider and the Laravel scheduler.
// Verified against routes/web.php, routes/console.php, app/Http/Controllers,
// app/Models and database/migrations in the public repository.

export type ArchNodeId = "browser" | "routes" | "controllers" | "models" | "database" | "razorpay" | "scheduler" | "mail";

export type ArchNode = {
  id: ArchNodeId;
  label: string;
  kind: "client" | "app" | "data" | "external";
  /** Position in percent of the diagram box, for wide and narrow layouts. */
  wide: { x: number; y: number };
  narrow: { x: number; y: number };
};

export type ArchStep = {
  title: string;
  nodes: ArchNodeId[];
  detail: string;
  files: string[];
};

export const architecture: {
  project: string;
  title: string;
  nodes: ArchNode[];
  edges: [ArchNodeId, ArchNodeId][];
  steps: ArchStep[];
} = {
  project: "walletwise",
  title: "WalletWise",
  nodes: [
    { id: "browser", label: "Browser", kind: "client", wide: { x: 9, y: 50 }, narrow: { x: 28, y: 7 } },
    { id: "routes", label: "Routes and auth", kind: "app", wide: { x: 29, y: 50 }, narrow: { x: 28, y: 27 } },
    { id: "controllers", label: "Controllers", kind: "app", wide: { x: 49, y: 50 }, narrow: { x: 28, y: 47 } },
    { id: "models", label: "Eloquent models", kind: "app", wide: { x: 69, y: 50 }, narrow: { x: 28, y: 67 } },
    { id: "database", label: "MySQL", kind: "data", wide: { x: 89, y: 50 }, narrow: { x: 28, y: 89 } },
    { id: "razorpay", label: "Razorpay", kind: "external", wide: { x: 49, y: 86 }, narrow: { x: 74, y: 47 } },
    { id: "scheduler", label: "Scheduler", kind: "app", wide: { x: 69, y: 14 }, narrow: { x: 74, y: 67 } },
    { id: "mail", label: "Mail", kind: "external", wide: { x: 89, y: 14 }, narrow: { x: 74, y: 89 } },
  ],
  edges: [
    ["browser", "routes"],
    ["routes", "controllers"],
    ["controllers", "models"],
    ["models", "database"],
    ["controllers", "razorpay"],
    ["scheduler", "models"],
    ["scheduler", "mail"],
  ],
  steps: [
    {
      title: "Server-rendered pages",
      nodes: ["browser"],
      detail:
        "Blade views styled with Bootstrap make up a public site, a user dashboard and an admin area. Chart.js draws the income, expense and budget reports in the browser.",
      files: ["resources/views"],
    },
    {
      title: "Routes and sign-in",
      nodes: ["routes"],
      detail:
        "web.php groups the user dashboard, the admin pages and the public site. Profile routes sit behind Laravel's auth middleware, the dashboard requires a verified sign-in, and admins are redirected to their own dashboard.",
      files: ["routes/web.php"],
    },
    {
      title: "Business rules in controllers",
      nodes: ["controllers"],
      detail:
        "Income, expense, budget, reminder and payment controllers validate input and apply the rules, such as allowing only one budget per calendar month.",
      files: ["app/Http/Controllers"],
    },
    {
      title: "Models and the database",
      nodes: ["models", "database"],
      detail:
        "Eloquent models for users, categories, incomes, expenses, budgets, reminders and contact messages map onto MySQL tables defined in 8 migrations. Chart totals are aggregated in SQL.",
      files: ["app/Models", "database/migrations"],
    },
    {
      title: "Payments",
      nodes: ["razorpay"],
      detail:
        "The payment controller creates a Razorpay order on the server and verifies the returned signature before upgrading a user to the premium plan.",
      files: ["app/Http/Controllers/Payment.php"],
    },
    {
      title: "Daily jobs",
      nodes: ["scheduler", "mail"],
      detail:
        "The Laravel scheduler runs two Artisan commands every day: one emails premium users about reminders due within three days, the other expires lapsed premium plans.",
      files: ["routes/console.php", "app/Console/Commands"],
    },
  ],
};
