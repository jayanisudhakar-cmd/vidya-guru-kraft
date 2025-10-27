import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useLanguage } from '@/contexts/LanguageContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { ArrowLeft, Timer, Trophy } from 'lucide-react';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';

interface Question {
  question: string;
  options: string[];
  correctAnswer: number;
}

const Quiz = () => {
  const { subjectId, topicId } = useParams();
  const navigate = useNavigate();
  const { t, language } = useLanguage();
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [loading, setLoading] = useState(true);
  const [timeElapsed, setTimeElapsed] = useState(0);

  useEffect(() => {
    generateQuiz();
    const timer = setInterval(() => {
      setTimeElapsed((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const generateQuiz = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('generate-quiz', {
        body: {
          subject: subjectId,
          topic: topicId,
          language,
          numQuestions: 10,
        },
      });

      if (error) throw error;
      setQuestions(data.questions);
    } catch (error: any) {
      toast.error('Failed to generate quiz');
      // Fallback sample questions
      setQuestions([
        {
          question: 'Sample question for ' + topicId,
          options: ['Option 1', 'Option 2', 'Option 3', 'Option 4'],
          correctAnswer: 0,
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleAnswer = () => {
    if (selectedAnswer === null) {
      toast.error('Please select an answer');
      return;
    }

    if (selectedAnswer === questions[currentQuestion].correctAnswer) {
      setScore(score + 1);
    }

    if (currentQuestion + 1 < questions.length) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer(null);
    } else {
      saveQuizResult();
      setShowResult(true);
    }
  };

  const saveQuizResult = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      await supabase.from('quiz_results').insert({
        user_id: user.id,
        subject: subjectId as any,
        topic: topicId || '',
        score,
        total_questions: questions.length,
        time_taken_seconds: timeElapsed,
      });

      await supabase.from('student_progress').upsert({
        user_id: user.id,
        subject: topicId || '',
        topic: topicId || '',
        completed: score >= questions.length * 0.7,
        score: Math.round((score / questions.length) * 100),
      });
    } catch (error) {
      console.error('Failed to save quiz result:', error);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-card to-background flex items-center justify-center">
        <p className="text-xl text-muted-foreground">Generating quiz...</p>
      </div>
    );
  }

  if (showResult) {
    const percentage = Math.round((score / questions.length) * 100);
    const passed = percentage >= 70;

    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-card to-background p-8">
        <div className="container mx-auto max-w-2xl">
          <Card className="p-8 bg-gradient-card border-border shadow-glow text-center">
            <Trophy
              className={`w-24 h-24 mx-auto mb-4 ${
                passed ? 'text-success' : 'text-muted-foreground'
              }`}
            />
            <h1 className="text-4xl font-bold mb-4">
              {passed ? 'Congratulations!' : 'Keep Practicing!'}
            </h1>
            <p className="text-6xl font-bold text-gradient-primary mb-6">
              {percentage}%
            </p>
            <p className="text-xl mb-2">
              You scored {score} out of {questions.length}
            </p>
            <p className="text-muted-foreground mb-8">
              Time: {formatTime(timeElapsed)}
            </p>

            <div className="flex gap-4">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => navigate(`/subject/${subjectId}/topic/${topicId}`)}
              >
                Review Lesson
              </Button>
              <Button
                className="flex-1 bg-gradient-to-r from-accent to-accent-glow"
                onClick={() => {
                  setCurrentQuestion(0);
                  setScore(0);
                  setShowResult(false);
                  setTimeElapsed(0);
                  generateQuiz();
                }}
              >
                Retake Quiz
              </Button>
            </div>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-card to-background p-8">
      <div className="container mx-auto max-w-3xl">
        <Button
          variant="ghost"
          onClick={() => navigate(`/subject/${subjectId}/topic/${topicId}`)}
          className="mb-6"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Lesson
        </Button>

        <Card className="p-8 bg-gradient-card border-border shadow-glow">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">
                Question {currentQuestion + 1} of {questions.length}
              </span>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Timer className="w-4 h-4" />
              {formatTime(timeElapsed)}
            </div>
          </div>

          <div className="mb-8">
            <div className="h-2 bg-background rounded-full overflow-hidden mb-4">
              <div
                className="h-full bg-gradient-to-r from-primary to-accent transition-all duration-300"
                style={{
                  width: `${((currentQuestion + 1) / questions.length) * 100}%`,
                }}
              />
            </div>

            <h2 className="text-2xl font-bold mb-6">
              {questions[currentQuestion].question}
            </h2>

            <RadioGroup
              value={selectedAnswer?.toString()}
              onValueChange={(value) => setSelectedAnswer(parseInt(value))}
            >
              <div className="space-y-4">
                {questions[currentQuestion].options.map((option, index) => (
                  <div
                    key={index}
                    className="flex items-center space-x-3 p-4 rounded-lg border border-border hover:bg-background/50 cursor-pointer"
                    onClick={() => setSelectedAnswer(index)}
                  >
                    <RadioGroupItem value={index.toString()} id={`option-${index}`} />
                    <Label htmlFor={`option-${index}`} className="flex-1 cursor-pointer">
                      {option}
                    </Label>
                  </div>
                ))}
              </div>
            </RadioGroup>
          </div>

          <Button
            onClick={handleAnswer}
            disabled={selectedAnswer === null}
            className="w-full bg-gradient-to-r from-primary to-primary-glow"
          >
            {currentQuestion + 1 === questions.length ? 'Finish Quiz' : 'Next Question'}
          </Button>
        </Card>
      </div>
    </div>
  );
};

export default Quiz;