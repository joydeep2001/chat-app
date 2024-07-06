module.exports = {
  apps: [
    {
      name: 'app',
      script: './app.js',
      env: {
        NODE_ENV: 'development',
        DB_CONNECT: 'mongodb+srv://ant:ant@cluster0.vyjozac.mongodb.net/',
        ACCESS_TOKEN_SECRET: 'TheWorldIsInDenger',
        API_URL: 'http://localhost'
      },
      env_production: {
        NODE_ENV: 'production',
        // Add other production-specific environment variables here
        DB_CONNECT: 'mongodb+srv://ant:ant@cluster0.vyjozac.mongodb.net/',
        ACCESS_TOKEN_SECRET: 'TheWorldIsInDenger',
        API_URL: 'http://localhost'
      
      }
    }
  ]
};

