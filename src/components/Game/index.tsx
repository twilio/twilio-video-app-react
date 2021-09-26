import React, { useState, useEffect } from 'react';
import getFirebase from '../../firebase.config';
import VerticalCarousel from '../VerticalCarousel';

const firebase = getFirebase();

function Game() {
  const [questions, setQuestions] = useState<any>([]);

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        if (!firebase) return;
        const db = firebase.firestore();
        const ref = db.collection('questions');

        const docs = await ref.get();

        let allQuestions: any[] = [];
        docs.forEach((doc: any) => {
          const data = doc.data();
          allQuestions.push(data);
        });
        setQuestions(allQuestions);
      } catch (error) {
        console.log('error', error);
      }
    };

    fetchQuestions();
  }, []);

  return (
    <div className="absolute w-full h-screen z-0 bg-grayish">
      <VerticalCarousel data={questions} />
    </div>
  );
}

export default Game;
