import { getAwardWithDetails } from '@/lib/db';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import ShareButton from './share-button';

export const dynamic = 'force-dynamic';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const award = await getAwardWithDetails(slug);
  
  if (!award) {
    return {
      title: 'Award Not Found',
    };
  }
  
  const ogImageUrl = `${process.env.NEXT_PUBLIC_BASE_URL || ''}/api/og?permalink=${slug}`;
  
  return {
    title: `${award.badge_name} - ${award.person_name} | Badges with Personality`,
    description: award.citation,
    openGraph: {
      title: award.badge_name,
      description: `Awarded to ${award.person_name} for ${award.project_name}`,
      images: [ogImageUrl],
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: award.badge_name,
      description: `Awarded to ${award.person_name} for ${award.project_name}`,
      images: [ogImageUrl],
    },
  };
}

export default async function AchievementPage({ params }: PageProps) {
  const { slug } = await params;
  const award = await getAwardWithDetails(slug);
  
  if (!award) {
    notFound();
  }
  
  const shareUrl = `${process.env.NEXT_PUBLIC_BASE_URL || ''}/a/${slug}`;
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-badge-background to-white">
      <div className="container mx-auto px-4 py-16 max-w-4xl">
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
          <div className="bg-gradient-to-r from-badge-primary to-blue-600 p-8 text-white text-center">
            <h1 className="text-3xl font-bold mb-2">Achievement Unlocked!</h1>
            <p className="text-blue-100">Certificate of Excellence</p>
          </div>
          
          <div className="p-8 md:p-12">
            <div className="flex flex-col items-center">
              <div className="relative w-64 h-64 md:w-80 md:h-80 mb-8 animate-scale-in">
                <Image
                  src={award.image_blob_url}
                  alt={award.badge_name}
                  fill
                  className="object-contain drop-shadow-2xl"
                  priority
                  sizes="(max-width: 768px) 256px, 320px"
                />
              </div>
              
              <h2 className="text-4xl font-bold text-badge-primary mb-6">
                {award.badge_name}
              </h2>
              
              <div className="text-center space-y-4 mb-8">
                <div>
                  <p className="text-gray-600 text-sm uppercase tracking-wide mb-1">
                    Awarded To
                  </p>
                  <p className="text-2xl font-semibold text-gray-900">
                    {award.person_name}
                  </p>
                  {award.person_handle && (
                    <p className="text-gray-500">@{award.person_handle}</p>
                  )}
                  {award.person_title && (
                    <p className="text-gray-600 italic">{award.person_title}</p>
                  )}
                </div>
                
                <div>
                  <p className="text-gray-600 text-sm uppercase tracking-wide mb-1">
                    For Project
                  </p>
                  <p className="text-xl font-semibold text-gray-900">
                    {award.project_name}
                  </p>
                  <p className="text-gray-600 mt-1">{award.project_desc}</p>
                </div>
                
                <div className="pt-4 border-t border-gray-200">
                  <p className="text-gray-600 text-sm uppercase tracking-wide mb-2">
                    Citation
                  </p>
                  <blockquote className="text-lg text-gray-700 italic">
                    &quot;{award.citation}&quot;
                  </blockquote>
                </div>
                
                <p className="text-gray-400 text-sm pt-4">
                  Awarded on {new Date(award.created_at).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </p>
              </div>
              
              <div className="flex flex-wrap gap-4 justify-center">
                <ShareButton shareUrl={shareUrl} />
                
                <Link
                  href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(
                    `I just received the ${award.badge_name} badge! Check it out:`
                  )}&url=${encodeURIComponent(shareUrl)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                >
                  Share on Twitter
                </Link>
                
                <Link
                  href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
                    shareUrl
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-6 py-3 bg-blue-700 text-white rounded-lg hover:bg-blue-800 transition-colors"
                >
                  Share on LinkedIn
                </Link>
              </div>
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