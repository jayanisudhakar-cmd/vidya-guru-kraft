-- Create enum for quiz difficulty
CREATE TYPE quiz_difficulty AS ENUM ('easy', 'medium', 'hard');

-- Create enum for subject types
CREATE TYPE subject_type AS ENUM ('mathematics', 'science', 'history', 'geography');

-- Update profiles table to include teacher customization
ALTER TABLE public.profiles
ADD COLUMN teacher_avatar_url TEXT,
ADD COLUMN teacher_name TEXT DEFAULT 'AI Teacher',
ADD COLUMN learning_pace TEXT DEFAULT 'normal',
ADD COLUMN reminder_enabled BOOLEAN DEFAULT true,
ADD COLUMN current_streak INTEGER DEFAULT 0,
ADD COLUMN last_activity_date DATE;

-- Create teacher_customization table
CREATE TABLE public.teacher_customization (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL UNIQUE,
  original_image_url TEXT,
  generated_avatar_url TEXT,
  teacher_name TEXT DEFAULT 'AI Teacher',
  attire_style TEXT DEFAULT 'traditional',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

ALTER TABLE public.teacher_customization ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own teacher customization"
ON public.teacher_customization FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own teacher customization"
ON public.teacher_customization FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own teacher customization"
ON public.teacher_customization FOR UPDATE
USING (auth.uid() = user_id);

-- Create quiz_results table
CREATE TABLE public.quiz_results (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  subject subject_type NOT NULL,
  topic TEXT NOT NULL,
  score INTEGER NOT NULL,
  total_questions INTEGER NOT NULL,
  difficulty quiz_difficulty DEFAULT 'medium',
  time_taken_seconds INTEGER,
  completed_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

ALTER TABLE public.quiz_results ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own quiz results"
ON public.quiz_results FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own quiz results"
ON public.quiz_results FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Create learning_notes table
CREATE TABLE public.learning_notes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  subject subject_type NOT NULL,
  topic TEXT NOT NULL,
  content TEXT NOT NULL,
  language TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

ALTER TABLE public.learning_notes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own notes"
ON public.learning_notes FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own notes"
ON public.learning_notes FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own notes"
ON public.learning_notes FOR DELETE
USING (auth.uid() = user_id);

-- Update student_progress table
ALTER TABLE public.student_progress
ADD COLUMN difficulty quiz_difficulty,
ADD COLUMN notes_generated BOOLEAN DEFAULT false,
ADD COLUMN time_spent_minutes INTEGER DEFAULT 0;

-- Create trigger for teacher_customization updated_at
CREATE TRIGGER update_teacher_customization_updated_at
BEFORE UPDATE ON public.teacher_customization
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();