-- COMPLETE FIX: Drop and recreate all RLS policies to avoid recursion
-- Run this entire script in Supabase SQL Editor

-- ============================================
-- STEP 1: DROP ALL EXISTING POLICIES
-- ============================================

-- Drop team_members policies
DROP POLICY IF EXISTS "Team members can view team membership" ON public.team_members;
DROP POLICY IF EXISTS "Users can view team membership" ON public.team_members;
DROP POLICY IF EXISTS "Users can view their team memberships" ON public.team_members;
DROP POLICY IF EXISTS "Team creators can add members" ON public.team_members;
DROP POLICY IF EXISTS "Users can join teams or creators can add members" ON public.team_members;
DROP POLICY IF EXISTS "Team creators can remove members" ON public.team_members;

-- Drop teams policies
DROP POLICY IF EXISTS "Team members can view their teams" ON public.teams;
DROP POLICY IF EXISTS "Users can create teams" ON public.teams;
DROP POLICY IF EXISTS "Team creators can update their teams" ON public.teams;
DROP POLICY IF EXISTS "Team creators can delete their teams" ON public.teams;

-- Drop tasks policies
DROP POLICY IF EXISTS "Team members can view team tasks" ON public.tasks;
DROP POLICY IF EXISTS "Team members can create tasks" ON public.tasks;
DROP POLICY IF EXISTS "Team members can update tasks" ON public.tasks;
DROP POLICY IF EXISTS "Team members can delete tasks" ON public.tasks;

-- Drop notes policies
DROP POLICY IF EXISTS "Team members can view team notes" ON public.notes;
DROP POLICY IF EXISTS "Team members can create notes" ON public.notes;
DROP POLICY IF EXISTS "Note creators can update their notes" ON public.notes;
DROP POLICY IF EXISTS "Note creators can delete their notes" ON public.notes;

-- Drop ai_summaries policies
DROP POLICY IF EXISTS "Team members can view team summaries" ON public.ai_summaries;
DROP POLICY IF EXISTS "Team members can create summaries" ON public.ai_summaries;

-- ============================================
-- STEP 2: CREATE NON-RECURSIVE POLICIES
-- ============================================

-- TEAM_MEMBERS: Simple policies without recursion
CREATE POLICY "team_members_select_policy" ON public.team_members
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "team_members_insert_policy" ON public.team_members
  FOR INSERT WITH CHECK (user_id = auth.uid());

CREATE POLICY "team_members_delete_own" ON public.team_members
  FOR DELETE USING (user_id = auth.uid());

-- TEAMS: Allow viewing and managing teams
CREATE POLICY "teams_select_policy" ON public.teams
  FOR SELECT USING (
    created_by = auth.uid()
    OR
    id IN (SELECT team_id FROM public.team_members WHERE user_id = auth.uid())
  );

CREATE POLICY "teams_insert_policy" ON public.teams
  FOR INSERT WITH CHECK (created_by = auth.uid());

CREATE POLICY "teams_update_policy" ON public.teams
  FOR UPDATE USING (created_by = auth.uid());

CREATE POLICY "teams_delete_policy" ON public.teams
  FOR DELETE USING (created_by = auth.uid());

-- TASKS: Allow team members to manage tasks
CREATE POLICY "tasks_select_policy" ON public.tasks
  FOR SELECT USING (
    team_id IN (
      SELECT team_id FROM public.team_members WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "tasks_insert_policy" ON public.tasks
  FOR INSERT WITH CHECK (
    team_id IN (
      SELECT team_id FROM public.team_members WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "tasks_update_policy" ON public.tasks
  FOR UPDATE USING (
    team_id IN (
      SELECT team_id FROM public.team_members WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "tasks_delete_policy" ON public.tasks
  FOR DELETE USING (
    team_id IN (
      SELECT team_id FROM public.team_members WHERE user_id = auth.uid()
    )
  );

-- NOTES: Allow team members to manage notes
CREATE POLICY "notes_select_policy" ON public.notes
  FOR SELECT USING (
    team_id IN (
      SELECT team_id FROM public.team_members WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "notes_insert_policy" ON public.notes
  FOR INSERT WITH CHECK (
    team_id IN (
      SELECT team_id FROM public.team_members WHERE user_id = auth.uid()
    )
    AND created_by = auth.uid()
  );

CREATE POLICY "notes_update_policy" ON public.notes
  FOR UPDATE USING (created_by = auth.uid());

CREATE POLICY "notes_delete_policy" ON public.notes
  FOR DELETE USING (created_by = auth.uid());

-- AI_SUMMARIES: Allow team members to view and create summaries
CREATE POLICY "summaries_select_policy" ON public.ai_summaries
  FOR SELECT USING (
    team_id IN (
      SELECT team_id FROM public.team_members WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "summaries_insert_policy" ON public.ai_summaries
  FOR INSERT WITH CHECK (
    team_id IN (
      SELECT team_id FROM public.team_members WHERE user_id = auth.uid()
    )
  );

-- ============================================
-- VERIFICATION
-- ============================================

-- Check all policies are created
SELECT schemaname, tablename, policyname 
FROM pg_policies 
WHERE schemaname = 'public' 
ORDER BY tablename, policyname;
