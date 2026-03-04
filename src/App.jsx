import React, { useState, useMemo } from 'react';
import { Plus, Trash2, Edit2, Save, X, ChevronDown, BarChart3, Search, Grid3X3, List, Star, TrendingUp, Award, Zap, PieChart, CheckCircle2, Clock, BookOpen, Target, Calendar, AlertCircle } from 'lucide-react';

const CultureSkillsMapper = () => {
  const [behaviors, setBehaviors] = useState([
    {
      id: 1,
      name: '투명한 의사소통',
      description: '조직 내 정보를 명확하고 개방적으로 공유',
      skills: ['활경청', '명확한 표현', '피드백 수용'],
      rating: 3,
      evaluationDate: '2024-03-01',
      targetRating: 5,
      targetDate: '2024-06-30'
    },
    {
      id: 2,
      name: '협력과 팀워크',
      description: '팀 목표 달성을 위한 적극적 협업',
      skills: ['협상 능력', '공감 능력', '갈등 해결'],
      rating: 4,
      evaluationDate: '2024-03-01',
      targetRating: 5,
      targetDate: '2024-05-31'
    },
    {
      id: 3,
      name: '지속적 학습',
      description: '변화하는 환경에 적응하고 성장하는 태도',
      skills: ['자기개발', '새로운 기술 습득', '메타인지'],
      rating: 2,
      evaluationDate: '2024-03-01',
      targetRating: 4,
      targetDate: '2024-09-30'
    },
    {
      id: 4,
      name: '주도적 문제해결',
      description: '문제를 능동적으로 발견하고 해결',
      skills: ['분석력', '의사결정', '창의적 사고'],
      rating: 3,
      evaluationDate: '2024-03-01',
      targetRating: 4,
      targetDate: '2024-08-31'
    },
    {
      id: 5,
      name: '리더십과 영감',
      description: '팀원들에게 영감을 주고 방향을 제시',
      skills: ['비전 제시', '의사결정', '공감 능력'],
      rating: 4,
      evaluationDate: '2024-03-01',
      targetRating: 5,
      targetDate: '2024-07-31'
    }
  ]);

  const [trainings, setTrainings] = useState([
    { id: 1, skillId: 1, name: '경청 스킬 워크숍', type: 'workshop', startDate: '2024-03-15', endDate: '2024-03-22', status: 'completed', progress: 100 },
    { id: 2, skillId: 1, name: '효과적 커뮤니케이션', type: 'course', startDate: '2024-04-01', endDate: '2024-04-30', status: 'ongoing', progress: 60 },
    { id: 3, skillId: 2, name: '팀 협업 강화 프로그램', type: 'program', startDate: '2024-03-20', endDate: '2024-05-20', status: 'ongoing', progress: 40 },
    { id: 4, skillId: 3, name: '자기개발 코칭', type: 'coaching', startDate: '2024-04-10', endDate: '2024-08-10', status: 'upcoming', progress: 0 },
    { id: 5, skillId: 4, name: '문제해결 마스터클래스', type: 'workshop', startDate: '2024-05-01', endDate: '2024-05-15', status: 'upcoming', progress: 0 }
  ]);

  const [viewMode, setViewMode] = useState('list');
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedId, setExpandedId] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [editValues, setEditValues] = useState({});
  const [showAddForm, setShowAddForm] = useState(false);
  const [newBehavior, setNewBehavior] = useState({ name: '', description: '', skills: '' });
  const [filterSkill, setFilterSkill] = useState('');
  const [ratingFilter, setRatingFilter] = useState('all');
  const [activeTab, setActiveTab] = useState('overview');
  const [editingTraining, setEditingTraining] = useState(null);
  const [showTrainingForm, setShowTrainingForm] = useState(false);
  const [newTraining, setNewTraining] = useState({ skillId: '', name: '', type: 'course', startDate: '', endDate: '', status: 'upcoming', progress: 0 });

  // 모든 스킬 수집
  const allSkills = [...new Set(behaviors.flatMap(b => b.skills))].sort();
  
  // 스킬별 행동 그룹핑
  const skillBehaviorMap = {};
  allSkills.forEach(skill => {
    skillBehaviorMap[skill] = behaviors.filter(b => b.skills.includes(skill));
  });

  // 스킬 중요도 계산
  const skillImportance = useMemo(() => {
    const importance = {};
    allSkills.forEach(skill => {
      const relatedBehaviors = skillBehaviorMap[skill];
      const avgRating = relatedBehaviors.length > 0
        ? relatedBehaviors.reduce((sum, b) => sum + b.rating, 0) / relatedBehaviors.length
        : 0;
      importance[skill] = {
        count: relatedBehaviors.length,
        avgRating: parseFloat(avgRating.toFixed(1)),
        importance: (relatedBehaviors.length * (avgRating / 5)),
      };
    });
    return importance;
  }, [behaviors, allSkills, skillBehaviorMap]);

  // 중요도 순정렬
  const sortedSkillsByImportance = useMemo(() => {
    return [...allSkills].sort((a, b) => 
      skillImportance[b].importance - skillImportance[a].importance
    );
  }, [allSkills, skillImportance]);

  // 검색 및 필터링 로직
  const filteredBehaviors = useMemo(() => {
    let result = behaviors;

    if (filterSkill) {
      result = result.filter(b => b.skills.includes(filterSkill));
    }

    if (ratingFilter !== 'all') {
      const minRating = parseInt(ratingFilter);
      result = result.filter(b => b.rating >= minRating);
    }

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter(b => 
        b.name.toLowerCase().includes(query) ||
        b.description.toLowerCase().includes(query) ||
        b.skills.some(skill => skill.toLowerCase().includes(query))
      );
    }

    return result;
  }, [behaviors, filterSkill, searchQuery, ratingFilter]);

  // 평가 통계
  const ratingStats = useMemo(() => {
    const stats = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    behaviors.forEach(b => {
      stats[b.rating]++;
    });
    const avgRating = behaviors.length > 0 ? (behaviors.reduce((sum, b) => sum + b.rating, 0) / behaviors.length).toFixed(1) : 0;
    return { ...stats, avgRating };
  }, [behaviors]);

  // 진척도 계산
  const progressStats = useMemo(() => {
    const total = behaviors.length;
    const completed = behaviors.filter(b => b.rating >= b.targetRating).length;
    const avgProgress = behaviors.length > 0 
      ? (behaviors.reduce((sum, b) => Math.min(b.rating / b.targetRating, 1), 0) / total * 100).toFixed(0)
      : 0;
    
    return {
      total,
      completed,
      percentage: total > 0 ? ((completed / total) * 100).toFixed(0) : 0,
      avgProgress
    };
  }, [behaviors]);

  // 교육 통계
  const trainingStats = useMemo(() => {
    const stats = {
      total: trainings.length,
      completed: trainings.filter(t => t.status === 'completed').length,
      ongoing: trainings.filter(t => t.status === 'ongoing').length,
      upcoming: trainings.filter(t => t.status === 'upcoming').length,
      avgProgress: trainings.length > 0 ? (trainings.reduce((sum, t) => sum + t.progress, 0) / trainings.length).toFixed(0) : 0
    };
    return stats;
  }, [trainings]);

  const handleEdit = (behavior) => {
    setEditingId(behavior.id);
    setEditValues({
      ...behavior,
      skills: behavior.skills.join(', ')
    });
  };

  const handleSave = () => {
    setBehaviors(behaviors.map(b => 
      b.id === editingId 
        ? {
            ...b,
            ...editValues,
            skills: editValues.skills.split(',').map(s => s.trim()).filter(s => s)
          }
        : b
    ));
    setEditingId(null);
    setEditValues({});
  };

  const handleDelete = (id) => {
    setBehaviors(behaviors.filter(b => b.id !== id));
    if (expandedId === id) setExpandedId(null);
  };

  const handleAddBehavior = () => {
    if (newBehavior.name && newBehavior.description) {
      const skills = newBehavior.skills.split(',').map(s => s.trim()).filter(s => s);
      setBehaviors([
        ...behaviors,
        {
          id: Math.max(...behaviors.map(b => b.id), 0) + 1,
          name: newBehavior.name,
          description: newBehavior.description,
          skills,
          rating: 3,
          evaluationDate: new Date().toISOString().split('T')[0],
          targetRating: 5,
          targetDate: new Date(Date.now() + 180 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
        }
      ]);
      setNewBehavior({ name: '', description: '', skills: '' });
      setShowAddForm(false);
    }
  };

  const handleRatingChange = (id, newRating) => {
    setBehaviors(behaviors.map(b =>
      b.id === id
        ? { ...b, rating: newRating, evaluationDate: new Date().toISOString().split('T')[0] }
        : b
    ));
  };

  const handleAddTraining = () => {
    if (newTraining.skillId && newTraining.name && newTraining.startDate) {
      setTrainings([
        ...trainings,
        {
          id: Math.max(...trainings.map(t => t.id), 0) + 1,
          skillId: parseInt(newTraining.skillId),
          name: newTraining.name,
          type: newTraining.type,
          startDate: newTraining.startDate,
          endDate: newTraining.endDate || newTraining.startDate,
          status: newTraining.status,
          progress: newTraining.progress
        }
      ]);
      setNewTraining({ skillId: '', name: '', type: 'course', startDate: '', endDate: '', status: 'upcoming', progress: 0 });
      setShowTrainingForm(false);
    }
  };

  const handleUpdateTraining = (id, updates) => {
    setTrainings(trainings.map(t => t.id === id ? { ...t, ...updates } : t));
  };

  const handleDeleteTraining = (id) => {
    setTrainings(trainings.filter(t => t.id !== id));
  };

  const toggleExpanded = (id) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const StarRating = ({ rating, onRatingChange, readOnly = false }) => {
    return (
      <div className="flex gap-2">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            onClick={() => !readOnly && onRatingChange(star)}
            className={`transition-all ${
              star <= rating
                ? 'text-yellow-400 drop-shadow-lg'
                : 'text-slate-600'
            } ${!readOnly && 'hover:text-yellow-300 cursor-pointer'}`}
            disabled={readOnly}
          >
            <Star size={24} fill={star <= rating ? 'currentColor' : 'none'} />
          </button>
        ))}
      </div>
    );
  };

  const getRatingColor = (rating) => {
    if (rating >= 4) return 'from-green-500 to-emerald-500';
    if (rating === 3) return 'from-yellow-500 to-amber-500';
    return 'from-orange-500 to-red-500';
  };

  const getRatingLabel = (rating) => {
    const labels = { 1: '미흡', 2: '개선필요', 3: '보통', 4: '우수', 5: '탁월' };
    return labels[rating] || '미평가';
  };

  const getTrainingTypeLabel = (type) => {
    const labels = { course: '온라인', workshop: '워크숍', program: '프로그램', coaching: '코칭' };
    return labels[type] || type;
  };

  const getTrainingTypeColor = (type) => {
    const colors = {
      course: 'from-blue-500 to-cyan-500',
      workshop: 'from-purple-500 to-pink-500',
      program: 'from-green-500 to-emerald-500',
      coaching: 'from-orange-500 to-yellow-500'
    };
    return colors[type] || 'from-slate-500 to-slate-400';
  };

  const getSkillNameById = (skillId) => {
    return allSkills[skillId - 1] || allSkills[0];
  };

  const maxImportance = Math.max(...allSkills.map(skill => skillImportance[skill].importance), 1);

  // 진척도 상세 정보
  const getBehaviorProgress = (behavior) => {
    const current = behavior.rating;
    const target = behavior.targetRating;
    const progress = (current / target) * 100;
    const daysRemaining = Math.ceil((new Date(behavior.targetDate) - new Date()) / (1000 * 60 * 60 * 24));
    return { progress: Math.min(progress, 100), daysRemaining, onTrack: daysRemaining > 0 };
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ko-KR', { year: 'numeric', month: '2-digit', day: '2-digit' });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800">
      {/* 헤더 */}
      <div className="border-b border-slate-700 bg-slate-900/50 backdrop-blur-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 mb-2">
            조직문화 행동-스킬셋 평가 및 개발
          </h1>
          <p className="text-slate-400 text-lg">조직 행동의 정착 수준을 평가하고 개발 로드맵을 관리합니다</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* 메인 통계 대시보드 */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-gradient-to-br from-cyan-900/30 to-cyan-800/10 border border-cyan-700/30 rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-cyan-300/70 text-sm font-medium">평균 정착도</p>
                <p className="text-4xl font-bold text-cyan-300 mt-2">{ratingStats.avgRating}/5</p>
              </div>
              <TrendingUp className="text-cyan-400/30" size={40} />
            </div>
          </div>

          <div className="bg-gradient-to-br from-green-900/30 to-green-800/10 border border-green-700/30 rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-green-300/70 text-sm font-medium">목표 달성</p>
                <p className="text-4xl font-bold text-green-300 mt-2">{progressStats.completed}/{progressStats.total}</p>
              </div>
              <Target className="text-green-400/30" size={40} />
            </div>
            <div className="w-full bg-slate-700 rounded-full h-2">
              <div className="h-full bg-green-500 rounded-full" style={{width: `${progressStats.percentage}%`}}></div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-purple-900/30 to-purple-800/10 border border-purple-700/30 rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-purple-300/70 text-sm font-medium">진행 중인 교육</p>
                <p className="text-4xl font-bold text-purple-300 mt-2">{trainingStats.ongoing}</p>
              </div>
              <BookOpen className="text-purple-400/30" size={40} />
            </div>
          </div>

          <div className="bg-gradient-to-br from-orange-900/30 to-orange-800/10 border border-orange-700/30 rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-orange-300/70 text-sm font-medium">완료된 교육</p>
                <p className="text-4xl font-bold text-orange-300 mt-2">{trainingStats.completed}</p>
              </div>
              <CheckCircle2 className="text-orange-400/30" size={40} />
            </div>
          </div>
        </div>

        {/* 탭 네비게이션 */}
        <div className="flex gap-2 mb-8 border-b border-slate-700 overflow-x-auto">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-6 py-3 font-semibold border-b-2 transition-all whitespace-nowrap ${
              activeTab === 'overview'
                ? 'border-cyan-500 text-cyan-400'
                : 'border-transparent text-slate-400 hover:text-slate-300'
            }`}
          >
            📊 개요
          </button>
          <button
            onClick={() => setActiveTab('progress')}
            className={`px-6 py-3 font-semibold border-b-2 transition-all whitespace-nowrap ${
              activeTab === 'progress'
                ? 'border-cyan-500 text-cyan-400'
                : 'border-transparent text-slate-400 hover:text-slate-300'
            }`}
          >
            📈 진척도
          </button>
          <button
            onClick={() => setActiveTab('training')}
            className={`px-6 py-3 font-semibold border-b-2 transition-all whitespace-nowrap ${
              activeTab === 'training'
                ? 'border-cyan-500 text-cyan-400'
                : 'border-transparent text-slate-400 hover:text-slate-300'
            }`}
          >
            🎓 교육로드맵
          </button>
          <button
            onClick={() => setActiveTab('skills')}
            className={`px-6 py-3 font-semibold border-b-2 transition-all whitespace-nowrap ${
              activeTab === 'skills'
                ? 'border-cyan-500 text-cyan-400'
                : 'border-transparent text-slate-400 hover:text-slate-300'
            }`}
          >
            ⚡ 스킬 중요도
          </button>
          <button
            onClick={() => setActiveTab('matrix')}
            className={`px-6 py-3 font-semibold border-b-2 transition-all whitespace-nowrap ${
              activeTab === 'matrix'
                ? 'border-cyan-500 text-cyan-400'
                : 'border-transparent text-slate-400 hover:text-slate-300'
            }`}
          >
            📋 관리
          </button>
        </div>

        {/* 개요 탭 */}
        {activeTab === 'overview' && (
          <>
            {/* 평가 분포 */}
            <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-6 mb-8">
              <h3 className="text-lg font-bold text-slate-100 mb-4">평가 분포</h3>
              <div className="grid grid-cols-5 gap-4">
                {[5, 4, 3, 2, 1].map((rating) => {
                  const count = ratingStats[rating];
                  const percentage = behaviors.length > 0 ? (count / behaviors.length) * 100 : 0;
                  return (
                    <div key={rating} className="text-center">
                      <div className="text-sm font-bold text-slate-300 mb-2">{getRatingLabel(rating)}</div>
                      <div className="bg-slate-700 rounded-lg h-24 flex items-end justify-center overflow-hidden mb-2">
                        <div
                          className={`w-full bg-gradient-to-t ${getRatingColor(rating)} transition-all duration-300`}
                          style={{height: `${percentage === 0 ? 0 : Math.max(percentage, 10)}`}}
                        />
                      </div>
                      <div className="text-sm font-bold text-slate-100">{count}개</div>
                      <div className="text-xs text-slate-400">{percentage.toFixed(0)}%</div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* 스킬 현황 */}
            <div className="bg-gradient-to-br from-slate-800 to-slate-800/50 border border-slate-700 rounded-lg p-8">
              <h2 className="text-2xl font-bold text-purple-300 mb-6 flex items-center gap-3">
                <span className="w-1 h-6 bg-gradient-to-b from-purple-400 to-blue-400 rounded-full"></span>
                스킬 현황 분석
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {allSkills.map(skill => {
                  const count = skillBehaviorMap[skill].length;
                  const percentage = behaviors.length > 0 ? (count / behaviors.length) * 100 : 0;
                  const avgRatingForSkill = skillBehaviorMap[skill].length > 0
                    ? (skillBehaviorMap[skill].reduce((sum, b) => sum + b.rating, 0) / skillBehaviorMap[skill].length).toFixed(1)
                    : 0;
                  return (
                    <div key={skill} className="bg-slate-900/50 border border-slate-700 rounded-lg p-4 hover:border-slate-600 transition-colors">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h3 className="font-semibold text-slate-100">{skill}</h3>
                          <p className="text-xs text-slate-400 mt-1">평균 정착도: <span className="text-cyan-300 font-bold">{avgRatingForSkill}/5</span></p>
                        </div>
                        <span className="text-xs font-bold text-purple-300 bg-purple-500/20 px-2 py-1 rounded">{count}개</span>
                      </div>
                      <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-purple-500 to-pink-500 transition-all duration-300"
                          style={{width: `${percentage}%`}}
                        ></div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </>
        )}

        {/* 진척도 탭 */}
        {activeTab === 'progress' && (
          <div className="space-y-6">
            {/* 전체 진척도 요약 */}
            <div className="bg-gradient-to-br from-slate-800 to-slate-800/50 border border-slate-700 rounded-lg p-8">
              <h2 className="text-2xl font-bold text-cyan-300 mb-6 flex items-center gap-3">
                <TrendingUp size={24} />
                목표 달성 진척도
              </h2>

              <div className="mb-8">
                <div className="flex items-end justify-between mb-3">
                  <h3 className="text-lg font-bold text-slate-100">전체 진행률</h3>
                  <span className="text-3xl font-bold text-cyan-300">{progressStats.avgProgress}%</span>
                </div>
                <div className="w-full bg-slate-700 rounded-full h-6 overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-500 transition-all duration-300"
                    style={{width: `${progressStats.avgProgress}%`}}
                  />
                </div>
                <div className="flex justify-between mt-3 text-sm text-slate-400">
                  <span>목표 달성: {progressStats.completed}개 / 총 {progressStats.total}개</span>
                  <span>{progressStats.percentage}% 완료</span>
                </div>
              </div>

              {/* 개별 행동별 진척도 */}
              <h3 className="text-lg font-bold text-slate-100 mb-4">행동별 진척도</h3>
              <div className="space-y-4">
                {behaviors.map((behavior) => {
                  const prog = getBehaviorProgress(behavior);
                  const isCompleted = behavior.rating >= behavior.targetRating;
                  return (
                    <div key={behavior.id} className="bg-slate-900/50 border border-slate-700 rounded-lg p-4 hover:border-slate-600 transition-colors">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="font-semibold text-slate-100">{behavior.name}</h4>
                            {isCompleted && <CheckCircle2 size={18} className="text-green-400" />}
                          </div>
                          <p className="text-xs text-slate-400">
                            현재 {behavior.rating}점 → 목표 {behavior.targetRating}점 | 기한: {formatDate(behavior.targetDate)}
                          </p>
                        </div>
                        <span className={`text-xs font-bold px-2 py-1 rounded ${
                          prog.onTrack 
                            ? 'bg-green-500/20 text-green-300' 
                            : 'bg-red-500/20 text-red-300'
                        }`}>
                          {prog.daysRemaining > 0 ? `${prog.daysRemaining}일 남음` : '기한 초과'}
                        </span>
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-slate-400">진행률</span>
                          <span className="font-bold text-cyan-300">{prog.progress.toFixed(0)}%</span>
                        </div>
                        <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
                          <div
                            className={`h-full bg-gradient-to-r ${
                              isCompleted ? 'from-green-500 to-emerald-500' : 'from-cyan-500 to-blue-500'
                            } transition-all duration-300`}
                            style={{width: `${prog.progress}%`}}
                          />
                        </div>
                      </div>

                      {/* 필요한 교육 */}
                      <div className="mt-3 pt-3 border-t border-slate-700">
                        <p className="text-xs text-slate-400 mb-2">관련 교육:</p>
                        <div className="flex flex-wrap gap-2">
                          {trainings
                            .filter(t => {
                              const skillName = behavior.skills[0];
                              const skillIdx = allSkills.indexOf(skillName);
                              return t.skillId === skillIdx + 1;
                            })
                            .map(training => (
                              <span
                                key={training.id}
                                className={`text-xs px-2 py-1 rounded-full font-medium bg-gradient-to-r ${getTrainingTypeColor(training.type)} text-white`}
                              >
                                {training.name} ({training.progress}%)
                              </span>
                            ))}
                          {trainings.filter(t => {
                            const skillName = behavior.skills[0];
                            const skillIdx = allSkills.indexOf(skillName);
                            return t.skillId === skillIdx + 1;
                          }).length === 0 && (
                            <span className="text-xs text-slate-500 italic">교육 계획 없음</span>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* 교육로드맵 탭 */}
        {activeTab === 'training' && (
          <div className="space-y-6">
            {/* 교육 통계 */}
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 mb-8">
              <div className="bg-gradient-to-br from-blue-900/30 to-blue-800/10 border border-blue-700/30 rounded-lg p-6">
                <p className="text-blue-300/70 text-sm font-medium mb-2">전체 교육</p>
                <p className="text-3xl font-bold text-blue-300">{trainingStats.total}</p>
              </div>
              <div className="bg-gradient-to-br from-green-900/30 to-green-800/10 border border-green-700/30 rounded-lg p-6">
                <p className="text-green-300/70 text-sm font-medium mb-2">완료</p>
                <p className="text-3xl font-bold text-green-300">{trainingStats.completed}</p>
              </div>
              <div className="bg-gradient-to-br from-yellow-900/30 to-yellow-800/10 border border-yellow-700/30 rounded-lg p-6">
                <p className="text-yellow-300/70 text-sm font-medium mb-2">진행 중</p>
                <p className="text-3xl font-bold text-yellow-300">{trainingStats.ongoing}</p>
              </div>
              <div className="bg-gradient-to-br from-purple-900/30 to-purple-800/10 border border-purple-700/30 rounded-lg p-6">
                <p className="text-purple-300/70 text-sm font-medium mb-2">평균 진행률</p>
                <p className="text-3xl font-bold text-purple-300">{trainingStats.avgProgress}%</p>
              </div>
            </div>

            {/* 교육 추가 버튼 */}
            <button
              onClick={() => setShowTrainingForm(!showTrainingForm)}
              className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-semibold rounded-lg hover:from-cyan-600 hover:to-blue-600 transition-all duration-200 flex items-center gap-2 shadow-lg"
            >
              <Plus size={20} /> 교육 추가
            </button>

            {/* 교육 추가 폼 */}
            {showTrainingForm && (
              <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-6 backdrop-blur-sm">
                <h3 className="text-lg font-bold text-slate-100 mb-4">새로운 교육 프로그램 추가</h3>
                <div className="space-y-4">
                  <select
                    value={newTraining.skillId}
                    onChange={(e) => setNewTraining({...newTraining, skillId: e.target.value})}
                    className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-slate-100 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  >
                    <option value="">스킬 선택</option>
                    {allSkills.map((skill, idx) => (
                      <option key={skill} value={idx + 1}>{skill}</option>
                    ))}
                  </select>

                  <input
                    type="text"
                    placeholder="교육명"
                    value={newTraining.name}
                    onChange={(e) => setNewTraining({...newTraining, name: e.target.value})}
                    className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  />

                  <select
                    value={newTraining.type}
                    onChange={(e) => setNewTraining({...newTraining, type: e.target.value})}
                    className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-slate-100 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  >
                    <option value="course">온라인 코스</option>
                    <option value="workshop">워크숍</option>
                    <option value="program">프로그램</option>
                    <option value="coaching">코칭</option>
                  </select>

                  <div className="grid grid-cols-2 gap-4">
                    <input
                      type="date"
                      value={newTraining.startDate}
                      onChange={(e) => setNewTraining({...newTraining, startDate: e.target.value})}
                      className="px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-slate-100 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                    />
                    <input
                      type="date"
                      value={newTraining.endDate}
                      onChange={(e) => setNewTraining({...newTraining, endDate: e.target.value})}
                      className="px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-slate-100 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                    />
                  </div>

                  <select
                    value={newTraining.status}
                    onChange={(e) => setNewTraining({...newTraining, status: e.target.value})}
                    className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-slate-100 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  >
                    <option value="upcoming">예정</option>
                    <option value="ongoing">진행 중</option>
                    <option value="completed">완료</option>
                  </select>

                  <div>
                    <label className="text-sm text-slate-300 mb-2 block">진행률: {newTraining.progress}%</label>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={newTraining.progress}
                      onChange={(e) => setNewTraining({...newTraining, progress: parseInt(e.target.value)})}
                      className="w-full"
                    />
                  </div>

                  <div className="flex gap-3 justify-end">
                    <button
                      onClick={() => setShowTrainingForm(false)}
                      className="px-4 py-2 bg-slate-700 text-slate-100 rounded-lg hover:bg-slate-600 transition-colors"
                    >
                      취소
                    </button>
                    <button
                      onClick={handleAddTraining}
                      className="px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-lg hover:from-cyan-600 hover:to-blue-600 transition-colors font-semibold"
                    >
                      추가하기
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* 교육 일정 */}
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-slate-100 mb-4">교육 일정</h3>
              {trainings.length === 0 ? (
                <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-8 text-center">
                  <p className="text-slate-400">교육이 등록되지 않았습니다</p>
                </div>
              ) : (
                trainings.map((training) => (
                  <div
                    key={training.id}
                    className="bg-slate-800/50 border border-slate-700 rounded-lg p-4 hover:border-slate-600 transition-colors"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h4 className="font-semibold text-slate-100">{training.name}</h4>
                          <span className={`text-xs px-2 py-1 rounded-full font-bold bg-gradient-to-r ${getTrainingTypeColor(training.type)} text-white`}>
                            {getTrainingTypeLabel(training.type)}
                          </span>
                          <span className={`text-xs px-2 py-1 rounded-full font-bold ${
                            training.status === 'completed' ? 'bg-green-500/20 text-green-300' :
                            training.status === 'ongoing' ? 'bg-yellow-500/20 text-yellow-300' :
                            'bg-slate-700 text-slate-300'
                          }`}>
                            {training.status === 'completed' ? '완료' : training.status === 'ongoing' ? '진행' : '예정'}
                          </span>
                        </div>
                        <p className="text-xs text-slate-400">
                          <Calendar size={12} className="inline mr-1" />
                          {formatDate(training.startDate)} ~ {formatDate(training.endDate)}
                        </p>
                      </div>
                      <button
                        onClick={() => handleDeleteTraining(training.id)}
                        className="px-3 py-2 text-red-400 hover:text-red-300 transition-colors"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-slate-400">진행률</span>
                        <span className="font-bold text-cyan-300">{training.progress}%</span>
                      </div>
                      <div className="w-full bg-slate-700 rounded-full h-2 overflow-hidden">
                        <div
                          className={`h-full bg-gradient-to-r ${getTrainingTypeColor(training.type)} transition-all duration-300`}
                          style={{width: `${training.progress}%`}}
                        />
                      </div>
                    </div>

                    {/* 교육 업데이트 컨트롤 */}
                    {training.status !== 'completed' && (
                      <div className="mt-3 pt-3 border-t border-slate-700 flex gap-2">
                        {training.status === 'ongoing' && (
                          <>
                            <input
                              type="range"
                              min="0"
                              max="100"
                              value={training.progress}
                              onChange={(e) => handleUpdateTraining(training.id, { progress: parseInt(e.target.value) })}
                              className="flex-1"
                            />
                            <button
                              onClick={() => handleUpdateTraining(training.id, { status: 'completed', progress: 100 })}
                              className="px-3 py-1 text-xs bg-green-500/20 text-green-300 rounded hover:bg-green-500/30 transition-colors font-semibold"
                            >
                              완료
                            </button>
                          </>
                        )}
                        {training.status === 'upcoming' && (
                          <button
                            onClick={() => handleUpdateTraining(training.id, { status: 'ongoing' })}
                            className="px-3 py-1 text-xs bg-yellow-500/20 text-yellow-300 rounded hover:bg-yellow-500/30 transition-colors font-semibold"
                          >
                            시작
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* 스킬 중요도 탭 */}
        {activeTab === 'skills' && (
          <div className="space-y-6">
            {/* 핵심 스킬 */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
              {sortedSkillsByImportance.slice(0, 3).map((skill, idx) => (
                <div
                  key={skill}
                  className={`bg-gradient-to-br rounded-lg p-6 border ${
                    idx === 0
                      ? 'from-amber-900/40 to-amber-800/20 border-amber-600/50 ring-2 ring-amber-500/50'
                      : idx === 1
                      ? 'from-slate-800 to-slate-800/50 border-slate-600'
                      : 'from-slate-800 to-slate-800/50 border-slate-600'
                  }`}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <div className="text-sm font-bold text-slate-400 mb-1">
                        {idx === 0 ? '🥇 최상위' : idx === 1 ? '🥈 상위' : '🥉 상위'}
                      </div>
                      <h3 className="text-2xl font-bold text-slate-100">{skill}</h3>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <div>
                      <p className="text-xs text-slate-400 mb-1">필요한 행동 수</p>
                      <p className="text-lg font-bold text-cyan-300">{skillImportance[skill].count}개</p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-400 mb-1">평균 정착도</p>
                      <p className="text-lg font-bold text-yellow-300">{skillImportance[skill].avgRating}/5</p>
                    </div>
                  </div>

                  <div className="mt-4 pt-4 border-t border-slate-700">
                    <p className="text-xs font-bold text-slate-300 mb-2">필요한 행동:</p>
                    <div className="space-y-1">
                      {skillBehaviorMap[skill].map(behavior => (
                        <div key={behavior.id} className="text-xs text-slate-400 flex items-center gap-2">
                          <span className={`w-2 h-2 rounded-full bg-gradient-to-r ${getRatingColor(behavior.rating)}`}></span>
                          {behavior.name}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* 스킬 중요도 분포 */}
            <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-8">
              <h3 className="text-lg font-bold text-slate-100 mb-6 flex items-center gap-2">
                <PieChart size={20} className="text-purple-400" />
                스킬 중요도 분포
              </h3>

              <div className="space-y-3">
                {sortedSkillsByImportance.map((skill) => {
                  const importance = skillImportance[skill];
                  const normalizedImportance = (importance.importance / maxImportance) * 100;
                  return (
                    <div key={skill} className="group">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-semibold text-slate-100">{skill}</span>
                        <span className="text-xs font-bold text-cyan-300">{normalizedImportance.toFixed(1)}%</span>
                      </div>
                      <div className="w-full bg-slate-700 rounded-full h-3 overflow-hidden cursor-pointer hover:h-4 transition-all">
                        <div
                          className={`h-full bg-gradient-to-r ${
                            normalizedImportance >= 80 ? 'from-red-500 to-orange-500' :
                            normalizedImportance >= 60 ? 'from-yellow-500 to-amber-500' :
                            normalizedImportance >= 40 ? 'from-cyan-500 to-blue-500' :
                            'from-slate-600 to-slate-500'
                          } transition-all duration-300 shadow-lg`}
                          style={{width: `${normalizedImportance}%`}}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* 관리 탭 */}
        {activeTab === 'matrix' && (
          <>
            {/* 검색 및 필터 */}
            <div className="mb-8 space-y-4">
              <div className="relative">
                <Search className="absolute left-4 top-3.5 text-slate-400" size={20} />
                <input
                  type="text"
                  placeholder="검색..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 bg-slate-800 border border-slate-600 rounded-lg text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                />
              </div>

              <div className="flex gap-4 flex-wrap items-center">
                <select 
                  value={filterSkill}
                  onChange={(e) => setFilterSkill(e.target.value)}
                  className="flex-1 min-w-[180px] px-4 py-3 bg-slate-800 border border-slate-600 rounded-lg text-slate-100 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                >
                  <option value="">모든 스킬</option>
                  {allSkills.map(skill => (
                    <option key={skill} value={skill}>{skill}</option>
                  ))}
                </select>

                <button
                  onClick={() => setShowAddForm(!showAddForm)}
                  className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-semibold rounded-lg hover:from-cyan-600 hover:to-blue-600 transition-all flex items-center gap-2 shadow-lg"
                >
                  <Plus size={20} /> 행동 추가
                </button>
              </div>
            </div>

            {/* 행동 추가 폼 */}
            {showAddForm && (
              <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-6 mb-8 backdrop-blur-sm">
                <h3 className="text-lg font-bold text-slate-100 mb-4">새로운 조직 행동 추가</h3>
                <div className="space-y-4">
                  <input
                    type="text"
                    placeholder="행동 이름"
                    value={newBehavior.name}
                    onChange={(e) => setNewBehavior({...newBehavior, name: e.target.value})}
                    className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  />
                  <textarea
                    placeholder="행동 설명"
                    value={newBehavior.description}
                    onChange={(e) => setNewBehavior({...newBehavior, description: e.target.value})}
                    className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 resize-none h-20"
                  />
                  <input
                    type="text"
                    placeholder="필요 스킬"
                    value={newBehavior.skills}
                    onChange={(e) => setNewBehavior({...newBehavior, skills: e.target.value})}
                    className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  />
                  <div className="flex gap-3 justify-end">
                    <button
                      onClick={() => setShowAddForm(false)}
                      className="px-4 py-2 bg-slate-700 text-slate-100 rounded-lg hover:bg-slate-600"
                    >
                      취소
                    </button>
                    <button
                      onClick={handleAddBehavior}
                      className="px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-lg hover:from-cyan-600 hover:to-blue-600 font-semibold"
                    >
                      추가
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* 행동 목록 */}
            <div className="space-y-4">
              {filteredBehaviors.length === 0 ? (
                <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-12 text-center">
                  <p className="text-slate-400 text-lg">행동이 없습니다</p>
                </div>
              ) : (
                filteredBehaviors.map((behavior) => {
                  const prog = getBehaviorProgress(behavior);
                  return (
                    <div
                      key={behavior.id}
                      className="bg-gradient-to-r from-slate-800 to-slate-800/50 border border-slate-700 rounded-lg overflow-hidden hover:border-slate-600 transition-all"
                    >
                      <div
                        onClick={() => toggleExpanded(behavior.id)}
                        className="p-6 cursor-pointer flex justify-between items-start gap-4"
                      >
                        <div className="flex-1">
                          <h3 className="text-xl font-bold text-cyan-300 mb-2">{behavior.name}</h3>
                          <p className="text-slate-400 text-sm mb-3">{behavior.description}</p>
                          <div className="flex items-center gap-3 text-sm">
                            <span className={`px-2 py-1 bg-gradient-to-r ${getRatingColor(behavior.rating)} rounded text-white text-xs font-bold`}>
                              현재: {behavior.rating}/5
                            </span>
                            <span className="text-slate-400">목표: {behavior.targetRating}/5</span>
                            <span className="text-slate-400">진행률: {prog.progress.toFixed(0)}%</span>
                          </div>
                        </div>
                        <ChevronDown
                          size={24}
                          className={`text-slate-400 transition-transform ${expandedId === behavior.id ? 'rotate-180' : ''}`}
                        />
                      </div>

                      {expandedId === behavior.id && (
                        <div className="bg-slate-900/50 border-t border-slate-700 px-6 py-4 space-y-4">
                          <div>
                            <h4 className="text-sm font-bold text-slate-300 mb-3">정착도 평가</h4>
                            <StarRating
                              rating={behavior.rating}
                              onRatingChange={(newRating) => handleRatingChange(behavior.id, newRating)}
                            />
                          </div>

                          <div className="border-t border-slate-700 pt-4">
                            <h4 className="text-sm font-bold text-slate-300 mb-2">필요 스킬</h4>
                            <div className="flex flex-wrap gap-2">
                              {behavior.skills.map((skill, idx) => (
                                <span
                                  key={idx}
                                  className="px-3 py-1.5 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 border border-cyan-500/30 text-cyan-300 text-sm rounded-full font-medium"
                                >
                                  {skill}
                                </span>
                              ))}
                            </div>
                          </div>

                          <div className="flex gap-3 pt-2 border-t border-slate-700">
                            <button
                              onClick={() => handleDelete(behavior.id)}
                              className="px-4 py-2 bg-red-900/30 text-red-300 rounded-lg hover:bg-red-900/50 flex items-center gap-2 text-sm font-medium flex-1"
                            >
                              <Trash2 size={16} /> 삭제
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default CultureSkillsMapper;
