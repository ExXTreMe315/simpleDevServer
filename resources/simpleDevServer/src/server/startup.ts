import * as alt from 'alt-server'
import * as shared from 'alt-shared'

alt.on('playerConnect', (player: alt.Player) => {
    player.spawn(0, 0, 72, 0)
    player.model = 'mp_m_freemode_01'
})