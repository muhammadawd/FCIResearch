let publicPath = process.env.NODE_ENV === 'production' ? '/~approctest/students/front/' : '/';

module.exports = {
    publicPath,
    productionSourceMap: false,
};
