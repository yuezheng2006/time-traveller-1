/**
 * Time Traveller Male Showcase Image Generator
 * Uses Celebrity reference images from Wikimedia Commons for stable, high-quality masculine references
 * Usage: GEMINI_API_KEY=your_key npx tsx scripts/generateMaleShowcase.ts
 */

import { GoogleGenAI } from '@google/genai';
import * as fs from 'fs';
import * as path from 'path';

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

if (!GEMINI_API_KEY) {
  console.error('❌ GEMINI_API_KEY environment variable is required');
  console.log('Usage: GEMINI_API_KEY=your_key npx tsx scripts/generateMaleShowcase.ts');
  process.exit(1);
}

const ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY });

const OUTPUT_DIR = path.join(__dirname, '../frontend/assets/showcase');

// Celebrity reference images from Wikimedia Commons for stable, high-quality masculine references
const REFERENCE_IMAGES = {
  elon_musk: 'https://upload.wikimedia.org/wikipedia/commons/e/ed/Elon_Musk_Royal_Society.jpg',
  keanu_reeves: 'https://upload.wikimedia.org/wikipedia/commons/9/90/Keanu_Reeves_%28crop_and_levels%29_%28cropped%29.jpg',
};

const maleShowcaseImages = [
  {
    filename: 'male-tokyo-ramen-night.png',
    referenceUrl: REFERENCE_IMAGES.elon_musk,
    prompt: `Using the reference photo of Elon Musk, create a hyper-realistic candid photo of him enjoying ramen at a tiny Tokyo ramen shop at night. He's sitting at the counter, chopsticks in hand, steam rising from the bowl. Warm yellow lighting from paper lanterns. He looks like a visionary entrepreneur taking a break. Authentic izakaya atmosphere. 8K resolution, candid smartphone photography aesthetic. Maintain his iconic facial features and billionaire charisma.`,
  },
  {
    filename: 'male-seoul-street-food.png',
    referenceUrl: REFERENCE_IMAGES.keanu_reeves,
    prompt: `Using the reference photo of Keanu Reeves, create a hyper-realistic candid photo of him at a Seoul pojangmacha (street tent bar) at night. He's eating Korean BBQ and looking relaxed. Red and orange tent lighting, steam from cooking. He has a rugged, handsome, and mature masculine look. 8K resolution, raw candid style. Maintain his famous facial structure and charismatic presence.`,
  },
  {
    filename: 'male-cyberpunk-tokyo.png',
    referenceUrl: REFERENCE_IMAGES.keanu_reeves,
    prompt: `Using the reference photo of Keanu Reeves, create a hyper-realistic cyberpunk image of him in Neo-Tokyo 2099. He's wearing a sleek cyber-enhanced tactical jacket. Massive holographic advertisements, neon-lit skyscrapers. Rain-slicked streets. He looks like a legendary action hero from a sci-fi epic. 8K resolution, cinematic. Maintain his iconic stoic and masculine appearance.`,
  },
  {
    filename: 'male-mars-colony.png',
    referenceUrl: REFERENCE_IMAGES.elon_musk,
    prompt: `Using the reference photo of Elon Musk, create a photorealistic image of him as the lead visionary inside a Mars colony biodome in 2150. Red Martian landscape visible through the dome. He's wearing a sleek SpaceX commander jumpsuit. He looks determined and heroic. 8K resolution. Maintain his strong facial features and pioneering aura.`,
  },
  {
    filename: 'male-paris-cafe.png',
    referenceUrl: REFERENCE_IMAGES.elon_musk,
    prompt: `Using the reference photo of Elon Musk, create a hyper-realistic candid photo of him at a Parisian café terrace. He's wearing a sophisticated tailored outfit, enjoying an espresso. Eiffel Tower in background. Golden hour lighting. He looks like a global tech icon on a European getaway. 8K resolution, high-end lifestyle photography. Maintain his sharp masculine profile.`,
  },
  {
    filename: 'male-1920s-jazz.png',
    referenceUrl: REFERENCE_IMAGES.keanu_reeves,
    prompt: `Using the reference photo of Keanu Reeves, create a vintage-style photo of him in 1920s Paris during the Jazz Age. He's wearing a sharp period-accurate tailored suit at a smoky jazz club. Sepia tones, film grain. He looks like a powerful, mysterious gentleman from that era. 8K resolution. Maintain his distinct facial features and legendary elegance.`,
  },
  {
    filename: 'male-tokyo-city-pop.png',
    referenceUrl: REFERENCE_IMAGES.elon_musk,
    prompt: `Using the reference photo of Elon Musk, create a retro 1980s Japanese City Pop aesthetic image. He's in 80s Tokyo fashion at a neon-lit disco. Mirror ball reflections, pastel colors. VHS quality grain, soft glow. He looks like a cool, innovative star from an 80s movie. Authentic 80s Japanese bubble era aesthetic. Maintain his facial features.`,
  },
  {
    filename: 'male-midnight-hotel-grid.png',
    referenceUrl: REFERENCE_IMAGES.keanu_reeves,
    prompt: `Using the reference photo of Keanu Reeves, create a sophisticated 3x3 cinematic contact sheet grid titled "深夜 MIDNIGHT" featuring him in a luxury Tokyo hotel room at night.
    
Row 1: 
1. His powerful silhouette looking out window at Tokyo skyline
2. Close-up of him adjusting a sharp suit in a mirror, city lights reflected
3. Walking down a long hotel corridor with a commanding expression

Row 2:
4. Lounging on a sofa, looking thoughtful and intense
5. Close-up of his face sipping whiskey
6. Extreme close-up of his hand holding the glass

Row 3:
7. Dark silhouette against the city lights
8. Extreme close-up of his focused eyes
9. Luxury watch on the table

Same celebrity throughout, moody blue and gold lighting. Japanese title typography. Maintain his distinct sharp masculine features.`,
  },
  {
    filename: 'male-floating-library.png',
    referenceUrl: REFERENCE_IMAGES.elon_musk,
    prompt: `Using the reference photo of Elon Musk, create a surrealist image of him in an infinite floating library. Books floating in impossible orientations. He's sitting on a floating armchair, looking like a visionary traveler of time and space. Dreamlike atmosphere. 8K resolution. Maintain his well-known intense facial structure.`,
  },
  {
    filename: 'male-ancient-samurai.png',
    referenceUrl: REFERENCE_IMAGES.keanu_reeves,
    prompt: `Using the reference photo of Keanu Reeves, create an oil painting style image of him as a legendary samurai warrior in feudal Japan. He's wearing ornate samurai armor in a cherry blossom garden. Mount Fuji in background. Classical oil painting technique. He looks like a noble and powerful warrior. Maintain his iconic facial features in the painting style.`,
  },
  {
    filename: 'male-magazine-cover.png',
    referenceUrl: REFERENCE_IMAGES.keanu_reeves,
    prompt: `Using the reference photo of Keanu Reeves, create a high-end fashion magazine cover (like GQ or Vogue Hommes) featuring him. He's wearing a sophisticated designer suit, looking directly at the camera with a mysterious and intense gaze. High-contrast studio lighting, sharp focus. Modern magazine layout with elegant typography. He looks like a world-class icon and style leader. 8K resolution, professional editorial photography. Maintain his iconic facial features and charismatic presence.`,
  },
];

