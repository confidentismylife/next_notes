const withBundleAnalyzer = require('@next/bundle-analyzer')({
    enabled: process.env.ANALYZE === 'true',
})

/** @type {import('next').NextConfig} */
const nextConfig = {
    // 优化图片加载
    images: {
        // 减少图片尺寸选项，只保留必要的尺寸
        deviceSizes: [640, 750, 1080, 1920],
        imageSizes: [16, 32, 48, 96],
        // 启用现代图片格式
        formats: ['image/avif', 'image/webp'],
        minimumCacheTTL: 60,
        // 禁用未使用的优化
        dangerouslyAllowSVG: false,
        contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
        unoptimized: true,
        domains: [
            "firebasestorage.googleapis.com",
            "raw.githubusercontent.com",
            'res.cloudinary.com'
        ],
    },
    swcMinify: true, // 使用 SWC 进行代码压缩
    compiler: {
        removeConsole: {
            exclude: ['error', 'warn', 'info'],
        },
    },
    // 优化构建输出
    compress: true,
    poweredByHeader: false,
    // 生产环境优化
    productionBrowserSourceMaps: false,
    // 优化字体加载
    optimizeFonts: true,
    // 环境变量
    env: {
        BUILD_TIME: new Date().toISOString(),
    },
    // 优化打包
    webpack: (config, { dev, isServer }) => {
        // 添加 .md 文件支持
        config.module.rules.push({
            test: /\.md$/,
            use: 'raw-loader'
        });

        // 生产环境优化
        if (!dev && !isServer) {
            // 分割大模块
            config.optimization.splitChunks = {
                chunks: 'all',
                minSize: 20000,
                maxSize: 70000,
                cacheGroups: {
                    default: false,
                    vendors: false,
                    // 将第三方库打包到单独的chunk
                    framework: {
                        name: 'framework',
                        chunks: 'all',
                        test: /[\\/]node_modules[\\/]/,
                        priority: 40,
                        enforce: true,
                    },
                    // 将公共组件打包到单独的chunk
                    commons: {
                        name: 'commons',
                        chunks: 'all',
                        minChunks: 2,
                        priority: 20,
                    },
                },
            };
        }
        return config;
    },
    // 配置静态资源前缀
    assetPrefix: '/',
    // 禁用类型检查以支持静态导出
    typescript: {
        ignoreBuildErrors: true,
    },
}

// 开发环境配置
if (process.env.NODE_ENV === 'development') {
    nextConfig.reactStrictMode = true
}

module.exports = withBundleAnalyzer(nextConfig)