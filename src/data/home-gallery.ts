// The home gallery: the rotating photo gallery on the home page (src/components/HomeGallery.astro).
//
// To add a photo, add an entry below; slides show in this order.
// - image: the Cloudinary path after /image/upload/ (version and public ID), no transformations.
// - crop: optional Cloudinary crop applied first, for example "c_crop,x_0,y_590,w_1125,h_465".
// - alt: what the photo shows. kicker: a short label. title: the caption.
// - href and linkLabel: optional link to the page the photo belongs to.
// Photos are shown whole over a blurred copy of themselves, so portrait and landscape both work.

export interface HomeGallerySlide {
  image: string;
  crop?: string;
  alt: string;
  kicker: string;
  title: string;
  href?: string;
  linkLabel?: string;
}

export const homeGallery: HomeGallerySlide[] = [
  {
    image: "v1795472673/PersonalSite/Blog/2023-05-23-commencement/ualbany-commencement-post.jpg",
    crop: "c_crop,x_0,y_590,w_1125,h_465",
    alt: "Nim Dvir in a doctoral cap, eyes shut and grinning, being hugged by Ella Yaari",
    kicker: "Commencement 2023",
    title: "A whole dissertation, and UAlbany's highlight reel went with the hug. Fair.",
    href: "/blog/commencement-2023/",
    linkLabel: "Read the post",
  },
  {
    image: "v1795472870/PersonalSite/Blog/2023-05-23-commencement/hooding.jpg",
    alt: "Nim Dvir in a doctoral gown on the UAlbany Commencement stage, being hooded as faculty in academic regalia stand around him",
    kicker: "Commencement 2023",
    title: "Velvet gown, gold piping, three bars on each sleeve, a hood going on. And sneakers.",
    href: "/blog/commencement-2023/",
    linkLabel: "Read the post",
  },
  {
    image: "v1795472871/PersonalSite/Blog/2023-05-23-commencement/with-suraj-commuri.jpg",
    alt: "Nim Dvir in a purple doctoral gown and cap next to Suraj Commuri, in front of a wall of greenery and white flowers",
    kicker: "Commencement 2023",
    title: "My dissertation advisor, Suraj Commuri, already out of his robe. Mine stayed on.",
    href: "/blog/commencement-2023/",
    linkLabel: "Read the post",
  },
  {
    image: "v1795472872/PersonalSite/Blog/2023-05-23-commencement/photo-booth-with-the-dogs.jpg",
    alt: "Nim Dvir in doctoral regalia holding two Yorkshire terriers in a UAlbany Magazine photo booth that reads Congrats Grad",
    kicker: "Commencement 2023",
    title: "The sign says “One of the greats.” It was talking about the Yorkies.",
    href: "/blog/commencement-2023/",
    linkLabel: "Read the post",
  },
  {
    image: "v1795474493/PersonalSite/Blog/2025-10-10-cehc-sign/cehc-sign.jpg",
    alt: "A CEHC sign with a large close-up of Nimrod Dvir, class of 2022, listing his PhD, his teaching internship and his job after graduating",
    kicker: "CEHC, 2025",
    title: "Class of ’22, now available in poster size.",
    href: "/blog/cehc-sign/",
    linkLabel: "Read the post",
  },
  {
    image: "v1795465092/PersonalSite/Portfolio/research/sticky-words/dissertation-talk.jpg",
    alt: "Nim Dvir at the lectern with the Sticky Words dissertation title on two screens",
    kicker: "Research",
    title: "My dissertation, Sticky Words, on two screens at once. Subtle.",
    href: "/research/sticky-words/",
    linkLabel: "About the research",
  },
  {
    image: "v1795465095/PersonalSite/Portfolio/teaching/lecture/lecture-hall.jpg",
    alt: "Nim Dvir teaching a large lecture class",
    kicker: "Teaching",
    title: "A full lecture hall at UAlbany. Voluntarily, as far as I know.",
    href: "/teaching/",
    linkLabel: "Teaching",
  },
  {
    image: "v1795472277/PersonalSite/Interviews/W122-aaron-eckhart-yvonne-strahovski/ynet-video-frame-nim-dvir.jpg",
    alt: "Nim Dvir asking a question beside an I, Frankenstein poster, with a Ynet caption showing his name",
    kicker: "Ynet, 2014",
    title: "Interviewing Aaron Eckhart. I got a name strap; he got a poster.",
    href: "/articles/aaron-eckhart-yvonne-strahovski/",
    linkLabel: "Read the interview",
  },
  {
    image: "v1795474492/PersonalSite/Interviews/W106-sex-and-the-city-2/photo-by-nim-dvir-israeli-poster.jpg",
    alt: "The Israeli Sex and the City 2 poster, with a highlighted quote from Nim Dvir and Dana Darvinsky's review above Kristin Davis and Sarah Jessica Parker",
    kicker: "nrg, 2010",
    title: "My name, Sarah Jessica Parker and the word “sex,” on one poster. It should happen more often.",
    href: "/blog/sex-and-the-city-2-poster/",
    linkLabel: "Read the post",
  },
];
