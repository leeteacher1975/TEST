# 🎯 조직문화 행동-스킬셋 평가 및 개발 플랫폼

조직의 핵심 행동과 필요 스킬셋을 평가하고, 개발 로드맵을 관리하는 통합 플랫폼입니다.

## ✨ 주요 기능

### 📊 개요
- 평균 정착도 및 평가 분포 시각화
- 스킬별 현황 분석
- 조직 전체 현황 한눈에 파악

### 📈 진척도 추적
- 행동별 목표 달성 진행률
- 기한 관리 및 온트랙 여부 표시
- 개별 교육 연결 및 추천

### 🎓 교육로드맵
- 스킬별 교육 프로그램 등록
- 교육 유형 분류 (온라인, 워크숍, 프로그램, 코칭)
- 진행 상황 실시간 추적

### ⚡ 스킬 중요도 분석
- 조직 내 핵심 스킬 랭킹
- 중요도 시각화
- 스킬별 평균 정착도

### 📋 통합 관리
- 행동 및 스킬셋 CRUD
- 매트릭스 뷰로 관계도 시각화
- 검색 및 필터링

## 🚀 시작하기

### 온라인 배포 (추천)
```bash
# 1. GitHub에 이 저장소를 업로드
git init
git add .
git commit -m "first commit"
git branch -M main
git remote add origin https://github.com/[your-username]/culture-skills-mapper.git
git push -u origin main

# 2. Vercel에 배포
# https://vercel.com 방문
# → "New Project" → 저장소 선택 → Deploy
```

### 로컬 개발
```bash
# 1. Node.js 16+ 설치 (https://nodejs.org)

# 2. 의존성 설치
npm install

# 3. 개발 서버 실행
npm run dev

# 4. http://localhost:5173 에서 확인
```

### 빌드 및 배포
```bash
# 프로덕션 빌드
npm run build

# 로컬에서 빌드 결과 확인
npm run preview
```

## 📁 프로젝트 구조

```
culture-skills-mapper/
├── index.html              # 메인 HTML
├── package.json            # 프로젝트 설정
├── vite.config.js          # Vite 설정
├── tailwind.config.js      # 스타일 설정
├── src/
│   ├── main.jsx            # 진입점
│   ├── App.jsx             # 메인 앱
│   └── index.css           # 글로벌 스타일
└── public/                 # 정적 파일
```

## 🛠 기술 스택

- **Frontend**: React 18 + Vite
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Deployment**: Vercel / Netlify

## 📊 핵심 기능 설명

### 1️⃣ 행동 평가
- 1-5점 척도로 조직의 행동 정착도 평가
- 목표 수준 설정 및 달성 기한 설정
- 자동으로 진척도 계산

### 2️⃣ 스킬 분석
- 각 행동에 필요한 스킬셋 매핑
- 스킬의 중요도를 자동으로 계산
- 우선순위 기반 개발 전략 수립

### 3️⃣ 교육 로드맵
- 부족한 스킬을 개발하기 위한 교육 프로그램 등록
- 교육 진행 상황 모니터링
- 목표 달성 경로 시각화

### 4️⃣ 진척도 추적
- 조직 전체의 변화 추세 파악
- 행동별 진행 현황 상세 분석
- 기한 내 달성 가능성 평가

## 💡 사용 시나리오

### 조직문화 담당자
```
1. 조직의 핵심 행동 정의
2. 각 행동의 현재 수준 평가
3. 부족한 스킬 파악
4. 교육 프로그램 계획
5. 정기적으로 진척도 추적
6. 팀과 결과 공유
```

### HR 담당자
```
1. 직원별 스킬 레벨 평가
2. 개발 필요 영역 파악
3. 맞춤형 교육 프로그램 배정
4. 성장 진도 모니터링
5. 연간 목표 달성도 확인
```

### 리더십팀
```
1. 조직 현황 대시보드 확인
2. 우선순위 조정
3. 리소스 배분 결정
4. 변화 추세 분석
5. 다음 단계 계획
```

## 🔧 커스터마이징

### 색상 변경
`tailwind.config.js`에서 색상 테마 수정:
```javascript
theme: {
  extend: {
    colors: {
      primary: '#your-color',
    }
  }
}
```

### 기본 데이터 변경
`src/App.jsx`의 `useState` 초기값 수정

### 로고/브랜딩 추가
```jsx
<img src="/your-logo.png" alt="Logo" />
```

## 📱 반응형 디자인

- ✅ 데스크톱 (1920px+)
- ✅ 태블릿 (768px - 1024px)
- ✅ 모바일 (320px - 767px)

## 🔐 데이터 보안

현재: 브라우저 로컬 메모리에 저장 (새로고침하면 초기화)

### 영구 저장 옵션
1. **로컬 스토리지**: 브라우저 저장 (간단)
2. **Google Sheets**: 클라우드 저장 (공유 용이)
3. **Firebase**: 실시간 동기화 (협업)
4. **자체 DB**: 완전 제어 (복잡)

## 📈 확장 가능 기능

- [ ] 사용자 인증 (로그인)
- [ ] 팀 협업 기능
- [ ] 데이터 내보내기 (Excel, PDF, PowerPoint)
- [ ] 이메일 알림
- [ ] 댓글 및 피드백
- [ ] 벤치마킹
- [ ] AI 기반 추천
- [ ] 모바일 앱

## 🤝 기여 방법

1. Fork this repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📞 지원 및 문의

- 📧 이메일: support@example.com
- 💬 이슈 리포트: GitHub Issues
- 💡 기능 제안: GitHub Discussions

## 📄 라이선스

MIT License - 자유롭게 사용, 수정, 배포 가능

## 🎉 감사합니다!

이 플랫폼이 조직의 문화 발전에 도움이 되기를 바랍니다.

---

**문제가 있으신가요?** [여기서 이슈를 보고하세요](https://github.com/your-username/culture-skills-mapper/issues)

**기능을 제안하고 싶으신가요?** [여기서 아이디어를 공유하세요](https://github.com/your-username/culture-skills-mapper/discussions)
