export const googleAdClientToken = 'ca-pub-6496929238779694';

export const googleAdInfo = {
  textAd: {
    slot: '1635090774',
    format: 'auto',
  },
  infieldAd: {
    slot: '4585414090',
    format: 'fluid',
    layoutKey: '-gw-3+1f-3d+2z',
  },
};

export const MIN_CONTENT_SAFE_CREDIT = 1000;

const domainRegex = new RegExp(
  /^(https?:\/\/)?(www\.)?(cindythink\.com)?\/(ja\/|en\/)?(puzzle|profile|rules)/
);
export const domainFilter = (url) => {
  const selfDomain = domainRegex.test(url);
  if (!selfDomain) {
    return { selfDomain, url };
  }

  return {
    selfDomain,
    url: url.replace(domainRegex, '/$5'),
  };
};
