import { Fellowship } from "@/litm/fellowship";
import { Hero } from "@/litm/hero";
import { Tag } from "@/litm/tag";
import { HeroTheme } from "@/litm/theme";

export const fellowship1 = Fellowship.deserialize({
  id: "example-fellowship-1",
  name: "Fellowship of the Amulet",
  otherTags: [
    Tag.deserialize({
      id: "example-fellowshipothertag-1",
      name: "hidden campsites",
      isScratched: false,
      owner: "ben",
    }),
    Tag.deserialize({
      id: "example-fellowshipothertag-2",
      name: "hiding from foes",
      isScratched: false,
      owner: "ben",
    }),
  ],
  weaknessTags: [
    Tag.deserialize({
      id: "example-fellowshipweaknesstag-1",
      name: "growing mistrust",
      isScratched: false,
      owner: "ben",
    }),
  ],
  milestone: 1,
  abandon: 2,
  improve: 1,
  quest: "We must carry the Amulet into the Sea of Endings, and destroy it once and for all.",
  description: "",
  specialImprovements: [],
  owner: "ben",
  isScratched: false,
});

export const hero: Hero = Hero.deserialize({
  id: "example-hero-1",
  name: "Gorm Cowtipper",
  promise: 2,
  description: "",
  themes: [
    HeroTheme.deserialize({
      id: "example-herotheme-1",
      name: "Cursed",
      otherTags: [
        Tag.deserialize({
          id: "example-othertag-1",
          name: "discern sorcery",
          isScratched: false,
          owner: "ben",
        }),
        Tag.deserialize({
          id: "example-othertag-2",
          name: "protective charm",
          isScratched: false,
          owner: "ben",
        }),
      ],
      weaknessTags: [
        Tag.deserialize({
          id: "example-weaknesstag-1",
          name: "symbols mark my flesh",
          isScratched: false,
          owner: "ben",
        }),
      ],
      might: "origin",
      type: "past",
      milestone: 1,
      abandon: 2,
      improve: 1,
      quest: "I must find a way to free myself of this curse.",
      description: "",
      specialImprovements: [
        "Face From The Past: Once per session, when you meet a character from your Past for the first time in the game, you may describe how your last meeting went and give them an appropriate tier-2 status.",
        "Lessons Learned: Once per session, when you roll a total of 6 or less, you may explain how this situation is familiar to you from your Past, reroll the dice, and take the new result.",
      ],
      owner: "ben",
      isScratched: false,
    }),
    HeroTheme.deserialize({
      id: "example-herotheme-2",
      name: "Heart of Gold",
      otherTags: [
        Tag.deserialize({
          id: "example-othertag-3",
          name: "help those in need",
          isScratched: false,
          owner: "ben",
        }),
        Tag.deserialize({
          id: "example-othertag-4",
          name: "inspire others to help",
          isScratched: false,
          owner: "ben",
        }),
      ],
      weaknessTags: [
        Tag.deserialize({
          id: "example-weaknesstag-2",
          name: "easily exploited",
          isScratched: false,
          owner: "ben",
        }),
      ],
      might: "origin",
      type: "personality",
      milestone: 1,
      abandon: 2,
      improve: 1,
      quest: "There's hardship to go around - let's carry it together.",
      description: "",
      specialImprovements: [],
      owner: "ben",
      isScratched: false,
    }),
    HeroTheme.deserialize({
      id: "example-herotheme-3",
      name: "Strong as an Ox",
      otherTags: [
        Tag.deserialize({
          id: "example-othertag-5",
          name: "lift heavy loads",
          isScratched: false,
          owner: "ben",
        }),
        Tag.deserialize({
          id: "example-othertag-6",
          name: "holds and grapples",
          isScratched: false,
          owner: "ben",
        }),
      ],
      weaknessTags: [
        Tag.deserialize({
          id: "example-weaknesstag-3",
          name: "exhausting",
          isScratched: false,
          owner: "ben",
        }),
      ],
      might: "origin",
      type: "trait",
      milestone: 1,
      abandon: 2,
      improve: 1,
      quest: "The only way to get stronger is to keep testing my strength!",
      description: "",
      specialImprovements: ["Wild Blood: Your Trait manifests in unusualy ways. Choose and gain a Special Improvement form the Uncanny Being themebook."],
      owner: "ben",
      isScratched: false,
    }),
    HeroTheme.deserialize({
      id: "example-herotheme-4",
      name: "Irksome Pixie",
      otherTags: [
        Tag.deserialize({
          id: "example-othertag-7",
          name: "lend a hand",
          isScratched: false,
          owner: "ben",
        }),
        Tag.deserialize({
          id: "example-othertag-8",
          name: "tiny and elusive",
          isScratched: false,
          owner: "ben",
        }),
      ],
      weaknessTags: [
        Tag.deserialize({
          id: "example-weaknesstag-4",
          name: "hissy fit",
          isScratched: false,
          owner: "ben",
        }),
      ],
      might: "origin",
      type: "companion",
      milestone: 1,
      abandon: 2,
      improve: 1,
      quest: "This is going to be the biggest prank yet!",
      description: "",
      specialImprovements: [],
      owner: "ben",
      isScratched: false,
    }),
  ],
  backpack: [
    Tag.deserialize({
      id: "example-backpacktag-1",
      name: "large steel sword",
      isScratched: false,
      owner: "ben",
    }),
    Tag.deserialize({
      id: "example-backpacktag-2",
      name: "dice",
      isScratched: false,
      owner: "ben",
    }),
    Tag.deserialize({
      id: "example-backpacktag-3",
      name: "flint",
      isScratched: false,
      owner: "ben",
    }),
    Tag.deserialize({
      id: "example-backpacktag-4",
      name: "compass",
      isScratched: false,
      owner: "ben",
    }),
  ],
  relationships: [
    [
      "Geoff",
      Tag.deserialize({
        id: "example-relationshiptag-1",
        name: "best friends",
        isScratched: false,
        owner: "ben",
      }),
    ],
  ],
  fellowship: fellowship1,
  owner: "ben",
});
