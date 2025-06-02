/**
* This file was @generated using pocketbase-typegen
*/

import type PocketBase from 'pocketbase'
import type { RecordService } from 'pocketbase'

export enum Collections {
	Auditlog = "auditlog",
	DeadData = "dead_data",
	Editors = "editors",
	Entries = "entries",
	Hooks = "hooks",
	ReleaseGroups = "releaseGroups",
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
	admin?: string
	collection: string
	data?: null | Tdata
	event: string
	original?: null | Toriginal
	record: string
	user?: RecordIdString
}

export enum DeadDataTrackerOptions {
	"Nyaa" = "Nyaa",
	"AB" = "AB",
	"AniDex" = "AniDex",
	"RuTracker" = "RuTracker",
	"AnimeTosho" = "AnimeTosho",
	"BeyondHD" = "BeyondHD",
	"Aither" = "Aither",
	"Blutopia" = "Blutopia",
	"HDBits" = "HDBits",
	"BroadcastTheNet" = "BroadcastTheNet",
	"PassThePopcorn" = "PassThePopcorn",
	"Other" = "Other",
	"OtherPrivate" = "OtherPrivate",
}
export type DeadDataRecord = {
	infoHash: string
	releaseGroup: string
	tracker: DeadDataTrackerOptions
}

export type EditorsRecord = {
	avatar?: string
	username?: string
}

export type EntriesRecord = {
	alID: number
	comparison?: string
	incomplete?: boolean
	notes?: string
	theoreticalBest?: string
	trs: RecordIdString[]
}

export enum HooksEventOptions {
	"insert" = "insert",
	"update" = "update",
	"delete" = "delete",
}
export type HooksRecord = {
	action_params?: string
	collection: string
	event: HooksEventOptions
}

export type ReleaseGroupsRecord = {
	count?: number
}

export enum TorrentsTrackerOptions {
	"Nyaa" = "Nyaa",
	"AB" = "AB",
	"AniDex" = "AniDex",
	"RuTracker" = "RuTracker",
	"AnimeTosho" = "AnimeTosho",
	"BeyondHD" = "BeyondHD",
	"Aither" = "Aither",
	"Blutopia" = "Blutopia",
	"HDBits" = "HDBits",
	"BroadcastTheNet" = "BroadcastTheNet",
	"PassThePopcorn" = "PassThePopcorn",
	"Other" = "Other",
	"OtherPrivate" = "OtherPrivate",
}
export type TorrentsRecord<Tfiles = { length: number, name: string }[]> = {
	dualAudio?: boolean
	files: null | Tfiles
	groupedUrl?: string
	infoHash: string
	isBest?: boolean
	releaseGroup: string
	tracker: TorrentsTrackerOptions
	url: string
}

export type UsersRecord = {
	avatar?: string
	canEdit?: boolean
	name?: string
}

// Response types include system fields and match responses from the PocketBase API
export type AuditlogResponse<Tdata = unknown, Toriginal = unknown, Texpand = unknown> = Required<AuditlogRecord<Tdata, Toriginal>> & BaseSystemFields<Texpand>
export type DeadDataResponse<Texpand = unknown> = Required<DeadDataRecord> & BaseSystemFields<Texpand>
export type EditorsResponse<Texpand = unknown> = Required<EditorsRecord> & BaseSystemFields<Texpand>
export type EntriesResponse<Texpand = unknown> = Required<EntriesRecord> & BaseSystemFields<Texpand>
export type HooksResponse<Texpand = unknown> = Required<HooksRecord> & BaseSystemFields<Texpand>
export type ReleaseGroupsResponse<Texpand = unknown> = Required<ReleaseGroupsRecord> & BaseSystemFields<Texpand>
export type TorrentsResponse<Tfiles = { length: number, name: string }[], Texpand = unknown> = Required<TorrentsRecord<Tfiles>> & BaseSystemFields<Texpand>
export type UsersResponse<Texpand = unknown> = Required<UsersRecord> & AuthSystemFields<Texpand>

// Types containing all Records and Responses, useful for creating typing helper functions

export type CollectionRecords = {
	auditlog: AuditlogRecord
	dead_data: DeadDataRecord
	editors: EditorsRecord
	entries: EntriesRecord
	hooks: HooksRecord
	releaseGroups: ReleaseGroupsRecord
	torrents: TorrentsRecord
	users: UsersRecord
}

export type CollectionResponses = {
	auditlog: AuditlogResponse
	dead_data: DeadDataResponse
	editors: EditorsResponse
	entries: EntriesResponse
	hooks: HooksResponse
	releaseGroups: ReleaseGroupsResponse
	torrents: TorrentsResponse
	users: UsersResponse
}

// Type for usage with type asserted PocketBase instance
// https://github.com/pocketbase/js-sdk#specify-typescript-definitions

export type TypedPocketBase = PocketBase & {
	collection(idOrName: 'auditlog'): RecordService<AuditlogResponse>
	collection(idOrName: 'dead_data'): RecordService<DeadDataResponse>
	collection(idOrName: 'editors'): RecordService<EditorsResponse>
	collection(idOrName: 'entries'): RecordService<EntriesResponse>
	collection(idOrName: 'hooks'): RecordService<HooksResponse>
	collection(idOrName: 'releaseGroups'): RecordService<ReleaseGroupsResponse>
	collection(idOrName: 'torrents'): RecordService<TorrentsResponse>
	collection(idOrName: 'users'): RecordService<UsersResponse>
}
