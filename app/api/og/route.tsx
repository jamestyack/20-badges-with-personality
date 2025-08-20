import { ImageResponse } from '@vercel/og';
import { NextRequest } from 'next/server';
import { getAwardWithDetails } from '@/lib/db';

export const runtime = 'edge';

const interBold = fetch(
  new URL('../../../public/fonts/Inter-Bold.ttf', import.meta.url)
).then((res) => res.arrayBuffer());

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const permalink = searchParams.get('permalink');
    
    if (!permalink) {
      return new Response('Missing permalink', { status: 400 });
    }
    
    const award = await getAwardWithDetails(permalink);
    
    if (!award) {
      return new Response('Award not found', { status: 404 });
    }
    
    const fontData = await interBold;
    
    return new ImageResponse(
      (
        <div
          style={{
            height: '100%',
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#F8FAFC',
            backgroundImage: 'linear-gradient(to bottom right, #F8FAFC, #E2E8F0)',
          }}
        >
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 32,
            }}
          >
            <img
              src={award.thumb_blob_url}
              alt={award.badge_name}
              width={300}
              height={300}
              style={{
                borderRadius: 24,
                boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
              }}
            />
            
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 16,
                textAlign: 'center',
                maxWidth: 600,
              }}
            >
              <h1
                style={{
                  fontSize: 48,
                  fontWeight: 700,
                  color: '#1E3A8A',
                  margin: 0,
                  fontFamily: 'Inter',
                }}
              >
                {award.badge_name}
              </h1>
              
              <p
                style={{
                  fontSize: 28,
                  color: '#64748B',
                  margin: 0,
                }}
              >
                Awarded to {award.person_name}
              </p>
              
              <p
                style={{
                  fontSize: 24,
                  color: '#94A3B8',
                  margin: 0,
                }}
              >
                {award.project_name}
              </p>
              
              <p
                style={{
                  fontSize: 20,
                  color: '#64748B',
                  margin: 0,
                  marginTop: 8,
                  fontStyle: 'italic',
                }}
              >
                &quot;{award.citation}&quot;
              </p>
            </div>
          </div>
          
          <div
            style={{
              position: 'absolute',
              bottom: 40,
              fontSize: 18,
              color: '#94A3B8',
            }}
          >
            Badges with Personality
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
        fonts: [
          {
            name: 'Inter',
            data: fontData,
            style: 'normal',
            weight: 700,
          },
        ],
      }
    );
  } catch (error) {
    console.error('OG image error:', error);
    return new Response('Failed to generate image', { status: 500 });
  }
}