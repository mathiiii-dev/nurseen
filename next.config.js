/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  env: {
    SECRET: 'CQPkxYTh9LEp+CiC42wrZDa4jVMf/JRwP84pAd07G5o=',
  },
}

const { withGlobalCss } = require('next-global-css')

const withConfig = withGlobalCss()

module.exports =  withConfig(nextConfig)
