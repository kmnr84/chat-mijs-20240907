import { createUserWithEmailAndPassword, getAuth } from "firebase/auth";

export const useAuthentication = () => {
  const auth = getAuth();

  const createUser = async (email: string, password: string) => {
    return await createUserWithEmailAndPassword(auth, email, password)
      .then(userCredential => userCredential.user.uid)
      .catch(error => '');
  };

  return {
    createUser
  };
};
