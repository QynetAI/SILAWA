tailwind.config = {
    theme: {
        extend: {
            fontFamily: { sans: ['Inter', 'sans-serif'] },
            colors: {
                primary: '#165DFF',
                secondary: '#00B42A',
                accent: '#FF7D00',
                neutral: {
                    50: '#F7F8FA', 100: '#F5F7FA', 200: '#E5E6EB', 300: '#C9CDD4',
                    400: '#86909C', 600: '#4E5969', 800: '#1D2129',
                }
            },
            boxShadow: {
                soft: '0 4px 20px rgba(0,0,0,0.06)',
                hover: '0 8px 30px rgba(22,93,255,0.12)',
            }
        }
    }
}