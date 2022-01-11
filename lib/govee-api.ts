/**
 * Light wrapper around Govee API
 * https://govee-public.s3.amazonaws.com/developer-docs/GoveeAPIReference.pdf
 */
import Axios from 'axios'
import { DeviceId } from './devices'

const API_KEY = process.env.GOVEE_API_KEY

if (!API_KEY) {
  throw new Error('No Govee API Key')
}

const axios = Axios.create({
  baseURL: 'https://developer-api.govee.com/v1',
  responseType: 'json',
  headers: {
    'Govee-API-Key': API_KEY,
  },
})

export type Device = {
  device: string
  model: string
  deviceName: string
  controllable: boolean
  retrievable: boolean
  supportCmds: string[]
  properties: object
}

type ListDevicesResponse = {
  data: { devices: Device[] }
  message: string
  code: number
}

export async function listDevices(): Promise<Device[]> {
  try {
    const response = await axios.get('/devices')
    const data = response.data as ListDevicesResponse

    if (data.code !== 200) {
      throw new Error(`List devices error CODE: ${data.code} - ${data.message}`)
    }

    return data.data.devices
  } catch (err) {
    throw err
  }
}

type RunCmdResponse = { code: number; message: string; data: {} }

export async function runCmd(
  device: DeviceId,
  cmd: { name: any; value: any }
): Promise<RunCmdResponse['data']> {
  try {
    const response = await axios.put('/devices/control', {
      device: device.deviceMAC,
      model: device.deviceModel,
      cmd: cmd,
    })

    const data = response.data as RunCmdResponse

    return data.data
  } catch (err) {
    throw err
  }
}

type DeviceProperties = [
  { online: boolean },
  { powerState: 'on' | 'off' },
  { brightness: number },
  {
    color?: {
      r: number
      b: number
      g: number
    }
    colorTempInKelvin?: 2000
  }
]

type GetDeviceStateResponse = {
  data: { device: string; model: string; properties: DeviceProperties }
  message: string
  code: number
}

export async function getDeviceState(
  device: DeviceId
): Promise<DeviceProperties> {
  try {
    const response = await axios.get('/devices/state', {
      params: {
        device: device.deviceMAC,
        model: device.deviceModel,
      },
    })

    const data = response.data as GetDeviceStateResponse

    return data.data.properties
  } catch (err) {
    throw err
  }
}
