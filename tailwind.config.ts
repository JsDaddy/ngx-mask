import { type Config } from 'tailwindcss';

const tailwindConfig: Config = {
    content: ['./src/**/*.{html,scss,ts}'],
    theme: {
        extend: {
            screens: {
                mob: { min: '1px', max: '700px' },
                tab: { min: '700px', max: '1279px' },
                desk: { min: '1279px' },
            },
            fontFamily: {
                sans: ['Varela', 'system-ui', 'sans-serif'],
            },
            colors: {
                dark: {
                    DEFAULT: '#191919',
                },
                yellow: {
                    DEFAULT: '#FFD64D',
                },
                green: {
                    DEFAULT: '#1AB77E',
                },
                orange: {
                    DEFAULT: '#FF710A',
                },
                'full-white': '#FFFFFF',
                white: {
                    DEFAULT: '#F8F8F8',
                },
            },
            spacing: {
                '5px': '5px',
                '15px': '15px',
                '30px': '30px',
                '35px': '35px',
                '50px': '50px',
            },
            fontSize: {
                title: [
                    '10px',
                    {
                        lineHeight: '14px',
                        fontWeight: '400',
                    },
                ],
                'span-12': [
                    '12px',
                    {
                        lineHeight: '21px',
                        fontWeight: '400',
                    },
                ],
                span: [
                    '14px',
                    {
                        lineHeight: '21px',
                        fontWeight: '400',
                    },
                ],

                h3: [
                    '25px',
                    {
                        lineHeight: '27px',
                        fontWeight: '500',
                    },
                ],
                h5: [
                    '16px',
                    {
                        lineHeight: '24px',
                        fontWeight: '400',
                    },
                ],
            },
            borderRadius: {
                '4px': '4px',
                '5px': '5px',
                '10px': '10px',
                '15px': '15px',
                '25px': '25px',
            },
            borderWidth: {
                '2px': '2px',
            },
        },
    },
    plugins: [],
};

export default tailwindConfig;
