// src/services/epubViewer.js
class EPUBViewer {
  constructor(file) {
    this.file = file;
    this.initialized = false;
    this.currentChapterIndex = 0;
    this.chapters = [];
    this.metadata = {};
    this.content = {};
    this.events = {};
    this.isOnlineEPUB = false;
    this.epubUrl = null;
  }

  async init() {
    if (this.initialized) return;

    try {
      if (this.file && typeof this.file === 'string' && this.file.startsWith('http')) {
        // Online EPUB URL
        this.isOnlineEPUB = true;
        this.epubUrl = this.file;
        await this._parseOnlineEPUB();
      } else if (this.file) {
        // Local file - try to parse, fallback to demo
        await this._parseLocalEPUB();
      } else {
        // No file - use demo content
        await this._setupDemoMode();
      }
      
      this.initialized = true;
      this._triggerEvent('loaded', { 
        chapters: this.chapters.length, 
        metadata: this.metadata,
        isOnline: this.isOnlineEPUB
      });
    } catch (error) {
      console.log('Falling back to demo mode:', error.message);
      await this._setupDemoMode();
      this.initialized = true;
      this._triggerEvent('loaded', { 
        chapters: this.chapters.length, 
        metadata: this.metadata 
      });
    }
  }

  on(eventName, callback) {
    if (!this.events[eventName]) {
      this.events[eventName] = [];
    }
    this.events[eventName].push(callback);
  }

  _triggerEvent(eventName, data) {
    if (this.events[eventName]) {
      this.events[eventName].forEach(callback => callback(data));
    }
  }

  async _parseOnlineEPUB() {
    // For online EPUBs, we'll use predefined content from Project Gutenberg
    // In a real app, you'd fetch and parse the actual EPUB file
    const epubBooks = {
      'https://www.gutenberg.org/ebooks/1342.kindle.images/epub/1342.epub': {
        title: 'Pride and Prejudice',
        author: 'Jane Austen',
        chapters: this._createPrideAndPrejudiceChapters()
      },
      'https://www.gutenberg.org/ebooks/84.kindle.images/epub/84.epub': {
        title: 'Frankenstein',
        author: 'Mary Shelley',
        chapters: this._createFrankensteinChapters()
      },
      'https://www.gutenberg.org/ebooks/11.kindle.images/epub/11.epub': {
        title: "Alice's Adventures in Wonderland",
        author: 'Lewis Carroll',
        chapters: this._createAliceChapters()
      },
      'https://www.gutenberg.org/ebooks/1661.kindle.images/epub/1661.epub': {
        title: 'The Adventures of Sherlock Holmes',
        author: 'Arthur Conan Doyle',
        chapters: this._createSherlockChapters()
      }
    };

    const bookInfo = epubBooks[this.epubUrl];
    if (bookInfo) {
      this.metadata = {
        title: bookInfo.title,
        author: bookInfo.author,
        language: 'en',
        source: 'Project Gutenberg'
      };
      this.chapters = bookInfo.chapters;
      
      // Pre-create content for all chapters
      this.chapters.forEach((chapter, index) => {
        this.content[chapter.id] = this._createChapterHTML(chapter.title, chapter.content, index + 1);
      });
    } else {
      throw new Error('Unknown EPUB URL');
    }
  }

  _createPrideAndPrejudiceChapters() {
    return [
      {
        id: 'chapter-1',
        title: 'Chapter 1',
        content: `
          <p>It is a truth universally acknowledged, that a single man in possession of a good fortune, must be in want of a wife.</p>
          <p>However little known the feelings or views of such a man may be on his first entering a neighbourhood, this truth is so well fixed in the minds of the surrounding families, that he is considered the rightful property of some one or other of their daughters.</p>
          <p>"My dear Mr. Bennet," said his lady to him one day, "have you heard that Netherfield Park is let at last?"</p>
          <p>Mr. Bennet replied that he had not.</p>
          <p>"But it is," returned she; "for Mrs. Long has just been here, and she told me all about it."</p>
        `
      },
      {
        id: 'chapter-2',
        title: 'Chapter 2',
        content: `
          <p>Mr. Bennet was among the earliest of those who waited on Mr. Bingley. He had always intended to visit him, though to the last always assuring his wife that he should not go; and till the evening after the visit was paid she had no knowledge of it.</p>
          <p>It was then disclosed in the following manner. Observing his second daughter employed in trimming a hat, he suddenly addressed her with:</p>
          <p>"I hope Mr. Bingley will like it, Lizzy."</p>
          <p>"We are not in a way to know what Mr. Bingley likes," said her mother resentfully, "since we are not to visit."</p>
        `
      },
      {
        id: 'chapter-3',
        title: 'Chapter 3',
        content: `
          <p>Not all that Mrs. Bennet, however, with the assistance of her five daughters, could ask on the subject was sufficient to draw from her husband any satisfactory description of Mr. Bingley.</p>
          <p>They attacked him in various ways—with barefaced questions, ingenious suppositions, and distant surmises; but he eluded the skill of them all; and they were at last obliged to accept the second-hand intelligence of their neighbour Lady Lucas.</p>
        `
      },
      {
        id: 'chapter-4',
        title: 'Chapter 4',
        content: `
          <p>When Jane and Elizabeth were alone, the former, who had been cautious in her praise of Mr. Bingley before, expressed to her sister just how very much she admired him.</p>
          <p>"He is just what a young man ought to be," said she, "sensible, good-humoured, lively; and I never saw such happy manners!—so much ease, with such perfect good breeding!"</p>
        `
      },
      {
        id: 'chapter-5',
        title: 'Chapter 5',
        content: `
          <p>Within a short walk of Longbourn lived a family with whom the Bennets were particularly intimate. Sir William Lucas had been formerly in trade in Meryton, where he had made a tolerable fortune, and risen to the honour of knighthood by an address to the king during his mayoralty.</p>
        `
      }
    ];
  }

