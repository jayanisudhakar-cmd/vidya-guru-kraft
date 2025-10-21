import { useNavigate } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Shield } from 'lucide-react';

const Privacy = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-card to-background p-8">
      <div className="container mx-auto max-w-4xl">
        <Button
          variant="ghost"
          onClick={() => navigate('/dashboard')}
          className="mb-6"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Dashboard
        </Button>

        <div className="flex items-center gap-4 mb-8">
          <Shield className="w-12 h-12 text-primary" />
          <h1 className="text-4xl font-bold text-gradient-primary">
            Privacy Policy
          </h1>
        </div>

        <Card className="p-8 bg-card/80 backdrop-blur-sm border-border">
          <div className="prose prose-invert max-w-none space-y-6">
            <section>
              <h2 className="text-2xl font-bold text-foreground mb-4">Data Collection</h2>
              <p className="text-muted-foreground">
                We collect minimal data necessary to provide our educational services:
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
                <li>Email address for account authentication</li>
                <li>Name and preferred language for personalization</li>
                <li>Learning progress and test scores</li>
                <li>Chat interactions with the AI teacher (anonymized)</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-foreground mb-4">Data Usage</h2>
              <p className="text-muted-foreground">
                Your data is used exclusively to:
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
                <li>Provide personalized learning experiences</li>
                <li>Track your educational progress</li>
                <li>Improve our AI teaching algorithms</li>
                <li>Send important updates about your learning</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-foreground mb-4">Data Protection</h2>
              <p className="text-muted-foreground">
                We implement industry-standard security measures:
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
                <li>End-to-end encryption for sensitive data</li>
                <li>Secure authentication via Supabase</li>
                <li>Regular security audits and updates</li>
                <li>No sharing of personal data with third parties</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-foreground mb-4">Your Rights</h2>
              <p className="text-muted-foreground">
                You have the right to:
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
                <li>Access all your personal data</li>
                <li>Request data deletion at any time</li>
                <li>Export your learning progress</li>
                <li>Opt-out of non-essential communications</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-foreground mb-4">Contact Us</h2>
              <p className="text-muted-foreground">
                For any privacy concerns or data requests, please contact us at:
                <br />
                <span className="text-primary font-medium">privacy@learnwithai.com</span>
              </p>
            </section>

            <p className="text-sm text-muted-foreground mt-8">
              Last updated: {new Date().toLocaleDateString()}
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Privacy;