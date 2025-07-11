const path = require('path');

module.exports = {
    entry: './themes/docsite/assets/js/index.js',
    output: {
        filename: 'app.js',
        path: path.resolve(__dirname, 'themes', 'docsite', 'assets', 'js')
    }
};