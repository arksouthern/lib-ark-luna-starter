import { readFile, writeFile } from "fs/promises"
import { basename } from "path"
import Vcf from "vcf"

export const LunaContactsApi = {

    fetchContactToContactCompact: async (props: {contactsDir?: string, fileRelativePath: string}) => {
        props.contactsDir ||= "../data/Contacts"
        return LunaContactsApi.contactToContactCompact(
            await LunaContactsApi.contactReadVcard({ 
                originalDir: props.contactsDir, 
                filePath: `${props.contactsDir}/${props.fileRelativePath}` 
            })
        )
    },

    contactReadVcard: async (props: { originalDir: string, filePath: string }) => {
		const buff = await readFile(props.filePath, "utf-8")
		const size = buff.length
		const fileName = basename(props.filePath)
		const subDir = props.filePath.replace(props.originalDir, "").replace(fileName, "").slice(1).replace(/\/$/, "")
		const card = new Vcf().parse(buff.replace(/\r?\n/g, '\r\n'))
		return { jCard: card.data, original: card, fileName: props.filePath, size, subDir }
	},

	contactToContactCompact: (props: Contact) => {
		const c = JSON.parse(JSON.stringify(props.jCard)) as any
		const fullName = `${c.n?.[3]?.[1] || ''} ${c.n?.[3]?.[0] || ''}`.trim()

		const findProperty = (field: string, type: string) => {
			if (!c[field]) return undefined
			else if (Array.isArray(c[field][0])) 
				return c[field].find((p: any) => p[1]?.type?.includes(type))
			else
				return c[field][1]?.type?.includes(type) ? c[field] : undefined
		}

		const getTypedProperty = (field: string, type: string) => {
			const prop = findProperty(field, type)
			if (prop?.[3]) return prop[3]
			else if (field === 'tel' && c[field]) {
				// console.log(c['tel'], prop)
				// debugger
				// let propsAlt = findProperty(field, 'voice')
				// return propsAlt
			}
			else if (field === 'related') {
				const matches: VcfArrayItem<any>[] = []
				if ("xAbLabel" in c && "xAbrelatednames" in c) {
					for (const l of c.xAbLabel) {
						if (l[3].toLowerCase() != `_$!<${type}>!$_`) continue
						for (const r of c.xAbrelatednames) {
							if (r[1].group != l[1].group) continue
							matches.push({ group: r[1].group, value: r[3] })
						}
					}
				}
				return matches
			}
			return undefined
		}

		const homeAdr = findProperty('adr', 'home')
		const workAdr = findProperty('adr', 'work')
		const orgParts = c.org?.[3]?.split(';') || []

		// Build `emails` array from various VCF shapes. Keep `email` as primary (first) for compatibility.
		const emailsArr: { type?: string, address: string }[] = []
		if (c.email) {
			if (c.email[0] != "email" && c.email[0][0] == "email") {
				for (const e of c.email) {
					const t = e?.[1]?.type || e?.[1]
					const typeStr = Array.isArray(t) ? t.join(',') : t
					const addr = e?.[3] ?? (typeof e === 'string' ? e : '')
					emailsArr.push({ type: typeStr, address: String(addr || '') })
				}
			} else {
				const t = c.email?.[1]?.type || c.email?.[1]
				const typeStr = Array.isArray(t) ? t.join(',') : t
				const addr = c.email?.[3] ?? ''
				emailsArr.push({ type: typeStr, address: String(addr || '') })
			}
		}

		return {
			type: { as: "file", fullPath: props.fileName },
			size: props.size,
			name: `${fullName}.vcf`,
			email: emailsArr[0]?.address || (c.email?.[3] || ''),
			emails: emailsArr,
			company: orgParts[0] || '',
			fName: c.n?.[3]?.[1] || '',
			lName: c.n?.[3]?.[0] || '',
			mName: c.n?.[3]?.[2] || '',
			title: c.title?.[3] || '',
			notes: c.note?.[3] || '',
			imppIrc: c.xIrc?.[3] || '',
			fullName,
			bDay: c.bday?.[3] || null,
			photo: c.photo?.[3] || '',
			note: c.note?.[3] || '',
			categories: c.categories?.[3] || '',
			nickname: c.nickname?.[3] || '',
			homeStreetAddress: homeAdr?.[3]?.[2] || '',
			homeCity: homeAdr?.[3]?.[3] || '',
			homeState: homeAdr?.[3]?.[4] || '',
			homeZip: homeAdr?.[3]?.[5] || '',
			homeCountry: homeAdr?.[3]?.[6] || '',
			homePhone: getTypedProperty('tel', 'home') || '',
			homeFax: getTypedProperty('tel', 'fax') || '',
			homeMobile: getTypedProperty('tel', 'cell') || getTypedProperty('tel', 'pref') || '',
			homeWebPage: getTypedProperty('url', 'home') || '',
			businessStreetAddress: workAdr?.[3]?.[2] || '',
			businessCity: workAdr?.[3]?.[3] || '',
			businessState: workAdr?.[3]?.[4] || '',
			businessZip: workAdr?.[3]?.[5] || '',
			businessCountry: workAdr?.[3]?.[6] || '',
			department: orgParts[1] || '',
			office: '',
			businessPhone: getTypedProperty('tel', 'work') || '',
			businessFax: getTypedProperty('tel', 'fax') || '',
			businessWebPage: getTypedProperty('url', 'work') || '',
			spouse: getTypedProperty('related', 'spouse') || '',
			children: getTypedProperty('related', 'child') || '',
			father: getTypedProperty('related', 'father') || '',
			mother: getTypedProperty('related', 'mother') || '',
			sister: getTypedProperty('related', 'sister') || '',
			brother: getTypedProperty('related', 'brother') || '',
			gender: c.gender?.[3]?.[0] || '',
			anniversary: c.anniversary?.[3] || null,
			subDir: props.subDir,
			// jCardComplete: props.jCard as any,
		} as any as CompactContact
	},

	contactUpdate: async (props: CompactContact) => {

		const buff = await readFile(props.type.fullPath, "utf-8")
		const cardToUpdate = new Vcf().parse(buff.replace(/\r?\n/g, '\r\n'))
		const onDiskContactCompact = LunaContactsApi.contactToContactCompact({ subDir: "", fileName: props.type.fullPath, original: cardToUpdate, jCard: cardToUpdate.data, size: buff.length });

		const { jCardComplete, ...rest } = props;

		const updateOrCreateTypedProperty = (field: string, type: string, value: string) => {
			// Always use the VCF API rather than touching internals.
			// Prefer `set` with a params object (many vcf libs accept a 3rd arg),
			// and fall back to adding a properly typed Property.
			try {
				// Add typed property using the public API: (field, value, params)
				cardToUpdate.set(field, value, { type });
				return;
			} catch (e) {
				console.log(e);
				// swallow and try fallback below
			}

			// Fallback: remove any existing typed property and add a new one.
			// We avoid reading `cardToUpdate.data`; use the public API where possible.
			try {
				// Try to remove an existing property by name then re-add.
				// Some Vcf instances expose `remove` or `removeProperty`, but we don't rely on it.
				// The reliable fallback is to add a typed property which will coexist.
				cardToUpdate.add(field, value, { type });
			} catch (err) {
				// As a last resort, attempt to set without params
				cardToUpdate.set(field, value);
				console.log(err);
			}
		};

		if (rest.lName !== onDiskContactCompact.lName || rest.fName !== onDiskContactCompact.fName || rest.mName !== onDiskContactCompact.mName)
			cardToUpdate.set('n', `${rest.lName};${rest.fName};${rest.mName};;`)

		if (rest.nickname !== onDiskContactCompact.nickname)
			cardToUpdate.set('nickname', rest.nickname)

		// START: email update
		const emailsOnDisk = onDiskContactCompact.emails || []
		const emailsInMemory = rest.emails || []
		if (JSON.stringify(emailsOnDisk) !== JSON.stringify(emailsInMemory)) {
			// remove all emails
			// This is tricky with the vcf lib. A common approach is to filter the internal array.
			// Let's assume direct manipulation is okay if the lib doesn't provide a clean API.
			if (cardToUpdate.data.email) {
				delete cardToUpdate.data.email
			}

			// add all emails from memory
			for (const email of emailsInMemory) {
				const params: { type?: string[] | string } = {}
				if (email.type) {
					params.type = email.type.split(',')
				}
				cardToUpdate.add('email', email.address, params)
			}
		}
		// END: email update

		if (rest.title !== onDiskContactCompact.title)
			cardToUpdate.set('title', rest.title)
		if (rest.notes !== onDiskContactCompact.notes)
			cardToUpdate.set('note', rest.notes)
		if (rest.bDay !== onDiskContactCompact.bDay)
			cardToUpdate.set('bday', `${rest.bDay}`)
		if (rest.anniversary !== onDiskContactCompact.anniversary)
			cardToUpdate.set('anniversary', `${rest.anniversary}`)
		if (rest.photo !== onDiskContactCompact.photo)
			cardToUpdate.set('photo', rest.photo)
		if (rest.categories !== onDiskContactCompact.categories)
			cardToUpdate.set('categories', rest.categories)
		if (rest.gender !== onDiskContactCompact.gender)
			cardToUpdate.set('gender', rest.gender)
		if (rest.imppIrc !== onDiskContactCompact.imppIrc)
			cardToUpdate.set('xIrc', rest.imppIrc)

		if (rest.company !== onDiskContactCompact.company || rest.department !== onDiskContactCompact.department)
			cardToUpdate.set('org', [rest.company, rest.department].filter(Boolean).join(';'))

		if (rest.homeStreetAddress !== onDiskContactCompact.homeStreetAddress || rest.homeCity !== onDiskContactCompact.homeCity || rest.homeState !== onDiskContactCompact.homeState || rest.homeZip !== onDiskContactCompact.homeZip || rest.homeCountry !== onDiskContactCompact.homeCountry) {
			const homeAdr = ['', '', rest.homeStreetAddress, rest.homeCity, rest.homeState, rest.homeZip, rest.homeCountry]
			// Use typed property only; avoid overwriting all adr entries with an untyped value
			updateOrCreateTypedProperty('adr', 'home', homeAdr.join(';'))
		}

		if (rest.businessStreetAddress !== onDiskContactCompact.businessStreetAddress || rest.businessCity !== onDiskContactCompact.businessCity || rest.businessState !== onDiskContactCompact.businessState || rest.businessZip !== onDiskContactCompact.businessZip || rest.businessCountry !== onDiskContactCompact.businessCountry) {
			const businessAdr = ['', '', rest.businessStreetAddress, rest.businessCity, rest.businessState, rest.businessZip, rest.businessCountry]
			// Use typed property only; avoid overwriting all adr entries with an untyped value
			updateOrCreateTypedProperty('adr', 'work', businessAdr.join(';'))
		}
		
		if (rest.homePhone !== onDiskContactCompact.homePhone) 
			updateOrCreateTypedProperty('tel', 'home', rest.homePhone)
		
		if (rest.homeFax !== onDiskContactCompact.homeFax) 
			updateOrCreateTypedProperty('tel', 'fax', rest.homeFax)
		
		if (rest.homeMobile !== onDiskContactCompact.homeMobile) 
			updateOrCreateTypedProperty('tel', 'cell', rest.homeMobile)
		
		if (rest.homeWebPage !== onDiskContactCompact.homeWebPage) 
			updateOrCreateTypedProperty('url', 'home', rest.homeWebPage)
		
		if (rest.businessPhone !== onDiskContactCompact.businessPhone) 
			updateOrCreateTypedProperty('tel', 'work', rest.businessPhone)
		
		if (rest.businessFax !== onDiskContactCompact.businessFax) 
			updateOrCreateTypedProperty('tel', 'fax', rest.businessFax)
		
		if (rest.businessWebPage !== onDiskContactCompact.businessWebPage) 
			updateOrCreateTypedProperty('url', 'work', rest.businessWebPage)
		
		// if (rest.spouse !== onDiskContactCompact.spouse) {
		// 	// Clear existing spouse properties
		// 	if (cardToUpdate.data.related) {
		// 		cardToUpdate.data.related = cardToUpdate.data.related.filter((p: any) => !p[1]?.type?.includes('spouse'));
		// 	}
		// 	// Add new spouse properties
		// 	for (const s of rest.spouse) {
		// 		cardToUpdate.add('related', s.value, { type: 'spouse' });
		// 	}
		// }
		// if (rest.children !== onDiskContactCompact.children) {
		// 	// Clear existing child properties
		// 	if (cardToUpdate.data.related) {
		// 		cardToUpdate.data.related = cardToUpdate.data.related.filter((p: any) => !p[1]?.type?.includes('child'));
		// 	}
		// 	// Add new child properties
		// 	for (const c of rest.children) {
		// 		cardToUpdate.add('related', c.value, { type: 'child' });
		// 	}
		// }

		await writeFile(props.type.fullPath, cardToUpdate.toString());
	},
}


