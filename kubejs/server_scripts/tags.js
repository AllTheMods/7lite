//priority: 1000


onEvent('tags.items', e => {
  e.add('misctags:immersive_engineering_hammer', 'immersiveengineering:hammer')
  e.add('misctags:immersive_engineering_wirecutter', 'immersiveengineering:wirecutter')

  e.add('forge:raw_ores/cobalt', 'tconstruct:raw_cobalt');
  e.add('forge:dusts/cobalt', 'kubejs:cobalt_dust');

  e.add('forge:melons','minecraft:melon_slice')

  // fix raw block crafting for other mods
  e.add('forge:raw_ores/zinc', 'create:raw_zinc')
  immersiveMetals.forEach(metal => e.add(`forge:raw_ores/${metal}`, `immersiveengineering:raw_${metal}`))
  e.add('forge:rods/metal', atoMetals.concat(vanillaMetals, atoAlloys).map(metal => `alltheores:${metal}_rod`));
  e.add('forge:rods/all_metal', '#forge:rods/metal');

  e.remove('forge:storage_blocks/copper', 'minecraft:cut_copper')
})
onEvent('tags.blocks', e => {
  e.add('minecraft:climbable', ['minecraft:chain', /additionallanterns:.*_chain/])
})
onEvent('tags.entity_types', e => {
})
