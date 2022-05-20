/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    env: {
        SECRET: 'CQPkxYTh9LEp+CiC42wrZDa4jVMf/JRwP84pAd07G5o=',
        BASE_URL: 'http://localhost:8010/proxy/api/',
        MEDIA_URL: 'http://localhost:8020/proxy/',
    },
};

const { withGlobalCss } = require('next-global-css');

const withConfig = withGlobalCss();

module.exports = withConfig(nextConfig);
