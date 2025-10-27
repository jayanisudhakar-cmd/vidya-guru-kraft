import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useLanguage } from '@/contexts/LanguageContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Upload, Sparkles, ArrowLeft } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const TeacherCustomization = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [loading, setLoading] = useState(false);
  const [teacherName, setTeacherName] = useState('AI Teacher');
  const [attireStyle, setAttireStyle] = useState('traditional');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [generating, setGenerating] = useState(false);

  useEffect(() => {
    loadExistingCustomization();
  }, []);

  const loadExistingCustomization = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('teacher_customization')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

      if (error) throw error;

      if (data) {
        setTeacherName(data.teacher_name || 'AI Teacher');
        setAttireStyle(data.attire_style || 'traditional');
        setPreviewUrl(data.generated_avatar_url);
      }
    } catch (error: any) {
      console.error('Error loading customization:', error);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleGenerateTeacher = async () => {
    if (!imageFile) {
      toast.error('Please upload an image first');
      return;
    }

    setGenerating(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      // Convert image to base64
      const reader = new FileReader();
      reader.onloadend = async () => {
        const base64Image = reader.result as string;

        // Call edge function to generate AI teacher avatar
        const { data, error } = await supabase.functions.invoke('generate-teacher', {
          body: {
            imageData: base64Image,
            teacherName,
            attireStyle,
          },
        });

        if (error) throw error;

        // Save to database
        const { error: dbError } = await supabase
          .from('teacher_customization')
          .upsert({
            user_id: user.id,
            teacher_name: teacherName,
            attire_style: attireStyle,
            original_image_url: base64Image,
            generated_avatar_url: data.avatarUrl,
          });

        if (dbError) throw dbError;

        setPreviewUrl(data.avatarUrl);
        toast.success('AI Teacher generated successfully!');
      };

      reader.readAsDataURL(imageFile);
    } catch (error: any) {
      toast.error(error.message || 'Failed to generate teacher');
    } finally {
      setGenerating(false);
    }
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { error } = await supabase
        .from('teacher_customization')
        .upsert({
          user_id: user.id,
          teacher_name: teacherName,
          attire_style: attireStyle,
        });

      if (error) throw error;

      toast.success('Teacher customization saved!');
      navigate('/dashboard');
    } catch (error: any) {
      toast.error(error.message || 'Failed to save');
    } finally {
      setLoading(false);
    }
  };

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

        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gradient-primary mb-2">
            Customize Your AI Teacher
          </h1>
          <p className="text-muted-foreground">
            Upload a photo and create your personalized AI teacher
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Upload Section */}
          <Card className="p-6 bg-gradient-card border-border">
            <h2 className="text-2xl font-bold mb-4">Upload Image</h2>
            
            <div className="border-2 border-dashed border-border rounded-lg p-8 text-center mb-4">
              {previewUrl ? (
                <img
                  src={previewUrl}
                  alt="Preview"
                  className="max-w-full h-64 object-contain mx-auto rounded-lg"
                />
              ) : (
                <div className="flex flex-col items-center gap-4">
                  <Upload className="w-16 h-16 text-muted-foreground" />
                  <p className="text-muted-foreground">
                    Drop an image here or click to browse
                  </p>
                </div>
              )}
            </div>

            <Input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="mb-4"
            />

            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-2 block">
                  Teacher Name
                </label>
                <Input
                  value={teacherName}
                  onChange={(e) => setTeacherName(e.target.value)}
                  placeholder="Enter teacher name"
                />
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">
                  Attire Style
                </label>
                <Select value={attireStyle} onValueChange={setAttireStyle}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="traditional">
                      Traditional Indian (Kurta/Saree)
                    </SelectItem>
                    <SelectItem value="modern">Modern Professional</SelectItem>
                    <SelectItem value="casual">Smart Casual</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button
                onClick={handleGenerateTeacher}
                disabled={!imageFile || generating}
                className="w-full bg-gradient-to-r from-accent to-accent-glow"
              >
                <Sparkles className="w-4 h-4 mr-2" />
                {generating ? 'Generating...' : 'Generate AI Teacher'}
              </Button>
            </div>
          </Card>

          {/* Preview Section */}
          <Card className="p-6 bg-gradient-card border-border">
            <h2 className="text-2xl font-bold mb-4">Preview</h2>
            
            {previewUrl ? (
              <div className="space-y-4">
                <div className="aspect-square rounded-lg overflow-hidden bg-background/50 flex items-center justify-center">
                  <img
                    src={previewUrl}
                    alt="Teacher Avatar"
                    className="max-w-full max-h-full object-contain"
                  />
                </div>
                
                <div className="text-center">
                  <h3 className="text-xl font-bold">{teacherName}</h3>
                  <p className="text-sm text-muted-foreground capitalize">
                    {attireStyle} Attire
                  </p>
                </div>

                <Button
                  onClick={handleSave}
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-primary to-primary-glow"
                >
                  Save & Continue
                </Button>
              </div>
            ) : (
              <div className="h-full flex items-center justify-center text-center text-muted-foreground">
                <p>Upload an image and generate your AI teacher to see a preview</p>
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
};

export default TeacherCustomization;