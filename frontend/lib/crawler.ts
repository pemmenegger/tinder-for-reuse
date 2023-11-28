type Crawlers = {
  [key: number]: {
    name: string;
    logo: string;
  };
};

const crawlers: Crawlers = {
  1: {
    name: "Tutti",
    logo: "/imgs/tutti-logo.png",
  },
  2: {
    name: "Anibis",
    logo: "/imgs/anibis-logo.png",
  },
  3: {
    name: "Ricardo",
    logo: "/imgs/ricardo-logo.png",
  },
};

export const getCrawler = (crawlerId: number) => {
  const crawler = crawlers[crawlerId];

  if (!crawler) {
    throw new Error(`No crawler found with ID: ${crawlerId}`);
  }

  return crawler;
};
