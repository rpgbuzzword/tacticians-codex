import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import classTree from "../data/classTree";
import { portraitMap } from "../data/imageMap";
import statCaps from "../data/statCaps";
import "../styles/BuildForm.css";
import weapons from "../data/weapons";

// Default army template
const armyTemplate = [
  { name: "Eirika", base_class: "Lord" },
  { name: "Seth", base_class: "Paladin" },
  { name: "Franz", base_class: "Cavalier" },
  { name: "Gilliam", base_class: "Knight" },
  { name: "Vanessa", base_class: "Pegasus Knight" },
  { name: "Moulder", base_class: "Priest" },
  { name: "Ross", base_class: "Journeyman" },
  { name: "Garcia", base_class: "Fighter" },
  { name: "Neimi", base_class: "Archer" },
  { name: "Colm", base_class: "Thief" },
  { name: "Artur", base_class: "Monk" },
  { name: "Lute", base_class: "Mage" },
  { name: "Natasha", base_class: "Cleric" },
  { name: "Joshua", base_class: "Myrmidon" },
  { name: "Ephraim", base_class: "Lord" },
  { name: "Forde", base_class: "Cavalier" },
  { name: "Kyle", base_class: "Cavalier" },
  { name: "Tana", base_class: "Pegasus Knight" },
  { name: "Amelia", base_class: "Recruit" },
  { name: "Innes", base_class: "Sniper" },
  { name: "Gerik", base_class: "Mercenary" },
  { name: "Tethys", base_class: "Dancer" },
  { name: "Marisa", base_class: "Myrmidon" },
  { name: "L'Arachel", base_class: "Troubadour" },
  { name: "Dozla", base_class: "Berserker" },
  { name: "Saleh", base_class: "Sage" },
  { name: "Ewan", base_class: "Pupil" },
  { name: "Cormag", base_class: "Wyvern Rider" },
  { name: "Rennac", base_class: "Rogue" },
  { name: "Duessel", base_class: "Great Knight" },
  { name: "Knoll", base_class: "Shaman" },
  { name: "Myrrh", base_class: "Manakete" },
  { name: "Syrene", base_class: "Falcon Knight" }
];

const magicClasses = ["Pupil", "Mage", "Sage", "Cleric", "Priest", "Bishop", "Shaman", "Druid", "Monk", "Troubadour", "Valkyrie", "Mage Knight", "Summoner"];


