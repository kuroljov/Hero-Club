import firebase from 'firebase'

const config = {
  apiKey: 'AIzaSyAa_jM93NQnlMX_h38k-bptzt_XD2Gre4A',
  authDomain: 'hero-club-d8a04.firebaseapp.com',
  databaseURL: 'https://hero-club-d8a04.firebaseio.com',
  projectId: 'hero-club-d8a04',
  storageBucket: 'hero-club-d8a04.appspot.com',
  messagingSenderId: '1057391921941'
}

export const app = firebase.initializeApp(config)
export const db = app.database()
export const $players = db.ref('players')
