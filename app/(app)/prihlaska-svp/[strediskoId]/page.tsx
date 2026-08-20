import { getPayloadClient } from "@/lib/payload";
import { getStrediskoById, allStrediska } from "@/data/strediska";
import RegistrationSVPClient from "./RegistrationSVPClient";
import LomyEnquiryPage from "./LomyEnquiryPage";

interface StrediskoOption {
  id: string;
  name: string;
}

interface MatchedData {
  strediskoName: string;
  initialDate: string;
  allStrediskaOptions: StrediskoOption[];
}

async function findInPayload(
  strediskoId: string,
  dateIndex: number,
): Promise<MatchedData | null> {
  try {
    const payload = await getPayloadClient();

    // Fetch target stredisko
    const result = await payload.find({
      collection: "strediska",
      where: { slug: { equals: strediskoId } },
      limit: 1,
      depth: 0,
    });

    if (result.docs.length === 0) return null;

    const doc = result.docs[0] as Record<string, any>;
    const dates: any[] = doc.dates ?? [];
    const selectedDate = dates[dateIndex] ?? dates[0];

    // Fetch all strediska for the alternative dropdown
    const allResult = await payload.find({
      collection: "strediska",
      limit: 100,
      depth: 0,
    });

    const allOptions: StrediskoOption[] = allResult.docs.map((d: any) => ({
      id: d.slug ?? "",
      name: d.name ?? "",
    }));

    return {
      strediskoName: doc.name ?? "",
      initialDate: selectedDate?.startDate ?? "",
      allStrediskaOptions: allOptions.length > 0 ? allOptions : null!,
    };
  } catch {
    return null;
  }
}

function findInHardcoded(
  strediskoId: string,
  dateIndex: number,
): MatchedData | null {
  const stredisko = getStrediskoById(strediskoId);
  if (!stredisko) return null;

  const selectedDate = stredisko.dates[dateIndex] ?? stredisko.dates[0];

  return {
    strediskoName: stredisko.name,
    initialDate: selectedDate?.startDate ?? "",
    allStrediskaOptions: allStrediska.map((s) => ({ id: s.id, name: s.name })),
  };
}

export default async function PrihlasSVPPage({
  params,
  searchParams,
}: {
  params: Promise<{ strediskoId: string }>;
  // `termin` carries the date as text, which the rebuilt Lomy table uses: its
  // 2027 dates do not correspond to the indexes in the stredisko data, so an
  // index from there would pre-fill the wrong date.
  searchParams: Promise<{ d?: string; termin?: string }>;
}) {
  const { strediskoId } = await params;
  const { d, termin } = await searchParams;
  const dateIndex = d ? parseInt(d) : 0;

  // Lomy is rebuilt and uses the short enquiry form; the long registration below
  // is retired for it. The other five strediská still render that form, so this
  // branches rather than replacing the route.
  if (strediskoId === "horsky-hotel-lomy") {
    return <LomyEnquiryPage initialTerm={termin ?? ""} />;
  }

  let matched =
    (await findInPayload(strediskoId, dateIndex)) ??
    findInHardcoded(strediskoId, dateIndex);

  if (!matched) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <p className="text-xl font-bold">Stredisko nenájdené</p>
      </main>
    );
  }

  // If Payload returned options but allStrediskaOptions ended up null (no strediska in Payload yet),
  // fall back to hardcoded list for the dropdown
  if (!matched.allStrediskaOptions || matched.allStrediskaOptions.length === 0) {
    matched = {
      ...matched,
      allStrediskaOptions: allStrediska.map((s) => ({ id: s.id, name: s.name })),
    };
  }

  return (
    <RegistrationSVPClient
      strediskoId={strediskoId}
      strediskoName={matched.strediskoName}
      initialDate={termin ?? matched.initialDate}
      allStrediskaOptions={matched.allStrediskaOptions}
    />
  );
}