export type Contact = { fileName: string, original: Vcf, size: number, subDir: string, jCard: { [key: string]: Vcf.Property | Vcf.Property[] } }
export type VcfArrayItem<T> = { group: number, value: T }
export type CompactContact = {
	type: { as: "locked", fullPath: string, size: number },
	subDir: string,
	size: number
	fName: string,
	mName: string,
	lName: string,
	nickname: string,
	fullName: string
	email: string,
	imppIrc: string,
	emails: { type?: string, address: string }[],
	company: string,
	title: string,
	notes: string,
	bDay: number,
	photo: string,
	categories: string,
	homeStreetAddress: string,
	homeCity: string,
	homeState: string,
	homeZip: string,
	homeCountry: string,
	homePhone: string,
	homeFax: string,
	homeMobile: string,
	homeWebPage: string,
	businessStreetAddress: string,
	businessCity: string,
	businessState: string,
	businessZip: string,
	businessCountry: string,
	department: string,
	office: string,
	businessPhone: string,
	businessFax: string,
	businessWebPage: string,
	spouse: VcfArrayItem<string>[],
	children: VcfArrayItem<string>[],
	brother: VcfArrayItem<string>[],
	sister: VcfArrayItem<string>[],
	mother: VcfArrayItem<string>[],
	father: VcfArrayItem<string>[],
	gender: string,
	anniversary: number,
	jCardComplete: Contact
}