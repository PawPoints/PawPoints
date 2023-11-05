import type { DocumentData, QueryDocumentSnapshot } from 'firebase/firestore'
import type { Cat } from '../lib/types/cat'

export default function toCatObject(
	document: QueryDocumentSnapshot<DocumentData, DocumentData>
): Cat {
	const data = document.data()

	const cat: Cat = {
		name: data.name,
		breed: data.breed,
		description: data.description,
		image: data.image,
		lastSeen: data.lastSeen.toDate(),
		lastFed: data.lastFed.toDate(),
		location: data.location,
		firebaseDocId: document.id
	}

	return cat
}
