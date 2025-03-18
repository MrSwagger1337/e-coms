export type Dictionary = {
  navigation: {
    home: string;
    allProducts: string;
    cosmetics: string;
    perfume: string;
    beauty: string;
  };
  categories: {
    cosmetics: string;
    perfume: string;
    beauty: string;
    all: string;
  };
  product: {
    addToCart: string;
    buy: string;
    price: string;
  };
  cart: {
    title: string;
    empty: string;
    emptyDescription: string;
    shopNow: string;
    subtotal: string;
    checkout: string;
    delete: string;
    removing: string;
  };
  payment: {
    success: {
      title: string;
      description: string;
      backToHome: string;
    };
    cancel: {
      title: string;
      description: string;
      backToHome: string;
    };
  };
  landing: {
    discover: string;
    wonders: string;
    youWill: string;
    fallInLove: string;
    with: string;
  };
  featured: {
    title: string;
    sale: string;
  };
  shopBy: {
    category: string;
    shopNow: string;
  };
  language: {
    english: string;
    arabic: string;
  };
};

const dictionaries = {
  en: () =>
    import("./dictionaries/en.json").then(
      (module) => module.default
    ) as Promise<Dictionary>,
  ar: () =>
    import("./dictionaries/ar.json").then(
      (module) => module.default
    ) as Promise<Dictionary>,
};

export const getDictionary = async (locale: "en" | "ar") =>
  dictionaries[locale]();
