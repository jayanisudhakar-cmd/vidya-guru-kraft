import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { subject, topic, language } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');

    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY not configured');
    }

    const languageMap: Record<string, string> = {
      english: 'English',
      hindi: 'Hindi',
      kannada: 'Kannada',
      telugu: 'Telugu',
      tamil: 'Tamil',
    };

    const targetLanguage = languageMap[language] || 'English';

    const systemPrompt = `You are an expert Indian teacher creating educational content in ${targetLanguage}.
Create comprehensive, engaging lesson content that includes:
- Clear explanations with examples
- Key concepts and definitions
- Practical applications
- Important points to remember
Make it suitable for Indian students and culturally relevant.`;

    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          { role: 'system', content: systemPrompt },
          { 
            role: 'user', 
            content: `Create a detailed lesson on the topic: ${topic} for the subject: ${subject}. 
            Write in ${targetLanguage}. Include clear explanations, examples, and key takeaways.` 
          }
        ],
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: 'Rate limit exceeded. Please try again later.' }),
          { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      throw new Error('Failed to generate lesson');
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content || 'Failed to generate content';

    return new Response(
      JSON.stringify({ content }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error: any) {
    console.error('Error in generate-lesson:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});