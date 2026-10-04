/* Real or Fake — logo bank (60 pairs), in the order they appear in logos.pdf.
   `name` is the brand name exactly as printed in the PDF. Pairs 52–60 have no
   name in the PDF; their names were added from what the logo shows.
   Images live in img/logos/<slug>_real.png and img/logos/<slug>_fake.png,
   extracted from the PDF at native resolution. Fake logos are kept exactly as
   they appear in the PDF. */

window.LOGOS = [
  { slug: "netflix",          name: "Netflix" },
  { slug: "cartoon-network",  name: "Cartoon Network" },
  { slug: "starbucks",        name: "Starbucks" },
  { slug: "dominos",          name: "Dominos" },
  { slug: "baskin-robbins",   name: "Baskin Robbins" },
  { slug: "mastercard",       name: "Mastercard" },
  { slug: "rolex",            name: "Rolex" },
  { slug: "microsoft",        name: "Microsoft" },
  { slug: "nestle",           name: "Nestle" },
  { slug: "porsche",          name: "Porsche" },
  { slug: "red-bull",         name: "Red bull" },
  { slug: "shell",            name: "Shell" },
  { slug: "xiaomi",           name: "Xiaomi" },
  { slug: "google-play",      name: "Google play" },
  { slug: "pringles",         name: "Pringles" },
  { slug: "tesla",            name: "Tesla" },
  { slug: "kappa",            name: "Kappa" },
  { slug: "bmw",              name: "BMW" },
  { slug: "subway",           name: "Subway" },
  { slug: "huawei",           name: "Huawei" },
  { slug: "twix",             name: "Twix" },
  { slug: "visa",             name: "Visa" },
  { slug: "paypal",           name: "PayPal" },
  { slug: "nintendo-switch",  name: "Nintendo Switch" },
  { slug: "spotify",          name: "Spotify" },
  { slug: "nbc",              name: "NBC" },
  { slug: "coca-cola",        name: "Coco cola" },
  { slug: "pepsi",            name: "Pepsi" },
  { slug: "walt-disney",      name: "Walt Disney" },
  { slug: "discord",          name: "Discord" },
  { slug: "opera",            name: "Opera" },
  { slug: "wikipedia",        name: "Wikipedia" },
  { slug: "olympics",         name: "Olympics" },
  { slug: "skype",            name: "Skype" },
  { slug: "tommy-hilfiger",   name: "Tommy Hilfiger" },
  { slug: "puma",             name: "Puma" },
  { slug: "walmart",          name: "Walmart" },
  { slug: "crocs",            name: "crocs" },
  { slug: "subaru",           name: "Subaru" },
  { slug: "firefox",          name: "Firefox" },
  { slug: "taco-bell",        name: "Taco bell" },
  { slug: "cheetos",          name: "Cheetos" },
  { slug: "ikea",             name: "Ikea" },
  { slug: "oral-b",           name: "Oral-B" },
  { slug: "maybelline",       name: "Maybelline" },
  { slug: "hersheys-kisses",  name: "Hershey’s kisses" },
  { slug: "ford",             name: "Ford" },
  { slug: "adidas",           name: "Adidas" },
  { slug: "drive",            name: "Drive" },
  { slug: "intel",            name: "intel" },
  { slug: "jaguar",           name: "Jaguar" },
  // Unnamed in the PDF (pages 18–21):
  { slug: "airbnb",           name: "Airbnb" },
  { slug: "android",          name: "Android" },
  { slug: "ariel",            name: "Ariel" },
  { slug: "shell-2",          name: "Shell" },
  { slug: "lg",               name: "LG" },
  { slug: "google-photos",    name: "Google Photos" },
  { slug: "ray-ban",          name: "Ray-Ban" },
  { slug: "mtv",              name: "MTV" },
  { slug: "john-deere",       name: "John Deere" }
].map(function (l) {
  l.real = "img/logos/" + l.slug + "_real.png";
  l.fake = "img/logos/" + l.slug + "_fake.png";
  return l;
});
