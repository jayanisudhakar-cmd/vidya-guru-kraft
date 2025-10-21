import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import { ArrowLeft, TrendingUp, Award, Target } from 'lucide-react';

const Progress = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [progress, setProgress] = useState<any[]>([]);

  useEffect(() => {
    const fetchProgress = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) {
        navigate('/auth');
        return;
      }

      const { data } = await supabase
        .from('student_progress')
        .select('*')
        .eq('user_id', session.user.id)
        .order('created_at', { ascending: false });
      
      if (data) setProgress(data);
    };

    fetchProgress();
  }, [navigate]);

  const completedTopics = progress.filter(p => p.completed);
  const averageScore = completedTopics.length > 0
    ? completedTopics.reduce((acc, p) => acc + (p.score || 0), 0) / completedTopics.length
    : 0;

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

        <h1 className="text-4xl font-bold mb-8 text-gradient-primary">
          {t('progress')}
        </h1>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="p-6 bg-gradient-card border-border">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-full bg-primary/20">
                <TrendingUp className="w-6 h-6 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Topics Completed</p>
                <p className="text-3xl font-bold">{completedTopics.length}</p>
              </div>
            </div>
          </Card>

          <Card className="p-6 bg-gradient-card border-border">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-full bg-accent/20">
                <Award className="w-6 h-6 text-accent" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Average Score</p>
                <p className="text-3xl font-bold">{Math.round(averageScore)}%</p>
              </div>
            </div>
          </Card>

          <Card className="p-6 bg-gradient-card border-border">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-full bg-success/20">
                <Target className="w-6 h-6 text-success" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Current Streak</p>
                <p className="text-3xl font-bold">0 days</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Progress by Subject */}
        <Card className="p-6 bg-card/80 backdrop-blur-sm border-border">
          <h2 className="text-2xl font-bold mb-6">Recent Activity</h2>
          
          {progress.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <p>No progress yet. Start learning to track your achievements!</p>
              <Button 
                onClick={() => navigate('/dashboard')} 
                className="mt-4 bg-gradient-to-r from-primary to-primary-glow"
              >
                Start Learning
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {progress.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between p-4 rounded-lg bg-background/50 hover:bg-background/70 transition-colors"
                >
                  <div>
                    <h3 className="font-semibold capitalize">{item.subject}</h3>
                    <p className="text-sm text-muted-foreground">{item.topic}</p>
                  </div>
                  <div className="flex items-center gap-4">
                    {item.score && (
                      <span className="text-2xl font-bold text-primary">
                        {item.score}%
                      </span>
                    )}
                    {item.completed && (
                      <span className="px-3 py-1 rounded-full bg-success/20 text-success text-sm font-medium">
                        Completed
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};

export default Progress;