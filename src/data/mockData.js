export const categories = [
  { id: 'conference', name: '학회', icon: 'Users', color: '#4ecdc4' },
  { id: 'futurespace', name: '미래공간', icon: 'Rocket', color: '#45b7d1' },
  { id: 'reading', name: '독서', icon: 'BookOpen', color: '#f9ca24' },
  { id: 'piarc', name: '세계도로협회', icon: 'Globe', color: '#2980b9' },
  { id: 'travel', name: '여행', icon: 'Plane', color: '#9b59b6' },
  { id: 'language', name: '언어', icon: 'Languages', color: '#e67e22' },
  { id: 'mission', name: '선교', icon: 'HeartHandshake', color: '#ff6b6b' }
];

const sampleTitles = {
  '선교': ['해외 단기 선교 활동 보고서', '지역 사회와 함께하는 선교 비전', '현대 선교의 새로운 패러다임', '선교지 언어와 문화 이해', '디지털 시대의 미디어 선교 전략'],
  '학회': ['인공지능을 활용한 교통 시스템 최적화', '스마트 모빌리티 최신 동향', '자율주행 자동차의 안전성 검증', '지속가능한 인프라 구축 방안', '2026년 춘계 학술대회 발표 논문집'],
  '미래공간': ['미래형 주거 공간의 설계와 구현', '메타버스 내 가상 오피스 구축 사례', '스마트 워크플레이스 트렌드', '공간 컴퓨팅과 사용자 경험 혁신', '친환경 미래 도시 계획'],
  '독서': ['2026년 트렌드 코리아 분석', 'AI 시대의 인문학적 사고', '리더십과 소통의 기술', '경제 위기를 극복하는 투자 전략', '마음을 챙기는 명상 에세이'],
  '세계도로협회': ['PIARC 세계도로대회 기술 보고서', '탄소 중립을 위한 친환경 도로 정책', '글로벌 교통 안전 가이드라인', '겨울철 도로 유지관리 기술 동향', '자율주행 시대를 대비한 도로 인프라'],
  '여행': ['지속 가능한 생태 관광 가이드', '유럽 문화 탐방 기행문', '소도시 매력 발굴 여행기', '디지털 노마드를 위한 워케이션 추천지', '안전한 해외 여행을 위한 체크리스트'],
  '언어': ['효과적인 비즈니스 영어 프레젠테이션', '다문화 사회의 언어 교환 프로그램', '스페인어 기초 회화 마스터하기', 'AI 번역 기술의 발전과 한계', '언어 학습을 위한 게이미피케이션 전략']
};

const subCategories = ['최근기사', '논문(연구보고서)', '발표자료'];

const generateItems = (categoryName, subCategory, type, count = 3) => {
  const titles = sampleTitles[categoryName] || ['참고 자료'];
  
  return Array.from({ length: count }, (_, i) => {
    // 랜덤으로 그럴싸한 제목 선택
    const randomTitle = titles[Math.floor(Math.random() * titles.length)];
    // 자료 종류에 따른 접미사 추가
    let suffix = '';
    if (subCategory === '논문(연구보고서)') suffix = ' (Research Report)';
    else if (subCategory === '발표자료') suffix = ' (Presentation)';

    return {
      id: `${categoryName}-${subCategory}-${type}-${i}`,
      title: `${randomTitle}${suffix}`,
      date: `2026년 05월 ${String(12 - i).padStart(2, '0')}일`,
      views: Math.floor(Math.random() * 1000) + 100,
      visitors: Math.floor(Math.random() * 500) + 50,
      citations: Math.floor(Math.random() * 50) + 5,
      summary: `${randomTitle}에 대한 상세한 ${subCategory} 내용이 포함되어 있습니다.`,
      link: `https://scholar.google.com/scholar?q=${encodeURIComponent(randomTitle)}` // 원문 링크 추가
    };
  });
};

export const getCategoryData = (categoryId) => {
  const category = categories.find(c => c.id === categoryId);
  if (!category) return null;

  const data = {};
  
  subCategories.forEach(sub => {
    data[sub] = {
      recent: generateItems(category.name, sub, '최근 등록된'),
      popular: generateItems(category.name, sub, '조회수 높은', 3).sort((a,b) => b.views - a.views),
      cited: generateItems(category.name, sub, '많이 인용된', 3).sort((a,b) => b.citations - a.citations)
    };
  });

  return data;
};
