module.exports = {
  apps: [
    {
      name: 'phimhay247-node-media-server',
      port: '5002',
      exec_mode: 'cluster',
      instances: 'max',
      script: './src/index.js',
      watch: ['src', 'build'],
      watch_delay: 1000,
      ignore_watch: ['node_modules', 'src/public'],
      env: {
        NODE_ENV: 'production',
      },
      env_production: {
        NODE_ENV: 'production',
      },
      update_env: true,
    },
  ],
};
