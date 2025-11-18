
export { IdSubdir, IdConnection, IdAction }

type IdSubdir = "<ID NAME OF APP>"
type IdConnection = "<ID RANDOM PER CONNECTION>"
type IdAction = "<ID NAME OF HANDLER OR ACTION>"
type PASS_IN_PROPS_HERE = {}

const

	WS_SECRET = Symbol.for("WS-META-PROPS")

export const
	// @ts-ignore
	useWs = (props: PASS_IN_PROPS_HERE) => props[WS_SECRET] as {
		clientId: IdConnection
		subDir: IdSubdir
		action: IdAction
	}
	,
	// @ts-ignore
	wsBindEndpoints = <T extends Record<string, (send: (p: any, id: any) => any) => any>>(props: T): { [K in keyof T]: () => any } => {
		function wsBound(this: { subDir: string, action: string }, props: any, id: any) {
			// @ts-ignore
			globalThis['SHARED-WEBSOCKET'].send(JSON.stringify({
				subDir: this.subDir,
				action: this.action,
				clientId: id,
				props,
			}))
		}
		// @ts-ignore
		const subDir = globalThis['TEMP-SUBDIR']
		for (const key in props) {
			const original = props[key]
			// @ts-ignore
			props[key] = () => original(wsBound.bind({ subDir, action: key }))
		}
		return props as any
	}