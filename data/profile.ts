// Source: Akash's resume (data/Akash_Soni-1.pdf, October 2026).
export const profile = {
  name: "Akash Bhalani",
  firstName: "Akash",
  lastName: "Bhalani",
  role: "Full Stack Web Developer",
  location: "Ahmedabad, India",
  email: "akashbhalani21@gmail.com",
  phone: { display: "+91 89802 02753", href: "tel:+918980202753" },
  portrait: {
    src: "/images/akash-bhalani.webp",
    width: 960,
    height: 1200,
    alt: "Portrait of Akash Bhalani by the sea in Gujarat",
  },
  resume: {
    // Akash's own resume PDF, copied unchanged from data/Akash_Soni-1.pdf.
    href: "/resume/akash-bhalani-resume.pdf",
    fileName: "Akash-Bhalani-Resume.pdf",
  },
  headline: "I build web applications end to end.",
  intro:
    "Software engineer in Ahmedabad, working in Laravel and Python. I build REST APIs with JWT authentication, multi-tenant platforms, Django and FastAPI services, LLM integrations, and the interfaces people actually use.",
  summary:
    "Full stack developer with hands-on experience building scalable web applications with Laravel, FastAPI, Django, Vue.js and React.js. Skilled in RESTful APIs, authentication systems, multi-tenant architectures and database optimisation with MySQL, PostgreSQL and MongoDB, with practical experience on food delivery, hospital management and AI-powered guidance platforms.",
  about: [
    "My path into web development started during my MCA at CVM University, where I specialised in full stack development and built academic projects with Laravel and Bootstrap. Before that I completed a BCA at C.U. Shah College, Saurashtra University.",
    "Since January 2025 I have been a Software Engineer at Brainer Hub Solution, building web applications with Laravel, FastAPI and Django, RESTful APIs secured with JWT, and multi-tenant systems, in an Agile team using Git and GitLab. In-house projects there include HungerHop, a multi-tenant food delivery platform, and a hospital management system.",
    "I am most comfortable on the server side: data models, tenant isolation, authentication and the jobs that run on a schedule. Alongside Laravel I work with Python, Django and FastAPI, and I have built with LLM APIs and Hugging Face models. On the front end I use JavaScript, Vue.js, React and Bootstrap, and I like interfaces that stay fast and readable.",
  ],
  facts: [
    { label: "Based in", value: "Ahmedabad, India" },
    { label: "Education", value: "MCA, CVM University" },
    { label: "Languages", value: "English, Hindi, Gujarati" },
    { label: "Off screen", value: "Photography, video editing, travel, learning new technologies" },
  ],
} as const;
