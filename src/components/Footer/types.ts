export interface FooterMenuItem {
  label: string;
  items: {
    name: string;
    href?: string;
  }[];
}

export const FOOTER_MENUS: FooterMenuItem[] = [
  {
    label: "안내",
    items: [
      { name: "개인정보처리방침" },
      { name: "운영정책" },
      { name: "이용약관" },
    ],
  },
  {
    label: "소셜",
    items: [{ name: "유튜브" }, { name: "인스타그램" }, { name: "페이스북" }],
  },
  {
    label: "다운로드",
    items: [{ name: "안드로이드" }, { name: "iOS" }],
  },
  {
    label: "도담도담",
    items: [
      { name: "활동" },
      { name: "게시물" },
      { name: "내정보" },
      { name: "일정" },
    ],
  },
];
