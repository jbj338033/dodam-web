import { FOOTER_MENUS } from "./types";

const MenuSection = () => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
      {FOOTER_MENUS.map((menu) => (
        <div key={menu.label}>
          <h3 className="text-sm font-medium text-slate-200 mb-3">
            {menu.label}
          </h3>
          <ul className="space-y-2">
            {menu.items.map((item) => (
              <li key={item.name}>
                <a
                  href={item.href}
                  className="text-sm text-slate-400 hover:text-slate-300 transition-colors"
                >
                  {item.name}
                </a>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
};

export default MenuSection;
