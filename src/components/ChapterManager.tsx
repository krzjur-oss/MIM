import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Chapter, QuizQuestion, EDUCATION_LEVELS, SCHOOL_TYPES, GRADES } from '../types';
import { ALL_RELIGIA_CHAPTERS } from '../defaultChapters';
import { Upload, Plus, Trash2, BookOpen, Save, FileText, Sparkles, AlertCircle, HelpCircle, Eye, Edit3, Check } from 'lucide-react';

interface ChapterManagerProps {
  onAddChapter: (chapter: Chapter) => void;
  onUpdateChapter?: (chapter: Chapter) => void;
  editingChapter?: Chapter | null;
  onImportAll: (chapters: Chapter[]) => void;
  allChapters: Chapter[];
  onClose: () => void;
  showToast?: (message: string, type?: 'success' | 'error' | 'info') => void;
  showConfirm?: (message: string, onConfirm: () => void, title?: string) => void;
}

export default function ChapterManager({ onAddChapter, onUpdateChapter, editingChapter = null, onImportAll, allChapters, onClose, showToast, showConfirm }: ChapterManagerProps) {
  const notify = (msg: string, type: 'success' | 'error' | 'info' = 'success') => {
    if (showToast) {
      showToast(msg, type);
    } else {
      alert(msg);
    }
  };

  const ask = (msg: string, onConfirm: () => void, title = 'Potwierdzenie') => {
    if (showConfirm) {
      showConfirm(msg, onConfirm, title);
    } else if (confirm(msg)) {
      onConfirm();
    }
  };
  // Mode: 'create' | 'import_files' | 'export_import'
  const [activeTab, setActiveTab] = useState<'create' | 'import_files'>('create');
  
  // Create Chapter States
  const [title, setTitle] = useState(editingChapter?.title || ''); // Temat lekcji (np. "Bóg stwarza świat z miłości")
  const [subject, setSubject] = useState(editingChapter?.subject || ''); // Przedmiot (np. "Religia")
  const [content, setContent] = useState(editingChapter?.content || '');
  const [readTime, setReadTime] = useState(editingChapter?.estimatedReadTime || 5);
  const [quizzes, setQuizzes] = useState<QuizQuestion[]>(editingChapter?.quizzes || []);
  
  // Advanced Education States
  const [schoolType, setSchoolType] = useState(
    editingChapter 
      ? (SCHOOL_TYPES.includes(editingChapter.schoolType) ? editingChapter.schoolType : 'Inny...') 
      : 'Szkoła Podstawowa'
  );
  const [customSchoolType, setCustomSchoolType] = useState(
    editingChapter && !SCHOOL_TYPES.includes(editingChapter.schoolType) ? editingChapter.schoolType : ''
  );
  const [grade, setGrade] = useState(
    editingChapter 
      ? (GRADES.includes(editingChapter.grade) ? editingChapter.grade : 'Inny...') 
      : 'Klasa 1'
  );
  const [customGrade, setCustomGrade] = useState(
    editingChapter && !GRADES.includes(editingChapter.grade) ? editingChapter.grade : ''
  );
  const [chapterGroup, setChapterGroup] = useState(editingChapter?.chapterGroup || ''); // Rozdział / Dział nadrzędny (np. "Stworzenie świata")
  
  // Quiz creator state
  const [quizQuestion, setQuizQuestion] = useState('');
  const [quizOpts, setQuizOpts] = useState<string[]>(['', '', '']);
  const [correctOptIdx, setCorrectOptIdx] = useState(0);
  const [explanation, setExplanation] = useState('');

  // Drag & drop file states
  const [dragActive, setDragActive] = useState(false);
  const [importedChapters, setImportedChapters] = useState<Partial<Chapter>[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Preview toggle in editor
  const [editorMode, setEditorMode] = useState<'edit' | 'preview'>('edit');

  // Selective JSON backup import state
  const [pendingImportBackup, setPendingImportBackup] = useState<Chapter[] | null>(null);
  const [selectedImportIds, setSelectedImportIds] = useState<Set<string>>(new Set());
  const [importSearch, setImportSearch] = useState('');
  const [importSubjectFilter, setImportSubjectFilter] = useState('Wszystkie');
  const [importMergeMode, setImportMergeMode] = useState<'merge' | 'replace'>('merge');

  // Export filter state
  const [exportSubjectFilter, setExportSubjectFilter] = useState('Wszystkie');

  // Handle Drag & Drop events
  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const parseMdFile = (fileName: string, text: string): Partial<Chapter> => {
    // Attempt to extract top-level header as title
    const match = text.match(/^\s*#\s+(.+)$/m);
    let extractedTitle = match ? match[1].trim() : fileName.replace('.md', '');
    
    // Clean markdown cleanups if any
    let cleanContent = text;
    // Calculate reading time: avg 150 words per minute
    const wordCount = text.split(/\s+/).filter(Boolean).length;
    const estTime = Math.max(1, Math.round(wordCount / 150));

    return {
      id: 'custom-' + Math.random().toString(36).substr(2, 9),
      title: extractedTitle,
      content: cleanContent,
      subject: 'Własne',
      estimatedReadTime: estTime,
      createdAt: Date.now()
    };
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const filesList = Array.from(e.dataTransfer.files);
      const parsed: Partial<Chapter>[] = [];

      for (const file of filesList) {
        if (file.name.endsWith('.md') || file.type === 'text/markdown' || file.name.endsWith('.txt')) {
          const text = await file.text();
          parsed.push(parseMdFile(file.name, text));
        }
      }
      
      if (parsed.length > 0) {
        setImportedChapters((prev) => [...prev, ...parsed]);
      }
    }
  };

  const handleFileInput = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const filesList = Array.from(e.target.files);
      const parsed: Partial<Chapter>[] = [];

      for (const file of filesList) {
        const text = await file.text();
        parsed.push(parseMdFile(file.name, text));
      }
      
      if (parsed.length > 0) {
        setImportedChapters((prev) => [...prev, ...parsed]);
      }
    }
  };

  const addQuizQuestion = () => {
    if (!quizQuestion.trim()) return;
    const nonEmptyOpts = quizOpts.map((o) => o.trim()).filter(Boolean);
    if (nonEmptyOpts.length < 2) {
      notify('Pytanie musi zawierać co najmniej 2 poprawne odpowiedzi!', 'error');
      return;
    }

    const newQ: QuizQuestion = {
      id: 'q-' + Math.random().toString(36).substr(2, 9),
      question: quizQuestion.trim(),
      options: nonEmptyOpts,
      correctAnswer: correctOptIdx >= nonEmptyOpts.length ? 0 : correctOptIdx,
      explanation: explanation.trim() || undefined
    };

    setQuizzes([...quizzes, newQ]);
    // Reset quiz fields
    setQuizQuestion('');
    setQuizOpts(['', '', '']);
    setCorrectOptIdx(0);
    setExplanation('');
  };

  const removeQuizQuestion = (id: string) => {
    setQuizzes(quizzes.filter((q) => q.id !== id));
  };

  const handleSaveCreatedChapter = () => {
    if (!title.trim() || !content.trim()) {
      notify('Tytuł (temat lekcji) oraz treść rozdziału są wymagane!', 'error');
      return;
    }

    const finalSchoolType = schoolType === 'Inny...' ? customSchoolType.trim() || 'Ogólny' : schoolType;
    const finalGrade = grade === 'Inny...' ? customGrade.trim() || 'Ogólny' : grade;
    const finalChapterGroup = chapterGroup.trim() || 'Ogólne';

    const finalChapter: Chapter = {
      id: editingChapter?.id || 'custom-' + Math.random().toString(36).substr(2, 9),
      title: title.trim(),
      subject: subject.trim() || 'Ogólne',
      schoolType: finalSchoolType,
      grade: finalGrade,
      chapterGroup: finalChapterGroup,
      educationLevel: `${finalSchoolType} (${finalGrade})`,
      content: content.trim(),
      estimatedReadTime: readTime || 3,
      quizzes: quizzes.length > 0 ? quizzes : undefined,
      createdAt: editingChapter?.createdAt || Date.now()
    };

    if (editingChapter && onUpdateChapter) {
      onUpdateChapter(finalChapter);
    } else {
      onAddChapter(finalChapter);
    }
    onClose();
  };

  const handleSaveImportedChapter = (index: number) => {
    const item = importedChapters[index];
    if (!item.title || !item.content) return;

    const finalChapter: Chapter = {
      id: item.id || 'custom-' + Math.random().toString(36).substr(2, 9),
      title: item.title,
      subject: item.subject || 'Własne',
      educationLevel: item.educationLevel || 'Ogólny',
      content: item.content,
      estimatedReadTime: item.estimatedReadTime || 3,
      quizzes: item.quizzes,
      createdAt: item.createdAt || Date.now()
    };

    onAddChapter(finalChapter);
    // Remove from importing list
    setImportedChapters(importedChapters.filter((_, idx) => idx !== index));
    if (importedChapters.length === 1) {
      onClose();
    }
  };

  const handleExportBook = () => {
    const chaptersToExport = exportSubjectFilter === 'Wszystkie'
      ? allChapters
      : allChapters.filter((c) => c.subject === exportSubjectFilter);

    if (chaptersToExport.length === 0) {
      notify('Brak rozdziałów do wyeksportowania dla wybranego przedmiotu.', 'error');
      return;
    }

    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(chaptersToExport, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    const suffix = exportSubjectFilter === 'Wszystkie' ? 'all' : exportSubjectFilter.toLowerCase().replace(/\s+/g, '-');
    downloadAnchor.setAttribute('download', `multibook-export-${suffix}-${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    notify(`Pomyślnie pobrano plik kopii zapasowej z ${chaptersToExport.length} lekcjami!`, 'success');
  };

  const handleRestoreReligiaBackup = () => {
    ask('Czy na pewno chcesz odblokować i przywrócić wszystkie materiały z przedmiotu Religia na tym urządzeniu?', () => {
      const existingIds = new Set(allChapters.map((c) => c.id));
      const toAdd = ALL_RELIGIA_CHAPTERS.filter((c) => !existingIds.has(c.id));
      if (toAdd.length === 0) {
        notify('Treści z przedmiotu Religia są już w pełni odblokowane!', 'info');
        return;
      }
      const merged = [...allChapters, ...toAdd];
      onImportAll(merged);
      notify(`Pomyślnie odblokowano ${toAdd.length} lekcji Religii z kopii zapasowej!`, 'success');
      onClose();
    }, 'Przywracanie Religii z Kopii Zapasowej');
  };

  const handleImportBookJSON = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const fileReader = new FileReader();
      fileReader.onload = (event) => {
        try {
          const raw = event.target?.result as string;
          const parsed = JSON.parse(raw);
          let loadedChapters: Chapter[] = [];

          if (Array.isArray(parsed)) {
            loadedChapters = parsed;
          } else if (parsed && typeof parsed === 'object') {
            if (Array.isArray(parsed.chapters)) loadedChapters = parsed.chapters;
            else if (Array.isArray(parsed.allChapters)) loadedChapters = parsed.allChapters;
            else if (Array.isArray(parsed.items)) loadedChapters = parsed.items;
          }

          if (loadedChapters.length > 0 && loadedChapters.every((itm) => itm.title && itm.content)) {
            const sanitized: Chapter[] = loadedChapters.map((ch, idx) => ({
              id: ch.id || `imported-${Date.now()}-${idx}`,
              title: ch.title,
              subject: ch.subject || 'Inny',
              educationLevel: ch.educationLevel || 'Ogólny',
              grade: ch.grade || 'Klasa 1',
              schoolType: ch.schoolType || 'Szkoła Podstawowa',
              chapterGroup: ch.chapterGroup || 'Inne',
              content: ch.content,
              estimatedReadTime: ch.estimatedReadTime || 5,
              quizzes: ch.quizzes || [],
              createdAt: ch.createdAt || Date.now()
            }));

            setPendingImportBackup(sanitized);
            setSelectedImportIds(new Set(sanitized.map((c) => c.id)));
            setImportSearch('');
            setImportSubjectFilter('Wszystkie');
            setImportMergeMode('merge');
            notify(`Odczytano plik kopii z ${sanitized.length} lekcjami. Wybierz tematy do przywrócenia.`, 'info');
          } else {
            notify('Niepoprawny format pliku JSON. Plik musi zawierać tablicę rozdziałów.', 'error');
          }
        } catch (err) {
          notify('Błąd odczytu pliku JSON.', 'error');
        }
      };
      fileReader.readAsText(file);
      e.target.value = '';
    }
  };

  const handleConfirmSelectiveImport = () => {
    if (!pendingImportBackup) return;

    const selectedChapters = pendingImportBackup.filter((ch) => selectedImportIds.has(ch.id));

    if (selectedChapters.length === 0) {
      notify('Proszę zaznaczyć przynajmniej jeden rozdział do zaimportowania.', 'error');
      return;
    }

    if (importMergeMode === 'replace') {
      ask(
        `Czy na pewno chcesz zastąpić CAŁĄ obecną bazę (${allChapters.length} lekcji) wybranymi ${selectedChapters.length} rozdziałami z kopii zapasowej?`,
        () => {
          onImportAll(selectedChapters);
          notify(`Zaimportowano i przywrócono ${selectedChapters.length} wybranych rozdziałów!`, 'success');
          setPendingImportBackup(null);
          onClose();
        },
        'Potwierdzenie Zastąpienia Bazy'
      );
    } else {
      // Merge mode
      const existingMap = new Map<string, Chapter>();
      allChapters.forEach((c) => existingMap.set(c.id, c));

      let addedCount = 0;
      let updatedCount = 0;

      selectedChapters.forEach((ch) => {
        if (existingMap.has(ch.id)) {
          updatedCount++;
        } else {
          addedCount++;
        }
        existingMap.set(ch.id, ch);
      });

      const mergedList = Array.from(existingMap.values());
      onImportAll(mergedList);

      notify(
        `Pomyślnie przywrócono rozdziały z kopii! Dodano ${addedCount} nowych lekcji, zaktualizowano ${updatedCount}.`,
        'success'
      );
      setPendingImportBackup(null);
      onClose();
    }
  };

  const handleSelectAllImport = () => {
    if (!pendingImportBackup) return;
    setSelectedImportIds(new Set(pendingImportBackup.map((c) => c.id)));
  };

  const handleDeselectAllImport = () => {
    setSelectedImportIds(new Set());
  };

  const handleSelectOnlyNewImport = () => {
    if (!pendingImportBackup) return;
    const existingIds = new Set(allChapters.map((c) => c.id));
    const newIds = pendingImportBackup.filter((c) => !existingIds.has(c.id)).map((c) => c.id);
    setSelectedImportIds(new Set(newIds));
  };

  return (
    <motion.div
      id="chapter-manager-overlay"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.22 }}
      className="fixed inset-0 bg-stone-900/40 backdrop-blur-xs flex items-center justify-center p-4 z-50 overflow-y-auto"
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 12 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: 12 }}
        transition={{ type: 'spring', damping: 28, stiffness: 240 }}
        className="bg-[#FAF9F5] dark:bg-slate-900 rounded-2xl w-full max-w-4xl max-h-[90vh] flex flex-col shadow-2xl border border-[#EDEAE2] dark:border-slate-800"
      >
        
        {/* Header */}
        <div className="p-5 border-b border-[#EDEAE2] dark:border-slate-800 flex items-center justify-between">
          <div>
            <h2 id="manager-title" className="text-xl font-serif font-bold text-emerald-900 dark:text-emerald-400 flex items-center gap-2">
              {editingChapter ? <Edit3 className="w-5 h-5 text-emerald-700" /> : <Plus className="w-5 h-5 text-emerald-700" />}
              <span>{editingChapter ? `Edycja Lekcji: ${editingChapter.title}` : 'Centrum Twórcy i Zarządzania Książką'}</span>
            </h2>
            <p className="text-xs text-[#5A5450] dark:text-slate-400 mt-1">
              {editingChapter ? 'Wprowadź poprawki do treści lekcji, zmień jej atrybuty lub zaktualizuj interaktywny quiz.' : 'Rozwiń swój multibook dodając nowe lekcje, sprawdziany lub importując pliki w formacie Markdown (.md).'}
            </p>
          </div>
          <button
            id="close-manager-btn"
            onClick={onClose}
            className="p-1 px-3 text-sm font-semibold rounded-lg text-[#5A5450] hover:bg-stone-200/50 dark:text-slate-300 dark:hover:bg-slate-800 cursor-pointer transition-colors"
          >
            Anuluj
          </button>
        </div>

        {/* Tabs */}
        {!editingChapter && (
          <div className="flex bg-[#EDEAE2] dark:bg-slate-800 border-b border-[#D9D4C7] dark:border-slate-800/80 p-1 px-4 gap-1">
            <button
              id="create-tab-btn"
              onClick={() => setActiveTab('create')}
              className={`px-4 py-2.5 text-sm font-medium rounded-lg cursor-pointer flex items-center gap-2 transition-all ${
                activeTab === 'create'
                  ? 'bg-white dark:bg-slate-900 text-emerald-800 dark:text-emerald-400 shadow-xs'
                  : 'text-[#5A5450] dark:text-slate-400 hover:text-emerald-900 dark:hover:text-slate-200'
              }`}
            >
              <Edit3 className="w-4 h-4" />
              <span>Napisz nowy rozdział</span>
            </button>

            <button
              id="import-tab-btn"
              onClick={() => setActiveTab('import_files')}
              className={`px-4 py-2.5 text-sm font-medium rounded-lg cursor-pointer flex items-center gap-2 transition-all ${
                activeTab === 'import_files'
                  ? 'bg-white dark:bg-slate-900 text-emerald-800 dark:text-emerald-400 shadow-xs'
                  : 'text-[#5A5450] dark:text-slate-400 hover:text-emerald-900 dark:hover:text-slate-200'
              }`}
            >
              <Upload className="w-4 h-4" />
              <span>Importuj pliki (.md / .json)</span>
            </button>
          </div>
        )}

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">

          {/* TAB 1: WRITE MANUALLY */}
          {activeTab === 'create' && (
            <div className="space-y-6 animate-in fade-in duration-200">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  {/* SCHOOL TYPE SELECTOR */}
                  <div>
                    <label className="block text-xs font-semibold text-[#5A5450] dark:text-slate-400 uppercase tracking-wider mb-1.5">
                      Typ Szkoły / Etap edukacyjny *
                    </label>
                    <div className="flex flex-col sm:flex-row gap-2">
                      <select
                        id="new-chapter-school-select"
                        value={schoolType}
                        onChange={(e) => setSchoolType(e.target.value)}
                        className="p-2.5 border border-[#EDEAE2] dark:border-slate-700 bg-white dark:bg-slate-800 rounded-xl text-sm focus:outline-hidden focus:ring-2 focus:ring-emerald-700/20 focus:border-emerald-700 text-slate-800 dark:text-white flex-1 cursor-pointer"
                      >
                        {SCHOOL_TYPES.map((type) => (
                          <option key={type} value={type}>{type}</option>
                        ))}
                        <option value="Inny...">Własny / Inny...</option>
                      </select>
                      {schoolType === 'Inny...' && (
                        <input
                          id="new-chapter-custom-school-input"
                          type="text"
                          value={customSchoolType}
                          onChange={(e) => setCustomSchoolType(e.target.value)}
                          placeholder="np. Przedszkole"
                          className="p-2.5 border border-[#EDEAE2] dark:border-slate-700 bg-white dark:bg-slate-800 rounded-xl text-sm focus:outline-hidden focus:ring-2 focus:ring-emerald-700/20 focus:border-emerald-700 text-slate-800 dark:text-white flex-1"
                        />
                      )}
                    </div>
                  </div>

                  {/* GRADE/CLASS SELECTOR */}
                  <div>
                    <label className="block text-xs font-semibold text-[#5A5450] dark:text-slate-400 uppercase tracking-wider mb-1.5">
                      Klasa / Poziom *
                    </label>
                    <div className="flex flex-col sm:flex-row gap-2">
                      <select
                        id="new-chapter-grade-select"
                        value={grade}
                        onChange={(e) => setGrade(e.target.value)}
                        className="p-2.5 border border-[#EDEAE2] dark:border-slate-700 bg-white dark:bg-slate-800 rounded-xl text-sm focus:outline-hidden focus:ring-2 focus:ring-emerald-700/20 focus:border-emerald-700 text-slate-800 dark:text-white flex-1 cursor-pointer"
                      >
                        {GRADES.map((g) => (
                          <option key={g} value={g}>{g}</option>
                        ))}
                        <option value="Inny...">Inny (Wpisz)...</option>
                      </select>
                      {grade === 'Inny...' && (
                        <input
                          id="new-chapter-custom-grade-input"
                          type="text"
                          value={customGrade}
                          onChange={(e) => setCustomGrade(e.target.value)}
                          placeholder="np. Klasa 1 Semestr I"
                          className="p-2.5 border border-[#EDEAE2] dark:border-slate-700 bg-white dark:bg-slate-800 rounded-xl text-sm focus:outline-hidden focus:ring-2 focus:ring-emerald-700/20 focus:border-emerald-700 text-slate-800 dark:text-white flex-1"
                        />
                      )}
                    </div>
                  </div>

                  {/* CHAPTER GROUP / DZIAŁ NADRZĘDNY */}
                  <div>
                    <label className="block text-xs font-semibold text-[#5A5450] dark:text-slate-400 uppercase tracking-wider mb-1.5">
                      Dział / Rozdział nadrzędny *
                    </label>
                    <input
                      id="new-chapter-group-input"
                      type="text"
                      value={chapterGroup}
                      onChange={(e) => setChapterGroup(e.target.value)}
                      placeholder="np. Stworzenie świata (lub Biologia Komórki)"
                      className="w-full p-2.5 border border-[#EDEAE2] dark:border-slate-700 bg-white dark:bg-slate-800 rounded-xl text-sm focus:outline-hidden focus:ring-2 focus:ring-emerald-700/20 focus:border-emerald-700 text-slate-800 dark:text-white"
                    />
                  </div>
                </div>

                <div className="space-y-3 font-sans">
                  {/* LESSON TOPIC */}
                  <div>
                    <label className="block text-xs font-semibold text-[#5A5450] dark:text-slate-400 uppercase tracking-wider mb-1.5">
                      Temat lekcji / Tytuł *
                    </label>
                    <input
                      id="new-chapter-title-input"
                      type="text"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="np. Bóg stwarza świat z miłości"
                      className="w-full p-2.5 border border-[#EDEAE2] dark:border-slate-700 bg-white dark:bg-slate-800 rounded-xl text-sm focus:outline-hidden focus:ring-2 focus:ring-emerald-700/20 focus:border-emerald-700 text-slate-800 dark:text-white"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-xs font-semibold text-[#5A5450] dark:text-slate-400 uppercase tracking-wider mb-1.5">
                        Przedmiot / Kategoria
                      </label>
                      <input
                        id="new-chapter-subject-input"
                        type="text"
                        value={subject}
                        onChange={(e) => setSubject(e.target.value)}
                        placeholder="np. Religia (lub Biologia)"
                        className="w-full p-2.5 border border-[#EDEAE2] dark:border-slate-700 bg-white dark:bg-slate-800 rounded-xl text-sm focus:outline-hidden focus:ring-2 focus:ring-emerald-700/20 focus:border-emerald-700 text-slate-800 dark:text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-[#5A5450] dark:text-slate-400 uppercase tracking-wider mb-1.5">
                        Czas czytania (minut)
                      </label>
                      <input
                        id="new-chapter-readtime-input"
                        type="number"
                        min="1"
                        value={readTime}
                        onChange={(e) => setReadTime(Number(e.target.value))}
                        className="w-full p-2.5 border border-[#EDEAE2] dark:border-slate-700 bg-white dark:bg-slate-800 rounded-xl text-sm focus:outline-hidden focus:ring-2 focus:ring-emerald-700/20 focus:border-emerald-700 text-slate-800 dark:text-white"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* MD Editor */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider">
                    Treść rozdziału (Format Markdown) *
                  </label>
                  <div className="flex gap-1 bg-slate-100 dark:bg-slate-800 p-0.5 rounded-lg text-xs">
                    <button
                      id="editor-edit-mode-btn"
                      type="button"
                      onClick={() => setEditorMode('edit')}
                      className={`px-3 py-1 rounded-md font-medium cursor-pointer transition-all ${
                        editorMode === 'edit'
                          ? 'bg-white dark:bg-slate-700 text-slate-800 dark:text-white shadow-xs'
                          : 'text-slate-500'
                      }`}
                    >
                      Edytor
                    </button>
                    <button
                      id="editor-preview-mode-btn"
                      type="button"
                      onClick={() => setEditorMode('preview')}
                      className={`px-3 py-1 rounded-md font-medium cursor-pointer transition-all ${
                        editorMode === 'preview'
                          ? 'bg-white dark:bg-slate-700 text-slate-800 dark:text-white shadow-xs'
                          : 'text-slate-500'
                      }`}
                    >
                      Podgląd
                    </button>
                  </div>
                </div>

                {editorMode === 'edit' ? (
                  <textarea
                    id="new-chapter-content-textarea"
                    rows={10}
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder={`Napisz treść w języku Markdown za pomocą standardowych tagów:\n\n# Nagłówek 1\n## Nagłówek 2\n\n* To jest punkt listy\n* Kolejny punkt\n\nZapraszamy do **pogrubień** oraz tabel!` }
                    className="w-full p-3 font-mono text-sm border border-[#EDEAE2] dark:border-slate-700 bg-white dark:bg-slate-800 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-emerald-700/20 focus:border-emerald-700 text-slate-800 dark:text-white"
                  />
                ) : (
                  <div id="new-chapter-preview-well" className="p-4 border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 rounded-xl min-h-[220px] max-h-[300px] overflow-y-auto">
                    {content ? (
                      <div className="prose dark:prose-invert max-w-none text-sm space-y-2 text-slate-700 dark:text-slate-350">
                        {content.split('\n').map((line, idx) => {
                          if (line.startsWith('# ')) return <h1 key={idx} className="text-xl font-bold mt-2 ml-0">{line.replace('# ', '')}</h1>;
                          if (line.startsWith('## ')) return <h2 key={idx} className="text-lg font-bold mt-2">{line.replace('## ', '')}</h2>;
                          if (line.startsWith('* ') || line.startsWith('- ')) return <li key={idx} className="ml-4 list-disc">{line.substring(2)}</li>;
                          return <p key={idx}>{line}</p>;
                        })}
                      </div>
                    ) : (
                      <p className="text-slate-400 text-sm font-medium italic">Wpisz treść, by zobaczyć podgląd...</p>
                    )}
                  </div>
                )}
              </div>

              {/* Quiz Builder for this Chapter */}
              <div className="bg-slate-50 dark:bg-slate-800/50 p-5 rounded-2xl border border-slate-150 dark:border-slate-800">
                <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100 flex items-center gap-1.5 mb-1">
                  <Sparkles className="w-4 h-4 text-amber-500" />
                  <span>Stwórz Interaktywny Quiz (Opcjonalnie)</span>
                </h3>
                <p className="text-xs text-slate-500 mb-4 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-2 rounded-lg">
                  Dodaj pytania testowe do tego rozdziału. Uczniowie będą mogli sprawdzić swoją wiedzę bezpośrednio pod tekstem lekcji!
                </p>

                {/* Question builder form */}
                <div className="space-y-3">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-1">
                      Treść Pytania
                    </label>
                    <input
                      id="quiz-question-input"
                      type="text"
                      value={quizQuestion}
                      onChange={(e) => setQuizQuestion(e.target.value)}
                      placeholder="np. Która planeta jest najbliżej Słońca?"
                      className="w-full p-2 border border-slate-250 dark:border-slate-700 bg-white dark:bg-slate-800 rounded-lg text-sm text-slate-800 dark:text-white"
                    />
                  </div>

                  {/* Options */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    {quizOpts.map((opt, oIdx) => (
                      <div key={oIdx}>
                        <label className="flex items-center gap-1 text-[11px] font-bold text-[#5A5450] dark:text-slate-400 mb-1">
                          <input
                            type="radio"
                            name="correct-opt-grp"
                            checked={correctOptIdx === oIdx}
                            onChange={() => setCorrectOptIdx(oIdx)}
                            className="text-emerald-700 h-3.5 w-3.5 cursor-pointer accent-emerald-600"
                          />
                          <span>Wariant {oIdx + 1} {correctOptIdx === oIdx && '✔️ (Poprawny)'}</span>
                        </label>
                        <input
                          id={`quiz-option-${oIdx}`}
                          type="text"
                          value={opt}
                          onChange={(e) => {
                            const updated = [...quizOpts];
                            updated[oIdx] = e.target.value;
                            setQuizOpts(updated);
                          }}
                          placeholder={`np. Odpowiedź ${oIdx + 1}`}
                          className="w-full p-2 border border-[#EDEAE2] dark:border-slate-700 bg-white dark:bg-slate-800 rounded-lg text-sm text-slate-800 dark:text-white"
                        />
                      </div>
                    ))}
                  </div>

                  {/* Explanation feedback */}
                  <div>
                    <label className="block text-[11px] font-bold text-[#5A5450] dark:text-slate-400 uppercase tracking-wider mb-1">
                      Komentarz/Objaśnienie dla ucznia (Opcjonalnie)
                    </label>
                    <input
                      id="quiz-explanation-input"
                      type="text"
                      value={explanation}
                      onChange={(e) => setExplanation(e.target.value)}
                      placeholder="np. Merkury jest najbliższą planetą, położoną zaledwie 58 mln km od Słońca."
                      className="w-full p-2 border border-[#EDEAE2] dark:border-slate-700 bg-white dark:bg-slate-800 rounded-lg text-sm text-slate-800 dark:text-white"
                    />
                  </div>

                  <button
                    id="add-quiz-q-btn"
                    type="button"
                    onClick={addQuizQuestion}
                    className="mt-2 px-3 py-2 bg-stone-100 hover:bg-emerald-50 hover:text-emerald-800 text-stone-700 text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-colors duration-200 cursor-pointer border border-[#EDEAE2] hover:border-emerald-200"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Dodaj Pytanie do Listy</span>
                  </button>
                </div>

                {/* Quizzes list current preview */}
                {quizzes.length > 0 && (
                  <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-800">
                    <span className="block text-xs font-bold text-slate-700 dark:text-slate-350 mb-2">Zaplanowane pytania w tym rozdziale ({quizzes.length}):</span>
                    <div className="space-y-2">
                      {quizzes.map((q, idx) => (
                        <div key={q.id} className="flex items-center justify-between text-xs p-2.5 bg-white dark:bg-slate-900 border border-[#EDEAE2] dark:border-slate-800 rounded-xl">
                          <div>
                            <span className="font-semibold text-emerald-800 dark:text-emerald-400 mr-1.5 icon font-sans">Q{idx + 1}.</span>
                            <span className="text-slate-700 dark:text-slate-300 font-medium">{q.question}</span>
                            <span className="text-[10px] text-[#9A9382] ml-2 block">Opcje: {q.options.join(', ')}</span>
                          </div>
                          <button
                            id={`remove-quiz-q-${idx}`}
                            onClick={() => removeQuizQuestion(q.id)}
                            className="p-1 text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-md cursor-pointer transition-colors"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Submit Buttons */}
              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  id="cancel-creative-btn"
                  onClick={onClose}
                  className="px-4 py-2 border border-[#EDEAE2] dark:border-slate-700 text-[#5A5450] dark:text-slate-300 text-sm font-semibold rounded-xl cursor-pointer hover:bg-stone-100 dark:hover:bg-slate-800 transition-colors"
                >
                  Anuluj
                </button>
                <button
                  id="save-new-chapter-btn"
                  onClick={handleSaveCreatedChapter}
                  className="px-5 py-2 bg-emerald-700 hover:bg-emerald-800 text-white text-sm font-semibold rounded-xl cursor-pointer shadow-md shadow-emerald-700/10 dark:shadow-none flex items-center gap-1.5 transition-colors"
                >
                  <Save className="w-4 h-4" />
                  <span>{editingChapter ? 'Zapisz zmiany' : 'Zapisz i wyświetl lekcję'}</span>
                </button>
              </div>
            </div>
          )}

          {/* TAB 2: IMPORT DIGITAL BOOK OR MD FILES */}
          {activeTab === 'import_files' && (
            <div className="space-y-6 animate-in fade-in duration-200">
              
              {/* Export / Import Section for JSON Backup */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-[#EDEAE2]/50 dark:bg-slate-800/40 p-5 rounded-2xl border border-[#EDEAE2] dark:border-slate-800 flex flex-col justify-between">
                  <div>
                    <h3 className="font-serif font-bold text-emerald-900 dark:text-white text-sm flex items-center gap-1.5">
                      <BookOpen className="w-4.5 h-4.5 text-emerald-750" />
                      <span>Eksportuj Twój Multibook</span>
                    </h3>
                    <p className="text-xs text-[#5A5450] dark:text-slate-350 mt-1.5 leading-relaxed">
                      Chcesz przenieść przygotowane lekcje na inne urządzenie? Wybierz zakres i pobierz plik kopii zapasowej (.json).
                    </p>
                    <div className="mt-3">
                      <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">
                        Zakres eksportu:
                      </label>
                      <select
                        id="export-subject-select"
                        value={exportSubjectFilter}
                        onChange={(e) => setExportSubjectFilter(e.target.value)}
                        className="w-full px-2.5 py-1.5 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                      >
                        <option value="Wszystkie">Wszystkie przedmioty ({allChapters.length})</option>
                        {Array.from(new Set(allChapters.map((c) => c.subject).filter(Boolean))).map((s) => (
                          <option key={s} value={s}>
                            {s} ({allChapters.filter((c) => c.subject === s).length})
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <button
                    id="export-multibook-json-btn"
                    onClick={handleExportBook}
                    className="mt-4 px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white font-semibold text-xs rounded-xl flex items-center justify-center gap-1.5 cursor-pointer shadow-xs transition-colors self-start"
                  >
                    <span>Wyeksportuj (.json)</span>
                  </button>
                </div>

                <div className="bg-slate-50 dark:bg-slate-800/50 p-5 rounded-2xl border border-slate-150 dark:border-slate-800 flex flex-col justify-between">
                  <div>
                    <h3 className="font-bold text-slate-800 dark:text-white text-sm flex items-center gap-1.5">
                      <Upload className="w-4.5 h-4.5 text-emerald-500" />
                      <span>Importuj i Przywróć Wybrane</span>
                    </h3>
                    <p className="text-xs text-slate-600 dark:text-slate-350 mt-1.5 leading-relaxed">
                      Wczytaj plik .json kopii zapasowej. Następnie w wygodnym oknie wybierzesz dokładnie te rozdziały, które chcesz przywrócić lub scalić z obecną bazą.
                    </p>
                  </div>
                  <div className="mt-4 flex items-center gap-2">
                    <label className="px-4 py-2 bg-slate-200 dark:bg-slate-700 dark:text-slate-200 hover:bg-slate-300 text-slate-800 font-semibold text-xs rounded-xl flex items-center justify-center gap-1.5 cursor-pointer transition-all">
                      <span>Wgraj plik (.json)</span>
                      <input
                        id="import-multibook-json-input"
                        type="file"
                        accept=".json"
                        onChange={handleImportBookJSON}
                        className="hidden"
                      />
                    </label>
                  </div>
                </div>

                <div className="bg-amber-50/70 dark:bg-amber-950/20 p-5 rounded-2xl border border-amber-200/80 dark:border-amber-900/40 flex flex-col justify-between">
                  <div>
                    <h3 className="font-bold text-amber-900 dark:text-amber-300 text-sm flex items-center gap-1.5">
                      <Sparkles className="w-4.5 h-4.5 text-amber-600 dark:text-amber-400" />
                      <span>Przywróć Kopię Zapasową Religii</span>
                    </h3>
                    <p className="text-xs text-amber-800/80 dark:text-amber-400/80 mt-1.5 leading-relaxed">
                      Chcesz odblokować pełne materiały dydaktyczne z przedmiotu Religia na tym urządzeniu? Kliknij poniżej, aby zaimportować fabryczną kopię zapasową Religii.
                    </p>
                  </div>
                  <button
                    id="restore-religia-backup-btn"
                    onClick={handleRestoreReligiaBackup}
                    className="mt-4 px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white font-semibold text-xs rounded-xl flex items-center justify-center gap-1.5 cursor-pointer shadow-xs transition-colors self-start"
                  >
                    <span>Odblokuj kopię Religii ✝️</span>
                  </button>
                </div>
              </div>

              {/* Drag and Drop MD Zone */}
              <div className="border-t border-slate-100 dark:border-slate-800 pt-6">
                <h3 className="font-bold text-slate-800 dark:text-white text-sm mb-3">
                  Przeciągnij i upuść pliki lekcji (.md / Markdown)
                </h3>

                <div
                  id="drag-and-drop-zone"
                  onDragEnter={handleDrag}
                  onDragOver={handleDrag}
                  onDragLeave={handleDrag}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                  className={`border-2 border-dashed rounded-2xl p-8 flex flex-col items-center justify-center text-center cursor-pointer transition-all ${
                    dragActive
                      ? 'border-emerald-700 bg-emerald-50/50 dark:bg-emerald-950/20'
                      : 'border-[#EDEAE2] dark:border-slate-700 hover:border-[#D9D4C7] bg-[#EDEAE2]/10 dark:bg-slate-800/35'
                  }`}
                >
                  <input
                    id="multibook-md-file-input"
                    ref={fileInputRef}
                    type="file"
                    accept=".md,.txt"
                    multiple
                    onChange={handleFileInput}
                    className="hidden"
                  />
                  <div className="p-3 bg-white dark:bg-slate-800 rounded-full shadow-sm mb-3 border border-slate-100 dark:border-slate-750">
                    <Upload className="w-6 h-6 text-[#5A5450] dark:text-slate-400" />
                  </div>
                  <p className="text-sm font-medium text-slate-800 dark:text-slate-200">
                    Wybierz pliki z dysku lub przeciągnij je tutaj
                  </p>
                  <p className="text-xs text-[#5A5450] mt-1">
                    Wspieramy pliki .md (Markdown) oraz .txt.
                  </p>
                  <div className="mt-3 text-[10px] bg-stone-100 dark:bg-slate-750 px-2.5 py-1 rounded-md font-mono text-slate-600 dark:text-slate-400 inline-block">
                    Pliki zostaną natychmiast przekonwertowane na interaktywne lekcje!
                  </div>
                </div>
              </div>

              {/* List of successfully imported files prior to final insertion */}
              {importedChapters.length > 0 && (
                <div className="bg-[#EDEAE2]/30 dark:bg-slate-800/30 p-4 rounded-xl border border-[#EDEAE2] dark:border-slate-800">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-bold text-[#5A5450] dark:text-slate-350 uppercase tracking-wide">
                      Rozpoznane pliki (.md) do zatwierdzenia ({importedChapters.length}):
                    </span>
                    <button
                      id="clear-imported-chapters-list"
                      onClick={() => setImportedChapters([])}
                      className="text-xs text-red-500 hover:underline font-semibold cursor-pointer"
                    >
                      Usuń wszystkie z listy
                    </button>
                  </div>

                  <div className="space-y-3">
                    {importedChapters.map((itm, index) => (
                      <div
                        key={index}
                        className="bg-white dark:bg-slate-900 border border-[#EDEAE2] dark:border-slate-850 p-4 rounded-xl flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xs"
                      >
                        <div className="space-y-1.5 flex-1">
                          <div className="flex items-center gap-2">
                            <span className="p-1 px-2 bg-emerald-50 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-400 rounded-md font-mono text-[10px] font-bold">
                              MD
                            </span>
                            <input
                              type="text"
                              value={itm.title || ''}
                              onChange={(e) => {
                                const newChaps = [...importedChapters];
                                newChaps[index].title = e.target.value;
                                setImportedChapters(newChaps);
                              }}
                              className="font-bold text-sm text-slate-800 dark:text-white border-b border-transparent hover:border-slate-300 focus:border-emerald-700 focus:outline-hidden py-0.5 px-1 bg-transparent w-full"
                            />
                          </div>
                          
                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 w-full max-w-2xl text-xs">
                            <div className="flex items-center gap-1">
                              <span className="text-slate-500 shrink-0">Przedmiot:</span>
                              <input
                                type="text"
                                value={itm.subject || ''}
                                onChange={(e) => {
                                  const newChaps = [...importedChapters];
                                  newChaps[index].subject = e.target.value;
                                  setImportedChapters(newChaps);
                                }}
                                className="font-semibold text-slate-700 dark:text-slate-350 border-b border-transparent focus:border-emerald-700 focus:outline-hidden py-0.5 px-1 bg-transparent w-full"
                              />
                            </div>

                            <div className="flex items-center gap-1">
                              <span className="text-slate-500 shrink-0">Czas (min):</span>
                              <input
                                type="number"
                                value={itm.estimatedReadTime || 1}
                                onChange={(e) => {
                                  const newChaps = [...importedChapters];
                                  newChaps[index].estimatedReadTime = Number(e.target.value);
                                  setImportedChapters(newChaps);
                                }}
                                className="font-semibold text-slate-700 dark:text-slate-350 border-b border-transparent focus:border-emerald-700 focus:outline-hidden py-0.5 px-1 bg-transparent w-12"
                              />
                            </div>

                            <div className="flex items-center gap-1">
                              <span className="text-slate-500 shrink-0">Poziom:</span>
                              <select
                                value={itm.educationLevel || 'Ogólny'}
                                onChange={(e) => {
                                  const newChaps = [...importedChapters];
                                  newChaps[index].educationLevel = e.target.value;
                                  setImportedChapters(newChaps);
                                }}
                                className="font-semibold text-slate-700 dark:text-slate-350 border-b border-transparent focus:border-emerald-700 focus:outline-hidden py-0.5 px-1 bg-transparent text-xs w-full cursor-pointer"
                              >
                                {EDUCATION_LEVELS.map((level) => (
                                  <option key={level} value={level} className="bg-white dark:bg-slate-900">{level}</option>
                                ))}
                                <option value="Ogólny" className="bg-white dark:bg-slate-900">Ogólny</option>
                              </select>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 shrink-0">
                          <button
                            id={`trash-imported-${index}`}
                            onClick={() => setImportedChapters(importedChapters.filter((_, idx) => idx !== index))}
                            className="p-2 text-slate-400 hover:text-red-500 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-all cursor-pointer"
                            title="Usuń"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>

                          <button
                            id={`save-imported-${index}`}
                            onClick={() => handleSaveImportedChapter(index)}
                            className="px-3.5 py-2 bg-emerald-100 dark:bg-emerald-950/30 text-emerald-800 dark:text-emerald-400 font-bold text-xs rounded-xl flex items-center gap-1 hover:bg-emerald-200/50 cursor-pointer"
                          >
                            <Check className="w-3.5 h-3.5" />
                            <span>Zatwierdź rozdział</span>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

        </div>
      </motion.div>

      {/* Selective Import Backup Modal */}
      {pendingImportBackup && (
        <div className="fixed inset-0 bg-stone-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-in fade-in duration-200">
          <div className="bg-white dark:bg-slate-900 rounded-2xl w-full max-w-3xl max-h-[85vh] flex flex-col shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden">
            {/* Modal Header */}
            <div className="p-5 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 flex items-center justify-between">
              <div>
                <h3 className="text-lg font-extrabold text-slate-800 dark:text-white flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                  <span>Wybór rozdziałów z kopii zapasowej JSON</span>
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Znaleziono {pendingImportBackup.length} rozdziałów w pliku. Wybierz, które chcesz przywrócić.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setPendingImportBackup(null)}
                className="p-1.5 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-500 transition-colors cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Mode & Filters Toolbar */}
            <div className="p-4 bg-slate-100/70 dark:bg-slate-800/30 border-b border-slate-200 dark:border-slate-800 space-y-3">
              {/* Mode selector & quick select */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <span className="text-xs font-bold text-slate-700 dark:text-slate-300">Tryb:</span>
                  <label className="flex items-center gap-1.5 text-xs text-slate-700 dark:text-slate-300 cursor-pointer">
                    <input
                      type="radio"
                      name="importMergeMode"
                      value="merge"
                      checked={importMergeMode === 'merge'}
                      onChange={() => setImportMergeMode('merge')}
                      className="text-emerald-600 focus:ring-emerald-500"
                    />
                    <span className="font-semibold">Scal z obecnymi ({allChapters.length})</span>
                  </label>
                  <label className="flex items-center gap-1.5 text-xs text-slate-700 dark:text-slate-300 cursor-pointer">
                    <input
                      type="radio"
                      name="importMergeMode"
                      value="replace"
                      checked={importMergeMode === 'replace'}
                      onChange={() => setImportMergeMode('replace')}
                      className="text-emerald-600 focus:ring-emerald-500"
                    />
                    <span className="font-semibold text-rose-600 dark:text-rose-400">Zastąp całą bazę</span>
                  </label>
                </div>

                <div className="flex items-center gap-1.5 text-xs">
                  <button
                    type="button"
                    onClick={handleSelectAllImport}
                    className="px-2.5 py-1 bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 rounded-lg text-slate-800 dark:text-slate-200 font-semibold transition-colors cursor-pointer"
                  >
                    Zaznacz wszystkie
                  </button>
                  <button
                    type="button"
                    onClick={handleSelectOnlyNewImport}
                    className="px-2.5 py-1 bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-200 rounded-lg font-semibold transition-colors cursor-pointer"
                  >
                    Tylko nowe
                  </button>
                  <button
                    type="button"
                    onClick={handleDeselectAllImport}
                    className="px-2.5 py-1 bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 rounded-lg text-slate-800 dark:text-slate-200 font-semibold transition-colors cursor-pointer"
                  >
                    Odznacz
                  </button>
                </div>
              </div>

              {/* Search and Subject filter */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <input
                  type="text"
                  placeholder="Szukaj po tytule lub dziale..."
                  value={importSearch}
                  onChange={(e) => setImportSearch(e.target.value)}
                  className="px-3 py-1.5 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                />
                <select
                  value={importSubjectFilter}
                  onChange={(e) => setImportSubjectFilter(e.target.value)}
                  className="px-3 py-1.5 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                >
                  <option value="Wszystkie">Wszystkie przedmioty w pliku</option>
                  {Array.from(new Set(pendingImportBackup.map((c) => c.subject).filter(Boolean))).map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Chapters list with checkboxes */}
            <div className="p-4 overflow-y-auto flex-1 space-y-2 max-h-[45vh]">
              {(() => {
                const filtered = pendingImportBackup.filter((ch) => {
                  const matchesSearch = !importSearch || ch.title.toLowerCase().includes(importSearch.toLowerCase()) || (ch.chapterGroup && ch.chapterGroup.toLowerCase().includes(importSearch.toLowerCase()));
                  const matchesSubject = importSubjectFilter === 'Wszystkie' || ch.subject === importSubjectFilter;
                  return matchesSearch && matchesSubject;
                });

                if (filtered.length === 0) {
                  return (
                    <div className="text-center py-8 text-xs text-slate-400 italic">
                      Brak rozdziałów spełniających kryteria wyszukiwania.
                    </div>
                  );
                }

                const existingIds = new Set(allChapters.map((c) => c.id));

                return filtered.map((ch) => {
                  const isChecked = selectedImportIds.has(ch.id);
                  const existsLocally = existingIds.has(ch.id);

                  return (
                    <label
                      key={ch.id}
                      className={`flex items-start gap-3 p-3 rounded-xl border transition-all cursor-pointer ${
                        isChecked
                          ? 'bg-emerald-50/70 dark:bg-emerald-950/30 border-emerald-300 dark:border-emerald-800/80'
                          : 'bg-white dark:bg-slate-900/60 border-slate-200 dark:border-slate-800 opacity-70 hover:opacity-100'
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => {
                          const next = new Set(selectedImportIds);
                          if (isChecked) {
                            next.delete(ch.id);
                          } else {
                            next.add(ch.id);
                          }
                          setSelectedImportIds(next);
                        }}
                        className="mt-1 rounded text-emerald-600 focus:ring-emerald-500"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2">
                          <span className="font-bold text-xs text-slate-800 dark:text-slate-100 truncate">
                            {ch.title}
                          </span>
                          <div className="flex items-center gap-1.5 shrink-0">
                            {existsLocally ? (
                              <span className="text-[9.5px] px-2 py-0.5 rounded-md bg-amber-100 text-amber-800 dark:bg-amber-950/80 dark:text-amber-300 font-semibold">
                                W bazie
                              </span>
                            ) : (
                              <span className="text-[9.5px] px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800 dark:bg-emerald-950/80 dark:text-emerald-300 font-semibold">
                                Nowa
                              </span>
                            )}
                          </div>
                        </div>
                        <div className="flex flex-wrap items-center gap-2 mt-1 text-[10px] text-slate-500 dark:text-slate-400">
                          <span className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 font-medium">
                            {ch.subject || 'Inny'}
                          </span>
                          {ch.chapterGroup && (
                            <span className="truncate max-w-[200px]">Dział: {ch.chapterGroup}</span>
                          )}
                          <span>⏱ {ch.estimatedReadTime || 5} min</span>
                          <span>❓ Quiz: {ch.quizzes?.length || 0} pytań</span>
                        </div>
                      </div>
                    </label>
                  );
                });
              })()}
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 flex items-center justify-between">
              <div className="text-xs text-slate-600 dark:text-slate-300 font-semibold">
                Zaznaczono: <span className="text-emerald-600 dark:text-emerald-400 font-mono font-bold">{selectedImportIds.size}</span> z {pendingImportBackup.length}
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setPendingImportBackup(null)}
                  className="px-4 py-2 bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 text-slate-800 dark:text-slate-200 text-xs font-semibold rounded-xl transition-colors cursor-pointer"
                >
                  Anuluj
                </button>
                <button
                  type="button"
                  onClick={handleConfirmSelectiveImport}
                  disabled={selectedImportIds.size === 0}
                  className="px-5 py-2 bg-emerald-700 hover:bg-emerald-800 disabled:opacity-50 text-white text-xs font-bold rounded-xl shadow-xs transition-all cursor-pointer flex items-center gap-1.5"
                >
                  <Check className="w-4 h-4" />
                  <span>Zaimportuj wybrane ({selectedImportIds.size})</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
}
