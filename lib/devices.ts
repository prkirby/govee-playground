import devices from '../device-dict'

export type DeviceId = {
  deviceMAC: string
  deviceModel: string
}

type DeviceDict = {
  [deviceName: string]: DeviceId
}

export default devices as DeviceDict
