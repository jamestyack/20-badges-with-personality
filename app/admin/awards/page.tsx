import { getAllBadges, getAllPeople, getAllProjects } from '@/lib/db';
import Link from 'next/link';
import Image from 'next/image';

export const metadata = {
  title: 'Manage Awards | Admin',
  description: 'Manage badges and awards',
};

export default async function ManageAwardsPage() {
  const [badges, people, projects] = await Promise.all([
    getAllBadges(),
    getAllPeople(),
    getAllProjects(),
  ]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-badge-background to-white">
      <div className="container mx-auto px-4 py-16">
        <h1 className="text-4xl font-bold text-badge-primary mb-8 text-center">
          Manage Awards
        </h1>
        
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-2xl font-semibold mb-4 text-badge-primary">
              Badges ({badges.length})
            </h2>
            <div className="space-y-4 max-h-96 overflow-y-auto">
              {badges.length === 0 ? (
                <p className="text-gray-500">No badges created yet</p>
              ) : (
                badges.map((badge) => (
                  <div key={badge.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <div className="relative w-16 h-16 flex-shrink-0">
                      <Image
                        src={badge.thumb_blob_url}
                        alt={badge.name}
                        fill
                        className="object-contain"
                        sizes="64px"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold truncate">{badge.name}</p>
                      <p className="text-sm text-gray-500">{badge.style_key}</p>
                      <p className="text-xs text-gray-400">
                        {new Date(badge.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>
            <Link
              href="/admin/create"
              className="mt-4 block text-center py-2 bg-badge-accent text-white rounded-lg hover:bg-amber-600 transition-colors"
            >
              Create New Badge
            </Link>
          </div>
          
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-2xl font-semibold mb-4 text-badge-primary">
              People ({people.length})
            </h2>
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {people.length === 0 ? (
                <p className="text-gray-500">No recipients yet</p>
              ) : (
                people.map((person) => (
                  <div key={person.id} className="p-3 bg-gray-50 rounded-lg">
                    <p className="font-semibold">{person.name}</p>
                    {person.handle && (
                      <p className="text-sm text-gray-500">@{person.handle}</p>
                    )}
                    {person.title && (
                      <p className="text-sm text-gray-600">{person.title}</p>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-2xl font-semibold mb-4 text-badge-primary">
              Projects ({projects.length})
            </h2>
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {projects.length === 0 ? (
                <p className="text-gray-500">No projects yet</p>
              ) : (
                projects.map((project) => (
                  <div key={project.id} className="p-3 bg-gray-50 rounded-lg">
                    <p className="font-semibold">{project.name}</p>
                    <p className="text-sm text-gray-600">{project.short_desc}</p>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
        
        <div className="mt-12 bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-2xl font-semibold mb-4 text-badge-primary">
            Quick Stats
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center">
              <p className="text-4xl font-bold text-badge-accent">{badges.length}</p>
              <p className="text-gray-600">Total Badges</p>
            </div>
            <div className="text-center">
              <p className="text-4xl font-bold text-badge-primary">{people.length}</p>
              <p className="text-gray-600">Recipients</p>
            </div>
            <div className="text-center">
              <p className="text-4xl font-bold text-green-600">{projects.length}</p>
              <p className="text-gray-600">Projects</p>
            </div>
          </div>
        </div>
        
        <div className="mt-8 text-center">
          <Link
            href="/hof"
            className="text-badge-primary hover:underline"
          >
            ← View Hall of Fame
          </Link>
        </div>
      </div>
    </div>
  );
}