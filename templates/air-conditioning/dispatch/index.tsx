import { TemplateRoot } from "@/templates/_kit/TemplateRoot";
import { FloatingChat } from "../_shared/FloatingChat";
import { contactLinks } from "../_shared/links";
import content from "./content";
import meta from "./meta";
import { sans } from "./fonts";
import { Header } from "./sections/Header";
import { Hero } from "./sections/Hero";
import { Brands, Coverage, Faq, Guarantee, Plan, Pricing, Reviews, Services, Steps, ValueProps } from "./sections/Body";
import { Booking } from "./sections/Booking";
import { FinalCta, Footer } from "./sections/Footer";

export default function Dispatch() {
  const c = content;
  const links = contactLinks(c.business);

  return (
    <TemplateRoot
      meta={meta}
      className={`${sans.variable} bg-white font-(family-name:--font-dp-sans) text-(--c-ink) antialiased selection:bg-(--c-ice) [&_:focus-visible]:outline-(--c-blue)`}
    >
      <Header c={c} tel={links.tel} />
      <main>
        <Hero c={c} image={meta.images.hero} />
        <Services c={c} />
        <ValueProps c={c} />
        <Steps c={c} />
        <Plan c={c} />
        <Pricing c={c} />
        <Brands c={c} />
        <Guarantee c={c} image={meta.images.guarantee} />
        <Coverage c={c} />
        <Reviews c={c} image={meta.images.customer} />
        <Faq c={c} />
        <Booking c={c} tel={links.tel} />
        <FinalCta c={c} links={links} />
      </main>
      <Footer c={c} links={links} />
      <FloatingChat
        links={links}
        classNames={{
          position: "right-5 bottom-5",
          launcher: "size-14 rounded-full bg-(--c-blue) text-white shadow-lg hover:bg-(--c-ink)",
          panel: "rounded-md border border-black/10 bg-white p-2 shadow-xl",
          item: "rounded px-3 py-2.5 font-semibold text-(--c-ink) hover:bg-(--c-mist)",
        }}
      />
    </TemplateRoot>
  );
}
