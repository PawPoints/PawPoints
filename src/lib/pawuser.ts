import type { Cat } from './types/cat'
import { get } from 'svelte/store'
import { user } from './firebase'
import type { User } from 'firebase/auth'

export default class PawUser {
	private static instance?: PawUser

	public uid: string
	public pawPoints: number
	public followedCats: Cat[]

	private constructor(uid: string, pawPoints: number, followedCats: Cat[]) {
		this.uid = uid
		this.pawPoints = pawPoints
		this.followedCats = followedCats
	}

	public static getInstance(): PawUser {
		if (!PawUser.instance) {
            const userI: User | null = get(user)
            if (!userI) {
                // PawUser.instance = new PawUser(userI.uid, );
            }
        }
        return PawUser.instance as PawUser;
	}
}
