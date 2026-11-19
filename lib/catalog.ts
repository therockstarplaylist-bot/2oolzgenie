/**
 * 2oolzgenie App Store catalog — the only list of apps.
 *
 * To add an app later:
 * 1. Put the file in public/downloads/ (and screenshots in public/store/screens/).
 * 2. Add one entry to APPS below. Sizes and SHA-256 are read from the file.
 * 3. Add a matching headers rule in vercel.json and next.config.mjs so the
 *    file is served as an attachment. APKs need
 *    Content-Type: application/vnd.android.package-archive.
 */

export type Category = "game" | "tool";
export type Platform = "android" | "windows";
export type GlyphName = "island" | "dive" | "drop" | "lab" | "bridge" | "campus" | "research" | "avatar" | "lake";

export type StoreFile = {
  filename?: string;
  platform: Platform;
  /** Visible label on the big download button. */
  button: string;
  stepsTitle: string;
  steps: readonly string[];
  comingSoon?: boolean;
  /** Used when the file is not in the repo yet. */
  bytes?: number;
  sha256?: string;
};

export type Shot = {
  src: string;
  alt: string;
  caption: string;
  /** Drawn artwork. Never a fake gameplay screenshot. */
  art: boolean;
};

export type StoreApp = {
  slug: string;
  name: string;
  category: Category;
  featured?: boolean;
  version: string;
  price: "Free";
  tagline: string;
  description: string;
  /** Extra plain-language notes shown under the description. */
  notes?: readonly string[];
  glyph: GlyphName;
  accent: string;
  icon?: { src: string; alt: string };
  card: Shot;
  gallery: readonly Shot[];
  files: readonly StoreFile[];
  indie: string;
};

export const ANDROID_STEPS = [
  "Tap Download and wait for the file to finish.",
  "Open the file you just downloaded.",
  "If Android asks, allow installs from your browser.",
  "Tap Install.",
] as const;

const INDIE =
  "This is a free indie app from Brandon. It is not from Google Play.";

