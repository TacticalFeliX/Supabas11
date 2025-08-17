import { Hono } from 'npm:hono'
import { cors } from 'npm:hono/cors'
import { logger } from 'npm:hono/logger'
import { supabase } from './kv_store.jsx'

const app = new Hono()

// Enable CORS middleware
app.use('*', cors({
  origin: ['*','http://localhost:5173'],
  allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowHeaders: ['Content-Type', 'Authorization', 'apikey', 'x-client-info']
}))

// Explicit OPTIONS handler
app.options('*', (c) => {
  console.log('Preflight request received')
  return new Response(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization, apikey, x-client-info',
    },
  })
})



// Add logging
app.use('*', logger(console.log))

// --- AUTH ---

// Register new user
app.post('/make-server-1276a223/auth/register', async (c) => {
  try {
    const { aadhar_number, full_name, dob, gender, address, phone_number, email, password } = await c.req.json();

    if (!aadhar_number || !full_name || !dob || !gender || !phone_number || !password) {
      return c.json({ success: false, error: 'Missing required fields' }, 400);
    }

    // In a real app, use a proper password hashing library like bcrypt
    const password_hash = btoa(password);

    const { data, error } = await supabase
      .from('users')
      .insert([{ aadhar_number, full_name, dob, gender, address, phone_number, email, password_hash }])
      .select();

    if (error) {
      return c.json({ success: false, error: error.message }, 400);
    }

    return c.json({ success: true, message: 'Registration successful', user: data[0] });

  } catch (error) {
    console.error('Registration error:', error);
    return c.json({ success: false, error: 'Registration failed' }, 500);
  }
});

// Login
app.post('/make-server-1276a223/auth/login', async (c) => {
  try {
    const { email, password } = await c.req.json();

    const { data: user, error } = await supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .single();

    if (error || !user) {
      return c.json({ success: false, error: 'Invalid credentials' }, 401);
    }

    // In a real app, use a proper password hashing library like bcrypt
    const password_hash = btoa(password);
    if (user.password_hash !== password_hash) {
      return c.json({ success: false, error: 'Invalid credentials' }, 401);
    }
    
    await supabase
      .from('users')
      .update({ last_login: new Date().toISOString() })
      .eq('user_id', user.user_id);

    // Remove sensitive data from response
    delete user.password_hash;
    delete user.aadhar_number;

    return c.json({ success: true, message: 'Login successful', user });

  } catch (error) {
    console.error('Login error:', error);
    return c.json({ success: false, error: 'Login failed' }, 500);
  }
});


// --- USER ---

// Get user profile
app.get('/make-server-1276a223/user/profile/:userId', async (c) => {
  try {
    const userId = c.req.param('userId');
    
    const { data: user, error } = await supabase
      .from('users')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (error || !user) {
      return c.json({ success: false, error: 'User not found' }, 404);
    }

    // Remove sensitive data
    delete user.password_hash;
    delete user.aadhar_number;

    return c.json({ success: true, user });

  } catch (error) {
    console.error('Get profile error:', error);
    return c.json({ success: false, error: 'Failed to get profile' }, 500);
  }
});


// --- GRIEVANCE REPORTS ---

// Report a grievance
app.post('/make-server-1276a223/grievance/report', async (c) => {
  try {
    const reportData = await c.req.json();
    
    const { data, error } = await supabase
      .from('grievance_reports')
      .insert([reportData])
      .select();

    if (error) {
      return c.json({ success: false, error: error.message }, 400);
    }

    return c.json({ success: true, message: 'Grievance reported successfully', report: data[0] });

  } catch (error) {
    console.error('Report grievance error:', error);
    return c.json({ success: false, error: 'Failed to report grievance' }, 500);
  }
});

// Get user's grievance reports
app.get('/make-server-1276a223/grievance/user/:userId', async (c) => {
  try {
    const userId = c.req.param('userId');
    
    const { data, error } = await supabase
      .from('grievance_reports')
      .select('*')
      .eq('user_id', userId);

    if (error) {
      return c.json({ success: false, error: error.message }, 500);
    }

    return c.json({ success: true, reports: data });

  } catch (error) {
    console.error('Get user grievances error:', error);
    return c.json({ success: false, error: 'Failed to get grievances' }, 500);
  }
});


// --- SUSPICIOUS ENTITY REPORTS ---

// Report a suspicious entity
app.post('/make-server-1276a223/suspicious/report', async (c) => {
  try {
    const reportData = await c.req.json();
    
    const { data, error } = await supabase
      .from('suspicious_entity_reports')
      .insert([reportData])
      .select();

    if (error) {
      return c.json({ success: false, error: error.message }, 400);
    }

    return c.json({ success: true, message: 'Suspicious entity reported successfully', report: data[0] });

  } catch (error) {
    console.error('Report suspicious entity error:', error);
    return c.json({ success: false, error: 'Failed to report suspicious entity' }, 500);
  }
});


// --- ADMIN ---

// Get all grievance reports
app.get('/make-server-1276a223/admin/grievances', async (c) => {
  try {
    const { data, error } = await supabase
      .from('grievance_reports')
      .select(`
        *,
        problem_subcategories ( name ),
        users ( full_name, email )
      `);

    if (error) {
      return c.json({ success: false, error: error.message }, 500);
    }
    
    return c.json({ success: true, grievances: data });
  } catch (error) {
    console.error('Error fetching grievances:', error)
    return c.json({ error: 'Failed to fetch grievances' }, 500)
  }
})

// Update grievance report status
app.put('/make-server-1276a223/admin/grievances/:id/status', async (c) => {
  try {
    const reportId = c.req.param('id');
    const { status, handled_by_admin } = await c.req.json();
    
    const { data, error } = await supabase
      .from('grievance_reports')
      .update({ status, handled_by_admin })
      .eq('report_id', reportId)
      .select();

    if (error) {
      return c.json({ success: false, error: error.message }, 400);
    }
    
    return c.json({ success: true, report: data[0] });
  } catch (error) {
    console.error('Error updating grievance status:', error)
    return c.json({ error: 'Failed to update status' }, 500)
  }
})

// Get all suspicious entity reports
app.get('/make-server-1276a223/admin/suspicious-entities', async (c) => {
  try {
    const { data, error } = await supabase
      .from('suspicious_entity_reports')
      .select(`
        *,
        users ( full_name, email )
      `);

    if (error) {
      return c.json({ success: false, error: error.message }, 500);
    }

    return c.json({ success: true, entities: data });
  } catch (error) {
    console.error('Error fetching suspicious entities:', error)
    return c.json({ error: 'Failed to fetch entities' }, 500)
  }
})


// Health check
app.get('/make-server-1276a223/health', (c) => {
  return c.json({ status: 'healthy', timestamp: new Date().toISOString() });
});

// Error handling
app.onError((err, c) => {
  console.error('Server error:', err);
  return c.json({ success: false, error: 'Internal server error' }, 500);
});

Deno.serve(app.fetch);
