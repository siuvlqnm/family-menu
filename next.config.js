/** @type {import('next').NextConfig} */
const nextConfig = {
  // 禁用不需要的特性
  images: {
    unoptimized: true,
  },

  // 优化打包大小
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.optimization = {
        ...config.optimization,
        minimize: true,
        moduleIds: 'deterministic',
      }

      config.optimization.splitChunks = {
        chunks: 'all',
        minSize: 10000,
        maxSize: 20000000,
        cacheGroups: {
          default: false,
          vendors: false,
          framework: {
            chunks: 'all',
            name: 'framework',
            test: /(?<!node_modules.*)[\\/]node_modules[\\/](react|react-dom|scheduler|prop-types|use-subscription)[\\/]/,
            priority: 40,
            enforce: true,
          },
          commons: {
            name: 'commons',
            minChunks: 2,
            priority: 20,
          },
        },
      }
    }
    return config
  },
}

module.exports = nextConfig
