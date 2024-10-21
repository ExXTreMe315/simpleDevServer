import * as alt from 'alt-server'
import * as shared from 'alt-shared'
import { events } from '../shared/events.js'

alt.on('playerConnect', (player: alt.Player) => {
    player.spawn(0, 0, 72, 0)
    player.model = 'mp_m_freemode_01'
})

alt.onClient(events.toServer.spawnVehicle, async (player: alt.Player, vehicleName: string) => {
    const vehicle = new alt.Vehicle(vehicleName, player.pos.x, player.pos.y, player.pos.z, player.rot.x, player.rot.y, player.rot.z)
    vehicle.numberPlateText = ''
    vehicle.dimension = player.dimension
    player.setIntoVehicle(vehicle, -1)
})

alt.onClient(events.toServer.healPlayer, async (player: alt.Player, target: alt.Player | undefined) => {
    if (!target) {
        target = player
    }
    target.health = 200
})

alt.onClient(events.toServer.repairVehicle, async (player: alt.Player) => {
    if (!player.vehicle) return
    player.vehicle.repair()
})

alt.onClient(events.toServer.respawn, async (player: alt.Player) => {
    player.health = 200
    player.spawn(0, 0, 72, 0)
})