import app from 'firebase/compat/app'
import 'firebase/compat/auth'
import 'firebase/compat/firestore'
import { deleteDoc, doc } from 'firebase/firestore';

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
		if (!this.auth.currentUser) {
			return alert('Not authorized')
		}

		return this.db.doc(`users_codedamn_video/${this.auth.currentUser.uid}`).set({
			quote
		})
	}

	async addUsing(person, product) {
		this.db.collection('usings').add({
			person: person,
			product: product
		})
	}

	async removeUsing(documentId) {
		try {
			const docRef = doc(this.db, 'usings', documentId);
			await deleteDoc(docRef);
		} catch (error) {
			console.error('Error deleting document:', error);
		}
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

	async getUsings() {
		const usings = await this.db.collection('usings').get()
		return usings.docs.map(doc => ({id:doc.id, ...doc.data()}))
	}

	async getPersons() {
		const persons = await this.db.collection('persons').get()
		return persons.docs.map(doc => ({id:doc.id, ...doc.data()}))
	}

	async getProducts() {
		const products = await this.db.collection('products').get()
		return products.docs.map(doc => ({id:doc.id, ...doc.data()}))
	}

	async addProduct(name, title, price) {
		await this.db.collection('products').add({
			name,
			title,
			price
		})
	}

	async editProduct(id, data) {
		await this.db.collection('products').doc(id).update(data)
	}
}

export default new Firebase()