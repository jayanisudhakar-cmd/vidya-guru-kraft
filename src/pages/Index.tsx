import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { GraduationCap, Sparkles, Globe, Brain, BookOpen } from 'lucide-react';

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-card to-background">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/20 via-transparent to-transparent" />
      
      <div className="relative min-h-screen flex flex-col items-center justify-center p-8">
        <div className="text-center max-w-4xl mx-auto">
          <div className="relative inline-block mb-8">
            <GraduationCap className="w-24 h-24 text-primary animate-float" />
            <Sparkles className="w-8 h-8 text-accent absolute -top-2 -right-2 animate-pulse-slow" />
          </div>

          <h1 className="text-6xl md:text-7xl font-bold mb-6">
            <span className="text-gradient-primary">Learn with AI</span>
          </h1>

          <p className="text-xl md:text-2xl text-muted-foreground mb-12 max-w-2xl mx-auto">
            Transform your education with personalized AI teachers in your own language. 
            Immersive learning powered by cutting-edge technology.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <Button
              size="lg"
              onClick={() => navigate('/dashboard')}
              className="text-lg bg-gradient-to-r from-primary to-primary-glow hover:opacity-90 shadow-glow transition-all hover:scale-105"
            >
              Get Started
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={() => navigate('/dashboard')}
              className="text-lg border-primary/50 hover:bg-primary/10"
            >
              Explore Subjects
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16">
            <div className="p-6 rounded-2xl bg-gradient-card border border-border backdrop-blur-sm hover:scale-105 transition-transform">
              <Globe className="w-12 h-12 text-primary mx-auto mb-4" />
              <h3 className="text-xl font-bold mb-2">Multi-Language</h3>
              <p className="text-muted-foreground">
                Learn in Hindi, Kannada, Telugu, Tamil, or English
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-gradient-card border border-border backdrop-blur-sm hover:scale-105 transition-transform">
              <Brain className="w-12 h-12 text-accent mx-auto mb-4" />
              <h3 className="text-xl font-bold mb-2">AI-Powered</h3>
              <p className="text-muted-foreground">
                Personalized learning with intelligent AI teachers
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-gradient-card border border-border backdrop-blur-sm hover:scale-105 transition-transform">
              <BookOpen className="w-12 h-12 text-success mx-auto mb-4" />
              <h3 className="text-xl font-bold mb-2">Comprehensive</h3>
              <p className="text-muted-foreground">
                Math, Science, History, Geography and more
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
