import { TemplateRoot } from "@/templates/_kit/TemplateRoot";
import { FloatingChat } from "../_shared/FloatingChat";
import { contactLinks } from "../_shared/links";
import content from "./content";
import meta from "./meta";
import { sans } from "./fonts";
import { Header, Hero, InfoBar, Trust } from "./sections/Top";
import { About, Area, Faq, News, Products, Rates, Services, Steps, Testimonials } from "./sections/Body";
import { Booking } from "./sections/Booking";
import { FinalCta, Footer } from "./sections/Footer";

export default function Contractor() {
  const c = content;
  const links = contactLinks(c.business);
  const images = meta.images;

  return (
    <TemplateRoot
      meta={meta}
      className={`${sans.variable} bg-white font-(family-name:--font-ct-sans) text-(--c-ink) antialiased selection:bg-(--c-sky)/40 [&_:focus-visible]:outline-(--c-royal)`}
    >
      <InfoBar c={c} />
      <Header c={c} tel={links.tel} />
      <main>
        <Hero c={c} images={images} />
        <Trust c={c} />
        <Services c={c} images={images} />
        <Rates c={c} />
        <Steps c={c} />
        <Products c={c} />
        <About c={c} images={images} />
        <Area c={c} />
        <Testimonials c={c} />
        <Faq c={c} />
        <News c={c} image={images.post} />
        <Booking c={c} />
        <FinalCta c={c} tel={links.tel} />
      </main>
      <Footer c={c} links={links} />
      <FloatingChat
        links={links}
        label="Message us"
        classNames={{
          position: "right-5 bottom-5",
          launcher: "size-14 rounded-xl bg-(--c-royal) text-white shadow-lg hover:bg-(--c-navy)",
          panel: "rounded-lg bg-white p-2 shadow-xl",
          item: "rounded-md px-3 py-2.5 font-bold text-(--c-navy) hover:bg-(--c-cloud)",
        }}
      />
    </TemplateRoot>
  );
}
