import * as alt from 'alt-client'
import * as natives from 'natives'
import * as shared from 'alt-shared'
import { events } from '../shared/events.js'

alt.on('consoleCommand', async (command: string, ...args: string[]) => {
    if (!command.startsWith('/')) return
    alt.log(`Command: ${command} ${args.join(' ')}`)

    const player = alt.Player.local

    switch (command) {
        case '/vehicle':
            alt.emitServer(events.toServer.spawnVehicle, args[0])
            break
        case '/heal':
            alt.emitServer(events.toServer.healPlayer)
            break
        case '/repair':
            if (!player.vehicle) return
            alt.emitServer(events.toServer.repairVehicle)
            break
        case '/respawn':
            alt.emitServer(events.toServer.respawn)
            break
    }
})