onEvent('worldgen.remove', e => {
  e.removeOres(ore => {
    ore.blocks = [
      'occultism:silver_ore',
      'occultism:deepslate_silver_ore'

    ]
  })
})

