/* Real or Fake — logo bank (60 pairs), in the order they appear in logos.pdf.
   Images live in img/logos/<slug>_real.png and img/logos/<slug>_fake.png,
   extracted from the PDF at native resolution. Fake logos are kept exactly as
   they appear in the PDF.

   name   brand name shown in the question (spelling corrected from the PDF,
          e.g. "Coco cola" -> "Coca-Cola"; pdfName keeps the original)
   hint   the "tell": what is different about the fake. Shown after each round
          and printed in the answer key. */

window.LOGOS = [
  { slug: "netflix",         name: "Netflix",         hint: "The shadow on the N's diagonal stroke is flipped in the fake." },
  { slug: "cartoon-network", name: "Cartoon Network", pdfName: "Cartoon Network", hint: "Real: a white C in a black box, then a black N. The fake swaps which letter sits in the box." },
  { slug: "starbucks",       name: "Starbucks",       hint: "The star on the siren's crown is solid in the real logo and hollow (outlined) in the fake." },
  { slug: "dominos",         name: "Domino's",        pdfName: "Dominos", hint: "Real: one dot on the red tile, two on the blue. The fake swaps them." },
  { slug: "baskin-robbins",  name: "Baskin-Robbins",  pdfName: "Baskin Robbins", hint: "Real: blue 'BR' and blue wording, with pink for the hidden '31'. The fake swaps blue and pink." },
  { slug: "mastercard",      name: "Mastercard",      hint: "Real: red circle on the left, yellow on the right. The fake swaps them." },
  { slug: "rolex",           name: "Rolex",           hint: "Real crown: five points ending in an even arc. The fake's points are staggered, with a tall middle spike." },
  { slug: "microsoft",       name: "Microsoft",       hint: "Real square order: red, green on top; blue, yellow below. The fake shuffles the colours." },
  { slug: "nestle",          name: "Nestlé",          pdfName: "Nestle", hint: "The real nest has two chicks; the fake has three. The fake's lettering is also heavier." },
  { slug: "porsche",         name: "Porsche",         hint: "The red and black stripes are in the opposite order in the fake." },
  { slug: "red-bull",        name: "Red Bull",        pdfName: "Red bull", hint: "Real: red bulls in front of a yellow sun. The fake has yellow bulls and a red sun." },
  { slug: "shell",           name: "Shell",           hint: "The real shell has seven red grooves; the fake has only a few wide ones." },
  { slug: "xiaomi",          name: "Xiaomi",          hint: "Real logo reads 'MI' (a plain bar). The fake has a dotted lowercase 'i'." },
  { slug: "google-play",     name: "Google Play",     pdfName: "Google play", hint: "Real: green at the top, yellow on the right. The fake swaps the green and yellow." },
  { slug: "pringles",        name: "Pringles",        hint: "The fake Mr. P has a smiling mouth under his moustache; the real one has no mouth showing." },
  { slug: "tesla",           name: "Tesla",           hint: "Subtle: the fake's top bar is thinner and the T's arms are a different shape." },
  { slug: "kappa",           name: "Kappa",           hint: "In the real logo the two seated figures' heads touch. The fake has a gap between them." },
  { slug: "bmw",             name: "BMW",             hint: "Real: blue in the top-left and bottom-right. The fake has blue top-right and bottom-left." },
  { slug: "subway",          name: "Subway",          hint: "Real: white 'SUB', yellow 'WAY'. The fake swaps the colours." },
  { slug: "huawei",          name: "Huawei",          hint: "At the bottom of the flower, the fake has small extra petals pointing down." },
  { slug: "twix",            name: "Twix",            hint: "The two bars in the circle above the 'i' stand upright in the real logo and lie flat ('=') in the fake." },
  { slug: "visa",            name: "Visa",            hint: "The real logo has a plain capital 'I'. The fake has a dotted lowercase 'i'." },
  { slug: "paypal",          name: "PayPal",          hint: "Real: dark blue 'Pay', light blue 'Pal'. The fake swaps them." },
  { slug: "nintendo-switch", name: "Nintendo Switch", hint: "Real: the outlined half has its dot at the top; the solid half has its dot lower down. The fake flips this." },
  { slug: "spotify",         name: "Spotify",         hint: "The real logo has three sound waves; the fake has four." },
  { slug: "nbc",             name: "NBC",             hint: "The peacock's feather colours are in a different order in the fake." },
  { slug: "coca-cola",       name: "Coca-Cola",       pdfName: "Coco cola", hint: "The fake's script is different: its first C curls like a '6'." },
  { slug: "pepsi",           name: "Pepsi",           hint: "The white wave through the globe is flipped in the fake." },
  { slug: "walt-disney",     name: "Walt Disney",     hint: "The real castle is drawn with fine lines; the fake castle is solid black." },
  { slug: "discord",         name: "Discord",         hint: "The fake has an antenna on top of the controller face." },
  { slug: "opera",           name: "Opera",           hint: "The dark shading inside the O is on the right in the real logo and on the left in the fake." },
  { slug: "wikipedia",       name: "Wikipedia",       hint: "The Ω and W puzzle pieces have swapped places in the fake." },
  { slug: "olympics",        name: "Olympics",        hint: "Real top row: blue, black, red; bottom row: yellow, green. The fake reverses the colours." },
  { slug: "skype",           name: "Skype",           hint: "The fake's S is more angular, with sharp, straight ends." },
  { slug: "tommy-hilfiger",  name: "Tommy Hilfiger",  hint: "The flag in the middle is red in the real logo and pink in the fake." },
  { slug: "puma",            name: "Puma",            hint: "The real puma is bigger and stretches over the end of the word; the fake is smaller and leaps up steeply." },
  { slug: "walmart",         name: "Walmart",         hint: "The yellow spark's six rays are rotated in the fake." },
  { slug: "crocs",           name: "Crocs",           pdfName: "crocs", hint: "The fake has two dots (an umlaut) over the 'o'." },
  { slug: "subaru",          name: "Subaru",          hint: "The real oval is blue; the fake is red." },
  { slug: "firefox",         name: "Firefox",         hint: "The fake fox has a visible eye and face details." },
  { slug: "taco-bell",       name: "Taco Bell",       pdfName: "Taco bell", hint: "The purple bell shape has a rounded top in the real logo and square corners in the fake." },
  { slug: "cheetos",         name: "Cheetos",         hint: "The edge inside the letters is red in the fake." },
  { slug: "ikea",            name: "IKEA",            pdfName: "Ikea", hint: "The real logo is all capitals. The fake has a dotted lowercase 'i'." },
  { slug: "oral-b",          name: "Oral-B",          hint: "Real: light blue with a hyphen ('Oral-B'). The fake is darker blue with no hyphen." },
  { slug: "maybelline",      name: "Maybelline",      hint: "The fake has a dotted lowercase 'i' and broken-looking E's." },
  { slug: "hersheys-kisses", name: "Hershey's Kisses", pdfName: "Hershey’s kisses", hint: "The real lettering is chocolate brown; the fake is navy blue." },
  { slug: "ford",            name: "Ford",            hint: "In the fake script, the F looks more like a T." },
  { slug: "adidas",          name: "Adidas",          hint: "The real logo has three stripes; the fake has four." },
  { slug: "drive",           name: "Google Drive",    pdfName: "Drive", hint: "Real: yellow on the top-right, blue along the bottom. The fake swaps yellow and blue." },
  { slug: "intel",           name: "Intel",           pdfName: "intel", hint: "The real logo is lowercase 'intel' with a light-blue square dot. The fake uses a capital 'I'." },
  { slug: "jaguar",          name: "Jaguar",          hint: "The real jaguar is snarling with its mouth open; the fake's mouth is closed." },
  // Unnamed in the PDF (pages 18–21); named from the logo:
  { slug: "airbnb",          name: "Airbnb",          hint: "The real symbol is a loop shape (the Bélo). The fake looks like an upside-down heart." },
  { slug: "android",         name: "Android",         hint: "The fake robot's antennas have round dots on the ends." },
  { slug: "ariel",           name: "Ariel",           hint: "Real: green star, red 'ARIEL'. The fake has a red star and green lettering." },
  { slug: "shell-2",         name: "Shell",           hint: "The fake has more red lines, and they meet in a point at the bottom." },
  { slug: "lg",              name: "LG",              hint: "The dot (the face's eye) is to the left of the L in the real logo and to the right in the fake." },
  { slug: "google-photos",   name: "Google Photos",   hint: "The four colours are rotated round in the fake." },
  { slug: "ray-ban",         name: "Ray-Ban",         hint: "The real logo has a dot between 'Ray' and 'Ban'. The fake uses a long dash." },
  { slug: "mtv",             name: "MTV",             hint: "The real 'TV' is thick and rough, like spray paint. The fake 'TV' is thin and neat." },
  { slug: "john-deere",      name: "John Deere",      hint: "The real deer leaps forward, stretched out. The fake deer jumps upward." }
].map(function (l) {
  l.pdfName = l.pdfName || (["airbnb", "android", "ariel", "shell-2", "lg", "google-photos", "ray-ban", "mtv", "john-deere"].indexOf(l.slug) !== -1 ? null : l.name);
  l.real = "img/logos/" + l.slug + "_real.png";
  l.fake = "img/logos/" + l.slug + "_fake.png";
  return l;
});
