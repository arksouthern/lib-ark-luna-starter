import websocket from '@fastify/websocket'
import { FastifyInstance } from 'fastify'

type IdSubdir = "<ID NAME OF APP>"
type IdAction = "<ID NAME OF HANDLER OR ACTION>"
const handler = new Map as Map<IdSubdir, Map<IdAction, Function>>
const WS_SECRET = Symbol.for("WS-META-PROPS")

export default async function fastifyWebsocketConnector(props: {server: FastifyInstance}) {

    await props.server.register(websocket)

    props.server.get('/', { websocket: true }, (socket, req) => {
        // @ts-ignore
        globalThis['SHARED-WEBSOCKET'] = socket

        socket.on("message", (message) => {
            try {
                let {subDir, action, clientId, props} = JSON.parse(message.toString())
                subDir = subDir.replace("@", "").replace("/", ".")
                props[WS_SECRET] = {subDir, action, clientId}
                handler.get(subDir)!.get(action)!(props)
            } catch (error) {
                console.log(message.toString())
                console.log(error)
                throw error
            }
        })

        socket.on("close", () => {
            console.log('Client disconnected');
        })
    })

    return function addHandler(subDir: string, handlerObj: {}) {
        handler.set(subDir as any, new Map(Object.entries(handlerObj)) as any)
    }
}