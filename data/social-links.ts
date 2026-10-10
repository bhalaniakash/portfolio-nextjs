export type SocialLink = {
  id: "github" | "linkedin" | "x";
  label: string;
  handle: string;
  href: string;
};

// Verified against the links on the existing portfolio and the GitHub profile.
export const socialLinks: SocialLink[] = [
  { id: "github", label: "GitHub", handle: "bhalaniakash", href: "https://github.com/bhalaniakash" },
  {
    id: "linkedin",
    label: "LinkedIn",
    handle: "akash-bhalani",
    href: "https://www.linkedin.com/in/akash-bhalani/",
  },
  { id: "x", label: "X", handle: "@Akashsoni_30", href: "https://x.com/Akashsoni_30" },
];
