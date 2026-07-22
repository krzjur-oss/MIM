import React, { useState, useEffect, useMemo, useRef } from 'react';
import ReactMarkdown from 'react-markdown';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  BookOpen, 
  Plus, 
  Search, 
  Trash2, 
  RotateCcw, 
  Bookmark, 
  Volume2, 
  VolumeX,
  Play,
  Pause,
  Tv, 
  Edit, 
  ChevronRight, 
  ChevronLeft, 
  CheckSquare, 
  Square, 
  FileText, 
  Sun, 
  Moon, 
  Sparkles, 
  Compass, 
  Sliders, 
  Maximize, 
  Minimize,
  Award,
  BookMarked,
  Info,
  Layers,
  HelpCircle,
  Image,
  Link,
  Copy,
  Download,
  Upload,
  Printer,
  AlertCircle,
  X,
  Check,
  Bold,
  Italic,
  List,
  Heading,
  Users,
  GraduationCap,
  Calendar
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  Cell
} from 'recharts';
import { Chapter, QuizQuestion, ThemeType, StudentProgress, Student } from './types';
import { DEFAULT_CHAPTERS } from './defaultChapters';
import DrawingOverlay from './components/DrawingOverlay';
import ChapterManager from './components/ChapterManager';

const getChildrenText = (children: React.ReactNode): string => {
  if (!children) return '';
  if (typeof children === 'string') return children;
  if (Array.isArray(children)) return children.map(getChildrenText).join('');
  if (typeof children === 'object' && children !== null && 'props' in children) {
    return getChildrenText((children as any).props.children);
  }
  return '';
};

const getCleanId = (text: string): string => {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/ł/g, 'l')
    .replace(/Ł/g, 'l')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
};

const removeReadingSymbols = (text: string): string => {
  if (!text) return '';
  // Usuwa serduszka, świece, symbole religijne, książki, gwiazdki i inne dekoracyjne emoji
  return text.replace(/[\u{1F300}-\u{1F9FF}\u{2700}-\u{27BF}\u{2600}-\u{26FF}\u{1F000}-\u{1F9FF}\u{1F1E0}-\u{1F1FF}\u{1F600}-\u{1F64F}\u{1F680}-\u{1F6FF}\u{2190}-\u{21FF}\u{2B50}\u{2934}\u{25AA}\u{25FE}]/gu, '').trim();
};

