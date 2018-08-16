// Generators
function generateBackgroundGradient(angle, alpha) {
    return `-webkit-linear-gradient(${angle}deg, rgba(240,47,23,${alpha}) 0%, rgba(246,41,12,${alpha}) 0%, rgba(241,111,92,${alpha}) 0%, rgba(253,177,154,${alpha}) 0%, rgba(197,99,250,${alpha}) 100%)`;
}

function hexToRgbA(hex, opq) {
    var c;
    if (/^#([A-Fa-f0-9]{3}){1,2}$/.test(hex)) {
        c = hex.substring(1).split('');
        if (c.length == 3) {
            c = [c[0], c[0], c[1], c[1], c[2], c[2]];
        }
        c = '0x' + c.join('');
        return (
            'rgba(' +
            [(c >> 16) & 255, (c >> 8) & 255, c & 255].join(',') +
            ',' +
            opq +
            ')'
        );
    }
    throw new Error('Bad Hex');
}

// example use
let theme = {
    // Color primitives
    primaryFont: 'FFDINWebProRegular',
    primary: '#D41359',
    secondary: '#B22752',
    highlight: '#666666',
    highlightSecondary: '#333333',
    success: '#2ecc71',
    teal: '#1CA3A3',
    darkPink: '#CA2171',
    backgroundGradient: generateBackgroundGradient(45, 1.0),
    reverseBackgroundGradient: generateBackgroundGradient(135, 1.0),

    // Font sizes
    headerFontSize: '50px',
    fontSize: '1.5em',

    // Generators
    generateBackgroundGradient
};

theme.gradientOverlay = `-webkit-linear-gradient(left, ${hexToRgbA(
    theme.secondary,
    0.4
)} 0%, ${hexToRgbA(theme.primary, 0.4)} 100%)`;

export default theme;
