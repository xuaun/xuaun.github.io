import { Button, Dialog, DialogTrigger, Heading, Modal, ModalOverlay } from "react-aria-components";
import { profile, type Content, type SectionId } from "../content/types";
import { BoopLink } from "./BoopLink";
import { Icon } from "./Icon";

/**
 * The small-screen top bar and its menu. React Aria's modal supplies what a
 * hamburger menu usually gets wrong: focus moves into the sheet and is trapped
 * there, the page behind is inert and cannot scroll, Escape and a tap outside
 * close it, and focus returns to the button afterwards.
 */
export function MobileMenu({ content, active }: { content: Content; active: SectionId | null }) {
  const { ui } = content;
  const activeLabel = content.nav.find((item) => item.id === active)?.label;

  // Close first, then scroll: while the modal is open the page is scroll-locked,
  // so wait until the sheet has actually left the DOM before moving.
  const goTo = (id: string, close: () => void) => {
    close();
    const move = () => {
      if (document.querySelector(".menu-overlay")) {
        requestAnimationFrame(move);
        return;
      }
      const target = document.getElementById(id);
      if (!target) return;
      history.replaceState(null, "", `#${id}`);
      target.scrollIntoView();
      target.focus({ preventScroll: true });
    };
    requestAnimationFrame(move);
  };

  return (
    <div className="sticky top-0 z-(--z-bar) -mx-5 flex items-center justify-between gap-4 border-b border-line bg-bg/90 px-5 py-2 backdrop-blur-sm sm:-mx-8 sm:px-8 md:hidden print:hidden">
      <p className="flex min-w-0 items-baseline gap-2">
        <a href="#top" className="inline-flex min-h-11 shrink-0 items-center font-display text-lg font-extrabold tracking-tight">
          {content.hero.name}
        </a>
        {/* With the menu closed, this is the only "you are here" a phone gets. */}
        {activeLabel && <span className="truncate text-meta text-muted">{activeLabel}</span>}
      </p>

      <DialogTrigger>
        <Button className="pushable inline-flex min-h-11 shrink-0 cursor-pointer items-center gap-2 rounded-full border border-line-strong bg-surface px-4 font-medium text-ink">
          <Icon name="menu" />
          {ui.menu}
        </Button>
        <ModalOverlay isDismissable className="menu-overlay fixed inset-0 z-(--z-overlay) bg-black/45">
          <Modal className="menu-panel fixed inset-y-0 right-0 w-[min(21rem,88vw)] overflow-y-auto bg-bg shadow-hover">
            <Dialog className="menu-content flex min-h-full flex-col gap-6 p-6 outline-none">
              {({ close }) => (
                <>
                  <div className="flex items-center justify-between gap-4">
                    <Heading slot="title" className="font-display text-2xl font-extrabold tracking-tight">
                      {ui.menu}
                    </Heading>
                    <Button
                      onPress={close}
                      className="pushable inline-flex min-h-11 cursor-pointer items-center gap-2 rounded-full border border-line-strong bg-surface px-4 font-medium text-ink"
                    >
                      <Icon name="x" />
                      {ui.close}
                    </Button>
                  </div>

                  <nav aria-label={ui.primaryNav}>
                    <ul className="flex flex-col">
                      {content.nav.map((item) => {
                        const isActive = item.id === active;
                        return (
                          <li key={item.id} className="border-b border-line">
                            <a
                              href={`#${item.id}`}
                              aria-current={isActive ? "location" : undefined}
                              onClick={(event) => {
                                event.preventDefault();
                                goTo(item.id, close);
                              }}
                              className={`flex min-h-13 items-center gap-3 font-display text-xl font-bold active:text-accent ${
                                isActive ? "text-ink" : "text-muted"
                              }`}
                            >
                              <span
                                aria-hidden="true"
                                className={`h-6 w-1 rounded-full ${isActive ? "bg-accent" : "bg-transparent"}`}
                              />
                              {item.label}
                            </a>
                          </li>
                        );
                      })}
                    </ul>
                  </nav>

                  <ul className="mt-auto flex flex-wrap gap-x-5 text-muted">
                    <li>
                      <BoopLink href={`${content.path}cv/`} icon="file-text">
                        {ui.cv}
                      </BoopLink>
                    </li>
                    {profile.links.slice(0, 2).map((link) => (
                      <li key={link.id}>
                        <BoopLink href={link.href}>{link.label}</BoopLink>
                      </li>
                    ))}
                  </ul>
                </>
              )}
            </Dialog>
          </Modal>
        </ModalOverlay>
      </DialogTrigger>

      <span aria-hidden="true" className="scroll-progress absolute inset-x-0 bottom-0 h-0.5 bg-accent" />
    </div>
  );
}
