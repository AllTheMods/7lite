onEvent('recipes', e => {
  e.remove({id: 'structurize:sceptergold'})
  e.shaped('structurize:sceptergold', ['  G', ' S ', 'S  '], {
     G: '#forge:ingots/gold',
     S: '#forge:rods'
 })
  e.shaped('minecraft:chest', ['PPP', 'P P', 'PPP'], {
     P: '#minecraft:planks'
 })

 })