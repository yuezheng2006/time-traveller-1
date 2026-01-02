/**
 * Time Traveller Diverse Showcase Image Generator
 * 生成多样化的亚洲和欧美人物形象展示图片
 * Usage: GEMINI_API_KEY=your_key npx tsx scripts/generateDiverseShowcase.ts
 */

import { GoogleGenAI } from '@google/genai';
import * as fs from 'fs';
import * as path from 'path';

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

if (!GEMINI_API_KEY) {
  console.error('❌ GEMINI_API_KEY environment variable is required');
  console.log('Usage: GEMINI_API_KEY=your_key npx tsx scripts/generateDiverseShowcase.ts');
  process.exit(1);
}

const ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY });

const ASSETS_DIR = path.join(__dirname, '../frontend/assets');
const OUTPUT_DIR = path.join(__dirname, '../frontend/assets/showcase');

// 参考图片路径
const FEMALE_REF = path.join(ASSETS_DIR, '3x3-grid.png');
// 男性参考图片URL（来自Supabase）
const MALE_REF_URL = 'https://lbqobnxmewwmeqdodger.supabase.co/storage/v1/object/public/time-traveller-images/teleport-907e526a-0cf1-4d06-bb8d-fa1894f98094-1764593060893/reference-1764593060893.jpg';

interface ShowcaseImage {
  filename: string;
  type: 'asian-female' | 'asian-male' | 'western-female' | 'western-male';
  destination: string;
  style: string;
  prompt: string;
}