export const APPS: readonly StoreApp[] = [
  {
    slug: "world-launcher",
    name: "World Launcher",
    category: "tool",
    featured: true,
    version: "1.0.0",
    price: "Free",
    tagline: "Every app is a building you can walk into.",
    description:
      "A 3D world home-screen launcher. Walk around a floating sunset island, and every app on your phone is a building you walk into to open. Bots roam the streets, and two buildings run real checks.",
    glyph: "island",
    accent: "#ff4ad2",
    card: {
      src: "/store/screens/s1-spawn.png",
      alt: "World Launcher spawn plaza on a sunset island, with a character, bots, and app buildings.",
      caption: "Spawn plaza",
      art: false,
    },
    gallery: [
      {
        src: "/store/screens/s1-spawn.png",
        alt: "World Launcher spawn plaza on a sunset island. A character stands by a fountain while bots walk near app buildings.",
        caption: "Spawn plaza",
        art: false,
      },
      {
        src: "/store/screens/s2-street-bots.png",
        alt: "Walking a neon street in World Launcher. Bots roam the island, and a Big Drop building is highlighted.",
        caption: "Street with bots",
        art: false,
      },
      {
        src: "/store/screens/s3-job-card.png",
        alt: "A site-check card in World Launcher showing that 2oolzgenie and Brandon Game Lab are up.",
        caption: "A real site check",
        art: false,
      },
    ],
    files: [
      {
        filename: "WorldLauncher-1.0.0.apk",
        platform: "android",
        button: "Download for Android",
        stepsTitle: "How to install on Android",
        steps: ANDROID_STEPS,
      },
    ],
    indie: INDIE,
  },
  {
    slug: "deep-dive",
    name: "Deep Dive",
    category: "game",
    version: "1.0.0",
    price: "Free",
    tagline: "Find the treasure. Swim back up.",
    description:
      "A deep-ocean dive. Find the treasure deep down and swim back up without getting eaten by giant worms, squids and electric monsters.",
    glyph: "dive",
    accent: "#3ee7ff",
    icon: {
      src: "/store/screens/icon-512.png",
      alt: "",
    },
    card: {
      src: "/store/screens/7-glowing-abyss.png",
      alt: "Deep Dive in a dark glowing abyss, with jellyfish and a large creature beside the diver.",
      caption: "The glowing abyss",
      art: false,
    },
    gallery: [
      {
        src: "/store/screens/1-dive-start-with-buddy.png",
        alt: "Deep Dive just under the surface. Two divers swim past jellyfish, and the treasure is still far below.",
        caption: "The dive, with a buddy",
        art: false,
      },
      {
        src: "/store/screens/7-glowing-abyss.png",
        alt: "Deep Dive in the glowing abyss. Jellyfish and a huge dark creature fill the water.",
        caption: "The glowing abyss",
        art: false,
      },
      {
        src: "/store/screens/8-wreck-treasure.png",
        alt: "Deep Dive beside a dark wreck. The treasure marker says it is closer, below the diver.",
        caption: "Wreck and treasure",
        art: false,
      },
    ],
    files: [
      {
        filename: "DeepDive-1.0.0.apk",
        platform: "android",
        button: "Download for Android",
        stepsTitle: "How to install on Android",
        steps: ANDROID_STEPS,
      },
    ],
    indie: INDIE,
  },
  {
    slug: "big-drop",
    name: "Big Drop",
    category: "game",
    version: "1.0.0",
    price: "Free",
    tagline: "A sky-diving fall game.",
    description: "A sky-diving fall game.",
    glyph: "drop",
    accent: "#ff4ad2",
    card: {
      src: "/store/art/big-drop.svg",
      alt: "Neon artwork of a figure falling under a glowing parachute. This is not a screenshot of Big Drop.",
      caption: "Artwork, not a screenshot",
      art: true,
    },
    gallery: [
      {
        src: "/store/art/big-drop.svg",
        alt: "Neon artwork of a figure falling under a glowing parachute over a distant grid. This is not a screenshot of Big Drop.",
        caption: "Artwork, not a screenshot",
        art: true,
      },
    ],
    files: [
      {
        filename: "BigDrop-1.0.0.apk",
        platform: "android",
        button: "Download for Android",
        stepsTitle: "How to install on Android",
        steps: ANDROID_STEPS,
      },
    ],
    indie: INDIE,
  },
  {
    slug: "game-lab",
    name: "Game Lab",
    category: "game",
    version: "1.0.0",
    price: "Free",
    tagline: "Explore generated worlds.",
    description: "An environment playground where you explore generated worlds.",
    glyph: "lab",
    accent: "#d6ff4a",
    card: {
      src: "/store/art/game-lab.svg",
      alt: "Neon artwork of floating islands and rings. This is not a screenshot of Game Lab.",
      caption: "Artwork, not a screenshot",
      art: true,
    },
    gallery: [
      {
        src: "/store/art/game-lab.svg",
        alt: "Neon artwork of floating islands, a grid floor, and glowing rings. This is not a screenshot of Game Lab.",
        caption: "Artwork, not a screenshot",
        art: true,
      },
    ],
    files: [
      {
        filename: "GameLab-1.0.0.apk",
        platform: "android",
        button: "Download for Android",
        stepsTitle: "How to install on Android",
        steps: ANDROID_STEPS,
      },
    ],
    indie: INDIE,
  },
  {
    slug: "phone-bridge",
    name: "PhoneBridge",
    category: "tool",
    version: "1.0.0",
    price: "Free",
    tagline: "Send files from your phone to your PC.",
    description:
      "Send files and folders from your Android phone to your Windows PC over your home Wi-Fi. You install two things: the phone app, and the PC setup. The PC part has no window. It runs as a small icon by the clock, and that icon shows a pairing code.",
    glyph: "bridge",
    accent: "#3ee7ff",
    card: {
      src: "/store/art/phone-bridge.svg",
      alt: "Neon artwork of a phone and a PC linked by a glowing arc. This is not a screenshot of PhoneBridge.",
      caption: "Artwork, not a screenshot",
      art: true,
    },
    gallery: [
      {
        src: "/store/art/phone-bridge.svg",
        alt: "Neon artwork of a phone sending a file to a Windows PC across a glowing arc. This is not a screenshot of PhoneBridge.",
        caption: "Artwork, not a screenshot",
        art: true,
      },
    ],
    files: [
      {
        filename: "PhoneBridge-1.0.0.apk",
        platform: "android",
        button: "Download for Android",
        stepsTitle: "How to install the phone app",
        steps: ANDROID_STEPS,
      },
      {
        filename: "PhoneBridge-Setup-1.0.0.exe",
        platform: "windows",
        button: "Download for Windows",
        stepsTitle: "How to install on Windows",
        steps: [
          "Download the Windows setup and open it.",
          "Windows may show “Windows protected your PC”. Click More info, then Run anyway.",
          "The PC part has no window. It runs as a small icon by the clock.",
          "That icon shows a pairing code. Type the code into the phone app. Keep the phone and the PC on the same home Wi-Fi.",
        ],
      },
    ],
    indie: INDIE,
  },
  {
    slug: "sovereign-campus",
    name: "Sovereign Campus",
    category: "game",
    version: "2.7.1",
    price: "Free",
    tagline: "A huge offline world, including Spokane.",
    description:
      "A huge offline living world on your phone, with towns, the real city of Spokane, bots with lives and families, a giant rock stadium with light shows, potions, rides, a Mariana Trench dive and more.",
    glyph: "campus",
    accent: "#ff4ad2",
    card: {
      src: "/store/screens/campus/SovereignCampus-2.3.0-render-1-aurora.png",
      alt: "Sovereign Campus artwork of an aurora over a lit campus.",
      caption: "Aurora over the campus",
      art: false,
    },
    gallery: [
      {
        src: "/store/screens/campus/SovereignCampus-2.3.0-render-1-aurora.png",
        alt: "Sovereign Campus scene with an aurora above the grounds.",
        caption: "Aurora",
        art: false,
      },
      {
        src: "/store/screens/campus/SovereignCampus-2.4.0-after-2_campus_night.png",
        alt: "Sovereign Campus at night, with the grounds lit up.",
        caption: "Campus at night",
        art: false,
      },
      {
        src: "/store/screens/campus/SovereignCampus-2.2.8-02_potion_shop.png",
        alt: "A potion shop inside Sovereign Campus.",
        caption: "Potion shop",
        art: false,
      },
      {
        src: "/store/screens/campus/lead_stage_34.png",
        alt: "A stadium stage with lights in Sovereign Campus.",
        caption: "Stadium lights",
        art: false,
      },
    ],
    files: [
      {
        platform: "android",
        button: "Coming soon",
        stepsTitle: "How to install on Android",
        steps: ANDROID_STEPS,
        comingSoon: true,
        bytes: 99276334,
        sha256: "529fd43e11ce8493c2738c7970382f9892c5045f6d39b07dedc963ca1e32e141",
      },
    ],
    indie: INDIE,
  },
  {
    slug: "winning-research-lab",
    name: "Winning Research Lab",
    category: "tool",
    version: "3.0.3",
    price: "Free",
    tagline: "Research bots that read, chat, and remember.",
    description:
      "A 3D lab of research bots that read your files and topics, chat with each other, and remember. Fully offline.",
    glyph: "research",
    accent: "#3ee7ff",
    card: {
      src: "/store/screens/wrl/v303-07-6_Demo_Research_Room.png",
      alt: "Winning Research Lab research room with bots at work.",
      caption: "Research room",
      art: false,
    },
    gallery: [
      {
        src: "/store/screens/wrl/v303-01-choice.png",
        alt: "The opening choice screen in Winning Research Lab.",
        caption: "Choose a room",
        art: false,
      },
      {
        src: "/store/screens/wrl/v303-07-6_Demo_Research_Room.png",
        alt: "Bots in the Winning Research Lab research room.",
        caption: "Research room",
        art: false,
      },
      {
        src: "/store/screens/wrl/v303-08-7_Demo_Training_Room.png",
        alt: "The training room in Winning Research Lab.",
        caption: "Training room",
        art: false,
      },
    ],
    files: [
      {
        filename: "WinningResearchLab-3.0.3.apk",
        platform: "android",
        button: "Download for Android",
        stepsTitle: "How to install on Android",
        steps: ANDROID_STEPS,
      },
    ],
    indie: INDIE,
  },
  {
    slug: "avatar-maker",
    name: "Avatar Maker",
    category: "tool",
    version: "2.3.1",
    price: "Free",
    tagline: "Build a 3D avatar from a photo or from scratch.",
    description:
      "Build 3D avatars from a photo or from scratch: faces, clothes, tattoos and stickers, with PNG, .obj, and .glb export.",
    glyph: "avatar",
    accent: "#ff4ad2",
    card: {
      src: "/store/screens/avatar/0-face-variations-closeup.png",
      alt: "Close-up face variations made in Avatar Maker.",
      caption: "Face variations",
      art: false,
    },
    gallery: [
      {
        src: "/store/screens/avatar/0-face-variations-closeup.png",
        alt: "Several Avatar Maker faces shown close up.",
        caption: "Face variations",
        art: false,
      },
      {
        src: "/store/screens/avatar/4-face-photo-variation-C-3d-beard-freckles.png",
        alt: "A 3D Avatar Maker face with a beard and freckles, made from a photo variation.",
        caption: "Photo variation",
        art: false,
      },
      {
        src: "/store/screens/avatar/7-face-regular-avatar-variation.png",
        alt: "A finished 3D avatar in Avatar Maker.",
        caption: "A finished avatar",
        art: false,
      },
    ],
    files: [
      {
        filename: "AvatarMaker-2.3.1.apk",
        platform: "android",
        button: "Download for Android",
        stepsTitle: "How to install on Android",
        steps: ANDROID_STEPS,
      },
    ],
    indie: INDIE,
  },
  {
    slug: "dream-lake",
    name: "Dream Lake",
    category: "game",
    version: "1.0.7",
    price: "Free",
    tagline: "Waterfalls, a sky dragon, and a carnival.",
    description:
      "A dreamy 3D world of waterfalls, a sky dragon tour, free falls, and a magical carnival of rides.",
    glyph: "lake",
    accent: "#7af6ff",
    card: {
      src: "/store/screens/dreamlake/01-whats-new-portrait.png",
      alt: "Dream Lake scene introducing waterfalls and rides.",
      caption: "What's new",
      art: false,
    },
    gallery: [
      {
        src: "/store/screens/dreamlake/01-whats-new-portrait.png",
        alt: "Dream Lake portrait of the world and its rides.",
        caption: "The lake",
        art: false,
      },
      {
        src: "/store/screens/dreamlake/02-thrills-portrait.png",
        alt: "Dream Lake thrills, with a drop and carnival rides.",
        caption: "Thrills",
        art: false,
      },
    ],
    files: [
      {
        filename: "DreamLake-1.0.7.apk",
        platform: "android",
        button: "Download for Android",
        stepsTitle: "How to install on Android",
        steps: ANDROID_STEPS,
      },
    ],
    indie: INDIE,
  },
];

export const TOP_PICKS = [
  "sovereign-campus",
  "world-launcher",
  "winning-research-lab",
  "deep-dive",
  "dream-lake",
  "avatar-maker",
] as const;

export function getApp(slug: string): StoreApp | undefined {
  return APPS.find((app) => app.slug === slug);
}

export function games(): readonly StoreApp[] {
  return APPS.filter((app) => app.category === "game");
}

/** Tools on the home list. The featured app already has the hero. */
export function homeTools(): readonly StoreApp[] {
  return APPS.filter((app) => app.category === "tool" && !app.featured);
}

export function allTools(): readonly StoreApp[] {
  return APPS.filter((app) => app.category === "tool");
}

export function featuredApp(): StoreApp {
  const app = APPS.find((item) => item.featured);
  if (!app) throw new Error("Catalog is missing a featured app");
  return app;
}

export function androidFile(app: StoreApp): StoreFile {
  const file = app.files.find((item) => item.platform === "android");
  if (!file) throw new Error(`${app.slug} has no Android download`);
  return file;
}

export function downloadHref(file: StoreFile): string {
  return `/downloads/${file.filename}`;
}
