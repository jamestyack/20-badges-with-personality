import { getAllAwards } from '@/lib/db';
import Image from 'next/image';
import Link from 'next/link';

export const metadata = {
  title: 'Hall of Fame | Badges with Personality',
  description: 'View all awarded achievement badges',
};

export const revalidate = 60; // Revalidate every minute

export default async function HallOfFamePage() {
  const awards = await getAllAwards();

  return (
    <div className="min-h-screen bg-gradient-to-br from-badge-background to-white">
      <div className="container mx-auto px-4 py-16">
        <header className="text-center mb-12">
          <h1 className="text-5xl font-bold text-badge-primary mb-4">
            Hall of Fame
          </h1>
          <p className="text-xl text-gray-600">
            Celebrating exceptional achievements across our projects
          </p>
        </header>

        {awards.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-gray-500 text-lg">No awards yet. Be the first!</p>
            <Link
              href="/admin/create"
              className="inline-block mt-6 px-6 py-3 bg-badge-accent text-white rounded-lg hover:bg-amber-600 transition-colors"
            >
              Create First Badge
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {awards.map((award) => (
              <Link
                key={award.id}
                href={`/a/${award.public_permalink}`}
                className="group"
              >
                <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group-hover:scale-105">
                  <div className="aspect-square relative bg-gradient-to-br from-gray-50 to-gray-100 p-8">
                    <Image
                      src={award.thumb_blob_url}
                      alt={award.badge_name}
                      fill
                      className="object-contain p-4"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                    />
                  </div>
                  <div className="p-6">
                    <h3 className="font-bold text-lg text-badge-primary mb-1">
                      {award.person_name}
                    </h3>
                    {award.person_handle && (
                      <p className="text-gray-500 text-sm mb-3">
                        @{award.person_handle}
                      </p>
                    )}
                    <p className="text-gray-700 font-medium text-sm">
                      {award.badge_name}
                    </p>
                    <p className="text-gray-600 text-sm mt-1">
                      {award.project_name}
                    </p>
                    <p className="text-gray-400 text-xs mt-3">
                      {new Date(award.created_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}

        <footer className="mt-16 text-center">
          <Link
            href="/"
            className="text-badge-primary hover:underline"
          >
            ← Back to Home
          </Link>
        </footer>
      </div>
    </div>
  );
}