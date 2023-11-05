import {
	GoogleAuthProvider,
	getAuth,
	type UserCredential,
	signInWithPopup,
	signOut,
	type User
} from 'firebase/auth'
import { initializeApp } from 'firebase/app'
import {
	addDoc,
	collection,
	doc,
	getDoc,
	getDocs,
	getFirestore,
	setDoc,
	updateDoc
} from 'firebase/firestore'
import type { Cat } from './types/cat'
import toCatObject from '../converters/cat'
import type { CatLocation } from './types/cat_location'
import { writable } from 'svelte/store'
import type PawUser from './types/users'
// type User
// import { writable } from 'svelte/store'

const firebaseConfig = {
	apiKey: 'AIzaSyDdPKAFlO_Qk44LSUBfXNUPehXfaGGQ3K8',
	authDomain: 'pawpoints-nh.firebaseapp.com',
	projectId: 'pawpoints-nh',
	storageBucket: 'pawpoints-nh.appspot.com',
	messagingSenderId: '975666901457',
	appId: '1:975666901457:web:6719d3d0b1c3ab0987b0f0'
}

// const user = writable<User | null>()

const app = initializeApp(firebaseConfig)

const db = getFirestore(app)

const provider = new GoogleAuthProvider()
const auth = getAuth()
const user = writable<User | null>()
const pawUser = writable<PawUser | null>()

const catAdded: ((cat: Cat) => undefined)[] = []

function logout() {
	signOut(auth).then(() => {
		// Sign-out successful.
		localStorage.removeItem('user')
		user.set(null)
	})
}

function login() {
	signInWithPopup(auth, provider)
		.then(async (result: UserCredential) => {
			// const credential = GoogleAuthProvider.credentialFromResult(result)!
			// const token = credential.accessToken
			// The signed-in user info.
			localStorage.setItem('user', JSON.stringify(result.user))
			if (!(await userExists(result.user.uid))) {
				console.log("doesn't exist")
				createUser(result.user)
			} else {
				console.log('exists')
			}
			loadPawUser(result.user.uid)
			user.set(result.user)
			// user.set(result.user)
			// IdP data available using getAdditionalUserInfo(result)
			// ...
		})
		.catch(console.error)
	// .catch((error) => {
	// 	// Handle Errors here.
	// 	const errorCode = error.code
	// 	const errorMessage = error.message
	// 	// The email of the user's account used.
	// 	const email = error.customData.email
	// 	// The AuthCredential type that was used.
	// 	const credential = GoogleAuthProvider.credentialFromError(error)
	// 	...
	// })
}

async function loadPawUser(userUid: string) {
	pawUser.set(await getPawUser(userUid))
}

async function getPawUser(userUid: string): Promise<PawUser> {
	const userRef = doc(collection(db, 'users'), userUid)
	const userDoc = await getDoc(userRef)
	return userDoc.data() as PawUser
}

async function userExists(userUid: string): Promise<boolean> {
	const userRef = doc(collection(db, 'users'), userUid)
	const userDoc = await getDoc(userRef)

	return userDoc.data() !== undefined
}

async function createUser(user: User) {
	await setDoc(doc(db, 'users', user.uid), {
		uid: user.uid,
		pawPoints: 0,
		followedCats: []
	})
}

async function getCats(): Promise<Cat[]> {
	const result = await getDocs(collection(db, 'cats'))
	return result.docs.map(toCatObject)
}

async function writeCat(cat: Omit<Cat, 'firebaseDocId'>) {
	await addDoc(collection(db, 'cats'), cat)
	catAdded.forEach((cb) => cb(cat))
}

async function setCat(cat: Cat, property: keyof Cat, value: string | Date | number | CatLocation) {
	const docPtr = doc(collection(db, 'cats'), cat.firebaseDocId)

	cat[property] = value

	updateDoc(docPtr, {
		[property]: value
	})
}

async function updatePawPoints(pawPoints: number, uid: string) {
	const userRef = doc(collection(db, 'users'), uid)
	await updateDoc(userRef, {
		pawPoints
	})
}
// function writeCats(cats: Cat[]) {}

export {
	app,
	login,
	logout,
	user,
	pawUser,
	loadPawUser,
	db,
	writeCat,
	getCats,
	setCat,
	updatePawPoints,
	catAdded
}
