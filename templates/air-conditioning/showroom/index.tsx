import { TemplateRoot } from "@/templates/_kit/TemplateRoot";
import { FloatingChat } from "../_shared/FloatingChat";
import { contactLinks } from "../_shared/links";
import content from "./content";
import meta from "./meta";
import { body, display } from "./fonts";
import { Header, Hero, Highlights, UnitTiles } from "./sections/Top";
import { Shelf } from "./sections/Shelf";
import { Banner, BrandsLine, Coverage, Faq, Packages, Reviews, Services, Sizing, Steps } from "./sections/Body";
import { Booking } from "./sections/Booking";
import { FinalCta, Footer } from "./sections/Footer";

export default function Showroom() {
  const c = content;
  const links = contactLinks(c.business);
  const images = meta.images;

  return (
    <TemplateRoot
      meta={meta}
      className={`${display.variable} ${body.variable} bg-white font-(family-name:--font-sr-body) text-(--c-black) antialiased selection:bg-black selection:text-white [&_:focus-visible]:outline-black`}
    >
      <Header c={c} tel={links.tel} />
      <main>
        <Hero c={c} image={images.hero} />
        <Highlights c={c} />
        <UnitTiles c={c} images={images} />
        <Shelf c={c} images={images} />
        <Sizing c={c} />
        <Banner c={c} image={images.banner} />
        <Services c={c} />
        <Packages c={c} />
        <Steps c={c} />
        <BrandsLine c={c} />
        <Reviews c={c} />
        <Coverage c={c} />
        <Faq c={c} />
        <Booking c={c} tel={links.tel} />
        <FinalCta c={c} links={links} />
      </main>
      <Footer c={c} links={links} />
      <FloatingChat
        links={links}
        classNames={{
          position: "right-5 bottom-5",
          launcher: "size-14 rounded-full bg-black text-white shadow-lg hover:bg-neutral-800",
          panel: "rounded-2xl border border-(--c-line) bg-white p-2 shadow-xl",
          item: "rounded-xl px-3 py-2.5 font-bold hover:bg-(--c-tile)",
        }}
      />
    </TemplateRoot>
  );
}
