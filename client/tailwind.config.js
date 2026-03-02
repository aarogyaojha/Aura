/** @type {import('tailwindcss').Config} */
module.exports = {
    darkMode: ["class"],
    content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./node_modules/tw-elements/dist/js/**/*.js",
  ],

  theme: {
  	container: {
  		padding: {
  			DEFAULT: '1rem',
  			sm: '2rem',
  			lg: '4rem',
  			xl: '5rem',
  			'2xl': '4rem'
  		}
  	},
  	extend: {
  		boxShadow: {
  			'3xl': '-1px 34px 47px -29px rgb(32 32 32 / 100%)',
  			'4xl': ' 0vw 0vw 0.5vw 0vw rgb(32 32 32 / 20%)',
  			'5xl': ' 0vw 0.5vw 0.5vw 0vw rgb(32 32 32 / 16%)',
  			glass: '1px 5px 12px 1px rgba( 31, 38, 135, 0.37 )',
  			'glass-card': '4px 4px 4px 4px rgba( 32, 32, 32, 0.37 )',
  			'card-shadow': '0 8px 32px 0 rgba( 31, 38, 135, 0.37 )',
  			'dark-shadow': '10px 10px 5px 0px rgba(130,130,130,0.75)'
  		},
  		colors: {
  			background: 'hsl(var(--background))',
  			primary: {
  				'50': '#FFF2D0',
  				'100': '#FFB2B2',
  				'200': '#E36A6A',
  				'300': '#D45D5D',
  				'400': '#C55050',
  				'500': '#E36A6A',
  				'600': '#D45D5D',
  				'700': '#B64343',
  				'800': '#A73636',
  				'900': '#982929',
  				DEFAULT: 'hsl(var(--primary))',
  				foreground: 'hsl(var(--primary-foreground))'
  			},
  			blue: {
  				'50': '#FFF2D0',
  				'100': '#FFB2B2',
  				'200': '#E36A6A',
  				'300': '#D45D5D',
  				'400': '#FFB2B2',
  				'500': '#E36A6A',
  				'600': '#D45D5D',
  				'700': '#B64343',
  				'800': '#A73636',
  				'900': '#982929'
  			},
  			foreground: 'hsl(var(--foreground))',
  			card: {
  				DEFAULT: 'hsl(var(--card))',
  				foreground: 'hsl(var(--card-foreground))'
  			},
  			popover: {
  				DEFAULT: 'hsl(var(--popover))',
  				foreground: 'hsl(var(--popover-foreground))'
  			},
  			secondary: {
  				DEFAULT: 'hsl(var(--secondary))',
  				foreground: 'hsl(var(--secondary-foreground))'
  			},
  			muted: {
  				DEFAULT: 'hsl(var(--muted))',
  				foreground: 'hsl(var(--muted-foreground))'
  			},
  			accent: {
  				DEFAULT: 'hsl(var(--accent))',
  				foreground: 'hsl(var(--accent-foreground))'
  			},
  			destructive: {
  				DEFAULT: 'hsl(var(--destructive))',
  				foreground: 'hsl(var(--destructive-foreground))'
  			},
  			border: 'hsl(var(--border))',
  			input: 'hsl(var(--input))',
  			ring: 'hsl(var(--ring))',
  			chart: {
  				'1': 'hsl(var(--chart-1))',
  				'2': 'hsl(var(--chart-2))',
  				'3': 'hsl(var(--chart-3))',
  				'4': 'hsl(var(--chart-4))',
  				'5': 'hsl(var(--chart-5))'
  			}
  		},
  		borderRadius: {
  			lg: 'var(--radius)',
  			md: 'calc(var(--radius) - 2px)',
  			sm: 'calc(var(--radius) - 4px)'
  		}
  	}
  },

  plugins: [require("tailwindcss-animate")],
};
