import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useLanguage } from '@/contexts/LanguageContext';
import { ArrowLeft, BookOpen, Play } from 'lucide-react';

const SubjectDetail = () => {
  const { subjectId } = useParams();
  const navigate = useNavigate();
  const { t } = useLanguage();

  const subjectTopics: Record<string, { name: string; topics: string[] }> = {
    math: {
      name: t('mathematics'),
      topics: ['Algebra', 'Geometry', 'Calculus', 'Trigonometry', 'Quadratic Equations'],
    },
    science: {
      name: t('science'),
      topics: [
        'Laws of Motion',
        'Ray Optics',
        'Wave Optics',
        'Modern Physics',
        'Organic Chemistry',
        'Inorganic Chemistry',
        'Physical Chemistry',
        'Biology Basics',
      ],
    },
    history: {
      name: t('history'),
      topics: ['Ramayana', 'Mahabharata', 'Mughal Empire', 'Gupta Dynasty'],
    },
    geography: {
      name: t('geography'),
      topics: ['Minerals', 'Soil', 'Rock Formation', 'Flora and Fauna of Amazon'],
    },
  };

  const subject = subjectTopics[subjectId || ''];

  if (!subject) {
    return <div>Subject not found</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-card to-background p-8">
      <div className="container mx-auto max-w-6xl">
        <Button
          variant="ghost"
          onClick={() => navigate('/dashboard')}
          className="mb-6"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Dashboard
        </Button>

        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gradient-primary mb-2">
            {subject.name}
          </h1>
          <p className="text-muted-foreground">
            Choose a topic to start learning
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {subject.topics.map((topic, index) => (
            <Card
              key={index}
              className="p-6 hover:scale-105 transition-transform cursor-pointer bg-gradient-card border-border shadow-card group"
              onClick={() => navigate(`/subject/${subjectId}/topic/${topic.toLowerCase().replace(/\s+/g, '-')}`)}
            >
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-full bg-primary/20">
                  <BookOpen className="w-6 h-6 text-primary" />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold mb-2 group-hover:text-gradient-primary transition-all">
                    {topic}
                  </h3>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="group-hover:bg-primary/10"
                  >
                    <Play className="w-4 h-4 mr-2" />
                    Start Learning
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SubjectDetail;