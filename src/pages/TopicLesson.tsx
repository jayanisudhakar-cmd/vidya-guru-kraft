import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useLanguage } from '@/contexts/LanguageContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { ArrowLeft, Download, Play, Pause, Volume2 } from 'lucide-react';
import { Slider } from '@/components/ui/slider';

const TopicLesson = () => {
  const { subjectId, topicId } = useParams();
  const navigate = useNavigate();
  const { t, language } = useLanguage();
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(true);
  const [playbackSpeed, setPlaybackSpeed] = useState(1.0);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    loadContent();
  }, [subjectId, topicId, language]);

  const loadContent = async () => {
    setLoading(true);
    try {
      // Load pre-defined content for specific topics
      const contentMap: Record<string, Record<string, string>> = {
        'history-ramayana': {
          content: getRamayanaContent(),
        },
        'history-mahabharata': {
          content: getMahabharataContent(),
        },
        'geography-flora-and-fauna-of-amazon': {
          content: getAmazonFloraFaunaContent(),
        },
      };

      const key = `${subjectId}-${topicId}`;
      const topicContent = contentMap[key];

      if (topicContent) {
        setContent(topicContent.content);
      } else {
        // Generate content using AI
        const { data, error } = await supabase.functions.invoke('generate-lesson', {
          body: {
            subject: subjectId,
            topic: topicId,
            language,
          },
        });

        if (error) throw error;
        setContent(data.content);
      }
    } catch (error: any) {
      toast.error('Failed to load lesson content');
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadNotes = async () => {
    try {
      const blob = new Blob([content], { type: 'text/plain' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${topicId}-notes-${language}.txt`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);

      toast.success('Notes downloaded successfully!');
    } catch (error) {
      toast.error('Failed to download notes');
    }
  };

  const handleTakeQuiz = () => {
    navigate(`/subject/${subjectId}/topic/${topicId}/quiz`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-card to-background p-8">
      <div className="container mx-auto max-w-4xl">
        <Button
          variant="ghost"
          onClick={() => navigate(`/subject/${subjectId}`)}
          className="mb-6"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Topics
        </Button>

        <Card className="p-8 bg-gradient-card border-border shadow-glow mb-6">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-3xl font-bold text-gradient-primary capitalize">
              {topicId?.replace(/-/g, ' ')}
            </h1>
            
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="icon"
                onClick={() => setIsPlaying(!isPlaying)}
              >
                {isPlaying ? (
                  <Pause className="w-4 h-4" />
                ) : (
                  <Play className="w-4 h-4" />
                )}
              </Button>
              <Button variant="outline" size="icon">
                <Volume2 className="w-4 h-4" />
              </Button>
            </div>
          </div>

          <div className="mb-6">
            <label className="text-sm font-medium mb-2 block">
              Playback Speed: {playbackSpeed}x
            </label>
            <Slider
              value={[playbackSpeed]}
              onValueChange={(value) => setPlaybackSpeed(value[0])}
              min={0.5}
              max={2.0}
              step={0.25}
              className="w-full"
            />
          </div>

          {loading ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">Loading lesson content...</p>
            </div>
          ) : (
            <div className="prose prose-invert max-w-none">
              <div className="whitespace-pre-wrap text-foreground leading-relaxed">
                {content}
              </div>
            </div>
          )}

          <div className="flex gap-4 mt-8">
            <Button
              onClick={handleDownloadNotes}
              variant="outline"
              className="flex-1"
            >
              <Download className="w-4 h-4 mr-2" />
              Download Notes
            </Button>
            <Button
              onClick={handleTakeQuiz}
              className="flex-1 bg-gradient-to-r from-accent to-accent-glow"
            >
              Take Quiz
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
};

// Content functions
function getRamayanaContent() {
  return `The Ramayana - Complete Story

The Ramayana is one of the two great ancient Sanskrit epic poems of India, the other being the Mahabharata. It is traditionally attributed to the sage Valmiki, who is revered as the Adi Kavi (First Poet).

Composition and Significance

Date: Scholarly estimates for the earliest stage of the text range broadly, possibly from the 7th–5th centuries BCE, with later stages extending up to the 3rd century CE.

Structure: In its present form, the Ramayana consists of approximately 24,000 shlokas (verses), divided into seven kāṇḍas (books or chapters).

The Core Story

Birth and Marriage: Rama is born to King Dasharatha of Ayodhya. He wins the hand of Sita, the daughter of King Janaka, after successfully stringing Shiva's mighty bow.

Exile: Due to a palace intrigue engineered by his stepmother, Kaikeyi, Rama is banished from the kingdom for fourteen years. He accepts the exile to honor his father's vow and is accompanied by Sita and his devoted half-brother Lakshmana.

Abduction of Sita: While in the forest, Sita is abducted by the powerful ten-headed demon king of Lanka, Ravana.

The Quest and Battle: Rama and Lakshmana ally with the Vanara chief Sugriva and his general Hanuman. After locating Sita in Lanka, they build a bridge across the ocean and defeat Ravana in an epic battle.

Return to Ayodhya: Rama rescues Sita and returns to Ayodhya after fourteen years, where he is crowned king. His righteous rule ushers in a golden age known as Ram Rajya.`;
}

function getMahabharataContent() {
  return `The Mahabharata - Epic History

The Mahabharata is one of the two major Sanskrit epics of ancient India and is renowned as the longest poem ever written, consisting of over 100,000 couplets.

Authorship and Dating

Traditional Author: The epic is traditionally attributed to the sage Vyasa. It is said that he dictated the verses and the elephant-headed god Ganesha transcribed them.

Composition Period: The text was likely compiled between 400 BCE and 400 CE, evolving from an oral tradition that may have started as early as the 8th or 9th century BCE.

The Core Narrative

The Rival Families:
- The Kauravas: The hundred sons of the blind king Dhritarashtra, led by the envious Duryodhana.
- The Pandavas: The five virtuous sons of King Pandu, led by Yudhishthira and including the mighty warrior Arjuna.

The Dice Game: Duryodhana tricks Yudhishthira into a rigged game of dice, where he gambles away his kingdom, his brothers, and their common wife, Draupadi. This results in the Pandavas being exiled for 13 years.

The War: After their exile, the Kauravas refuse to return the Pandavas' kingdom, leading to the devastating Kurukshetra War - an 18-day battle between the two families.

Philosophical Significance

The Bhagavad Gita: On the eve of the war, Krishna delivers his famous discourse to Arjuna, discussing concepts of Dharma (righteous duty), karma yoga, and the nature of the soul.

Conclusion: The Pandavas ultimately win the war, but at a pyrrhic victory with almost all the great warriors on both sides killed.`;
}

function getAmazonFloraFaunaContent() {
  return `Flora and Fauna of the Amazon

The Amazon rainforest and river basin is the world's most biodiverse region, housing approximately 10% of all known species on Earth.

Flora (Plants) 🌳

The Amazon basin is dominated by dense, moist tropical rainforest, which contains an estimated 40,000 plant species.

Canopy Structure: The forest features multiple layers, with the upper canopy being extremely dense, limiting sunlight to the forest floor.

Famous Plants:
- Rubber Tree (Hevea brasiliensis): Source of natural latex.
- Giant Water Lily (Victoria amazonica): Massive lily pads that can grow up to 10 feet in diameter.
- Brazil Nut Tree (Bertholletia excelsa): A towering tree that produces edible seeds.

Fauna (Animals) 🐒

The Amazon is home to millions of species, including thousands of types of fish, birds, mammals, reptiles, and insects.

Mammals: Key mammals include the Jaguar (the largest cat in the Americas), the slow-moving Sloth, the aquatic Capybara (world's largest rodent), and the Giant River Otter.

Birds: The region has over 1,300 bird species, notably the brightly colored Macaws and Toucans, and the powerful Harpy Eagle.

Aquatic Life: The Amazon River is home to more fish species than any other river system, including the Piranha, the Electric Eel, and the endemic Pink River Dolphin.

Reptiles and Amphibians: Iconic species include the massive Green Anaconda, the Black Caiman, and the vividly colored, toxic Poison Dart Frogs.

The intricate relationships between the flora and fauna create a highly complex and crucial global ecosystem.`;
}

export default TopicLesson;