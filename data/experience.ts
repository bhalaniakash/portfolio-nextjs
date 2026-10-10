export type TimelineEntry = {
  kind: "work" | "education";
  organisation: string;
  role: string;
  period: string;
  startDate: string;
  summary?: string;
  points: string[];
  tags: string[];
  /** In-house projects worked on in this role (owned by the employer). */
  projects?: string[];
};

// Source: Akash's resume (data/Akash_Soni-1.pdf, October 2026). Title
// confirmed by Akash as Software Engineer.
export const experience: TimelineEntry[] = [
  {
    kind: "work",
    organisation: "Brainer Hub Solution",
    role: "Software Engineer",
    period: "Jan 2025 – Present",
    startDate: "2025-01",
    points: [
      "Developed web applications using Laravel, FastAPI, Django and modern JavaScript frameworks.",
      "Built RESTful APIs with JWT authentication, API documentation and database optimisation.",
      "Worked on multi-tenant systems, authentication modules and scalable backend architecture.",
      "Collaborated in Agile teams using Git and GitLab workflows.",
    ],
    tags: ["Laravel", "FastAPI", "Django", "REST APIs", "JWT", "Multi-tenancy", "GitLab"],
    projects: ["HungerHop", "Hospital Management System"],
  },
];

export const education: TimelineEntry[] = [
  {
    kind: "education",
    organisation: "CVM University, ISTAR College",
    role: "Master of Computer Applications (MCA)",
    period: "2023 – 2025",
    startDate: "2023",
    points: [
      "Specialised in full stack development, CGPA 9.0 / 10.",
      "Built academic projects with Laravel and Bootstrap.",
      "Coursework in advanced algorithms and database systems.",
    ],
    tags: ["Full stack", "Algorithms", "Databases"],
  },
  {
    kind: "education",
    organisation: "C.U. Shah College, Saurashtra University",
    role: "Bachelor of Computer Applications (BCA)",
    period: "2020 – 2023",
    startDate: "2020",
    points: [
      "Programming fundamentals in C and C++.",
      "Coursework in database management and web development.",
    ],
    tags: ["C", "C++", "DBMS"],
  },
];
