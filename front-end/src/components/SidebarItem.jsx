import React from "react";
import SidebarLinkGroup from "./dashboard/SidebarLinkGroup";
import Transition from '../utils/Transition';

function SidebarItem({
  activeCondition,
  title,
  icon,
  onMenuClick,
  onExpandSidebar,
  subMenuItems = [],
}) {
  return (
    <SidebarLinkGroup activecondition={activeCondition}> 
      {(handleClick, open) => {
        return (
          <React.Fragment>
            <button
              type="button"
              className={`block w-full text-gray-800 dark:text-gray-100 truncate transition duration-150 ${
                activeCondition ? "" : "hover:text-gray-900 dark:hover:text-white"
              }`}
              onClick={(e) => {
                e.preventDefault();
                handleClick();
                if (onExpandSidebar) onExpandSidebar(true);
                if (onMenuClick) onMenuClick();
              }}
              tabIndex={0}
              aria-label={`${title} menu`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  {/* Icon */}
                  {icon ? (
                    <div className={`shrink-0 fill-current ${
                      activeCondition ? 'text-violet-500' : 'text-gray-400 dark:text-gray-500'
                    }`}>
                      {icon}
                    </div>
                  ) : null}
                  <span className="text-sm font-medium ml-4 lg:opacity-0 lg:sidebar-expanded:opacity-100 2xl:opacity-100 duration-200">
                    {title}
                  </span>
                </div>
                {/* Dropdown arrow */}
                <div className="flex shrink-0 ml-2">
                  <svg className={`w-3 h-3 shrink-0 ml-1 fill-current text-gray-400 dark:text-gray-500 ${open && "rotate-180"}`} viewBox="0 0 12 12">
                    <path d="M5.9 11.4L.5 6l1.4-1.4 4 4 4-4L11.3 6z" />
                  </svg>
                </div>
              </div>
            </button>

            <div className="lg:hidden lg:sidebar-expanded:block 2xl:block">
              <Transition
                show={open}
                enter="transition ease-out duration-200 transform"
                enterStart="opacity-0 -translate-y-2"
                enterEnd="opacity-100 translate-y-0"
                leave="transition ease-in duration-150"
                leaveStart="opacity-100 translate-y-0"
                leaveEnd="opacity-0 -translate-y-2"
              >
                <ul className="pl-8 mt-1">
                  {subMenuItems.map((item, index) => (
                    <li key={index} className="mb-1 last:mb-0">
                      <button
                        type="button"
                        className={`block w-full text-gray-800 dark:text-gray-100 truncate transition duration-150 hover:text-gray-900 dark:hover:text-white${item.isActive ? ' text-violet-500' : ''}`}
                        onClick={(e) => {
                          e.preventDefault();
                          if (onExpandSidebar) onExpandSidebar(true);
                          if (item.onClick) item.onClick();
                        }}
                        tabIndex={0}
                        aria-label={item.ariaLabel || `${title} submenu item`}
                      >
                        <div className="flex items-center">
                          <span className="text-sm font-medium ml-4 lg:opacity-0 lg:sidebar-expanded:opacity-100 2xl:opacity-100 duration-200">
                            {item.label}
                          </span>
                        </div>
                      </button>
                    </li>
                  ))}
                </ul>
              </Transition>
            </div>
          </React.Fragment>
        );
      }}
    </SidebarLinkGroup>
  );
}

export default SidebarItem;