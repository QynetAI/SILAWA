tailwind.config = {
    theme: {
        extend: {
            fontFamily: { sans: ['Inter', 'sans-serif'] },
            colors: {
                primary: '#2563eb',
                secondary: '#16a34a',
                accent: '#f59e0b'
            }
        }
    }
};

// =============================================
// ISI KREDENSIAL SUPABASE KAMU DI BAWAH INI
// =============================================
const SUPABASE_URL = "https://jvsghvunocguqiyhfwku.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imp2c2dodnVub2NndXFpeWhmd2t1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODgyNzE3MTYsImV4cCI6MjEwMzg0NzcxNn0.9H8v1K7bKm9xDzCOe9ymtrfxQ9BQ65o826vsp896WjE";

// Inisialisasi Supabase
const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY, {
    auth: { persistSession: true, autoRefreshToken: true }
});
