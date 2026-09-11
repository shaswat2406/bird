-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. PROFILES TABLE
CREATE TABLE public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    full_name TEXT NOT NULL,
    avatar_url TEXT,
    course TEXT DEFAULT 'B.Tech CSE',
    credits INTEGER NOT NULL DEFAULT 100 CHECK (credits >= 0),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. FOCUS ROOMS TABLE
CREATE TABLE public.rooms (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    course_code TEXT NOT NULL, -- e.g. CSE205, INT219, MTH166
    created_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    pomodoro_state TEXT NOT NULL DEFAULT 'FOCUS' CHECK (pomodoro_state IN ('FOCUS', 'BREAK', 'IDLE')),
    cycle_start_time TIMESTAMPTZ DEFAULT NOW(),
    cycle_duration_seconds INTEGER DEFAULT 1500, -- 25 mins = 1500s, 5 mins = 300s
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. QUESTIONS TABLE
CREATE TABLE public.questions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    body TEXT NOT NULL,
    course_code TEXT NOT NULL,
    bounty INTEGER NOT NULL DEFAULT 20 CHECK (bounty > 0),
    is_solved BOOLEAN NOT NULL DEFAULT FALSE,
    accepted_answer_id UUID,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. ANSWERS TABLE
CREATE TABLE public.answers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    question_id UUID NOT NULL REFERENCES public.questions(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    body TEXT NOT NULL,
    is_accepted BOOLEAN NOT NULL DEFAULT FALSE,
    upvotes INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add foreign key constraint for accepted_answer_id in questions
ALTER TABLE public.questions 
ADD CONSTRAINT fk_accepted_answer 
FOREIGN KEY (accepted_answer_id) REFERENCES public.answers(id) ON DELETE SET NULL;

-- =========================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- =========================================================================

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rooms ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.answers ENABLE ROW LEVEL SECURITY;

-- Profiles: Anyone can view profiles, users can update their own profile
CREATE POLICY "Public profiles are viewable by everyone" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- Rooms: Public read, authenticated insert
CREATE POLICY "Rooms viewable by everyone" ON public.rooms FOR SELECT USING (true);
CREATE POLICY "Authenticated users can create rooms" ON public.rooms FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Room creators can update rooms" ON public.rooms FOR UPDATE USING (auth.uid() = created_by);

-- Questions: Public read, authenticated create/update
CREATE POLICY "Questions viewable by everyone" ON public.questions FOR SELECT USING (true);
CREATE POLICY "Authenticated users can create questions" ON public.questions FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Authors can update questions" ON public.questions FOR UPDATE USING (auth.uid() = user_id);

-- Answers: Public read, authenticated create
CREATE POLICY "Answers viewable by everyone" ON public.answers FOR SELECT USING (true);
CREATE POLICY "Authenticated users can post answers" ON public.answers FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Authors can update own answers" ON public.answers FOR UPDATE USING (auth.uid() = user_id);

-- =========================================================================
-- STORED PROCEDURES & ATOMIC RPCs
-- =========================================================================

-- RPC: Post Question with Bounty Deduction
CREATE OR REPLACE FUNCTION post_question(
    p_title TEXT,
    p_body TEXT,
    p_course_code TEXT,
    p_bounty INTEGER
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_user_id UUID;
    v_current_credits INTEGER;
    v_question_id UUID;
BEGIN
    v_user_id := auth.uid();
    IF v_user_id IS NULL THEN
        RAISE EXCEPTION 'Unauthorized';
    END IF;

    IF p_bounty IS NULL OR p_bounty < 20 THEN
        RAISE EXCEPTION 'Bounty must be at least 20 credits';
    END IF;

    INSERT INTO public.profiles (id, full_name, avatar_url, credits, course)
    VALUES (
        v_user_id,
        'LPU Student',
        NULL,
        100,
        'B.Tech CSE'
    )
    ON CONFLICT (id) DO NOTHING;

    -- Lock profile row to prevent race conditions on balance deduction
    SELECT credits INTO v_current_credits
    FROM public.profiles
    WHERE id = v_user_id
    FOR UPDATE;

    IF v_current_credits IS NULL THEN
        RAISE EXCEPTION 'Profile not found for user';
    END IF;

    IF v_current_credits < p_bounty THEN
        RAISE EXCEPTION 'Insufficient credits. Required: %, Available: %', p_bounty, v_current_credits;
    END IF;

    -- Deduct bounty credits
    UPDATE public.profiles
    SET credits = credits - p_bounty, updated_at = NOW()
    WHERE id = v_user_id;

    -- Insert question
    INSERT INTO public.questions (user_id, title, body, course_code, bounty)
    VALUES (v_user_id, p_title, p_body, p_course_code, p_bounty)
    RETURNING id INTO v_question_id;

    RETURN v_question_id;
END;
$$;

-- RPC: Accept Solution (Atomic credit transfer)
CREATE OR REPLACE FUNCTION accept_solution(
    p_question_id UUID,
    p_answer_id UUID
)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_question public.questions%ROWTYPE;
    v_answer public.answers%ROWTYPE;
BEGIN
    -- 1. Validate Question ownership
    SELECT * INTO v_question 
    FROM public.questions 
    WHERE id = p_question_id 
    FOR UPDATE;

    IF v_question.id IS NULL THEN
        RAISE EXCEPTION 'Question not found';
    END IF;

    IF v_question.user_id != auth.uid() THEN
        RAISE EXCEPTION 'Only the question author can accept an answer';
    END IF;

    IF v_question.is_solved THEN
        RAISE EXCEPTION 'This question is already solved';
    END IF;

    -- 2. Validate Answer
    SELECT * INTO v_answer 
    FROM public.answers 
    WHERE id = p_answer_id AND question_id = p_question_id 
    FOR UPDATE;

    IF v_answer.id IS NULL THEN
        RAISE EXCEPTION 'Answer does not belong to this question';
    END IF;

    IF v_answer.user_id = v_question.user_id THEN
        RAISE EXCEPTION 'You cannot accept your own answer';
    END IF;

    -- 3. Mark Answer and Question as accepted
    UPDATE public.answers 
    SET is_accepted = TRUE 
    WHERE id = p_answer_id;

    UPDATE public.questions 
    SET is_solved = TRUE, accepted_answer_id = p_answer_id 
    WHERE id = p_question_id;

    -- 4. Transfer Bounty Credits to Answer Author
    UPDATE public.profiles 
    SET credits = credits + v_question.bounty, updated_at = NOW()
    WHERE id = v_answer.user_id;

    RETURN TRUE;
END;
$$;

-- RPC: Award Pomodoro Focus Credits (+5)
CREATE OR REPLACE FUNCTION award_pomodoro_credits(p_room_id UUID)
RETURNS INTEGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_user_id UUID;
    v_new_credits INTEGER;
BEGIN
    v_user_id := auth.uid();
    IF v_user_id IS NULL THEN
        RAISE EXCEPTION 'Unauthorized';
    END IF;

    UPDATE public.profiles
    SET credits = credits + 5, updated_at = NOW()
    WHERE id = v_user_id
    RETURNING credits INTO v_new_credits;

    RETURN v_new_credits;
END;
$$;

-- =========================================================================
-- AUTOMATIC PROFILE CREATION TRIGGER
-- =========================================================================

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    INSERT INTO public.profiles (id, full_name, avatar_url, credits, course)
    VALUES (
        NEW.id,
        COALESCE(NEW.raw_user_meta_data->>'full_name', 'LPU Student'),
        COALESCE(NEW.raw_user_meta_data->>'avatar_url', 'https://api.dicebear.com/7.x/bottts/svg?seed=' || NEW.id),
        100,
        COALESCE(NEW.raw_user_meta_data->>'course', 'B.Tech CSE')
    );
    RETURN NEW;
END;
$$;

CREATE OR REPLACE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Enable Realtime for live updates
ALTER PUBLICATION supabase_realtime ADD TABLE public.profiles;
ALTER PUBLICATION supabase_realtime ADD TABLE public.questions;
ALTER PUBLICATION supabase_realtime ADD TABLE public.answers;
ALTER PUBLICATION supabase_realtime ADD TABLE public.rooms;