import { getPayloadClient } from "@/lib/payload";
import Link from "next/link";
import TopBar from "@/components/TopBar";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { getCampDetails } from "@/data/camps";
import { camps as allCamps } from "@/lib/campsData";
import RegistrationClient from "./RegistrationClient";

interface MatchedData {
  campName: string;
  campLocation: string;
  dateStart: string;
  dateEnd: string;
  originalPrice: string;
  discountedPrice: string;
}

// Search Payload CMS: iterate all camps and their dates arrays for a matching registrationId
async function findInPayload(registrationId: string): Promise<MatchedData | null> {
  try {
    const payload = await getPayloadClient();
    const result = await payload.find({
      collection: "camps",
      limit: 200,
      depth: 0,
    });

    for (const doc of result.docs) {
      const dates: any[] = (doc as any).dates ?? [];
      const match = dates.find((d) => String(d.registrationId) === registrationId);
      if (match) {
        return {
          campName: (doc as any).name ?? "",
          campLocation: (doc as any).location ?? "",
          dateStart: match.start ?? "",
          dateEnd: match.end ?? "",
          originalPrice: match.originalPrice ?? "",
          discountedPrice: match.discountedPrice ?? match.originalPrice ?? "",
        };
      }
    }
  } catch {
    // Payload unavailable — fall through to hardcoded data
  }
  return null;
}

// Search hardcoded data files for a matching registrationId
function findInHardcoded(registrationIdNum: number): MatchedData | null {
  for (const camp of allCamps) {
    const details = getCampDetails(camp.id);
    if (!details) continue;
    const date = details.section5.dates.find(
      (d) => d.registrationId === registrationIdNum,
    );
    if (date) {
      return {
        campName: details.name,
        campLocation: details.location,
        dateStart: date.start,
        dateEnd: date.end,
        originalPrice: date.originalPrice,
        discountedPrice: date.discountedPrice,
      };
    }
  }
  return null;
}

export default async function RegistrationPage({
  params,
}: {
  params: Promise<{ registrationId: string }>;
}) {
  const { registrationId } = await params;

  // 1. Try Payload first
  let data = await findInPayload(registrationId);

  // 2. Fall back to hardcoded files
  if (!data) {
    data = findInHardcoded(parseInt(registrationId, 10));
  }

  // 3. 404
  if (!data) {
    return (
      <div className="min-h-screen flex flex-col bg-white">
        <TopBar />
        <Header />
        <main className="flex-grow flex items-center justify-center px-6">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-bombovo-dark mb-6">
              Táto rezervácia neexistuje
            </h1>
            <Link href="/letne-tabory">
              <button className="px-8 py-4 bg-bombovo-yellow text-bombovo-dark font-bold text-lg rounded-3xl hover:translate-y-0.5 transition-transform duration-150">
                Späť na letné tábory
              </button>
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <RegistrationClient
      campName={data.campName}
      campLocation={data.campLocation}
      dateStart={data.dateStart}
      dateEnd={data.dateEnd}
      originalPrice={data.originalPrice}
      discountedPrice={data.discountedPrice}
    />
  );
}
