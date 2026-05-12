import { writeFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));

// 카테고리별 한글 큐레이션 타이틀 (선교/독서/여행/미래공간)
const KOREAN_TITLES = {
  '학회': [
    '인공지능을 활용한 교통 시스템 최적화',
    '스마트 모빌리티 최신 동향 분석',
    '자율주행 자동차의 안전성 검증 연구',
    '지속가능한 도로 인프라 구축 방안',
    '2026년 교통공학 학술대회 발표 논문집',
  ],
  '미래공간': [
    '메타버스 내 가상 오피스 구축 사례 분석',
    '스마트 워크플레이스 2026 트렌드',
    '공간 컴퓨팅과 사용자 경험 혁신',
    '친환경 미래 도시 계획 설계',
    '미래형 주거 공간의 구현 방향',
  ],
  '독서': [
    '2026년 트렌드 코리아 분석',
    'AI 시대의 인문학적 사고',
    '리더십과 소통의 기술',
    '경제 불확실성을 극복하는 투자 전략',
    '마음챙김 명상 실천 가이드',
  ],
  '세계도로협회': [
    'PIARC 세계도로대회 기술 보고서',
    '탄소 중립을 위한 친환경 도로 정책',
    '글로벌 교통 안전 가이드라인',
    '겨울철 도로 유지관리 기술 동향',
    '자율주행 시대를 대비한 도로 인프라',
  ],
  '여행': [
    '지속 가능한 생태 관광 가이드',
    '유럽 문화 탐방 기행문',
    '소도시 매력 발굴 여행기',
    '디지털 노마드를 위한 워케이션 추천지',
    '안전한 해외 여행을 위한 체크리스트',
  ],
  '언어': [
    '효과적인 비즈니스 영어 프레젠테이션',
    '다문화 사회의 언어 교환 프로그램',
    '스페인어 기초 회화 마스터하기',
    'AI 번역 기술의 발전과 한계',
    '언어 학습을 위한 게이미피케이션 전략',
  ],
  '선교': [
    '해외 단기 선교 활동 보고서',
    '지역 사회와 함께하는 선교 비전',
    '현대 선교의 새로운 패러다임',
    '선교지 언어와 문화 이해',
    '디지털 시대의 미디어 선교 전략',
  ],
};

// arXiv 검색 쿼리 (학술 논문 실시간 수집)
const ARXIV_QUERIES = {
  '학회': 'ti:transportation+OR+ti:traffic+infrastructure+OR+ti:highway',
  '세계도로협회': 'ti:road+OR+ti:pavement+OR+ti:highway+infrastructure',
  '언어': 'cat:cs.CL+AND+(ti:language+learning+OR+ti:multilingual)',
  '미래공간': 'ti:smart+space+OR+ti:future+workplace+OR+ti:metaverse',
};

function formatKoreanDate(date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}년 ${m}월 ${d}일`;
}

function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

async function fetchArxivPapers(query, count = 5) {
  try {
    const url = `https://export.arxiv.org/api/query?search_query=${query}&start=0&max_results=${count}&sortBy=submittedDate&sortOrder=descending`;
    console.log(`  arXiv 수집: ${url}`);
    const res = await fetch(url, { signal: AbortSignal.timeout(15000) });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const xml = await res.text();

    const entries = [];
    const regex = /<entry>([\s\S]*?)<\/entry>/g;
    let match;

    while ((match = regex.exec(xml)) !== null) {
      const body = match[1];
      const title = (body.match(/<title>([\s\S]*?)<\/title>/)?.[1] ?? '')
        .trim().replace(/\s+/g, ' ');
      const summary = (body.match(/<summary>([\s\S]*?)<\/summary>/)?.[1] ?? '')
        .trim().replace(/\s+/g, ' ').slice(0, 160);
      const link = (body.match(/<id>([\s\S]*?)<\/id>/)?.[1] ?? '').trim();
      const published = body.match(/<published>([\s\S]*?)<\/published>/)?.[1] ?? '';

      if (title && link) {
        entries.push({
          title,
          summary: summary ? summary + '...' : '상세 내용은 원문을 참고하세요.',
          link,
          date: formatKoreanDate(published ? new Date(published) : new Date()),
          views: randomInt(100, 1000),
          visitors: randomInt(50, 500),
          citations: randomInt(5, 50),
        });
      }
    }

    return entries.slice(0, count);
  } catch (e) {
    console.warn(`  arXiv 수집 실패 (${e.message}), 한글 데이터로 대체합니다.`);
    return [];
  }
}

function generateKoreanItems(categoryName, subCategory, count = 5) {
  const titles = KOREAN_TITLES[categoryName] ?? ['참고 자료'];
  const now = new Date();

  let suffix = '';
  if (subCategory === '논문(연구보고서)') suffix = ' (Research Report)';
  else if (subCategory === '발표자료') suffix = ' (Presentation)';

  return Array.from({ length: count }, (_, i) => {
    const title = titles[i % titles.length] + suffix;
    const date = new Date(now);
    date.setDate(date.getDate() - i);

    return {
      title,
      date: formatKoreanDate(date),
      summary: `${titles[i % titles.length]}에 대한 상세한 ${subCategory} 내용이 포함되어 있습니다.`,
      link: `https://scholar.google.com/scholar?q=${encodeURIComponent(title)}`,
      views: randomInt(100, 1000),
      visitors: randomInt(50, 500),
      citations: randomInt(5, 50),
    };
  });
}

function buildSection(rawItems, categoryName, subCategory) {
  const items = rawItems.map((item, i) => ({
    id: `${categoryName}-${subCategory}-${i}-${Date.now()}`,
    ...item,
  }));
  return {
    recent: items.slice(0, 3),
    popular: [...items].sort((a, b) => b.views - a.views).slice(0, 3),
    cited: [...items].sort((a, b) => b.citations - a.citations).slice(0, 3),
  };
}

async function main() {
  console.log('=== 주간 데이터 수집 시작 ===');

  const categories = ['학회', '미래공간', '독서', '세계도로협회', '여행', '언어', '선교'];
  const subCategories = ['최근기사', '논문(연구보고서)', '발표자료'];
  const liveData = {};

  for (const cat of categories) {
    console.log(`\n[${cat}]`);
    liveData[cat] = {};

    for (const sub of subCategories) {
      let rawItems;

      if (ARXIV_QUERIES[cat]) {
        // arXiv에서 실제 논문 수집 시도
        rawItems = await fetchArxivPapers(ARXIV_QUERIES[cat], 5);
      }

      // arXiv 실패하거나 해당 없는 카테고리는 한글 큐레이션 사용
      if (!rawItems || rawItems.length === 0) {
        rawItems = generateKoreanItems(cat, sub, 5);
      }

      liveData[cat][sub] = buildSection(rawItems, cat, sub);
      console.log(`  ${sub}: ${rawItems.length}건 수집`);
    }
  }

  const output = {
    updatedAt: new Date().toISOString(),
    data: liveData,
  };

  const outputPath = join(__dirname, '..', 'public', 'liveData.json');
  writeFileSync(outputPath, JSON.stringify(output, null, 2), 'utf-8');
  console.log(`\n✓ liveData.json 저장 완료: ${outputPath}`);
  console.log(`✓ 업데이트 시각: ${output.updatedAt}`);
}

main().catch((err) => {
  console.error('스크립트 오류:', err);
  process.exit(1);
});
