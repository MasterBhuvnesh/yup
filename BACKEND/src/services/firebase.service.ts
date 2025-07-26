import db  from "../config/firebase";
import generateSHA256 from "../utils";


/**
 * Saves the article data to Firestore.
 * @param title - The article title.
 * @param data - The generated article JSON.
 */

export async function saveArticleToFirestore(title: string, data: any) {
  const docRef = db.collection("articles").doc(generateSHA256(title));
  await docRef.set({
    title,
    Data: data,
  });
  return docRef.id;
}
