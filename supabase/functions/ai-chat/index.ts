import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { message, type } = await req.json();
    console.log('Received message:', message, 'Type:', type);

    const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
    
    if (!openAIApiKey) {
      console.log('OpenAI API key not found, using fallback responses');
      return new Response(JSON.stringify({ 
        response: getFallbackResponse(message, type) 
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Prepare system prompt based on type
    let systemPrompt = '';
    if (type === 'itinerary') {
      systemPrompt = 'You are a Jharkhand travel expert specializing in creating detailed itineraries. Focus on practical information, timings, transportation, and local experiences. Include specific places, activities, and cultural insights.';
    } else {
      systemPrompt = 'You are a knowledgeable Jharkhand travel assistant. Provide helpful, accurate information about destinations, food, culture, transportation, and activities in Jharkhand. Be friendly, informative, and practical in your responses.';
    }

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { 
            role: 'system', 
            content: systemPrompt
          },
          { 
            role: 'user', 
            content: message 
          }
        ],
        max_tokens: 500,
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.status}`);
    }

    const data = await response.json();
    console.log('OpenAI response received');
    
    const aiResponse = data.choices[0].message.content;

    return new Response(JSON.stringify({ response: aiResponse }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in ai-chat function:', error);
    
    const { message, type } = await req.json().catch(() => ({ message: '', type: 'chat' }));
    
    return new Response(JSON.stringify({ 
      response: getFallbackResponse(message, type) 
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

function getFallbackResponse(message: string, type: string): string {
  const lowercaseMessage = message.toLowerCase();
  
  if (type === 'itinerary') {
    if (lowercaseMessage.includes('3') || lowercaseMessage.includes('three')) {
      return `Here's a suggested 3-day Jharkhand itinerary:

**Day 1: Ranchi Exploration**
- Morning: Visit Tagore Hill (sunrise views)
- Afternoon: Rock Garden and Kanke Dam
- Evening: Local markets for shopping

**Day 2: Waterfall Adventure**
- Early morning: Drive to Hundru Falls (45km from Ranchi)
- Afternoon: Jonha Falls nearby
- Evening: Return to Ranchi

**Day 3: Cultural Experience**
- Morning: Tribal Research Institute Museum
- Afternoon: Local food tour - try Litti Chokha
- Evening: Departure or extend stay

*Note: This is a basic itinerary. For AI-powered personalized planning with real-time updates, the OpenAI integration will be available once configured.*`;
    }
    
    return "I can help create a customized itinerary for Jharkhand! Please specify your duration, interests (waterfalls, culture, adventure, food), and preferences. The AI-powered personalized planning will be available once the OpenAI integration is configured.";
  }
  
  // Regular chat responses
  if (lowercaseMessage.includes('ranchi')) {
    return "Ranchi, the capital of Jharkhand, is known as the 'City of Waterfalls'. Key attractions include Tagore Hill, Rock Garden, Kanke Dam, and it's a great base for exploring nearby waterfalls like Hundru and Jonha Falls. The city also has good connectivity and accommodation options.";
  }
  
  if (lowercaseMessage.includes('waterfall')) {
    return "Jharkhand boasts magnificent waterfalls! **Top recommendations:**\n\n• **Hundru Falls** (98m) - Most famous, 45km from Ranchi\n• **Jonha Falls** - Great for trekking, near Hundru\n• **Dassam Falls** - Beautiful during monsoon\n• **Hirni Falls** - Less crowded, perfect for peace\n\n*Best time*: Post-monsoon (Oct-Feb) for full flow and pleasant weather.";
  }
  
  if (lowercaseMessage.includes('food')) {
    return "Jharkhand's cuisine reflects its tribal heritage! **Must-try dishes:**\n\n• **Litti Chokha** - Traditional stuffed wheat balls with spiced vegetables\n• **Dhuska** - Crispy lentil fritters\n• **Rugra** - Wild mushroom curry (seasonal)\n• **Handia** - Traditional rice beer\n• **Pua** - Sweet festival pancakes\n\n*Where to try*: Local dhabas, tribal restaurants, and street food stalls in Ranchi.";
  }
  
  if (lowercaseMessage.includes('transport') || lowercaseMessage.includes('reach')) {
    return "**Getting to/around Jharkhand:**\n\n• **By Air**: Ranchi Airport connects to Delhi, Mumbai, Kolkata\n• **By Train**: Well-connected railway network\n• **Local Transport**: Buses, taxis, auto-rickshaws\n• **For Waterfalls**: Hire taxi/car (roads can be challenging)\n\n*Tip*: Book local transport in advance during peak season (Oct-Mar).";
  }
  
  return "I'm here to help you explore beautiful Jharkhand! I can provide information about destinations, waterfalls, local food, transportation, and help plan your itinerary. The full AI-powered assistance will be available once the OpenAI integration is configured. What would you like to know about Jharkhand?";
}