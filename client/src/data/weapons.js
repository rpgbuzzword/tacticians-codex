const weapons = [
    {
      name: "Iron Sword",
      image: require("../assets/items/iron_sword.png"),
      durability: 46,
      might: 5,
      hit: 90,
      crit: "0",
      range: "1"
    },
    {
      name: "Steel Sword",
      image: require("../assets/items/steel_sword.png"),
      durability: 30,
      might: 8,
      hit: 75,
      crit: "0",
      range: "1"
    },
    {
      name: "Killing Edge",
      image: require("../assets/items/killing_edge.png"),
      durability: 20,
      might: 9,
      hit: 75,
      crit: "30",
      range: "1"
    },
    {
        name: "Silver Sword",
        image: require("../assets/items/silver_sword.png"),
        durability: 20,
        might: 13,
        hit: 80,
        crit: "0",
        range: "1"
      },
      {
        name: "Iron Axe",
        image: require("../assets/items/iron_axe.png"),
        durability: 45,
        might: 8,
        hit: 75,
        crit: "0",
        range: "1"
      },
      {
        name: "Steel Axe",
        image: require("../assets/items/steel_axe.png"),
        durability: 30,
        might: 11,
        hit: 65,
        crit: "0",
        range: "1"
      },
      {
        name: "Silver Axe",
        image: require("../assets/items/silver_axe.png"),
        durability: 20,
        might: 15,
        hit: 70,
        crit: "0",
        range: "1"
      },
      {
        name: "Killer Axe",
        image: require("../assets/items/killer_axe.png"),
        durability: 20,
        might: 11,
        hit: 65,
        crit: "30",
        range: "1"
      },
      {
        name: "Iron Lance",
        image: require("../assets/items/iron_lance.png"),
        durability: 45,
        might: 7,
        hit: 80,
        crit: "0",
        range: "1"
      },
      {
        name: "Steel Lance",
        image: require("../assets/items/steel_lance.png"),
        durability: 30,
        might: 10,
        hit: 70,
        crit: "0",
        range: "1"
      },
      {
        name: "Silver Lance",
        image: require("../assets/items/silver_lance.png"),
        durability: 20,
        might: 14,
        hit: 75,
        crit: "0",
        range: "1"
      },
      {
        name: "Killer Lance",
        image: require("../assets/items/killer_lance.png"),
        durability: 20,
        might: 10,
        hit: 70,
        crit: "30",
        range: "1"
      },
      {
        name: "Iron Bow",
        image: require("../assets/items/iron_bow.png"),
        durability: 45,
        might: 6,
        hit: 85,
        crit: "0",
        range: "2"
      },
      {
        name: "Steel Bow",
        image: require("../assets/items/steel_bow.png"),
        durability: 30,
        might: 9,
        hit: 70,
        crit: "0",
        range: "2"
      },
      {
        name: "Silver Bow",
        image: require("../assets/items/silver_bow.png"),
        durability: 20,
        might: 13,
        hit: 75,
        crit: "0",
        range: "2"
      },
      {
        name: "Killer Bow",
        image: require("../assets/items/killer_bow.png"),
        durability: 20,
        might: 9,
        hit: 75,
        crit: "30",
        range: "2"
      },
      {
        name: "Fire",
        image: require("../assets/items/fire.png"),
        durability: 40,
        might: 5,
        hit: 90,
        crit: "0",
        range: "1-2"
      },
      {
        name: "Elfire",
        image: require("../assets/items/elfire.png"),
        durability: 30,
        might: 10,
        hit: 85,
        crit: "0",
        range: "1-2"
      },
      {
        name: "Thunder",
        image: require("../assets/items/thunder.png"),
        durability: 35,
        might: 8,
        hit: 80,
        crit: 5,
        range: "1-2"
      },
      {
        name: "Excalibur",
        image: require("../assets/items/excalibur.png"),
        durability: 30,
        might: 18,
        hit: 90,
        crit: 10,
        range: "1-2"
      },
      {
        name: "Fimbulvetr",
        image: require("../assets/items/fimbulvetr.png"),
        durability: 20,
        might: 13,
        hit: 80,
        crit: "0",
        range: "1-2"
      },
      {
        name: "Bolting",
        image: require("../assets/items/bolting.png"),
        durability: 5,
        might: 12,
        hit: 60,
        crit: "0",
        range: "3-10"
      },
      {
        name: "Lightning",
        image: require("../assets/items/lightning.png"),
        durability: 35,
        might: 4,
        hit: 95,
        crit: 5,
        range: "1-2"
      },
      {
        name: "Shine",
        image: require("../assets/items/shine.png"),
        durability: 30,
        might: 6,
        hit: 90,
        crit: 8,
        range: "1-2"
      },
      {
        name: "Divine",
        image: require("../assets/items/divine.png"),
        durability: 25,
        might: 8,
        hit: 85,
        crit: 10,
        range: "1-2"
      },
      {
        name: "Aura",
        image: require("../assets/items/aura.png"),
        durability: 20,
        might: 12,
        hit: 85,
        crit: "15",
        range: "1-2"
      },
      {
        name: "Purge",
        image: require("../assets/items/purge.png"),
        durability: 5,
        might: 10,
        hit: 75,
        crit: 5,
        range: "3-10"
      },
      {
        name: "Ivaldi",
        image: require("../assets/items/ivaldi.png"),
        durability: 30,
        might: 17,
        hit: 90,
        crit: 5,
        range: "1-2"
      },
      {
        name: "Flux",
        image: require("../assets/items/flux.png"),
        durability: 45,
        might: 7,
        hit: 80,
        crit: "0",
        range: "1-2"
      },
      {
        name: "Luna",
        image: require("../assets/items/luna.png"),
        durability: 30,
        might: 0,
        hit: 50,
        crit: 10,
        range: "1-2"
      },
      {
        name: "Nosferatu",
        image: require("../assets/items/nosferatu.png"),
        durability: 20,
        might: 10,
        hit: 70,
        crit: "0",
        range: "1-2"
      },
      {
        name: "Eclipse",
        image: require("../assets/items/eclipse.png"),
        durability: 5,
        might: 0,
        hit: 30,
        crit: "0",
        range: "3-10"
      },
      {
        name: "Fenrir",
        image: require("../assets/items/fenrir.png"),
        durability: 20,
        might: 15,
        hit: 70,
        crit: "0",
        range: "1-2"
      },
      {
        name: "Gleipnir",
        image: require("../assets/items/gleipnir.png"),
        durability: 30,
        might: 23,
        hit: 80,
        crit: "0",
        range: "1-2"
      },
      {
        name: "Heal",
        image: require("../assets/items/heal.png"),
        durability: 30,
        might: "--",
        hit: null,
        crit: null,
        range: "1"
      },
      {
        name: "Mend",
        image: require("../assets/items/mend.png"),
        durability: 20,
        might: null,
        hit: null,
        crit: null,
        range: "1"
      },
      {
        name: "Physic",
        image: require("../assets/items/physic.png"),
        durability: 15,
        might: null,
        hit: null,
        crit: null,
        range: "1-Mag/2"
      },
      {
        name: "Recover",
        image: require("../assets/items/recover.png"),
        durability: 15,
        might: null,
        hit: null,
        crit: null,
        range: "1"
      }
  ];
  
  export default weapons;