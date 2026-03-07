import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://yxxmhxfrdubdxrxeylqd.supabase.co';
const supabaseKey = yxxmhxfrdubdxrxeylqd;

export const supabase = createClient(supabaseUrl, supabaseKey);