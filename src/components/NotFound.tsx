/**
 * Served by GitHub Pages for any unknown address. The visitor's language is
 * unknown at that point, so the page says the same thing in both.
 */
export function NotFound() {
  return (
    <main id="main" tabIndex={-1} className="mx-auto flex min-h-dvh max-w-xl flex-col justify-center gap-6 px-5 py-16 sm:px-8">
      <p className="font-display text-xl font-semibold text-accent">404</p>
      <h1 className="brush-rule text-4xl font-extrabold tracking-tight">This page doesn’t exist</h1>
      <p>The address may be mistyped, or the page may have moved when the site was rebuilt.</p>
      <p lang="pt-BR" className="text-muted">
        Esta página não existe. O endereço pode ter um erro de digitação, ou a página mudou de lugar quando o site foi
        refeito.
      </p>
      <ul className="flex flex-wrap gap-3">
        <li>
          <a
            href="/"
            className="pushable pushable-primary inline-flex min-h-11 items-center rounded-full border border-accent bg-accent-fill px-5 font-medium text-on-accent-fill"
          >
            Go to the portfolio
          </a>
        </li>
        <li>
          <a
            href="/pt/"
            lang="pt-BR"
            hrefLang="pt-BR"
            className="pushable inline-flex min-h-11 items-center rounded-full border border-line-strong bg-surface px-5 font-medium text-ink"
          >
            Ir para o portfólio
          </a>
        </li>
      </ul>
    </main>
  );
}
