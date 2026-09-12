import { DataSource } from 'typeorm';
import dataSource from '../../../config/data-source.js';
import { User } from '../../../users/entities/user.entity.js';
import { Author } from '../../../author/entities/author.entity.js';
import { Book } from '../../../books/entities/books.entity.js'
import { Tag } from '../../../tags/entities/tag.entity.js'
import { BookTag } from '../../../books/entities/book-tag.entity.js'
import { BookConnection } from '../../../books/entities/book-connection.entity.js'
import { UserRole } from '../../../common/types/enums/user-role.enum.js';
import { BookRole } from '../../../common/types/enums/book-role.enum.js';

async function runSeed() {
  console.log('🌱 Starting database seeding...');
  
  await dataSource.initialize();
  const queryRunner = dataSource.createQueryRunner();

  try {
    // 1. Pulizia tabelle per idempotenza (ordine inverso causa FK)
    await queryRunner.query('TRUNCATE TABLE "book_connections", "book_tags", "books", "tags", "authors", "users" CASCADE;');

    const userRepository = dataSource.getRepository(User);
    const authorRepository = dataSource.getRepository(Author);
    const bookRepository = dataSource.getRepository(Book);
    const tagRepository = dataSource.getRepository(Tag);
    const bookTagRepository = dataSource.getRepository(BookTag);
    const connectionRepository = dataSource.getRepository(BookConnection);

    // 2. Creazione Utente di Test
    const testUser = await userRepository.save(
      userRepository.create({
        name: 'Elia',
        lastName: 'Dev',
        username: 'eliadev',
        hashedPassword: '$2b$10$e846/7qG9wV.dummyhashedpassword', // Hash fittizio
        role: UserRole.ADMIN,
      }),
    );
    console.log('✅ User created');

    // 3. Creazione Autori
    const authorsData = [
      { name: 'Frank Herbert', bio: 'American science fiction author best known for Dune.' },
      { name: 'Isaac Asimov', bio: 'Biochemistry professor and prolific sci-fi writer.' },
      { name: 'William Gibson', bio: 'Pioneer of the cyberpunk subgenre.' },
      { name: 'Philip K. Dick', bio: 'American writer known for philosophical sci-fi themes.' },
      { name: 'Ursula K. Le Guin', bio: 'Author of speculative fiction and Earthsea cycle.' },
    ];
    const savedAuthors = await authorRepository.save(authorRepository.create(authorsData));
    console.log(`✅ ${savedAuthors.length} Authors created`);

    // 4. Creazione Tag
    const tagsData = [
      { name: 'Sci-Fi', userId: testUser.id },
      { name: 'Cyberpunk', userId: testUser.id },
      { name: 'Classics', userId: testUser.id },
      { name: 'Space Opera', userId: testUser.id },
      { name: 'Dystopian', userId: testUser.id },
    ];
    const savedTags = await tagRepository.save(tagRepository.create(tagsData));
    console.log(`✅ ${savedTags.length} Tags created`);

    // 5. Creazione Libri (10 libri)
    const booksData = [
      { title: 'Dune', genre: 'Sci-Fi', authorId: savedAuthors[0].id, userId: testUser.id, status: BookRole.READ },
      { title: 'Dune Messiah', genre: 'Sci-Fi', authorId: savedAuthors[0].id, userId: testUser.id, status: BookRole.READ },
      { title: 'Children of Dune', genre: 'Sci-Fi', authorId: savedAuthors[0].id, userId: testUser.id, status: BookRole.READ },
      { title: 'Foundation', genre: 'Sci-Fi', authorId: savedAuthors[1].id, userId: testUser.id, status: BookRole.READ },
      { title: 'Foundation and Empire', genre: 'Sci-Fi', authorId: savedAuthors[1].id, userId: testUser.id, status: BookRole.READ },
      { title: 'Neuromancer', genre: 'Cyberpunk', authorId: savedAuthors[2].id, userId: testUser.id, status: BookRole.READ },
      { title: 'Count Zero', genre: 'Cyberpunk', authorId: savedAuthors[2].id, userId: testUser.id, status: BookRole.READ },
      { title: 'Do Androids Dream of Electric Sheep?', genre: 'Sci-Fi', authorId: savedAuthors[3].id, userId: testUser.id, status: BookRole.READ },
      { title: 'Ubik', genre: 'Sci-Fi', authorId: savedAuthors[3].id, userId: testUser.id, status: BookRole.READ },
      { title: 'The Left Hand of Darkness', genre: 'Sci-Fi', authorId: savedAuthors[4].id, userId: testUser.id, status: BookRole.READ },
    ];
    const savedBooks = await bookRepository.save(bookRepository.create(booksData));
    console.log(`✅ ${savedBooks.length} Books created`);

    // 6. Associazioni Book-Tag
    const bookTagsData = [
      { bookId: savedBooks[0].id, tagId: savedTags[0].id }, // Dune -> Sci-Fi
      { bookId: savedBooks[0].id, tagId: savedTags[2].id }, // Dune -> Classics
      { bookId: savedBooks[0].id, tagId: savedTags[3].id }, // Dune -> Space Opera
      { bookId: savedBooks[5].id, tagId: savedTags[1].id }, // Neuromancer -> Cyberpunk
      { bookId: savedBooks[5].id, tagId: savedTags[4].id }, // Neuromancer -> Dystopian
      { bookId: savedBooks[7].id, tagId: savedTags[1].id }, // Do Androids... -> Cyberpunk
    ];
    await bookTagRepository.save(bookTagRepository.create(bookTagsData));
    console.log('✅ BookTags associations created');

    // 7. Creazione Archi del Grafo (10 BookConnection)
    const connectionsData = [
      { sourceBookId: savedBooks[0].id, discoveredBookId: savedBooks[1].id, discoveryMethod: 'Direct Sequel' },
      { sourceBookId: savedBooks[1].id, discoveredBookId: savedBooks[2].id, discoveryMethod: 'Direct Sequel' },
      { sourceBookId: savedBooks[0].id, discoveredBookId: savedBooks[3].id, discoveryMethod: 'Influenced by' },
      { sourceBookId: savedBooks[3].id, discoveredBookId: savedBooks[4].id, discoveryMethod: 'Direct Sequel' },
      { sourceBookId: savedBooks[5].id, discoveredBookId: savedBooks[6].id, discoveryMethod: 'Sprawl Trilogy' },
      { sourceBookId: savedBooks[5].id, discoveredBookId: savedBooks[7].id, discoveryMethod: 'Theme Similarity' },
      { sourceBookId: savedBooks[7].id, discoveredBookId: savedBooks[8].id, discoveryMethod: 'Same Author' },
      { sourceBookId: savedBooks[0].id, discoveredBookId: savedBooks[9].id, discoveryMethod: 'Classic Sci-Fi Recommendation' },
      { sourceBookId: savedBooks[9].id, discoveredBookId: savedBooks[3].id, discoveryMethod: 'Worldbuilding Comparison' },
      { sourceBookId: savedBooks[8].id, discoveredBookId: savedBooks[5].id, discoveryMethod: 'Proto-Cyberpunk Connection' },
    ];
    await connectionRepository.save(connectionRepository.create(connectionsData));
    console.log(`✅ ${connectionsData.length} Graph connections created`);

    console.log('🚀 Database Seeding completed successfully!');
  } catch (error) {
    console.error('❌ Error during database seeding:', error);
  } finally {
    await dataSource.destroy();
  }
}

runSeed();