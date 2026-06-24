import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Chapter, QuizQuestion, EDUCATION_LEVELS, SCHOOL_TYPES, GRADES } from '../types';
import { Upload, Plus, Trash2, BookOpen, Save, FileText, Sparkles, AlertCircle, HelpCircle, Eye, Edit3, Check } from 'lucide-react';

interface ChapterManagerProps {
  onAddChapter: (chapter: Chapter) => void;
  onImportAll: (chapters: Chapter[]) => void;
  allChapters: Chapter[];
  onClose: () => void;
  showToast?: (message: string, type?: 'success' | 'error' | 'info') => void;
  showConfirm?: (message: string, onConfirm: () => void, title?: string) => void;
}

export default function ChapterManager({ onAddChapter, onImportAll, allChapters, onClose, showToast, showConfirm }: ChapterManagerProps) {
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
  const [title, setTitle] = useState(''); // Temat lekcji (np. "Bóg stwarza świat z miłości")
  const [subject, setSubject] = useState(''); // Przedmiot (np. "Religia")
  const [content, setContent] = useState('');
  const [readTime, setReadTime] = useState(5);
  const [quizzes, setQuizzes] = useState<QuizQuestion[]>([]);
  
  // Advanced Education States
  const [schoolType, setSchoolType] = useState('Szkoła Podstawowa');
  const [customSchoolType, setCustomSchoolType] = useState('');
  const [grade, setGrade] = useState('Klasa 1');
  const [customGrade, setCustomGrade] = useState('');
  const [chapterGroup, setChapterGroup] = useState(''); // Rozdział / Dział nadrzędny (np. "Stworzenie świata")
  
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
      id: 'custom-' + Math.random().toString(36).substr(2, 9),
      title: title.trim(),
      subject: subject.trim() || 'Ogólne',
      schoolType: finalSchoolType,
      grade: finalGrade,
      chapterGroup: finalChapterGroup,
      educationLevel: `${finalSchoolType} (${finalGrade})`,
      content: content.trim(),
      estimatedReadTime: readTime || 3,
      quizzes: quizzes.length > 0 ? quizzes : undefined,
      createdAt: Date.now()
    };

    onAddChapter(finalChapter);
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
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(allChapters, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `multibook-export-${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const handleImportBookJSON = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const fileReader = new FileReader();
      fileReader.onload = (event) => {
        try {
          const parsed = JSON.parse(event.target?.result as string);
          if (Array.isArray(parsed) && parsed.every((itm) => itm.title && itm.content)) {
            onImportAll(parsed);
            notify(`Pomyślnie zaimportowano multibook z ${parsed.length} rozdziałami!`, 'success');
            onClose();
          } else {
            notify('Niepoprawny format pliku JSON. Plik musi zawierać tablicę rozdziałów.', 'error');
          }
        } catch (err) {
          notify('Błąd odczytu pliku JSON.', 'error');
        }
      };
      fileReader.readAsText(e.target.files[0]);
    }
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
              <Plus className="w-5 h-5 text-emerald-700" />
              <span>Centrum Twórcy i Zarządzania Książką</span>
            </h2>
            <p className="text-xs text-[#5A5450] dark:text-slate-400 mt-1">
              Rozwiń swój multibook dodając nowe lekcje, sprawdziany lub importując pliki w formacie Markdown (.md).
            </p>
          </div>
          <button
            id="close-manager-btn"
            onClick={onClose}
            className="p-1 px-3 text-sm font-semibold rounded-lg text-[#5A5450] hover:bg-stone-200/50 dark:text-slate-300 dark:hover:bg-slate-800 cursor-pointer transition-colors"
          >
            Zamknij
          </button>
        </div>

        {/* Tabs */}
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
                  <span>Zapisz i wyświetl lekcję</span>
                </button>
              </div>
            </div>
          )}

          {/* TAB 2: IMPORT DIGITAL BOOK OR MD FILES */}
          {activeTab === 'import_files' && (
            <div className="space-y-6 animate-in fade-in duration-200">
              
              {/* Export / Import Section for JSON Backup */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-[#EDEAE2]/50 dark:bg-slate-800/40 p-5 rounded-2xl border border-[#EDEAE2] dark:border-slate-800 flex flex-col justify-between">
                  <div>
                    <h3 className="font-serif font-bold text-emerald-900 dark:text-white text-sm flex items-center gap-1.5">
                      <BookOpen className="w-4.5 h-4.5 text-emerald-750" />
                      <span>Eksportuj Twój Multibook</span>
                    </h3>
                    <p className="text-xs text-[#5A5450] dark:text-slate-350 mt-1.5 leading-relaxed">
                      Chcesz przenieść wszystkie przygotowane lekcje dla uczniów na komputer szkolny lub drugie urządzenie? Możesz pobrać kompletną bazę danych jako jeden plik JSON.
                    </p>
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
                      <span>Importuj Kompletną Książkę</span>
                    </h3>
                    <p className="text-xs text-slate-600 dark:text-slate-350 mt-1.5 leading-relaxed">
                      Wczytaj wcześniej zapisany plik .json, aby błyskawicznie przywrócić wszystkie działy podręcznika, quizzes oraz ich zaangażowanie. Twoja baza ulegnie zastąpieniu.
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
    </motion.div>
  );
}