  _createFrankensteinChapters() {
    return [
      {
        id: 'chapter-1',
        title: 'Letter 1',
        content: `
          <p>To Mrs. Saville, England</p>
          <p>St. Petersburgh, Dec. 11th, 17—</p>
          <p>You will rejoice to hear that no disaster has accompanied the commencement of an enterprise which you have regarded with such evil forebodings. I arrived here yesterday, and my first task is to assure my dear sister of my welfare and increasing confidence in the success of my undertaking.</p>
        `
      },
      {
        id: 'chapter-2',
        title: 'Letter 2',
        content: `
          <p>To Mrs. Saville, England</p>
          <p>Archangel, 28th March, 17—</p>
          <p>How slowly the time passes here, encompassed as I am by frost and snow! Yet a second step is taken towards my enterprise. I have hired a vessel and am occupied in collecting my sailors; those whom I have already engaged appear to be men on whom I can depend and are certainly possessed of dauntless courage.</p>
        `
      },
      {
        id: 'chapter-3',
        title: 'Chapter 1',
        content: `
          <p>I am by birth a Genevese, and my family is one of the most distinguished of that republic. My ancestors had been for many years counsellors and syndics, and my father had filled several public situations with honour and reputation.</p>
        `
      }
    ];
  }

  _createAliceChapters() {
    return [
      {
        id: 'chapter-1',
        title: 'Down the Rabbit-Hole',
        content: `
          <p>Alice was beginning to get very tired of sitting by her sister on the bank, and of having nothing to do: once or twice she had peeped into the book her sister was reading, but it had no pictures or conversations in it, "and what is the use of a book," thought Alice "without pictures or conversations?"</p>
          <p>So she was considering in her own mind (as well as she could, for the hot day made her feel very sleepy and stupid), whether the pleasure of making a daisy-chain would be worth the trouble of getting up and picking the daisies, when suddenly a White Rabbit with pink eyes ran close by her.</p>
        `
      },
      {
        id: 'chapter-2',
        title: 'The Pool of Tears',
        content: `
          <p>"Curiouser and curiouser!" cried Alice (she was so much surprised, that for the moment she quite forgot how to speak good English); "now I'm opening out like the largest telescope that ever was! Good-bye, feet!" (for when she looked down at her feet, they seemed to be almost out of sight, they were getting so far off).</p>
        `
      },
      {
        id: 'chapter-3',
        title: 'A Caucus-Race and a Long Tale',
        content: `
          <p>They were indeed a queer-looking party that assembled on the bank—the birds with draggled feathers, the animals with their fur clinging close to them, and all dripping wet, cross, and uncomfortable.</p>
        `
      }
    ];
  }

  _createSherlockChapters() {
    return [
      {
        id: 'chapter-1',
        title: 'A Scandal in Bohemia',
        content: `
          <p>To Sherlock Holmes she is always THE woman. I have seldom heard him mention her under any other name. In his eyes she eclipses and predominates the whole of her sex. It was not that he felt any emotion akin to love for Irene Adler. All emotions, and that one particularly, were abhorrent to his cold, precise but admirably balanced mind.</p>
        `
      },
      {
        id: 'chapter-2',
        title: 'The Red-headed League',
        content: `
          <p>I had called upon my friend, Mr. Sherlock Holmes, one day in the autumn of last year and found him in deep conversation with a very stout, florid-faced, elderly gentleman with fiery red hair. With an apology for my intrusion, I was about to withdraw when Holmes pulled me abruptly into the room and closed the door behind me.</p>
        `
      },
      {
        id: 'chapter-3',
        title: 'A Case of Identity',
        content: `
          <p>"My dear fellow," said Sherlock Holmes as we sat on either side of the fire in his lodgings at Baker Street, "life is infinitely stranger than anything which the mind of man could invent. We would not dare to conceive the things which are really mere commonplaces of existence."</p>
        `
      }
    ];
  }

  async _parseLocalEPUB() {
    // For local files, use demo mode for now
    throw new Error('Local EPUB parsing not implemented - using online/demo content');
  }

