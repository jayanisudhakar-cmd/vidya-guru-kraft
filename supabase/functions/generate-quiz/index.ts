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
    const { subject, topic, language, numQuestions = 10 } = await req.json();
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

    const systemPrompt = `You are an expert quiz creator for Indian students.
Generate exactly ${numQuestions} multiple choice questions in ${targetLanguage}.
Return ONLY a valid JSON array with this exact structure:
[
  {
    "question": "Question text",
    "options": ["Option 1", "Option 2", "Option 3", "Option 4"],
    "correctAnswer": 0
  }
]
The correctAnswer should be the index (0-3) of the correct option.`;

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
            content: `Generate ${numQuestions} quiz questions about ${topic} in ${subject}. 
            Return ONLY valid JSON array, no markdown formatting.` 
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
      throw new Error('Failed to generate quiz');
    }

    const data = await response.json();
    let content = data.choices?.[0]?.message?.content || '[]';

    // Clean up markdown formatting if present
    content = content.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();

    const questions = JSON.parse(content);

    return new Response(
      JSON.stringify({ questions }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error: any) {
    console.error('Error in generate-quiz:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});