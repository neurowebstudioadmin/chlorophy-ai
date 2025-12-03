import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Auth functions
export const authService = {
  // Sign up
  async signUp(email, password) {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });
    
    if (error) throw error;
    return data;
  },

  // Sign in
  async signIn(email, password) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    
    if (error) throw error;
    return data;
  },

  // Sign out
  async signOut() {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  },

  // Get current user
  async getCurrentUser() {
    const { data: { user }, error } = await supabase.auth.getUser();
    if (error) throw error;
    return user;
  },

  // Listen to auth changes
  onAuthStateChange(callback) {
    return supabase.auth.onAuthStateChange(callback);
  }
};

// Profile functions
export const profileService = {
  // Get user profile
  async getProfile(userId) {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();
    
    if (error && error.code !== 'PGRST116') throw error; // PGRST116 = no rows
    return data;
  },

  // Create or update profile
  async upsertProfile(userId, profileData) {
    const { data, error } = await supabase
      .from('profiles')
      .upsert({
        id: userId,
        ...profileData,
        updated_at: new Date().toISOString(),
      })
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  // Upload avatar
  async uploadAvatar(userId, file) {
    const fileExt = file.name.split('.').pop();
    const fileName = `${userId}/avatar.${fileExt}`;
    
    // Upload file
    const { data, error } = await supabase.storage
      .from('avatars')
      .upload(fileName, file, { upsert: true });
    
    if (error) throw error;
    
    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from('avatars')
      .getPublicUrl(fileName);
    
    return publicUrl;
  },
};

// Projects functions
export const projectsService = {
  // Get all user projects
  async getUserProjects(userId) {
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .eq('user_id', userId)
      .order('updated_at', { ascending: false });
    
    if (error) throw error;
    return data || [];
  },

  // Get project stats (MANUAL - no SQL function)
  async getProjectStats(userId) {
    const { data, error } = await supabase
      .from('projects')
      .select('id, status, project_type, views_count')
      .eq('user_id', userId);
    
    if (error) throw error;
    
    const projects = data || [];
    
    return {
      totalProjects: projects.length,
      deployedProjects: projects.filter(p => p.status === 'deployed').length,
      draftProjects: projects.filter(p => p.status === 'draft').length,
      totalViews: projects.reduce((sum, p) => sum + (p.views_count || 0), 0),
      templatesUsed: projects.filter(p => p.project_type === 'template').length,
    };
  },

  // Get recent projects
  async getRecentProjects(userId, limit = 6) {
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .eq('user_id', userId)
      .order('updated_at', { ascending: false })
      .limit(limit);
    
    if (error) throw error;
    return data || [];
  },

  // Create new project (FIXED column names)
  async createProject(userId, projectData) {
    const { data, error } = await supabase
      .from('projects')
      .insert({
        user_id: userId,
        name: projectData.name || 'Untitled Project', // ✅ name not project_name
        description: projectData.description || null,
        html_content: projectData.html_content || projectData.code || '', // ✅ html_content
        css_content: projectData.css_content || null, // ✅ css_content
        js_content: projectData.js_content || null, // ✅ js_content
        preview_image: projectData.preview_image || null, // ✅ preview_image
        status: projectData.status || 'draft',
        project_type: projectData.project_type || 'ai_generated', // ✅ project_type
        generation_id: projectData.generation_id || null,
        template_id: projectData.template_id || null,
      })
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  // Save AI-generated website (FIXED)
  async saveAIWebsite(userId, generatedCode, generationId = null) {
    try {
      // Extract project name from code (from <title> tag)
      const titleMatch = generatedCode.match(/<title[^>]*>(.*?)<\/title>/i);
      const projectName = titleMatch ? titleMatch[1] : 'AI Generated Website';
      
      // Generate thumbnail URL (placeholder for now)
      const previewImage = `https://placehold.co/400x300/1a1f3a/10b981?text=${encodeURIComponent(projectName.substring(0, 20))}`;
      
      const projectData = {
        name: projectName,
        description: `AI-generated website created on ${new Date().toLocaleDateString()}`,
        html_content: generatedCode, // ✅ Use html_content
        preview_image: previewImage, // ✅ Use preview_image
        status: 'draft',
        project_type: 'ai_generated', // ✅ Use project_type
        generation_id: generationId,
      };
      
      console.log('💾 Saving project with data:', projectData);
      
      return await this.createProject(userId, projectData);
    } catch (error) {
      console.error('Error saving AI website:', error);
      throw error;
    }
  },

  // Update project (FIXED column names)
  async updateProject(projectId, projectData) {
    const updateData = {
      updated_at: new Date().toISOString(),
    };

    // Only update fields that are provided
    if (projectData.name) updateData.name = projectData.name;
    if (projectData.description !== undefined) updateData.description = projectData.description;
    if (projectData.html_content) updateData.html_content = projectData.html_content;
    if (projectData.css_content !== undefined) updateData.css_content = projectData.css_content;
    if (projectData.js_content !== undefined) updateData.js_content = projectData.js_content;
    if (projectData.preview_image !== undefined) updateData.preview_image = projectData.preview_image;
    if (projectData.status) updateData.status = projectData.status;
    if (projectData.project_type) updateData.project_type = projectData.project_type;
    if (projectData.deployed_url !== undefined) updateData.deployed_url = projectData.deployed_url;
    if (projectData.deployed_at !== undefined) updateData.deployed_at = projectData.deployed_at;

    const { data, error } = await supabase
      .from('projects')
      .update(updateData)
      .eq('id', projectId)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  // Delete project
  async deleteProject(projectId) {
    const { error } = await supabase
      .from('projects')
      .delete()
      .eq('id', projectId);
    
    if (error) throw error;
  },

  // Increment project views
  async incrementViews(projectId) {
    const { error } = await supabase
      .rpc('increment_project_views', { p_project_id: projectId });
    
    if (error) {
      console.error('Error incrementing views:', error);
      // Fallback to manual increment
      const { data: project } = await supabase
        .from('projects')
        .select('views_count')
        .eq('id', projectId)
        .single();
      
      if (project) {
        await supabase
          .from('projects')
          .update({ views_count: (project.views_count || 0) + 1 })
          .eq('id', projectId);
      }
    }
  },
};

// Credits functions
export const creditsService = {
  // Get user credits info
  async getCredits(userId) {
    const { data, error } = await supabase
      .from('profiles')
      .select('tier, credits_remaining, credits_total, credits_reset_date, subscription_status')
      .eq('id', userId)
      .single();
    
    if (error) throw error;
    return data;
  },

  // Get credit transactions history
  async getTransactions(userId, limit = 50) {
    const { data, error } = await supabase
      .from('credit_transactions')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(limit);
    
    if (error) throw error;
    return data || [];
  },
};