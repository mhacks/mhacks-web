// Generators
function generateBackgroundGradient(angle, alpha, primary, secondary) {
    return `-webkit-linear-gradient(${angle}deg, ${hexToRgbA(
        primary,
        alpha
    )} 0%, ${hexToRgbA(secondary, alpha)} 0%, ${hexToRgbA(
        primary,
        alpha
    )} 0%, ${hexToRgbA(secondary, alpha)} 0%, ${hexToRgbA(
        primary,
        alpha
    )} 100%)`;
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
    primary: '#000000',
    secondary: '#CA3333',
    highlight: '#ffffff',
    highlightSecondary: '#DDDDDD',
    highlightOpposite: '#333333',
    highlightSecondaryOpposite: '#666666',
    success: '#2ecc71',

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

theme.backgroundGradient = generateBackgroundGradient(
    45,
    1.0,
    theme.highlightOpposite,
    theme.highlightSecondaryOpposite
);
theme.reverseBackgroundGradient = generateBackgroundGradient(
    135,
    1.0,
    theme.highlightOpposite,
    theme.highlightSecondaryOpposite
);

export default theme;
