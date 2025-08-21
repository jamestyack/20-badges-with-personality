'use client';

import { useState } from 'react';
import { BadgeStyle, BadgeBrief } from '@/lib/types';
import { styleTemplates } from '@/lib/style-templates';
import { hackathonBadgeSuggestions, badgeCategories, getBadgesByCategory } from '@/lib/badge-suggestions';
import Image from 'next/image';
import Link from 'next/link';

export default function CreateBadgePage() {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [generationProgress, setGenerationProgress] = useState(0);
  const [actualPrompt, setActualPrompt] = useState('');
  const [showPrompt, setShowPrompt] = useState(false);
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    style: 'round-medal-minimal' as BadgeStyle,
    styleTemplate: '',
    referenceStyle: '',
    quality: 'standard' as 'standard' | 'hd',
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
  
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('');

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
    setGenerationProgress(0);
    setActualPrompt('');
    
    // Simulate progress updates
    const progressInterval = setInterval(() => {
      setGenerationProgress(prev => {
        if (prev >= 90) return prev;
        return prev + Math.random() * 15;
      });
    }, 500);
    
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
      setGenerationProgress(100);
      setBadge(data.badge);
      setActualPrompt(data.actualPrompt || '');
      setTimeout(() => {
        setStep(3);
        setGenerationProgress(0);
      }, 500);
    } catch (err) {
      setError('Failed to generate badge. Please try again.');
      setGenerationProgress(0);
    } finally {
      clearInterval(progressInterval);
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
      setStep(5);
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
              
              {/* Badge Suggestions Section */}
              <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                <button
                  type="button"
                  onClick={() => setShowSuggestions(!showSuggestions)}
                  className="flex items-center justify-between w-full text-left"
                >
                  <div>
                    <h3 className="text-lg font-medium text-blue-900">💡 Hackathon Badge Suggestions</h3>
                    <p className="text-sm text-blue-700">Click to use pre-made badges perfect for hackathons</p>
                  </div>
                  <span className="text-blue-600">
                    {showSuggestions ? '−' : '+'}
                  </span>
                </button>
                
                {showSuggestions && (
                  <div className="mt-4 space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-blue-800 mb-2">Filter by Category:</label>
                      <select
                        value={selectedCategory}
                        onChange={(e) => setSelectedCategory(e.target.value)}
                        className="w-full px-3 py-2 border border-blue-300 rounded-lg text-sm"
                      >
                        <option value="">All Categories</option>
                        {badgeCategories.map(category => (
                          <option key={category} value={category}>{category}</option>
                        ))}
                      </select>
                    </div>
                    
                    <div className="grid gap-3 max-h-64 overflow-y-auto">
                      {getBadgesByCategory(selectedCategory).map((suggestion, index) => (
                        <button
                          key={index}
                          type="button"
                          onClick={() => {
                            setFormData({
                              ...formData,
                              name: suggestion.name,
                              description: suggestion.description,
                              style: suggestion.suggestedStyle,
                              styleTemplate: suggestion.suggestedTemplate || '',
                            });
                            setShowSuggestions(false);
                          }}
                          className="text-left p-3 bg-white rounded-lg border border-blue-200 hover:border-blue-400 hover:bg-blue-50 transition-colors"
                        >
                          <div className="flex justify-between items-start">
                            <div className="flex-1">
                              <h4 className="font-medium text-blue-900">{suggestion.name}</h4>
                              <p className="text-sm text-gray-600 mt-1 line-clamp-2">{suggestion.description}</p>
                              <span className="inline-block mt-2 px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                                {suggestion.category}
                              </span>
                            </div>
                            <span className="text-blue-400 ml-2">→</span>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              
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
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Style Template (Optional)
                </label>
                <select
                  value={formData.styleTemplate}
                  onChange={(e) => setFormData({ ...formData, styleTemplate: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-badge-accent focus:border-transparent"
                >
                  <option value="">None - Use default</option>
                  {Object.values(styleTemplates).map((template) => (
                    <option key={template.id} value={template.id}>
                      {template.name} - {template.description}
                    </option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Reference Style Description (Optional)
                </label>
                <textarea
                  value={formData.referenceStyle}
                  onChange={(e) => setFormData({ ...formData, referenceStyle: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-badge-accent focus:border-transparent"
                  rows={3}
                  placeholder="Describe a reference badge style in detail..."
                />
                
                <div className="mt-2">
                  <p className="text-sm text-gray-500 mb-2">Quick examples (click to use):</p>
                  <div className="flex flex-wrap gap-2">
                    {[
                      "GitHub achievement badge: octagonal shape, dark navy background (#0d1117), bright green accent (#00ff88), monospace font, pixel-perfect edges",
                      "Apple App Store badge: rounded rectangle with subtle gradient, white background, blue accent color (#007AFF), clean San Francisco font",
                      "Steam achievement badge: hexagonal medal with metallic bronze finish, embossed details, ornate border, game logo watermark",
                      "LinkedIn skill badge: circular design, professional blue (#0077B5), white clean background, minimal sans-serif typography",
                      "Duolingo streak badge: playful cartoon style, bright green (#58CC02), rounded friendly shapes, cute mascot illustration",
                      "Microsoft certification badge: shield shape, corporate blue and silver palette, professional serif font, official seal design"
                    ].map((example, index) => (
                      <button
                        key={index}
                        type="button"
                        onClick={() => setFormData({ ...formData, referenceStyle: example })}
                        className="text-xs px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded-full text-gray-700 transition-colors"
                      >
                        {example.split(':')[0]} style
                      </button>
                    ))}
                  </div>
                </div>
                
                <p className="text-sm text-gray-500 mt-2">
                  Include details like: shape, colors (hex codes), typography, textures, lighting, and specific visual elements
                </p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Image Quality
                </label>
                <select
                  value={formData.quality}
                  onChange={(e) => setFormData({ ...formData, quality: e.target.value as 'standard' | 'hd' })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-badge-accent focus:border-transparent"
                >
                  <option value="standard">Standard (Faster)</option>
                  <option value="hd">HD (Higher Quality, Slower)</option>
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
                  <span className="font-semibold">Base Image Concept:</span>
                  <p className="mt-1 text-gray-600">{brief.image_prompt}</p>
                  <p className="mt-2 text-sm text-blue-600 bg-blue-50 px-3 py-2 rounded-lg">
                    ℹ️ When generated, this will be enhanced with:
                    <span className="block text-xs mt-1">
                      • Professional quality instructions<br/>
                      • Text rendering optimization for "{brief.short_title}"<br/>
                      • Transparent background requirements<br/>
                      • Negative prompts to prevent duplicates/fragments<br/>
                      • Composition and centering rules
                    </span>
                  </p>
                </div>
              </div>
              
              <div className="flex gap-3">
                <button
                  onClick={() => setStep(1)}
                  className="flex-1 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                >
                  ← Back to Edit
                </button>
                <button
                  onClick={handlePreview}
                  disabled={loading}
                  className="flex-1 py-3 bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Regenerating...' : 'Regenerate Preview'}
                </button>
                <button
                  onClick={handleGenerate}
                  disabled={loading}
                  className="flex-1 py-3 bg-badge-primary text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Generating Badge...' : 'Generate Badge'}
                </button>
              </div>
              
              {/* Progress Bar and Prompt Display */}
              {loading && generationProgress > 0 && (
                <div className="mt-6 space-y-4">
                  <div>
                    <div className="flex justify-between text-sm text-gray-600 mb-2">
                      <span>Generating badge with DALL-E 3...</span>
                      <span>{Math.round(generationProgress)}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                      <div 
                        className="bg-gradient-to-r from-badge-primary to-badge-accent h-full rounded-full transition-all duration-500 ease-out"
                        style={{ width: `${generationProgress}%` }}
                      />
                    </div>
                  </div>
                  <div className="text-center text-sm text-gray-500">
                    <p>Creating your unique badge design...</p>
                    <p className="text-xs mt-1">This usually takes 10-20 seconds</p>
                  </div>
                </div>
              )}
            </div>
          )}
          
          {step === 3 && badge && (
            <div className="space-y-6">
              <h2 className="text-2xl font-semibold mb-4">Review Generated Badge</h2>
              
              <div className="bg-white rounded-xl shadow-lg p-8 text-center">
                <div className="flex justify-center mb-6">
                  <div className="relative w-80 h-80">
                    <Image
                      src={badge.thumb_blob_url}
                      alt={badge.name}
                      fill
                      className="object-contain drop-shadow-lg"
                    />
                  </div>
                </div>
                
                <h3 className="text-2xl font-bold text-badge-primary mb-2">{badge.name}</h3>
                <p className="text-gray-600 mb-6">Badge generated successfully!</p>
                
                {/* Show Actual DALL-E Prompt */}
                {actualPrompt && (
                  <div className="mb-6 text-left">
                    <button
                      onClick={() => setShowPrompt(!showPrompt)}
                      className="flex items-center gap-2 text-sm text-badge-primary hover:underline mb-3"
                    >
                      <span>{showPrompt ? '▼' : '▶'}</span>
                      <span>{showPrompt ? 'Hide' : 'Show'} DALL-E Prompt</span>
                    </button>
                    {showPrompt && (
                      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 max-h-64 overflow-y-auto">
                        <pre className="text-xs text-gray-700 whitespace-pre-wrap font-mono">
                          {actualPrompt}
                        </pre>
                      </div>
                    )}
                  </div>
                )}
                
                <div className="flex gap-3 justify-center">
                  <button
                    onClick={() => {
                      setStep(1);
                      setBadge(null); // Clear the badge so user can start over
                    }}
                    className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                  >
                    ← Back to Edit
                  </button>
                  <button
                    onClick={() => {
                      // Regenerate with same settings
                      setShowPrompt(false); // Hide prompt when regenerating
                      handleGenerate();
                    }}
                    disabled={loading}
                    className="px-6 py-3 bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition-colors disabled:opacity-50"
                  >
                    {loading ? 'Regenerating...' : 'Try Different Version'}
                  </button>
                  <button
                    onClick={() => setStep(4)}
                    className="px-6 py-3 bg-badge-primary text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    I Like It - Award This Badge →
                  </button>
                </div>
              </div>
            </div>
          )}
          
          {step === 4 && badge && (
            <div className="space-y-6">
              <h2 className="text-2xl font-semibold mb-4">Award Badge to Recipient</h2>
              
              <div className="flex justify-center mb-6">
                <div className="relative w-32 h-32">
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
              
              <div className="flex gap-3">
                <button
                  onClick={() => setStep(3)}
                  className="flex-1 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                >
                  ← Back to Badge
                </button>
                <button
                  onClick={handlePublish}
                  disabled={loading || !awardData.personName || !awardData.projectName || !awardData.projectDesc || !awardData.citation}
                  className="flex-1 py-3 bg-badge-primary text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Publishing Award...' : 'Publish Award'}
                </button>
              </div>
            </div>
          )}
          
          {step === 5 && publishedAward && (
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
                      styleTemplate: '',
                      referenceStyle: '',
                      quality: 'standard',
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