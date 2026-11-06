# 천안시 청년정책 2026 — 웹 프레젠테이션

정적 웹사이트입니다. 별도 서버·DB·npm 설치 없이 GitHub Pages에서 실행됩니다.

## GitHub Pages 배포
1. GitHub에서 새 공개 저장소를 생성합니다.
2. `index.html`, `styles.css`, `app.js`, `slides-data.js`, `assets/` 폴더를 저장소 루트에 업로드합니다.
3. Settings → Pages → Build and deployment → Deploy from a branch를 선택합니다.
4. Branch `main`, Folder `/(root)`를 선택하고 저장하면 게시됩니다.
5. 생성된 `https://<계정>.github.io/<저장소>/` 주소로 접속합니다.

## 조작
- 화면의 이전·다음 버튼, 하단 썸네일, 상단 주제 메뉴
- 키보드 `←` `→` / `PageUp` `PageDown` / `Home` `End`
- 모바일: 슬라이드 좌우 스와이프
- `G` 전체 목차, `I` 내용 및 출처, `Esc` 닫기
- 자동 재생(6.5초 간격), 전체 화면 기능
- URL의 `#slide=5` 같은 링크로 특정 슬라이드 직접 열기
- Shift + 마우스 휠로 슬라이드 넘기기 (일반 휠은 페이지 스크롤)

## 원본 충실도 및 접근성
- 원본 PPT의 모든 10장을 1601×900 고해상도 이미지로 표시하여 디자인과 시각화 보존
- 본문과 출처 URL을 `slides-data.js`에 따로 담고, 정보 패널과 이미지 대체 텍스트로 제공
- 사전 확인되지 않은 내용은 추가하지 않음
- 폰트/라이브러리/CDN 없이 오프라인 작동

## 수정
- 디자인·동작: `styles.css`, `app.js`
- 슬라이드 내용·출처: `slides-data.js`
- 슬라이드 비주얼: `assets/slide-1.png` ~ `slide-10.png` 이미지 교체

**출처와 공식성:** 슬라이드는 제공된 PPT를 충실하게 재현하며, PPT 원문의 각 페이지에 포함된 출처와 검증 주의사항을 정보 패널로 이관합니다. 2026년 계획과 실제 집행 성과는 구분해야 합니다.
