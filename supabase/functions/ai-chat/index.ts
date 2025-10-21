import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { messages, language = 'english' } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');

    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY is not configured');
    }

    const systemPrompts = {
      english: "You are a friendly and knowledgeable AI teacher assistant. You help students with their studies in Math, Science, History, and Geography. Keep answers clear, engaging, and appropriate for students. Add a touch of humor when appropriate.",
      hindi: "आप एक मित्रवत और जानकार AI शिक्षक सहायक हैं। आप छात्रों को गणित, विज्ञान, इतिहास और भूगोल में मदद करते हैं। उत्तर स्पष्ट, आकर्षक और छात्रों के लिए उपयुक्त रखें।",
      kannada: "ನೀವು ಸ್ನೇಹಪರ ಮತ್ತು ಜ್ಞಾನವುಳ್ಳ AI ಶಿಕ್ಷಕ ಸಹಾಯಕರು. ನೀವು ವಿದ್ಯಾರ್ಥಿಗಳಿಗೆ ಗಣಿತ, ವಿಜ್ಞಾನ, ಇತಿಹಾಸ ಮತ್ತು ಭೂಗೋಳದಲ್ಲಿ ಸಹಾಯ ಮಾಡುತ್ತೀರಿ.",
      telugu: "మీరు స్నేహపూర్వక మరియు జ్ఞానవంతమైన AI ఉపాధ్యాయ సహాయకులు. మీరు విద్యార్థులకు గణితం, సైన్స్, చరిత్ర మరియు భౌగోళిక శాస్త్రంలో సహాయం చేస్తారు.",
      tamil: "நீங்கள் நட்பான மற்றும் அறிவுள்ள AI ஆசிரியர் உதவியாளர். நீங்கள் மாணவர்களுக்கு கணிதம், அறிவியல், வரலாறு மற்றும் புவியியலில் உதவுகிறீர்கள்.",
    };

    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          { role: 'system', content: systemPrompts[language as keyof typeof systemPrompts] || systemPrompts.english },
          ...messages
        ],
        stream: true,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: 'Rate limit exceeded. Please try again later.' }), {
          status: 429,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: 'Payment required. Please add credits to continue.' }), {
          status: 402,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
      throw new Error('AI API error');
    }

    return new Response(response.body, {
      headers: { ...corsHeaders, 'Content-Type': 'text/event-stream' },
    });
  } catch (error) {
    console.error('Error in ai-chat function:', error);
    return new Response(JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});