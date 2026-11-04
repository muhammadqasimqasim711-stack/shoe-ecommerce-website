import { Instagram, Facebook, Twitter, Youtube, type LucideIcon } from "lucide-react";

export const SOCIAL_LINKS: ReadonlyArray<{
  name: string;
  href: string;
  Icon: LucideIcon;
}> = [
  { name: "Instagram", href: "https://www.instagram.com/sole", Icon: Instagram },
  { name: "Facebook", href: "https://www.facebook.com/sole", Icon: Facebook },
  { name: "Twitter", href: "https://x.com/sole", Icon: Twitter },
  { name: "YouTube", href: "https://www.youtube.com/@sole", Icon: Youtube },
];
