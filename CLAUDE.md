# Dev Tools — 개인용 개발자 도구 모음 Chrome 익스텐션

스토어에 올리지 않고 **압축해제된 확장 프로그램**으로만 쓴다.

## 기술 스택
- Manifest V3, Vite + `@crxjs/vite-plugin`, TypeScript(strict), React(팝업 UI만)
- 패키지 매니저: **npm**
- 테스트: Vitest (`npm test`)

## 명령어
- `npm run dev` — 개발 서버(HMR). `dist/`를 Chrome에 로드
- `npm run build` — `tsc --noEmit` + `vite build` (작업 끝나면 반드시 통과 확인)
- `npm test` — 순수 로직 테스트

## 구조 규칙
- 도구는 `src/tools/<tool-name>/` 폴더 하나에 모듈로 분리한다.
  - `index.ts` — 메타 정보(`id`, `name`, `description`, `icon`)와 `React.lazy`로 감싼 `component`를 `Tool` 타입으로 default export
  - `<Name>.tsx` — UI 컴포넌트
  - `logic.ts` — **순수 로직(입력 → 출력)**. DOM/chrome API에 의존하지 않는다
  - `logic.test.ts` — 순수 로직 Vitest 테스트 (로직을 만들 때 같이 작성)
- 도구 추가 = 폴더 생성 + `src/tools/registry.ts`에 등록(import 1줄 + 배열 1줄). 팝업 목록·검색에는 자동 반영되므로 팝업 코드는 건드리지 않는다.
- `src/content/picker.ts` — 페이지에 주입되어 hover 하이라이트 + 클릭 선택을 하는 **공통 모듈**(`startPicker`). 색상 추출, 글꼴 검사 등 이후 도구가 재사용한다. 새 도구를 위해 picker를 복제하지 말고 이 모듈을 확장/재사용한다.
  - `picker.inject.ts`가 주입 진입점이다. 결과는 `chrome.runtime.sendMessage`로 background에 전달 → `chrome.storage.session`에 저장(팝업은 페이지 클릭 시 닫히므로).
  - 팝업 쪽 API는 `src/popup/picker-client.ts` (`injectPicker`, `readLastPick`, `onPicked`).
- 메시지/공유 타입은 `src/shared/messages.ts`. 경로 별칭 `@/` = `src/`.

## 원칙
- **모든 처리는 브라우저 안에서만.** 외부 서버 호출(fetch/XHR/원격 스크립트/분석 등) 금지.
- 순수 로직은 반드시 Vitest 테스트를 함께 작성한다. 테스트 환경은 `node`이므로 DOM이 필요한 코드는 순수 함수로 분리해 테스트한다(예: `content/selector.ts`).
- 권한은 `manifest.config.ts`의 아래 목록을 유지한다. 필요 없이 늘리지 않는다.
  - permissions: `activeTab`, `scripting`, `cookies`, `storage`, `clipboardWrite`
  - host_permissions: `<all_urls>`
- 팝업 외 UI(React)는 만들지 않는다. 페이지에 주입되는 코드는 React 없이 바닐라 TS로 작성하고 shadow DOM으로 스타일을 격리한다.
- 주석/UI 문구는 한국어, 식별자는 영어.
