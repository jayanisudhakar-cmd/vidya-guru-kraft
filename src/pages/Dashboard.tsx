import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useLanguage } from '@/contexts/LanguageContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import ChatBot from '@/components/ChatBot';
import {
  BookOpen,
  Brain,
  History,
  Globe,
  Settings,
  Shield,
  TrendingUp,
  Sparkles,
  LogOut,
  User,
} from 'lucide-react';

const Dashboard = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [progress, setProgress] = useState<any[]>([]);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    checkAuth();
    loadProgress();
  }, []);

  const checkAuth = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      navigate('/auth');
      return;
    }
    setUser(session.user);
  };

  const loadProgress = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('student_progress')
        .select('*')
        .eq('user_id', user.id);

      if (error) throw error;
      setProgress(data || []);
    } catch (error) {
      console.error('Failed to load progress:', error);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    toast.success('Logged out successfully');
    navigate('/');
  };

  const subjects = [
    {
      id: 'math',
      name: t('mathematics'),
      icon: Brain,
      gradient: 'from-primary to-primary-glow',
      topics: ['Algebra', 'Geometry', 'Calculus', 'Trigonometry'],
    },
    {
      id: 'science',
      name: t('science'),
      icon: Sparkles,
      gradient: 'from-accent to-accent-glow',
      topics: ['Physics', 'Chemistry', 'Biology'],
    },
    {
      id: 'history',
      name: t('history'),
      icon: History,
      gradient: 'from-success to-green-400',
      topics: ['Ramayana', 'Mahabharata', 'Mughal Empire', 'Gupta Dynasty'],
    },
    {
      id: 'geography',
      name: t('geography'),
      icon: Globe,
      gradient: 'from-blue-500 to-cyan-400',
      topics: ['Minerals', 'Soil', 'Rock Formation', 'Amazon Flora & Fauna'],
    },
  ];

  const completedCount = progress.filter(p => p.completed).length;
  const totalTopics = subjects.reduce((acc, s) => acc + s.topics.length, 0);
  const progressPercent = totalTopics > 0 ? (completedCount / totalTopics) * 100 : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-card to-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <BookOpen className="w-8 h-8 text-primary" />
            <h1 className="text-2xl font-bold text-gradient-primary">Learn AI</h1>
          </div>
          
          <nav className="flex items-center gap-4">
            <Button variant="ghost" onClick={() => navigate('/teacher-customization')}>
              <User className="w-4 h-4 mr-2" />
              My Teacher
            </Button>
            <Button variant="ghost" onClick={() => navigate('/progress')}>
              <TrendingUp className="w-4 h-4 mr-2" />
              {t('progress')}
            </Button>
            <Button variant="ghost" onClick={() => navigate('/settings')}>
              <Settings className="w-4 h-4 mr-2" />
              {t('settings')}
            </Button>
            <Button variant="ghost" onClick={() => navigate('/privacy')}>
              <Shield className="w-4 h-4 mr-2" />
              {t('privacy')}
            </Button>
            <Button variant="ghost" onClick={handleLogout}>
              <LogOut className="w-4 h-4 mr-2" />
              {t('logout')}
            </Button>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Welcome Section */}
        <div className="mb-12">
          <h2 className="text-4xl font-bold mb-4">
            Welcome back! 👋
          </h2>
          <p className="text-xl text-muted-foreground">
            Ready to continue your learning journey?
          </p>
        </div>

        {/* Progress Overview */}
        <Card className="mb-12 p-6 bg-gradient-to-r from-primary/10 to-accent/10 border-primary/20">
          <h3 className="text-2xl font-bold mb-4">Your Progress</h3>
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <div className="h-4 bg-background rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-primary to-accent transition-all duration-500"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>
            <span className="text-2xl font-bold">{Math.round(progressPercent)}%</span>
          </div>
          <p className="text-sm text-muted-foreground mt-2">
            {completedCount} of {totalTopics} topics completed
          </p>
        </Card>

        {/* Subjects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {subjects.map((subject) => {
            const Icon = subject.icon;
            const subjectProgress = progress.filter(
              p => p.subject.toLowerCase() === subject.id && p.completed
            ).length;
            const subjectPercent = (subjectProgress / subject.topics.length) * 100;

            return (
              <Card
                key={subject.id}
                className="p-6 hover:scale-105 transition-transform cursor-pointer group bg-gradient-card border-border shadow-card"
                onClick={() => navigate(`/subject/${subject.id}`)}
              >
                <div className={`inline-flex p-4 rounded-2xl bg-gradient-to-br ${subject.gradient} mb-4 shadow-glow`}>
                  <Icon className="w-8 h-8 text-white" />
                </div>
                
                <h3 className="text-2xl font-bold mb-2 group-hover:text-gradient-primary transition-all">
                  {subject.name}
                </h3>
                
                <p className="text-sm text-muted-foreground mb-4">
                  {subject.topics.length} topics available
                </p>

                <div className="mb-3">
                  <div className="h-2 bg-background rounded-full overflow-hidden">
                    <div
                      className={`h-full bg-gradient-to-r ${subject.gradient} transition-all duration-500`}
                      style={{ width: `${subjectPercent}%` }}
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">
                    {subjectProgress} / {subject.topics.length} completed
                  </span>
                  <Button variant="ghost" size="sm" className="group-hover:bg-primary/10">
                    {t('startLearning')} →
                  </Button>
                </div>
              </Card>
            );
          })}
        </div>
      </main>

      <ChatBot />
    </div>
  );
};

export default Dashboard;