// 多样化的展示图片配置
const showcaseImages: ShowcaseImage[] = [
  // 亚洲女性 - 更多场景
  {
    filename: 'female-asian-bangkok-temple.png',
    type: 'asian-female',
    destination: 'Bangkok Temple',
    style: 'Travel Photography',
    prompt: `The reference image shows a 3x3 grid of the SAME Asian woman with black hair making various expressions. Use her EXACT face, features, and appearance.

Create a stunning travel photograph of THIS EXACT ASIAN WOMAN at the Wat Pho Temple in Bangkok, Thailand.
She's wearing a traditional Thai-style dress, respectfully exploring the temple grounds.
Golden Buddha statues and intricate Thai architecture in the background.
Warm afternoon sunlight filtering through temple structures.
Style: Professional travel photography, vibrant colors, cultural authenticity, 8K resolution.
CRITICAL: Use the EXACT same woman from the 3x3 grid - same face, eyes, nose, lips, black hair.`
  },
  {
    filename: 'female-asian-singapore-marina.png',
    type: 'asian-female',
    destination: 'Singapore Marina Bay',
    style: 'Urban Modern',
    prompt: `The reference image shows a 3x3 grid of the SAME Asian woman with black hair making various expressions. Use her EXACT face, features, and appearance.

Create a modern urban photograph of THIS EXACT ASIAN WOMAN at Marina Bay, Singapore.
She's at the famous infinity pool or waterfront, modern skyscrapers and the Marina Bay Sands in background.
Wearing contemporary fashion, looking at the camera with a confident smile.
Golden hour lighting reflecting off the water and glass buildings.
Style: Modern lifestyle photography, clean lines, sophisticated urban aesthetic, high resolution.
CRITICAL: Use the EXACT same woman from the 3x3 grid - same face, eyes, nose, lips, black hair.`
  },
  {
    filename: 'female-asian-taipei-night-market.png',
    type: 'asian-female',
    destination: 'Taipei Night Market',
    style: 'Street Food',
    prompt: `The reference image shows a 3x3 grid of the SAME Asian woman with black hair making various expressions. Use her EXACT face, features, and appearance.

Create a vibrant night market photograph of THIS EXACT ASIAN WOMAN at Shilin Night Market in Taipei, Taiwan.
She's holding bubble tea or stinky tofu, surrounded by colorful food stalls.
Neon signs in Traditional Chinese characters, steam rising from vendors.
Excited expression, enjoying the lively atmosphere.
Style: Street photography, vibrant neon lighting, candid lifestyle, high energy.
CRITICAL: Use the EXACT same woman from the 3x3 grid - same face, eyes, nose, lips, black hair.`
  },
  {
    filename: 'female-asian-shanghai-bund.png',
    type: 'asian-female',
    destination: 'Shanghai The Bund',
    style: 'Cityscape',
    prompt: `The reference image shows a 3x3 grid of the SAME Asian woman with black hair making various expressions. Use her EXACT face, features, and appearance.

Create an elegant cityscape photograph of THIS EXACT ASIAN WOMAN at The Bund in Shanghai, China.
She's wearing modern fashion, looking across the Huangpu River at the futuristic Pudong skyline.
Historic colonial architecture behind her, modern skyscrapers across the water.
Blue hour lighting, city lights reflecting on the water.
Style: Sophisticated urban photography, dramatic lighting, cosmopolitan aesthetic, 8K resolution.
CRITICAL: Use the EXACT same woman from the 3x3 grid - same face, eyes, nose, lips, black hair.`
  },
  {
    filename: 'female-asian-bali-waterfall.png',
    type: 'asian-female',
    destination: 'Bali Waterfall',
    style: 'Nature Adventure',
    prompt: `The reference image shows a 3x3 grid of the SAME Asian woman with black hair making various expressions. Use her EXACT face, features, and appearance.

Create an adventurous nature photograph of THIS EXACT ASIAN WOMAN at a stunning waterfall in Bali, Indonesia.
She's standing near the waterfall, wearing a flowy dress or swimwear.
Tropical jungle, lush greenery, cascading water in the background.
Natural daylight filtering through the jungle canopy.
Style: Adventure photography, natural lighting, tropical paradise aesthetic, high resolution.
CRITICAL: Use the EXACT same woman from the 3x3 grid - same face, eyes, nose, lips, black hair.`
  },

  // 欧美女性 - 更多场景
  {
    filename: 'female-western-london-bridge.png',
    type: 'western-female',
    destination: 'London Tower Bridge',
    style: 'Urban Classic',
    prompt: `Create a sophisticated urban photograph of a young Western woman with light hair and European features at Tower Bridge, London.
She's wearing elegant British fashion, standing near the iconic bridge.
The Thames River, classic red double-decker buses, and historic London architecture in background.
Overcast sky typical of London, soft natural lighting.
Style: Editorial travel photography, classic British aesthetic, refined urban style, 8K resolution.
The woman should have European/Western features - light brown or blonde hair, fair skin, distinctive Western facial structure.`
  },
  {
    filename: 'female-western-nyc-times-square.png',
    type: 'western-female',
    destination: 'New York Times Square',
    style: 'Urban Energy',
    prompt: `Create a dynamic urban photograph of a young Western woman with blonde or light brown hair at Times Square, New York City.
She's wearing modern New York street style, surrounded by massive digital billboards and neon lights.
The iconic Broadway theater district, yellow cabs, and bustling crowds in background.
Nighttime, vibrant neon lighting creating a cinematic atmosphere.
Style: Street photography, high energy, modern urban aesthetic, dramatic lighting, 8K resolution.
The woman should have Western features - light hair, fair skin, confident American style.`
  },
  {
    filename: 'female-western-iceland-northern-lights.png',
    type: 'western-female',
    destination: 'Iceland Northern Lights',
    style: 'Nature Phenomenon',
    prompt: `Create a magical photograph of a young Western woman with light hair witnessing the Northern Lights in Iceland.
She's wearing warm winter clothing, standing in a dark landscape with aurora dancing overhead.
Snow-covered ground, distant mountains, stars visible in the sky.
The green and purple aurora illuminating her face with ethereal light.
Style: Nature photography, dramatic natural lighting, mystical atmosphere, high resolution.
The woman should have Western/European features - light hair, fair skin, amazed expression.`
  },
  {
    filename: 'female-western-italy-tuscany.png',
    type: 'western-female',
    destination: 'Tuscany Italy',
    style: 'Countryside Romance',
    prompt: `Create a romantic countryside photograph of a young Western woman with light hair in the Tuscan hills, Italy.
She's wearing a flowing dress, standing in a field of sunflowers or vineyards.
Rolling hills, cypress trees, and a classic Italian villa in the background.
Golden hour sunlight creating warm, dreamy lighting.
Style: Travel editorial photography, romantic aesthetic, Italian countryside charm, soft lighting, 8K resolution.
The woman should have European features - light hair, fair skin, Mediterranean elegance.`
  },
  {
    filename: 'female-western-miami-beach.png',
    type: 'western-female',
    destination: 'Miami Beach',
    style: 'Tropical Modern',
    prompt: `Create a vibrant beach photograph of a young Western woman with light hair at Miami Beach, Florida.
She's wearing stylish beachwear, standing on the famous white sand beach.
Art Deco buildings, palm trees, and the turquoise Atlantic Ocean in background.
Bright sunshine, vibrant colors, tropical paradise atmosphere.
Style: Lifestyle photography, vibrant colors, modern beach aesthetic, high resolution.
The woman should have Western features - light hair, tanned or fair skin, confident beach style.`
  },

  // 亚洲男性 - 更多场景
  {
    filename: 'male-asian-hongkong-victoria.png',
    type: 'asian-male',
    destination: 'Hong Kong Victoria Peak',
    style: 'City Skyline',
    prompt: `Using the reference photo of the Asian man, create a stunning photograph of him at Victoria Peak, Hong Kong.
He's wearing modern urban fashion, overlooking the iconic Hong Kong skyline.
The famous harbor, skyscrapers, and mountains in background.
Blue hour lighting, city lights starting to twinkle.
Style: Urban photography, dramatic cityscape, sophisticated Asian metropolitan aesthetic, 8K resolution.
Keep the same person's face and features from the reference.`
  },
  {
    filename: 'male-asian-bangkok-floating-market.png',
    type: 'asian-male',
    destination: 'Bangkok Floating Market',
    style: 'Cultural Experience',
    prompt: `Using the reference photo of the Asian man, create a vibrant cultural photograph of him at a floating market in Bangkok, Thailand.
He's on a boat, interacting with vendors, holding fresh fruits or local food.
Colorful boats, traditional Thai architecture, tropical plants in background.
Warm morning sunlight, authentic Thai market atmosphere.
Style: Travel photography, cultural authenticity, vibrant colors, candid lifestyle, high resolution.
Keep the same person's face and features from the reference.`
  },
  {
    filename: 'male-asian-bali-surfing.png',
    type: 'asian-male',
    destination: 'Bali Beach',
    style: 'Beach Adventure',
    prompt: `Using the reference photo of the Asian man, create an adventurous beach photograph of him in Bali, Indonesia.
He's on a surfboard or near the beach, wearing casual beachwear.
Tropical beach, palm trees, turquoise waves, and golden sand in background.
Bright tropical sunlight, relaxed beach vibe.
Style: Adventure photography, tropical paradise aesthetic, natural lighting, high energy, 8K resolution.
Keep the same person's face and features from the reference.`
  },
  {
    filename: 'male-asian-seoul-gangnam.png',
    type: 'asian-male',
    destination: 'Seoul Gangnam',
    style: 'Modern K-Style',
    prompt: `Using the reference photo of the Asian man, create a modern urban photograph of him in Gangnam, Seoul, South Korea.
He's wearing contemporary Korean street fashion (K-style), in a trendy area.
Modern skyscrapers, neon signs in Korean, fashionable crowds in background.
Evening lighting, vibrant city atmosphere, K-pop culture vibe.
Style: Street fashion photography, modern Korean aesthetic, vibrant urban style, high resolution.
Keep the same person's face and features from the reference.`
  },

  // 欧美男性 - 更多场景
  {
    filename: 'male-western-amsterdam-canals.png',
    type: 'western-male',
    destination: 'Amsterdam Canals',
    style: 'European Classic',
    prompt: `Create a classic European photograph of a young Western man with light hair and European features in Amsterdam, Netherlands.
He's wearing smart casual European fashion, near the famous canals.
Historic Dutch architecture, canal boats, and bridges in background.
Soft natural daylight, typical Amsterdam atmosphere.
Style: Travel photography, European elegance, classic urban aesthetic, refined style, 8K resolution.
The man should have Western features - light hair, fair skin, European facial structure.`
  },
  {
    filename: 'male-western-switzerland-alps.png',
    type: 'western-male',
    destination: 'Swiss Alps',
    style: 'Mountain Adventure',
    prompt: `Create an adventurous mountain photograph of a young Western man with light hair in the Swiss Alps.
He's wearing outdoor gear, standing on a mountain trail or peak.
Snow-capped peaks, alpine meadows, and dramatic mountain vistas in background.
Bright mountain sunlight, crisp clear air, epic alpine scenery.
Style: Adventure photography, dramatic landscapes, natural lighting, high resolution.
The man should have Western/European features - light hair, fair skin, adventurous spirit.`
  },
  {
    filename: 'male-western-portugal-lisbon.png',
    type: 'western-male',
    destination: 'Lisbon Portugal',
    style: 'Mediterranean Charm',
    prompt: `Create a charming Mediterranean photograph of a young Western man with light hair in Lisbon, Portugal.
He's wearing casual European style, in the historic Alfama district.
Colorful tiled buildings, narrow cobblestone streets, and traditional Portuguese architecture in background.
Warm Mediterranean sunlight, authentic Portuguese atmosphere.
Style: Travel photography, Mediterranean aesthetic, warm lighting, cultural authenticity, 8K resolution.
The man should have European features - light hair, fair to olive skin, Mediterranean charm.`
  },
  {
    filename: 'male-western-australia-sydney.png',
    type: 'western-male',
    destination: 'Sydney Opera House',
    style: 'Iconic Landmark',
    prompt: `Create an iconic photograph of a young Western man with light hair at the Sydney Opera House, Australia.
He's wearing modern Australian style, near the famous opera house.
The Sydney Harbour Bridge, harbor, and modern skyline in background.
Golden hour lighting, iconic Australian landmark atmosphere.
Style: Travel editorial photography, iconic landmark aesthetic, dramatic lighting, high resolution.
The man should have Western/Australian features - light hair, fair skin, confident style.`
  }
];

