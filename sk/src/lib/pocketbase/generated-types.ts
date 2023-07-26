/**
* This file was @generated using pocketbase-typegen
*/

export enum Collections {
	Entries = "entries",
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

export type EntriesRecord = {
	torrents: RecordIdString[]
	alID: number
	notes?: string
	comparison?: string
	incomplete?: boolean
	best?: RecordIdString
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
export type EntriesResponse<Texpand = unknown> = Required<EntriesRecord> & BaseSystemFields<Texpand>
export type TorrentsResponse<Tfiles = unknown, Texpand = unknown> = Required<TorrentsRecord<Tfiles>> & BaseSystemFields<Texpand>
export type UsersResponse<Texpand = unknown> = Required<UsersRecord> & AuthSystemFields<Texpand>

// Types containing all Records and Responses, useful for creating typing helper functions

export type CollectionRecords = {
	entries: EntriesRecord
	torrents: TorrentsRecord
	users: UsersRecord
}

export type CollectionResponses = {
	entries: EntriesResponse
	torrents: TorrentsResponse
	users: UsersResponse
}