'use client';

import { useState } from 'react';
import { BadgeStyle, BadgeBrief } from '@/lib/types';
import Image from 'next/image';
import Link from 'next/link';

export default function CreateBadgePage() {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    style: 'round-medal-minimal' as BadgeStyle,
  });
  
  const [brief, setBrief] = useState<BadgeBrief | null>(null);
  const [badge, setBadge] = useState<any>(null);
  
  const [awardData, setAwardData] = useState({
    personName: '',
    personHandle: '',
    personTitle: '',
    personAvatar: '',
    projectName: '',
    projectDesc: '',
    citation: '',
  });
  
  const [publishedAward, setPublishedAward] = useState<any>(null);

  const handlePreview = async () => {
    setLoading(true);
    setError('');
    
    try {
      const response = await fetch('/api/admin/preview-prompt', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      
      if (!response.ok) throw new Error('Failed to generate preview');
      
      const data = await response.json();
      setBrief(data);
      setStep(2);
    } catch (err) {
      setError('Failed to generate preview. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleGenerate = async () => {
    setLoading(true);
    setError('');
    
    try {
      const response = await fetch('/api/admin/generate-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          style: formData.style,
          brief,
          createdBy: 'admin',
        }),
      });
      
      if (!response.ok) throw new Error('Failed to generate badge');
      
      const data = await response.json();
      setBadge(data.badge);
      setStep(3);
    } catch (err) {
      setError('Failed to generate badge. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handlePublish = async () => {
    setLoading(true);
    setError('');
    
    try {
      const response = await fetch('/api/admin/publish-award', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          badge_id: badge.id,
          person: {
            name: awardData.personName,
            handle: awardData.personHandle || undefined,
            title: awardData.personTitle || undefined,
            avatar_url: awardData.personAvatar || undefined,
          },
          project: {
            name: awardData.projectName,
            short_desc: awardData.projectDesc,
          },
          citation: awardData.citation,
        }),
      });
      
      if (!response.ok) throw new Error('Failed to publish award');
      
      const data = await response.json();
      setPublishedAward(data);
      setStep(4);
    } catch (err) {
      setError('Failed to publish award. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-badge-background to-white">
      <div className="container mx-auto px-4 py-16 max-w-4xl">
        <h1 className="text-4xl font-bold text-badge-primary mb-8 text-center">
          Create Achievement Badge
        </h1>
        
        <div className="bg-white rounded-xl shadow-xl p-8">
          <div className="flex justify-between mb-8">
            {[1, 2, 3, 4].map((num) => (
              <div
                key={num}
                className={`flex items-center ${num < 4 ? 'flex-1' : ''}`}
              >
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
                    step >= num
                      ? 'bg-badge-accent text-white'
                      : 'bg-gray-200 text-gray-500'
                  }`}
                >
                  {num}
                </div>
                {num < 4 && (
                  <div
                    className={`flex-1 h-1 mx-2 ${
                      step > num ? 'bg-badge-accent' : 'bg-gray-200'
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
          
          {error && (
            <div className="bg-red-50 text-red-600 px-4 py-3 rounded-lg mb-6">
              {error}
            </div>
          )}
          
          {step === 1 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-semibold mb-4">Badge Details</h2>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Badge Name
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-badge-accent focus:border-transparent"
                  placeholder="e.g., Code Warrior, Design Master"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Project Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-badge-accent focus:border-transparent"
                  rows={4}
                  placeholder="Describe what this badge represents..."
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Badge Style
                </label>
                <select
                  value={formData.style}
                  onChange={(e) => setFormData({ ...formData, style: e.target.value as BadgeStyle })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-badge-accent focus:border-transparent"
                >
                  <option value="round-medal-minimal">Round Medal (Minimal)</option>
                  <option value="shield-crest-modern">Shield Crest (Modern)</option>
                  <option value="ribbon-plaque">Ribbon Plaque</option>
                </select>
              </div>
              
              <button
                onClick={handlePreview}
                disabled={loading || !formData.name || !formData.description}
                className="w-full py-3 bg-badge-accent text-white rounded-lg hover:bg-amber-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Generating Preview...' : 'Generate Preview'}
              </button>
            </div>
          )}
          
          {step === 2 && brief && (
            <div className="space-y-6">
              <h2 className="text-2xl font-semibold mb-4">Preview Brief</h2>
              
              <div className="bg-gray-50 rounded-lg p-6 space-y-4">
                <div>
                  <span className="font-semibold">Title:</span> {brief.short_title}
                </div>
                <div>
                  <span className="font-semibold">Icon Concept:</span> {brief.icon_concept}
                </div>
                <div>
                  <span className="font-semibold">Colors:</span>
                  <div className="flex gap-4 mt-2">
                    <div className="flex items-center gap-2">
                      <div
                        className="w-8 h-8 rounded"
                        style={{ backgroundColor: brief.colors.primary }}
                      />
                      <span className="text-sm">Primary</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div
                        className="w-8 h-8 rounded"
                        style={{ backgroundColor: brief.colors.accent }}
                      />
                      <span className="text-sm">Accent</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div
                        className="w-8 h-8 rounded border"
                        style={{ backgroundColor: brief.colors.bg }}
                      />
                      <span className="text-sm">Background</span>
                    </div>
                  </div>
                </div>
                <div>
                  <span className="font-semibold">Image Prompt:</span>
                  <p className="mt-1 text-gray-600">{brief.image_prompt}</p>
                </div>
              </div>
              
              <div className="flex gap-4">
                <button
                  onClick={() => setStep(1)}
                  className="flex-1 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                >
                  Back
                </button>
                <button
                  onClick={handleGenerate}
                  disabled={loading}
                  className="flex-1 py-3 bg-badge-primary text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Generating Badge...' : 'Generate Badge'}
                </button>
              </div>
            </div>
          )}
          
          {step === 3 && badge && (
            <div className="space-y-6">
              <h2 className="text-2xl font-semibold mb-4">Award Badge</h2>
              
              <div className="flex justify-center mb-6">
                <div className="relative w-64 h-64">
                  <Image
                    src={badge.thumb_blob_url}
                    alt={badge.name}
                    fill
                    className="object-contain"
                  />
                </div>
              </div>
              
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Recipient Name*
                  </label>
                  <input
                    type="text"
                    value={awardData.personName}
                    onChange={(e) => setAwardData({ ...awardData, personName: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-badge-accent focus:border-transparent"
                    placeholder="John Doe"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Handle
                  </label>
                  <input
                    type="text"
                    value={awardData.personHandle}
                    onChange={(e) => setAwardData({ ...awardData, personHandle: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-badge-accent focus:border-transparent"
                    placeholder="johndoe"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Title
                  </label>
                  <input
                    type="text"
                    value={awardData.personTitle}
                    onChange={(e) => setAwardData({ ...awardData, personTitle: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-badge-accent focus:border-transparent"
                    placeholder="Senior Developer"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Avatar URL
                  </label>
                  <input
                    type="url"
                    value={awardData.personAvatar}
                    onChange={(e) => setAwardData({ ...awardData, personAvatar: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-badge-accent focus:border-transparent"
                    placeholder="https://..."
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Project Name*
                  </label>
                  <input
                    type="text"
                    value={awardData.projectName}
                    onChange={(e) => setAwardData({ ...awardData, projectName: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-badge-accent focus:border-transparent"
                    placeholder="Amazing App"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Project Description*
                  </label>
                  <input
                    type="text"
                    value={awardData.projectDesc}
                    onChange={(e) => setAwardData({ ...awardData, projectDesc: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-badge-accent focus:border-transparent"
                    placeholder="A revolutionary mobile app"
                    required
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Citation*
                </label>
                <textarea
                  value={awardData.citation}
                  onChange={(e) => setAwardData({ ...awardData, citation: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-badge-accent focus:border-transparent"
                  rows={3}
                  placeholder="For exceptional contribution to..."
                  required
                />
              </div>
              
              <button
                onClick={handlePublish}
                disabled={loading || !awardData.personName || !awardData.projectName || !awardData.projectDesc || !awardData.citation}
                className="w-full py-3 bg-badge-primary text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Publishing Award...' : 'Publish Award'}
              </button>
            </div>
          )}
          
          {step === 4 && publishedAward && (
            <div className="space-y-6 text-center">
              <div className="text-6xl mb-4">🎉</div>
              <h2 className="text-2xl font-semibold mb-4">Award Published!</h2>
              
              <p className="text-gray-600 mb-6">
                The award has been successfully published and is now live.
              </p>
              
              <div className="bg-gray-50 rounded-lg p-6">
                <p className="text-sm text-gray-600 mb-2">Share URL:</p>
                <p className="font-mono text-sm break-all">{publishedAward.shareUrl}</p>
              </div>
              
              <div className="flex gap-4">
                <Link
                  href={`/a/${publishedAward.permalink}`}
                  className="flex-1 py-3 bg-badge-primary text-white rounded-lg hover:bg-blue-700 transition-colors text-center"
                >
                  View Award
                </Link>
                <button
                  onClick={() => {
                    setStep(1);
                    setBrief(null);
                    setBadge(null);
                    setPublishedAward(null);
                    setFormData({
                      name: '',
                      description: '',
                      style: 'round-medal-minimal',
                    });
                    setAwardData({
                      personName: '',
                      personHandle: '',
                      personTitle: '',
                      personAvatar: '',
                      projectName: '',
                      projectDesc: '',
                      citation: '',
                    });
                  }}
                  className="flex-1 py-3 bg-badge-accent text-white rounded-lg hover:bg-amber-600 transition-colors"
                >
                  Create Another
                </button>
              </div>
            </div>
          )}
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