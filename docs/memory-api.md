# Memory Service API

**파일 경로:** `lib/services/memory.ts`

---

## 1. 개요

`lib/services/memory.ts`는 Supabase `public.memories` 테이블에 대한 모든 읽기/쓰기 작업을 하나의 파일로 모은 서비스 레이어입니다.

**컴포넌트에서 Supabase를 직접 호출하지 않는 이유:**
- 쿼리 로직이 여러 컴포넌트에 흩어지면 select 컬럼, 에러 처리, 타입 정의가 파일마다 달라진다
- 테이블 구조가 바뀔 때 수정해야 할 파일이 늘어난다
- 공통 함수로 분리하면 한 곳만 수정하면 된다

---

## 2. 제공 함수

### `getMemories`

전체 메모리 목록을 최신순으로 가져옵니다.

```ts
getMemories(): Promise<MemoryRow[]>
```

| 파라미터 | 없음 |
|----------|------|
| 반환값 | `MemoryRow[]` — 비어 있으면 `[]` |
| 에러 | Supabase 오류 시 `throw` |

**사용 예시**
```ts
import { getMemories } from "@/lib/services/memory"

const memories = await getMemories()
```

---

### `getRecentMemories`

최신 N개의 메모리를 가져옵니다. 홈 화면 최근 기록 등에 사용합니다.

```ts
getRecentMemories(limit: number): Promise<MemoryRow[]>
```

| 파라미터 | 타입 | 설명 |
|----------|------|------|
| `limit` | `number` | 가져올 최대 개수 |

| 반환값 | `MemoryRow[]` |
|--------|---------------|
| 에러 | Supabase 오류 시 `throw` |

**사용 예시**
```ts
import { getRecentMemories } from "@/lib/services/memory"

const recent = await getRecentMemories(2)
```

---

### `getMemoryById`

특정 메모리 단건을 조회합니다.

```ts
getMemoryById(id: number): Promise<MemoryRow>
```

| 파라미터 | 타입 | 설명 |
|----------|------|------|
| `id` | `number` | memories 테이블 PK |

| 반환값 | `MemoryRow` |
|--------|------------|
| 에러 | 존재하지 않거나 Supabase 오류 시 `throw` |

**사용 예시**
```ts
import { getMemoryById } from "@/lib/services/memory"

const memory = await getMemoryById(42)
```

---

### `createMemory`

새 메모리를 생성합니다.

```ts
createMemory(input: CreateMemoryInput): Promise<void>
```

| 파라미터 | 타입 | 설명 |
|----------|------|------|
| `input` | `CreateMemoryInput` | 생성할 메모리 데이터 |

| 반환값 | `void` |
|--------|--------|
| 에러 | Supabase 오류 시 `throw` |

**사용 예시**
```ts
import { createMemory } from "@/lib/services/memory"

await createMemory({
  title: "산책",
  text: "오늘 날씨가 좋았다",
  image_url: null,
  emotion_id: 1,
  with_whom: "Solo",
  memory_at: new Date().toISOString(),
  location_lat: 37.5665,
  location_lng: 126.978,
  location_label: "서울특별시 중구",
  place_name: "광화문",
})
```

---

### `updateMemory`

기존 메모리를 수정합니다.

```ts
updateMemory(id: number, input: UpdateMemoryInput): Promise<void>
```

| 파라미터 | 타입 | 설명 |
|----------|------|------|
| `id` | `number` | 수정할 메모리 PK |
| `input` | `UpdateMemoryInput` | 수정할 데이터 (전체 필드 필요) |

| 반환값 | `void` |
|--------|--------|
| 에러 | Supabase 오류 시 `throw` |

**사용 예시**
```ts
import { updateMemory } from "@/lib/services/memory"

await updateMemory(42, {
  title: "수정된 제목",
  text: "수정된 내용",
  image_url: null,
  emotion_id: 4,
  with_whom: "Together",
  memory_at: new Date().toISOString(),
  location_lat: null,
  location_lng: null,
  location_label: null,
  place_name: null,
})
```

---

### `deleteMemory`

메모리를 삭제합니다.

```ts
deleteMemory(id: number): Promise<void>
```

| 파라미터 | 타입 | 설명 |
|----------|------|------|
| `id` | `number` | 삭제할 메모리 PK |

| 반환값 | `void` |
|--------|--------|
| 에러 | Supabase 오류 시 `throw` |

**사용 예시**
```ts
import { deleteMemory } from "@/lib/services/memory"

await deleteMemory(42)
```

---

## 3. 데이터 타입

### `MemoryRow`

`getMemories`, `getRecentMemories`, `getMemoryById`의 반환 타입입니다.

```ts
type MemoryRow = {
  id: number
  title: string | null
  text: string | null
  image_url: string | null
  emotion_id: number | null       // 1=Good 2=Bad 3=Sad 4=Calm
  with_whom: string | null        // "Solo" | "Together"
  memory_at: string | null        // ISO 8601
  place_name: string | null
  location_label: string | null
  location_lat: number | null
  location_lng: number | null
}
```

> `getMemories`와 `getRecentMemories`는 일부 필드(image_url, location_* 등)를 select하지 않으므로 해당 필드는 `undefined`입니다. 목록 화면에서는 접근하지 마세요.

---

### `CreateMemoryInput`

`createMemory`에 전달하는 입력 타입입니다.

```ts
type CreateMemoryInput = {
  title: string | null
  text: string | null
  image_url: string | null
  emotion_id: number              // 1=Good 2=Bad 3=Sad 4=Calm
  with_whom: string               // "Solo" | "Together"
  memory_at: string               // ISO 8601
  location_lat: number | null
  location_lng: number | null
  location_label: string | null
  place_name: string | null
}
```

---

### `UpdateMemoryInput`

`updateMemory`에 전달하는 입력 타입입니다. `CreateMemoryInput`과 동일한 구조입니다.

```ts
type UpdateMemoryInput = {
  title: string | null
  text: string | null
  image_url: string | null
  emotion_id: number
  with_whom: string
  memory_at: string
  location_lat: number | null
  location_lng: number | null
  location_label: string | null
  place_name: string | null
}
```

---

## 4. 규칙

- **컴포넌트에서 `supabase.from("memories")`를 직접 호출하지 않는다.**
- memories 테이블에 접근할 때는 반드시 `lib/services/memory.ts`의 함수를 사용한다.
- `createMemory` / `updateMemory`에 전달하는 데이터는 반드시 `CreateMemoryInput` / `UpdateMemoryInput` 타입을 따른다.
- 모든 함수는 에러 시 `throw`하므로, 호출부에서 반드시 `try/catch`로 처리한다.
- Supabase Storage(이미지 업로드) 호출은 이 서비스 레이어의 범위 밖이다. Storage 관련 코드는 각 페이지에서 직접 처리한다.

---

## 5. 참고 사항

- `getMemories`와 `getRecentMemories`는 select 컬럼이 제한되어 있어 `image_url`, `location_lat/lng`, `place_name`, `location_label`은 반환하지 않는다. 이 필드가 필요하면 `getMemoryById`를 사용한다.
- `updateMemory`는 부분 업데이트(PATCH)가 아닌 전체 필드를 전달해야 한다. 변경하지 않는 필드도 기존 값 그대로 포함할 것.
- `emotion_id`와 감정 아이콘 매핑은 `DESIGN.md`의 "감정 아이콘 규칙" 섹션을 참고한다.
