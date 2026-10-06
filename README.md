# Dev Tools

개인용 개발자 도구 모음 Chrome 확장 프로그램 (Manifest V3). 스토어 배포 없이 압축해제된 확장으로만 사용합니다. 모든 처리는 브라우저 안에서만 이뤄지며 외부 서버를 호출하지 않습니다.

## 개발 실행

```bash
npm install
npm run dev
```

`npm run dev`는 Vite 개발 서버(포트 5173)를 띄우고 `dist/`에 확장 프로그램을 생성합니다. 팝업 UI와 background 코드를 수정하면 HMR/자동 리로드로 반영됩니다.

| 명령 | 설명 |
| --- | --- |
| `npm run dev` | 개발 서버 (HMR) |
| `npm run build` | 타입 체크 + 프로덕션 빌드 → `dist/` |
| `npm test` | Vitest 실행 |
| `npm run typecheck` | 타입 체크만 |

## Chrome에 로드하기

1. `npm run dev`(또는 `npm run build`)로 `dist/` 폴더를 만든다.
2. Chrome에서 `chrome://extensions` 접속 → 우측 상단 **개발자 모드** 켜기.
3. **압축해제된 확장 프로그램을 로드합니다** 클릭 → 이 프로젝트의 `dist/` 폴더 선택.
4. 툴바 퍼즐 아이콘에서 Dev Tools를 고정하고 클릭.

`npm run dev`로 로드했다면 이후 코드 수정 시 자동 갱신됩니다. 다시 로드는 필요 없지만, `manifest.config.ts`를 바꾼 경우에는 `chrome://extensions`에서 새로고침하세요. 개발 서버를 끈 상태에서는 `npm run build` 결과를 로드해야 합니다.

## 도구 추가하기

1. `src/tools/<tool-name>/` 폴더를 만든다.
   - `index.ts` — 메타(`id`, `name`, `description`, `icon`) + `React.lazy` 컴포넌트를 `Tool`로 default export
   - `<Name>.tsx` — UI
   - `logic.ts` / `logic.test.ts` — 순수 로직과 테스트
2. `src/tools/registry.ts`에 import와 배열 항목을 추가한다.

팝업 목록과 검색에는 자동으로 나타납니다. `src/tools/element-info/`를 예시로 참고하세요.

## 요소 선택(picker)

`src/content/picker.ts`의 `startPicker()`는 마우스를 올린 요소를 하이라이트하고 클릭하면 요소 정보(selector, 스타일 등)를 반환하는 공통 모듈입니다. 팝업에서는 `src/popup/picker-client.ts`의 `injectPicker()`로 활성 탭에 주입하고, 결과는 background가 `chrome.storage.session`에 저장합니다(페이지를 클릭하면 팝업이 닫히기 때문). 취소는 `Esc`.

## 폴더 구조

```
manifest.config.ts       MV3 매니페스트 (권한 정의)
vite.config.ts           Vite + CRXJS + Vitest
src/
  popup/                 팝업 (목록 + 검색, 도구 화면 전환)
  background/            service worker (picker 결과 저장)
  content/               페이지 주입 코드 (picker, selector)
  shared/                공통 메시지 타입
  tools/
    registry.ts          도구 등록 한 곳
    types.ts, search.ts  Tool 타입, 검색 로직
    element-info/        데모 도구 (picker 사용)
```
