import { TemplateRoot } from "@/templates/_kit/TemplateRoot";
import { FloatingChat } from "../_shared/FloatingChat";
import { contactLinks } from "../_shared/links";
import content from "./content";
import meta from "./meta";
import { label, sans } from "./fonts";
import { Business, Header, Hero, Homes, Support } from "./sections/Top";
import { Why } from "./sections/Why";
import { Brands, Coverage, Faq, Pricing, Process, Testimonials, Warranty } from "./sections/Body";
import { Booking } from "./sections/Booking";
import { Footer } from "./sections/Footer";

export default function Authority() {
  const c = content;
  const links = contactLinks(c.business);
  const images = meta.images;

  return (
    <TemplateRoot
      meta={meta}
      className={`${sans.variable} ${label.variable} bg-white font-(family-name:--font-au-sans) text-(--c-ink) antialiased selection:bg-(--c-sky) [&_:focus-visible]:outline-(--c-cyan)`}
    >
      <Header c={c} tel={links.tel} />
      <main>
        <Hero c={c} image={images.hero} />
        <Homes c={c} images={images} />
        <Business c={c} images={images} />
        <Support c={c} images={images} />
        <Why c={c} images={images} />
        <Pricing c={c} />
        <Process c={c} />
        <Brands c={c} />
        <Coverage c={c} />
        <Testimonials c={c} />
        <Faq c={c} />
        <Warranty c={c} />
        <Booking c={c} tel={links.tel} />
      </main>
      <Footer c={c} links={links} />
      <FloatingChat
        links={links}
        classNames={{
          position: "right-5 bottom-5",
          launcher: "size-14 rounded-full bg-(--c-navy) text-white shadow-lg hover:bg-(--c-cyan)",
          panel: "rounded-lg bg-white p-2 shadow-xl",
          item: "rounded-md px-3 py-2.5 text-(--c-navy) hover:bg-(--c-sky)",
        }}
      />
    </TemplateRoot>
  );
}
