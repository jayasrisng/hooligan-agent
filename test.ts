import { IMessageSDK } from '@photon-ai/imessage-kit'

const sdk = new IMessageSDK()

await sdk.send('+15016262766', 'hello test')

await sdk.close()