async function fetchImageAsBase64(url: string): Promise<{ data: string; mimeType: string } | null> {
  try {
    console.log(`   📥 Fetching reference: ${url.split('/').pop()}...`);
    const response = await fetch(url);
    if (!response.ok) {
      console.log(`   ⚠️ Failed to fetch: ${response.status}`);
      return null;
    }
    const arrayBuffer = await response.arrayBuffer();
    const base64 = Buffer.from(arrayBuffer).toString('base64');
    const contentType = response.headers.get('content-type') || 'image/jpeg';
    return { data: base64, mimeType: contentType };
  } catch (error) {
    console.log(`   ⚠️ Failed to fetch reference image: ${error}`);
    return null;
  }
}

async function generateImage(config: typeof maleShowcaseImages[0]): Promise<string | null> {
  console.log(`\n🎨 Generating: ${config.filename}`);
  
  try {
    const parts: Array<{ text?: string; inlineData?: { data: string; mimeType: string } }> = [];
    
    // Fetch reference image
    const refImage = await fetchImageAsBase64(config.referenceUrl);
    if (refImage) {
      parts.push({
        inlineData: {
          data: refImage.data,
          mimeType: refImage.mimeType
        }
      });
      console.log(`   📷 Reference image loaded`);
    } else {
      console.log(`   ⚠️ No reference image, skipping...`);
      return null;
    }
    
    parts.push({ text: config.prompt });

    let response;
    
    try {
      // Primary: Gemini 3 Pro (Nano Banana Pro) - highest quality
      console.log(`   🔄 Using gemini-3-pro-image-preview (Nano Banana Pro)...`);
      response = await ai.models.generateContent({
        model: 'gemini-3-pro-image-preview',
        contents: { parts },
        config: {
          responseModalities: ['Text', 'Image'],
          imageConfig: {
            aspectRatio: '16:9',
            imageSize: '2K',
          },
        },
      });
    } catch (proError: any) {
      console.log(`   ⚠️ Pro model failed: ${proError.message?.substring(0, 80)}...`);
      try {
        // Fallback: Gemini 2.5 Flash (Nano Banana)
        console.log(`   🔄 Fallback to gemini-2.5-flash-image...`);
        response = await ai.models.generateContent({
          model: 'gemini-2.5-flash-image',
          contents: { parts },
        });
      } catch (flashError: any) {
        console.log(`   ❌ Fallback also failed: ${flashError.message?.substring(0, 80)}...`);
        return null;
      }
    }

    const candidates = (response as any).candidates;
    if (!candidates?.[0]?.content?.parts) {
      console.log(`   ⚠️ No response parts`);
      return null;
    }

    for (const part of candidates[0].content.parts) {
      if (part.inlineData?.data) {
        const imageData = part.inlineData.data;
        const filePath = path.join(OUTPUT_DIR, config.filename);
        
        if (!fs.existsSync(OUTPUT_DIR)) {
          fs.mkdirSync(OUTPUT_DIR, { recursive: true });
        }
        
        fs.writeFileSync(filePath, Buffer.from(imageData, 'base64'));
        console.log(`   ✅ Saved: ${config.filename}`);
        return filePath;
      }
    }
    
    for (const part of candidates[0].content.parts) {
      if (part.text) {
        console.log(`   📝 Model response: ${part.text.substring(0, 100)}...`);
      }
    }
    
    console.log(`   ⚠️ No image data found`);
    return null;
  } catch (error: any) {
    console.error(`   ❌ Error: ${error.message || error}`);
    return null;
  }
}

