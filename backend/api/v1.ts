import { readdir, readFile, rm, writeFile } from "fs/promises"
import { DESTINATION_SETTINGS } from "../../destination.settings.js"
import { Prog, ProgramInfo, Shortcut, Sm, SmFolder, SmShortcut } from "../../frontend/src/Types.js"
import { Dirent } from "fs"
import * as os from "os"
import { LunaContactsApi } from "./reusable/contacts.js"

const

	startMenuTree = async () => {
		const startMenuProgs = await readdir(`${__dirname}/../../data/StartMenu`, { withFileTypes: true })
		const progStartMenu = [] as Sm[]
		// console.log(startMenuProgs)
		for (const ps of startMenuProgs) {
			if (ps.isFile() && !ps.name.endsWith(".xp.json")) continue
			progStartMenu.push(await startMenuRecursive(ps))
		}
		return progStartMenu
	}
	,
	startMenuRecursive = async (possibleShortcut: Dirent): Promise<Sm> => {
		// console.log(possibleShortcut)
		if (possibleShortcut.isDirectory()) {
			const children = []
			const psChildren = await readdir(`${possibleShortcut.path}/${possibleShortcut.name}`, { withFileTypes: true })
			for (const ps of psChildren) {
				if (ps.isFile() && !ps.name.endsWith(".xp.json")) continue
				children.push(await startMenuRecursive(ps))
			}
			return {
				name: possibleShortcut.name,
				as: "folder",
				children
			} as SmFolder
		} else {
			const shortcut = JSON.parse(await readFile(`${possibleShortcut.path}/${possibleShortcut.name}`, "utf-8"))
			return {
				name: possibleShortcut.name,
				as: "shortcut",
				...shortcut
			} as SmShortcut

		}
	}

export const

	api = {
		apiHealthCheckConnect: async (props: {}) => {
			return { message: DESTINATION_SETTINGS.version } as const
		}
		,
		loadDesktopProgs: async (props: {}) => {
			const user = await LunaContactsApi.fetchContactToContactCompact({fileRelativePath: `My Identity/${(await readdir("../data/Contacts/My Identity")).find(x => x.endsWith(".vcf"))!}`})
			const bins = await readdir(`../data/Settings/Shortcuts`)
			const binList = [] as Prog[]
			for (const progName of bins) {
				if (progName.endsWith(".xp.json")) {
					const prog = await readFile(`../data/Settings/Shortcuts/${progName}`, "utf-8")
					binList.push(Object.assign(JSON.parse(prog), { progName: progName.replace(".xp.json", "") }))
				}
			}
			const progs = await readdir(`../data/Desktop`)
			const progList = [] as Prog[]
			const progPinList = [] as Prog[]
			for (const progName of progs) {
				if (progName.endsWith(".xp.json")) {
					const prog = await readFile(`../data/Desktop/${progName}`, "utf-8")
					progList.push(Object.assign(JSON.parse(prog), { progName }))
				} else if (progName.endsWith(".ti.json")) {
					const prog = await readFile(`../data/Desktop/${progName}`, "utf-8")
					progPinList.push(Object.assign(JSON.parse(prog), { progName }))

				}
			}
			const progImg = JSON.parse(await readFile(`../data/Desktop/Background.di.json`, "utf-8"))
			const progOpener = JSON.parse(await readFile(`../data/Desktop/Opener.di.json`, "utf-8")) as { extensions: Record<string, { prog: string, icon: string }> }

			const progStartMenu = await startMenuTree()

			const progRecents = JSON.parse(await readFile(`../data/Desktop/Recent.di.json`, "utf-8"))

			const sysMem = {freeMem: os.freemem(), totalMem: os.totalmem() }

			return { progList, progImg, binList, progPinList, progOpener, progStartMenu, progRecents, sysMem, user }
		}
		,
		deleteDesktopProg: async (props: { progName: string }) => {
			await rm(`../data/Desktop/${props.progName}`)
			return {}
		}
		,
		writeDesktopFile: async (props: { path: string, data: string }) => {
			await writeFile(props.path, props.data, "utf-8")
		}
		,
		programInfoGet: async (props: { program: string }) => {
			const programData = JSON.parse(await readFile(`../frontend/src/programs/v1/${props.program.replace("@", "").replace("/", ".")}/frontend/package.json`, "utf-8")) as ProgramInfo
			return programData
		}
	}