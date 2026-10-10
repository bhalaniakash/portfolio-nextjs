// Where each skill comes from. Shown next to every technology so visitors can
// tell professional work from public projects and learning.
export type SkillContext = "professional" | "project" | "hands-on" | "coursework" | "listed";

export const contextLabels: Record<SkillContext, { label: string; description: string }> = {
  professional: { label: "Professional", description: "Used in professional work." },
  project: { label: "Public project", description: "Visible in a public repository." },
  "hands-on": { label: "Hands-on", description: "Built with it; the code is not public." },
  coursework: { label: "Coursework", description: "From a degree or certificate course." },
  listed: { label: "On resume", description: "Listed on my resume; no public project yet." },
};

export type SkillLink = { label: string; href: string };

export type Skill = {
  name: string;
  contexts: SkillContext[];
  note: string;
  links?: SkillLink[];
};

export type SkillGroup = {
  id: string;
  label: string;
  description: string;
  /** Direction the group enters from as the section scrolls in. */
  from: "left" | "right" | "below";
  skills: Skill[];
};

const project = {
  walletwise: { label: "WalletWise case study", href: "/projects/walletwise" },
  chat: { label: "Laravel Chat case study", href: "/projects/realtime-chat" },
  ttt: { label: "Tic Tac Toe case study", href: "/projects/tic-tac-toe" },
  renderDeploy: { label: "render_deploy on GitHub", href: "https://github.com/bhalaniakash/render_deploy" },
  crudMini: { label: "crud_mini on GitHub", href: "https://github.com/bhalaniakash/crud_mini" },
  mindMesh: { label: "Mind Mesh on GitHub", href: "https://github.com/bhalaniakash/Mind-Mesh-Social-App-" },
} satisfies Record<string, SkillLink>;

