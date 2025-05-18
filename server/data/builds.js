// data/builds.js

const builds = [
    {
      id: "1",
      title: "First Army Plan",
      army: [
        {
          name: "Eirika",
          base_class: "Lord",
          promoted_class: "Great Lord",
          target_stats: { hp: 40, str: 18, skl: 22, spd: 25, def: 12, res: 20, lck: 15 },
          notes: "Dodge tank"
        },
        {
          name: "Seth",
          base_class: "Paladin",
          promoted_class: null,
          target_stats: { hp: 45, str: 20, skl: 25, spd: 22, def: 18, res: 15, lck: 12 },
          notes: "Main tank"
        },
        // ... Add remaining characters as needed for test
      ],
      notes: "Focus on mobility units",
      is_public: true
    }
  ];
  
  module.exports = builds;
  