/**
* This file was @generated using pocketbase-typegen
*/

export enum Collections {
	Auditlog = "auditlog",
	Entries = "entries",
	Hooks = "hooks",
	Torrents = "torrents",
	Users = "users",
}

// Alias types for improved usability
export type IsoDateString = string
export type RecordIdString = string
export type HTMLString = string

// System fields
export type BaseSystemFields<T = never> = {
	id: RecordIdString
	created: IsoDateString
	updated: IsoDateString
	collectionId: string
	collectionName: Collections
	expand?: T
}

export type AuthSystemFields<T = never> = {
	email: string
	emailVisibility: boolean
	username: string
	verified: boolean
} & BaseSystemFields<T>

// Record types for each collection

export type AuditlogRecord<Tdata = unknown, Toriginal = unknown> = {
	collection: string
	record: string
	event: string
	user?: RecordIdString
	admin?: string
	data?: null | Tdata
	original?: null | Toriginal
}

export type EntriesRecord = {
	trs: RecordIdString[]
	alID: number
	notes?: string
	incomplete?: boolean
	best?: RecordIdString
	comparison?: string
}

export enum HooksEventOptions {
	"insert" = "insert",
	"update" = "update",
	"delete" = "delete",
}

export enum HooksActionTypeOptions {
	"command" = "command",
	"post" = "post",
}
export type HooksRecord = {
	collection: string
	event: HooksEventOptions
	action_type: HooksActionTypeOptions
	action: string
	action_params?: string
	expands?: string
	disabled?: boolean
}

export enum TorrentsTrackerOptions {
	"Nyaa" = "Nyaa",
	"AnimeBytes" = "AnimeBytes",
	"AniDex" = "AniDex",
	"RuTracker" = "RuTracker",
	"AnimeTosho" = "AnimeTosho",
}
export type TorrentsRecord<Tfiles = unknown> = {
	infoHash: string
	tracker: TorrentsTrackerOptions
	url: string
	files: null | Tfiles
	dualAudio?: boolean
	releaseGroup: string
}

export type UsersRecord = {
	name?: string
	avatar?: string
	canEdit?: boolean
}

// Response types include system fields and match responses from the PocketBase API
export type AuditlogResponse<Tdata = unknown, Toriginal = unknown, Texpand = unknown> = Required<AuditlogRecord<Tdata, Toriginal>> & BaseSystemFields<Texpand>
export type EntriesResponse<Texpand = unknown> = Required<EntriesRecord> & BaseSystemFields<Texpand>
export type HooksResponse<Texpand = unknown> = Required<HooksRecord> & BaseSystemFields<Texpand>
export type TorrentsResponse<Tfiles = unknown, Texpand = unknown> = Required<TorrentsRecord<Tfiles>> & BaseSystemFields<Texpand>
export type UsersResponse<Texpand = unknown> = Required<UsersRecord> & AuthSystemFields<Texpand>

// Types containing all Records and Responses, useful for creating typing helper functions

export type CollectionRecords = {
	auditlog: AuditlogRecord
	entries: EntriesRecord
	hooks: HooksRecord
	torrents: TorrentsRecord
	users: UsersRecord
}

export type CollectionResponses = {
	auditlog: AuditlogResponse
	entries: EntriesResponse
	hooks: HooksResponse
	torrents: TorrentsResponse
	users: UsersResponse
}