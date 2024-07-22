module.exports = {
  apps: [
    {
      name: 'backend.maroon',
      script: 'dist/main.js',
      autorestart: true,
      watch: false,
      max_memory_restart: '750M',
      env_dev: {
        NODE_ENV: 'development',
      },
      env_prod: {
        NODE_ENV: 'production',
      },
    },
  ],
};
