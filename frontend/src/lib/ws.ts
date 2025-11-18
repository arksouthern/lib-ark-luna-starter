import { getRoot } from "./url"

type IdSubdir = "<ID NAME OF APP>"
type IdConnection = "<ID RANDOM PER CONNECTION>"
type IdAction = "<ID NAME OF HANDLER OR ACTION>"
type HandlerMap = Map<IdSubdir, Map<IdConnection, Map<IdAction, Function>>>
type Msg = { subDir: IdSubdir, clientId: IdConnection, action: IdAction, props: any }

let

	ws = null as any as WebSocket
	,
	wsSendLater = [] as any[]
	,
	wsIsOpen = false

const

	handler = new Map as HandlerMap
	,
	WS_SECRET = Symbol.for("WS-META-PROPS")

export const

	connectWebSocket = () => {
		ws = new WebSocket(`${getRoot().replace("http", "ws")}/`)
		ws.addEventListener("message", function wsOnMessage(event) {
			const { subDir, clientId, action, props } = JSON.parse(event.data) as Msg
			props[WS_SECRET] = { subDir, clientId, action }
			handler.get(subDir)!.get(clientId)!.get(action)!(props)
		})
		ws.addEventListener("open", function wsOpen(event) {
			wsIsOpen = true
			console.log(wsSendLater)
			const wsSending = wsSendLater.splice(0)
			for (const send of wsSending) ws.send(JSON.stringify(send))
			console.log("WEBSOCKET OPEN")
		})
		ws.addEventListener("close", function wsClose(event) {
			wsIsOpen = false

			throw new Error("WEBSOCKET CLOSED")
		})
		console.log("WEBSOCKET CONSTRUCTED")
	}
	,
	// @ts-ignore
	createWs: <T extends { fromClient: Record<string, (p: any) => any>, fromServer: Record<string, (p: any, c: any) => any> }>(progId: string, handlers: { [K in keyof T['fromServer']]: (p: Parameters<Parameters<T['fromServer'][K]>[0]>[0]) => any }) => T['fromClient'] = (progId, handlers) => {
		const id = Math.random().toString(36).substring(2)
		progId = progId.replace("@", "").replace("/", ".")

		let subDir = handler.get(progId as IdSubdir)
		if (!subDir) {
			subDir = new Map
			handler.set(progId as IdSubdir, subDir)
		}
		subDir.set(id as IdConnection, new Map(Object.entries(handlers) as any))

		return new Proxy({}, {
			get: (_, p: string) => (props: any) => wsIsOpen ? ws.send(JSON.stringify({ subDir: progId, clientId: id, action: p, props })) : wsSendLater.push({ subDir: progId, clientId: id, action: p, props })
		})
	}