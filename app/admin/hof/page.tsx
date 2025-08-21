import { getAllAwards } from '@/lib/db';
import Image from 'next/image';
import Link from 'next/link';
import DeleteButton from './delete-button';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Admin Hall of Fame | Badges with Personality',
  description: 'Manage awarded achievement badges',
};

export default async function AdminHallOfFamePage() {
  const awards = await getAllAwards();

  return (
    <div className="min-h-screen bg-gradient-to-br from-badge-background to-white">
      <div className="container mx-auto px-4 py-16">
        <header className="text-center mb-12">
          <h1 className="text-5xl font-bold text-badge-primary mb-4">
            Admin Hall of Fame
          </h1>
          <p className="text-xl text-gray-600 mb-4">
            Manage awarded badges - Click delete to remove awards
          </p>
          <div className="flex gap-4 justify-center">
            <Link
              href="/hof"
              className="px-6 py-2 bg-badge-primary text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              View Public Hall of Fame
            </Link>
            <Link
              href="/admin/awards"
              className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
            >
              Manage Badges & People
            </Link>
          </div>
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
              <div
                key={award.id}
                className="relative group"
              >
                <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden">
                  <Link href={`/a/${award.public_permalink}`}>
                    <div className="aspect-square relative bg-gradient-to-br from-gray-50 to-gray-100 p-8">
                      <Image
                        src={award.thumb_blob_url}
                        alt={award.badge_name}
                        fill
                        className="object-contain p-4"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                      />
                    </div>
                  </Link>
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
                    <div className="flex items-center justify-between mt-3">
                      <p className="text-gray-400 text-xs">
                        {new Date(award.created_at).toLocaleDateString()}
                      </p>
                      <DeleteButton 
                        awardId={award.id}
                        awardName={`${award.person_name} - ${award.badge_name}`}
                      />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        <footer className="mt-16 text-center">
          <Link
            href="/admin/create"
            className="inline-block px-6 py-3 bg-badge-accent text-white rounded-lg hover:bg-amber-600 transition-colors mr-4"
          >
            Create New Badge
          </Link>
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