//priority: 997
onEvent('recipes', e => {
  let oreOverride = {
    iron: 'minecraft',
    gold: 'minecraft',
    copper: 'minecraft',
    cobalt: 'tconstruct'
  }

  let craftOverride = {
    cobalt: 'kubejs'
  }


  // unify ores for Create crushing wheel
  function createUnifyOres(metal, type) {
    let time = 250;
    let input = '';
    let outputs = [];

    if (type === 'ore') {
      time = 350;
      input = `#forge:ores/${metal}`;
      let out = `${oreOverride[metal] ?? 'alltheores'}:raw_${metal}`;

      outputs.push({
        item: out
      });
      outputs.push({
        item: out,
        chance: 0.33
      });
      outputs.push({
        item: "create:experience_nugget",
        chance: 0.75
      });

      e.remove({ id: `create:crushing/${metal}_ore` });
      e.remove({ id: `create:crushing/nether_${metal}_ore` });
      e.remove({ id: `create:crushing/deepslate_${metal}_ore` });
    }

    if (type === 'raw_block') {
      input = `#forge:storage_blocks/raw_${metal}`;
      outputs.push({
        item: `${craftOverride[metal] ?? 'alltheores'}:${metal}_dust`,
        count: 18,
      });
      outputs.push({
        item: "create:experience_nugget",
        chance: 0.75,
        count: 9,
      });

      e.remove({ id: `create:crushing/raw_${metal}_block` });
    }

    if (type === 'raw_ore') {
      input = `#forge:raw_ores/${metal}`;
      outputs.push({
        item: `${craftOverride[metal] ?? 'alltheores'}:${metal}_dust`,
        count: 2
      });

      e.remove({ id: `create:crushing/raw_${metal}` });
      e.remove({ id: `create:crushing/raw_${metal}_ore` });
    }

    if (type === 'ingot') {
      input = `#forge:ingots/${metal}`;
      outputs.push({
        item: `${craftOverride[metal] ?? 'alltheores'}:${metal}_dust`
      });
    }

    if (type === 'dust') {
      return;
    }

    e.custom({
      "type": "create:crushing",
      "ingredients": [
        Ingredient.of(input)
      ],
      "results": outputs,
      "processingTime": time
    }).id(`kubejs:crushing/${type}_${metal}`)
  }

  // unify plates for Create press
  function createPressing(metal) {
    let output = `${craftOverride[metal] ?? 'alltheores'}:${metal}_plate`

    e.remove({ id: `create:pressing/${metal}_ingot` });
    e.custom({
      "type": "create:pressing",
      "ingredients": [
        {
          "tag": `forge:ingots/${metal}`
        }
      ],
      "results": [
        {
          "item": output
        }
      ]
    }).id(`kubejs:pressing/${metal}_ingot`)
  }

  function ieUnifyOres(input, type) {
    let furnaceTime = 100;
    let furnaceEnergy = 51200;
    let furnaceSecondaries = [];
    let crusherEnergy = 3000;
    let crusherSecondaries = [];
    let inputIngredient = '';
    let crusherOutput = '';
    let furnaceOutput = ''
    let outputCount = 1;

    if (type === 'ore') {
      furnaceTime = 200;
      furnaceEnergy = 102400;
      crusherEnergy = 6000;
      inputIngredient = `#forge:ores/${input}`;
      crusherOutput = `${oreOverride[input] ?? 'alltheores'}:raw_${input}`;
      crusherSecondaries.push({
        chance: 0.33,
        output: Ingredient.of(crusherOutput)
      })
      furnaceOutput = crusherOutput;
      furnaceSecondaries.push({
        chance: 0.50,
        output: Ingredient.of(furnaceOutput)
      })
      e.remove({ id: `immersiveengineering:crafting/hammercrushing_${input}` });
      e.shapeless(crusherOutput, [inputIngredient, '#alltheores:ore_hammers'])
        .id(`kubejs:hammercrushing/${input}_ore`)
    }

    if (type === 'raw_block') {
      furnaceTime = 900;
      furnaceEnergy = 230400;
      crusherEnergy = 54000;
      inputIngredient = `#forge:storage_blocks/raw_${input}`;
      crusherOutput = `${craftOverride[input] ?? 'alltheores'}:${input}_dust`;
      furnaceOutput = `${oreOverride[input] ?? 'alltheores'}:${input}_ingot`;
      outputCount = 18;
    }

    if (type === 'raw_ore') {
      furnaceEnergy = 25600;
      crusherEnergy = 6000;
      inputIngredient = `#forge:raw_ores/${input}`;
      crusherOutput = `${craftOverride[input] ?? 'alltheores'}:${input}_dust`;
      furnaceOutput = `${oreOverride[input] ?? 'alltheores'}:${input}_ingot`;
      outputCount = 2;
    }

    if (type === 'ingot') {
      inputIngredient = `#forge:ingots/${input}`;
      crusherOutput = `${craftOverride[input] ?? 'alltheores'}:${input}_dust`;
    }

    if (type === 'dust') {
      inputIngredient = `#forge:dusts/${input}`;
      furnaceOutput = `${oreOverride[input] ?? 'alltheores'}:${input}_ingot`;
    }

    if (crusherOutput !== '') {
      e.remove({ id: `immersiveengineering:crusher/${type}_${input}` })
      e.custom({
        "type": "immersiveengineering:crusher",
        "secondaries": crusherSecondaries,
        "result": {
          "count": outputCount,
          "base_ingredient": Ingredient.of(crusherOutput)
        },
        "input": Ingredient.of(inputIngredient),
        "energy": crusherEnergy
      }).id(`kubejs:crusher/${type}_${input}`);
    }

    if (furnaceOutput !== '') {
      e.remove({ id: `immersiveengineering:arcfurnace/${type}_${input}` })
      e.custom({
        "type": "immersiveengineering:arc_furnace",
        "additives": [],
        "secondaries": furnaceSecondaries,
        "results": [{
          "count": outputCount,
          "base_ingredient": Ingredient.of(furnaceOutput)
        }],
        "input": Ingredient.of(inputIngredient),
        "time": furnaceTime,
        "energy": furnaceEnergy
      }).id(`kubejs:arcfurnace/${type}_${input}`);
    }
  }

  function ieUnifyPress(input, type) {
    let output = `${craftOverride[input] ?? 'alltheores'}:${input}_${type}`
    let inputCount = 1;

    if (type === 'gear') {
      inputCount = 4;
    }

    if (type === 'plate') {
      e.remove({ id: `immersiveengineering:crafting/plate_${input}_hammering` });
      e.shapeless(output, [`2x #forge:ingots/${input}`, '#misctags:immersive_engineering_hammer'])
        .id(`kubejs:crafting/plate_${input}_hammering`);
    }

    e.remove({ id: `immersiveengineering:metalpress/${type}_${input}` })
    e.custom({
      "type": "immersiveengineering:metal_press",
      "mold": `immersiveengineering:mold_${type}`,
      "result": Ingredient.of(output),
      "input": {
        "count": inputCount,
        "base_ingredient": {
          "tag": `forge:ingots/${input}`
        }
      },
      "energy": 2400
    }).id(`kubejs:metalpress/${type}_${input}`)
  }



  function blastingUnifyOres(ore) {
    //find all dust to ingot recipes, remove, and replace with a single one
    e.remove({ type: "minecraft:blasting", output: `${oreOverride[ore] ?? 'alltheores'}:${ore}_ingot`, id: `/_dust/` })
    e.blasting(`${oreOverride[ore] ?? 'alltheores'}:${ore}_ingot`, `#forge:dusts/${ore}`).xp(0.2).id(`kubejs:blasting/${ore}_ingot_from_dust`)
    e.remove({ type: "minecraft:smelting", output: `${oreOverride[ore] ?? 'alltheores'}:${ore}_ingot`, id: `/_dust/` })
    e.smelting(`${oreOverride[ore] ?? 'alltheores'}:${ore}_ingot`, `#forge:dusts/${ore}`).xp(0.2).id(`kubejs:smelting/${ore}_ingot_from_dust`)
    //find all ore to ingot recipes, remove, and replace with a single one
    e.remove({ type: "minecraft:blasting", output: `${oreOverride[ore] ?? 'alltheores'}:${ore}_ingot`, id: `/_ore/` })
    e.blasting(`${oreOverride[ore] ?? 'alltheores'}:${ore}_ingot`, `#forge:ores/${ore}`).xp(1.0).id(`kubejs:blasting/${ore}_ingot_from_ore`)
    e.remove({ type: "minecraft:smelting", output: `${oreOverride[ore] ?? 'alltheores'}:${ore}_ingot`, id: `/_ore/` })
    e.smelting(`${oreOverride[ore] ?? 'alltheores'}:${ore}_ingot`, `#forge:ores/${ore}`).xp(1.0).id(`kubejs:smelting/${ore}_ingot_from_ore`)
    // find all raw ore to ingot recipes, remove, and replace with a single one
    e.remove({ type: "minecraft:blasting", output: `${oreOverride[ore] ?? 'alltheores'}:${ore}_ingot`, id: `/raw/` })
    e.blasting(`${oreOverride[ore] ?? 'alltheores'}:${ore}_ingot`, `#forge:raw_materials/${ore}`).xp(0.7).id(`kubejs:blasting/${ore}_ingot_from_raw`)
    e.remove({ type: "minecraft:smelting", output: `${oreOverride[ore] ?? 'alltheores'}:${ore}_ingot`, id: `/raw/` })
    e.smelting(`${oreOverride[ore] ?? 'alltheores'}:${ore}_ingot`, `#forge:raw_materials/${ore}`).xp(0.7).id(`kubejs:smelting/${ore}_ingot_from_raw`)
  }

  atoMetals.concat(vanillaMetals).forEach(ore => {
    ['ore', 'raw_ore', 'raw_block', 'ingot', 'dust'].forEach(type => ieUnifyOres(ore, type));
    ['ore', 'raw_ore', 'raw_block', 'ingot'].forEach(type => createUnifyOres(ore, type));
    ['plate', 'gear', 'rod'].forEach(type => ieUnifyPress(ore, type));
    createPressing(ore);
    blastingUnifyOres(ore);

  });

  atoAlloys.forEach(alloy => {
    ['plate', 'gear', 'rod'].forEach(type => ieUnifyPress(alloy, type));
    createPressing(alloy);
  })



  immersiveMetals.forEach(metal => {
    e.remove({ id: `immersiveengineering:crafting/raw_${metal}_to_raw_block_${metal}` })
    e.remove({ id: `immersiveengineering:crafting/raw_block_${metal}_to_raw_${metal}` })
  });

  immersiveMetals.concat(immersiveAlloys).forEach(metal => {
    e.remove({ id: `immersiveengineering:crafting/ingot_${metal}_to_storage_${metal}` })
    e.remove({ id: `immersiveengineering:crafting/storage_${metal}_to_ingot_${metal}` })
    e.remove({ id: `immersiveengineering:crafting/ingot_${metal}_to_nugget_${metal}` })
    e.remove({ output: `immersiveengineering:ingot_${metal}` })
  });




  // temporary fix to allow using any steel dust
  e.smelting('alltheores:steel_ingot', '#forge:dusts/steel');
  e.remove({ id: 'alltheores:steel_ingot_from_dust' })
  e.blasting('alltheores:steel_ingot', '#forge:dusts/steel');
  e.remove({ id: 'alltheores:steel_ingot_from_dust_blasting' })

  // temporary for missing recipes
  e.shapeless('2x kubejs:cobalt_dust',['#forge:raw_ores/cobalt','#alltheores:ore_hammers'])
  e.shapeless('9x alltheores:brass_ingot', '#forge:storage_blocks/brass')

  removeRecipeByID(e, [
    'immersiveengineering:crusher/nether_gold',
    'immersiveengineering:crafting/nugget_steel_to_ingot_steel',
    'immersiveengineering:crafting/ingot_steel_to_storage_steel',
    'immersiveengineering:crafting/nugget_copper_to_copper_ingot',
    'immersiveengineering:crafting/copper_ingot_to_nugget_copper',
    'create:crafting/materials/copper_ingot',
    'create:crafting/materials/copper_nugget',
    'create:blasting/zinc_ingot_from_ore',
    'create:smelting/zinc_ingot_from_ore',
    'create:crafting/materials/raw_zinc',
    'create:crafting/materials/raw_zinc_block',
    'create:crafting/materials/zinc_block_from_compacting',
    'create:crafting/materials/zinc_ingot_from_compacting',
    'create:crafting/materials/zinc_ingot_from_decompacting',
    'create:crafting/materials/zinc_nugget_from_decompacting',
    'create:crafting/materials/brass_block_from_compacting',
    'create:crafting/materials/brass_ingot_from_compacting',
    'create:crafting/materials/brass_ingot_from_decompacting',
    'create:crafting/materials/brass_nugget_from_decompacting',
  ]);

  removeRecipeByOutput(e, [
    'immersiveengineering:stick_iron',
    'immersiveengineering:stick_steel',
    'immersiveengineering:stick_aluminum',
  ]);

  // honeycomb unify ores/alloys
  vanillaMetals.concat(atoMetals, atoAlloys).forEach(ore => {
    let comb = (ore === 'uranium') ? 'radioactive' : ore;
    e.remove({ id: `/honeycomb_${comb}/` });
    e.custom({
      "type": "productivebees:centrifuge",
      "ingredient": {
        "type": "forge:nbt",
        "item": "productivebees:configurable_honeycomb",
        "nbt": { "EntityTag": { "type": `productivebees:${comb}` } }
      },
      "outputs": [
        { item: { item: `${craftOverride[ore] ?? 'alltheores'}:${ore}_dust` }, chance: 40 },
        { item: { item: "productivebees:wax" } },
        { fluid: { fluid: "productivebees:honey" }, amount: 50 }
      ]
    }).id(`kubejs:centrifuge/honeycomb_${comb}`);
    e.custom({
      "type": "create:mixing",
      "ingredients": [{
        "type": "forge:nbt",
        "item": "productivebees:configurable_honeycomb",
        "nbt": { "EntityTag": { "type": `productivebees:${comb}` } }
      }],
      "results": [
        { item: `${oreOverride[ore] ?? 'alltheores'}:${ore}_ingot`, chance: 0.4 },
        { item: "productivebees:wax" },
        { fluid: "productivebees:honey", amount: 50 }
      ],
      "heatRequirement": "heated"
    }).id(`kubejs:mixing/honeycomb_${comb}`)
  });
  e.remove({ id: `/honeycomb_aluminium/` });
  e.remove({ id: `/honeycomb_brazen/` });
})
