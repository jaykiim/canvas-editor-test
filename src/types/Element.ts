interface Element {
  // 엘리먼트의 기본 속성
  id: string;
  name: string;
  x: number;
  y: number;
  width: number;
  height: number;

  // 스타일 관련 속성
  backgroundColor?: string;
  textColor?: string;

  // 그룹 속성
  isGroup?: boolean;
  parentId?: string; // 부모 그룹의 ID
  children?: (Element | Group)[]; // 엘리먼트 또는 그룹을 담을 수 있는 배열

  // 메서드
  move?(x: number, y: number): void;
  resize?(width: number, height: number): void;
}

interface Group extends Element {
  // 그룹 고유 속성
  isGroup: true;
}

export type { Element };