export default function BuildForm() {
  const navigate = useNavigate();
  const location = useLocation();
  const editingBuild = location.state?.isEditing ? {
    id: location.state.buildId,
    ...location.state.buildData
  } : null;
  console.log("BuildForm - editingBuild:", editingBuild);
  console.log("LOCATION STATE:", location.state);


  const [title, setTitle] = useState(editingBuild?.title || "");
  const [notes, setNotes] = useState(editingBuild?.notes || "");
  const [army, setArmy] = useState(() => {
    if (editingBuild?.army) {
      return editingBuild.army.map((char) => {
        const processedInventory = (char.inventory || ["", "", "", "", ""]).map(item => {
          const itemName = typeof item === "string" ? item : item?.name || "";
          const matched = weapons.find(w => w.name === itemName);
          return matched
            ? { ...matched, search: matched.name }
            : { name: itemName, search: itemName, image: "", durability: "", might: "", hit: "", crit: "", range: "" };
        });

        // Find the index of the first weapon that has an image
        const firstValidSlot = processedInventory.findIndex(item => item.image);

        return {
          ...char,
          inventory: processedInventory,
          selectedInventorySlot: firstValidSlot !== -1 ? firstValidSlot : null,
          stats: {
            strmag: parseInt(char.stats?.strmag ?? 0),
            skill: parseInt(char.stats?.skill ?? 0),
            speed: parseInt(char.stats?.speed ?? 0),
            luck: parseInt(char.stats?.luck ?? 0),
            defense: parseInt(char.stats?.defense ?? 0),
            resistance: parseInt(char.stats?.resistance ?? 0),
            move: parseInt(char.stats?.move ?? 0),
            constitution: parseInt(char.stats?.constitution ?? 0)
          },
          activePanelIndex: 0,
        };
      });
    } else {
      return armyTemplate.map(char => ({
        ...char,
        promoted_class: "",
        notes: "",
        inventory: ["", "", "", "", ""],
        weapon_mastery: "",
        supports: "",
        stats: {
          strmag: 0, skill: 0, speed: 0, luck: 0,
          defense: 0, resistance: 0, move: 0, constitution: 0
        },
        selectedInventorySlot: null,
        activePanelIndex: 0,
      }));
    }
  });




  const [selectedCharacterIndex, setSelectedCharacterIndex] = useState(0);
  const [selectedInventorySlot, setSelectedInventorySlot] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const selectedChar = army[selectedCharacterIndex];
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  ctx.font = '24px FireEmblemFont';
  ctx.fillStyle = 'white';
  ctx.fillText('Hello', 10, 50);


  const panelImages = [
    require("../assets/ui/panel_stats.png"),
    require("../assets/ui/panel_inventory.png"),
    require("../assets/ui/panel_supports.png")
  ];

  const panelHeaders = [
    require("../assets/ui/stats_header.png"),
    require("../assets/ui/inventory_header.png"),
    require("../assets/ui/supports_header.png")
  ];

  const handleArmyChange = (field, value) => {
    const updatedArmy = [...army];
    updatedArmy[selectedCharacterIndex][field] = value;
    setArmy(updatedArmy);
  };

  const handlePanelChange = (direction) => {
    const updatedArmy = [...army];
    const currentPanel = updatedArmy[selectedCharacterIndex].activePanelIndex; // Fix this line
    updatedArmy[selectedCharacterIndex].activePanelIndex = (currentPanel + direction + 3) % 3;
    setArmy(updatedArmy);
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title) {
      setError("Title is required.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const newBuild = { title, army, notes, is_public: true };
      if (editingBuild) {
        console.log("Editing build ID:", editingBuild.id);
        console.log("Build payload:", newBuild);
        await axios.put(`http://localhost:5000/api/builds/${editingBuild.id}`, newBuild);
      } else {
        await axios.post("http://localhost:5000/api/builds", newBuild);
      }
      navigate("/builds");
    } catch (err) {
      console.error("Error creating build:", err);
      setError("Failed to create build.");
    } finally {
      setLoading(false);
    }
  };

  let unitArtPath;
  try {
    unitArtPath = selectedChar.promoted_class
      ? require(`../assets/units/${selectedChar.name.replace(/[^a-zA-Z0-9]/g, "").replace(/ /g, "_")}_${selectedChar.promoted_class.replace(/ /g, "_")}.png`)
      : require(`../assets/units/${selectedChar.name.replace(/[^a-zA-Z0-9]/g, "").replace(/ /g, "_")}_${selectedChar.base_class.replace(/ /g, "_")}.png`);
  } catch (err) {
    unitArtPath = require("../assets/units/placeholder.png");
  }

  return (
    <div className="build-form-bg min-h-screen p-8">
      <div className="max-w-6xl mx-auto bg-white p-6 rounded shadow">
        <h2 className="text-4xl font-normal mb-4">Create Your Army Plan</h2>

        <form
          onSubmit={handleSubmit}
          onKeyDown={(e) => {
            if (e.key === "Enter" && e.target.type !== "textarea") {
              e.preventDefault();
            }
          }}
          className="space-y-6"
        >
          {/* Plan Title */}
          <div>
            <label className="text-2xl block font-normal">Plan Title</label>
            <input
              type="text"
              className="w-full border rounded px-3 py-2"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>
          <div className="grid grid-cols-6 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10 xl:grid-cols-12 gap-2">
            {army.map((char, index) => (
              <div
                key={char.name}
                className="relative w-[64px] h-[64px] cursor-pointer"
                onClick={() => setSelectedCharacterIndex(index)}
              >
                {/* Background image */}
                <img
                  src={require('../assets/ui/Portrait.png')}
                  alt="portrait background"
                  className="absolute top-0 left-0 w-full h-full object-contain"
                />
                {/* Portrait image */}
                <img
                  src={portraitMap[char.name]}
                  alt={char.name}
                  className={`absolute top-1 left-3 w-[70%] h-[70%] object-contain rounded ${index === selectedCharacterIndex ? 'ring-4 ring-blue-500' : ''}`}
                />
              </div>
            ))}
          </div>

          {/* Grid + Panel */}
          <div className="flex flex-col md:flex-row gap-6" style={{ backgroundImage: `url(${require('../assets/ui/background.png')})`, backgroundSize: 'cover', height: '100%', backgroundRepeat: 'no-repeat' }}>
            <div className="flex flex-col gap-4 min-w-[140px]">
              {/* === Portrait with Background and Overlay === */}
              <div className="relative w-[256px] h-[256px] flex justify-center">
                {/* Background image */}
                <img
                  src={require('../assets/ui/Portrait.png')}
                  alt="portrait background"
                  className="absolute w-full h-full object-contain"
                />

                {/* Blue overlay */}
                <div className="absolute left-[13%] top-[7%] w-[75%] h-[68%] bg-blue-500 opacity-50"></div>
                {/* Character Name BELOW portrait */}
                <div className="absolute w-[60%] left-[30%] bottom-[6%] text-4xl font-normal text-center">{selectedChar.name}</div>

                {/* Portrait image */}
                <img
                  src={portraitMap[selectedChar.name]}
                  alt={`${selectedChar.name} portrait`}
                  className="absolute bottom-[19%] w-[75%] h-[75%] object-contain rounded"
                />
              </div>

              {/* === Unit Art + Class Info Grid === */}
              <div className="grid grid-cols-2 gap-2 justify-between items-center bg-black/40 rounded">
                {/* Left Column: Class Dropdown + Misc Info */}
                <div className="flex flex-col w-[200px] gap-2">
                  {/* Promoted Class Dropdown */}
                  <div className="relative text-center">
                    {classTree[selectedChar.base_class]?.[0] !== null ? (
                      <select
                        className="border rounded py-1 text-4xl tmt-1"
                        value={selectedChar.promoted_class}
                        onChange={(e) => handleArmyChange("promoted_class", e.target.value)}
                      >
                        <option value="">{selectedChar.base_class}</option>
                        {classTree[selectedChar.base_class].map(option => (
                          <option key={option} value={option}>{option}</option>
                        ))}
                      </select>
                    ) : (
                      <p className="font-normal text-4xl mt-1">{selectedChar.base_class}</p>
                    )}
                  </div>

                  {/* Middle Row: Text field "20" + Placeholder for Image */}
                  <div className="flex ml-2 bg-contain bg-no-repeat" style={{ backgroundImage: `url(${require('../assets/ui/LVLEXP.png')})` }}>
                    <input
                      type="text"
                      readOnly
                      value="20"
                      className="relative left-[30%] w-[50px] text-5xl text-center bg-transparent"
                    />
                    {/* Placeholder image next to it */}
                    <div className="relative left-[50%] mt-4 w-6 h-6 bg-gray-200 rounded ml-2"></div>
                  </div>

                  {/* Bottom Row: HP Fraction */}
                  <div className="flex ml-2 bg-contain bg-no-repeat" style={{ backgroundImage: `url(${require('../assets/ui/HP.png')})` }}>
                    <div className="relative mt-2 left-[50%] scale-[3] rounded px-2 py-1 inline-block">
                      {/* This will be dynamic in the future */}
                      30/30
                    </div>
                  </div>
                </div>

                {/* Right Column: Unit Art */}
                <div className="relative flex items-end justify-center w-[200px] h-[172px]  item-contain">
                  <img
                    src={unitArtPath}
                    alt={`${selectedChar.name} unit art`}
                    className="object-contain scale-[2]"
                    style={{ transformOrigin: 'bottom center' }}
                  />
                </div>
              </div>
            </div>


            <div
              className="p-4 rounded relative"
              style={{ width: '480px' }} // Fixed width
            >
              {/* Navigation Header */}
              <div className="flex justify-between items-center mb-4">
                <button type="button" onClick={() => handlePanelChange(-1)}>
                  <img src={require("../assets/ui/left_arrow.png")} alt="Previous" className="h-6 w-6 object-contain" />
                </button>
                <img
                  src={panelHeaders[selectedChar.activePanelIndex]}
                  alt={`Panel ${selectedChar.activePanelIndex}`}
                  className="h-6 object-contain"
                />
                <button type="button" onClick={() => handlePanelChange(1)}>
                  <img src={require("../assets/ui/right_arrow.png")} alt="Next" className="h-6 w-6 object-contain" />
                </button>
              </div>

              {/* Panel content here - height adjusts naturally */}
              {selectedChar.activePanelIndex === 0 && (
                <div
                  className="relative bg-no-repeat bg-contain bg-top"
                  style={{
                    backgroundImage: `url(${require('../assets/ui/panel_stats.png')})`,
                    width: '100%'
                  }}
                >
                  {/* Strength or Magic Label */}
                  <img
                    src={
                      magicClasses.includes(selectedChar.promoted_class || selectedChar.base_class)
                        ? require('../assets/ui/mag_label.png')
                        : require('../assets/ui/str_label.png')
                    }
                    alt="Str/Mag Label"
                    className="relative left-[13%] top-[30px] scale-[2.75]" // Adjust position and size
                  />

                  {/* Two Column Layout */}
                  <div className="relative flex gap-6 bottom-2">
                    {/* Left Column: 6 Stats */}
                    <div className="flex flex-col gap-7 w-[50%]">
                      {["strmag", "skill", "speed", "luck", "defense", "resistance"].map((statKey, id) => {
                        const className = selectedChar.promoted_class || selectedChar.base_class;
                        const max = statCaps[className]?.[statKey] || 30;
                        const value = selectedChar.stats[statKey];
                        const fillPercent = Math.min(100, (value / max) * 100);

                        return (
                          <div
                            key={statKey}
                            className="relative h-1/6 flex items-center"
                            style={{ padding: "0 10% 0 50%" }}
                          >
                            <div className="relative h-6 bg-gray-300 rounded-lg overflow-hidden w-[100%]">
                              {/* Bar Fill */}
                              <div className="bg-blue-600 h-full" style={{ width: `${fillPercent}%` }}></div>

                              {/* Centered Value */}
                              <input
                                type="number"
                                min="0"
                                max={max}
                                className="absolute inset-0 text-center bg-transparent focus:outline-none"
                                value={value}
                                onChange={(e) => {
                                  const updatedStats = { ...selectedChar.stats, [statKey]: parseInt(e.target.value) || 0 };
                                  handleArmyChange("stats", updatedStats);
                                }}
                              />
                            </div>
                          </div>

                        );
                      })}
                    </div>

                    {/* Right Column: 2 Stats */}
                    <div className="flex flex-col gap-7 w-[50%]">
                      {["move", "constitution"].map((statKey, idx) => {
                        const className = selectedChar.promoted_class || selectedChar.base_class;
                        const max = statCaps[className]?.[statKey] || 30;
                        const value = selectedChar.stats[statKey];
                        const fillPercent = Math.min(100, (value / max) * 100);

                        return (
                          <div
                            key={statKey}
                            className="relative h-1/6 flex items-center"
                            style={{ padding: "0 10% 0 50%" }}
                          >
                            <div className="relative h-6 bg-gray-300 rounded-lg overflow-hidden w-[100%]">
                              {/* Bar Fill */}
                              <div className="bg-blue-600 h-full" style={{ width: `${fillPercent}%` }}></div>

                              {/* Centered Value */}
                              <input
                                type="number"
                                min="0"
                                max={max}
                                className="absolute inset-0 text-center bg-transparent focus:outline-none"
                                value={value}
                                onChange={(e) => {
                                  const updatedStats = { ...selectedChar.stats, [statKey]: parseInt(e.target.value) || 0 };
                                  handleArmyChange("stats", updatedStats);
                                }}
                              />
                            </div>
                          </div>

                        );
                      })}
                    </div>
                  </div>
                </div>
              )}
              {/* Inventory Screen */}
              {selectedChar.activePanelIndex === 1 && (
                <div
                  className="relative bg-no-repeat bg-contain bg-top"
                  style={{
                    backgroundImage: `url(${require('../assets/ui/panel_inventory.png')})`,
                    height: '480px', // Inventory panel height
                    width: '100%'
                  }}
                >
                  <div className="grid grid-cols-1 gap-[3%] h-[100%]" style={{ padding: "0% 10% 10% 10%" }}>
                    <div className="pt-[7%] pl-[5%]">
                      {selectedChar.inventory.map((item, i) => {
                        const searchTerm = typeof item?.search === 'string' ? item.search : item?.name || "";
                        const isCompleteWeapon = weapons.some(w => w.name === searchTerm);
                        const matchedWeapons = searchTerm && !isCompleteWeapon
                          ? weapons.filter(w => w.name.toLowerCase().includes(searchTerm.toLowerCase()))
                          : [];


                        return (
                          <div key={i} className="flex items-center gap-2 relative" style={{ padding: "0 5% 0% 0" }}>
                            {/* === Item Image Placeholder === */}
                            <div
                              className={`w-12 h-12 flex items-center justify-center cursor-pointer rounded ${selectedInventorySlot === i ? 'ring-2 ring-blue-500' : ''}`}
                              onClick={() => item?.image && setSelectedInventorySlot(i)}
                            >
                              {item?.image && (
                                <img src={item.image} alt={item.name} className="w-12 h-12 object-contain" />
                              )}
                            </div>

                            {/* === Weapon Search Input === */}
                            <input
                              type="text"
                              placeholder={`Search Weapon ${i + 1}`}
                              className="border rounded px-2 py-1 w-1/2 font-normal"
                              value={searchTerm}
                              onChange={(e) => {
                                const updatedInventory = [...selectedChar.inventory];
                                updatedInventory[i] = {
                                  ...item,
                                  search: e.target.value,
                                  name: e.target.value
                                };
                                handleArmyChange("inventory", updatedInventory);
                              }}
                            />

                            {/* === DUR Display (Read-Only Fraction) === */}
                            <input
                              type="text"
                              className="border rounded px-2 py-1 w-[70px] text-center bg-gray-100"
                              readOnly
                              value={item?.durability ? `${item.durability}/${item.durability}` : ""}
                            />

                            {/* === Clear Button === */}
                            {item?.image && (
                              <button
                                type="button"
                                onClick={() => {
                                  const updatedInventory = [...selectedChar.inventory];
                                  updatedInventory[i] = { name: "", search: "", durability: "", might: "", hit: "", crit: "", range: "", image: "" };
                                  handleArmyChange("inventory", updatedInventory);
                                  if (selectedInventorySlot === i) setSelectedInventorySlot(null);
                                }}
                                className="text-red-600 hover:text-red-800 font-bold text-xl"
                              >
                                ✖
                              </button>
                            )}

                            {/* === Search Results === */}
                            {searchTerm && !item?.image && matchedWeapons.length > 0 && (
                              <div className="absolute top-full left-0 bg-white border rounded shadow-md w-1/2 z-10">
                                {matchedWeapons.map((w, idx) => (
                                  <div
                                    key={idx}
                                    className="flex items-center gap-2 p-1 hover:bg-gray-100 cursor-pointer"
                                    onClick={() => {
                                      const updatedInventory = [...selectedChar.inventory];
                                      updatedInventory[i] = { ...w, search: w.name };
                                      handleArmyChange("inventory", updatedInventory);
                                      setSelectedInventorySlot(i); // Auto-select after picking
                                    }}
                                  >
                                    <img src={w.image} alt={w.name} className="w-6 h-6 object-contain" />
                                    <span>{w.name}</span>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>



                    {/* === Bottom Stats Section === */}
                    {selectedInventorySlot !== null && selectedChar.inventory[selectedInventorySlot]?.image && (
                      <div className="grid grid-rows-3 gap-3 align-bottom" style={{ padding: "10px 0px 15px 60px" }}>
                        {/*First Row*/}
                        <div className="grid grid-cols-2">
                          {/*Upper Left Corner, Blank*/}
                          <div>
                          </div>
                          {/*Range*/}
                          <div style={{ padding: "0 20% 0 40%" }}>
                            <input
                              type="text"
                              className="rounded text-4xl w-full justify-items-center bg-transparent"
                              readOnly
                              value={selectedChar.inventory[selectedInventorySlot].range || ""}
                            />
                          </div>
                        </div>

                        {/*Second Row*/}
                        <div className="grid grid-cols-2">
                          {/*Might*/}
                          <div style={{ padding: "0% 40% 0% 20%" }}>
                            <input
                              type="text"
                              className="rounded text-4xl w-full justify-items-center bg-transparent"
                              readOnly
                              value={selectedChar.inventory[selectedInventorySlot].might || ""}
                            />
                          </div>
                          {/*Crit*/}
                          <div style={{ padding: "0 20% 0 40%" }}>
                            <input
                              type="text"
                              className="rounded text-4xl w-full justify-items-center bg-transparent"
                              readOnly
                              value={selectedChar.inventory[selectedInventorySlot].crit || ""}
                            />
                          </div>
                        </div>

                        {/*Third Row*/}
                        <div className="grid grid-cols-2">
                          {/*Hit*/}
                          <div style={{ padding: "0 40% 0 20%" }}>
                            <input
                              type="text"
                              className="rounded text-4xl w-full justify-items-center bg-transparent"
                              readOnly
                              value={selectedChar.inventory[selectedInventorySlot].hit || ""}
                            />
                          </div>
                          {/*Avoid (for future use)*/}
                          <div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {selectedChar.activePanelIndex === 2 && (
                <div
                  className="relative bg-no-repeat bg-contain bg-top"
                  style={{
                    backgroundImage: `url(${require('../assets/ui/panel_supports.png')})`,
                    height: '400px', // Adjust based on your supports panel height
                    width: '100%'
                  }}
                >
                  <input
                    type="text"
                    placeholder="e.g., Sword: A, Axe: C"
                    className="w-full border rounded px-2 py-1 mb-2"
                    value={selectedChar.weapon_mastery}
                    onChange={(e) => handleArmyChange("weapon_mastery", e.target.value)}
                  />

                  <label className="block font-semibold mb-1">Supports</label>
                  <input
                    type="text"
                    placeholder="e.g., Supports: Eirika (B), Seth (A)"
                    className="w-full border rounded px-2 py-1"
                    value={selectedChar.supports}
                    onChange={(e) => handleArmyChange("supports", e.target.value)}
                  />
                </div>
              )}
            </div>
          </div>



          {/* Overall Notes */}
          <div>
            <label className="block font-semibold">Overall Notes</label>
            <textarea
              className="w-full border rounded px-3 py-2"
              rows="3"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </div>

          {/* Submit */}
          {error && <p className="text-red-600">{error}</p>}
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            disabled={loading}
          >
            {loading ? "Saving..." : editingBuild ? "Save Updated Army Plan" : "Save Army Plan"}
          </button>
        </form>
      </div>
    </div>
  );
}
