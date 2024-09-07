import { addDoc, collection, doc, getDoc, getDocs, getFirestore, onSnapshot, orderBy, query, serverTimestamp, setDoc } from "firebase/firestore";
import type { Message, User } from "./types/firestore";
import { getAuth, signInWithEmailAndPassword, signOut as signOutFromFirebase } from "firebase/auth";

export const useFirestore = () => {
  const db = getFirestore();

  // const getMessages = async (): Promise<Message[]> => {
  //   const q = query(collection(db, 'messages'), orderBy('timestamp'));
  //   const querySnapshot = await getDocs(q);
  //   const messages = querySnapshot.docs.map(doc => {
  //     return doc.data() as Message
  //   });
  //   return messages;
  // };

  // const getUsers = async (): Promise<User[]> => {
  //   const q = query(collection(db, 'users'));
  //   const querySnapshot = await getDocs(q);
  //   const users = querySnapshot.docs.map(doc => {
  //     return doc.data() as User
  //   });
  //   return users;
  // };

  const getUser = async (id: string | undefined): Promise<User | null> => {
    if (!id) return null;
    const docRef = doc(db, 'users', id);
    const docSnap = await getDoc(docRef);

    return (docSnap.exists() ? docSnap.data() : {}) as User;
  };

  const currentUser = () => {
    return getUser(getAuth().currentUser?.uid);
  };

  const currentUserId = () => getAuth().currentUser?.uid;

  const createUser = async(id: string, username: string, email: string): Promise<void> => {
    // todo: 引数のバリデーション

    await setDoc(doc(db, 'users', id), {
      username,
      email,
      profile_picture: '',
      bio: '',
      last_login: serverTimestamp()
    } as User);
  };

  const SendContent = async (content: string) => {
    const id = getAuth().currentUser?.uid;
    const user = await getUser(id);
    if (!user) return;
    await addDoc(collection(db, 'messages'), {
      sender_id: id,
      sender_name: user.username,
      message_type: 'text',
      content,
      media_url: '',
      timestamp: serverTimestamp()
    } as Message);
  };

  const signIn = async (email: string, password: string) => {
    await signInWithEmailAndPassword(getAuth(), email, password);
  };

  const signOut = async () => {
    await signOutFromFirebase(getAuth());
  };

  const listenMessages = (messages: Map<string, Message>) => {
    const q = query(collection(db, 'messages'), orderBy('timestamp'));
    return onSnapshot(q, snapshot => {
      snapshot.docChanges().forEach(change => {
        messages.set(change.doc.id, change.doc.data() as Message);
      });
    });
  };

  const listenUsers = (users: Map<string, User>) => {
    const q = query(collection(db, 'users'));
    return onSnapshot(q, snapshot => {
      snapshot.docChanges().forEach(change => {
        users.set(change.doc.id, change.doc.data() as User);
      });
    });
  }

  return {
    createUser,
    SendContent,
    currentUser,
    currentUserId,
    signIn,
    signOut,
    listenMessages,
    listenUsers
  };
};
