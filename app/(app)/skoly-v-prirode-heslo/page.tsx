import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Pripravujeme | Bombovo",
  robots: { index: false, follow: false },
};

export default async function SkolyVPrirodeHesloPage({
  searchParams,
}: {
  searchParams: Promise<{ from?: string; error?: string }>;
}) {
  const { from, error } = await searchParams;
  const target = from && from.startsWith("/skoly-v-prirode") ? from : "/skoly-v-prirode";

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-bombovo-dark px-4 py-16 text-center">
      <div className="w-full max-w-md rounded-2xl border-2 border-bombovo-yellow bg-white px-6 py-10 sm:px-10">
        <h1 className="font-handwritten text-4xl leading-tight text-bombovo-red sm:text-5xl">
          Pripravujeme Školy v prírode na sezónu 2026/27
        </h1>
        <p className="mt-4 text-base text-bombovo-dark/70">
          Táto sekcia sa práve prerába. Ak máte heslo, zadajte ho nižšie.
        </p>

        <form action="/api/svp-auth" method="POST" className="mt-8 flex flex-col gap-3">
          <input type="hidden" name="from" value={target} />
          <label htmlFor="svp-password" className="sr-only">
            Heslo
          </label>
          <input
            id="svp-password"
            type="password"
            name="password"
            placeholder="Zadajte heslo pre vstup"
            required
            autoFocus
            className="w-full rounded-xl border-2 border-bombovo-dark/20 px-4 py-3 text-center text-base text-bombovo-dark outline-none transition-colors focus:border-bombovo-blue"
          />
          <button
            type="submit"
            className="w-full rounded-xl border-2 border-bombovo-dark bg-bombovo-red px-4 py-3 text-base font-bold text-white transition-transform hover:-translate-y-0.5"
          >
            Vstúpiť
          </button>
          {error && (
            <p className="mt-1 text-sm font-semibold text-bombovo-red">
              Nesprávne heslo, skúste to znova.
            </p>
          )}
        </form>
      </div>
    </main>
  );
}
