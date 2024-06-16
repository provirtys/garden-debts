import app from 'firebase/compat/app'
import 'firebase/compat/auth'
import 'firebase/compat/firestore'
import {getFirestore, collection, getDocs} from 'firebase/firestore'

const config = {
  apiKey: "AIzaSyCSrFVLDEzT0PdBl7yOVQQb10z2d8DCkEY",
  authDomain: "react-firebase-51d42.firebaseapp.com",
  databaseURL: "https://react-firebase-51d42-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "react-firebase-51d42",
  storageBucket: "react-firebase-51d42.appspot.com",
  messagingSenderId: "492092165660",
  appId: "1:492092165660:web:77234ca1b993033e5499d9"
};


class Firebase {
	constructor() {
		app.initializeApp(config)
		this.auth = app.auth()
		this.db = app.firestore()
	}

	login(email, password) {
		return this.auth.signInWithEmailAndPassword(email, password)
	}

	logout() {
		return this.auth.signOut()
	}

	async register(name, email, password) {
		await this.auth.createUserWithEmailAndPassword(email, password)
		return this.auth.currentUser.updateProfile({
			displayName: name
		})
	}

	addQuote(quote) {
		if(!this.auth.currentUser) {
			return alert('Not authorized')
		}

		return this.db.doc(`users_codedamn_video/${this.auth.currentUser.uid}`).set({
			quote
		})
	}

	addUsing(person,product){
		this.db.collection('usings').add({
			person:person,
			product:product
		})
	}

	removeUsing(person,product){
		this.db.collection('usings').add({
			person:person,
			product:product
		})
	}

	isInitialized() {
		return new Promise(resolve => {
			this.auth.onAuthStateChanged(resolve)
		})
	}

	getCurrentUsername() {
		return this.auth.currentUser && this.auth.currentUser.displayName
	}

	async getCurrentUserQuote() {
		const quote = await this.db.doc(`users_codedamn_video/${this.auth.currentUser.uid}`).get()
		return quote.get('quote')
	}

	async getUsings(){
		const usings = await this.db.doc(`usings/OWqrUsqhrKnRyjFliee5`).get()
		// console.log(usings);
		return usings

		let db2 = getFirestore()
		const colRef = collection(db2, 'usings')
		
		
		await getDocs(colRef)
			.then(snapshot => this.docs = snapshot.docs)

		return this.docs
	}
}

export default new Firebase()