onEvent('recipes', e => {
  e.remove({id: 'structurize:sceptergold'})
  e.shaped('structurize:sceptergold', ['  G', ' S ', 'S  '], {
     G: '#forge:ingots/gold',
     S: '#forge:rods'
 })

 })