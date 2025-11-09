import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_REACT_SUPABASE_PROJECT_URL
const supabaseKey = import.meta.env.VITE_REACT_SUPABASE_API_KEY


//  export เพื่อเอาไปใช้กับ Page ต่างๆ ที่จะต้องทำงานกับ supabase ทั้ง DB และ Storage
export const supabase = createClient(supabaseUrl, supabaseKey)