import devices from './lib/devices'
import { getDeviceState, runCmd } from './lib/govee-api'

let loop: NodeJS.Timer

async function main() {
  const bedroomState = await getDeviceState(devices.BEDROOM)
  console.dir(bedroomState, { depth: 5 })

  await runCmd(devices.BEDROOM, {
    name: 'brightness',
    value: 1,
  })

  await runCmd(devices.BEDROOM, {
    name: 'turn',
    value: 'on',
  })

  let brightness = 1
  loop = setInterval(async () => {
    if (brightness > 100) brightness = 1
    console.log('Brightness: ', brightness)
    await runCmd(devices.BEDROOM, {
      name: 'brightness',
      value: brightness,
    })
    console.log('--> sent')
    brightness += 5
  }, 1000)

  return
}

process.on('SIGINT', async function () {
  console.log('Shutting off lights...')

  clearInterval(loop)

  await runCmd(devices.BEDROOM, {
    name: 'turn',
    value: 'off',
  })

  process.exit()
})

main()
