import { memo } from "react";

interface MenuItem {
  name: string;
  href: string;
}

interface Menu {
  label: string;
  items: MenuItem[];
}

const FOOTER_MENUS: Menu[] = [
  {
    label: "안내",
    items: [
      { name: "개인정보처리방침", href: "/privacy" },
      { name: "운영정책", href: "/policy" },
      { name: "이용약관", href: "/terms" },
    ],
  },
  {
    label: "소셜",
    items: [
      { name: "유튜브", href: "https://www.youtube.com/@b1ndteam" },
      { name: "인스타그램", href: "https://www.instagram.com/dgsw.it" },
      { name: "페이스북", href: "https://www.facebook.com/dgsw.hs.kr" },
    ],
  },
  {
    label: "도담도담",
    items: [
      { name: "일정", href: "/schedule" },
      { name: "기상송", href: "/wakeup-song" },
      { name: "내정보", href: "/profile" },
      { name: "잇맵", href: "/itmap" },
    ],
  },
];

interface MenuItemProps {
  item: MenuItem;
}

const MenuItemComponent = memo(({ item }: MenuItemProps) => (
  <li>
    <a
      href={item.href}
      className="text-sm text-slate-400 hover:text-slate-300 transition-colors"
      target={item.href.startsWith("http") ? "_blank" : undefined}
      rel={item.href.startsWith("http") ? "noopener noreferrer" : undefined}
    >
      {item.name}
    </a>
  </li>
));

MenuItemComponent.displayName = "MenuItemComponent";

interface MenuGroupProps {
  menu: Menu;
}

const MenuGroup = memo(({ menu }: MenuGroupProps) => (
  <div>
    <h3 className="text-sm font-medium text-slate-200 mb-3">{menu.label}</h3>
    <ul className="space-y-2" role="list">
      {menu.items.map((item) => (
        <MenuItemComponent key={item.name} item={item} />
      ))}
    </ul>
  </div>
));

MenuGroup.displayName = "MenuGroup";

const MenuSection = memo(() => {
  return (
    <nav aria-label="Footer Navigation">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
        {FOOTER_MENUS.map((menu) => (
          <MenuGroup key={menu.label} menu={menu} />
        ))}
      </div>
    </nav>
  );
});

MenuSection.displayName = "MenuSection";

export default MenuSection;