const cleanMarkdownForSpeech = (markdown: string): string => {
  return markdown
    .replace(/#+\s+/g, '') // remove headings hashes
    .replace(/[*_`~]/g, '') // remove markdown characters
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1') // replace links with anchor text
    .replace(/-\s+/g, '') // remove bullet points dashes
    .replace(/^\s*[\d+]\.\s+/gm, '') // remove numbered lists digits
    .replace(/!\[[^\]]*\]\([^)]*\)/g, '') // remove image tags
    .replace(/\s+/g, ' ') // collapse extra whitespace
    .trim();
};

const ROMAN_NUMERALS: Record<string, number> = {
  'I': 1,
  'II': 2,
  'III': 3,
  'IV': 4,
  'V': 5,
  'VI': 6,
  'VII': 7,
  'VIII': 8,
  'IX': 9,
  'X': 10
};

const getGroupOrder = (groupName: string): number => {
  if (!groupName) return 999;
  if (groupName === 'Wprowadzenie') return -1;
  if (groupName.startsWith('Rozdział ')) {
    const match = groupName.match(/^Rozdział\s+([I|V|X]+)/i);
    if (match && match[1]) {
      const roman = match[1].toUpperCase();
      if (ROMAN_NUMERALS[roman] !== undefined) {
        return ROMAN_NUMERALS[roman];
      }
    }
  }
  return 999;
};

const sortChapters = (list: Chapter[]): Chapter[] => {
  return [...list].sort((a, b) => {
    // 1. Keep intro-multibook always first
    if (a.id === 'intro-multibook') return -1;
    if (b.id === 'intro-multibook') return 1;

    // 2. Sort by subject (Wstęp/Podręcznik first)
    const subA = a.subject || '';
    const subB = b.subject || '';
    if (subA !== subB) {
      if (subA === 'Podręcznik / Instrukcja') return -1;
      if (subB === 'Podręcznik / Instrukcja') return 1;
      return subA.localeCompare(subB);
    }

    // 3. Sort by school type
    const typeA = a.schoolType || '';
    const typeB = b.schoolType || '';
    if (typeA !== typeB) {
      return typeA.localeCompare(typeB);
    }

    // 4. Sort by grade
    const gradeA = a.grade || '';
    const gradeB = b.grade || '';
    if (gradeA !== gradeB) {
      return gradeA.localeCompare(gradeB);
    }

    // 5. Sort by chapter group (Roman numerals or name)
    const grA = a.chapterGroup || '';
    const grB = b.chapterGroup || '';
    if (grA !== grB) {
      const ordA = getGroupOrder(grA);
      const ordB = getGroupOrder(grB);
      if (ordA !== ordB) {
        return ordA - ordB;
      }
      return grA.localeCompare(grB);
    }

    // 6. Sort by lesson number inside the group
    if (a.lessonNumber !== undefined && b.lessonNumber !== undefined) {
      return a.lessonNumber - b.lessonNumber;
    }

    // Keep relative order
    return 0;
  });
};

// Preset lists of high-quality educational illustrations from Unsplash for our interactive photo galleries
const PRESET_SUBJECT_GALLERIES: Record<string, { label: string; url: string }[]> = {
  'Biologia': [
    { label: '🧬 Mikroskop i komórka', url: 'https://images.unsplash.com/photo-1576086213369-97a306d36557?w=600&auto=format&fit=crop&q=60' },
    { label: '🧬 Helisa DNA / Genetyka', url: 'https://images.unsplash.com/photo-1530026405186-ed1ea0ac7a63?w=600&auto=format&fit=crop&q=60' },
    { label: '🩻 Lekcja anatomii', url: 'https://images.unsplash.com/photo-1559757175-0eb30cd8c063?w=600&auto=format&fit=crop&q=60' },
    { label: '🍃 Fotosynteza i liść', url: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=600&auto=format&fit=crop&q=60' },
  ],
  'Przyroda': [
    { label: '🍃 Fotosynteza i liść', url: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=600&auto=format&fit=crop&q=60' },
    { label: '🦌 Leśna fauna', url: 'https://images.unsplash.com/photo-1484406566174-9da000fda645?w=600&auto=format&fit=crop&q=60' },
    { label: '🏔️ Hydrologia / Rzeka', url: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=600&auto=format&fit=crop&q=60' },
  ],
  'Chemia': [
    { label: '🧪 Probówki i reakcje', url: 'https://images.unsplash.com/photo-1532187863486-abf9d39d66e8?w=600&auto=format&fit=crop&q=60' },
    { label: '🧪 Kolorowe roztwory', url: 'https://images.unsplash.com/photo-1603126857599-f6e157fa2fe6?w=600&auto=format&fit=crop&q=60' },
    { label: '⚛️ Struktura atomu', url: 'https://images.unsplash.com/photo-1507668077129-56e32842fceb?w=600&auto=format&fit=crop&q=60' },
    { label: '🧪 Sprzęt laboratoryjny', url: 'https://images.unsplash.com/photo-1518152006812-edab29b069ac?w=600&auto=format&fit=crop&q=60' },
  ],
  'Fizyka': [
    { label: '🌌 Kosmos i planety', url: 'https://images.unsplash.com/photo-1462331940025-496dfbfc7564?w=600&auto=format&fit=crop&q=60' },
    { label: '🔌 Elektronika / Płytka', url: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=600&auto=format&fit=crop&q=60' },
    { label: '🌈 Pryzmat i światło', url: 'https://images.unsplash.com/photo-1506784983877-45594efa4cbe?w=600&auto=format&fit=crop&q=60' },
    { label: '🌌 Gwiazdy i mgławica', url: 'https://images.unsplash.com/photo-1506318137071-a8e063b4bec0?w=600&auto=format&fit=crop&q=60' },
  ],
  'Geografia': [
    { label: '🌍 Globus ziemski', url: 'https://images.unsplash.com/photo-1614730321146-b6fa6a46bcb4?w=600&auto=format&fit=crop&q=60' },
    { label: '🛰️ Ziemia z kosmosu', url: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=600&auto=format&fit=crop&q=60' },
    { label: '🗺️ Mapa fizyczna świata', url: 'https://images.unsplash.com/photo-1524661135-423995f22d0b?w=600&auto=format&fit=crop&q=60' },
    { label: '🏔️ Rzeźba gór i szczyty', url: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=600&auto=format&fit=crop&q=60' },
  ],
  'Informatyka': [
    { label: '💻 Kod źródłowy / Program', url: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=600&auto=format&fit=crop&q=60' },
    { label: '💻 Komputer i technologia', url: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=600&auto=format&fit=crop&q=60' },
    { label: '☁️ Chmura obliczeniowa', url: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&auto=format&fit=crop&q=60' },
  ],
  'Historia': [
    { label: '🏛️ Koloseum i Rzym', url: 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=600&auto=format&fit=crop&q=60' },
    { label: '📑 Stare księgi i zwoje', url: 'https://images.unsplash.com/photo-1474366521946-c3d4b507abf2?w=600&auto=format&fit=crop&q=60' },
    { label: '🏺 Archeologia i wazy', url: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=600&auto=format&fit=crop&q=60' },
    { label: '🏰 Średniowieczny zamek', url: 'https://images.unsplash.com/photo-1533105079780-92b9be482077?w=600&auto=format&fit=crop&q=60' },
  ],
  'Matematyka': [
    { label: '📐 Tablica z równaniami', url: 'https://images.unsplash.com/photo-1509228468518-180dd4864904?w=600&auto=format&fit=crop&q=60' },
    { label: '📐 Geometria i cyrkiel', url: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=600&auto=format&fit=crop&q=60' },
    { label: '📐 Liczby i wykresy', url: 'https://images.unsplash.com/photo-1518152006812-edab29b069ac?w=600&auto=format&fit=crop&q=60' },
  ],
};

const DEFAULT_SUBJECT_GALLERY = [
  { label: '🖍️ Przybory i kredki', url: 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=600&auto=format&fit=crop&q=60' },
  { label: '📓 Biurko i książki', url: 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=600&auto=format&fit=crop&q=60' },
  { label: '📚 Szkolna biblioteka', url: 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=600&auto=format&fit=crop&q=60' },
  { label: '📝 Notatnik i długopis', url: 'https://images.unsplash.com/photo-1517842645767-c639042777db?w=600&auto=format&fit=crop&q=60' },
];

export default function App() {
  // Custom Elegant Notifications & Confirm Modal
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);
  const [confirmModal, setConfirmModal] = useState<{ message: string; title: string; onConfirm: () => void } | null>(null);

  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
    setToast({ message, type });
  };

  const showConfirm = (message: string, onConfirm: () => void, title = 'Potwierdzenie') => {
    setConfirmModal({ message, title, onConfirm });
  };

  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => {
        setToast(null);
      }, 3500);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  // 1. Chapters database state
  const [chapters, setChaptersInternal] = useState<Chapter[]>(() => {
    const saved = localStorage.getItem('multibook_chapters');
    if (saved) {
      try {
        const parsed = JSON.parse(saved) as Chapter[];
        if (Array.isArray(parsed) && parsed.length > 0) {
          // Sync with DEFAULT_CHAPTERS to ensure all default chapters are present and updated
          const synced = [...parsed];
          DEFAULT_CHAPTERS.forEach((defaultCh) => {
            const index = synced.findIndex((c) => c.id === defaultCh.id);
            if (index === -1) {
              synced.push(defaultCh);
            } else {
              synced[index] = {
                ...synced[index],
                ...defaultCh,
              };
            }
          });
          return sortChapters(synced);
        }
      } catch (e) {
        console.error("Błąd wczytywania rozdziałów z localStorage", e);
      }
    }
    return sortChapters(DEFAULT_CHAPTERS);
  });

  const setChapters = (val: Chapter[] | ((prev: Chapter[]) => Chapter[])) => {
    if (typeof val === 'function') {
      setChaptersInternal((prev) => sortChapters(val(prev)));
    } else {
      setChaptersInternal(sortChapters(val));
    }
  };

  // Save chapters to LocalStorage when changed
  useEffect(() => {
    localStorage.setItem('multibook_chapters', JSON.stringify(chapters));
  }, [chapters]);

  // 2. Active Chapter Selection State
  const [currentChapterId, setCurrentChapterId] = useState<string>(() => {
    return chapters[0]?.id || 'intro-multibook';
  });

  const activeChapter = useMemo(() => {
    return chapters.find((c) => c.id === currentChapterId) || chapters[0];
  }, [chapters, currentChapterId]);

  const activeCategoryChapters = useMemo(() => {
    if (!activeChapter) return [];
    const filtered = chapters.filter((c) => {
      const sameSubject = (c.subject || '') === (activeChapter.subject || '');
      const sameGrade = (c.grade || '') === (activeChapter.grade || '');
      const sameSchoolType = (c.schoolType || '') === (activeChapter.schoolType || '');
      const sameGroup = (c.chapterGroup || '') === (activeChapter.chapterGroup || '');
      return sameSubject && sameGrade && sameSchoolType && sameGroup;
    });
    return filtered.length > 0 ? filtered : [activeChapter];
  }, [chapters, activeChapter]);

  // Tryb Czytania State (Hides sidebar and header, filters out symbols like hearts, candles, etc.)
  const [isReadingMode, setIsReadingMode] = useState<boolean>(() => {
    return localStorage.getItem('multibook_reading_mode') === 'true';
  });

  useEffect(() => {
    localStorage.setItem('multibook_reading_mode', isReadingMode.toString());
  }, [isReadingMode]);

  // Table of Contents State and Logic
  const [isTocExpanded, setIsTocExpanded] = useState<boolean>(true);
  const [activeHeadingId, setActiveHeadingId] = useState<string>('');

  const tocItems = useMemo(() => {
    if (!activeChapter || !activeChapter.content) return [];
    const parsedContent = isReadingMode ? removeReadingSymbols(activeChapter.content) : activeChapter.content;
    const lines = parsedContent.split('\n');
    const items: { id: string; text: string; level: number }[] = [];
    const seenIds = new Set<string>();

    for (const line of lines) {
      const match = line.match(/^(#{1,3})\s+(.*)$/);
      if (match) {
        const level = match[1].length;
        const rawText = match[2].trim();
        // Remove basic markdown syntax for bold/italic/code so text is clean
        const cleanText = rawText
          .replace(/\*\*([^*]+)\*\*/g, '$1')
          .replace(/\*([^*]+)\*/g, '$1')
          .replace(/`([^`]+)`/g, '$1')
          .trim();

        let baseId = getCleanId(cleanText);
        if (!baseId) {
          baseId = `naglowek-${items.length}`;
        }

        let id = baseId;
        let counter = 1;
        while (seenIds.has(id)) {
          id = `${baseId}-${counter}`;
          counter++;
        }
        seenIds.add(id);

        items.push({ id, text: cleanText, level });
      }
    }
    return items;
  }, [activeChapter, isReadingMode]);

  const sections = useMemo(() => {
    if (!activeChapter || !activeChapter.content) return [];
    
    const parsedContent = isReadingMode ? removeReadingSymbols(activeChapter.content) : activeChapter.content;
    const lines = parsedContent.split('\n');
    
    const parsedSections: { title: string; content: string[] }[] = [];
    let currentSection: { title: string; content: string[] } = { title: '', content: [] };
    
    for (const line of lines) {
      const headingMatch = line.match(/^(#{1,6})\s+(.*)$/);
      if (headingMatch) {
        if (currentSection.content.length > 0 || currentSection.title) {
          parsedSections.push(currentSection);
        }
        currentSection = {
          title: headingMatch[2].trim()
            .replace(/\*\*([^*]+)\*\*/g, '$1')
            .replace(/\*([^*]+)\*/g, '$1')
            .replace(/`([^`]+)`/g, '$1')
            .trim(),
          content: [line]
        };
      } else {
        currentSection.content.push(line);
      }
    }
    if (currentSection.content.length > 0 || currentSection.title) {
      parsedSections.push(currentSection);
    }
    
    return parsedSections.map((sec, idx) => {
      const markdown = sec.content.join('\n');
      return {
        id: `sec-${idx}`,
        title: sec.title || 'Wprowadzenie',
        markdown: markdown,
        plainText: cleanMarkdownForSpeech(markdown)
      };
    });
  }, [activeChapter, isReadingMode]);

  const scrollToSection = (id: string) => {
    let element = document.getElementById(id);
    const container = document.getElementById('multibook-reader-scroll-viewport');
    
    // Inteligentny fallback: jeśli element nie został znaleziony po dokładnym ID,
    // szukamy nagłówków h1, h2, h3 i porównujemy ich znormalizowane teksty.
    if (!element) {
      const headings = document.querySelectorAll('#multibook-rendered-markdown-content h1, #multibook-rendered-markdown-content h2, #multibook-rendered-markdown-content h3');
      for (const h of Array.from(headings)) {
        const text = h.textContent || '';
        const cleanTextId = getCleanId(text);
        if (cleanTextId === id || id.startsWith(cleanTextId) || cleanTextId.startsWith(id)) {
          element = h as HTMLElement;
          break;
        }
      }
    }

    if (element && container) {
      const containerRect = container.getBoundingClientRect();
      const elementRect = element.getBoundingClientRect();
      const offsetTop = elementRect.top - containerRect.top + container.scrollTop - 24;
      
      container.scrollTo({
        top: offsetTop,
        behavior: 'smooth'
      });
    } else if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Scroll spy to highlight the currently viewed section
  useEffect(() => {
    if (!activeChapter || tocItems.length === 0) {
      setActiveHeadingId('');
      return;
    }

    const scrollContainer = document.getElementById('multibook-reader-scroll-viewport');
    if (!scrollContainer) return;

    const handleScroll = () => {
      const containerScrollTop = scrollContainer.scrollTop;
      let activeId = '';

      const headings = Array.from(document.querySelectorAll('#multibook-rendered-markdown-content h1, #multibook-rendered-markdown-content h2, #multibook-rendered-markdown-content h3'));

      for (let i = 0; i < tocItems.length; i++) {
        const item = tocItems[i];
        let el = document.getElementById(item.id);

        if (!el) {
          // Fallback do wyszukania po znormalizowanym tekście
          el = headings.find(h => {
            const cleanTextId = getCleanId(h.textContent || '');
            return cleanTextId === item.id || item.id.startsWith(cleanTextId) || cleanTextId.startsWith(item.id);
          }) as HTMLElement | null;
        }

        if (el) {
          const offsetTop = el.offsetTop;
          if (offsetTop <= containerScrollTop + 80) {
            activeId = item.id;
          } else {
            break;
          }
        }
      }

      if (containerScrollTop < 50 && tocItems.length > 0) {
        activeId = tocItems[0].id;
      }

      setActiveHeadingId(activeId);
    };

    scrollContainer.addEventListener('scroll', handleScroll, { passive: true });
    // Run once after initial render/tick to set active heading
    const initialTimer = setTimeout(handleScroll, 150);

    return () => {
      scrollContainer.removeEventListener('scroll', handleScroll);
      clearTimeout(initialTimer);
    };
  }, [activeChapter, tocItems]);

  // 9. Personal Notes Drawer collapse state (on right side)
  const [isNotesOpen, setIsNotesOpen] = useState(false);
  const [isNotesFullscreen, setIsNotesFullscreen] = useState(false);

  // Handle escape key to close fullscreen notes
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isNotesFullscreen) {
        setIsNotesFullscreen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isNotesFullscreen]);

  // 3. User Progress: Bookmarks, Notes, Completed
  const [progress, setProgress] = useState<StudentProgress>(() => {
    const saved = localStorage.getItem('multibook_progress');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error("Błąd wczytywania postępu z localStorage", e);
      }
    }
    return {
      completedChapters: [],
      bookmarkedChapters: [],
      chapterNotes: {}
    };
  });

  // Save progress to LocalStorage when changed
  useEffect(() => {
    localStorage.setItem('multibook_progress', JSON.stringify(progress));
  }, [progress]);

  // 3.2 Debounced Personal Notes State and Handlers
  const [localNoteText, setLocalNoteText] = useState('');
  const [isNotesSaving, setIsNotesSaving] = useState(false);
  const prevActiveChapterIdRef = useRef(activeChapter.id);

  // Synchronize localNoteText when active chapter changes or underlying note is loaded/updated (e.g. from file import)
  useEffect(() => {
    // If we are changing chapters, save the old chapter's note first!
    if (prevActiveChapterIdRef.current !== activeChapter.id) {
      const prevId = prevActiveChapterIdRef.current;
      const savedNote = progress.chapterNotes[prevId] || '';
      if (localNoteText !== savedNote) {
        setProgress((prev) => {
          if (prev.chapterNotes[prevId] === localNoteText) return prev;
          return {
            ...prev,
            chapterNotes: { ...prev.chapterNotes, [prevId]: localNoteText }
          };
        });
      }
      prevActiveChapterIdRef.current = activeChapter.id;
    }
    setLocalNoteText(progress.chapterNotes[activeChapter.id] || '');
  }, [activeChapter.id, progress.chapterNotes[activeChapter.id]]);

  // Helper function to save directly
  const saveNoteToProgress = (text: string) => {
    setProgress((prev) => {
      if (prev.chapterNotes[activeChapter.id] === text) return prev;
      return {
        ...prev,
        chapterNotes: { ...prev.chapterNotes, [activeChapter.id]: text }
      };
    });
  };

  // Debounce effect to autosave notes
  useEffect(() => {
    const savedNote = progress.chapterNotes[activeChapter.id] || '';
    if (localNoteText === savedNote) {
      setIsNotesSaving(false);
      return;
    }

    setIsNotesSaving(true);
    const timer = setTimeout(() => {
      saveNoteToProgress(localNoteText);
      setIsNotesSaving(false);
    }, 800); // 800ms debounce

    return () => clearTimeout(timer);
  }, [localNoteText, activeChapter.id]);

  // Flush notes on drawer close
  useEffect(() => {
    if (!isNotesOpen) {
      const savedNote = progress.chapterNotes[activeChapter.id] || '';
      if (localNoteText !== savedNote) {
        saveNoteToProgress(localNoteText);
      }
    }
  }, [isNotesOpen]);

  // Before unload handler to flush notes to localStorage immediately
  useEffect(() => {
    const handleBeforeUnload = () => {
      const savedNote = progress.chapterNotes[activeChapter.id] || '';
      if (localNoteText !== savedNote) {
        const updatedNotes = { ...progress.chapterNotes, [activeChapter.id]: localNoteText };
        localStorage.setItem('multibook_progress', JSON.stringify({ ...progress, chapterNotes: updatedNotes }));
      }
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [localNoteText, activeChapter.id, progress]);

  // Insert markdown helper for editor formatting
  const insertMarkdown = (syntax: 'bold' | 'italic' | 'list' | 'link' | 'heading') => {
    const textarea = document.getElementById('fullscreen-notes-textarea') as HTMLTextAreaElement;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const text = textarea.value;
    const selectedText = text.substring(start, end);

    let replacement = '';
    let cursorOffset = 0;

    switch (syntax) {
      case 'bold':
        replacement = `**${selectedText || 'tekst'}**`;
        cursorOffset = selectedText ? replacement.length : 2;
        break;
      case 'italic':
        replacement = `*${selectedText || 'tekst'}*`;
        cursorOffset = selectedText ? replacement.length : 1;
        break;
      case 'list':
        replacement = `\n- ${selectedText || 'element'}`;
        cursorOffset = replacement.length;
        break;
      case 'link':
        replacement = `[${selectedText || 'tekst'}](https://example.com)`;
        cursorOffset = selectedText ? replacement.length : 1;
        break;
      case 'heading':
        replacement = `\n### ${selectedText || 'Nagłówek'}`;
        cursorOffset = replacement.length;
        break;
    }

    const newValue = text.substring(0, start) + replacement + text.substring(end);
    setLocalNoteText(newValue);

    // Keep focus and selection range
    setTimeout(() => {
      textarea.focus();
      if (!selectedText) {
        textarea.setSelectionRange(start + cursorOffset, start + cursorOffset);
      } else {
        textarea.setSelectionRange(start, start + replacement.length);
      }
    }, 0);
  };

  // Download notes helper function (.md file generation)
  const handleDownloadNotes = () => {
    if (!localNoteText.trim()) {
      showToast("Twoje notatki są puste! Napisz coś najpierw.", "error");
      return;
    }

    const headerContent = `# Notatki z lekcji: ${activeChapter.title}\n` +
      `Przedmiot: ${activeChapter.subject}\n` +
      `Wygenerowano: ${new Date().toLocaleDateString('pl-PL')} o ${new Date().toLocaleTimeString('pl-PL')}\n` +
      `=========================================\n\n`;

    const fullContent = headerContent + localNoteText;
    const blob = new Blob([fullContent], { type: 'text/markdown;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');

    // Clean filename: lowercase, replace Polish characters, replace spaces with dashes
    const safeTitle = activeChapter.title
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '') // remove diacritics
      .replace(/ł/g, 'l')
      .replace(/Ł/g, 'l')
      .replace(/[^a-z0-9]+/g, '-') // replace non-alphanumeric with dashes
      .replace(/^-+|-+$/g, ''); // trim dashes

    link.href = url;
    link.setAttribute('download', `notatki-${safeTitle || 'lekcja'}.md`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    showToast("Notatki zostały pobrane jako plik .md!", "success");
  };

  // Download notes helper function (beautiful printable PDF/HTML document)
  const handleDownloadNotesPDF = () => {
    if (!localNoteText.trim()) {
      showToast("Twoje notatki są puste! Napisz coś najpierw.", "error");
      return;
    }

    const iframe = document.createElement('iframe');
    iframe.style.position = 'fixed';
    iframe.style.right = '0';
    iframe.style.bottom = '0';
    iframe.style.width = '0';
    iframe.style.height = '0';
    iframe.style.border = 'none';
    iframe.style.visibility = 'hidden';
    document.body.appendChild(iframe);

    // Escape HTML to prevent injection and breakages
    const escapeHtml = (text: string) => {
      return text
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;");
    };

    // Inline format replacements
    const inlineFormat = (text: string) => {
      let html = escapeHtml(text);
      // Bold: **text**
      html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
      // Italic: *text*
      html = html.replace(/\*(.*?)\*/g, '<em>$1</em>');
      // Underline: __text__
      html = html.replace(/__(.*?)__/g, '<u>$1</u>');
      // Strikethrough: ~~text~~
      html = html.replace(/~~(.*?)~~/g, '<del>$1</del>');
      // Inline Code: `code`
      html = html.replace(/`(.*?)`/g, '<code class="pdf-code">$1</code>');
      return html;
    };

    // A robust simple markdown parser for the notes
    const parseMarkdown = (md: string) => {
      const lines = md.split('\n');
      let html = '';
      let inList = false;
      let inOrderedList = false;

      for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        const trimmed = line.trim();

        // Handle list endings
        if (inList && !trimmed.startsWith('- ') && !trimmed.startsWith('* ')) {
          html += '</ul>\n';
          inList = false;
        }
        if (inOrderedList && !trimmed.match(/^\d+\.\s/)) {
          html += '</ol>\n';
          inOrderedList = false;
        }

        if (trimmed.startsWith('# ')) {
          html += `<h1 class="pdf-h1">${escapeHtml(trimmed.substring(2))}</h1>\n`;
        } else if (trimmed.startsWith('## ')) {
          html += `<h2 class="pdf-h2">${escapeHtml(trimmed.substring(3))}</h2>\n`;
        } else if (trimmed.startsWith('### ')) {
          html += `<h3 class="pdf-h3">${escapeHtml(trimmed.substring(4))}</h3>\n`;
        } else if (trimmed.startsWith('#### ')) {
          html += `<h4 class="pdf-h4">${escapeHtml(trimmed.substring(5))}</h4>\n`;
        } else if (trimmed.startsWith('===') || trimmed.startsWith('---')) {
          html += '<hr class="pdf-hr" />\n';
        } else if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
          if (!inList) {
            html += '<ul class="pdf-ul">\n';
            inList = true;
          }
          const content = trimmed.substring(2);
          html += `  <li class="pdf-li">${inlineFormat(content)}</li>\n`;
        } else if (trimmed.match(/^\d+\.\s/)) {
          if (!inOrderedList) {
            html += '<ol class="pdf-ol">\n';
            inOrderedList = true;
          }
          const content = trimmed.replace(/^\d+\.\s/, '');
          html += `  <li class="pdf-li">${inlineFormat(content)}</li>\n`;
        } else if (trimmed.startsWith('> ')) {
          html += `<blockquote class="pdf-blockquote">${inlineFormat(trimmed.substring(2))}</blockquote>\n`;
        } else if (!trimmed) {
          html += '<p class="pdf-space">&nbsp;</p>\n';
        } else {
          html += `<p class="pdf-p">${inlineFormat(line)}</p>\n`;
        }
      }

      if (inList) html += '</ul>\n';
      if (inOrderedList) html += '</ol>\n';

      return html;
    };

    const parsedNotesHtml = parseMarkdown(localNoteText);

    const docContent = `
      <!DOCTYPE html>
      <html lang="pl">
      <head>
        <meta charset="utf-8">
        <title>Notatki z lekcji - ${escapeHtml(activeChapter.title)}</title>
        <style>
          @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Playfair+Display:ital,wght@0,700;0,900;1,700&display=swap');
          
          @page {
            size: A4;
            margin: 20mm;
          }
          
          body {
            font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
            color: #1e293b;
            line-height: 1.6;
            margin: 0;
            padding: 0;
            font-size: 11pt;
            background-color: #ffffff;
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
          }

          .pdf-container {
            max-width: 100%;
          }

          .header-card {
            border-bottom: 2px solid #e2e8f0;
            padding-bottom: 18px;
            margin-bottom: 24px;
          }

          .app-badge {
            font-size: 8pt;
            text-transform: uppercase;
            letter-spacing: 0.1em;
            color: #d97706;
            font-weight: 800;
            margin-bottom: 6px;
          }

          h1.main-title {
            font-family: 'Playfair Display', Georgia, serif;
            font-size: 24pt;
            font-weight: 900;
            margin: 0 0 12px 0;
            color: #0f172a;
            line-height: 1.25;
          }

          .meta-grid {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 10px;
            margin-top: 10px;
          }

          .meta-item {
            font-size: 9.5pt;
            color: #475569;
          }

          .meta-label {
            font-weight: 700;
            color: #64748b;
          }

          .content {
            margin-top: 15px;
          }

          .pdf-h1, .pdf-h2, .pdf-h3, .pdf-h4 {
            color: #0f172a;
            font-weight: 700;
            margin-top: 20pt;
            margin-bottom: 8pt;
            page-break-after: avoid;
          }

          .pdf-h1 {
            font-size: 16pt;
            border-bottom: 1px solid #f1f5f9;
            padding-bottom: 4px;
          }

          .pdf-h2 { font-size: 14pt; }
          .pdf-h3 { font-size: 12pt; }
          .pdf-h4 { font-size: 11pt; }

          .pdf-p {
            margin: 0 0 10pt 0;
            text-align: justify;
          }

          .pdf-ul, .pdf-ol {
            margin: 0 0 10pt 0;
            padding-left: 20pt;
          }

          .pdf-li {
            margin-bottom: 4pt;
          }

          .pdf-blockquote {
            margin: 0 0 12pt 0;
            padding: 8pt 14pt;
            border-left: 4px solid #cbd5e1;
            background-color: #f8fafc;
            color: #475569;
            font-style: italic;
          }

          .pdf-code {
            font-family: monospace;
            background-color: #f1f5f9;
            padding: 1px 4px;
            border-radius: 4px;
            font-size: 9.5pt;
          }

          .pdf-hr {
            border: none;
            border-top: 1px solid #e2e8f0;
            margin: 20pt 0;
          }

          .pdf-space {
            margin: 0;
            height: 8pt;
          }

          .footer {
            position: fixed;
            bottom: 0;
            left: 0;
            right: 0;
            border-top: 1px solid #f1f5f9;
            padding-top: 8px;
            font-size: 8pt;
            color: #94a3b8;
            text-align: center;
          }

          @media print {
            body {
              background-color: #ffffff;
            }
            .header-card {
              border-bottom-color: #cbd5e1;
            }
          }
        </style>
      </head>
      <body>
        <div class="pdf-container">
          <div class="header-card">
            <div class="app-badge">Interaktywny Multibook • Podsumowanie lekcji</div>
            <h1 class="main-title">${escapeHtml(activeChapter.title)}</h1>
            <div class="meta-grid">
              <div class="meta-item">
                <span class="meta-label">Przedmiot:</span> ${escapeHtml(activeChapter.subject)}
              </div>
              <div class="meta-item">
                <span class="meta-label">Klasa / Grupa:</span> ${escapeHtml(activeChapter.grade || 'Wszystkie')}
              </div>
              <div class="meta-item">
                <span class="meta-label">Rozdział:</span> ${escapeHtml(activeChapter.chapterGroup || 'Główny')}
              </div>
              <div class="meta-item">
                <span class="meta-label">Data wydruku:</span> ${new Date().toLocaleDateString('pl-PL')} ${new Date().toLocaleTimeString('pl-PL', { hour: '2-digit', minute: '2-digit' })}
              </div>
            </div>
          </div>
          
          <div class="content">
            ${parsedNotesHtml}
          </div>

          <div class="footer">
            Generowane automatycznie z Interaktywnego Multibooka • KrzJur@gmail.com
          </div>
        </div>

        <script>
          window.onload = function() {
            setTimeout(function() {
              window.print();
              setTimeout(function() {
                window.parent.postMessage('close-print-iframe', '*');
              }, 500);
            }, 300);
          };
        </script>
      </body>
      </html>
    `;

    const doc = iframe.contentDocument || (iframe.contentWindow && iframe.contentWindow.document);
    if (doc) {
      doc.open();
      doc.write(docContent);
      doc.close();
    }

    const handleMessage = (event: MessageEvent) => {
      if (event.data === 'close-print-iframe') {
        if (document.body.contains(iframe)) {
          document.body.removeChild(iframe);
        }
        window.removeEventListener('message', handleMessage);
      }
    };
    window.addEventListener('message', handleMessage);

    showToast("Generowanie podglądu wydruku / PDF...", "success");
  };

  // 3.5 Text-To-Speech (TTS) State and handlers - Per-section reader
  const [speakingSectionId, setSpeakingSectionId] = useState<string | null>(null);
  const [isSpeakingPaused, setIsSpeakingPaused] = useState(false);

  // Stop speaking on chapter change or unmount
  useEffect(() => {
    if (window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
    setSpeakingSectionId(null);
    setIsSpeakingPaused(false);
  }, [currentChapterId]);

  useEffect(() => {
    return () => {
      if (window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  const handleToggleSectionSpeech = (sectionId: string, textToSpeak: string) => {
    if (!window.speechSynthesis) {
      showToast("Twoja przeglądarka nie obsługuje syntezy mowy.", "error");
      return;
    }

    if (speakingSectionId === sectionId) {
      if (isSpeakingPaused) {
        window.speechSynthesis.resume();
        setIsSpeakingPaused(false);
        showToast("Wznowiono czytanie części 🔊", "success");
      } else {
        window.speechSynthesis.pause();
        setIsSpeakingPaused(true);
        showToast("Wstrzymano czytanie części ⏸️", "info");
      }
    } else {
      window.speechSynthesis.cancel(); // Stop any pending speech

      // Remove any emojis or symbols that don't need reading
      const cleanText = isReadingMode ? removeReadingSymbols(textToSpeak) : textToSpeak;
      const utterance = new SpeechSynthesisUtterance(cleanText);
      
      // Find a Polish voice
      const voices = window.speechSynthesis.getVoices();
      const plVoice = voices.find(voice => voice.lang.startsWith('pl') || voice.lang.includes('PL'));
      if (plVoice) {
        utterance.voice = plVoice;
      }
      utterance.lang = 'pl-PL';
      utterance.rate = 0.95; // Slightly slower for better educational focus

      utterance.onend = () => {
        setSpeakingSectionId(null);
        setIsSpeakingPaused(false);
      };

      utterance.onerror = (e) => {
        // 'interrupted' or 'canceled' are standard when we stop or switch the reader
        const errType = String(e.error);
        if (errType !== 'interrupted' && errType !== 'canceled' && errType !== 'cancelled') {
          console.warn("TTS speech warning:", e.error, e);
        }
        setSpeakingSectionId(null);
        setIsSpeakingPaused(false);
      };

      window.speechSynthesis.speak(utterance);
      setSpeakingSectionId(sectionId);
      setIsSpeakingPaused(false);
      showToast("Rozpoczęto czytanie wybranej części 🔊", "success");
    }
  };

  const handleStopSectionSpeech = () => {
    if (window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
    setSpeakingSectionId(null);
    setIsSpeakingPaused(false);
    showToast("Zatrzymano czytanie części 🛑", "info");
  };

  // 4. Customizing layout text, line-height, dyslexic fonts, themes
  const [theme, setTheme] = useState<ThemeType>(() => {
    return (localStorage.getItem('multibook_theme') as ThemeType) || 'light';
  });

  useEffect(() => {
    localStorage.setItem('multibook_theme', theme);
  }, [theme]);

  const [fontSize, setFontSize] = useState<number>(() => {
    return Number(localStorage.getItem('multibook_fontsize')) || 105; // base percentage %
  });

  useEffect(() => {
    localStorage.setItem('multibook_fontsize', fontSize.toString());
  }, [fontSize]);

  const [lineHeight, setLineHeight] = useState<'normal' | 'relaxed' | 'loose'>(() => {
    return (localStorage.getItem('multibook_lineheight') as 'normal' | 'relaxed' | 'loose') || 'relaxed';
  });

  useEffect(() => {
    localStorage.setItem('multibook_lineheight', lineHeight);
  }, [lineHeight]);

  // 5. Open/close manager modal
  const [isCreatorOpen, setIsCreatorOpen] = useState(false);
  const [editingChapter, setEditingChapter] = useState<Chapter | null>(null);

  // 5a. Teacher Classes & Realization Tracker States
  const [teacherClasses, setTeacherClasses] = useState<string[]>(() => {
    const saved = localStorage.getItem('multibook_teacher_classes');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      } catch (e) {}
    }
    return ['Klasa 4A', 'Klasa 4B', 'Klasa 5A', 'Klasa 6A', 'Klasa 7A', 'Klasa 8B'];
  });

  const [realizations, setRealizations] = useState<{ className: string; chapterId: string; timestamp: number }[]>(() => {
    const saved = localStorage.getItem('multibook_realizations');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed;
      } catch (e) {}
    }
    return [];
  });

  // Curriculum configuration states (stores which chapters/lessons are assigned to which classes)
  const [classChapters, setClassChapters] = useState<Record<string, string[]>>(() => {
    const saved = localStorage.getItem('multibook_class_chapters');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (typeof parsed === 'object' && parsed !== null) return parsed;
      } catch (e) {}
    }
    
    // Default fallback: assign all existing chapter IDs to each initial teacher class
    const defaults: Record<string, string[]> = {};
    const initialClasses = ['Klasa 4A', 'Klasa 4B', 'Klasa 5A', 'Klasa 6A', 'Klasa 7A', 'Klasa 8B'];
    const allIds = DEFAULT_CHAPTERS.map(c => c.id);
    initialClasses.forEach(cls => {
      defaults[cls] = [...allIds];
    });
    return defaults;
  });

  useEffect(() => {
    localStorage.setItem('multibook_class_chapters', JSON.stringify(classChapters));
  }, [classChapters]);

  const [teacherActiveSubTab, setTeacherActiveSubTab] = useState<'students' | 'curriculum'>('students');
  const [selectedTeacherClass, setSelectedTeacherClass] = useState<string>('');
  const [curriculumSearchQuery, setCurriculumSearchQuery] = useState('');
  const [curriculumSubjectFilter, setCurriculumSubjectFilter] = useState('Wszystkie');

  const [templateWeekday, setTemplateWeekday] = useState<number>(1); // 1 = Monday, 2 = Tuesday, ..., 7 = Sunday
  const [templateTime, setTemplateTime] = useState<string>("08:00");
  const [templateStartDate, setTemplateStartDate] = useState<string>("2026-06-22");
  const [templateSelectedChapters, setTemplateSelectedChapters] = useState<string[]>([]);
  const [isTemplateGeneratorOpen, setIsTemplateGeneratorOpen] = useState<boolean>(false);

  useEffect(() => {
    if (selectedTeacherClass) {
      const assigned = classChapters[selectedTeacherClass] ?? [];
      setTemplateSelectedChapters(assigned);
    } else {
      setTemplateSelectedChapters([]);
    }
  }, [selectedTeacherClass, classChapters]);

  const [rightDrawerTab, setRightDrawerTab] = useState<'notes' | 'classes'>('notes');
  const [newClassNameInput, setNewClassNameInput] = useState('');
  const [expandedClassDetails, setExpandedClassDetails] = useState<Record<string, boolean>>({});
  const [currentCalendarDate, setCurrentCalendarDate] = useState(() => new Date(2026, 5, 21)); // June 21, 2026

  // State variables for our custom chapter notes photo gallery & link pasting
  const [chapterGalleryImages, setChapterGalleryImages] = useState<Record<string, string[]>>(() => {
    const saved = localStorage.getItem('multibook_chapter_gallery_images');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (typeof parsed === 'object' && parsed !== null) return parsed;
      } catch (e) {}
    }
    return {};
  });

  const [newImageUrlInput, setNewImageUrlInput] = useState('');
  const [selectedLightboxImage, setSelectedLightboxImage] = useState<string | null>(null);

  // Save custom gallery images to LocalStorage
  useEffect(() => {
    localStorage.setItem('multibook_chapter_gallery_images', JSON.stringify(chapterGalleryImages));
  }, [chapterGalleryImages]);

  // Teacher Panel State & Default Students list
  const DEFAULT_STUDENTS: Student[] = [
    {
      id: 'stud-1',
      name: 'Anna Nowak',
      className: 'Klasa 4A',
      completedChapters: ['intro-multibook', 'biology-cell'],
      bookmarkedChapters: ['biology-cell'],
      chapterNotes: {
        'intro-multibook': 'Mój pierwszy dzień z Multibookiem. Bardzo podoba mi się rysowanie po ekranie!',
        'biology-cell': 'Notatki z biologii: Komórka ma jądro komórkowe, mitochondrium (daje energię!) i błonę.'
      },
      quizAttempts: {
        'intro-multibook': { correct: 2, total: 2 }
      }
    },
    {
      id: 'stud-2',
      name: 'Jan Kowalski',
      className: 'Klasa 4A',
      completedChapters: ['intro-multibook'],
      bookmarkedChapters: [],
      chapterNotes: {
        'intro-multibook': 'Podręcznik offline działa szybko. Przetestowałem quizy.'
      },
      quizAttempts: {
        'intro-multibook': { correct: 1, total: 2 }
      }
    },
    {
      id: 'stud-3',
      name: 'Marek Wiśniewski',
      className: 'Klasa 4B',
      completedChapters: ['biology-cell'],
      bookmarkedChapters: ['biology-cell'],
      chapterNotes: {
        'biology-cell': 'Komórka roślinna różni się od zwierzęcej obecnością ściany komórkowej i chloroplastów.'
      },
      quizAttempts: {}
    },
    {
      id: 'stud-4',
      name: 'Zofia Kamińska',
      className: 'Klasa 7A',
      completedChapters: ['intro-multibook', 'biology-cell', 'space-mars'],
      bookmarkedChapters: [],
      chapterNotes: {
        'space-mars': 'Mars to czwarta planeta od Słońca. Nazywa się ją Czerwoną Planetą z powodu tlenku żelaza.'
      },
      quizAttempts: {
        'intro-multibook': { correct: 2, total: 2 },
        'space-mars': { correct: 2, total: 2 }
      }
    },
    {
      id: 'stud-5',
      name: 'Kacper Zieliński',
      className: 'Klasa 4B',
      completedChapters: [],
      bookmarkedChapters: [],
      chapterNotes: {},
      quizAttempts: {}
    },
    {
      id: 'stud-6',
      name: 'Piotr Wiśniewski',
      className: 'Klasa 6A',
      completedChapters: ['religia-6-lekcja-1'],
      bookmarkedChapters: ['religia-6-lekcja-1'],
      chapterNotes: {
        'religia-6-lekcja-1': 'Bóg stworzył świat z miłości i obdarzył nas pięknem przyrody.'
      },
      quizAttempts: {
        'religia-6-lekcja-1': { correct: 2, total: 2 }
      }
    },
    {
      id: 'stud-7',
      name: 'Julia Malinowska',
      className: 'Klasa 6A',
      completedChapters: [],
      bookmarkedChapters: [],
      chapterNotes: {},
      quizAttempts: {}
    },
    {
      id: 'stud-8',
      name: 'Michał Jankowski',
      className: 'Klasa 5A',
      completedChapters: ['religia-5-lekcja-1'],
      bookmarkedChapters: ['religia-5-lekcja-1'],
      chapterNotes: {
        'religia-5-lekcja-1': 'Bóg pragnie naszego szczęścia i poszukuje człowieka z miłości.'
      },
      quizAttempts: {
        'religia-5-lekcja-1': { correct: 2, total: 2 }
      }
    },
    {
      id: 'stud-9',
      name: 'Katarzyna Wójcik',
      className: 'Klasa 5A',
      completedChapters: [],
      bookmarkedChapters: [],
      chapterNotes: {},
      quizAttempts: {}
    }
  ];

  const [activeMainTab, setActiveMainTab] = useState<'lessons' | 'teacher-panel'>('lessons');

  const [students, setStudents] = useState<Student[]>(() => {
    const saved = localStorage.getItem('multibook_students');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed;
      } catch (e) {}
    }
    return DEFAULT_STUDENTS;
  });

  useEffect(() => {
    localStorage.setItem('multibook_students', JSON.stringify(students));
  }, [students]);

  // Save teacher classes and realizations to LocalStorage
  useEffect(() => {
    localStorage.setItem('multibook_teacher_classes', JSON.stringify(teacherClasses));
  }, [teacherClasses]);

  useEffect(() => {
    localStorage.setItem('multibook_realizations', JSON.stringify(realizations));
  }, [realizations]);

  // Teacher Panel State variables
  const [teacherSearchQuery, setTeacherSearchQuery] = useState('');
  const [teacherClassFilter, setTeacherClassFilter] = useState('Wszystkie');
  const [teacherSortOption, setTeacherSortOption] = useState<'name-asc' | 'progress-desc' | 'progress-asc'>('name-asc');
  const [selectedStudentDetailId, setSelectedStudentDetailId] = useState<string | null>(null);
  const [editingStudentId, setEditingStudentId] = useState<string | null>(null);
  const [studentNameInput, setStudentNameInput] = useState('');
  const [studentClassInput, setStudentClassInput] = useState('');
  const [bulkClassSelect, setBulkClassSelect] = useState('');
  const [bulkChapterSelect, setBulkChapterSelect] = useState('');
  const [tempTeacherRemarks, setTempTeacherRemarks] = useState<Record<string, string>>({});

  // Teacher Panel Helper Functions
  const handleSaveStudent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!studentNameInput.trim() || !studentClassInput.trim()) {
      showToast("Wpisz imię i nazwisko oraz wybierz lub wpisz klasę!", "error");
      return;
    }

    const targetClass = studentClassInput.trim();
    if (!teacherClasses.includes(targetClass)) {
      setTeacherClasses(prev => [...prev, targetClass]);
      setClassChapters(prev => {
        if (prev[targetClass]) return prev;
        return {
          ...prev,
          [targetClass]: chapters.map(c => c.id)
        };
      });
    }

    if (editingStudentId) {
      setStudents(prev => prev.map(s => s.id === editingStudentId ? {
        ...s,
        name: studentNameInput.trim(),
        className: targetClass
      } : s));
      showToast("Zaktualizowano dane ucznia!", "success");
    } else {
      const newStud: Student = {
        id: `stud-${Date.now()}`,
        name: studentNameInput.trim(),
        className: targetClass,
        completedChapters: [],
        bookmarkedChapters: [],
        chapterNotes: {},
        quizAttempts: {}
      };
      setStudents(prev => [...prev, newStud]);
      showToast("Dodano nowego ucznia!", "success");
    }

    setEditingStudentId(null);
    setStudentNameInput('');
    setStudentClassInput('');
  };

  const handleStartEditStudent = (student: Student) => {
    setEditingStudentId(student.id);
    setStudentNameInput(student.name);
    setStudentClassInput(student.className);
    // Scroll to form or focus
    const formEl = document.getElementById('student-edit-form');
    if (formEl) formEl.scrollIntoView({ behavior: 'smooth' });
  };

  const handleDeleteStudent = (id: string) => {
    const student = students.find(s => s.id === id);
    if (!student) return;

    showConfirm(
      `Czy na pewno chcesz usunąć ucznia ${student.name}? Wszystkie jego indywidualne postępy, odpowiedzi z quizów oraz notatki zostaną bezpowrotnie skasowane.`,
      () => {
        setStudents(prev => prev.filter(s => s.id !== id));
        if (selectedStudentDetailId === id) setSelectedStudentDetailId(null);
        showToast(`Usunięto ucznia ${student.name}.`, "info");
      },
      "Usuń ucznia"
    );
  };

  const handleGenerateMockStudents = () => {
    showConfirm(
      "Czy na pewno chcesz wygenerować 5 przykładowych uczniów z realistycznymi postępami, ocenami i notatkami? Uczniowie zostaną dodani do Twojej obecnej listy.",
      () => {
        setStudents(prev => {
          const existingIds = new Set(prev.map(s => s.id));
          const mockToAdd = DEFAULT_STUDENTS.filter(s => !existingIds.has(s.id));
          if (mockToAdd.length === 0) {
            const newMocks = DEFAULT_STUDENTS.map(s => ({
              ...s,
              id: `stud-mock-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
              name: `${s.name} (Przykładowy)`
            }));
            return [...prev, ...newMocks];
          }
          return [...prev, ...mockToAdd];
        });
        showToast("Wygenerowano przykładowych uczniów z postępami!", "success");
      },
      "Generuj przykładowe dane"
    );
  };

  const handleToggleStudentChapterCompletion = (studentId: string, chapterId: string) => {
    setStudents(prev => prev.map(s => {
      if (s.id === studentId) {
        const isCompleted = s.completedChapters.includes(chapterId);
        const completedChapters = isCompleted
          ? s.completedChapters.filter(id => id !== chapterId)
          : [...s.completedChapters, chapterId];
        return { ...s, completedChapters };
      }
      return s;
    }));
    showToast("Zaktualizowano postęp lekcji u ucznia!", "success");
  };

  const handleUpdateStudentRemarks = (studentId: string, remarks: string) => {
    setStudents(prev => prev.map(s => {
      if (s.id === studentId) {
        return { ...s, teacherRemarks: remarks };
      }
      return s;
    }));
    showToast("Zapisano notatkę nauczyciela!", "success");
  };

  const handleBulkMarkChapter = () => {
    if (!bulkClassSelect || !bulkChapterSelect) {
      showToast("Wybierz klasę oraz temat lekcji!", "error");
      return;
    }

    setStudents(prev => prev.map(s => {
      if (s.className === bulkClassSelect) {
        if (!s.completedChapters.includes(bulkChapterSelect)) {
          return { ...s, completedChapters: [...s.completedChapters, bulkChapterSelect] };
        }
      }
      return s;
    }));

    const alreadyRealized = realizations.some(r => r.className === bulkClassSelect && r.chapterId === bulkChapterSelect);
    if (!alreadyRealized) {
      setRealizations(prev => [...prev, {
        className: bulkClassSelect,
        chapterId: bulkChapterSelect,
        timestamp: Date.now()
      }]);
    }

    showToast(`Pomyślnie zrealizowano temat dla całej klasy ${bulkClassSelect}!`, "success");
    setBulkChapterSelect('');
  };

  const handleBulkResetProgress = () => {
    if (!bulkClassSelect) {
      showToast("Wybierz klasę, dla której chcesz zresetować dane!", "error");
      return;
    }

    showConfirm(
      `Czy na pewno chcesz wyczyścić postępy, notatki oraz wyniki quizów WSZYSTKICH uczniów w klasie ${bulkClassSelect}? Tej operacji nie można cofnąć.`,
      () => {
        setStudents(prev => prev.map(s => {
          if (s.className === bulkClassSelect) {
            return {
              ...s,
              completedChapters: [],
              bookmarkedChapters: [],
              chapterNotes: {},
              quizAttempts: {}
            };
          }
          return s;
        }));

        setRealizations(prev => prev.filter(r => r.className !== bulkClassSelect));
        showToast(`Wyczyszczono dane klasy ${bulkClassSelect}!`, "info");
      },
      "Resetuj postępy klasy"
    );
  };

  // Computed lists for teacher panel
  const uniqueStudentClasses = useMemo(() => {
    const set = new Set(students.map(s => s.className));
    teacherClasses.forEach(c => set.add(c));
    return Array.from(set);
  }, [students, teacherClasses]);

  const filteredStudents = useMemo(() => {
    const list = students.filter(s => {
      const matchesSearch = s.name.toLowerCase().includes(teacherSearchQuery.toLowerCase());
      const matchesClass = teacherClassFilter === 'Wszystkie' || s.className === teacherClassFilter;
      return matchesSearch && matchesClass;
    });

    return [...list].sort((a, b) => {
      if (teacherSortOption === 'name-asc') {
        return a.name.localeCompare(b.name, 'pl');
      } else if (teacherSortOption === 'progress-desc') {
        const pctA = chapters.length > 0 ? a.completedChapters.length / chapters.length : 0;
        const pctB = chapters.length > 0 ? b.completedChapters.length / chapters.length : 0;
        if (pctA !== pctB) return pctB - pctA;
        return a.name.localeCompare(b.name, 'pl');
      } else if (teacherSortOption === 'progress-asc') {
        const pctA = chapters.length > 0 ? a.completedChapters.length / chapters.length : 0;
        const pctB = chapters.length > 0 ? b.completedChapters.length / chapters.length : 0;
        if (pctA !== pctB) return pctA - pctB;
        return a.name.localeCompare(b.name, 'pl');
      }
      return 0;
    });
  }, [students, teacherSearchQuery, teacherClassFilter, teacherSortOption, chapters]);

  const selectedDetailedStudent = useMemo(() => {
    return students.find(s => s.id === selectedStudentDetailId) || null;
  }, [students, selectedStudentDetailId]);

  // Helper classes for theme-compliant and legible buttons
  const getPrimaryBtnClass = () => {
    switch (theme) {
      case 'dark':
        return 'bg-amber-600 hover:bg-amber-500 text-white shadow-2xs';
      case 'sepia':
        return 'bg-[#433422] hover:bg-[#5C4533] text-[#fbf6ec] shadow-2xs border border-[#302418]';
      case 'blue':
        return 'bg-[#2c3e50] hover:bg-[#1e293b] text-white shadow-2xs';
      case 'dyslexic':
        return 'bg-[#1b1c1b] hover:bg-black text-white shadow-2xs';
      default: // light
        return 'bg-amber-600 hover:bg-amber-700 text-white shadow-2xs';
    }
  };

  const getEmeraldBtnClass = () => {
    switch (theme) {
      case 'dark':
        return 'bg-emerald-600 hover:bg-emerald-500 text-white';
      case 'sepia':
        return 'bg-emerald-800 hover:bg-emerald-900 text-[#fbf6ec] border border-emerald-900';
      case 'blue':
        return 'bg-emerald-600 hover:bg-emerald-700 text-white';
      case 'dyslexic':
        return 'bg-[#14421b] hover:bg-[#0c2e12] text-white';
      default: // light
        return 'bg-emerald-700 hover:bg-emerald-800 text-white';
    }
  };

  const getDangerBtnClass = () => {
    switch (theme) {
      case 'dark':
        return 'bg-rose-950/40 hover:bg-rose-950/60 text-rose-300 border border-rose-900/40';
      case 'sepia':
        return 'bg-[#ebdcb3]/30 hover:bg-[#ebdcb3]/50 text-red-900 border border-[#ebdcb3]';
      case 'blue':
        return 'bg-rose-100 hover:bg-rose-200 text-rose-900 border border-rose-200';
      case 'dyslexic':
        return 'bg-rose-100 hover:bg-rose-250 text-rose-950 border border-rose-300';
      default: // light
        return 'bg-rose-100 hover:bg-rose-200 text-rose-900 border border-rose-200';
    }
  };

  // Main Teacher Panel Dashboard UI builder
  const renderTeacherPanelDashboard = () => {
    const isDark = theme === 'dark';

    return (
      <div id="teacher-dashboard-container" className="flex-1 overflow-y-auto px-5 py-6 space-y-6">
        {/* Dashboard Top Row / Banner */}
        <div className={`p-5 rounded-2xl border transition-all duration-300 flex flex-col md:flex-row md:items-center md:justify-between gap-4 ${
          isDark ? 'bg-slate-900/60 border-slate-800' : 'bg-amber-50/40 border-amber-100'
        }`}>
          <div>
            <h2 className={`text-xl md:text-2xl font-black tracking-tight flex items-center gap-2 ${activeThemeConfig.h1}`}>
              <GraduationCap className="w-6 h-6 text-amber-600 shrink-0" />
              <span>Dedykowany Panel Nauczyciela 🏫</span>
            </h2>
            <p className="text-xs text-slate-500 mt-0.5 font-medium">
              Zbiorcze zarządzanie uczniami, postępami, realizacją tematów oraz podgląd notatek z jednego miejsca.
            </p>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <button
              id="generate-mock-students-btn"
              onClick={handleGenerateMockStudents}
              className={`px-3 py-1.5 font-extrabold text-xs rounded-xl flex items-center gap-1.5 cursor-pointer transition-all ${getPrimaryBtnClass()}`}
            >
              <Users className="w-4 h-4" />
              <span>Generuj przykładowych uczniów 👥</span>
            </button>
            <button
              id="lessons-view-back-btn"
              onClick={() => setActiveMainTab('lessons')}
              className={`px-3 py-1.5 font-extrabold text-xs rounded-xl flex items-center gap-1 cursor-pointer transition-all ${activeThemeConfig.galleryPresetBtn}`}
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Powrót do lekcji</span>
            </button>
          </div>
        </div>

        {/* Navigation sub-tabs within Teacher Panel */}
        <div className="flex border-b border-slate-200 dark:border-slate-800 gap-6">
          <button
            onClick={() => setTeacherActiveSubTab('students')}
            className={`px-3 py-2 text-xs font-black border-b-2 transition-all cursor-pointer flex items-center gap-1.5 ${
              teacherActiveSubTab === 'students'
                ? 'border-amber-600 text-amber-600 dark:text-amber-400'
                : 'border-transparent text-slate-400 hover:text-slate-600 dark:hover:text-slate-300'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Dziennik uczniów i postępy 👥</span>
          </button>
          <button
            onClick={() => {
              setTeacherActiveSubTab('curriculum');
              if (!selectedTeacherClass && teacherClasses.length > 0) {
                setSelectedTeacherClass(teacherClasses[0]);
              }
            }}
            className={`px-3 py-2 text-xs font-black border-b-2 transition-all cursor-pointer flex items-center gap-1.5 ${
              teacherActiveSubTab === 'curriculum'
                ? 'border-amber-600 text-amber-600 dark:text-amber-400'
                : 'border-transparent text-slate-400 hover:text-slate-600 dark:hover:text-slate-300'
            }`}
          >
            <GraduationCap className="w-4 h-4" />
            <span>Klasy i Programy nauczania 🏫</span>
          </button>
        </div>

        {teacherActiveSubTab === 'students' ? (
          <>
            {/* Overview Key Indicators */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className={`p-4 rounded-xl border ${isDark ? 'bg-slate-900/40 border-slate-800' : 'bg-white border-slate-200/60'} shadow-3xs`}>
            <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Liczba uczniów</span>
            <div className="text-2xl font-black text-amber-600 mt-1">{students.length}</div>
            <p className="text-[10px] text-slate-400 mt-0.5">Zarejestrowanych w systemie offline</p>
          </div>
          <div className={`p-4 rounded-xl border ${isDark ? 'bg-slate-900/40 border-slate-800' : 'bg-white border-slate-200/60'} shadow-3xs`}>
            <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Obsługiwane klasy</span>
            <div className="text-2xl font-black text-emerald-600 mt-1">{uniqueStudentClasses.length}</div>
            <p className="text-[10px] text-slate-400 mt-0.5">Klasy skonfigurowane w Multibooku</p>
          </div>
          <div className={`p-4 rounded-xl border ${isDark ? 'bg-slate-900/40 border-slate-800' : 'bg-white border-slate-200/60'} shadow-3xs`}>
            <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Średni postęp</span>
            <div className="text-2xl font-black text-blue-600 mt-1">
              {students.length > 0 
                ? Math.round((students.reduce((acc, s) => acc + s.completedChapters.length, 0) / (students.length * chapters.length || 1)) * 100)
                : 0}%
            </div>
            <p className="text-[10px] text-slate-400 mt-0.5">Zrealizowanych lekcji na jednego ucznia</p>
          </div>
        </div>

        {/* Bento Grid: Tools vs Search */}
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-5 items-start">
          
          {/* LEFT SIDEBAR: Add Student & Bulk Actions (col-span-4) */}
          <div className="xl:col-span-4 space-y-5">
            
            {/* Form: Add/Edit Student */}
            <div id="student-edit-form" className={`p-5 rounded-xl border ${isDark ? 'bg-slate-900/35 border-slate-800' : 'bg-white border-slate-200'} shadow-3xs`}>
              <h3 className="text-sm font-black text-slate-800 dark:text-slate-200 border-b pb-2 mb-4 flex items-center gap-2">
                <span className="p-1.5 bg-amber-500/10 text-amber-600 rounded-lg">✍️</span>
                <span>{editingStudentId ? 'Edytuj dane ucznia' : 'Dodaj nowego ucznia'}</span>
              </h3>
              <form onSubmit={handleSaveStudent} className="space-y-4">
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Imię i nazwisko</label>
                  <input
                    type="text"
                    value={studentNameInput}
                    onChange={(e) => setStudentNameInput(e.target.value)}
                    placeholder="np. Jan Kowalski"
                    className={`w-full p-2.5 rounded-lg border text-sm font-medium focus:ring-2 focus:ring-amber-500/20 focus:outline-none ${
                      isDark ? 'bg-slate-950 border-slate-800 text-white' : 'bg-slate-50 border-slate-200'
                    }`}
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Klasa</label>
                  <input
                    type="text"
                    value={studentClassInput}
                    onChange={(e) => setStudentClassInput(e.target.value)}
                    placeholder="np. Klasa 4A"
                    list="available-classes-list"
                    className={`w-full p-2.5 rounded-lg border text-sm font-medium focus:ring-2 focus:ring-amber-500/20 focus:outline-none ${
                      isDark ? 'bg-slate-950 border-slate-800 text-white' : 'bg-slate-50 border-slate-200'
                    }`}
                  />
                  <datalist id="available-classes-list">
                    {uniqueStudentClasses.map(c => (
                      <option key={c} value={c} />
                    ))}
                  </datalist>
                </div>
                
                <div className="flex items-center gap-2 pt-1">
                  <button
                    type="submit"
                    className={`flex-1 py-2.5 font-extrabold text-xs rounded-lg cursor-pointer transition-colors ${getPrimaryBtnClass()}`}
                  >
                    {editingStudentId ? 'Zapisz zmiany' : 'Utwórz konto ucznia'}
                  </button>
                  {editingStudentId && (
                    <button
                      type="button"
                      onClick={() => {
                        setEditingStudentId(null);
                        setStudentNameInput('');
                        setStudentClassInput('');
                      }}
                      className={`px-3 py-2.5 font-extrabold text-xs rounded-lg cursor-pointer transition-colors ${activeThemeConfig.galleryPresetBtn}`}
                    >
                      Anuluj
                    </button>
                  )}
                </div>
              </form>
            </div>

            {/* Bulk Actions Panel */}
            <div className={`p-5 rounded-xl border ${isDark ? 'bg-slate-900/35 border-slate-800' : 'bg-white border-slate-200'} shadow-3xs`}>
              <h3 className="text-sm font-black text-slate-800 dark:text-slate-200 border-b pb-2 mb-4 flex items-center gap-2">
                <span className="p-1.5 bg-emerald-500/10 text-emerald-600 rounded-lg">⚡</span>
                <span>Grupowa realizacja tematów</span>
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Wybierz klasę</label>
                  <select
                    value={bulkClassSelect}
                    onChange={(e) => setBulkClassSelect(e.target.value)}
                    className={`w-full p-2.5 rounded-lg border text-sm font-medium focus:ring-2 focus:ring-emerald-500/20 focus:outline-none ${
                      isDark ? 'bg-slate-950 border-slate-800 text-white' : 'bg-slate-50 border-slate-200'
                    }`}
                  >
                    <option value="">-- Wybierz klasę --</option>
                    {uniqueStudentClasses.map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Temat lekcji do zrealizowania</label>
                  <select
                    value={bulkChapterSelect}
                    onChange={(e) => setBulkChapterSelect(e.target.value)}
                    className={`w-full p-2.5 rounded-lg border text-sm font-medium focus:ring-2 focus:ring-emerald-500/20 focus:outline-none ${
                      isDark ? 'bg-slate-950 border-slate-800 text-white' : 'bg-slate-50 border-slate-200'
                    }`}
                  >
                    <option value="">-- Wybierz temat --</option>
                    {chapters.map(ch => (
                      <option key={ch.id} value={ch.id}>[{ch.subject}] {ch.title}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2 pt-2">
                  <button
                    onClick={handleBulkMarkChapter}
                    disabled={!bulkClassSelect || !bulkChapterSelect}
                    className={`w-full py-2 font-extrabold text-xs rounded-lg cursor-pointer disabled:opacity-45 disabled:cursor-not-allowed transition-colors ${getEmeraldBtnClass()}`}
                  >
                    Zrealizuj temat dla całej klasy 📚
                  </button>
                  <button
                    onClick={handleBulkResetProgress}
                    disabled={!bulkClassSelect}
                    className={`w-full py-2 font-extrabold text-xs rounded-lg cursor-pointer disabled:opacity-45 disabled:cursor-not-allowed transition-colors ${getDangerBtnClass()}`}
                  >
                    Wyczyść wszystkie dane klasy 🗑️
                  </button>
                </div>
              </div>
            </div>

          </div>

          {/* RIGHT MIDDLE CONTAINER: Student list & search (col-span-8) */}
          <div className="xl:col-span-8 space-y-5">
            
            {/* Search, Filter Bar */}
            <div className={`p-4 rounded-xl border ${isDark ? 'bg-slate-900/35 border-slate-800' : 'bg-white border-slate-200'} flex flex-col sm:flex-row gap-3 shadow-3xs`}>
              <div className="flex-1 relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
                <input
                  type="text"
                  value={teacherSearchQuery}
                  onChange={(e) => setTeacherSearchQuery(e.target.value)}
                  placeholder="Szukaj ucznia po imieniu..."
                  className={`w-full pl-9 pr-4 py-2.5 rounded-lg border text-xs font-semibold focus:ring-2 focus:ring-amber-500/20 focus:outline-none ${
                    isDark ? 'bg-slate-950 border-slate-800 text-white' : 'bg-slate-50 border-slate-200'
                  }`}
                />
              </div>
              <div className="w-full sm:w-48">
                <select
                  value={teacherClassFilter}
                  onChange={(e) => setTeacherClassFilter(e.target.value)}
                  className={`w-full p-2.5 rounded-lg border text-xs font-semibold focus:ring-2 focus:ring-amber-500/20 focus:outline-none ${
                    isDark ? 'bg-slate-950 border-slate-800 text-white' : 'bg-slate-50 border-slate-200'
                  }`}
                >
                  <option value="Wszystkie">Wszystkie klasy</option>
                  {uniqueStudentClasses.map(c => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>

              <div className="w-full sm:w-56">
                <select
                  value={teacherSortOption}
                  onChange={(e) => setTeacherSortOption(e.target.value as any)}
                  className={`w-full p-2.5 rounded-lg border text-xs font-semibold focus:ring-2 focus:ring-amber-500/20 focus:outline-none ${
                    isDark ? 'bg-slate-950 border-slate-800 text-white' : 'bg-slate-50 border-slate-200'
                  }`}
                >
                  <option value="name-asc">Sortuj: Imię (A-Z)</option>
                  <option value="progress-desc">Sortuj: Postęp (najpierw najwięcej ⬇️)</option>
                  <option value="progress-asc">Sortuj: Postęp (najpierw najmniej ⬆️)</option>
                </select>
              </div>
            </div>

            {/* Students List */}
            <div className="space-y-3">
              {filteredStudents.length === 0 ? (
                <div className={`p-10 text-center rounded-xl border ${isDark ? 'border-slate-800 bg-slate-900/10' : 'border-slate-200 bg-slate-50/50'}`}>
                  <p className="text-sm font-medium text-slate-500">Nie znaleziono uczniów spełniających kryteria.</p>
                  <p className="text-xs text-slate-400 mt-1">Użyj przycisku u góry, aby wygenerować fikcyjnych uczniów do testów.</p>
                </div>
              ) : (
                filteredStudents.map(student => {
                  const compCount = student.completedChapters.length;
                  const totalCount = chapters.length;
                  const pct = totalCount > 0 ? Math.round((compCount / totalCount) * 100) : 0;
                  const isSelected = selectedStudentDetailId === student.id;

                  // Compute score average
                  const quizKeys = Object.keys(student.quizAttempts);
                  const quizScoreStr = quizKeys.length > 0
                    ? `${quizKeys.length} quizów (średnia: ${Math.round((quizKeys.reduce((acc, k) => acc + (student.quizAttempts[k].correct / student.quizAttempts[k].total), 0) / quizKeys.length) * 100)}%)`
                    : 'Brak wykonanych quizów';

                  return (
                    <div 
                      key={student.id} 
                      className={`p-4 rounded-xl border transition-all ${
                        isSelected 
                          ? 'border-amber-500 bg-amber-50/10 shadow-xs' 
                          : isDark ? 'bg-slate-900/45 border-slate-800 hover:border-slate-700' : 'bg-white border-slate-200/80 hover:border-slate-300 shadow-3xs'
                      }`}
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-sm text-slate-800 dark:text-slate-100">{student.name}</span>
                            <span className="px-2 py-0.5 rounded text-[9px] font-extrabold uppercase bg-amber-500/10 text-amber-600 dark:text-amber-400">
                              {student.className}
                            </span>
                          </div>
                          <div className="flex items-center gap-4 mt-1.5 text-[10px] font-sans text-slate-400 dark:text-slate-500">
                            <span>Zrealizowano: <strong className="text-slate-700 dark:text-slate-300 font-bold">{compCount}/{totalCount}</strong> ({pct}%)</span>
                            <span>•</span>
                            <span>{quizScoreStr}</span>
                          </div>
                        </div>

                        <div className="flex items-center gap-1.5 self-end sm:self-center">
                          <button
                            onClick={() => setSelectedStudentDetailId(isSelected ? null : student.id)}
                            className={`px-2.5 py-1.5 font-bold text-xs rounded-lg cursor-pointer flex items-center gap-1 transition-all ${
                              isSelected
                                ? getPrimaryBtnClass()
                                : activeThemeConfig.galleryPresetBtn
                            }`}
                          >
                            <span>Szczegóły 🔍</span>
                          </button>
                          <button
                            onClick={() => handleStartEditStudent(student)}
                            className={`p-1.5 rounded-lg cursor-pointer transition-colors ${activeThemeConfig.galleryPresetBtn}`}
                            title="Edytuj dane ucznia"
                          >
                            <Edit className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDeleteStudent(student.id)}
                            className={`p-1.5 rounded-lg cursor-pointer transition-colors ${getDangerBtnClass()}`}
                            title="Usuń ucznia"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      {/* Progress Bar inside row */}
                      <div className="mt-3.5 w-full bg-slate-100 dark:bg-slate-800/80 h-1.5 rounded-full overflow-hidden">
                        <div 
                          className="bg-amber-600 h-full rounded-full transition-all duration-300"
                          style={{ width: `${pct}%` }}
                        />
                      </div>

                      {/* Detailed inline block if student is active */}
                      <AnimatePresence>
                        {isSelected && selectedDetailedStudent && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="mt-4 pt-4 border-t border-slate-200/60 dark:border-slate-800 overflow-hidden"
                          >
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                              {/* Left detail column: Chapters checklists */}
                              <div>
                                <h4 className="text-[11px] uppercase font-extrabold text-slate-400 tracking-wider mb-2.5">
                                  Realizacja poszczególnych tematów (Kliknij aby zmienić):
                                </h4>
                                <div className="space-y-1.5 max-h-60 overflow-y-auto pr-1">
                                  {chapters.map(ch => {
                                    const isDone = selectedDetailedStudent.completedChapters.includes(ch.id);
                                    return (
                                      <div 
                                        key={ch.id}
                                        onClick={() => handleToggleStudentChapterCompletion(selectedDetailedStudent.id, ch.id)}
                                        className={`p-2 rounded-lg border text-xs flex items-center justify-between cursor-pointer transition-colors ${
                                          isDone 
                                            ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-800 dark:text-emerald-400' 
                                            : 'bg-slate-50/50 dark:bg-slate-900/20 border-slate-200/50 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-100/50'
                                        }`}
                                      >
                                        <span className="font-semibold select-none">[{ch.subject}] {ch.title}</span>
                                        <span className="font-mono text-[10px] font-black shrink-0 ml-3 select-none">
                                          {isDone ? 'ZREALIZOWANO ✓' : 'OCZEKUJE ○'}
                                        </span>
                                      </div>
                                    );
                                  })}
                                </div>
                              </div>

                              {/* Right detail column: Quizzes & Notes */}
                              <div className="space-y-4">
                                {/* Quiz attempts section */}
                                <div>
                                  <h4 className="text-[11px] uppercase font-extrabold text-slate-400 tracking-wider mb-2.5">
                                    Wyniki quizów i sprawdzianów wiedzy:
                                  </h4>
                                  {Object.keys(selectedDetailedStudent.quizAttempts).length === 0 ? (
                                    <p className="text-xs font-medium text-slate-500 italic">Uczeń nie rozwiązał jeszcze żadnego quizu.</p>
                                  ) : (
                                    <div className="space-y-1.5">
                                      {Object.keys(selectedDetailedStudent.quizAttempts).map(key => {
                                        const attempt = selectedDetailedStudent.quizAttempts[key];
                                        const chName = chapters.find(ch => ch.id === key)?.title || key;
                                        return (
                                          <div key={key} className={`p-2 rounded-lg border text-xs flex items-center justify-between ${
                                            isDark ? 'bg-slate-900/60 border-slate-800' : 'bg-slate-50 border-slate-200/40'
                                          }`}>
                                            <span className="font-semibold text-slate-700 dark:text-slate-300">{chName}</span>
                                            <span className="font-mono font-bold text-amber-600">
                                              Wynik: {attempt.correct} / {attempt.total} ({Math.round((attempt.correct / attempt.total) * 100)}%)
                                            </span>
                                          </div>
                                        );
                                      })}
                                    </div>
                                  )}
                                </div>

                                 {/* Custom Student Notes section */}
                                <div>
                                  <h4 className="text-[11px] uppercase font-extrabold text-slate-400 tracking-wider mb-2.5">
                                    Notatki własne ucznia w lekcjach:
                                  </h4>
                                  {Object.keys(selectedDetailedStudent.chapterNotes).length === 0 ? (
                                    <p className="text-xs font-medium text-slate-500 italic">Brak zapisanych notatek własnych.</p>
                                  ) : (
                                    <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                                      {Object.keys(selectedDetailedStudent.chapterNotes).map(key => {
                                        const noteText = selectedDetailedStudent.chapterNotes[key];
                                        const chName = chapters.find(ch => ch.id === key)?.title || key;
                                        if (!noteText.trim()) return null;
                                        return (
                                          <div key={key} className={`p-2.5 rounded-lg border text-xs space-y-1 ${
                                            isDark ? 'bg-slate-900/80 border-slate-800' : 'bg-slate-100/60 border-slate-200/50'
                                          }`}>
                                            <span className="font-bold text-slate-500 text-[10px] block border-b pb-0.5 mb-1">
                                              Temat: {chName}
                                            </span>
                                            <p className="text-slate-700 dark:text-slate-300 font-medium whitespace-pre-line leading-relaxed italic">
                                              "{noteText}"
                                            </p>
                                          </div>
                                        );
                                      })}
                                    </div>
                                  )}
                                </div>

                                {/* Notatki nauczyciela (prywatne uwagi) */}
                                <div className="pt-3.5 border-t border-slate-200/60 dark:border-slate-800">
                                  <h4 className="text-[11px] uppercase font-extrabold text-slate-400 tracking-wider mb-2.5">
                                    Prywatne notatki nauczyciela ✍️:
                                  </h4>
                                  <div className="space-y-2">
                                    <textarea
                                      value={tempTeacherRemarks[selectedDetailedStudent.id] ?? selectedDetailedStudent.teacherRemarks ?? ''}
                                      onChange={(e) => setTempTeacherRemarks(prev => ({ ...prev, [selectedDetailedStudent.id]: e.target.value }))}
                                      placeholder="Wpisz tutaj uwagi, spostrzeżenia lub zalecenia dotyczące postępów ucznia..."
                                      className={`w-full p-2.5 text-xs border rounded-xl focus:ring-2 focus:ring-amber-500/20 focus:outline-none min-h-[80px] transition-all font-sans leading-relaxed ${
                                        isDark 
                                          ? 'bg-slate-950 border-slate-800 text-white placeholder-slate-600' 
                                          : 'bg-white border-slate-200 placeholder-slate-400 text-slate-800'
                                      }`}
                                    />
                                    <div className="flex justify-end">
                                      <button
                                        onClick={() => handleUpdateStudentRemarks(
                                          selectedDetailedStudent.id, 
                                          tempTeacherRemarks[selectedDetailedStudent.id] ?? selectedDetailedStudent.teacherRemarks ?? ''
                                        )}
                                        className={`px-3 py-1.5 text-xs font-bold rounded-lg cursor-pointer transition-colors flex items-center gap-1 ${getPrimaryBtnClass()}`}
                                      >
                                        <span>Zapisz notatkę 💾</span>
                                      </button>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  );
                })
              )}
            </div>
          </div>

        </div>
        </>
        ) : (
          (() => {
            // Filter chapters for curriculum view
            const filteredCurriculumChapters = chapters.filter(ch => {
              const matchesSearch = ch.title.toLowerCase().includes(curriculumSearchQuery.toLowerCase()) ||
                ch.subject.toLowerCase().includes(curriculumSearchQuery.toLowerCase()) ||
                (ch.chapterGroup || '').toLowerCase().includes(curriculumSearchQuery.toLowerCase());
              const matchesSubject = curriculumSubjectFilter === 'Wszystkie' || ch.subject === curriculumSubjectFilter;
              return matchesSearch && matchesSubject;
            });

            return (
              <div className="grid grid-cols-1 xl:grid-cols-12 gap-5 items-start">
                {/* LEFT COLUMN: Classes list (col-span-4) */}
                <div className="xl:col-span-4 space-y-5">
                  {/* Add New Class */}
                  <div className={`p-5 rounded-xl border ${isDark ? 'bg-slate-900/35 border-slate-800' : 'bg-white border-slate-200'} shadow-3xs`}>
                    <h3 className="text-sm font-black text-slate-800 dark:text-slate-200 border-b pb-2 mb-4 flex items-center gap-2">
                      <span className="p-1.5 bg-amber-500/10 text-amber-600 rounded-lg">➕</span>
                      <span>Dodaj nową klasę / grupę</span>
                    </h3>
                    <form 
                      onSubmit={(e) => {
                        e.preventDefault();
                        if (!newClassNameInput.trim()) {
                          showToast("Wpisz nazwę klasy!", "error");
                          return;
                        }
                        handleAddTeacherClass(newClassNameInput);
                      }} 
                      className="space-y-3"
                    >
                      <div>
                        <input
                          type="text"
                          value={newClassNameInput}
                          onChange={(e) => setNewClassNameInput(e.target.value)}
                          placeholder="np. Klasa 5C"
                          className={`w-full p-2.5 rounded-lg border text-sm font-medium focus:ring-2 focus:ring-amber-500/20 focus:outline-none ${
                            isDark ? 'bg-slate-950 border-slate-800 text-white' : 'bg-slate-50 border-slate-200'
                          }`}
                        />
                      </div>
                      <button
                        type="submit"
                        className={`w-full py-2.5 font-extrabold text-xs rounded-lg cursor-pointer transition-colors ${getPrimaryBtnClass()}`}
                      >
                        Dodaj klasę
                      </button>
                    </form>
                  </div>

                  {/* List of existing classes */}
                  <div className={`p-5 rounded-xl border ${isDark ? 'bg-slate-900/35 border-slate-800' : 'bg-white border-slate-200'} shadow-3xs`}>
                    <h3 className="text-sm font-black text-slate-800 dark:text-slate-200 border-b pb-2 mb-3 flex items-center gap-2">
                      <span className="p-1.5 bg-amber-500/10 text-amber-600 rounded-lg">🏫</span>
                      <span>Twoje klasy ({teacherClasses.length})</span>
                    </h3>
                    {teacherClasses.length === 0 ? (
                      <p className="text-xs text-slate-400 italic text-center py-4">Brak zdefiniowanych klas.</p>
                    ) : (
                      <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1">
                        {teacherClasses.map(cls => {
                          const isSelected = selectedTeacherClass === cls;
                          const assignedCount = (classChapters[cls] ?? []).length;
                          const classRealized = realizations.filter(r => r.className === cls && (classChapters[cls] ?? []).includes(r.chapterId)).length;
                          const pct = assignedCount > 0 ? Math.round((classRealized / assignedCount) * 100) : 0;

                          return (
                            <div
                              key={cls}
                              onClick={() => setSelectedTeacherClass(cls)}
                              className={`p-3 rounded-lg border transition-all cursor-pointer flex items-center justify-between gap-2 ${
                                isSelected
                                  ? 'border-amber-500 bg-amber-50/10'
                                  : isDark ? 'bg-slate-950/40 border-slate-800 hover:border-slate-700' : 'bg-slate-50 hover:bg-slate-100 border-slate-200/50'
                              }`}
                            >
                              <div className="space-y-1 min-w-0 flex-1">
                                <div className="font-bold text-xs text-slate-800 dark:text-slate-200 truncate">{cls}</div>
                                <div className="text-[9.5px] text-slate-400 flex items-center gap-1.5">
                                  <span>📚 {assignedCount} tematów</span>
                                  <span>•</span>
                                  <span className="text-emerald-600 font-semibold">✓ {classRealized} zrealizowano ({pct}%)</span>
                                </div>
                              </div>
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleExportClassRealizationsIcs(cls);
                                }}
                                className={`p-1.5 rounded-lg transition-colors cursor-pointer ${activeThemeConfig.galleryPresetBtn}`}
                                title="Eksportuj realizację tematów klasy do pliku .ics"
                              >
                                <Calendar className="w-3.5 h-3.5" />
                              </button>
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleDeleteTeacherClass(cls);
                                }}
                                className={`p-1.5 rounded-lg transition-colors cursor-pointer ${getDangerBtnClass()}`}
                                title="Usuń klasę"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </div>

                {/* RIGHT COLUMN: Curriculum Detail (col-span-8) */}
                <div className="xl:col-span-8 space-y-5">
                  {!selectedTeacherClass ? (
                    <div className={`p-12 text-center rounded-xl border ${isDark ? 'border-slate-800 bg-slate-900/10' : 'border-slate-200 bg-slate-50/50'}`}>
                      <GraduationCap className="w-12 h-12 text-slate-300 dark:text-slate-700 mx-auto mb-3" />
                      <p className="text-sm font-semibold text-slate-600 dark:text-slate-400">Brak wybranej klasy</p>
                      <p className="text-xs text-slate-400 mt-1">Wybierz lub utwórz klasę po lewej stronie, aby zarządzać jej programem nauczania.</p>
                    </div>
                  ) : (
                    <div className={`p-5 rounded-xl border ${isDark ? 'bg-slate-900/35 border-slate-800' : 'bg-white border-slate-200'} shadow-3xs space-y-5`}>
                      {/* Header detail */}
                      <div className="border-b pb-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                        <div>
                          <span className="text-[10px] uppercase font-bold text-amber-600 dark:text-amber-400 tracking-wider">Menedżer programu lekcji</span>
                          <h3 className="text-base font-black text-slate-800 dark:text-slate-200 flex items-center gap-2 mt-0.5">
                            <span>Program dla klasy: {selectedTeacherClass} 📚</span>
                          </h3>
                        </div>

                        <div className="flex items-center gap-2 flex-wrap">
                          <button
                            onClick={() => handleExportClassRealizationsIcs(selectedTeacherClass)}
                            className={`px-3 py-1.5 font-bold text-[10.5px] rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 ${getEmeraldBtnClass()}`}
                            title="Eksportuj daty realizacji tematów klasy do pliku .ics dla kalendarza"
                          >
                            <Calendar className="w-3.5 h-3.5" />
                            <span>Eksportuj do .ics 📅</span>
                          </button>
                          <button
                            onClick={() => handleAssignAllChapters(selectedTeacherClass)}
                            className={`px-3 py-1.5 font-bold text-[10.5px] rounded-lg transition-colors cursor-pointer ${activeThemeConfig.galleryPresetBtn}`}
                          >
                            Przypisz wszystkie tematy
                          </button>
                          <button
                            onClick={() => handleClearAllChapters(selectedTeacherClass)}
                            className={`px-3 py-1.5 font-bold text-[10.5px] text-red-600 hover:text-red-700 bg-red-50 dark:bg-red-950/20 rounded-lg transition-colors cursor-pointer`}
                          >
                            Wyczyść przypisania
                          </button>
                        </div>
                      </div>

                      {/* Progress bar info */}
                      {(() => {
                        const assignedIds = classChapters[selectedTeacherClass] ?? [];
                        const classRealized = realizations.filter(r => r.className === selectedTeacherClass && assignedIds.includes(r.chapterId));
                        const pct = assignedIds.length > 0 ? Math.round((classRealized.length / assignedIds.length) * 100) : 0;
                        return (
                          <div className="bg-slate-50 dark:bg-slate-900/40 p-4 rounded-xl border border-slate-150 dark:border-slate-800/80 space-y-2">
                            <div className="flex items-center justify-between text-xs font-semibold">
                              <span className="text-slate-500">Postęp realizacji przypisanego programu:</span>
                              <span className="text-emerald-600 font-bold">{classRealized.length} / {assignedIds.length} zrealizowanych ({pct}%)</span>
                            </div>
                            <div className="w-full bg-slate-200 dark:bg-slate-800 h-2.5 rounded-full overflow-hidden">
                              <div 
                                className="bg-emerald-600 h-full rounded-full transition-all duration-300"
                                style={{ width: `${pct}%` }}
                              />
                            </div>
                          </div>
                        );
                      })()}

                      {/* Generowanie Szablonu Planu Lekcji */}
                      <div className={`p-4 rounded-xl border ${
                        isTemplateGeneratorOpen 
                          ? 'border-amber-400 bg-amber-500/5 shadow-xs' 
                          : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-slate-50/20 dark:bg-slate-900/10'
                        } transition-all duration-300`}
                      >
                        <button
                          onClick={() => setIsTemplateGeneratorOpen(!isTemplateGeneratorOpen)}
                          className="w-full flex items-center justify-between font-bold text-xs cursor-pointer focus:outline-none"
                        >
                          <div className="flex items-center gap-2 text-slate-700 dark:text-slate-200">
                            <span className="text-sm">🗓️</span>
                            <span className="font-extrabold uppercase tracking-wider text-[10.5px]">
                              Szablon planu lekcji (Automatyczny terminarz)
                            </span>
                          </div>
                          <span className="text-[10px] text-amber-600 dark:text-amber-400 font-extrabold hover:underline">
                            {isTemplateGeneratorOpen ? 'Zwiń panel ◀' : 'Rozwiń i konfiguruj ▶'}
                          </span>
                        </button>

                        <AnimatePresence>
                          {isTemplateGeneratorOpen && (
                            <motion.div
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: 'auto' }}
                              exit={{ opacity: 0, height: 0 }}
                              className="overflow-hidden mt-3 pt-3 border-t border-slate-200/60 dark:border-slate-800/80 space-y-4"
                            >
                              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                                <div>
                                  <label className="block text-[9.5px] font-black text-slate-400 uppercase mb-1">Dzień tygodnia</label>
                                  <select
                                    value={templateWeekday}
                                    onChange={(e) => setTemplateWeekday(Number(e.target.value))}
                                    className={`w-full p-2 rounded-lg border text-xs font-semibold focus:ring-2 focus:ring-amber-500/20 focus:outline-none ${
                                      isDark ? 'bg-slate-950 border-slate-800 text-white' : 'bg-white border-slate-200'
                                    }`}
                                  >
                                    <option value={1}>Poniedziałek</option>
                                    <option value={2}>Wtorek</option>
                                    <option value={3}>Środa</option>
                                    <option value={4}>Czwartek</option>
                                    <option value={5}>Piątek</option>
                                    <option value={6}>Sobota</option>
                                    <option value={7}>Niedziela</option>
                                  </select>
                                </div>

                                <div>
                                  <label className="block text-[9.5px] font-black text-slate-400 uppercase mb-1">Godzina lekcji</label>
                                  <input
                                    type="time"
                                    value={templateTime}
                                    onChange={(e) => setTemplateTime(e.target.value)}
                                    className={`w-full p-2 rounded-lg border text-xs font-semibold focus:ring-2 focus:ring-amber-500/20 focus:outline-none ${
                                      isDark ? 'bg-slate-950 border-slate-800 text-white font-mono' : 'bg-white border-slate-200 font-mono'
                                    }`}
                                  />
                                </div>

                                <div>
                                  <label className="block text-[9.5px] font-black text-slate-400 uppercase mb-1">Data rozpoczęcia</label>
                                  <input
                                    type="date"
                                    value={templateStartDate}
                                    onChange={(e) => setTemplateStartDate(e.target.value)}
                                    className={`w-full p-2 rounded-lg border text-xs font-semibold focus:ring-2 focus:ring-amber-500/20 focus:outline-none ${
                                      isDark ? 'bg-slate-950 border-slate-800 text-white font-mono' : 'bg-white border-slate-200 font-mono'
                                    }`}
                                  />
                                </div>
                              </div>

                              <div>
                                <div className="flex items-center justify-between mb-1.5">
                                  <label className="block text-[9.5px] font-black text-slate-400 uppercase">
                                    Wybierz tematy do uwzględnienia w planie
                                  </label>
                                  <div className="flex gap-2">
                                    <button
                                      type="button"
                                      onClick={() => setTemplateSelectedChapters(classChapters[selectedTeacherClass] ?? [])}
                                      className="text-[9px] font-bold text-amber-600 hover:underline"
                                    >
                                      Zaznacz wszystkie
                                    </button>
                                    <span className="text-slate-300">|</span>
                                    <button
                                      type="button"
                                      onClick={() => setTemplateSelectedChapters([])}
                                      className="text-[9px] font-bold text-slate-400 hover:underline"
                                    >
                                      Odznacz wszystkie
                                    </button>
                                  </div>
                                </div>

                                {(() => {
                                  const assignedIds = classChapters[selectedTeacherClass] ?? [];
                                  if (assignedIds.length === 0) {
                                    return (
                                      <p className="text-[10.5px] text-slate-400 italic py-1">
                                        Klasa nie ma przypisanych żadnych tematów! Przypisz je na liście poniżej przed tworzeniem planu.
                                      </p>
                                    );
                                  }

                                  const assignedChaptersList = chapters.filter(ch => assignedIds.includes(ch.id));

                                  return (
                                    <div className="border border-slate-150 dark:border-slate-800 rounded-lg max-h-36 overflow-y-auto p-2 space-y-1 bg-white/50 dark:bg-slate-950/20">
                                      {assignedChaptersList.map(ch => {
                                        const isChecked = templateSelectedChapters.includes(ch.id);
                                        return (
                                          <div
                                            key={ch.id}
                                            onClick={() => {
                                              setTemplateSelectedChapters(prev =>
                                                prev.includes(ch.id)
                                                  ? prev.filter(id => id !== ch.id)
                                                  : [...prev, ch.id]
                                              );
                                            }}
                                            className={`p-1.5 rounded-md flex items-center gap-2 cursor-pointer transition-colors text-[11px] ${
                                              isChecked 
                                                ? 'bg-amber-500/10 text-amber-900 dark:text-amber-300 font-bold' 
                                                : 'hover:bg-slate-100/50 dark:hover:bg-slate-900/30 text-slate-600 dark:text-slate-400'
                                            }`}
                                          >
                                            <span className="shrink-0">
                                              {isChecked ? (
                                                <CheckSquare className="w-4 h-4 text-amber-600" />
                                              ) : (
                                                <Square className="w-4 h-4 text-slate-400" />
                                              )}
                                            </span>
                                            <span className="px-1 py-0.5 rounded text-[8.5px] bg-slate-100 dark:bg-slate-800 text-slate-500 uppercase font-extrabold font-mono shrink-0">
                                              {ch.subject}
                                            </span>
                                            <span className="truncate">{ch.title}</span>
                                          </div>
                                        );
                                      })}
                                    </div>
                                  );
                                })()}
                              </div>

                              {templateSchedulingSummary && (
                                <div className="bg-amber-500/5 border border-amber-500/10 p-3 rounded-lg space-y-1">
                                  <p className="text-[11px] font-semibold text-slate-700 dark:text-slate-300">
                                    💡 <strong>Podsumowanie generowania planu:</strong>
                                  </p>
                                  <ul className="list-disc list-inside text-[10.5px] text-slate-600 dark:text-slate-400 space-y-0.5">
                                    <li>Liczba tygodni / lekcji do zaplanowania: <strong>{templateSchedulingSummary.count}</strong></li>
                                    <li>Pierwsza lekcja: <strong>{templateSchedulingSummary.first} o {templateTime}</strong></li>
                                    <li>Ostatnia lekcja: <strong>{templateSchedulingSummary.last} o {templateTime}</strong></li>
                                    <li className="text-amber-700 dark:text-amber-400 font-medium">
                                      Uwaga: To automatycznie zaktualizuje daty w kalendarzu dla klasy {selectedTeacherClass}!
                                    </li>
                                  </ul>
                                </div>
                              )}

                              <div className="flex justify-end gap-2 pt-1 border-t border-slate-200/45 dark:border-slate-800/40">
                                <button
                                  type="button"
                                  onClick={() => setIsTemplateGeneratorOpen(false)}
                                  className={`px-3 py-1.5 text-[10.5px] font-bold rounded-lg cursor-pointer ${activeThemeConfig.galleryPresetBtn}`}
                                >
                                  Anuluj
                                </button>
                                <button
                                  type="button"
                                  onClick={handleGenerateTemplateSchedule}
                                  disabled={templateSelectedChapters.length === 0}
                                  className={`px-4 py-1.5 text-[10.5px] font-extrabold rounded-lg cursor-pointer flex items-center gap-1.5 transition-all disabled:opacity-40 disabled:cursor-not-allowed ${getEmeraldBtnClass()}`}
                                >
                                  <span>Rozplanuj tematy co tydzień 🚀</span>
                                </button>
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>

                      {/* Search & Filter within curriculum */}
                      <div className="flex flex-col sm:flex-row gap-3">
                        <div className="flex-1 relative">
                          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
                          <input
                            type="text"
                            value={curriculumSearchQuery}
                            onChange={(e) => setCurriculumSearchQuery(e.target.value)}
                            placeholder="Szukaj tematu po nazwie, dziale..."
                            className={`w-full pl-9 pr-4 py-2.5 rounded-lg border text-xs font-semibold focus:ring-2 focus:ring-amber-500/20 focus:outline-none ${
                              isDark ? 'bg-slate-950 border-slate-800 text-white' : 'bg-slate-50 border-slate-200'
                            }`}
                          />
                        </div>
                        <div className="w-full sm:w-48">
                          <select
                            value={curriculumSubjectFilter}
                            onChange={(e) => setCurriculumSubjectFilter(e.target.value)}
                            className={`w-full p-2.5 rounded-lg border text-xs font-semibold focus:ring-2 focus:ring-amber-500/20 focus:outline-none ${
                              isDark ? 'bg-slate-950 border-slate-800 text-white' : 'bg-slate-50 border-slate-200'
                            }`}
                          >
                            <option value="Wszystkie">Wszystkie przedmioty</option>
                            {subjects.filter(s => s !== 'Wszystkie').map(s => (
                              <option key={s} value={s}>{s}</option>
                            ))}
                          </select>
                        </div>
                      </div>

                      {/* List of chapters/lessons with Assignment and Realization toggles */}
                      <div className="space-y-2 max-h-[450px] overflow-y-auto pr-1">
                        {filteredCurriculumChapters.length === 0 ? (
                          <div className="text-center italic text-slate-400 dark:text-slate-500 py-6 text-xs">
                            Nie znaleziono tematów spełniających kryteria wyszukiwania.
                          </div>
                        ) : (
                          filteredCurriculumChapters.map(ch => {
                            const assignedIds = classChapters[selectedTeacherClass] ?? [];
                            const isAssigned = assignedIds.includes(ch.id);
                            const realizationEntry = realizations.find(r => r.className === selectedTeacherClass && r.chapterId === ch.id);
                            const isRealized = !!realizationEntry;

                            return (
                              <div 
                                key={ch.id} 
                                className={`p-3 rounded-lg border flex flex-col sm:flex-row sm:items-center justify-between gap-3 transition-colors ${
                                  isAssigned 
                                    ? isRealized 
                                      ? 'bg-emerald-500/5 border-emerald-500/20' 
                                      : isDark ? 'bg-slate-900/60 border-slate-800' : 'bg-white border-slate-200/80'
                                    : 'bg-slate-100/40 dark:bg-slate-900/10 border-slate-200/40 dark:border-slate-800/40 opacity-75'
                                }`}
                              >
                                <div className="min-w-0 flex-1">
                                  <div className="flex items-center gap-1.5 flex-wrap">
                                    <span className="px-1.5 py-0.5 rounded text-[8.5px] font-extrabold uppercase bg-amber-500/10 text-amber-600 dark:text-amber-400">
                                      {ch.subject}
                                    </span>
                                    <span className="text-[10px] text-slate-400 dark:text-slate-500 truncate max-w-[200px]">
                                      📂 {ch.chapterGroup || 'Główny'}
                                    </span>
                                  </div>
                                  <h4 className="font-bold text-xs text-slate-800 dark:text-slate-100 mt-1 truncate" title={ch.title}>
                                    {ch.title}
                                  </h4>
                                </div>

                                <div className="flex items-center gap-4 shrink-0">
                                  {/* Lesson Actions (Edit & Delete) */}
                                  <div className="flex items-center gap-1 border-r border-slate-200 dark:border-slate-800 pr-4">
                                    <button
                                      type="button"
                                      onClick={() => {
                                        setEditingChapter(ch);
                                        setIsCreatorOpen(true);
                                      }}
                                      className="p-1.5 rounded-lg cursor-pointer transition-colors text-slate-500 hover:text-emerald-600 hover:bg-emerald-500/10 dark:hover:text-emerald-400"
                                      title="Edytuj lekcję"
                                    >
                                      <Edit className="w-4 h-4" />
                                    </button>
                                    <button
                                      type="button"
                                      onClick={(e) => handleDeleteChapter(ch.id, e)}
                                      className="p-1.5 rounded-lg cursor-pointer transition-colors text-slate-500 hover:text-rose-600 hover:bg-rose-500/10 dark:hover:text-rose-400"
                                      title="Usuń lekcję"
                                    >
                                      <Trash2 className="w-4 h-4" />
                                    </button>
                                  </div>

                                  {/* Toggle Assignment */}
                                  <div className="flex items-center gap-1.5 border-r border-slate-200 dark:border-slate-800 pr-4">
                                    <span className="text-[10.5px] font-semibold text-slate-400">Przypisany:</span>
                                    <button
                                      type="button"
                                      onClick={() => handleToggleChapterAssignment(selectedTeacherClass, ch.id)}
                                      className={`p-1 rounded-lg cursor-pointer transition-colors ${
                                        isAssigned 
                                          ? 'text-amber-600 bg-amber-500/10' 
                                          : 'text-slate-400 bg-slate-100 dark:bg-slate-800'
                                      }`}
                                      title={isAssigned ? "Usuń przypisanie tego tematu" : "Przypisz ten temat do klasy"}
                                    >
                                      {isAssigned ? (
                                        <CheckSquare className="w-5 h-5" />
                                      ) : (
                                        <Square className="w-5 h-5" />
                                      )}
                                    </button>
                                  </div>

                                  {/* Toggle Realization (Enabled only if assigned) */}
                                  <div className="flex items-center gap-2">
                                    <span className="text-[10.5px] font-semibold text-slate-400">Status:</span>
                                    <button
                                      type="button"
                                      disabled={!isAssigned}
                                      onClick={() => handleToggleRealizationInClass(selectedTeacherClass, ch.id)}
                                      className={`px-2.5 py-1.5 text-[10px] font-black uppercase tracking-wider rounded-lg transition-all ${
                                        !isAssigned
                                          ? 'bg-slate-100/50 dark:bg-slate-900/10 text-slate-300 dark:text-slate-700 cursor-not-allowed'
                                          : isRealized
                                            ? 'bg-emerald-500/15 text-emerald-600 border border-emerald-500/20'
                                            : 'bg-slate-100 dark:bg-slate-800 text-slate-500 border border-transparent hover:border-slate-300 dark:hover:border-slate-700 cursor-pointer'
                                      }`}
                                      title={!isAssigned ? "Przypisz temat, aby móc oznaczyć go jako zrealizowany" : isRealized ? "Cofnij realizację lekcji" : "Oznacz temat jako zrealizowany"}
                                    >
                                      {isRealized ? 'Zrealizowany ✓' : 'Planowany ○'}
                                    </button>
                                  </div>
                                </div>
                              </div>
                            );
                          })
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })()
        )}
      </div>
    );
  };

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSubject, setSelectedSubject] = useState<string>('Wszystkie');
  const [selectedSchoolType, setSelectedSchoolType] = useState<string>('Wszystkie');
  const [selectedGrade, setSelectedGrade] = useState<string>('Wszystkie');

  // List of all unique subjects available
  const subjects = useMemo(() => {
    const set = new Set(chapters.map((c) => c.subject));
    return ['Wszystkie', ...Array.from(set)];
  }, [chapters]);

  // List of all unique school types available
  const schoolTypesList = useMemo(() => {
    const set = new Set(chapters.map((c) => c.schoolType || 'Ogólny / Pozostałe'));
    return ['Wszystkie', ...Array.from(set)];
  }, [chapters]);

  // List of all unique grades available
  const gradesList = useMemo(() => {
    const set = new Set(chapters.map((c) => c.grade || 'Ogólny'));
    return ['Wszystkie', ...Array.from(set)];
  }, [chapters]);

  // Filtered chapters for current display
  const filteredChapters = useMemo(() => {
    return chapters.filter((c) => {
      const matchesSearch = c.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            c.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            (c.chapterGroup || '').toLowerCase().includes(searchQuery.toLowerCase());
      const matchesSubject = selectedSubject === 'Wszystkie' || c.subject === selectedSubject;
      const matchesSchoolType = selectedSchoolType === 'Wszystkie' || (c.schoolType || 'Ogólny / Pozostałe') === selectedSchoolType;
      const matchesGrade = selectedGrade === 'Wszystkie' || (c.grade || 'Ogólny') === selectedGrade;
      return matchesSearch && matchesSubject && matchesSchoolType && matchesGrade;
    });
  }, [chapters, searchQuery, selectedSubject, selectedSchoolType, selectedGrade]);

  // Group chapters hierarchically for structured navigation
  const groupedChapters = useMemo(() => {
    const groups: Record<string, Record<string, Record<string, Chapter[]>>> = {};

    filteredChapters.forEach((ch) => {
      const sType = ch.schoolType || 'Ogólny / Pozostałe';
      const sGrade = ch.grade || 'Ogólny';
      const sGroup = ch.chapterGroup || 'Inne działy';

      if (!groups[sType]) groups[sType] = {};
      if (!groups[sType][sGrade]) groups[sType][sGrade] = {};
      if (!groups[sType][sGrade][sGroup]) groups[sType][sGrade][sGroup] = [];

      groups[sType][sGrade][sGroup].push(ch);
    });

    return groups;
  }, [filteredChapters]);

  // 7. Interactive Board / Whiteboard Overlay State
  const [isDrawingModeActive, setIsDrawingModeActive] = useState(false);

  // 8. Quiz Interaction States
  // Map of chapterId -> QuizAnswersState (which question was solved and what index was chosen)
  const [quizAnswers, setQuizAnswers] = useState<Record<string, Record<string, { chosenIdx: number; isCorrect: boolean; showFeedback: boolean }>>>({});

  // 10. Mobile sidebar trigger
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  // 11. Fullscreen Focus Mode State (Dynamic toggle for reader only)
  const [isContentFullscreen, setIsContentFullscreen] = useState(false);

  const toggleFullscreen = () => {
    const elem = document.getElementById("multibook-content-viewport");
    if (!elem) return;

    try {
      if (!document.fullscreenElement) {
        if (elem.requestFullscreen) {
          elem.requestFullscreen();
        } else if ((elem as any).webkitRequestFullscreen) {
          (elem as any).webkitRequestFullscreen();
        } else if ((elem as any).msRequestFullscreen) {
          (elem as any).msRequestFullscreen();
        }
        setIsContentFullscreen(true);
      } else {
        if (document.exitFullscreen) {
          document.exitFullscreen();
        } else if ((document as any).webkitExitFullscreen) {
          (document as any).webkitExitFullscreen();
        } else if ((document as any).msExitFullscreen) {
          (document as any).msExitFullscreen();
        }
        setIsContentFullscreen(false);
      }
    } catch (err) {
      console.warn("Natywny pełny ekran zablokowany lub nieobsługiwany - aktywacja symulowanego trybu skupienia:", err);
      setIsContentFullscreen(!isContentFullscreen);
    }
  };

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsContentFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener("fullscreenchange", handleFullscreenChange);
    document.addEventListener("webkitfullscreenchange", handleFullscreenChange);
    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
      document.removeEventListener("webkitfullscreenchange", handleFullscreenChange);
    };
  }, []);

  // Helper actions
  const handleToggleBookmark = (id: string) => {
    setProgress((prev) => {
      const isBookmarked = prev.bookmarkedChapters.includes(id);
      const updated = isBookmarked
        ? prev.bookmarkedChapters.filter((cId) => cId !== id)
        : [...prev.bookmarkedChapters, id];
      return { ...prev, bookmarkedChapters: updated };
    });
  };

  const handleToggleCompleted = (id: string) => {
    setProgress((prev) => {
      const isDone = prev.completedChapters.includes(id);
      const updated = isDone
        ? prev.completedChapters.filter((cId) => cId !== id)
        : [...prev.completedChapters, id];
      return { ...prev, completedChapters: updated };
    });
  };

  const handleSaveNote = (text: string) => {
    if (!activeChapter) return;
    setLocalNoteText(text);
    setProgress((prev) => {
      const updatedNotes = { ...prev.chapterNotes, [activeChapter.id]: text };
      return { ...prev, chapterNotes: updatedNotes };
    });
  };

  const handleAddImageToGallery = (url: string) => {
    if (!activeChapter || !url.trim()) return;
    setChapterGalleryImages((prev) => {
      const currentList = prev[activeChapter.id] || [];
      if (currentList.includes(url.trim())) return prev;
      return {
        ...prev,
        [activeChapter.id]: [...currentList, url.trim()],
      };
    });
    setNewImageUrlInput('');
  };

  const handleRemoveImageFromGallery = (url: string) => {
    if (!activeChapter) return;
    setChapterGalleryImages((prev) => {
      const currentList = prev[activeChapter.id] || [];
      return {
        ...prev,
        [activeChapter.id]: currentList.filter((item) => item !== url),
      };
    });
  };

  const handleInsertImageIntoNotes = (url: string) => {
    if (!activeChapter) return;
    const currentNoteText = progress.chapterNotes[activeChapter.id] || '';
    const markdownImage = `![Odhaczona grafika](${url})`;
    const updatedNotesText = currentNoteText + (currentNoteText ? '\n\n' : '') + markdownImage;
    handleSaveNote(updatedNotesText);
  };

  const handleToggleRealizationInClass = (className: string, chapterId: string) => {
    // Automatically assign if not already assigned
    setClassChapters((prev) => {
      const currentAssigned = prev[className] || [];
      if (!currentAssigned.includes(chapterId)) {
        return {
          ...prev,
          [className]: [...currentAssigned, chapterId]
        };
      }
      return prev;
    });

    setRealizations((prev) => {
      const exists = prev.some((r) => r.className === className && r.chapterId === chapterId);
      if (exists) {
        return prev.filter((r) => !(r.className === className && r.chapterId === chapterId));
      } else {
        return [...prev, { className, chapterId, timestamp: Date.now() }];
      }
    });
  };

  const handleToggleChapterAssignment = (className: string, chapterId: string) => {
    setClassChapters((prev) => {
      const currentAssigned = prev[className] || [];
      const isAssigned = currentAssigned.includes(chapterId);
      const updated = isAssigned
        ? currentAssigned.filter(id => id !== chapterId)
        : [...currentAssigned, chapterId];
      return {
        ...prev,
        [className]: updated
      };
    });
    showToast(`Zaktualizowano przypisanie tematu dla klasy ${className}`, "success");
  };

  const handleAssignAllChapters = (className: string) => {
    setClassChapters((prev) => ({
      ...prev,
      [className]: chapters.map(c => c.id)
    }));
    showToast(`Przypisano wszystkie dostępne tematy do klasy ${className}`, "success");
  };

  const handleClearAllChapters = (className: string) => {
    setClassChapters((prev) => ({
      ...prev,
      [className]: []
    }));
    showToast(`Usunięto wszystkie przypisania dla klasy ${className}`, "info");
  };

  const handleAddTeacherClass = (name: string) => {
    const trimmed = name.trim();
    if (!trimmed) return;
    if (teacherClasses.includes(trimmed)) {
      showToast('Ta klasa już istnieje!', 'error');
      return;
    }
    setTeacherClasses((prev) => [...prev, trimmed]);
    setClassChapters((prev) => ({
      ...prev,
      [trimmed]: chapters.map(c => c.id) // By default, assign all chapters to make it easy for teachers
    }));
    setNewClassNameInput('');
    setSelectedTeacherClass(trimmed); // Select the newly created class
    showToast(`Dodano klasę: ${trimmed}`, 'success');
  };

  const handleDeleteTeacherClass = (name: string) => {
    showConfirm(
      `Czy napewno chcesz usunąć klasę "${name}"? Usunie to również całą historię realizacji tematów w tej klasie.`,
      () => {
        setTeacherClasses((prev) => prev.filter((c) => c !== name));
        setRealizations((prev) => prev.filter((r) => r.className !== name));
        setClassChapters((prev) => {
          const updated = { ...prev };
          delete updated[name];
          return updated;
        });
        if (selectedTeacherClass === name) {
          setSelectedTeacherClass('');
        }
        showToast(`Usunięto klasę: ${name}`, 'success');
      },
      'Usuwanie klasy'
    );
  };

  const templateSchedulingSummary = useMemo(() => {
    if (!selectedTeacherClass || templateSelectedChapters.length === 0) return null;
    
    const [startYear, startMonth, startDay] = templateStartDate.split('-').map(Number);
    const startDateObj = new Date(startYear, startMonth - 1, startDay);
    if (isNaN(startDateObj.getTime())) return null;

    const targetWeekdayIndex = templateWeekday === 7 ? 0 : templateWeekday;
    const daysToAdd = (targetWeekdayIndex - startDateObj.getDay() + 7) % 7;
    
    const firstLessonDate = new Date(startDateObj);
    firstLessonDate.setDate(startDateObj.getDate() + daysToAdd);
    
    const lastLessonDate = new Date(firstLessonDate);
    lastLessonDate.setDate(firstLessonDate.getDate() + (templateSelectedChapters.length - 1) * 7);

    const formatDate = (d: Date) => {
      const weekdays = ["Niedziela", "Poniedziałek", "Wtorek", "Środa", "Czwartek", "Piątek", "Sobota"];
      const day = d.getDate().toString().padStart(2, '0');
      const month = (d.getMonth() + 1).toString().padStart(2, '0');
      return `${weekdays[d.getDay()]}, ${day}.${month}.${d.getFullYear()}`;
    };

    return {
      first: formatDate(firstLessonDate),
      last: formatDate(lastLessonDate),
      count: templateSelectedChapters.length
    };
  }, [selectedTeacherClass, templateStartDate, templateWeekday, templateSelectedChapters]);

  const handleGenerateTemplateSchedule = () => {
    if (!selectedTeacherClass) {
      showToast("Proszę najpierw wybrać klasę!", "error");
      return;
    }
    if (templateSelectedChapters.length === 0) {
      showToast("Proszę zaznaczyć przynajmniej jeden temat do rozplanowania!", "error");
      return;
    }

    const [startYear, startMonth, startDay] = templateStartDate.split('-').map(Number);
    const startDateObj = new Date(startYear, startMonth - 1, startDay);
    
    if (isNaN(startDateObj.getTime())) {
      showToast("Nieprawidłowa data początkowa!", "error");
      return;
    }

    const targetWeekdayIndex = templateWeekday === 7 ? 0 : templateWeekday;

    let currentScheduleDate = new Date(startDateObj);
    const daysToAdd = (targetWeekdayIndex - currentScheduleDate.getDay() + 7) % 7;
    currentScheduleDate.setDate(currentScheduleDate.getDate() + daysToAdd);

    const [hours, minutes] = templateTime.split(':').map(Number);
    currentScheduleDate.setHours(hours || 8, minutes || 0, 0, 0);

    const newRealizationsToAdd: { className: string; chapterId: string; timestamp: number }[] = [];

    templateSelectedChapters.forEach((chapterId, index) => {
      const scheduledTime = new Date(currentScheduleDate);
      scheduledTime.setDate(scheduledTime.getDate() + (index * 7));
      
      newRealizationsToAdd.push({
        className: selectedTeacherClass,
        chapterId: chapterId,
        timestamp: scheduledTime.getTime()
      });
    });

    setRealizations((prev) => {
      const filtered = prev.filter(r => 
        !(r.className === selectedTeacherClass && templateSelectedChapters.includes(r.chapterId))
      );
      return [...filtered, ...newRealizationsToAdd];
    });

    setCurrentCalendarDate(new Date(currentScheduleDate.getFullYear(), currentScheduleDate.getMonth(), 1));

    showToast(`Pomyślnie rozplanowano ${templateSelectedChapters.length} lekcji od ${currentScheduleDate.toLocaleDateString('pl-PL')}!`, "success");
    setIsTemplateGeneratorOpen(false);
  };

  // Export realizations dates of topics in the teacher panel to an .ics file
  const handleExportClassRealizationsIcs = (className: string) => {
    const classRealizations = realizations.filter(r => r.className === className);
    if (classRealizations.length === 0) {
      showToast(`Klasa "${className}" nie ma jeszcze żadnych zrealizowanych tematów lekcji do wyeksportowania!`, "error");
      return;
    }

    const formatIcsDate = (date: Date): string => {
      const y = date.getUTCFullYear();
      const m = String(date.getUTCMonth() + 1).padStart(2, '0');
      const d = String(date.getUTCDate()).padStart(2, '0');
      const h = String(date.getUTCHours()).padStart(2, '0');
      const min = String(date.getUTCMinutes()).padStart(2, '0');
      const s = String(date.getUTCSeconds()).padStart(2, '0');
      return `${y}${m}${d}T${h}${min}${s}Z`;
    };

    let icsContent = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//Multibook//PL',
      'CALSCALE:GREGORIAN',
      'METHOD:PUBLISH',
      `X-WR-CALNAME:Realizacja lekcji - ${className}`,
      'X-WR-TIMEZONE:UTC'
    ];

    classRealizations.forEach((r) => {
      const ch = chapters.find(c => c.id === r.chapterId);
      const chTitle = ch ? ch.title : 'Zrealizowany temat';
      const chSubject = ch ? ch.subject : 'Nieokreślony';
      const groupInfo = ch && ch.chapterGroup ? `Dział: ${ch.chapterGroup}` : '';
      const lessonNumInfo = ch && ch.lessonNumber ? `Numer lekcji: ${ch.lessonNumber}` : '';
      
      let descLines = [
        `Klasa: ${className}`,
        `Przedmiot: ${chSubject}`,
        groupInfo,
        lessonNumInfo,
        'Status: Zrealizowano w Multibooku'
      ].filter(Boolean);

      const desc = descLines.join('\n');
      const eventUid = `${r.chapterId}-${r.className.replace(/\s+/g, '_')}-${r.timestamp}@multibook`;
      
      icsContent.push('BEGIN:VEVENT');
      icsContent.push(`UID:${eventUid}`);
      icsContent.push(`DTSTAMP:${formatIcsDate(new Date())}`);
      icsContent.push(`DTSTART:${formatIcsDate(new Date(r.timestamp))}`);
      icsContent.push(`DTEND:${formatIcsDate(new Date(r.timestamp + 45 * 60 * 1000))}`);
      icsContent.push(`SUMMARY:[${chSubject}] ${chTitle}`.replace(/[,;]/g, '\\$&'));
      icsContent.push(`DESCRIPTION:${desc.replace(/\n/g, '\\n').replace(/[,;]/g, '\\$&')}`);
      icsContent.push(`LOCATION:${className}`.replace(/[,;]/g, '\\$&'));
      icsContent.push('END:VEVENT');
    });

    icsContent.push('END:VCALENDAR');
    
    try {
      const finalIcsString = icsContent.join('\r\n');
      const blob = new Blob([finalIcsString], { type: 'text/calendar;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const linkElement = document.createElement('a');
      linkElement.setAttribute('href', url);
      linkElement.setAttribute('download', `realizacja_lekcji_${className.toLowerCase().replace(/\s+/g, '_')}.ics`);
      linkElement.click();
      URL.revokeObjectURL(url);
      showToast(`Pomyślnie wygenerowano terminarz .ics dla klasy ${className}!`, 'success');
    } catch (e) {
      showToast('Wystąpił błąd podczas generowania pliku kalendarza .ics.', 'error');
      console.error(e);
    }
  };

  // Export database backup (chapters, progress, realizations, classes, galleries, settings, students) to a JSON file
  const handleExportDatabase = () => {
    const backupData = {
      version: '1.0',
      exportedAt: new Date().toISOString(),
      chapters,
      progress,
      theme,
      fontSize,
      lineHeight,
      isReadingMode,
      teacherClasses,
      classChapters,
      realizations,
      chapterGalleryImages,
      students,
    };
    
    try {
      const dataStr = JSON.stringify(backupData, null, 2);
      const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
      
      const exportFileDefaultName = `multibook_backup_${new Date().toISOString().slice(0, 10)}.json`;
      
      const linkElement = document.createElement('a');
      linkElement.setAttribute('href', dataUri);
      linkElement.setAttribute('download', exportFileDefaultName);
      linkElement.click();
      showToast('Kopia bezpieczeństwa została pobrana!', 'success');
    } catch (e) {
      showToast('Wystąpił błąd podczas generowania pliku kopii zapasowej.', 'error');
      console.error(e);
    }
  };

  // Import database backup from a JSON file and dynamically restore properties
  const handleImportDatabase = (event: React.ChangeEvent<HTMLInputElement>) => {
    const fileReader = new FileReader();
    const file = event.target.files?.[0];
    if (!file) return;

    fileReader.onload = (e) => {
      try {
        const parsedData = JSON.parse(e.target?.result as string);
        
        if (parsedData && typeof parsedData === 'object') {
          let restoredCount = 0;
          
          if (Array.isArray(parsedData.chapters)) {
            setChapters(parsedData.chapters);
            restoredCount++;
          }
          if (parsedData.progress && typeof parsedData.progress === 'object') {
            setProgress(parsedData.progress);
            restoredCount++;
          }
          if (parsedData.theme) {
            setTheme(parsedData.theme || 'light');
            restoredCount++;
          }
          if (typeof parsedData.fontSize === 'number') {
            setFontSize(parsedData.fontSize);
            restoredCount++;
          }
          if (parsedData.lineHeight) {
            setLineHeight(parsedData.lineHeight);
            restoredCount++;
          }
          if (typeof parsedData.isReadingMode === 'boolean') {
            setIsReadingMode(parsedData.isReadingMode);
            restoredCount++;
          }
          if (Array.isArray(parsedData.teacherClasses)) {
            setTeacherClasses(parsedData.teacherClasses);
            restoredCount++;
          }
          if (parsedData.classChapters && typeof parsedData.classChapters === 'object') {
            setClassChapters(parsedData.classChapters);
            restoredCount++;
          }
          if (Array.isArray(parsedData.realizations)) {
            setRealizations(parsedData.realizations);
            restoredCount++;
          }
          if (parsedData.chapterGalleryImages && typeof parsedData.chapterGalleryImages === 'object') {
            setChapterGalleryImages(parsedData.chapterGalleryImages);
            restoredCount++;
          }
          if (Array.isArray(parsedData.students)) {
            setStudents(parsedData.students);
            restoredCount++;
          }

          if (restoredCount > 0) {
            showToast('Kopia zapasowa została pomyślnie zaimportowana i przywrócona!', 'success');
            // Reset files target input
            event.target.value = '';
          } else {
            showToast('Niepoprawny format pliku kopii zapasowej.', 'error');
          }
        } else {
          showToast('Plik nie zawiera poprawnego obiektu JSON.', 'error');
        }
      } catch (err) {
        showToast('Błąd podczas odczytu pliku kopii zapasowej. Upewnij się, że plik jest poprawny.', 'error');
        console.error(err);
      }
    };
    fileReader.readAsText(file);
  };

  const handleAddNewChapter = (newChap: Chapter) => {
    setChapters((prev) => [...prev, newChap]);
    setCurrentChapterId(newChap.id);
    showToast(`Utworzono lekcję: ${newChap.title}`, 'success');
  };

  const handleUpdateChapter = (updatedChap: Chapter) => {
    setChapters((prev) => prev.map((c) => (c.id === updatedChap.id ? updatedChap : c)));
    showToast(`Zaktualizowano lekcję: ${updatedChap.title}`, 'success');
  };

  const handleImportAllChapters = (imported: Chapter[]) => {
    setChapters(imported);
    if (imported.length > 0) {
      setCurrentChapterId(imported[0].id);
    }
    showToast(`Zaimportowano ${imported.length} lekcji!`, 'success');
  };

  const handleDeleteChapter = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    showConfirm(
      'Czy na pewno chcesz bezpowrotnie usunąć ten rozdział z Twojego multibooka?',
      () => {
        const afterDelete = chapters.filter((c) => c.id !== id);
        setChapters(afterDelete);
        
        // If current is deleted, re-route
        if (currentChapterId === id && afterDelete.length > 0) {
          setCurrentChapterId(afterDelete[0].id);
        }
        showToast('Rozdział został usunięty.', 'success');
      },
      'Usuwanie rozdziału'
    );
  };

  const handleResetToDefault = () => {
    showConfirm(
      'Czy chcesz przywrócić domyślne działy podręcznika? Wszystkie Twoje ręcznie dodane lekcje zostaną wyczyszczone.',
      () => {
        setChapters(DEFAULT_CHAPTERS);
        setProgress({
          completedChapters: [],
          bookmarkedChapters: [],
          chapterNotes: {}
        });
        setQuizAnswers({});
        setCurrentChapterId(DEFAULT_CHAPTERS[0].id);
        showToast('Przywrócono domyślne działy podręcznika.', 'success');
      },
      'Przywracanie domyślnych'
    );
  };

  // Compute stats
  const totalChaptersCount = chapters.length;
  const completedChaptersCount = progress.completedChapters.filter(id => chapters.some(c => c.id === id)).length;
  const completionPercentage = totalChaptersCount > 0 
    ? Math.round((completedChaptersCount / totalChaptersCount) * 100) 
    : 0;

  // Dynamically map subject names to gorgeous, themed color configurations
  const getSubjectThemeColors = (subjectName: string, themeMode: ThemeType) => {
    const sub = (subjectName || '').toLowerCase().trim();
    const isDark = themeMode === 'dark';

    if (sub.includes('biologia')) {
      return {
        text: 'text-emerald-700 dark:text-emerald-400',
        bgLight: 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 border border-emerald-200/50 dark:border-emerald-800/40',
        activeChapterCard: 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-500/40 text-emerald-900 dark:text-emerald-300 ring-2 ring-emerald-500/10',
        accentBg: 'bg-emerald-600 hover:bg-emerald-700 focus:ring-emerald-500 text-white border-emerald-600',
        subPillActive: 'bg-emerald-600 dark:bg-emerald-500 text-white shadow-sm font-extrabold',
        subPillHover: 'hover:bg-emerald-500/10 hover:text-emerald-600 dark:hover:text-emerald-400',
        dotColorActive: 'bg-emerald-600 dark:bg-emerald-400 ring-4 ring-emerald-500/20 scale-125',
        dotColorCompleted: 'bg-emerald-500/50 dark:bg-emerald-400/30 hover:bg-emerald-600',
      };
    } else if (sub.includes('religia')) {
      return {
        text: 'text-amber-700 dark:text-amber-400',
        bgLight: 'bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 border border-amber-200/50 dark:border-amber-800/40',
        activeChapterCard: 'bg-amber-50 dark:bg-amber-950/40 border-amber-500/40 text-amber-900 dark:text-amber-300 ring-2 ring-amber-500/10',
        accentBg: 'bg-amber-500 hover:bg-amber-600 focus:ring-amber-500 text-white border-amber-500',
        subPillActive: 'bg-amber-600 dark:bg-amber-500 text-slate-900 dark:text-white shadow-sm font-extrabold',
        subPillHover: 'hover:bg-amber-500/10 hover:text-amber-600 dark:hover:text-amber-400',
        dotColorActive: 'bg-amber-500 dark:bg-amber-400 ring-4 ring-amber-500/20 scale-125',
        dotColorCompleted: 'bg-amber-500/50 dark:bg-amber-400/35 hover:bg-amber-600',
      };
    } else if (sub.includes('geografia') || sub.includes('astronomia') || sub.includes('kosmos')) {
      return {
        text: 'text-indigo-700 dark:text-indigo-400',
        bgLight: 'bg-indigo-50 dark:bg-indigo-950/40 text-indigo-800 dark:text-indigo-300 border border-indigo-200/50 dark:border-indigo-800/40',
        activeChapterCard: 'bg-indigo-50 dark:bg-indigo-950/40 border-indigo-500/40 text-indigo-900 dark:text-indigo-300 ring-2 ring-indigo-500/10',
        accentBg: 'bg-indigo-600 hover:bg-indigo-700 focus:ring-indigo-500 text-white border-indigo-600',
        subPillActive: 'bg-indigo-600 dark:bg-indigo-500 text-white shadow-sm font-extrabold',
        subPillHover: 'hover:bg-indigo-500/10 hover:text-indigo-600 dark:hover:text-indigo-400',
        dotColorActive: 'bg-indigo-600 dark:bg-indigo-400 ring-4 ring-indigo-500/20 scale-125',
        dotColorCompleted: 'bg-indigo-500/50 dark:bg-indigo-400/30 hover:bg-indigo-600',
      };
    } else if (sub.includes('matematyka') || sub.includes('fizyka') || sub.includes('chemia')) {
      return {
        text: 'text-rose-700 dark:text-rose-400',
        bgLight: 'bg-rose-50 dark:bg-rose-950/40 text-rose-800 dark:text-rose-300 border border-rose-200/50 dark:border-rose-800/40',
        activeChapterCard: 'bg-rose-50 dark:bg-rose-950/40 border-rose-500/40 text-rose-900 dark:text-rose-300 ring-2 ring-rose-500/10',
        accentBg: 'bg-rose-600 hover:bg-rose-700 focus:ring-rose-500 text-white border-rose-600',
        subPillActive: 'bg-rose-600 dark:bg-rose-500 text-white shadow-sm font-extrabold',
        subPillHover: 'hover:bg-rose-500/10 hover:text-rose-600 dark:hover:text-rose-400',
        dotColorActive: 'bg-rose-600 dark:bg-rose-400 ring-4 ring-rose-500/20 scale-125',
        dotColorCompleted: 'bg-rose-500/50 dark:bg-rose-400/30 hover:bg-rose-600',
      };
    } else {
      // Default: Slate / Neutral
      return {
        text: 'text-slate-700 dark:text-slate-300',
        bgLight: 'bg-slate-100 dark:bg-slate-800/70 text-slate-800 dark:text-slate-300 border border-slate-200/50 dark:border-slate-700/50',
        activeChapterCard: 'bg-slate-100 dark:bg-slate-800 border-slate-400 text-slate-900 dark:text-slate-100 ring-2 ring-slate-400/10',
        accentBg: 'bg-slate-700 hover:bg-slate-800 focus:ring-slate-500 text-white border-slate-700',
        subPillActive: 'bg-slate-800 dark:bg-slate-600 text-white shadow-sm font-extrabold',
        subPillHover: 'hover:bg-slate-500/10 hover:text-slate-600 dark:hover:text-slate-400',
        dotColorActive: 'bg-slate-700 dark:bg-slate-400 ring-4 ring-slate-500/20 scale-125',
        dotColorCompleted: 'bg-slate-400/50 dark:bg-slate-500/30 hover:bg-slate-600',
      };
    }
  };

  const getThemeConfig = () => {
    switch (theme) {
      case 'dark':
        return {
          h1: 'text-slate-50',
          h2: 'text-emerald-400',
          h3: 'text-slate-300',
          p: 'text-slate-300',
          blockquote: 'border-emerald-500 bg-slate-900/60 text-slate-400',
          tableBorder: 'border-slate-800',
          thead: 'bg-slate-900/40',
          th: 'text-slate-400',
          td: 'text-slate-300',
          strong: 'text-emerald-400 bg-emerald-400/10',
          border: 'border-slate-800',
          headerBg: 'bg-slate-900 text-slate-100 border-slate-800',
          sidebarBg: 'bg-slate-900/95 border-slate-800',
          sidebarProgressBg: 'bg-slate-950/40 border-slate-800',
          sidebarProgressText: 'text-slate-300',
          searchBg: 'bg-slate-950 border-slate-800 text-white',
          subjectPillActive: 'bg-white text-slate-950',
          subjectPillInactive: 'bg-slate-900 text-slate-400 hover:bg-slate-800',
          chapterCardActive: 'bg-emerald-950/40 border-emerald-900/60 text-white',
          chapterCardInactive: 'bg-slate-900 hover:bg-slate-800 border-slate-800 text-slate-300',
          studentNotesLabel: 'text-slate-400',
          studentNotesTextarea: 'border-slate-800 bg-slate-950 text-white focus:ring-emerald-700/35 placeholder-slate-600',
          tabGroupBg: 'bg-slate-950/80 border-slate-800',
          tabActive: 'bg-slate-800 text-slate-100 shadow-xs border border-slate-700/50',
          tabInactive: 'text-slate-500 hover:text-slate-300 hover:bg-slate-900/40',
          secondaryCardBg: 'bg-slate-900/50 border border-slate-800 text-slate-300',
          galleryPresetBtn: 'bg-slate-950 border border-slate-800 text-slate-400 hover:bg-slate-900 hover:text-emerald-400',
        };
      case 'sepia':
        return {
          h1: 'text-[#4A2D19]',
          h2: 'text-emerald-900',
          h3: 'text-[#5C4533]',
          p: 'text-[#433422]',
          blockquote: 'border-emerald-800 bg-[#fbf6ec]/30 text-[#5C4533]',
          tableBorder: 'border-[#ebdcb3]',
          thead: 'bg-[#ebdcb3]/30',
          th: 'text-[#5C4533]',
          td: 'text-[#433422]',
          strong: 'text-[#4A2D19] bg-emerald-800/10',
          border: 'border-[#ebdcb3]',
          headerBg: 'bg-[#f4ebd0] text-[#433422] border-[#ebdcb3]',
          sidebarBg: 'bg-[#f4ebd0]/95 border-[#ebdcb3]',
          sidebarProgressBg: 'bg-[#fbf6ec]/60 border-[#ebdcb3]',
          sidebarProgressText: 'text-[#5C4533]',
          searchBg: 'bg-[#fbf6ec] border-[#ebdcb3] text-[#433422]',
          subjectPillActive: 'bg-[#433422] text-[#fbf6ec]',
          subjectPillInactive: 'bg-[#ebdcb3]/40 text-[#5C4533] hover:bg-[#ebdcb3]/60',
          chapterCardActive: 'bg-emerald-800/12 border border-emerald-800/25 text-[#4D2306]',
          chapterCardInactive: 'bg-[#fbf6ec] hover:bg-[#f4ebd0] border-[#ebdcb3] text-[#433422]',
          studentNotesLabel: 'text-[#5C4533]',
          studentNotesTextarea: 'border-[#ebdcb3] bg-[#fbf6ec] text-[#433422] focus:ring-emerald-800/35 placeholder-[#a28a6f]',
          tabGroupBg: 'bg-[#ebdcb3]/30 border border-[#ebdcb3]/50',
          tabActive: 'bg-[#433422] text-[#fbf6ec] shadow-xs',
          tabInactive: 'text-[#5C4533] hover:text-[#433422] hover:bg-[#ebdcb3]/15',
          secondaryCardBg: 'bg-[#ebdcb3]/20 border border-[#ebdcb3] text-[#433422]',
          galleryPresetBtn: 'bg-[#fbf6ec] border border-[#ebdcb3] text-[#5C4533] hover:bg-[#ebdcb3]/30 hover:text-emerald-900',
        };
      case 'blue':
        return {
          h1: 'text-[#0f172a]',
          h2: 'text-[#025680]',
          h3: 'text-[#1e293b]',
          p: 'text-[#334155]',
          blockquote: 'border-[#025680] bg-[#eef2f6]/50 text-[#1e293b]',
          tableBorder: 'border-blue-100',
          thead: 'bg-blue-100/40',
          th: 'text-[#334155]',
          td: 'text-[#2c3e50]',
          strong: 'text-sky-800 bg-sky-100',
          border: 'border-blue-100',
          headerBg: 'bg-[#ebf2f7] text-[#2c3e50] border-blue-200',
          sidebarBg: 'bg-[#ebf2f7]/95 border-blue-200',
          sidebarProgressBg: 'bg-white/70 border-blue-100',
          sidebarProgressText: 'text-slate-600',
          searchBg: 'bg-white border-blue-100 text-[#2c3e50]',
          subjectPillActive: 'bg-[#2c3e50] text-[#eef2f6]',
          subjectPillInactive: 'bg-white text-[#475569] border border-blue-100 hover:bg-slate-50',
          chapterCardActive: 'bg-emerald-50 border border-emerald-200 text-emerald-900',
          chapterCardInactive: 'bg-white hover:bg-[#edf3f8] border border-blue-100 text-[#2c3e50]',
          studentNotesLabel: 'text-[#334155]',
          studentNotesTextarea: 'border-blue-200 bg-white text-[#2c3e50] focus:ring-blue-500/35 placeholder-slate-400',
          tabGroupBg: 'bg-[#ebf2f7] border border-blue-200/50',
          tabActive: 'bg-[#2c3e50] text-[#eef2f6] shadow-xs',
          tabInactive: 'text-[#475569] hover:text-[#2c3e50] hover:bg-white/50',
          secondaryCardBg: 'bg-[#ebf2f7]/65 border border-blue-100 text-[#2c3e50]',
          galleryPresetBtn: 'bg-white border border-blue-100 text-slate-600 hover:bg-[#edf3f8] hover:text-[#025680]',
        };
      case 'dyslexic':
        return {
          h1: 'text-[#111c12]',
          h2: 'text-[#14421b]',
          h3: 'text-[#1b1c1b]',
          p: 'text-[#1b1c1b]',
          blockquote: 'border-amber-700 bg-amber-50/20 text-[#1b1c1b]',
          tableBorder: 'border-amber-200',
          thead: 'bg-amber-100/30',
          th: 'text-[#1b1c1b]',
          td: 'text-[#1b1c1b]',
          strong: 'text-emerald-950 bg-emerald-100',
          border: 'border-amber-200',
          headerBg: 'bg-white text-[#1b1c1b] border-amber-200',
          sidebarBg: 'bg-white border-amber-200',
          sidebarProgressBg: 'bg-[#fef8f0]/40 border-amber-100',
          sidebarProgressText: 'text-[#1b1c1b]',
          searchBg: 'bg-white border-amber-200 text-[#1b1c1b]',
          subjectPillActive: 'bg-[#1b1c1b] text-white',
          subjectPillInactive: 'bg-[#fef8f0] text-[#555] hover:bg-amber-100/50 border border-amber-200/50',
          chapterCardActive: 'bg-emerald-50 border border-emerald-300 text-emerald-950',
          chapterCardInactive: 'bg-white hover:bg-[#fef8f0] border border-amber-200 text-[#1b1c1b]',
          studentNotesLabel: 'text-[#1b1c1b]',
          studentNotesTextarea: 'border-amber-200 bg-[#fef8f0]/40 text-[#1b1c1b] focus:ring-amber-500/35 placeholder-stone-400',
          tabGroupBg: 'bg-[#fef8f0] border border-amber-200',
          tabActive: 'bg-[#1b1c1b] text-white shadow-xs',
          tabInactive: 'text-[#555] hover:text-[#1b1c1b] hover:bg-[#ebdcb3]/15',
          secondaryCardBg: 'bg-[#fef8f0]/80 border border-amber-200 text-[#1b1c1b]',
          galleryPresetBtn: 'bg-white border border-amber-200 text-[#555] hover:bg-[#fef8f0] hover:text-[#1b1c1b]',
        };
      default: // light
        return {
          h1: 'text-[#2A3F33]',
          h2: 'text-emerald-800',
          h3: 'text-[#5A5450]',
          p: 'text-[#433D3C]',
          blockquote: 'border-emerald-700 bg-emerald-50/20 text-[#5A5450]',
          tableBorder: 'border-[#EDEAE2]',
          thead: 'bg-[#EDEAE2]/30',
          th: 'text-[#5A5450]',
          td: 'text-[#433D3C]',
          strong: 'text-emerald-900 bg-emerald-700/10',
          border: 'border-[#EDEAE2]',
          headerBg: 'bg-white text-[#433D3C] border-[#EBEAE4]',
          sidebarBg: 'bg-[#FBFBFA]/90 border-[#EBEAE4]',
          sidebarProgressBg: 'bg-slate-50/70 border-[#EDEAE2]/60',
          sidebarProgressText: 'text-slate-600',
          searchBg: 'bg-white border-slate-200 text-slate-800',
          subjectPillActive: 'bg-slate-800 text-white',
          subjectPillInactive: 'bg-slate-100 text-slate-600 hover:bg-slate-200 border border-slate-200/30',
          chapterCardActive: 'bg-emerald-50/75 border border-emerald-200 text-emerald-900',
          chapterCardInactive: 'bg-white hover:bg-[#FBFBFA] border border-slate-200 text-[#433D3C]',
          studentNotesLabel: 'text-[#5A5450]',
          studentNotesTextarea: 'border-[#EDEAE2] bg-slate-50/50 text-slate-800 focus:ring-emerald-700/10 placeholder-slate-400',
          tabGroupBg: 'bg-slate-100 border border-slate-200/50',
          tabActive: 'bg-white text-slate-800 shadow-xs border border-slate-200/20',
          tabInactive: 'text-slate-500 hover:text-[#2A3F33] hover:bg-slate-50',
          secondaryCardBg: 'bg-slate-50/50 border border-slate-200 text-slate-700',
          galleryPresetBtn: 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-slate-800',
        };
    }
  };

  const activeThemeConfig = getThemeConfig();

  // Render Theme classes
  const getThemeClasses = () => {
    switch (theme) {
      case 'dark':
        return 'bg-slate-950 text-slate-100 dark';
      case 'sepia':
        return 'bg-[#fbf6ec] text-[#433422]';
      case 'blue':
        return 'bg-[#eef2f6] text-[#2c3e50]';
      case 'dyslexic':
        return 'bg-[#fef8f0] text-[#1b1c1b]';
      default: // light (Natural Tones main palette)
        return 'bg-[#F7F6F2] text-[#433D3C]';
    }
  };

  const getPageCardClasses = () => {
    switch (theme) {
      case 'dark':
        return 'bg-slate-900 border-slate-800 text-slate-200';
      case 'sepia':
        return 'bg-[#f4ebd0] border-[#e7daaf] text-[#433422]';
      case 'blue':
        return 'bg-white border-blue-100 text-slate-800';
      case 'dyslexic':
        return 'bg-[#fff] border-amber-100 text-[#1b1c1b]';
      default: // light
        return 'bg-white border-[#EBEAE4] text-[#433D3C] shadow-[0_10px_30px_rgba(0,0,0,0.02)]';
    }
  };

  const textStyle = {
    fontSize: `${fontSize}%`,
    lineHeight: lineHeight === 'normal' ? '1.5' : lineHeight === 'relaxed' ? '1.8' : '2.1',
    fontFamily: theme === 'dyslexic' 
      ? '"Comic Sans MS", "Chalkboard SE", "Comic Neue", sans-serif' 
      : 'system-ui, -apple-system, sans-serif'
  };

  return (
    <div id="multibook-app-root" className={`min-h-screen flex flex-col font-sans transition-all duration-300 ${getThemeClasses()}`}>
      
      {/* Top Humble Header */}
      {!isReadingMode && (
        <header className={`border-b px-5 py-3 flex items-center justify-between shrink-0 z-30 shadow-xs transition-all duration-300 ${activeThemeConfig.headerBg}`}>
          <div className="flex items-center gap-3">
            <button
              id="mobile-sidebar-toggle-btn"
              onClick={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
              className="p-1 px-2.5 bg-slate-100/80 hover:bg-slate-200/80 dark:bg-slate-900 dark:hover:bg-slate-800 text-slate-800 dark:text-white rounded-lg text-sm lg:hidden cursor-pointer font-semibold transition-all"
            >
              Spis treści
            </button>
            
            <div className="hidden sm:flex items-center gap-2 font-serif">
              <span className="p-2 bg-emerald-700 dark:bg-emerald-650 rounded-xl text-white">
                <BookOpen className="w-5 h-5" />
              </span>
              <div>
                <h1 id="brand-title" className={`text-base font-bold tracking-tight leading-4 transition-colors ${activeThemeConfig.h1}`}>Interaktywny Multibook</h1>
                <p className="text-[10px] text-slate-500 font-medium font-sans opacity-85">Baza lekcji i ćwiczeń offline</p>
              </div>
            </div>
          </div>

          {/* Global settings widget */}
          <div className="flex items-center gap-1.5 sm:gap-3">
            <button
              id="global-whiteboard-toggle-btn"
              onClick={() => setIsDrawingModeActive(!isDrawingModeActive)}
              className={`px-3 py-1.5 rounded-xl font-bold text-xs flex items-center gap-1.5 border transition-all cursor-pointer ${
                isDrawingModeActive
                  ? 'bg-rose-600 text-white border-rose-700 shadow-sm'
                  : 'bg-rose-100 hover:bg-rose-200 text-rose-900 border-rose-200 dark:bg-rose-950/40 dark:text-rose-300 dark:border-rose-900/40'
              }`}
            >
              <Tv className="w-4 h-4" />
              <span>Tablica-Szkicownik {isDrawingModeActive ? '(WŁ.)' : ''}</span>
            </button>

            <button
              id="teacher-panel-toggle-btn"
              onClick={() => {
                setActiveMainTab(activeMainTab === 'lessons' ? 'teacher-panel' : 'lessons');
                setIsMobileSidebarOpen(false);
              }}
              className={`px-3 py-1.5 rounded-xl font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer ${
                activeMainTab === 'teacher-panel'
                  ? getPrimaryBtnClass()
                  : activeThemeConfig.galleryPresetBtn
              }`}
            >
              <Users className="w-4 h-4" />
              <span>{activeMainTab === 'teacher-panel' ? 'Widok lekcji 📖' : 'Panel Nauczyciela 🏫'}</span>
            </button>

            <button
              id="student-notes-toggle-btn"
              onClick={() => setIsNotesOpen(!isNotesOpen)}
              className={`px-3 py-1.5 rounded-xl font-bold text-xs flex items-center gap-1.5 cursor-pointer transition-all ${
                isNotesOpen
                  ? 'bg-emerald-700 text-white shadow-xs'
                  : activeThemeConfig.galleryPresetBtn
              }`}
            >
              <FileText className="w-4 h-4" />
              <span>Dziennik & Notatki 🏫</span>
            </button>

            <button
              id="clean-reset-db-btn"
              onClick={handleResetToDefault}
              className="p-1 px-1.5 text-slate-400 hover:text-red-500 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/20 rounded-lg cursor-pointer transition-colors"
              title="Przywróć domyślne działy"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>
        </header>
      )}

      {/* Main Container */}
      <div className="flex-1 flex relative overflow-hidden">

        {/* SIDEBAR: Table of Contents (collapsible / responsive drawer) */}
        <aside
          id="multibook-sidebar"
          className={`shrink-0 border-r w-80 p-4 flex flex-col gap-4 absolute top-0 bottom-0 left-0 z-45 transition-all duration-300 ${
            isReadingMode 
              ? 'hidden pointer-events-none' 
              : `lg:static lg:translate-x-0 ${isMobileSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`
          } ${activeThemeConfig.sidebarBg} ${activeThemeConfig.border}`}
        >
          {/* Top of Sidebar Info & Actions */}
          <div className="space-y-3 shrink-0">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Tematy lekcji</span>
              <button
                id="add-chapter-sidebar-btn"
                onClick={() => {
                  setEditingChapter(null);
                  setIsCreatorOpen(true);
                  setIsMobileSidebarOpen(false);
                }}
                className="px-2.5 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-400 font-bold text-xs rounded-lg flex items-center gap-1.5 cursor-pointer transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Dodaj lekcję</span>
              </button>
            </div>

            {/* Toggle View Mode button in sidebar */}
            <button
              id="sidebar-view-mode-toggle"
              onClick={() => {
                setActiveMainTab(activeMainTab === 'lessons' ? 'teacher-panel' : 'lessons');
                setIsMobileSidebarOpen(false);
              }}
              className={`w-full p-2.5 rounded-xl border text-xs font-extrabold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                activeMainTab === 'teacher-panel'
                  ? getPrimaryBtnClass()
                  : activeThemeConfig.galleryPresetBtn
              }`}
            >
              <Users className="w-3.5 h-3.5 shrink-0" />
              <span>{activeMainTab === 'teacher-panel' ? 'Przejdź do lekcji 📖' : 'Otwórz Panel Nauczyciela 🏫'}</span>
            </button>

            {/* General progress stats */}
            <div className={`p-3 rounded-xl border transition-all duration-300 ${activeThemeConfig.sidebarProgressBg}`}>
              <div className={`flex items-center justify-between text-xs mb-1.5 transition-colors duration-300 ${activeThemeConfig.sidebarProgressText}`}>
                <span className="font-semibold flex items-center gap-1">
                  <Award className="w-3.5 h-3.5 text-emerald-500" />
                  <span>Twój postęp:</span>
                </span>
                <span className="font-mono font-bold">
                  {completedChaptersCount} / {totalChaptersCount} ({completionPercentage}%)
                </span>
              </div>
              <div className="w-full bg-slate-200 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                <div 
                  className="bg-emerald-700 dark:bg-emerald-600 h-full rounded-full transition-all duration-500"
                  style={{ width: `${completionPercentage}%` }}
                />
              </div>
            </div>

            {/* Deep searching input */}
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                id="sidebar-search-input"
                type="text"
                placeholder="Szukaj lekcji lub frazy..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={`w-full pl-9 pr-4 py-2 text-xs border rounded-xl focus:outline-hidden focus:ring-2 focus:ring-emerald-700/10 transition-all duration-300 ${activeThemeConfig.searchBg}`}
              />
            </div>

            {/* School Types pills selector */}
            <div className="space-y-1.5 pb-1.5 border-b border-stone-200/50 dark:border-slate-800/80">
              <span className="block text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                Typ szkoły:
              </span>
              <div className="flex flex-wrap gap-1">
                {schoolTypesList.map((st) => (
                  <button
                    key={st}
                    id={`school-pill-${st}`}
                    onClick={() => setSelectedSchoolType(st)}
                    className={`px-2 py-0.5 text-[10px] font-bold rounded-md cursor-pointer transition-all ${
                      selectedSchoolType === st
                        ? activeThemeConfig.subjectPillActive
                        : activeThemeConfig.subjectPillInactive
                    }`}
                  >
                    {st}
                  </button>
                ))}
              </div>
            </div>

            {/* Grades/Classes pills selector */}
            <div className="space-y-1.5 pb-1.5 border-b border-stone-200/50 dark:border-slate-800/80">
              <span className="block text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                Klasa / Poziom:
              </span>
              <div className="flex flex-wrap gap-1">
                {gradesList.map((gr) => (
                  <button
                    key={gr}
                    id={`grade-pill-${gr}`}
                    onClick={() => setSelectedGrade(gr)}
                    className={`px-2 py-0.5 text-[10px] font-bold rounded-md cursor-pointer transition-all ${
                      selectedGrade === gr
                        ? activeThemeConfig.subjectPillActive
                        : activeThemeConfig.subjectPillInactive
                    }`}
                  >
                    {gr}
                  </button>
                ))}
              </div>
            </div>

            {/* Subject horizontal pills selector */}
            <div className="space-y-1.5 pb-1">
              <span className="block text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                Przedmiot:
              </span>
              <div className="flex flex-wrap gap-1">
                {subjects.map((sub) => {
                  const isActive = selectedSubject === sub;
                  const colors = getSubjectThemeColors(sub, theme);
                  return (
                    <button
                      key={sub}
                      id={`subject-pill-${sub}`}
                      onClick={() => setSelectedSubject(sub)}
                      className={`px-2.5 py-1 text-[10px] font-extrabold rounded-md cursor-pointer transition-all ${
                        isActive
                          ? colors.subPillActive
                          : `${activeThemeConfig.subjectPillInactive} ${colors.subPillHover}`
                      }`}
                    >
                      {sub}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Chapters listing list block (Hierarchical Tree View) */}
          <div className="flex-1 overflow-y-auto space-y-4 pr-1">
            {filteredChapters.length > 0 ? (
              Object.entries(groupedChapters).map(([sType, sGrades]) => (
                <div key={sType} className="space-y-2 border-b border-slate-100 dark:border-slate-800/30 pb-3 last:border-0 last:pb-0">
                  {/* School Type Header Banner */}
                  <div className={`flex items-center gap-1.5 px-2 py-1 text-[10px] font-bold uppercase tracking-wider rounded-lg ${activeThemeConfig.tabGroupBg} ${activeThemeConfig.studentNotesLabel}`}>
                    <span>🏫</span>
                    <span className="truncate">{sType}</span>
                  </div>

                  <div className="space-y-3 pl-1">
                    {Object.entries(sGrades).map(([sGrade, sGroups]) => (
                      <div key={sGrade} className="space-y-2 PL_GRADE pl-1.5">
                        {/* Class/Grade Label Pill */}
                        <div className="flex items-center gap-1 text-[9px] font-bold text-emerald-800 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded-full w-max">
                          <span>🎓</span>
                          <span>{sGrade}</span>
                        </div>

                        <div className="space-y-2.5 pl-2">
                          {Object.entries(sGroups).map(([sGroup, chaptersListInGroup]) => (
                            <div key={sGroup} className="space-y-1">
                              {/* Chapter Group Section header (Dział nadrzędny) */}
                              <div className="flex items-center gap-1 text-[9px] font-semibold text-slate-500 dark:text-slate-400 py-0.5 uppercase tracking-wide">
                                <span className="text-emerald-600">📂 Rozdział:</span>
                                <span className="truncate">{sGroup}</span>
                              </div>

                              {/* Lesson list under this group */}
                              <div className="space-y-1 pl-1 ml-1 border-l border-emerald-600/10 dark:border-emerald-500/10">
                                {chaptersListInGroup.map((ch) => {
                                  const isCurrent = ch.id === activeChapter?.id;
                                  const isCompleted = progress.completedChapters.includes(ch.id);
                                  const isBookmarked = progress.bookmarkedChapters.includes(ch.id);
                                  const hasNotes = !!progress.chapterNotes[ch.id];

                                  return (
                                    <div
                                      key={ch.id}
                                      id={`chapter-card-${ch.id}`}
                                      onClick={() => {
                                        setCurrentChapterId(ch.id);
                                        setIsMobileSidebarOpen(false);
                                        setIsDrawingModeActive(false); // clear drawing overlays for fresh chapters
                                      }}
                                      className={`p-2.5 rounded-xl border transition-all cursor-pointer group flex flex-col gap-1 ${
                                        isCurrent
                                          ? `${getSubjectThemeColors(ch.subject, theme).activeChapterCard} font-bold`
                                          : `${activeThemeConfig.chapterCardInactive}`
                                      }`}
                                    >
                                      <div className="flex items-start justify-between gap-1.5">
                                        <span className="text-xs font-semibold leading-snug text-current transition-colors">
                                          {ch.title}
                                        </span>
                                        <div className="flex items-center gap-1 shrink-0">
                                          {isBookmarked && (
                                            <span className="text-amber-500 text-[10px]" title="Zakładka">
                                              ★
                                            </span>
                                          )}
                                          {isCompleted ? (
                                            <span className="text-emerald-500 font-bold text-[11px]" title="Ukończona lekcja">✓</span>
                                          ) : (
                                            <span className="text-slate-300 dark:text-slate-700 text-[10px]">○</span>
                                          )}
                                        </div>
                                      </div>

                                      <div className="flex flex-wrap items-center justify-between gap-1 mt-0.5 text-[9px] text-slate-400 dark:text-slate-500 font-sans">
                                        <span className={`p-0.5 px-1.5 rounded text-[8px] font-extrabold ${getSubjectThemeColors(ch.subject, theme).bgLight}`}>
                                          {ch.subject}
                                        </span>
                                        <div className="flex items-center gap-1.5">
                                          <span>⏱️ {ch.estimatedReadTime} min</span>
                                          {hasNotes && <span title="Posiada notatki">📝</span>}
                                          
                                          {/* Option to delete any chapter */}
                                          <button
                                            id={`delete-chapter-btn-${ch.id}`}
                                            onClick={(e) => handleDeleteChapter(ch.id, e)}
                                            className="text-rose-400 hover:text-rose-600 dark:text-rose-500 dark:hover:text-rose-400 opacity-40 md:opacity-0 group-hover:opacity-100 transition-opacity p-0.5 cursor-pointer ml-1"
                                            title="Usuń tę lekcję"
                                          >
                                            <Trash2 className="w-3 h-3" />
                                          </button>
                                        </div>
                                      </div>
                                    </div>
                                  );
                                })}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8 px-4">
                <p className="text-xs text-slate-500 dark:text-slate-400">Brak rozdziałów spełniających kryteria.</p>
              </div>
            )}
          </div>

          {/* Quick info about book bottom pane with Backup Export / Import */}
          <div className={`text-[10px] text-slate-500 mt-auto pt-3 border-t ${activeThemeConfig.border} space-y-2.5 shrink-0 select-none animate-in fade-in duration-305`}>
            <div className={`p-2.5 rounded-xl ${activeThemeConfig.secondaryCardBg}`}>
              <span className={`font-extrabold block uppercase text-[8.5px] tracking-wider mb-2 transition-colors duration-300 ${activeThemeConfig.studentNotesLabel}`}>
                💾 Kopia bezpieczeństwa:
              </span>
              <div className="flex gap-1.5">
                <button
                  type="button"
                  id="export-db-backup-btn"
                  onClick={handleExportDatabase}
                  className="flex-1 py-1.5 px-2 bg-emerald-700 hover:bg-emerald-800 dark:bg-emerald-600 dark:hover:bg-emerald-500 text-white rounded-lg text-[9.5px] font-extrabold cursor-pointer transition-all flex items-center justify-center gap-1 active:scale-95 shadow-3xs"
                  title="Pobierz backup wszystkich danych (postępy, notatki, rozdziały) do pliku JSON"
                >
                  <Download className="w-3 h-3 shrink-0" />
                  <span>Eksport</span>
                </button>
                <label
                  id="import-db-backup-label"
                  className={`flex-1 py-1.5 px-2 rounded-lg text-[9.5px] font-extrabold cursor-pointer transition-all flex items-center justify-center gap-1 active:scale-95 ${activeThemeConfig.galleryPresetBtn}`}
                  title="Wczytaj backup wszystkich danych z pliku JSON"
                >
                  <Upload className="w-3 h-3 shrink-0 text-emerald-600 dark:text-emerald-500" />
                  <span>Import</span>
                  <input
                    type="file"
                    accept=".json"
                    onChange={handleImportDatabase}
                    className="hidden"
                  />
                </label>
              </div>
            </div>
            <div className="flex justify-between items-center px-1">
              <p className="font-bold text-slate-600 dark:text-slate-400 uppercase tracking-widest text-[8px]">Interaktywny Multibook v1.3</p>
              <p className="text-[8px] text-slate-400 dark:text-slate-500">Wydanie offline</p>
            </div>
          </div>
        </aside>

        {/* MOBILE SIDEBAR DRAW OUTS OVERLAY */}
        <AnimatePresence>
          {isMobileSidebarOpen && (
            <motion.div 
              key="mobile-sidebar-blur-overlay"
              id="mobile-sidebar-blur-overlay"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 bg-black/30 backdrop-blur-xs z-40 lg:hidden"
              onClick={() => setIsMobileSidebarOpen(false)}
            />
          )}
        </AnimatePresence>

        {/* MASTER VIEWPORT (MAIN MULTIBOOK CONTENT PAGE) */}
        <main 
          id="multibook-content-viewport" 
          className={isContentFullscreen 
            ? "fixed inset-0 z-50 flex flex-col transition-all duration-300 overflow-hidden" 
            : "flex-1 flex flex-col overflow-hidden relative"
          }
          style={isContentFullscreen ? {
            backgroundColor: theme === 'sepia' ? '#fbf6ec' : theme === 'blue' ? '#eef2f6' : theme === 'dyslexic' ? '#fef8f0' : theme === 'dark' ? '#020617' : '#F7F6F2',
            color: theme === 'sepia' ? '#433422' : theme === 'blue' ? '#2c3e50' : theme === 'dyslexic' ? '#1b1c1b' : theme === 'dark' ? '#f1f5f9' : '#433D3C'
          } : undefined}
        >
          {activeMainTab === 'teacher-panel' ? (
            renderTeacherPanelDashboard()
          ) : (
            <>
              {/* View Config Settings row over chapter content */}
          <div className={`border-b px-4 py-2.5 flex flex-wrap items-center justify-between gap-3 shrink-0 backdrop-blur-md transition-all duration-300 ${activeThemeConfig.headerBg}`}>
            
            {/* Subject name of active class */}
            <div className="flex items-center gap-2">
              <span className={`p-1 px-2.5 text-[10px] font-extrabold rounded-lg uppercase tracking-wider ${getSubjectThemeColors(activeChapter?.subject || '', theme).bgLight}`}>
                {activeChapter?.subject || 'Brak'}
              </span>
              <span className="text-[11px] text-slate-600 dark:text-slate-400">• Czas nauki: {activeChapter?.estimatedReadTime || 0} min.</span>
            </div>

            {/* Custom display adjustments widgets */}
            <div className="flex items-center gap-2 flex-wrap">
              
              {/* Dynamic Font selection picker dropdown */}
              <div className="flex items-center gap-1.5 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
                <span className="text-[10px] font-bold text-slate-500 px-1 hidden md:inline">Styl tekstu:</span>
                
                {/* Font-size buttons */}
                <button
                  id="font-size-dec-btn"
                  onClick={() => setFontSize(Math.max(80, fontSize - 5))}
                  className="w-6 h-6 bg-white dark:bg-slate-700 rounded-md text-xs font-bold leading-none cursor-pointer hover:bg-slate-50"
                  title="Zmniejsz tekst"
                >
                  A-
                </button>
                <span className="text-[10px] font-mono font-bold w-9 text-center text-slate-700 dark:text-slate-300">
                  {fontSize}%
                </span>
                <button
                  id="font-size-inc-btn"
                  onClick={() => setFontSize(Math.min(145, fontSize + 5))}
                  className="w-6 h-6 bg-white dark:bg-slate-700 rounded-md text-xs font-bold leading-none cursor-pointer hover:bg-slate-50"
                  title="Powiększ tekst"
                >
                  A+
                </button>
              </div>

              {/* Interline/Line height picker */}
              <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-xl text-[10px] font-bold">
                <button
                  id="lineheight-norm-btn"
                  onClick={() => setLineHeight('normal')}
                  className={`px-1.5 py-1 rounded-md cursor pointer transition-all ${
                    lineHeight === 'normal' ? 'bg-white dark:bg-slate-700 text-slate-800 dark:text-white' : 'text-slate-500'
                  }`}
                  title="Interlinia: wąska"
                >
                  Wąska
                </button>
                <button
                  id="lineheight-relax-btn"
                  onClick={() => setLineHeight('relaxed')}
                  className={`px-1.5 py-1 rounded-md cursor pointer transition-all ${
                    lineHeight === 'relaxed' ? 'bg-white dark:bg-slate-700 text-slate-800 dark:text-white' : 'text-slate-500'
                  }`}
                  title="Interlinia: normalna"
                >
                  Normalna
                </button>
                <button
                  id="lineheight-loose-btn"
                  onClick={() => setLineHeight('loose')}
                  className={`px-1.5 py-1 rounded-md cursor-pointer transition-all ${
                    lineHeight === 'loose' ? 'bg-white dark:bg-slate-700 text-slate-800 dark:text-white' : 'text-slate-500'
                  }`}
                  title="Interlinia: szeroka"
                >
                  Szeroka
                </button>
              </div>

              <div className="w-[1px] h-5 bg-slate-200 dark:bg-slate-800" />

              {/* Theme selection buttons */}
              <div className="flex items-center gap-1">
                {(['light', 'sepia', 'blue', 'dark', 'dyslexic'] as ThemeType[]).map((thm) => {
                  const labelMap: Record<ThemeType, string> = {
                    light: 'Jasny',
                    sepia: 'Sepia',
                    blue: 'Niebieski',
                    dark: 'Ciemny',
                    dyslexic: 'Dla dyslektyków'
                  };
                  const colorMap: Record<ThemeType, string> = {
                    light: 'bg-white border-slate-300',
                    sepia: 'bg-[#f4ebd0] border-[#c0b080]',
                    blue: 'bg-blue-100 border-blue-400',
                    dark: 'bg-slate-800 border-slate-700',
                    dyslexic: 'bg-[#fff5e6] border-orange-200'
                  };
                  return (
                    <button
                      key={thm}
                      id={`theme-btn-${thm}`}
                      onClick={() => setTheme(thm)}
                      className={`w-5 h-5 rounded-full border transition-all cursor-pointer ${colorMap[thm]} ${
                        theme === thm ? 'scale-115 ring-2 ring-emerald-700 ring-offset-2' : 'opacity-70 hover:opacity-100'
                      }`}
                      title={`${labelMap[thm]} motyw`}
                    />
                  );
                })}
              </div>

              <div className={`w-[1px] h-5 border-l ${activeThemeConfig.border}`} />

              {/* Fullscreen focus mode toggle */}
              <button
                id="toggle-fullscreen-focus-btn"
                onClick={toggleFullscreen}
                className={`px-3 py-1.5 rounded-xl font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer ${
                  isContentFullscreen
                    ? 'bg-emerald-700 text-white shadow-xs'
                    : activeThemeConfig.galleryPresetBtn
                }`}
                title={isContentFullscreen ? 'Wyjdź z trybu pełnoekranowego' : 'Włącz tryb pełnoekranowego skupienia'}
              >
                {isContentFullscreen ? (
                  <>
                    <Minimize className="w-3.5 h-3.5" />
                    <span>Zamknij pełny ekran</span>
                  </>
                ) : (
                  <>
                    <Maximize className="w-3.5 h-3.5" />
                    <span>Pełny ekran</span>
                  </>
                )}
              </button>

              <div className={`w-[1px] h-5 border-l ${activeThemeConfig.border}`} />

              {/* Reading Mode Toggle */}
              <button
                id="toggle-reading-mode-btn"
                onClick={() => setIsReadingMode(!isReadingMode)}
                className={`px-3 py-1.5 rounded-xl font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer ${
                  isReadingMode
                    ? 'bg-amber-600 hover:bg-amber-700 text-white shadow-xs'
                    : activeThemeConfig.galleryPresetBtn
                }`}
                title={isReadingMode ? 'Wyjdź z Trybu Czytania' : 'Włącz Tryb Czytania (ukrywa menu i panel boczny)'}
              >
                <BookOpen className="w-3.5 h-3.5" />
                <span>{isReadingMode ? 'Tryb Czytania (WŁ.)' : 'Tryb Czytania'}</span>
              </button>
            </div>
          </div>

          {/* Active Work Area Wrapper (Contains Drawing canvas overlay + Markdown viewer scrolling space) */}
          <div className="flex-1 overflow-hidden relative flex flex-col">

            {/* Drawing Layer overlay container */}
            <DrawingOverlay 
              isActive={isDrawingModeActive} 
              onClose={() => setIsDrawingModeActive(false)} 
            />

            {/* Scrolling Viewport wrapper for MD Content */}
            <div id="multibook-reader-scroll-viewport" className="flex-1 overflow-y-auto px-4 py-6 md:p-8 space-y-8 select-text">
              <AnimatePresence mode="wait">
                {activeChapter ? (
                  <motion.article
                    key={activeChapter.id}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -12 }}
                    transition={{ duration: 0.28, ease: 'easeInOut' }}
                    className={tocItems.length > 1 
                      ? "w-full max-w-5xl xl:max-w-7xl 2xl:max-w-[90%] 3xl:max-w-[95%] mx-auto xl:grid xl:grid-cols-12 xl:gap-8 space-y-6 xl:space-y-0" 
                      : "w-full max-w-3xl xl:max-w-5xl 2xl:max-w-7xl 3xl:max-w-[90%] 4xl:max-w-[95%] mx-auto space-y-6"
                    }
                  >
                    <div className={tocItems.length > 1 ? "xl:col-span-8 2xl:col-span-9 3xl:col-span-10 space-y-6" : "space-y-6"}>
                  
                  {/* Title and Top interactive bar */}
                  <div className={`pb-4 border-b flex items-start justify-between gap-4 transition-all duration-300 ${activeThemeConfig.border}`}>
                    <div>
                      <h2 
                        id="active-chapter-title"
                        className={`text-2xl md:text-3.5xl font-extrabold tracking-tight transition-colors duration-300 ${activeThemeConfig.h1}`}
                        style={{ fontFamily: textStyle.fontFamily }}
                      >
                        {isReadingMode ? removeReadingSymbols(activeChapter.title) : activeChapter.title}
                      </h2>
                      <div className="flex flex-wrap items-center gap-2 mt-1.5 text-xs text-slate-500 opacity-95">
                        <span className={`p-0.5 px-2 rounded-md font-extrabold text-[10px] ${getSubjectThemeColors(activeChapter.subject, theme).bgLight}`}>
                          {activeChapter.subject}
                        </span>
                        <span className={`p-0.5 px-2 rounded-md font-extrabold text-[10px] ${getSubjectThemeColors(activeChapter.subject, theme).bgLight}`}>
                          🎓 {activeChapter.educationLevel || 'Ogólny'}
                        </span>
                        <span className="mx-1 text-slate-300 dark:text-slate-700">|</span>
                        <span className="text-[11px] text-slate-500 dark:text-slate-400">Utworzono: {new Date(activeChapter.createdAt).toLocaleDateString('pl-PL')}</span>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-2 shrink-0">


                      {/* Bookmark chapter toggler */}
                      <button
                        id="chapter-bookmark-toggle-btn"
                        onClick={() => handleToggleBookmark(activeChapter.id)}
                        className={`p-2 rounded-xl border transition-all cursor-pointer ${
                          progress.bookmarkedChapters.includes(activeChapter.id)
                            ? 'bg-amber-500 text-white border-amber-500 shadow-md shadow-amber-100 dark:shadow-none'
                            : 'bg-white dark:bg-slate-900 text-slate-400 hover:text-slate-600 border-slate-200 dark:border-slate-800'
                        }`}
                        title="Zapisz do zakładek"
                      >
                        <Bookmark className="w-4 h-4" />
                      </button>

                      {/* Completed/Mark-as-done chapter */}
                      <button
                        id="chapter-complete-toggle-btn"
                        onClick={() => handleToggleCompleted(activeChapter.id)}
                        className={`px-3 py-2 rounded-xl border font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer ${
                          progress.completedChapters.includes(activeChapter.id)
                            ? `${getSubjectThemeColors(activeChapter.subject, theme).accentBg} shadow-md`
                            : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-800 hover:bg-slate-50'
                        }`}
                      >
                        {progress.completedChapters.includes(activeChapter.id) ? (
                          <>
                            <span className="font-bold">✓</span>
                            <span>Ukończone</span>
                          </>
                        ) : (
                          <>
                            <span className="w-2 h-2 rounded-full bg-slate-300 dark:bg-slate-600" />
                            <span>Oznacz jako przeczytane</span>
                          </>
                        )}
                      </button>

                      {/* Delete current chapter */}
                      <button
                        id="chapter-delete-active-btn"
                        onClick={(e) => handleDeleteChapter(activeChapter.id, e)}
                        className="p-2 rounded-xl border border-rose-200 dark:border-rose-900 text-rose-500 hover:text-white hover:bg-rose-500 dark:hover:bg-rose-600 transition-all cursor-pointer"
                        title="Usuń tę lekcję"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* INLINE COLLAPSIBLE TABLE OF CONTENTS CARD (shown on mobile, and optionally on desktop) */}
                  {tocItems.length > 1 && (
                    <div 
                      id="chapter-toc-inline-card" 
                      className={`xl:hidden p-4 rounded-2xl border transition-all duration-300 ${activeThemeConfig.secondaryCardBg} shadow-3xs`}
                    >
                      <button
                        onClick={() => setIsTocExpanded(!isTocExpanded)}
                        className="w-full flex items-center justify-between font-serif font-black text-sm tracking-tight cursor-pointer focus:outline-none"
                      >
                        <span className="flex items-center gap-2">
                          <List className="w-4 h-4 text-amber-600 dark:text-amber-500" />
                          <span className={`${activeThemeConfig.h3}`}>Spis treści lekcji</span>
                        </span>
                        <span className="text-xs font-sans font-extrabold text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 transition-colors flex items-center gap-1">
                          {isTocExpanded ? 'Ukryj' : 'Pokaż'}
                          <ChevronRight className={`w-3.5 h-3.5 transform transition-transform duration-200 ${isTocExpanded ? 'rotate-90' : ''}`} />
                        </span>
                      </button>

                      <AnimatePresence initial={false}>
                        {isTocExpanded && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.23, ease: 'easeInOut' }}
                            className="overflow-hidden mt-3 pt-3 border-t border-slate-200/40 dark:border-slate-800/40"
                          >
                            <nav className="space-y-1.5 max-h-64 overflow-y-auto pr-2">
                              {tocItems.map((item) => (
                                <button
                                  key={item.id}
                                  onClick={() => scrollToSection(item.id)}
                                  className={`w-full text-left text-xs font-sans hover:underline focus:outline-none block transition-all cursor-pointer ${
                                    item.level === 1
                                      ? 'pl-0 font-extrabold text-slate-800 dark:text-slate-200'
                                      : item.level === 2
                                      ? 'pl-4 text-slate-600 dark:text-slate-300 font-semibold'
                                      : 'pl-8 text-slate-500 dark:text-slate-400 font-medium'
                                  } ${activeHeadingId === item.id ? 'text-amber-700 dark:text-amber-400 font-black scale-[1.01]' : ''}`}
                                >
                                  {item.text}
                                </button>
                              ))}
                            </nav>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  )}

                  {/* HIGH-RES RENDERED MARKDOWN ENGINE CONTAINER */}
                  <div 
                    id="multibook-rendered-markdown-content"
                    className="prose dark:prose-invert max-w-none transition-all space-y-6"
                    style={textStyle}
                  >
                    {sections.map((section) => {
                      const isThisSpeaking = speakingSectionId === section.id;
                      return (
                        <div 
                          key={section.id} 
                          className={`relative group/sec-block rounded-2xl p-5 md:p-6 transition-all duration-300 border ${
                            isThisSpeaking
                              ? 'bg-amber-50/15 border-amber-500/40 shadow-sm'
                              : 'bg-white/40 dark:bg-slate-900/10 border-transparent hover:border-slate-250 dark:hover:border-slate-800/80 hover:bg-slate-50/50 dark:hover:bg-slate-900/20'
                          }`}
                        >
                          {/* Floating Speaker Control inside each block */}
                          <div className="absolute top-4 right-4 z-10 flex items-center gap-1.5 transition-opacity opacity-75 hover:opacity-100 md:opacity-0 md:group-hover/sec-block:opacity-100">
                            <button
                              type="button"
                              onClick={() => handleToggleSectionSpeech(section.id, section.plainText)}
                              className={`p-1.5 px-2.5 rounded-lg text-xs font-extrabold flex items-center gap-1.5 transition-all shadow-3xs cursor-pointer border ${
                                isThisSpeaking
                                  ? isSpeakingPaused
                                    ? 'bg-amber-500 text-white border-amber-500 shadow-sm'
                                    : 'bg-emerald-600 text-white border-emerald-600 shadow-sm animate-pulse'
                                  : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800'
                              }`}
                              title={isThisSpeaking ? (isSpeakingPaused ? "Wznów czytanie tej części" : "Wstrzymaj czytanie") : "Przeczytaj tę część na głos"}
                            >
                              {isThisSpeaking ? (
                                isSpeakingPaused ? (
                                  <Play className="w-3 h-3" />
                                ) : (
                                  <Pause className="w-3 h-3" />
                                )
                              ) : (
                                <Volume2 className="w-3 h-3" />
                              )}
                              <span className="text-[10px]">
                                {isThisSpeaking ? (isSpeakingPaused ? "Wznów" : "Pauza") : "Lektor 🔊"}
                              </span>
                            </button>

                            {isThisSpeaking && (
                              <button
                                type="button"
                                onClick={handleStopSectionSpeech}
                                className="p-1.5 rounded-lg bg-rose-50 dark:bg-rose-950/20 text-rose-500 hover:bg-rose-500 hover:text-white transition-all shadow-3xs cursor-pointer border border-rose-100 dark:border-rose-950/40"
                                title="Zatrzymaj lektora"
                              >
                                <VolumeX className="w-3 h-3" />
                              </button>
                            )}
                          </div>

                          <ReactMarkdown
                            components={{
                              h1: ({node, ...props}) => {
                                const text = getChildrenText(props.children);
                                const id = getCleanId(text);
                                return <h1 id={id} className={`scroll-mt-12 text-2xl md:text-3.5xl font-serif font-bold mt-2 mb-4 leading-tight tracking-tight border-b pb-2.5 transition-all duration-300 ${activeThemeConfig.h1} ${activeThemeConfig.border}`} {...props} />;
                              },
                              h2: ({node, ...props}) => {
                                const text = getChildrenText(props.children);
                                const id = getCleanId(text);
                                return <h2 id={id} className={`scroll-mt-12 text-xl md:text-2.5xl font-serif font-bold mt-2 mb-4 leading-snug transition-colors duration-300 ${activeThemeConfig.h2}`} {...props} />;
                              },
                              h3: ({node, ...props}) => {
                                const text = getChildrenText(props.children);
                                const id = getCleanId(text);
                                return <h3 id={id} className={`scroll-mt-12 text-lg md:text-xl font-serif font-bold mt-2 mb-3 transition-colors duration-300 ${activeThemeConfig.h3}`} {...props} />;
                              },
                              p: ({node, ...props}) => <p className={`mb-4 transition-colors duration-300 ${activeThemeConfig.p}`} {...props} />,
                              ul: ({node, ...props}) => <ul className={`list-disc list-outside mb-4 space-y-2 pl-6 transition-colors duration-300 ${activeThemeConfig.p}`} {...props} />,
                              ol: ({node, ...props}) => <ol className={`list-decimal list-outside mb-4 space-y-2 pl-6 transition-colors duration-300 ${activeThemeConfig.p}`} {...props} />,
                              li: ({node, ...props}) => <li className="mb-1" {...props} />,
                              blockquote: ({node, ...props}) => <blockquote className={`border-l-4 pl-4 italic my-6 py-3 pr-3 text-sm rounded-r-xl font-serif transition-colors duration-300 ${activeThemeConfig.blockquote}`} {...props} />,
                              table: ({node, ...props}) => <div className={`overflow-x-auto my-6 border rounded-xl transition-all duration-300 ${activeThemeConfig.border}`}><table className={`min-w-full divide-y transition-all duration-300 ${activeThemeConfig.border}`} {...props} /></div>,
                              thead: ({node, ...props}) => <thead className={`${activeThemeConfig.thead}`} {...props} />,
                              tbody: ({node, ...props}) => <tbody className={`divide-y transition-all duration-300 ${activeThemeConfig.border}`} {...props} />,
                              tr: ({node, ...props}) => <tr className="hover:bg-slate-50/10" {...props} />,
                              th: ({node, ...props}) => <th className={`px-4 py-3 text-left text-xs font-bold uppercase tracking-wider border-b transition-all duration-300 ${activeThemeConfig.border} ${activeThemeConfig.th}`} {...props} />,
                              td: ({node, ...props}) => <td className={`px-4 py-3 text-sm transition-colors duration-300 ${activeThemeConfig.td}`} {...props} />,
                              hr: ({node, ...props}) => <hr className={`my-8 transition-all duration-300 ${activeThemeConfig.border}`} {...props} />,
                              strong: ({node, ...props}) => <strong className={`font-bold px-1 py-0.5 rounded-sm transition-colors duration-300 ${activeThemeConfig.strong}`} {...props} />,
                            }}
                          >
                            {section.markdown}
                          </ReactMarkdown>
                        </div>
                      );
                    })}
                  </div>

                  {/* INTERACTIVE QUIZ BLOCK (Renders if chapter contains quizzes defined with it) */}
                  {activeChapter.quizzes && activeChapter.quizzes.length > 0 && (
                    <div id="chapter-quizzes-card-block" className={`mt-12 p-6 md:p-8 rounded-2xl border ${getPageCardClasses()} space-y-6 shadow-xs`}>
                      <div className={`flex items-center gap-2 pb-3 border-b ${activeThemeConfig.border}`}>
                        <span className="p-1 px-2.5 bg-emerald-50 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-400 rounded-lg text-xs font-bold">Quiz</span>
                        <div>
                          <h3 className="font-serif font-bold text-emerald-950 dark:text-white">Interaktywne Ćwiczenia Sprawdzające</h3>
                          <p className={`text-[10px] transition-colors duration-300 ${activeThemeConfig.studentNotesLabel}`}>Sprawdź swoją wiedzę po zapoznaniu się z tym tematem</p>
                        </div>
                      </div>

                      <div className="space-y-8">
                        {activeChapter.quizzes.map((q, qIndex) => {
                          const chapAnswers = quizAnswers[activeChapter.id] || {};
                          const savedAnswerObj = chapAnswers[q.id];
                          const hasAnswered = !!savedAnswerObj;

                          return (
                            <div key={q.id} className="space-y-3">
                              <div className="flex items-start gap-2.5">
                                <span className="font-mono text-xs font-extrabold text-emerald-800 dark:text-[#a7f3d0] bg-emerald-50 dark:bg-emerald-950/50 p-1.5 px-2.5 rounded-lg shrink-0 mt-0.5">
                                  {qIndex + 1}
                                </span>
                                <h4 className={`text-sm font-bold pt-0.5 leading-relaxed transition-colors duration-300 ${activeThemeConfig.h3}`}>
                                  {q.question}
                                </h4>
                              </div>

                              {/* Choices listing */}
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5 pl-0 sm:pl-10">
                                {q.options.map((opt, oIndex) => {
                                  const isChosen = savedAnswerObj?.chosenIdx === oIndex;
                                  const isCorrectOne = q.correctAnswer === oIndex;

                                  let optionCardClasses = `transition-all duration-300 ${
                                    theme === 'sepia' 
                                      ? 'bg-[#f4ebd0] border-[#c0b080] text-[#433422] hover:bg-[#ebdcb3]/60' 
                                      : theme === 'blue'
                                      ? 'bg-[#edf3f8] border-blue-200 text-[#2c3e50] hover:bg-white'
                                      : theme === 'dyslexic'
                                      ? 'bg-white border-amber-200 text-[#1b1c1b] hover:bg-amber-100/30'
                                      : theme === 'dark'
                                      ? 'bg-slate-900 border-slate-800 text-slate-200 hover:bg-slate-800'
                                      : 'bg-white border-slate-200 text-[#433D3C] hover:bg-slate-50'
                                  }`;
                                  if (hasAnswered) {
                                    if (isChosen && isCorrectOne) {
                                      optionCardClasses = "bg-green-50 dark:bg-green-950/20 text-green-700 dark:text-green-400 border-green-300 dark:border-green-800/80";
                                    } else if (isChosen && !isCorrectOne) {
                                      optionCardClasses = "bg-red-50 dark:bg-red-950/20 text-red-700 dark:text-red-400 border-red-300 dark:border-red-800/80";
                                    } else if (isCorrectOne) {
                                      optionCardClasses = "bg-green-50/60 dark:bg-green-950/10 text-green-700 dark:text-green-400 border-green-200 dark:border-green-900/50";
                                    } else {
                                      optionCardClasses = theme === 'sepia' 
                                        ? 'opacity-50 bg-[#fbf6ec] border-[#e7daaf] text-[#433422]'
                                        : theme === 'blue'
                                        ? 'opacity-50 bg-slate-100 border-blue-105 text-[#2c3e50]'
                                        : theme === 'dyslexic'
                                        ? 'opacity-50 bg-white border-amber-100 text-[#1b1c1b]'
                                        : 'opacity-55 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800';
                                    }
                                  }

                                  return (
                                    <button
                                      key={oIndex}
                                      id={`quiz-q-${qIndex}-opt-${oIndex}`}
                                      disabled={hasAnswered}
                                      onClick={() => {
                                        const isCorr = q.correctAnswer === oIndex;
                                        setQuizAnswers((prev) => {
                                          const prevChap = prev[activeChapter.id] || {};
                                          return {
                                            ...prev,
                                            [activeChapter.id]: {
                                              ...prevChap,
                                              [q.id]: {
                                                chosenIdx: oIndex,
                                                isCorrect: isCorr,
                                                showFeedback: true
                                              }
                                            }
                                          };
                                        });
                                      }}
                                      className={`p-3 text-left border rounded-xl font-medium text-xs transition-colors transition-transform cursor-pointer focus:outline-hidden ${optionCardClasses}`}
                                    >
                                      <div className="flex items-center gap-2">
                                        <span className="w-5 h-5 flex items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800 text-[10px] text-slate-500 font-bold shrink-0">
                                          {['A', 'B', 'C', 'D'][oIndex] || oIndex + 1}
                                        </span>
                                        <span>{opt}</span>
                                      </div>
                                    </button>
                                  );
                                })}
                              </div>

                              {/* Interactive success or corrective explanation box */}
                              {hasAnswered && (
                                <div className="mt-3.5 pl-0 sm:pl-10">
                                  <div className={`p-4 rounded-xl text-xs border ${
                                    savedAnswerObj.isCorrect 
                                      ? 'bg-green-500/10 border-green-200 text-green-800 dark:text-green-400' 
                                      : 'bg-amber-500/10 border-amber-200 text-amber-800 dark:text-amber-400'
                                  }`}>
                                    <div className="flex items-center gap-1.5 font-bold mb-1">
                                      {savedAnswerObj.isCorrect ? (
                                        <>
                                          <span>🎉 Bardzo dobrze!</span>
                                        </>
                                      ) : (
                                        <>
                                          <span>💡 Blisko! Przemyśl to jeszcze raz...</span>
                                        </>
                                      )}
                                    </div>
                                    {q.explanation && (
                                      <p className="leading-relaxed text-slate-600 dark:text-slate-300 font-medium">
                                        <strong>Wyjaśnienie:</strong> {q.explanation}
                                      </p>
                                    )}
                                  </div>
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>

                      {/* Display total quiz score if completed */}
                      {Object.keys(quizAnswers[activeChapter.id] || {}).length === activeChapter.quizzes.length && (
                        <div className="bg-gradient-to-r from-emerald-700 to-emerald-800 p-5 rounded-2xl flex flex-col sm:flex-row items-center justify-between text-white gap-4 mt-6 animate-in zoom-in duration-200">
                          <div>
                            <h4 className="font-bold text-sm">Gratulacje! Zadania ukończone! 🏆</h4>
                            <p className="text-[11px] text-emerald-100 mt-0.5">Odpowiedziałeś na wszystkie pytania z tej lekcji.</p>
                          </div>
                          <button
                            id="reset-active-chapter-quiz"
                            onClick={() => {
                              setQuizAnswers((prev) => {
                                const copied = { ...prev };
                                delete copied[activeChapter.id];
                                return copied;
                              });
                            }}
                            className="bg-white text-emerald-800 hover:bg-slate-50 font-bold text-xs p-2 px-3.5 rounded-xl shrink-0 cursor-pointer transition-colors"
                          >
                            Rozwiąż ponownie
                          </button>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Bookmark suggestion panel for bottom */}
                  <div className="pt-6 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div className="flex items-center gap-1.5 text-xs text-slate-500">
                      <BookMarked className="w-4 h-4 text-slate-400" />
                      <span>Uważasz tę lekcję za skończoną? Zaznacz u góry jako ukończoną!</span>
                    </div>

                    <div className="flex items-center gap-3">
                      {/* Navigating chapters sequentially with circular progress indicators (dots) */}
                      {activeCategoryChapters.findIndex((c) => c.id === activeChapter.id) > 0 ? (
                        <button
                          id="prev-chapter-btn-bottom"
                          type="button"
                          onClick={() => {
                            const idx = activeCategoryChapters.findIndex((c) => c.id === activeChapter.id);
                            setCurrentChapterId(activeCategoryChapters[idx - 1].id);
                            setIsDrawingModeActive(false);
                          }}
                          className="px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-semibold rounded-lg flex items-center gap-1 transition-all cursor-pointer shrink-0"
                        >
                          <ChevronLeft className="w-3.5 h-3.5" />
                          <span className="hidden xs:inline">Wstecz</span>
                        </button>
                      ) : (
                        <div className="w-[50px] xs:w-[70px] shrink-0" />
                      )}

                      {/* Visual Dots Indicators */}
                      <div className="flex items-center gap-2 justify-center flex-wrap max-w-[220px] xs:max-w-[280px] md:max-w-[340px]">
                        {activeCategoryChapters.map((chap, idx) => {
                          const isActive = chap.id === activeChapter.id;
                          const isCompleted = progress.completedChapters.includes(chap.id);
                          const sc = getSubjectThemeColors(chap.subject, theme);
                          
                          return (
                            <button
                              key={chap.id}
                              id={`progress-dot-${chap.id}`}
                              type="button"
                              onClick={() => {
                                setCurrentChapterId(chap.id);
                                setIsDrawingModeActive(false);
                              }}
                              className={`w-2.5 h-2.5 rounded-full relative group/dot transition-all duration-300 cursor-pointer ${
                                isActive 
                                  ? `${sc.dotColorActive}` 
                                  : isCompleted 
                                  ? `${sc.dotColorCompleted}` 
                                  : 'bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600'
                              }`}
                              title={chap.title}
                            >
                              {/* Rich Hover Tooltip with detail info */}
                              <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2.5 hidden group-hover/dot:block bg-slate-900 text-[#ECE7DE] text-[10px] leading-relaxed py-1.5 px-3 rounded-lg whitespace-nowrap shadow-xl border border-slate-800 z-50 pointer-events-none transition-all">
                                <span className={`font-extrabold mr-1 ${getSubjectThemeColors(chap.subject, theme).text}`}>{chap.lessonNumber ? `${chap.lessonNumber}.` : `${idx + 1}.`}</span>
                                <span className="font-semibold">{chap.title}</span>
                                {isCompleted && (
                                  <span className="text-emerald-400 ml-1.5 font-extrabold" title="Lekcja ukończona">✓</span>
                                )}
                              </div>
                            </button>
                          );
                        })}
                      </div>

                      {activeCategoryChapters.findIndex((c) => c.id === activeChapter.id) < activeCategoryChapters.length - 1 ? (
                        <button
                          id="next-chapter-btn-bottom"
                          type="button"
                          onClick={() => {
                            const idx = activeCategoryChapters.findIndex((c) => c.id === activeChapter.id);
                            setCurrentChapterId(activeCategoryChapters[idx + 1].id);
                            setIsDrawingModeActive(false);
                          }}
                          className={`px-3 py-1.5 text-xs font-extrabold rounded-lg flex items-center gap-1 transition-all cursor-pointer shrink-0 ${getSubjectThemeColors(activeChapter.subject, theme).accentBg}`}
                        >
                          <span className="hidden xs:inline">Dalej</span>
                          <ChevronRight className="w-3.5 h-3.5" />
                        </button>
                      ) : (
                        <div className="w-[50px] xs:w-[68px] shrink-0" />
                      )}
                    </div>
                  </div>
                    </div> {/* Close Left Column (xl:col-span-8) */}

                    {/* Table of Contents Sticky Sidebar on Desktop */}
                    {tocItems.length > 1 && (
                      <div className="hidden xl:block xl:col-span-4 2xl:col-span-3 3xl:col-span-2">
                        <div className={`sticky top-6 p-5 rounded-2xl border transition-all duration-300 ${activeThemeConfig.secondaryCardBg} shadow-3xs`}>
                          <h3 className={`font-serif font-black text-sm mb-3 pb-2 border-b flex items-center gap-1.5 transition-colors duration-300 ${activeThemeConfig.h1} ${activeThemeConfig.border}`}>
                            <List className="w-4 h-4 text-amber-600 dark:text-amber-500" />
                            <span>Spis treści</span>
                          </h3>
                          <nav className="space-y-2 max-h-[65vh] overflow-y-auto pr-1">
                            {tocItems.map((item) => (
                              <button
                                key={item.id}
                                onClick={() => scrollToSection(item.id)}
                                className={`w-full text-left text-xs font-sans hover:underline focus:outline-none block transition-all cursor-pointer ${
                                  item.level === 1
                                    ? 'pl-0 font-extrabold text-slate-800 dark:text-slate-200'
                                    : item.level === 2
                                    ? 'pl-3.5 text-slate-600 dark:text-slate-300 font-semibold'
                                    : 'pl-7 text-slate-500 dark:text-slate-400 font-medium'
                                } ${activeHeadingId === item.id ? 'text-amber-700 dark:text-amber-400 font-black border-l-2 border-amber-500 pl-2 scale-[1.01]' : ''}`}
                              >
                                {item.text}
                              </button>
                            ))}
                          </nav>
                        </div>
                      </div>
                    )}
                  </motion.article>
                ) : (
                  <motion.div
                    key="empty-state"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="text-center py-20"
                  >
                    <p className="text-sm text-slate-500">Kliknij na jeden z tematów po lewej, aby rozpocząć naukę.</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
          </>
          )}
        </main>

        {/* DZIENNIK I NOTATNIK NAUCZYCIELA & UCZNIA (DRAWER ON RIGHT SIDE) */}
        <AnimatePresence>
          {isNotesOpen && activeChapter && (
            <motion.aside
              key="student-notes-aside-drawer"
              id="student-notes-aside-drawer"
              initial={{ x: '100%', opacity: 1 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: '100%', opacity: 1 }}
              transition={{ type: 'spring', damping: 26, stiffness: 220 }}
              className={`w-85 border-l p-4 shrink-0 flex flex-col gap-3.5 z-30 ${activeThemeConfig.sidebarBg} ${activeThemeConfig.border} overflow-y-auto`}
            >
            {/* Drawer Header */}
            <div className={`flex items-center justify-between shrink-0 pb-1.5 border-b ${activeThemeConfig.border}`}>
              <div>
                <h3 className={`font-serif font-bold text-sm flex items-center gap-1.5 transition-colors duration-300 ${activeThemeConfig.h1}`}>
                  <FileText className="w-4 h-4 text-emerald-700" />
                  <span>Dziennik & Notatki 🏫</span>
                </h3>
                <p className="text-[10px] text-slate-500">Zarządzanie lekcjami i klasami</p>
              </div>
              <button
                id="close-notes-drawer-btn"
                onClick={() => setIsNotesOpen(false)}
                className={`text-[10px] font-extrabold p-1 px-2.5 rounded-lg cursor-pointer transition-all ${activeThemeConfig.galleryPresetBtn}`}
              >
                Ukryj
              </button>
            </div>

            {/* Tab Selection buttons */}
            <div className={`flex p-1 rounded-xl shrink-0 transition-all duration-300 ${activeThemeConfig.tabGroupBg}`}>
              <button
                id="drawer-tab-notes-btn"
                onClick={() => setRightDrawerTab('notes')}
                className={`flex-1 py-1.5 px-2.5 text-[10.5px] font-bold rounded-lg cursor-pointer transition-all ${
                  rightDrawerTab === 'notes'
                    ? activeThemeConfig.tabActive
                    : activeThemeConfig.tabInactive
                }`}
              >
                Notatnik & Realizacja
              </button>
              <button
                id="drawer-tab-classes-btn"
                onClick={() => setRightDrawerTab('classes')}
                className={`flex-1 py-1.5 px-2.5 text-[10.5px] font-bold rounded-lg cursor-pointer transition-all ${
                  rightDrawerTab === 'classes'
                    ? activeThemeConfig.tabActive
                    : activeThemeConfig.tabInactive
                }`}
              >
                Klasy & Statystyki
              </button>
            </div>

            {/* TAB CONTENTS */}
            {rightDrawerTab === 'notes' ? (
              <div className="flex-1 flex flex-col gap-3.5 min-h-0">
                {/* Notes Textarea block */}
                <div className="flex-1 flex flex-col gap-2 min-h-[120px]">
                  <div className="flex items-center justify-between">
                    <label className={`text-[11.5px] font-bold transition-colors duration-300 ${activeThemeConfig.studentNotesLabel}`}>
                      📝 Brudnopis do lekcji:
                    </label>
                    <div className="flex items-center gap-1.5">
                      {isNotesSaving ? (
                        <span className="text-[10px] font-extrabold text-amber-500 animate-pulse font-mono">
                          ● Zapisywanie...
                        </span>
                      ) : (
                        <span className="text-[10px] font-extrabold text-emerald-500 dark:text-emerald-400 font-mono">
                          ✓ Zapisano
                        </span>
                      )}
                      
                      <button
                        id="toggle-fullscreen-notes-btn"
                        onClick={() => setIsNotesFullscreen(true)}
                        className={`p-1 rounded-lg text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all cursor-pointer`}
                        title="Rozwiń do pełnego ekranu (Focus Mode)"
                      >
                        <Maximize className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                  <textarea
                    id="student-chapter-notes-textarea"
                    className={`flex-1 p-3 text-xs leading-relaxed border rounded-xl focus:outline-hidden focus:ring-2 font-mono resize-none transition-all duration-300 ${activeThemeConfig.studentNotesTextarea}`}
                    placeholder="np. Moje podsumowanie lekcji: Budowa komórki...\n- Jądro = centrum sterowania\n- Mitochondrium = elektrownia tlenowa"
                    value={localNoteText}
                    onChange={(e) => setLocalNoteText(e.target.value)}
                  />
                </div>

                {/* 🖼️ INTERAKTYWNA GALERIA I WKLEJANIE LINKÓW OBRAZÓW */}
                <div className={`p-3 rounded-xl space-y-2.5 transition-colors duration-300 ${activeThemeConfig.secondaryCardBg}`}>
                  <div className="flex items-center justify-between">
                    <label className={`text-[11px] font-extrabold flex items-center gap-1.5 uppercase tracking-wide transition-colors duration-300 ${activeThemeConfig.studentNotesLabel}`}>
                      <Image className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-500" />
                      <span>Obrazy i Galeria lekcji</span>
                    </label>
                    <span className="text-[9px] font-bold text-slate-400 font-mono">
                      {(chapterGalleryImages[activeChapter.id] || []).length} szt.
                    </span>
                  </div>

                  {/* Dodawanie linku do obrazu */}
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      handleAddImageToGallery(newImageUrlInput);
                    }}
                    className="flex gap-1"
                  >
                    <div className="relative flex-1">
                      <input
                        type="url"
                        placeholder="Wklej link URL do obrazka (http...)"
                        value={newImageUrlInput}
                        onChange={(e) => setNewImageUrlInput(e.target.value)}
                        className={`w-full text-[10px] pl-6 pr-2 py-1 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-emerald-600 font-mono transition-all border ${activeThemeConfig.studentNotesTextarea}`}
                      />
                      <span className="absolute left-2 top-1.5 text-slate-400">
                        <Link className="w-2.5 h-2.5" />
                      </span>
                    </div>
                    <button
                      type="submit"
                      className="px-2.5 py-1 bg-emerald-700 hover:bg-emerald-800 dark:bg-emerald-600 dark:hover:bg-emerald-500 text-white font-bold text-[10px] rounded-lg cursor-pointer transition-colors shrink-0"
                    >
                      Dodaj
                    </button>
                  </form>

                  {/* Propozycja grafik z galerii opartej na przedmiocie */}
                  <div className="space-y-1">
                    <span className="text-[8.5px] font-extrabold text-slate-400 dark:text-slate-500 uppercase tracking-tight block">
                      💡 Szybka galeria ({activeChapter.subject || 'Inne'}):
                    </span>
                    <div className="flex flex-wrap gap-1">
                      {(PRESET_SUBJECT_GALLERIES[activeChapter.subject || ''] || DEFAULT_SUBJECT_GALLERY).map((preset, pIdx) => (
                        <button
                          key={pIdx}
                          type="button"
                          onClick={() => handleAddImageToGallery(preset.url)}
                          className={`px-1.5 py-0.5 text-[8.5px] font-medium rounded-md transition-all cursor-pointer truncate max-w-[130px] ${activeThemeConfig.galleryPresetBtn}`}
                          title={preset.label}
                        >
                          + {preset.label.split(' ').slice(1).join(' ') || preset.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Wklejone lub wybrane zdjęcia (Galeria lekcji) */}
                  {((chapterGalleryImages[activeChapter.id] || []).length > 0) && (
                    <div className="space-y-1 pt-1">
                      <span className="text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-tight block">
                        📂 Twoja galeria do lekcji (kliknij podgląd):
                      </span>
                      <div className="grid grid-cols-4 gap-1 max-h-24 overflow-y-auto pr-0.5">
                        {(chapterGalleryImages[activeChapter.id] || []).map((imgUrl, imgIdx) => (
                          <div 
                            key={imgIdx} 
                            className={`aspect-square rounded-lg overflow-hidden relative group border shadow-3xs ${activeThemeConfig.studentNotesTextarea}`}
                          >
                            <img 
                              src={imgUrl} 
                              alt="Lekcja" 
                              referrerPolicy="no-referrer"
                              className="w-full h-full object-cover transition-transform group-hover:scale-105" 
                            />
                            {/* Hover overlay with action buttons */}
                            <div className="absolute inset-0 bg-black/75 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center gap-0.5 transition-opacity duration-150 p-0.5">
                              <button
                                type="button"
                                onClick={() => setSelectedLightboxImage(imgUrl)}
                                className="text-[7.5px] font-bold bg-slate-800 hover:bg-slate-700 text-white w-full py-0.5 rounded text-center cursor-pointer"
                                title="Powiększ zdjęcie"
                              >
                                Podgląd
                              </button>
                              <button
                                type="button"
                                onClick={() => handleInsertImageIntoNotes(imgUrl)}
                                className="text-[7.5px] font-bold bg-emerald-700 hover:bg-emerald-600 text-white w-full py-0.5 rounded text-center cursor-pointer"
                                title="Wstaw znacznik do notatek"
                              >
                                Wstaw
                              </button>
                              <button
                                type="button"
                                onClick={() => handleRemoveImageFromGallery(imgUrl)}
                                className="text-[7.5px] font-bold bg-red-800 hover:bg-red-700 text-white w-full py-0.5 rounded text-center cursor-pointer"
                                title="Usuń z galerii"
                              >
                                Usuń
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Skaner obrazów: Automatyczne wykrywanie linków/obrazków wewnątrz samego brudnopisu */}
                  {(() => {
                    const noteText = progress.chapterNotes[activeChapter.id] || '';
                    const urlRegex = /(https?:\/\/[^\s"'()]+?\.(?:png|jpg|jpeg|gif|webp|svg)(?:\?[^\s"'()]*)?)/gi;
                    const unsplashRegex = /(https?:\/\/images\.unsplash\.com\/[^\s"'()]+)/gi;
                    const extractedUrls: string[] = [];
                    
                    const markdownImageRegex = /!\[.*?\]\((https?:\/\/.*?)\)/g;
                    let match;
                    while ((match = markdownImageRegex.exec(noteText)) !== null) {
                      if (match[1]) {
                        try {
                          const url = match[1].split(')')[0].trim();
                          if (!extractedUrls.includes(url)) extractedUrls.push(url);
                        } catch (e) {}
                      }
                    }

                    const allMatches = [...noteText.matchAll(urlRegex), ...noteText.matchAll(unsplashRegex)];
                    allMatches.forEach(m => {
                      const u = m[0].trim();
                      if (!extractedUrls.includes(u)) {
                        extractedUrls.push(u);
                      }
                    });

                    if (extractedUrls.length === 0) return null;

                    return (
                      <div className="space-y-1 pt-1.5 border-t border-slate-200 dark:border-slate-800/80 animate-in fade-in duration-200">
                        <span className="text-[8.5px] font-extrabold text-slate-400 dark:text-slate-500 uppercase tracking-tight block">
                          🔗 Wykryte obrazy w tekście notatek:
                        </span>
                        <div className="grid grid-cols-4 gap-1 max-h-24 overflow-y-auto pr-0.5">
                          {extractedUrls.map((url, idx) => (
                            <div 
                              key={idx} 
                              className="aspect-square bg-slate-100 dark:bg-slate-800 rounded-lg overflow-hidden border border-slate-200 dark:border-slate-700 relative group shadow-3xs"
                            >
                              <img 
                                src={url} 
                                alt="Detected" 
                                referrerPolicy="no-referrer"
                                className="w-full h-full object-cover" 
                              />
                              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity duration-150">
                                <button
                                  type="button"
                                  onClick={() => setSelectedLightboxImage(url)}
                                  className="text-[8px] font-bold bg-slate-800 hover:bg-slate-700 text-white py-0.5 px-1.5 rounded cursor-pointer"
                                  title="Pokaż w pełnym rozmiarze"
                                >
                                  Podgląd
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  })()}
                </div>

                {/* Realization checklist for active chapter */}
                <div className={`pt-3 border-t ${activeThemeConfig.border}`}>
                  <label className={`text-[11.5px] font-bold block mb-2 transition-colors duration-300 ${activeThemeConfig.studentNotesLabel}`}>
                    🏫 Oznacz jako zrealizowany w klasie:
                  </label>
                  {teacherClasses.length > 0 ? (
                    <div className="grid grid-cols-2 gap-1.5">
                      {teacherClasses.map((cls) => {
                        const isRealized = realizations.some((r) => r.className === cls && r.chapterId === activeChapter.id);
                        return (
                          <button
                            key={cls}
                            id={`toggle-realize-class-${cls}`}
                            onClick={() => handleToggleRealizationInClass(cls, activeChapter.id)}
                            className={`flex items-center gap-1.5 p-2 rounded-xl text-left transition-all text-xs cursor-pointer border ${
                              isRealized 
                                ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-300 dark:border-emerald-700 text-emerald-800 dark:text-emerald-400 font-semibold'
                                : activeThemeConfig.chapterCardInactive
                            }`}
                          >
                            <span className={`w-3.5 h-3.5 flex items-center justify-center rounded border text-[10px] ${
                              isRealized ? 'bg-emerald-600 border-emerald-600 text-white' : activeThemeConfig.studentNotesTextarea
                            }`}>
                              {isRealized && '✓'}
                            </span>
                            <span className="truncate">{cls}</span>
                          </button>
                        );
                      })}
                    </div>
                  ) : (
                    <p className="text-[10px] text-slate-500 italic">Brak zdefiniowanych klas. Przejdź do zakładki "Klasy & Statystyki", aby dodać swoje klasy.</p>
                  )}
                </div>

                {/* Eksport/Pobieranie notatek */}
                <div className={`pt-3 border-t ${activeThemeConfig.border} space-y-2`}>
                  <label className={`text-[11.5px] font-bold block transition-colors duration-300 ${activeThemeConfig.studentNotesLabel}`}>
                    📥 Eksportuj podsumowanie lekcji:
                  </label>
                  <div className="flex gap-2">
                    <button
                      onClick={handleDownloadNotes}
                      className="flex-1 p-2 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-350 transition-all cursor-pointer flex items-center justify-center gap-1.5 text-xs font-bold"
                      title="Pobierz notatki jako plik Markdown (.md)"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Plik .md</span>
                    </button>
                    <button
                      onClick={handleDownloadNotesPDF}
                      className="flex-1 p-2 rounded-xl border border-emerald-200 hover:bg-emerald-50 dark:border-emerald-950/40 dark:hover:bg-emerald-950/20 text-emerald-700 dark:text-emerald-400 transition-all cursor-pointer flex items-center justify-center gap-1.5 text-xs font-bold"
                      title="Wydrukuj podsumowanie lekcji lub zapisz jako PDF"
                    >
                      <Printer className="w-3.5 h-3.5" />
                      <span>Drukuj / PDF</span>
                    </button>
                  </div>
                </div>

                <div className="p-3 bg-emerald-50 dark:bg-emerald-950/30 rounded-xl border border-emerald-100 dark:border-slate-900 shrink-0 mt-auto">
                  <p className="text-[10px] text-slate-600 dark:text-slate-400 leading-relaxed font-sans">
                    💡 <strong>Szybka zmiana:</strong> Po kliknięciu na wybraną klasę temat zostanie oznaczony jako przeprowadzony, co wygeneruje odpowiednie statystyki.
                  </p>
                </div>
              </div>
            ) : (
              <div className="flex-grow space-y-4 overflow-y-auto pr-0.5">
                
                {/* Section to manage customized classes list */}
                <div className="space-y-2">
                  <label className={`text-[11.5px] font-bold block transition-colors duration-300 ${activeThemeConfig.studentNotesLabel}`}>
                    ➕ Dodaj nową klasę / grupę:
                  </label>
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      handleAddTeacherClass(newClassNameInput);
                    }}
                    className="flex gap-1.5"
                  >
                    <input
                      id="add-class-drawer-input"
                      type="text"
                      placeholder="np. Klasa 1A, Grupa B..."
                      value={newClassNameInput}
                      onChange={(e) => setNewClassNameInput(e.target.value)}
                      className={`flex-grow p-2 rounded-xl text-xs transition-all focus:outline-hidden border ${activeThemeConfig.studentNotesTextarea}`}
                    />
                    <button
                      type="submit"
                      id="add-class-submit-btn"
                      className="bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs p-2 px-3 rounded-xl cursor-pointer shrink-0 transition-colors"
                    >
                      Dodaj
                    </button>
                  </form>

                  {/* List of active custom teacher classes with deletes */}
                  <div className="flex flex-wrap gap-1 mt-1 font-mono">
                    {teacherClasses.map((cls) => (
                      <div 
                        key={cls} 
                        className={`flex items-center gap-1 px-2.5 py-1 text-[10px] font-semibold rounded-lg border transition-all ${activeThemeConfig.secondaryCardBg}`}
                      >
                        <span className="truncate max-w-[100px]">{cls}</span>
                        <button
                          type="button"
                          id={`delete-class-btn-${cls}`}
                          onClick={() => handleDeleteTeacherClass(cls)}
                          className="text-red-400 hover:text-red-600 transition-colors cursor-pointer ml-1 font-bold text-xs p-0.5"
                          title={`Usuń klasę ${cls}`}
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Statistics of realization */}
                <div className={`space-y-2.5 pt-3 border-t ${activeThemeConfig.border}`}>
                  <label className={`text-[11.5px] font-bold block transition-colors duration-300 ${activeThemeConfig.studentNotesLabel}`}>
                    📊 Statystyki realizacji tematów:
                  </label>
                  
                  {teacherClasses.length > 0 ? (
                    <div className="space-y-2.5">
                      {/* Visual Bar Chart comparing classes */}
                      {(() => {
                        const barChartData = teacherClasses.map((cls) => {
                          const classRealizations = realizations.filter((r) => r.className === cls);
                          const uniqueRealizedCount = new Set(classRealizations.map((r) => r.chapterId)).size;
                          return {
                            name: cls,
                            'Zrealizowane': uniqueRealizedCount,
                          };
                        });

                        const barColor = theme === 'dark' ? '#10b981' : '#047857';

                        return (
                          <div className={`p-3 rounded-xl border ${activeThemeConfig.border} ${activeThemeConfig.secondaryCardBg} space-y-1.5`}>
                            <div className="flex items-center justify-between">
                              <span className="text-[10px] font-extrabold uppercase tracking-wide text-slate-400 dark:text-slate-500">
                                Porównanie realizacji tematów
                              </span>
                              <span className="text-[9px] font-bold text-emerald-700 dark:text-emerald-400">
                                Suma tematów: {chapters.length}
                              </span>
                            </div>
                            <div className="w-full h-32 font-sans">
                              <ResponsiveContainer width="100%" height="100%">
                                <BarChart
                                  data={barChartData}
                                  margin={{ top: 5, right: 5, left: -25, bottom: 5 }}
                                >
                                  <XAxis
                                    dataKey="name"
                                    stroke="#94a3b8"
                                    fontSize={8}
                                    tickLine={false}
                                    axisLine={false}
                                  />
                                  <YAxis
                                    stroke="#94a3b8"
                                    fontSize={8}
                                    tickLine={false}
                                    axisLine={false}
                                    allowDecimals={false}
                                    domain={[0, chapters.length || 10]}
                                  />
                                  <RechartsTooltip
                                    cursor={{ fill: 'rgba(16, 185, 129, 0.05)' }}
                                    content={({ active, payload }) => {
                                      if (active && payload && payload.length) {
                                        const data = payload[0].payload;
                                        return (
                                          <div className="bg-slate-900 border border-slate-800 text-white text-[9px] p-2 rounded-lg shadow-md font-sans">
                                            <p className="font-extrabold">{data.name}</p>
                                            <p className="text-emerald-450">Zrealizowano: <span className="font-mono font-bold">{data.Zrealizowane}</span> / {chapters.length}</p>
                                          </div>
                                        );
                                      }
                                      return null;
                                    }}
                                  />
                                  <Bar
                                    dataKey="Zrealizowane"
                                    radius={[3, 3, 0, 0]}
                                    maxBarSize={20}
                                  >
                                    {barChartData.map((entry, index) => (
                                      <Cell
                                        key={`cell-${index}`}
                                        fill={entry.Zrealizowane > 0 ? barColor : '#64748b'}
                                      />
                                    ))}
                                  </Bar>
                                </BarChart>
                              </ResponsiveContainer>
                            </div>
                          </div>
                        );
                      })()}

                      {teacherClasses.map((cls) => {
                        const classRealizations = [...realizations]
                          .filter((r) => r.className === cls)
                          .sort((a, b) => b.timestamp - a.timestamp);
                        
                        const uniqueRealizedCount = new Set(classRealizations.map((r) => r.chapterId)).size;
                        const totalChapters = chapters.length;
                        const completionPercent = totalChapters > 0 ? Math.round((uniqueRealizedCount / totalChapters) * 100) : 0;
                        
                        const lastRealization = classRealizations[0];
                        const lastChapter = lastRealization ? chapters.find((c) => c.id === lastRealization.chapterId) : null;
                        
                        const formatTimestamp = (ts: number) => {
                          const date = new Date(ts);
                          const day = date.getDate().toString().padStart(2, '0');
                          const month = (date.getMonth() + 1).toString().padStart(2, '0');
                          const hrs = date.getHours().toString().padStart(2, '0');
                          const mins = date.getMinutes().toString().padStart(2, '0');
                          return `${day}.${month}, g. ${hrs}:${mins}`;
                        };

                        const isExpanded = expandedClassDetails[cls];

                        const renderCalendar = () => {
                          const year = currentCalendarDate.getFullYear();
                          const month = currentCalendarDate.getMonth();
                          
                          const monthNamesPL = [
                            "Styczeń", "Luty", "Marzec", "Kwiecień", "Maj", "Czerwiec",
                            "Lipiec", "Sierpień", "Wrzesień", "Październik", "Listopad", "Grudzień"
                          ];
                          
                          const weekDaysPL = ["Pn", "Wt", "Śr", "Cz", "Pt", "Sb", "Nd"];
                          const firstDay = new Date(year, month, 1).getDay();
                          const firstDayIndex = (firstDay + 6) % 7; 
                          const daysInMonth = new Date(year, month + 1, 0).getDate();
                          
                          const cells: (number | null)[] = [];
                          for (let i = 0; i < firstDayIndex; i++) {
                            cells.push(null);
                          }
                          for (let d = 1; d <= daysInMonth; d++) {
                            cells.push(d);
                          }
                          
                          const rows: (number | null)[][] = [];
                          let currentRow: (number | null)[] = [];
                          cells.forEach((cell, idx) => {
                            currentRow.push(cell);
                            if (currentRow.length === 7 || idx === cells.length - 1) {
                              while (currentRow.length < 7) {
                                currentRow.push(null);
                              }
                              rows.push(currentRow);
                              currentRow = [];
                            }
                          });

                          return (
                            <div className={`p-2 rounded-xl space-y-1.5 mt-2 animate-in fade-in duration-200 ${activeThemeConfig.secondaryCardBg}`}>
                              <div className="flex items-center justify-between">
                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setCurrentCalendarDate(new Date(year, month - 1, 1));
                                  }}
                                  className={`p-1 rounded text-slate-500 font-bold transition-all text-[9px] cursor-pointer ${activeThemeConfig.galleryPresetBtn}`}
                                  title="Poprzedni miesiąc"
                                >
                                  ◀
                                </button>
                                <span className={`text-[9px] font-bold uppercase tracking-wider transition-colors duration-300 ${activeThemeConfig.studentNotesLabel}`}>
                                  {monthNamesPL[month]} {year}
                                </span>
                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setCurrentCalendarDate(new Date(year, month + 1, 1));
                                  }}
                                  className={`p-1 rounded text-slate-500 font-bold transition-all text-[9px] cursor-pointer ${activeThemeConfig.galleryPresetBtn}`}
                                  title="Następny miesiąc"
                                >
                                  ▶
                                </button>
                              </div>

                              <div className="grid grid-cols-7 gap-1 text-[8px] font-bold text-center text-slate-400 uppercase">
                                {weekDaysPL.map((wd) => (
                                  <div key={wd}>{wd}</div>
                                ))}
                              </div>

                              <div className="space-y-1">
                                {rows.map((row, rIdx) => (
                                  <div key={rIdx} className="grid grid-cols-7 gap-1">
                                    {row.map((day, dIdx) => {
                                      if (day === null) {
                                        return <div key={dIdx} className="aspect-square bg-transparent" />;
                                      }

                                      const dayRealizations = classRealizations.filter((r) => {
                                        const rDate = new Date(r.timestamp);
                                        return rDate.getFullYear() === year && rDate.getMonth() === month && rDate.getDate() === day;
                                      });

                                      const isToday = 
                                        new Date().getFullYear() === year && 
                                        new Date().getMonth() === month && 
                                        new Date().getDate() === day;

                                      const isRealized = dayRealizations.length > 0;

                                      return (
                                        <div
                                          key={dIdx}
                                          className={`aspect-square flex flex-col items-center justify-center text-[9px] font-bold rounded-md transition-all relative group/cell ${
                                            isRealized
                                              ? 'bg-emerald-600 text-white cursor-pointer hover:bg-emerald-700 shadow-xs'
                                              : isToday
                                              ? 'bg-slate-100 dark:bg-slate-800 text-emerald-700 dark:text-emerald-400 border border-emerald-500/50'
                                              : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-100 dark:border-transparent'
                                          }`}
                                          title={isRealized ? `${dayRealizations.length} lekcja(e)` : undefined}
                                        >
                                          <span>{day}</span>
                                          {isRealized && (
                                            <span className="w-1 h-1 bg-white rounded-full absolute bottom-0.5" />
                                          )}
                                          
                                          {/* Rich Micro Tooltip on hover */}
                                          {isRealized && (
                                            <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-1.5 hidden group-hover/cell:block bg-slate-900 border border-slate-800 text-white text-[8px] leading-tight p-1.5 rounded-lg w-36 shadow-md z-50 pointer-events-none text-left">
                                              <div className="font-extrabold text-[#ECE7DE] border-b border-slate-800 pb-0.5 mb-1 flex items-center justify-between">
                                                <span>{day} {monthNamesPL[month]}</span>
                                                <span className="bg-emerald-700 px-1 rounded">✓ {dayRealizations.length}</span>
                                              </div>
                                              <div className="space-y-1 max-h-20 overflow-y-auto">
                                                {dayRealizations.map((r, rIdx) => {
                                                  const chap = chapters.find((ch) => ch.id === r.chapterId);
                                                  return (
                                                    <div key={rIdx} className="truncate text-slate-200">
                                                      • {chap ? chap.title : 'Temat'}
                                                    </div>
                                                  );
                                                })}
                                              </div>
                                            </div>
                                          )}
                                        </div>
                                      );
                                    })}
                                  </div>
                                ))}
                              </div>
                            </div>
                          );
                        };

                        return (
                          <div 
                            key={cls} 
                            className={`p-3 rounded-xl border shadow-2xs space-y-2.5 transition-all duration-300 ${activeThemeConfig.chapterCardInactive}`}
                          >
                            {/* Class name & Counter */}
                            <div className="flex items-center justify-between gap-1.5">
                              <span className="font-bold text-xs text-current flex items-center gap-1 shrink-0">
                                <span className="text-emerald-700">🏫</span> {cls}
                              </span>
                              <span className={`text-[10px] font-mono text-emerald-800 dark:text-emerald-400 font-bold px-1.5 py-0.5 rounded-lg shrink-0 border ${activeThemeConfig.tabGroupBg}`}>
                                {uniqueRealizedCount} z {totalChapters} tematów ({completionPercent}%)
                              </span>
                            </div>

                            {/* Progress bar */}
                            <div className="w-full bg-slate-100 dark:bg-slate-900 h-1.5 rounded-full overflow-hidden">
                              <div 
                                className="bg-emerald-700 dark:bg-emerald-500 h-full rounded-full transition-all duration-300"
                                style={{ width: `${completionPercent}%` }}
                              />
                            </div>

                            {/* Last realized lesson block */}
                            <div className={`text-[10.5px] leading-relaxed pt-2 border-t ${activeThemeConfig.border}`}>
                              {lastChapter ? (
                                <div className="space-y-0.5">
                                  <div className="text-[9px] uppercase tracking-wider text-slate-400 dark:text-slate-500 font-bold">
                                    Ostatni zrealizovaný temat:
                                  </div>
                                  <div className="font-semibold text-current line-clamp-1">
                                    {lastChapter.title}
                                  </div>
                                  <div className="text-[9px] text-slate-500 dark:text-slate-400 font-mono flex justify-between gap-1 mt-0.5">
                                    <span className="truncate">📂 {lastChapter.chapterGroup || 'Główny'}</span>
                                    <span className="shrink-0 text-emerald-700 dark:text-emerald-400 font-semibold">📅 {formatTimestamp(lastRealization.timestamp)}</span>
                                  </div>
                                </div>
                              ) : (
                                <div className="text-slate-400 dark:text-slate-500 text-center italic text-[9.5px] py-1 bg-slate-100/55 dark:bg-slate-900/40 rounded-lg">
                                  Brak zrealizowanych tematów
                                </div>
                              )}
                            </div>

                            {/* Toggle for Expandable Calendar & Actions Timeline */}
                            <div className="pt-1 select-none">
                              <button
                                type="button"
                                id={`toggle-expand-class-${cls}`}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setExpandedClassDetails((prev) => ({
                                    ...prev,
                                    [cls]: !prev[cls],
                                  }));
                                }}
                                className="w-full text-center text-[10px] font-bold text-emerald-700 hover:text-emerald-800 dark:text-emerald-400 dark:hover:text-emerald-300 flex items-center justify-center gap-1 cursor-pointer py-1 bg-slate-50 dark:bg-slate-900/30 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-900/60 transition-colors"
                              >
                                {isExpanded ? (
                                  <><span>▲ Ukryj szczegóły, kalendarz i historię</span></>
                                ) : (
                                  <><span>▼ Pokaż kalendarz i historię ({classRealizations.length})</span></>
                                )}
                              </button>
                            </div>

                            {/* Expanded Calendar and History list */}
                            {isExpanded && (
                              <div className={`space-y-3.5 pt-2 border-t ${activeThemeConfig.border}`}>
                                <div>
                                  <div className="text-[9px] uppercase tracking-wider text-slate-400 dark:text-slate-500 font-bold mb-1">
                                    📅 Kalendarz lekcji:
                                  </div>
                                  {renderCalendar()}
                                </div>

                                <div className="space-y-1.5">
                                  <div className="text-[9px] uppercase tracking-wider text-slate-400 dark:text-slate-500 font-bold flex items-center justify-between">
                                    <span>📜 Ostatnie działania / Historia lekcji:</span>
                                    <span className="text-[8px] font-mono bg-slate-100 dark:bg-slate-900 px-1 py-0.5 rounded text-slate-500">{classRealizations.length} wpisów</span>
                                  </div>
                                  
                                  {classRealizations.length > 0 ? (
                                    <div className="relative pl-3 border-l border-emerald-600/20 dark:border-emerald-500/20 space-y-2.5 mt-1.5 max-h-56 overflow-y-auto pr-0.5">
                                      {classRealizations.map((r, rIdx) => {
                                        const chap = chapters.find((c) => c.id === r.chapterId);
                                        return (
                                          <div key={`${r.chapterId}-${r.timestamp}-${rIdx}`} className="relative text-[10.5px]">
                                            <span className="absolute -left-[16px] top-1.5 w-1.5 h-1.5 rounded-full bg-emerald-600 dark:bg-emerald-500 border border-white dark:border-slate-800" />
                                            
                                            <div className="flex items-start justify-between gap-1 group/item p-1 hover:bg-slate-50 dark:hover:bg-slate-800/40 rounded-lg transition-colors">
                                              <div className="space-y-0.5 flex-1 min-w-0 pr-1">
                                                <div className="font-semibold text-slate-800 dark:text-slate-200 truncate" title={chap ? chap.title : 'Nieznany temat'}>
                                                  {chap ? chap.title : 'Nieznany temat'}
                                                </div>
                                                <div className="text-[8.5px] font-mono text-slate-400 dark:text-slate-500 flex items-center justify-between">
                                                  <span className="truncate max-w-[90px]">📂 {chap ? chap.chapterGroup || 'Główny' : 'Puste'}</span>
                                                  <span className="text-emerald-700/80 dark:text-emerald-450/80">📅 {formatTimestamp(r.timestamp)}</span>
                                                </div>
                                              </div>
                                              
                                              <button
                                                type="button"
                                                id={`undo-realize-${cls}-${r.chapterId}-${rIdx}`}
                                                onClick={(e) => {
                                                  e.stopPropagation();
                                                  setRealizations((prev) => 
                                                    prev.filter((item) => !(item.className === cls && item.chapterId === r.chapterId && item.timestamp === r.timestamp))
                                                  );
                                                }}
                                                className="text-[9px] font-bold text-red-500 hover:text-red-700 transition-colors opacity-80 hover:opacity-100 bg-red-50 dark:bg-red-950/20 px-1 py-0.5 rounded cursor-pointer self-center"
                                                title="Usuń to zrealizowanie lekcji"
                                              >
                                                Cofnij
                                              </button>
                                            </div>
                                          </div>
                                        );
                                      })}
                                    </div>
                                  ) : (
                                    <div className="text-center italic text-slate-400 dark:text-slate-500 py-2.5 bg-slate-50/50 dark:bg-slate-900/20 rounded-lg text-[9.5px]">
                                      Brak zrealizowanych lekcji w tej klasie.
                                    </div>
                                  )}
                                </div>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="text-center py-4 border border-dashed rounded-xl border-slate-200 dark:border-slate-800">
                      <p className="text-[10px] text-slate-500">Definiuj klasy powyżej, aby zobaczyć statystyki realizowania tematów!</p>
                    </div>
                  )}
                </div>

              </div>
            )}
            </motion.aside>
          )}
        </AnimatePresence>

      </div>

      {/* Visual Lightbox Modal for Images */}
      <AnimatePresence>
        {selectedLightboxImage && (
          <motion.div 
            key="image-lightbox-modal"
            id="image-lightbox-modal"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.22 }}
            className="fixed inset-0 bg-[#000000ee]/90 backdrop-blur-md flex flex-col items-center justify-center z-[1000] p-4"
            onClick={() => setSelectedLightboxImage(null)}
          >
            <div className="absolute top-4 right-4 flex items-center gap-2">
              <button
                type="button"
                className="px-3 py-1.5 bg-slate-900 border border-slate-700/60 text-white rounded-lg hover:bg-slate-800 text-xs font-bold cursor-pointer transition-all"
                onClick={(e) => {
                  e.stopPropagation();
                  if (navigator && navigator.clipboard) {
                    navigator.clipboard.writeText(selectedLightboxImage);
                  }
                }}
              >
                Kopiuj link 🔗
              </button>
              <button
                type="button"
                className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 text-white flex items-center justify-center font-bold text-lg cursor-pointer transition-all"
                onClick={() => setSelectedLightboxImage(null)}
              >
                ✕
              </button>
            </div>
            <motion.div 
              initial={{ scale: 0.95, opacity: 0, y: 15 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 15 }}
              transition={{ type: 'spring', damping: 28, stiffness: 240 }}
              className="max-w-4xl max-h-[80vh] relative group" 
              onClick={(e) => e.stopPropagation()}
            >
              <img 
                src={selectedLightboxImage} 
                alt="Lightbox Podgląd" 
                referrerPolicy="no-referrer"
                className="max-w-full max-h-[80vh] rounded-xl border border-slate-700/50 object-contain shadow-2xl select-all" 
              />
            </motion.div>
            <p className="text-slate-400 text-xs mt-3 text-center pointer-events-none max-w-lg">
              Kliknij poza obrazem lub naciśnij ✕, aby zamknąć podgląd.
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* CHAPTER CREATOR MODAL LAYER */}
      <AnimatePresence>
        {isCreatorOpen && (
          <ChapterManager
            allChapters={chapters}
            onAddChapter={handleAddNewChapter}
            onUpdateChapter={handleUpdateChapter}
            editingChapter={editingChapter}
            onImportAll={handleImportAllChapters}
            onClose={() => {
              setIsCreatorOpen(false);
              setEditingChapter(null);
            }}
            showToast={showToast}
            showConfirm={showConfirm}
          />
        )}
      </AnimatePresence>

      {/* Dynamic Custom Toast Notification */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-6 right-6 max-w-sm w-full bg-white dark:bg-slate-900 p-4 rounded-2xl shadow-xl border border-slate-200/80 dark:border-slate-800 flex items-start gap-3 pointer-events-auto select-none"
            style={{ zIndex: 9999 }}
          >
            <div className={`p-1.5 rounded-lg shrink-0 ${
              toast.type === 'success' 
                ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-400' 
                : toast.type === 'error'
                ? 'bg-rose-100 text-rose-800 dark:bg-rose-950/50 dark:text-rose-400'
                : 'bg-indigo-100 text-indigo-800 dark:bg-indigo-950/50 dark:text-indigo-400'
            }`}>
              {toast.type === 'success' ? (
                <Check className="w-4 h-4" />
              ) : toast.type === 'error' ? (
                <AlertCircle className="w-4 h-4" />
              ) : (
                <Info className="w-4 h-4" />
              )}
            </div>
            <div className="flex-1 min-w-0 pt-0.5">
              <p className="text-xs font-bold text-slate-800 dark:text-slate-100">
                {toast.type === 'success' ? 'Sukces' : toast.type === 'error' ? 'Błąd' : 'Informacja'}
              </p>
              <p className="text-[11px] leading-normal text-slate-500 dark:text-slate-400 mt-0.5">
                {toast.message}
              </p>
            </div>
            <button
              onClick={() => setToast(null)}
              className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 p-0.5 hover:bg-slate-50 dark:hover:bg-slate-800/80 rounded-lg cursor-pointer transition-colors shrink-0"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Dynamic Custom Confirm Modal Dialog */}
      <AnimatePresence>
        {confirmModal && (
          <div className="fixed inset-0 flex items-center justify-center p-4 bg-black/60 backdrop-blur-2xs" style={{ zIndex: 9998 }}>
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className={`max-w-md w-full rounded-3xl border p-6 shadow-2xl ${activeThemeConfig.sidebarBg} ${activeThemeConfig.border} flex flex-col gap-4 text-left pointer-events-auto`}
            >
              <div className="flex items-start gap-3.5">
                <div className="p-3 bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 rounded-2xl shrink-0">
                  <AlertCircle className="w-6 h-6" />
                </div>
                <div className="space-y-1">
                  <h3 className={`font-serif font-bold text-base transition-colors duration-300 ${activeThemeConfig.h1}`}>
                    {confirmModal.title}
                  </h3>
                  <p className="text-xs leading-relaxed text-slate-500 dark:text-slate-400 pr-1">
                    {confirmModal.message}
                  </p>
                </div>
              </div>

              <div className="flex justify-end gap-2.5 pt-2">
                <button
                  onClick={() => setConfirmModal(null)}
                  className={`px-4 py-2 text-xs font-bold rounded-xl cursor-pointer transition-all ${activeThemeConfig.galleryPresetBtn}`}
                >
                  Anuluj
                </button>
                <button
                  onClick={() => {
                    confirmModal.onConfirm();
                    setConfirmModal(null);
                  }}
                  className="px-5 py-2 text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 active:scale-95 transition-all rounded-xl cursor-pointer"
                >
                  Potwierdź
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* FULLSCREEN FOCUSED NOTE EDITOR (Focus Mode) */}
      <AnimatePresence>
        {isNotesFullscreen && activeChapter && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className={`fixed inset-0 z-[100] flex flex-col p-6 sm:p-10 ${activeThemeConfig.sidebarBg} transition-all duration-300`}
          >
            {/* Header */}
            <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-200/60 dark:border-slate-800/60">
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400`}>
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <h2 className={`font-serif font-bold text-lg leading-tight transition-colors duration-300 ${activeThemeConfig.h1}`}>
                    {activeChapter.title} — Pełnoekranowy Notatnik 📝
                  </h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Tryb pełnego skupienia (Focus Mode) • Przedmiot: {activeChapter.subject}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                {/* Autosave Status */}
                {isNotesSaving ? (
                  <span className="text-xs font-extrabold text-amber-500 animate-pulse font-mono flex items-center gap-1.5 bg-amber-50 dark:bg-amber-950/40 px-3 py-1.5 rounded-xl">
                    <span className="w-2 h-2 rounded-full bg-amber-500 animate-ping" />
                    Autozapis...
                  </span>
                ) : (
                  <span className="text-xs font-extrabold text-emerald-600 dark:text-emerald-400 font-mono flex items-center gap-1.5 bg-emerald-50 dark:bg-emerald-950/40 px-3 py-1.5 rounded-xl">
                    <span className="w-2 h-2 rounded-full bg-emerald-500" />
                    Zapisano
                  </span>
                )}

                {/* Copy notes button */}
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(localNoteText);
                    showToast("Notatki skopiowane do schowka!", "success");
                  }}
                  className={`p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-350 transition-all cursor-pointer flex items-center gap-1.5 text-xs font-bold`}
                  title="Skopiuj notatki"
                >
                  <Copy className="w-4 h-4" />
                  <span className="hidden sm:inline">Skopiuj</span>
                </button>

                {/* Download notes button */}
                <button
                  onClick={handleDownloadNotes}
                  className={`p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-350 transition-all cursor-pointer flex items-center gap-1.5 text-xs font-bold`}
                  title="Pobierz notatki jako plik .md"
                >
                  <Download className="w-4 h-4" />
                  <span className="hidden sm:inline">Pobierz .md</span>
                </button>

                {/* Download PDF button */}
                <button
                  onClick={handleDownloadNotesPDF}
                  className={`p-2.5 rounded-xl border border-emerald-200 hover:bg-emerald-50 dark:border-emerald-950/40 dark:hover:bg-emerald-950/20 text-emerald-700 dark:text-emerald-450 transition-all cursor-pointer flex items-center gap-1.5 text-xs font-bold`}
                  title="Wydrukuj podsumowanie lekcji lub pobierz jako PDF"
                >
                  <Printer className="w-4 h-4" />
                  <span className="hidden sm:inline">Drukuj / PDF</span>
                </button>

                {/* Clear notes button */}
                <button
                  onClick={() => {
                    showConfirm(
                      "Czy na pewno chcesz całkowicie wyczyścić wszystkie notatki dla tej lekcji? Te zmiany są nieodwracalne.",
                      () => {
                        setLocalNoteText('');
                        setProgress((prev) => {
                          const updatedNotes = { ...prev.chapterNotes, [activeChapter.id]: '' };
                          return { ...prev, chapterNotes: updatedNotes };
                        });
                        showToast("Notatki zostały wyczyszczone.", "info");
                      },
                      "Wyczyść notatki"
                    );
                  }}
                  className={`p-2.5 rounded-xl border border-red-200 hover:bg-red-50 dark:border-red-950/40 dark:hover:bg-red-950/20 text-red-600 dark:text-red-400 transition-all cursor-pointer flex items-center gap-1.5 text-xs font-bold`}
                  title="Wyczyść notatki"
                >
                  <Trash2 className="w-4 h-4" />
                  <span className="hidden sm:inline">Wyczyść</span>
                </button>

                {/* Close fullscreen button */}
                <button
                  id="close-fullscreen-notes-btn"
                  onClick={() => setIsNotesFullscreen(false)}
                  className={`px-4 py-2.5 bg-slate-950 hover:bg-slate-900 dark:bg-slate-100 dark:hover:bg-slate-200 text-white dark:text-slate-900 font-extrabold text-xs rounded-xl flex items-center gap-1.5 cursor-pointer transition-all shadow-sm`}
                >
                  <Minimize className="w-4 h-4" />
                  <span>Zminimalizuj</span>
                </button>
              </div>
            </div>

            {/* Editor Workspace */}
            <div className="flex-1 flex flex-col lg:flex-row gap-6 mt-6 min-h-0">
              
              {/* Textarea Area */}
              <div className="flex-1 flex flex-col gap-2 min-h-0">
                {/* Markdown Toolbar */}
                <div className={`flex flex-wrap items-center gap-1 p-1.5 rounded-xl border ${activeThemeConfig.border} bg-slate-50/50 dark:bg-slate-900/45`}>
                  <span className="text-[10px] font-sans text-slate-400 dark:text-slate-500 font-extrabold uppercase px-2 py-1">Formatuj:</span>
                  
                  <button
                    type="button"
                    onClick={() => insertMarkdown('bold')}
                    className="p-1.5 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 dark:text-slate-400 dark:hover:text-white dark:hover:bg-slate-800 transition-colors cursor-pointer flex items-center gap-1 text-[11px] font-bold"
                    title="Pogrubienie (**tekst**)"
                  >
                    <Bold className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">Pogrubienie</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => insertMarkdown('italic')}
                    className="p-1.5 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 dark:text-slate-400 dark:hover:text-white dark:hover:bg-slate-800 transition-colors cursor-pointer flex items-center gap-1 text-[11px] font-bold"
                    title="Kursywa (*tekst*)"
                  >
                    <Italic className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">Kursywa</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => insertMarkdown('heading')}
                    className="p-1.5 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 dark:text-slate-400 dark:hover:text-white dark:hover:bg-slate-800 transition-colors cursor-pointer flex items-center gap-1 text-[11px] font-bold"
                    title="Nagłówek (### nagłówek)"
                  >
                    <Heading className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">Nagłówek</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => insertMarkdown('list')}
                    className="p-1.5 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 dark:text-slate-400 dark:hover:text-white dark:hover:bg-slate-800 transition-colors cursor-pointer flex items-center gap-1 text-[11px] font-bold"
                    title="Lista wypunktowana (- element)"
                  >
                    <List className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">Lista</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => insertMarkdown('link')}
                    className="p-1.5 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 dark:text-slate-400 dark:hover:text-white dark:hover:bg-slate-800 transition-colors cursor-pointer flex items-center gap-1 text-[11px] font-bold"
                    title="Wstaw odnośnik [tekst](url)"
                  >
                    <Link className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">Link</span>
                  </button>
                </div>

                <textarea
                  id="fullscreen-notes-textarea"
                  className={`flex-1 p-6 text-sm sm:text-base leading-relaxed border rounded-2xl focus:outline-hidden focus:ring-3 font-mono resize-none transition-all duration-300 shadow-inner ${activeThemeConfig.studentNotesTextarea}`}
                  placeholder="Tutaj możesz swobodnie pisać podsumowanie, notatki z lekcji, ważne pojęcia...\nTwój postęp jest zapisywany automatycznie."
                  value={localNoteText}
                  onChange={(e) => setLocalNoteText(e.target.value)}
                  autoFocus
                />
              </div>

              {/* Sidebar Reference panel (Gallery images & Helper suggestions) */}
              <div className="w-full lg:w-80 shrink-0 flex flex-col gap-4 min-h-0">
                
                {/* Visual Reference / Chapter Images */}
                <div className={`p-4 rounded-2xl border ${activeThemeConfig.border} ${activeThemeConfig.secondaryCardBg} flex-1 flex flex-col min-h-0`}>
                  <h3 className={`text-xs font-extrabold uppercase tracking-wide mb-3 flex items-center gap-1.5 ${activeThemeConfig.studentNotesLabel}`}>
                    <Image className="w-4 h-4 text-emerald-600" />
                    <span>Galeria tej lekcji</span>
                  </h3>

                  {(chapterGalleryImages[activeChapter.id] || []).length === 0 ? (
                    <div className="flex-1 flex flex-col items-center justify-center text-center p-6 border border-dashed border-slate-200 dark:border-slate-800 rounded-xl">
                      <Image className="w-8 h-8 text-slate-300 dark:text-slate-700 mb-2" />
                      <p className="text-[11px] text-slate-400 leading-normal">
                        Brak obrazów w galerii tej lekcji. Możesz je dodać w panelu bocznym.
                      </p>
                    </div>
                  ) : (
                    <div className="flex-1 overflow-y-auto pr-1 grid grid-cols-2 gap-2.5 content-start">
                      {(chapterGalleryImages[activeChapter.id] || []).map((imgUrl, idx) => (
                        <div 
                          key={idx} 
                          className="group relative aspect-video rounded-lg overflow-hidden border border-slate-200/60 dark:border-slate-800 bg-slate-100 dark:bg-slate-950 cursor-pointer"
                          onClick={() => setSelectedLightboxImage(imgUrl)}
                        >
                          <img 
                            src={imgUrl} 
                            alt={`Lekcja ${idx + 1}`} 
                            referrerPolicy="no-referrer"
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                            <span className="text-[10px] text-white font-extrabold bg-black/60 px-2 py-1 rounded-md">Podgląd</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Quick Helper Tips */}
                <div className={`p-4 rounded-2xl border border-slate-100 dark:border-slate-800/60 bg-slate-50 dark:bg-slate-900/40 text-xs text-slate-500 leading-relaxed space-y-2`}>
                  <h4 className="font-bold text-slate-700 dark:text-slate-350 flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                    <span>Wskazówki Focus Mode:</span>
                  </h4>
                  <ul className="list-disc list-inside space-y-1 text-[11px]">
                    <li>Użyj formatu Markdown do organizacji treści.</li>
                    <li>Notatki zapisują się natychmiast na tym urządzeniu.</li>
                    <li>Wciśnij <strong>Zminimalizuj</strong> lub klawisz <strong>Esc</strong>, aby powrócić do widoku lekcji.</li>
                  </ul>
                </div>

              </div>

            </div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
