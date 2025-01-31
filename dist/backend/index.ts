import { readFile, writeFile } from "fs/promises"

export const api = {
    notepadOpenFile: async (props: {path: string}) => {
        return {string: await readFile(props.path, "utf-8")}
    },
    notepadWriteFile: async (props: {path: string, fileContents: string}) => {
        await writeFile(props.path, props.fileContents)
    },
}