async function main() {
  console.log('🚀 Male Showcase Image Generator (Celebrity Edition)');
  console.log('====================================================');
  console.log(`📁 Output: ${OUTPUT_DIR}`);
  console.log(`📷 Images to generate: ${maleShowcaseImages.length}\n`);
  
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  }
  
  const results: { success: string[]; failed: string[] } = { success: [], failed: [] };
  
  for (let i = 0; i < maleShowcaseImages.length; i++) {
    const config = maleShowcaseImages[i];
    console.log(`\n[${i + 1}/${maleShowcaseImages.length}]`);
    
    const result = await generateImage(config);
    if (result) {
      results.success.push(config.filename);
    } else {
      results.failed.push(config.filename);
    }
    
    if (i < maleShowcaseImages.length - 1) {
      console.log('   ⏳ Waiting 5s to avoid rate limits...');
      await new Promise(resolve => setTimeout(resolve, 5000));
    }
  }
  
  console.log('\n====================================================');
  console.log(`📊 Complete! ✅ ${results.success.length}/${maleShowcaseImages.length} | ❌ ${results.failed.length}`);
  
  if (results.success.length > 0) {
    console.log('\n✅ Generated:');
    results.success.forEach(f => console.log(`   - ${f}`));
  }
  
  if (results.failed.length > 0) {
    console.log('\n❌ Failed:');
    results.failed.forEach(f => console.log(`   - ${f}`));
  }
}

main().catch(console.error);
