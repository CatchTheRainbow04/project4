import React, { use } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import SidebarLinkGroup from "./dashboard/SidebarLinkGroup";
import Transition from "../utils/Transition";

function SidebarItem({ activeCondition, title, icon, subMenuItems = [], to }) {
  const navigate = useNavigate();
  // If it's a single link (no submenu)
  if (to && subMenuItems.length === 0) {
    return (
      <li
        className={`pl-4 pr-3 py-2 rounded-lg mb-0.5 last:mb-0 bg-linear-to-r ${
          activeCondition &&
          "from-violet-500/[0.12] dark:from-violet-500/[0.24] to-violet-500/[0.04]"
        }`}
      >
        <NavLink
          to={to}
          className={({ isActive }) =>
            `block w-full text-gray-800 dark:text-gray-100 truncate transition duration-150 ${
              isActive ? "" : "hover:text-gray-900 dark:hover:text-white"
            }`
          }
        >
          <div className="flex items-center">
            {/* Icon */}
            {icon && (
              <div
                className={`shrink-0 fill-current ${
                  activeCondition
                    ? "text-violet-500"
                    : "text-gray-400 dark:text-gray-500"
                }`}
              >
                {icon}
              </div>
            )}
            <span className="text-sm font-medium ml-4 lg:opacity-0 lg:sidebar-expanded:opacity-100 2xl:opacity-100 duration-200">
              {title}
            </span>
          </div>
        </NavLink>
      </li>
    );
  }

  // If it has submenu items
  return (
    <SidebarLinkGroup activecondition={activeCondition} navigateTo={to}>
      {(handleClick, open) => (
        <>
          <button
            role="button"
            className={`block w-full text-left cursor-pointer text-gray-800 dark:text-gray-100 truncate transition duration-150 ${
              activeCondition ? "" : "hover:text-gray-900 dark:hover:text-white"
            }`}
            onClick={() => {
              navigate(to);
              handleClick();
            }}
            tabIndex={0}
            aria-label={`${title} menu`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                {/* Icon */}
                {icon && (
                  <div
                    className={`shrink-0 fill-current ${
                      activeCondition
                        ? "text-violet-500"
                        : "text-gray-400 dark:text-gray-500"
                    }`}
                  >
                    {icon}
                  </div>
                )}
                <span className="text-sm font-medium ml-4 lg:opacity-0 lg:sidebar-expanded:opacity-100 2xl:opacity-100 duration-200">
                  {title}
                </span>
              </div>
              {/* Arrow */}
              <div className="flex shrink-0 ml-2">
                <svg
                  className={`w-3 h-3 shrink-0 ml-1 fill-current text-gray-400 dark:text-gray-500 ${
                    open && "rotate-180"
                  }`}
                  viewBox="0 0 12 12"
                >
                  <path d="M5.9 11.4L.5 6l1.4-1.4 4 4 4-4L11.3 6z" />
                </svg>
              </div>
            </div>
          </button>

          {/* Submenu */}
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
                    <NavLink
                      to={item.to}
                      end
                      className={({ isActive }) =>
                        `block text-sm font-medium text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 py-1 ${
                          isActive ? "text-violet-500 dark:text-violet-400" : ""
                        }`
                      }
                    >
                      {item.label}
                    </NavLink>
                  </li>
                ))}
              </ul>
            </Transition>
          </div>
        </>
      )}
    </SidebarLinkGroup>
  );
}

export default SidebarItem;
