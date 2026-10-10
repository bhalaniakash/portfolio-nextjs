export type Certification = {
  title: string;
  shortTitle: string;
  issuer: string;
  date: string;
  dateIso: string;
  image: { src: string; width: number; height: number };
  credentialUrl?: string;
};

// Titles and dates are transcribed from the certificate images themselves.
export const certifications: Certification[] = [
  {
    title: "SQL Certification Course: Basic to Advance",
    shortTitle: "SQL, Basic to Advance",
    issuer: "Geekster",
    date: "15 January 2025",
    dateIso: "2025-01-15",
    image: { src: "/images/certificates/sql-geekster.webp", width: 1000, height: 707 },
    credentialUrl: "https://drive.google.com/file/d/1hDaXvXT86e5MafB2NxlyCbT2A7Ua1mMS/view?usp=drive_link",
  },
  {
    title: "Learn Python: Free Course With Certification",
    shortTitle: "Python",
    issuer: "Geekster",
    date: "15 January 2025",
    dateIso: "2025-01-15",
    image: { src: "/images/certificates/python-geekster.webp", width: 1006, height: 709 },
    credentialUrl: "https://drive.google.com/file/d/1fH2ms7gRgioI3qydc-32IDY3tWb8xu0U/view?usp=drive_link",
  },
];