async function loadLocalImage(imagePath: string): Promise<{ data: string; mimeType: string } | null> {
  try {
    if (!fs.existsSync(imagePath)) {
      console.log(`   ⚠️ Reference image not found: ${imagePath}`);
      return null;
    }
    const imageBuffer = fs.readFileSync(imagePath);
    const base64 = imageBuffer.toString('base64');
    const ext = path.extname(imagePath).toLowerCase();
    const mimeType = ext === '.png' ? 'image/png' : 'image/jpeg';
    return { data: base64, mimeType };
  } catch (error) {
    console.log(`   ⚠️ Failed to load reference image: ${error}`);
    return null;
  }
}

async function fetchRemoteImage(url: string): Promise<{ data: string; mimeType: string } | null> {
  try {
    console.log(`   📥 Fetching reference from URL...`);
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

async function generateImage(config: ShowcaseImage): Promise<boolean> {
  console.log(`\n📸 Generating: ${config.filename}`);
  console.log(`   📍 ${config.destination} | 🎨 ${config.style} | 👤 ${config.type}`);
  
  let refImage: { data: string; mimeType: string } | null = null;
  
  // 根据类型加载对应的参考图片
  if (config.type === 'asian-female') {
    refImage = await loadLocalImage(FEMALE_REF);
  } else if (config.type === 'asian-male' || config.type === 'western-male') {
    // 亚洲和欧美男性都使用同一个参考图片（可以根据需要调整）
    refImage = await fetchRemoteImage(MALE_REF_URL);
  } else if (config.type === 'western-female') {
    // 欧美女性也使用女性参考图片，但prompt会指定西方特征
    refImage = await loadLocalImage(FEMALE_REF);
  }
  
  const parts: Array<{ inlineData?: { mimeType: string; data: string }; text?: string }> = [];
  
  // 对于有参考图片的类型，添加参考图片
  if (refImage && (config.type === 'asian-female' || config.type === 'asian-male')) {
    parts.push({
      inlineData: {
        mimeType: refImage.mimeType,
        data: refImage.data
      }
    });
    console.log(`   📷 Using reference image for ${config.type}`);
  }
  
  // 添加提示词
  parts.push({ text: config.prompt });
  
  try {
    console.log(`   🔄 Using gemini-3-pro-image-preview (Nano Banana Pro)...`);
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-image-preview',
      contents: { parts },
      config: {
        responseModalities: ['Text', 'Image'],
        imageConfig: {
          aspectRatio: '3:4',
          imageSize: '2K',
        },
      },
    });
    
    const candidates = (response as any).candidates;
    if (!candidates?.[0]?.content?.parts) {
      console.log(`   ❌ No response parts`);
      return false;
    }
    
    for (const part of candidates[0].content.parts) {
      if (part.inlineData?.data) {
        const outputPath = path.join(OUTPUT_DIR, config.filename);
        if (!fs.existsSync(OUTPUT_DIR)) {
          fs.mkdirSync(OUTPUT_DIR, { recursive: true });
        }
        const imageBuffer = Buffer.from(part.inlineData.data, 'base64');
        fs.writeFileSync(outputPath, imageBuffer);
        console.log(`   ✅ Saved: ${config.filename}`);
        return true;
      }
    }
    
    console.log(`   ❌ No image in response`);
    return false;
    
  } catch (error: any) {
    console.log(`   ❌ Generation failed: ${error.message?.substring(0, 100)}...`);
    
    // 尝试备用模型
    try {
      console.log(`   🔄 Trying fallback: gemini-2.5-flash-image...`);
      const fallbackResponse = await ai.models.generateContent({
        model: 'gemini-2.5-flash-image',
        contents: { parts },
      });
      
      const fallbackCandidates = (fallbackResponse as any).candidates;
      if (!fallbackCandidates?.[0]?.content?.parts) {
        console.log(`   ❌ No fallback response parts`);
        return false;
      }
      
      for (const part of fallbackCandidates[0].content.parts) {
        if (part.inlineData?.data) {
          const outputPath = path.join(OUTPUT_DIR, config.filename);
          if (!fs.existsSync(OUTPUT_DIR)) {
            fs.mkdirSync(OUTPUT_DIR, { recursive: true });
          }
          const imageBuffer = Buffer.from(part.inlineData.data, 'base64');
          fs.writeFileSync(outputPath, imageBuffer);
          console.log(`   ✅ Saved (fallback): ${config.filename}`);
          return true;
        }
      }
      
      console.log(`   ❌ No image in fallback response`);
      return false;
    } catch (fallbackError: any) {
      console.log(`   ❌ Fallback also failed: ${fallbackError.message?.substring(0, 80)}...`);
      return false;
    }
  }
}

async function main() {
  console.log('🚀 Diverse Showcase Image Generator');
  console.log('====================================');
  console.log('生成多样化的亚洲和欧美人物形象展示图片');
  console.log(`📁 Output: ${OUTPUT_DIR}`);
  console.log(`📷 Images to generate: ${showcaseImages.length}\n`);
  
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  }
  
  const results: { success: string[]; failed: string[] } = { success: [], failed: [] };
  
  for (let i = 0; i < showcaseImages.length; i++) {
    const config = showcaseImages[i];
    console.log(`\n[${i + 1}/${showcaseImages.length}]`);
    
    const success = await generateImage(config);
    if (success) {
      results.success.push(config.filename);
    } else {
      results.failed.push(config.filename);
    }
    
    // 添加延迟以避免API限流
    if (i < showcaseImages.length - 1) {
      console.log('   ⏳ Waiting 4s to avoid rate limits...');
      await new Promise(resolve => setTimeout(resolve, 4000));
    }
  }
  
  console.log('\n====================================');
  console.log(`✅ Successfully generated: ${results.success.length}/${showcaseImages.length}`);
  console.log(`❌ Failed: ${results.failed.length}/${showcaseImages.length}`);
  console.log('====================================');
  
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