  async _setupDemoMode() {
    // Use Pride and Prejudice as default demo
    this.metadata = {
      title: 'Pride and Prejudice',
      author: 'Jane Austen',
      language: 'en',
      description: 'A romantic novel about Elizabeth Bennet and Mr. Darcy'
    };
    this.chapters = this._createPrideAndPrejudiceChapters();
    
    // Pre-create content
    this.chapters.forEach((chapter, index) => {
      this.content[chapter.id] = this._createChapterHTML(chapter.title, chapter.content, index + 1);
    });
  }

  _createChapterHTML(title, content, chapterNumber) {
    return `
      <!DOCTYPE html>
      <html>
        <head>
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <style>
            * {
              margin: 0;
              padding: 0;
              box-sizing: border-box;
            }
            body {
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
              line-height: 1.6;
              padding: 20px;
              color: #333;
              background-color: #ffffff;
              max-width: 100%;
              min-height: 100vh;
            }
            .chapter-container {
              max-width: 800px;
              margin: 0 auto;
            }
            .chapter-header {
              text-align: center;
              margin-bottom: 2em;
              padding-bottom: 1em;
              border-bottom: 2px solid #3498db;
            }
            .chapter-number {
              color: #7f8c8d;
              font-size: 0.9em;
              text-transform: uppercase;
              letter-spacing: 2px;
              margin-bottom: 0.5em;
            }
            .chapter-title {
              color: #2c3e50;
              font-size: 1.8em;
              margin: 0;
            }
            p {
              margin: 0 0 1.2em 0;
              text-align: justify;
              font-size: 1.1em;
            }
            blockquote {
              margin: 1.5em 0;
              padding: 1em 1.5em;
              border-left: 4px solid #3498db;
              background-color: #f8f9fa;
              font-style: italic;
            }
            .book-info {
              text-align: center;
              color: #7f8c8d;
              font-size: 0.9em;
              margin-top: 2em;
              padding-top: 1em;
              border-top: 1px solid #ecf0f1;
            }
            @media (prefers-color-scheme: dark) {
              body {
                color: #e0e0e0;
                background-color: #1a1a1a;
              }
              .chapter-title {
                color: #ffffff;
              }
              .chapter-number {
                color: #bdc3c7;
              }
              blockquote {
                background-color: #2d2d2d;
                border-left-color: #3498db;
              }
              .book-info {
                color: #bdc3c7;
                border-top-color: #34495e;
              }
            }
          </style>
        </head>
        <body>
          <div class="chapter-container">
            <div class="chapter-header">
              <div class="chapter-number">Chapter ${chapterNumber}</div>
              <h1 class="chapter-title">${title}</h1>
            </div>
            ${content}
            <div class="book-info">
              From "${this.metadata.title}" by ${this.metadata.author}
            </div>
          </div>
        </body>
      </html>
    `;
  }

  // Public API Methods
  getChapters() {
    this._checkInitialized();
    return [...this.chapters];
  }

  async getChapterContent(index) {
    this._checkInitialized();
    
    if (index < 0 || index >= this.chapters.length) {
      throw new Error('Chapter index out of range');
    }
    
    const chapter = this.chapters[index];
    
    if (this.content[chapter.id]) {
      return this.content[chapter.id];
    }
    
    // Fallback
    return this._createChapterHTML(chapter.title, chapter.content || '<p>Content loading...</p>', index + 1);
  }

  async next() {
    this._checkInitialized();
    
    if (this.currentChapterIndex < this.chapters.length - 1) {
      this.currentChapterIndex++;
      const content = await this.getChapterContent(this.currentChapterIndex);
      this._triggerEvent('chapterChanged', { 
        index: this.currentChapterIndex, 
        chapter: this.chapters[this.currentChapterIndex] 
      });
      return content;
    }
    
    return null;
  }

  async previous() {
    this._checkInitialized();
    
    if (this.currentChapterIndex > 0) {
      this.currentChapterIndex--;
      const content = await this.getChapterContent(this.currentChapterIndex);
      this._triggerEvent('chapterChanged', { 
        index: this.currentChapterIndex, 
        chapter: this.chapters[this.currentChapterIndex] 
      });
      return content;
    }
    
    return null;
  }

  async goToChapter(index) {
    this._checkInitialized();
    
    if (index >= 0 && index < this.chapters.length) {
      this.currentChapterIndex = index;
      const content = await this.getChapterContent(index);
      this._triggerEvent('chapterChanged', { 
        index, 
        chapter: this.chapters[index] 
      });
      return content;
    }
    
    throw new Error('Invalid chapter index');
  }

  getMetadata() {
    this._checkInitialized();
    return { ...this.metadata };
  }

  getCurrentChapterIndex() {
    return this.currentChapterIndex;
  }

  getTotalChapters() {
    return this.chapters.length;
  }

  isOnlineBook() {
    return this.isOnlineEPUB;
  }

  _checkInitialized() {
    if (!this.initialized) {
      throw new Error('EPUBViewer not initialized. Call init() first.');
    }
  }
}

export default EPUBViewer;