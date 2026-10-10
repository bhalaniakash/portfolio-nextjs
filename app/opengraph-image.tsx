import { renderOgImage, ogSize } from "@/lib/og";

export const alt = "Akash Bhalani, Full Stack Web Developer in Ahmedabad, India";
export const size = ogSize;
export const contentType = "image/png";

export default function Image() {
  return renderOgImage({
    eyebrow: "Full Stack Web Developer",
    title: "Akash Bhalani",
    footer: "Laravel, PHP, JavaScript, MySQL",
  });
}