// Sources: Akash's resume (data/Akash_Soni-1.pdf, October 2026), the public
// repositories on github.com/bhalaniakash, and Akash's own confirmation for
// the AI work. "Professional" means the resume ties it to Brainer Hub.
export const skillGroups: SkillGroup[] = [
  {
    id: "backend",
    label: "Backend and APIs",
    description: "Where most of my work happens.",
    from: "left",
    skills: [
      {
        name: "Laravel",
        contexts: ["professional", "project"],
        note: "My main framework at Brainer Hub (including the in-house HungerHop and hospital management platforms) and in every public project: WalletWise, the chat app, Tic Tac Toe, a versioned CRUD API and the Mind Mesh social app.",
        links: [project.walletwise, project.chat, project.ttt],
      },
      { name: "PHP", contexts: ["professional", "project"], note: "The language behind all of my Laravel work." },
      {
        name: "REST APIs",
        contexts: ["professional", "project"],
        note: "RESTful APIs at Brainer Hub, including HungerHop; a versioned /api/v1 resource API in crud_mini; JSON endpoints in Tic Tac Toe.",
        links: [project.crudMini, project.ttt],
      },
      { name: "JWT authentication", contexts: ["professional"], note: "Secured REST APIs with JWT at Brainer Hub." },
      {
        name: "Multi-tenant architecture",
        contexts: ["professional"],
        note: "Multi-tenant systems at Brainer Hub, including tenant-based isolation for HungerHop, an in-house Laravel 12 food delivery platform.",
      },
      {
        name: "Auth and access control",
        contexts: ["professional", "project"],
        note: "Authentication modules and role-based access at Brainer Hub (HungerHop and the hospital system), and role-based redirects for WalletWise admins.",
        links: [project.walletwise],
      },
      { name: "API documentation", contexts: ["professional"], note: "Documented the REST APIs I built at Brainer Hub." },
      {
        name: "Scheduled jobs",
        contexts: ["project"],
        note: "Daily Artisan commands in WalletWise email reminders due within three days and expire lapsed premium plans.",
        links: [project.walletwise],
      },
      {
        name: "Payment and wallet flows",
        contexts: ["professional", "project"],
        note: "Wallet and subscription modules for HungerHop at Brainer Hub; Razorpay orders with server-side signature verification in WalletWise.",
        links: [project.walletwise],
      },
      { name: "Laravel Breeze", contexts: ["project"], note: "Authentication scaffolding in the chat app.", links: [project.chat] },
      { name: "Livewire", contexts: ["listed"], note: "Listed on my resume." },
      { name: "Node.js", contexts: ["listed"], note: "Listed on my resume." },
    ],
  },
  {
    id: "python",
    label: "Python and AI",
    description: "Python services and model-backed features.",
    from: "right",
    skills: [
      { name: "Python", contexts: ["professional", "coursework"], note: "Used at Brainer Hub with Django and FastAPI; Geekster Python certificate, January 2025." },
      { name: "Django", contexts: ["professional"], note: "Developed web applications with Django at Brainer Hub. The code is not public." },
      { name: "FastAPI", contexts: ["professional"], note: "Developed web applications and APIs with FastAPI at Brainer Hub. The code is not public." },
      { name: "LLM API integration", contexts: ["hands-on"], note: "Called large language model APIs from applications." },
      { name: "Prompt engineering", contexts: ["hands-on"], note: "Designed prompts for the LLM features I built." },
      { name: "Hugging Face models", contexts: ["hands-on"], note: "Ran Hugging Face and Transformers models." },
      { name: "Model inference APIs", contexts: ["hands-on"], note: "Used hosted inference APIs to serve model results." },
      { name: "Chatbot development", contexts: ["hands-on"], note: "Built conversational features, including work on an AI-powered guidance platform." },
    ],
  },
  {
    id: "frontend",
    label: "Frontend",
    description: "Interfaces on top of the API.",
    from: "left",
    skills: [
      { name: "JavaScript", contexts: ["professional", "project"], note: "Client logic in every project, from Chart.js reports to the fetch-driven Tic Tac Toe board.", links: [project.ttt] },
      { name: "Vue.js", contexts: ["hands-on"], note: "Built web applications with Vue.js, per my resume. No public code yet." },
      { name: "React", contexts: ["hands-on"], note: "Built web applications with React, per my resume. No public code yet." },
      { name: "TypeScript", contexts: ["listed"], note: "Listed on my resume." },
      { name: "HTML and CSS", contexts: ["project"], note: "Hand-written markup and styles across all projects." },
      { name: "Responsive dashboards", contexts: ["professional", "project"], note: "Dashboards and reports for the hospital management system at Brainer Hub; WalletWise's user and admin dashboards.", links: [project.walletwise] },
      { name: "Bootstrap", contexts: ["professional", "project"], note: "The hospital management system at Brainer Hub, WalletWise and the chat app.", links: [project.walletwise, project.chat] },
      { name: "Data visualisation", contexts: ["project"], note: "WalletWise reports drawn with Chart.js: bar, pie and doughnut charts from SQL aggregates.", links: [project.walletwise] },
      { name: "AJAX and fetch", contexts: ["project"], note: "Tic Tac Toe sends every move to the server with fetch and renders the JSON reply.", links: [project.ttt] },
      { name: "jQuery", contexts: ["listed"], note: "Listed on my resume." },
    ],
  },
  {
    id: "data",
    label: "Databases",
    description: "Modelling, isolating and tuning data.",
    from: "below",
    skills: [
      { name: "MySQL", contexts: ["professional", "project"], note: "The hospital management system at Brainer Hub and WalletWise run on MySQL.", links: [project.walletwise] },
      { name: "PostgreSQL", contexts: ["project", "hands-on"], note: "render_deploy builds a Docker image with pdo_pgsql and connects to PostgreSQL in production.", links: [project.renderDeploy] },
      { name: "Database optimisation", contexts: ["professional"], note: "Optimised databases behind the APIs I built at Brainer Hub." },
      { name: "Data modelling", contexts: ["professional", "project"], note: "HungerHop at Brainer Hub uses 39+ relational tables with tenant-based isolation; WalletWise's schema grew through 8 migrations.", links: [project.walletwise] },
      { name: "Eloquent ORM", contexts: ["professional", "project"], note: "Relationships, casts and queries in every Laravel project." },
      { name: "SQL", contexts: ["project", "coursework"], note: "Aggregation queries for WalletWise charts; Geekster SQL certificate, January 2025.", links: [project.walletwise] },
      { name: "MongoDB", contexts: ["listed"], note: "Listed on my resume." },
    ],
  },
  {
    id: "delivery",
    label: "DevOps and delivery",
    description: "Shipping and collaborating.",
    from: "right",
    skills: [
      { name: "Git", contexts: ["professional", "project"], note: "Daily version control at work; all public projects are on GitHub." },
      { name: "GitLab", contexts: ["professional"], note: "Git and GitLab workflows in an Agile team at Brainer Hub." },
      { name: "Docker", contexts: ["project"], note: "Wrote the Dockerfile for render_deploy: PHP 8.2, Composer, and migrations on start.", links: [project.renderDeploy] },
      { name: "Render deployment", contexts: ["project"], note: "Deployed a Laravel app to Render from a render.yaml manifest, with secrets kept in the dashboard.", links: [project.renderDeploy] },
      { name: "Postman", contexts: ["listed"], note: "Listed on my resume for API testing." },
      { name: "VS Code, Cursor, Antigravity", contexts: ["listed"], note: "Editors listed on my resume." },
      { name: "XAMPP and WAMP", contexts: ["listed"], note: "Local PHP environments listed on my resume." },
    ],
  },
  {
    id: "foundations",
    label: "Foundations",
    description: "How I structure code.",
    from: "below",
    skills: [
      { name: "Clean architecture", contexts: ["professional"], note: "HungerHop at Brainer Hub follows clean architecture principles in Laravel 12." },
      { name: "MVC", contexts: ["project"], note: "Every Laravel project follows model, view, controller separation." },
      { name: "OOP", contexts: ["coursework"], note: "Object-oriented design from my degrees and every PHP project." },
      { name: "Agile", contexts: ["professional"], note: "Work in an Agile team at Brainer Hub." },
      { name: "C and C++", contexts: ["coursework"], note: "Programming fundamentals during my BCA." },
    ],
  },
];
