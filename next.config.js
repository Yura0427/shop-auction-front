const { PHASE_DEVELOPMENT_SERVER } = require('next/constants');

module.exports = (phase) => ({
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    domains: [`${process.env.NEXT_PUBLIC_REACT_APP_DOMAIN}`],
  },
  async redirects() {
    return [
      {
        source: '/account',
        destination: '/account/personal-information',
        permanent: true,
      },
    ];
  },
  pageExtensions: ['ts', 'tsx', 'js', 'jsx']
    .map((extension) => {
      const isDevServer = phase === PHASE_DEVELOPMENT_SERVER;
      const prodExtension = `(?<!dev\.)${extension}`;
      const devExtension = `dev\.${extension}`;
      return isDevServer ? [devExtension, extension] : prodExtension;
    })
    .flat(),
});
