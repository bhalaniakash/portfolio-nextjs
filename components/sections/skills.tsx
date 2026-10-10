import { SectionHeading } from "@/components/section-heading";
import { skillGroups } from "@/data/skills";
import { SkillsEcosystem } from "./skills-ecosystem";

export function Skills() {
  return (
    <section aria-labelledby="skills-title" id="skills" className="relative py-24 md:py-36">
      <div className="container-page">
        <SectionHeading
          index="05"
          label="Skills"
          id="skills-title"
          aside={
            <p>
              No percentage bars. Every technology is marked by how I used it: professionally, in a public project,
              hands-on, through coursework, or only on my resume. Select one for details and the projects behind it.
            </p>
          }
        >
          The technical <span className="serif-accent text-accent">ecosystem</span>.
        </SectionHeading>
        <SkillsEcosystem groups={skillGroups} />
      </div>
    </section>
  );
}
