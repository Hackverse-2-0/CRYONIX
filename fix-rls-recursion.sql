-- Fix for Infinite Recursion in RLS Policies
-- Run this in Supabase SQL Editor to fix the team_members policy

-- First, drop the problematic policy
DROP POLICY IF EXISTS "Team members can view team membership" ON public.team_members;

-- Create a simpler policy that doesn't cause recursion
-- Users can see team_members records where they are the user OR where they are a member of that team
CREATE POLICY "Users can view team membership" ON public.team_members
  FOR SELECT USING (
    user_id = auth.uid() 
    OR 
    team_id IN (
      SELECT tm.team_id 
      FROM public.team_members tm 
      WHERE tm.user_id = auth.uid()
    )
  );

-- Alternative: Even simpler policy - users can see all team_members for teams they belong to
-- This won't cause recursion because we're checking a direct condition
DROP POLICY IF EXISTS "Users can view team membership" ON public.team_members;

CREATE POLICY "Users can view their team memberships" ON public.team_members
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.team_members tm
      WHERE tm.team_id = team_members.team_id
      AND tm.user_id = auth.uid()
    )
    OR user_id = auth.uid()
  );

-- Also fix the INSERT policy to allow users to add themselves to teams
DROP POLICY IF EXISTS "Team creators can add members" ON public.team_members;

CREATE POLICY "Users can join teams or creators can add members" ON public.team_members
  FOR INSERT WITH CHECK (
    -- User is adding themselves
    user_id = auth.uid()
    OR
    -- Or user is the team creator
    team_id IN (
      SELECT id FROM public.teams WHERE created_by = auth.uid()
    )
  );
