'use client';

import { Search, BookOpen, FileText, Video, ExternalLink, Bookmark, Filter, X, Check, Plus, Trash2 } from 'lucide-react';
import { useState } from 'react';

export default function KnowledgeModule() {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  // Modal State for New Material/Video Registration
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  // Form State
  const [formData, setFormData] = useState({
    title: '',
    type: 'book', // 'book' | 'paper' | 'youtube'
    category: '독서모임 요약',
    desc: '',
    tags: '',
    link: '',
  });

  // Knowledge Items State
  const [knowledgeItems, setKnowledgeItems] = useState([
    {
      id: '1',
      title: '클린 (Clean) - 몸 안의 독소를 제거하는 생명 혁명',
      type: 'book',
      category: '독서모임 요약',
      desc: '알레한드로 융거 박사의 해독 및 면역 복원 지침서. 장내 유익균과 간 디톡스의 중요성 다룸.',
      tags: ['해독', '디톡스', '장건강', '간해독'],
      link: '#',
    },
    {
      id: '2',
      title: '글리코영양소(Glyconutrients)와 세포 면역 신호 전달 논문 요약',
      type: 'paper',
      category: '건강 논문',
      desc: '하퍼의 생화학(Harper’s Biochemistry)에 등재된 8가지 다당류(글리칸)가 면역 세포에 미치는 임상 연구.',
      tags: ['글리코영양소', '앰브로토스', '세포면역', '논문'],
      link: '#',
    },
    {
      id: '3',
      title: '유튜브: 현대인 90%가 모르는 만성 피로와 간 해독의 비밀',
      type: 'youtube',
      category: '유튜브 강의',
      desc: '메나테크 트루퓨어 제품과 연계된 간 기능 회복 세미나 영상 (15분 요약)',
      tags: ['간해독', '트루퓨어', '유튜브', '피로회복'],
      link: 'https://youtube.com',
    },
    {
      id: '4',
      title: '당뇨 및 대사증후군 극복을 위한 영양 치료 가이드',
      type: 'paper',
      category: '건강 논문',
      desc: '혈당 조절과 글리코영양소 병행 섭취 시 췌장 세포 기능 변화 임상 수치 분석.',
      tags: ['당뇨', '혈당', '메나테크', '대사증후군'],
      link: '#',
    },
  ]);

  // Handle Form Submit
  const handleAddMaterial = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim()) return;

    let categoryName = '독서모임 요약';
    if (formData.type === 'paper') categoryName = '건강 논문';
    if (formData.type === 'youtube') categoryName = '유튜브 강의';

    const parsedTags = formData.tags
      ? formData.tags.split(',').map((t) => t.trim().replace('#', ''))
      : ['건강', '메나테크'];

    const newItem = {
      id: String(Date.now()),
      title: formData.title,
      type: formData.type,
      category: categoryName,
      desc: formData.desc || '등록된 설명이 없습니다.',
      tags: parsedTags,
      link: formData.link || '#',
    };

    setKnowledgeItems((prev) => [newItem, ...prev]);
    setIsModalOpen(false);
    setFormData({
      title: '',
      type: 'book',
      category: '독서모임 요약',
      desc: '',
      tags: '',
      link: '',
    });
  };

  // Delete Knowledge Item
  const handleDeleteItem = (id: string) => {
    if (confirm('이 지식 자료를 목록에서 삭제하시겠습니까?')) {
      setKnowledgeItems((prev) => prev.filter((item) => item.id !== id));
    }
  };

  // Filter items
  const filteredItems = knowledgeItems.filter((item) => {
    const matchesSearch =
      item.title.includes(searchTerm) ||
      item.desc.includes(searchTerm) ||
      item.tags.some((t) => t.includes(searchTerm));

    if (selectedCategory === 'all') return matchesSearch;
    if (selectedCategory === 'book') return matchesSearch && item.type === 'book';
    if (selectedCategory === 'paper') return matchesSearch && item.type === 'paper';
    if (selectedCategory === 'youtube') return matchesSearch && item.type === 'youtube';
    return matchesSearch;
  });

  return (
    <div className="flex-1 flex flex-col h-full bg-gray-50 overflow-y-auto p-8 relative">
      {/* Header */}
      <div className="mb-8 flex justify-between items-start">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">지식 관리 창고 (Knowledge Base)</h2>
          <p className="text-sm text-gray-500 mt-1">
            독서 모임 자료, 건강 논문, 요약본, 유튜브 강의 자료를 한곳에 모으고 관리합니다.
          </p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 bg-sky-500 hover:bg-sky-600 text-white font-semibold px-4 py-2.5 rounded-xl shadow-xs text-sm transition-colors cursor-pointer"
        >
          <BookOpen size={18} />
          새 자료/영상 등록
        </button>
      </div>

      {/* Unified Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-2xs mb-6 space-y-4">
        <div className="relative">
          <Search className="absolute left-4 top-3.5 text-sky-500" size={20} />
          <input
            type="text"
            placeholder="구글 검색처럼 키워드를 입력하세요 (예: 간해독, 당뇨, 글리코영양소, 클린)..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-sky-500 transition-colors font-medium text-gray-800"
          />
        </div>

        {/* Filter Badges */}
        <div className="flex items-center gap-2 pt-1 border-t border-gray-100">
          <Filter size={14} className="text-gray-400" />
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-3 py-1 text-xs font-semibold rounded-full border transition-all cursor-pointer ${
              selectedCategory === 'all'
                ? 'bg-sky-500 text-white border-sky-500'
                : 'bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100'
            }`}
          >
            전체 자료 ({knowledgeItems.length})
          </button>
          <button
            onClick={() => setSelectedCategory('book')}
            className={`px-3 py-1 text-xs font-semibold rounded-full border transition-all cursor-pointer ${
              selectedCategory === 'book'
                ? 'bg-sky-500 text-white border-sky-500'
                : 'bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100'
            }`}
          >
            📚 독서 모임 요약
          </button>
          <button
            onClick={() => setSelectedCategory('paper')}
            className={`px-3 py-1 text-xs font-semibold rounded-full border transition-all cursor-pointer ${
              selectedCategory === 'paper'
                ? 'bg-sky-500 text-white border-sky-500'
                : 'bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100'
            }`}
          >
            📄 건강 논문/PDF
          </button>
          <button
            onClick={() => setSelectedCategory('youtube')}
            className={`px-3 py-1 text-xs font-semibold rounded-full border transition-all cursor-pointer ${
              selectedCategory === 'youtube'
                ? 'bg-sky-500 text-white border-sky-500'
                : 'bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100'
            }`}
          >
            ▶️ 유튜브 영상
          </button>
        </div>
      </div>

      {/* Knowledge Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredItems.map((item) => (
          <div
            key={item.id}
            className="bg-white rounded-2xl p-6 border border-gray-200 shadow-2xs hover:shadow-md transition-all flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="flex items-center gap-1.5 px-3 py-1 bg-sky-50 text-sky-600 font-bold text-xs rounded-full border border-sky-100">
                  {item.type === 'book' && <BookOpen size={14} />}
                  {item.type === 'paper' && <FileText size={14} />}
                  {item.type === 'youtube' && <Video size={14} className="text-red-500" />}
                  {item.category}
                </span>
                <button
                  onClick={() => handleDeleteItem(item.id)}
                  className="p-1 text-gray-300 hover:text-red-500 transition-colors cursor-pointer"
                  title="자료 삭제"
                >
                  <Trash2 size={16} />
                </button>
              </div>

              <h3 className="text-base font-bold text-gray-900 leading-snug mb-2 hover:text-sky-600 cursor-pointer">
                {item.title}
              </h3>
              <p className="text-xs text-gray-600 leading-relaxed mb-4">{item.desc}</p>

              {/* Tags */}
              <div className="flex flex-wrap gap-1.5 mb-4">
                {item.tags.map((t, idx) => (
                  <span key={idx} className="text-[11px] text-gray-500 bg-gray-100 px-2 py-0.5 rounded-md font-medium">
                    #{t}
                  </span>
                ))}
              </div>
            </div>

            <div className="pt-4 border-t border-gray-100 flex items-center justify-between text-xs">
              <span className="text-gray-400 font-medium">등록 완료</span>
              <a
                href={item.link}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1 text-sky-600 hover:text-sky-700 font-bold"
              >
                자료 보기 <ExternalLink size={14} />
              </a>
            </div>
          </div>
        ))}
      </div>

      {/* Registration Modal Popup */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl border border-gray-100 animate-in fade-in zoom-in duration-200">
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center gap-2">
                <Plus className="text-sky-500" size={20} />
                <h3 className="text-lg font-bold text-gray-900">새 자료 / 유튜브 영상 등록</h3>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-100 cursor-pointer"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleAddMaterial} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">자료 유형 분류</label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                  className="w-full p-2.5 border border-gray-200 rounded-xl text-sm bg-white"
                >
                  <option value="book">📚 독서 모임 요약본</option>
                  <option value="paper">📄 건강 논문 및 연구 PDF</option>
                  <option value="youtube">▶️ 유튜브 강의 영상 링크</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">자료 / 영상 제목 *</label>
                <input
                  type="text"
                  required
                  placeholder="예: 클린 - 장 디톡스 핵심 요약"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full p-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-sky-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">상세 설명</label>
                <textarea
                  rows={3}
                  placeholder="자료의 핵심 내용을 입력하세요..."
                  value={formData.desc}
                  onChange={(e) => setFormData({ ...formData, desc: e.target.value })}
                  className="w-full p-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-sky-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">태그 (쉼표로 구분)</label>
                <input
                  type="text"
                  placeholder="디톡스, 메나테크, 장건강"
                  value={formData.tags}
                  onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                  className="w-full p-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-sky-500"
                />
              </div>

              <div className="pt-4 flex gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 py-3 border border-gray-200 text-gray-600 font-semibold rounded-xl text-xs hover:bg-gray-50 cursor-pointer"
                >
                  취소
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 bg-sky-500 hover:bg-sky-600 text-white font-semibold rounded-xl text-xs flex items-center justify-center gap-2 shadow-xs cursor-pointer"
                >
                  <Check size={16} />
                  자료 저장하기
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
