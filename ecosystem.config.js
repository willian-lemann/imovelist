module.exports = {
  apps: [
    {
      name: 'adonis-template',
      script: './server.js',
      instances: 'max',
      exec_mode: 'cluster',
      autorestart: true,
    },
  ],
}
