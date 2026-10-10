import { MotionScope } from "@/components/motion/motion-scope";
import { Sheet } from "@/components/motion/sheet";
import { About } from "@/components/sections/about";
import { Architecture } from "@/components/sections/architecture";
import { Contact } from "@/components/sections/contact";
import { Credentials } from "@/components/sections/credentials";
import { Experience } from "@/components/sections/experience";
import { Hero } from "@/components/sections/hero";
import { Skills } from "@/components/sections/skills";
import { Work } from "@/components/sections/work";
import { Writing } from "@/components/sections/writing";
import { articles } from "@/data/writing";

// The page reads as a stack: the hero stays pinned while About slides over
// it, and every later section is a page that turns in over the one before.
export default function HomePage() {
  return (
    <MotionScope>
      <Hero />
      <Sheet overlap={false}>
        <About />
      </Sheet>
      <Sheet tone="deep">
        <Work />
      </Sheet>
      <Sheet>
        <Architecture />
      </Sheet>
      <Sheet tone="deep">
        <Experience />
      </Sheet>
      <Sheet>
        <Skills />
      </Sheet>
      <Sheet tone="deep">
        <Credentials />
      </Sheet>
      {articles.length > 0 ? (
        <Sheet>
          <Writing />
        </Sheet>
      ) : null}
      <Sheet>
        <Contact />
      </Sheet>
    </MotionScope>
  );
}
