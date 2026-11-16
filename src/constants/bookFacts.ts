export interface BookFact {
  index: number;
  title: string;
  sentence: string;
  /** room that must be cleared to open this fact (0 = available at launch) */
  requiresRoom: number;
}

export const BOOK_FACTS: BookFact[] = [
  { index: 1, title: "Alice's Adventures in Wonderland", sentence: 'Alice begins her adventure by following a White Rabbit.', requiresRoom: 0 },
  { index: 2, title: 'The Wonderful Wizard of Oz', sentence: 'Dorothy travels with her little dog, Toto.', requiresRoom: 1 },
  { index: 3, title: 'The Secret Garden', sentence: 'A hidden garden helps bring new friendships to life.', requiresRoom: 2 },
  { index: 4, title: 'Peter Pan', sentence: "Peter Pan's adventures take place in Neverland.", requiresRoom: 3 },
  { index: 5, title: 'The Jungle Book', sentence: 'Mowgli is a child who grows up among jungle animals.', requiresRoom: 4 },
  { index: 6, title: 'Anne of Green Gables', sentence: "Anne's story is set on Prince Edward Island.", requiresRoom: 5 },
  { index: 7, title: 'The Wind in the Willows', sentence: "Mole, Rat, Badger, and Toad are the story's animal friends.", requiresRoom: 6 },
  { index: 8, title: 'Treasure Island', sentence: 'A treasure map sets a sea adventure in motion.', requiresRoom: 7 },
  { index: 9, title: "Aesop's Fables", sentence: 'These short tales often use animals to share a lesson.', requiresRoom: 8 },
  { index: 10, title: 'Pride and Prejudice', sentence: 'Jane Austen wrote this classic about the Bennet family.', requiresRoom: 9 },
];
