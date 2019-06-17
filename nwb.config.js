module.exports = {
  type: 'react-component',
  npm: {
    esModules: true,
    umd: {
      global: 'JSX_CUSTOM_ELEMENTS',
      externals: {
        react: 'React'
      }
    }
  },
  webpack: {
    html: {
      template: './demo/src/index.html'
    }
  }
}
