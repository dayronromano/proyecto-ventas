import {
  collection,
  getDocs,
  getDoc,
  addDoc,
  doc,
  query,
  updateDoc,
  where,
  setDoc
} from "firebase/firestore";
import {
  signInWithEmailAndPassword,
  signOut
} from 'firebase/auth'
import { auth, database, crearUsuario } from "./firebase.jsx";

export const getCollection = async (nombreColeccion) => {

  try {

    const response = await getDocs(query(collection(database, nombreColeccion)));
    const elementos = response.docs.map((doc) => {
      const document = {
        id: doc.id,
        ...doc.data()
      }
      return document;
    })

    return elementos
  } catch (error) {
    throw new Error(error.message)
  }
}

export const getFilterCollection = async (nombreColeccion, keyDocumento, condicion, value) => {

  try {
    const response = await getDocs(query(collection(database, nombreColeccion), where(keyDocumento, condicion, value)));
    console.log(response);
    const elementos = response.docs.map((doc) => {
      const document = {
        id: doc.id,
        ...doc.data()
      }
      return document;
    })

    return elementos
  } catch (error) {
    throw new Error(error.message)
  }
}

export const getCustomFilterCollection = async (nombreColeccion, keyDocumento,value) => {

  try {
    const response = await getDocs(query(collection(database, nombreColeccion)));
    const elementos = [];
    response.docs.map((doc) => {
      const document = {
        id: doc.id,
        ...doc.data()
      }
      if(document[keyDocumento].toLowerCase().includes(value.toLowerCase())){
        console.log(document);
        elementos.push(document);
      }
    })
    return elementos
  } catch (error) {
    throw new Error(error.message)
  }
}


export const getDocument = async (nombreColeccion, idDocumento) => {
  try {
    const respuesta = await getDoc(doc(database, nombreColeccion, idDocumento))
    // console.log(respuesta.data());

    const documentoTemporal = {
      id: respuesta.id,
      ...respuesta.data()
    }

    // console.log(documentoTemporal);
    return documentoTemporal
  } catch (e) {
    throw new Error(e)
  }
}

export const saveDocument = async (nombreColeccion, data, idDocumento) => {

  try {

    let respuesta;
    if (idDocumento) {
      respuesta = await setDoc(doc(database, nombreColeccion, idDocumento), data);
    } else {
      respuesta = await addDoc(collection(database, nombreColeccion), data)
    }

    return respuesta
  } catch (e) {
    throw new Error(e)
  }
}

export const updateDocument = async (nombreColeccion, data, idDocumento) => {
  try {
    const respuesta = await updateDoc(doc(database, nombreColeccion, idDocumento), data)
    return respuesta
  } catch (e) {
    throw new Error(e)
  }
}

export const firebaseLogin = async (email, password) => {

  try {
    const credencialesUsuario = await signInWithEmailAndPassword(auth, email, password)
    const user = {
      id: credencialesUsuario.user.uid,
      email: credencialesUsuario.user.email
    }
    return user;
  } catch (error) {
    throw new Error(error.code)
  }

}

export const createUser = async (nombreColeccion,data) => {
  try {
    const credencialesUsuario = await crearUsuario(nombreColeccion, data)
    return credencialesUsuario;
  } catch (error) {
    throw new Error(error.code)
  }

}

export const logOut = async () => {

  try {
    const response = await signOut(auth)
    // console.log(response);
    return response
  } catch (error) {
    return error;
  }
}

export const currentUser = () => {

  const user = auth.currentUser

  if (user) {
    // console.log(user);
    // const usuario = await getDocument(collectionTypes.USERS, user.uid)
    // return usuario
    return user
  } else {
    return undefined
  }
}

// onAuthStateChanged(auth, async (user) => {

//   if (user) {
//     usuario = user
//     console.log('El usuario logueado');

//   } else {
//     console.log('El usuario ya no esta logueado');
//     usuario = undefined
//   }

// })