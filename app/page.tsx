import Link from 'next/link';

export default function HomePage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-badge-background to-white">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-5xl font-bold text-badge-primary mb-6">
            Badges with Personality
          </h1>
          <p className="text-xl text-gray-600 mb-12">
            AI-generated achievement badges for celebrating your project milestones
          </p>
          <div className="flex gap-4 justify-center">
            <Link
              href="/hof"
              className="px-8 py-3 bg-badge-primary text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              View Hall of Fame
            </Link>
            <Link
              href="/admin/create"
              className="px-8 py-3 bg-badge-accent text-white rounded-lg hover:bg-amber-600 transition-colors"
            >
              Create Badge
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}