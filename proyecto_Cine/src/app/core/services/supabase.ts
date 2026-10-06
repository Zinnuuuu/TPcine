import { Service } from '@angular/core';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { environment } from '../../../environments/environment';

@Service()
export class Supabase {
    cliente: SupabaseClient = createClient(environment.supabaseUrl, environment.supabaseKey);
}