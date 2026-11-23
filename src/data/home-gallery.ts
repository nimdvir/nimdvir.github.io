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
    title: "The hug that made UAlbany's highlights video",
    href: "/blog/commencement-2023/",
    linkLabel: "Read the post",
  },
  {
    image: "v1795472870/PersonalSite/Blog/2023-05-23-commencement/hooding.jpg",
    alt: "Nim Dvir in a doctoral gown on the UAlbany Commencement stage, being hooded as faculty in academic regalia stand around him",
    kicker: "Commencement 2023",
    title: "Hooded on stage",
    href: "/blog/commencement-2023/",
    linkLabel: "Read the post",
  },
  {
    image: "v1795472871/PersonalSite/Blog/2023-05-23-commencement/with-suraj-commuri.jpg",
    alt: "Nim Dvir in a purple doctoral gown and cap next to Suraj Commuri, in front of a wall of greenery and white flowers",
    kicker: "Commencement 2023",
    title: "With my dissertation advisor, Suraj Commuri",
    href: "/blog/commencement-2023/",
    linkLabel: "Read the post",
  },
  {
    image: "v1795472872/PersonalSite/Blog/2023-05-23-commencement/photo-booth-with-the-dogs.jpg",
    alt: "Nim Dvir in doctoral regalia holding two Yorkshire terriers in a UAlbany Magazine photo booth that reads Congrats Grad",
    kicker: "Commencement 2023",
    title: "The dogs came too. They dressed for it.",
    href: "/blog/commencement-2023/",
    linkLabel: "Read the post",
  },
  {
    image: "v1795465092/PersonalSite/Portfolio/research/sticky-words/dissertation-talk.jpg",
    alt: "Nim Dvir at the lectern with the Sticky Words dissertation title on two screens",
    kicker: "Research",
    title: "Presenting Sticky Words, my dissertation",
    href: "/research/sticky-words/",
    linkLabel: "About the research",
  },
  {
    image: "v1795465095/PersonalSite/Portfolio/teaching/lecture/lecture-hall.jpg",
    alt: "Nim Dvir teaching a large lecture class",
    kicker: "Teaching",
    title: "A full lecture hall at UAlbany",
    href: "/teaching/",
    linkLabel: "Teaching",
  },
  {
    image: "v1795472277/PersonalSite/Interviews/W122-aaron-eckhart-yvonne-strahovski/ynet-video-frame-nim-dvir.jpg",
    alt: "Nim Dvir asking a question beside an I, Frankenstein poster, with a Ynet caption showing his name",
    kicker: "Journalism",
    title: "Interviewing Aaron Eckhart for Ynet",
    href: "/articles/aaron-eckhart-yvonne-strahovski/",
    linkLabel: "Read the interview",
  },
];
