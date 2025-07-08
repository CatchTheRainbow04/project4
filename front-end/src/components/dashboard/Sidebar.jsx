import React, { useState, useEffect, useRef } from "react";
import { NavLink, useLocation } from "react-router-dom";
import SidebarItem from "../../components/SidebarItem";

function Sidebar({
  sidebarOpen,
  setSidebarOpen,
  variant = "default",
  onShowCategories,
  onShowMenu,
  onShowProducts,
  onShowPermissions,
  onShowSliders,
  onShowRoles,
  onShowUsers,
  onShowTags,
}) {
  const location = useLocation();
  const { pathname } = location;

  const trigger = useRef(null);
  const sidebar = useRef(null);

  const storedSidebarExpanded = localStorage.getItem("sidebar-expanded");
  const [sidebarExpanded, setSidebarExpanded] = useState(
    storedSidebarExpanded === null ? false : storedSidebarExpanded === "true"
  );

  // Đóng sidebar khi click ra ngoài
  useEffect(() => {
    const clickHandler = ({ target }) => {
      if (!sidebar.current || !trigger.current) return;
      if (
        !sidebarOpen ||
        sidebar.current.contains(target) ||
        trigger.current.contains(target)
      )
        return;
      setSidebarOpen(false);
    };
    document.addEventListener("click", clickHandler);
    return () => document.removeEventListener("click", clickHandler);
  });

  // Đóng sidebar khi nhấn phím ESC
  useEffect(() => {
    const keyHandler = ({ keyCode }) => {
      if (!sidebarOpen || keyCode !== 27) return;
      setSidebarOpen(false);
    };
    document.addEventListener("keydown", keyHandler);
    return () => document.removeEventListener("keydown", keyHandler);
  });

  useEffect(() => {
    localStorage.setItem("sidebar-expanded", sidebarExpanded);
    if (sidebarExpanded) {
      document.querySelector("body").classList.add("sidebar-expanded");
    } else {
      document.querySelector("body").classList.remove("sidebar-expanded");
    }
  }, [sidebarExpanded]);

  return (
    <div className="min-w-fit">
      {/* Nền mờ phía sau sidebar (chỉ hiển thị trên mobile) */}
      <div
        className={`fixed inset-0 bg-gray-900/30 z-40 lg:hidden lg:z-auto transition-opacity duration-200 ${
          sidebarOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        aria-hidden="true"
      ></div>

      {/* Sidebar */}
      <div
        id="sidebar"
        ref={sidebar}
        className={`flex lg:flex! flex-col absolute z-40 left-0 top-0 lg:static lg:left-auto lg:top-auto lg:translate-x-0 h-[100dvh] overflow-y-scroll lg:overflow-y-auto no-scrollbar w-64 lg:w-20 lg:sidebar-expanded:!w-64 2xl:w-64! shrink-0 bg-white dark:bg-gray-800 p-4 transition-all duration-200 ease-in-out ${
          sidebarOpen ? "translate-x-0" : "-translate-x-64"
        } ${
          variant === "v2"
            ? "border-r border-gray-200 dark:border-gray-700/60"
            : "rounded-r-2xl shadow-xs"
        }`}
      >
        {/* Header của sidebar */}
        <div className="flex justify-between mb-10 pr-3 sm:px-2">
          {/* Nút đóng sidebar */}
          <button
            ref={trigger}
            className="lg:hidden text-gray-500 hover:text-gray-400"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            aria-controls="sidebar"
            aria-expanded={sidebarOpen}
          >
            <span className="sr-only">Close sidebar</span>
            <svg
              className="w-6 h-6 fill-current"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M10.7 18.7l1.4-1.4L7.8 13H20v-2H7.8l4.3-4.3-1.4-1.4L4 12z" />
            </svg>
          </button>
          {/* Logo */}
          <NavLink end to="/dashboard" className="block">
            <svg
              className="fill-violet-500"
              xmlns="http://www.w3.org/2000/svg"
              width={32}
              height={32}
            >
              <path d="M31.956 14.8C31.372 6.92 25.08.628 17.2.044V5.76a9.04 9.04 0 0 0 9.04 9.04h5.716ZM14.8 26.24v5.716C6.92 31.372.63 25.08.044 17.2H5.76a9.04 9.04 0 0 1 9.04 9.04Zm11.44-9.04h5.716c-.584 7.88-6.876 14.172-14.756 14.756V26.24a9.04 9.04 0 0 1 9.04-9.04ZM.044 14.8C.63 6.92 6.92.628 14.8.044V5.76a9.04 9.04 0 0 1-9.04 9.04H.044Z" />
            </svg>
          </NavLink>
        </div>

        {/* Danh sách liên kết (Links) */}
        <div className="space-y-8">
          <div>
            <h3 className="text-xs uppercase text-gray-400 dark:text-gray-500 font-semibold pl-3">
              <span
                className="hidden lg:block lg:sidebar-expanded:hidden 2xl:hidden text-center w-6"
                aria-hidden="true"
              >
                •••
              </span>
              <span className="lg:hidden lg:sidebar-expanded:block 2xl:block">
                Pages
              </span>
            </h3>
            <ul className="mt-3">
              {/* Category */}
              <SidebarItem
                activeCondition={pathname.includes("/dashboard")}
                title="Category"
                icon={
                  <svg
                    className="shrink-0"
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    fill="currentColor"
                    viewBox="0 0 16 16"
                  >
                    <path d="M2 2h4v4H2V2zm0 6h4v4H2V8zm6-6h4v4H8V2zm0 6h4v4H8V8z" />
                  </svg>
                }
                onMenuClick={onShowMenu}
                onExpandSidebar={() => setSidebarExpanded(true)}
                subMenuItems={[
                  {
                    label: "List of categories",
                    onClick: () => onShowCategories && onShowCategories(),
                    isActive: Boolean(onShowCategories),
                    ariaLabel: "Categories menu",
                  },
                  {
                    label: "Add new categories",
                    onClick: () =>
                      onShowCategories && onShowCategories("categoryForm"),
                    isActive: Boolean(onShowCategories),
                    ariaLabel: "Categories menu",
                  },
                ]}
              />

              {/* Products */}
              <SidebarItem
                activeCondition={pathname.includes("/dashboard")}
                title="Products"
                icon={
                  <svg
                    className="shrink-0"
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 16 16"
                  >
                    <path d="M8 1a2.5 2.5 0 0 1 2.5 2.5V4h-5v-.5A2.5 2.5 0 0 1 8 1zm3.5 3v-.5a3.5 3.5 0 1 0-7 0V4H1v10a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V4h-3.5zM2 5h12v9a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V5z" />
                  </svg>
                }
                onMenuClick={onShowMenu}
                onExpandSidebar={() => setSidebarExpanded(true)}
                subMenuItems={[
                  {
                    label: "List of products",
                    onClick: () => onShowProducts && onShowProducts(),
                    isActive: Boolean(onShowProducts),
                    ariaLabel: "Products menu",
                  },
                  {
                    label: "Add new product",
                    onClick: () =>
                      onShowProducts && onShowProducts("productForm"),
                    isActive: Boolean(onShowProducts),
                    ariaLabel: "Products menu",
                  },
                ]}
              />

              {/* Permissions */}
              <SidebarItem
                activeCondition={pathname.includes("/dashboard")}
                title="Permissions"
                icon={
                  <svg
                    className="shrink-0"
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 16 16"
                  >
                    <path d="M8 1a2 2 0 0 1 2 2v4H6V3a2 2 0 0 1 2-2zm3 6V3a3 3 0 0 0-6 0v4a2 2 0 0 0-2 2v5a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2z" />
                  </svg>
                }
                onMenuClick={onShowMenu}
                onExpandSidebar={() => setSidebarExpanded(true)}
                subMenuItems={[
                  {
                    label: "List of permissions",
                    onClick: () => onShowPermissions && onShowPermissions(),
                    isActive: Boolean(onShowPermissions),
                    ariaLabel: "Permissions menu",
                  },
                  {
                    label: "Add new permission",
                    onClick: () =>
                      onShowPermissions && onShowPermissions("permissionForm"),
                    isActive: Boolean(onShowPermissions),
                    ariaLabel: "Permissions menu",
                  },
                ]}
              />

              {/* Sliders */}
              <SidebarItem
                activeCondition={pathname.includes("/dashboard")}
                title="Sliders"
                icon={
                  <svg
                    className="shrink-0"
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 16 16"
                  >
                    <path d="M6 2a.5.5 0 0 1 .47.33L10 12.036l1.53-4.208A.5.5 0 0 1 12 7.5h3.5a.5.5 0 0 1 0 1h-3.15l-1.88 5.17a.5.5 0 0 1-.94 0L6 3.964 4.47 8.171A.5.5 0 0 1 4 8.5H.5a.5.5 0 0 1 0-1h3.15l1.88-5.17A.5.5 0 0 1 6 2Z" />
                  </svg>
                }
                onMenuClick={onShowMenu}
                onExpandSidebar={() => setSidebarExpanded(true)}
                subMenuItems={[
                  {
                    label: "List of sliders",
                    onClick: () => onShowSliders && onShowSliders(),
                    isActive: Boolean(onShowSliders),
                    ariaLabel: "Sliders menu",
                  },
                  {
                    label: "Add new slider",
                    onClick: () => onShowSliders && onShowSliders("sliderForm"),
                    isActive: Boolean(onShowSliders),
                    ariaLabel: "Sliders menu",
                  },
                ]}
              />

              {/* Roles */}
              <SidebarItem
                activeCondition={pathname.includes("/dashboard")}
                title="Roles"
                icon={
                  <svg
                    className="shrink-0"
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 16 16"
                  >
                    <path d="M6 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm-5 6s-1 0-1-1 1-4 6-4 6 3 6 4-1 1-1 1H1zM11 3.5a.5.5 0 0 1 .5-.5h4a.5.5 0 0 1 0 1h-4a.5.5 0 0 1-.5-.5zm.5 2.5a.5.5 0 0 0 0 1h4a.5.5 0 0 0 0-1h-4zm2 3a.5.5 0 0 0 0 1h2a.5.5 0 0 0 0-1h-2zm0 3a.5.5 0 0 0 0 1h2a.5.5 0 0 0 0-1h-2z" />
                  </svg>
                }
                onMenuClick={onShowMenu}
                onExpandSidebar={() => setSidebarExpanded(true)}
                subMenuItems={[
                  {
                    label: "List of roles",
                    onClick: () => onShowRoles && onShowRoles(),
                    isActive: Boolean(onShowRoles),
                    ariaLabel: "Roles menu",
                  },
                  {
                    label: "Add new role",
                    onClick: () => onShowRoles && onShowRoles("roleForm"),
                    isActive: Boolean(onShowRoles),
                    ariaLabel: "Roles menu",
                  },
                ]}
              />
              {/* Users */}
              <SidebarItem
                activeCondition={pathname.includes("/dashboard")}
                title="Users"
                icon={
                  <svg
                    className="shrink-0"
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 16 16"
                  >
                    <path d="M8 1a2 2 0 1 1 0 4 2 2 0 0 1 0-4zm3.5 6a3.5 3.5 0 1 1-7 0A3.5 3.5 0 0 1 11.5 7zM8.5 9a4.5 4.5 0 1 1-9 0A4.5 4.5 0 0 1 8.5 9z" />
                  </svg>
                }
                onMenuClick={onShowMenu}
                onExpandSidebar={() => setSidebarExpanded(true)}
                subMenuItems={[
                  {
                    label: "List of users",
                    onClick: () => onShowUsers && onShowUsers(),
                    isActive: Boolean(onShowUsers),
                    ariaLabel: "Users menu",
                  },
                  {
                    label: "Add new user",
                    onClick: () => onShowUsers && onShowUsers("userForm"),
                    isActive: Boolean(onShowUsers),
                    ariaLabel: "Users menu",
                  },
                ]}
              />
              {/* Tags */}
              <SidebarItem
                activeCondition={pathname.includes("/dashboard")}
                title="Tags"
                icon={
                  <svg
                    className="shrink-0"
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    fill="currentColor"
                    viewBox="0 0 16 16"
                  >
                    <path d="M2 2v4.586l5.293 5.293a1 1 0 0 0 1.414 0L14 6.586V2H2zm1 1h9v3.586l-4.293 4.293L3 4.586V3z" />
                    <path d="M5.5 5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0z" />
                  </svg>
                }
                onMenuClick={onShowMenu}
                onExpandSidebar={() => setSidebarExpanded(true)}
                subMenuItems={[
                  {
                    label: "List of tags",
                    onClick: () => onShowTags && onShowTags(),
                    isActive: Boolean(onShowTags),
                    ariaLabel: "Tags menu",
                  },
                  {
                    label: "Add new tag",
                    onClick: () => onShowTags && onShowTags("tagForm"),
                    isActive: Boolean(onShowTags),
                    ariaLabel: "Tags menu",
                  },
                ]}
              />
            </ul>
          </div>
        </div>

        {/* Expand / collapse button */}
        <div className="pt-3 hidden lg:inline-flex 2xl:hidden justify-end mt-auto">
          <div className="w-12 pl-4 pr-3 py-2">
            <button
              className="text-gray-400 hover:text-gray-500 dark:text-gray-500 dark:hover:text-gray-400"
              onClick={() => setSidebarExpanded(!sidebarExpanded)}
            >
              <span className="sr-only">Expand / collapse sidebar</span>
              <svg
                className="shrink-0 fill-current text-gray-400 dark:text-gray-500 sidebar-expanded:rotate-180"
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 16 16"
              >
                <path d="M15 16a1 1 0 0 1-1-1V1a1 1 0 1 1 2 0v14a1 1 0 0 1-1 1ZM8.586 7H1a1 1 0 1 0 0 2h7.586l-2.793 2.793a1 1 0 1 0 1.414 1.414l4.5-4.5A.997.997 0 0 0 12 8.01M11.924 7.617a.997.997 0 0 0-.217-.324l-4.5-4.5a1 1 0 0 0-1.414 1.414L8.586 7M12 7.99a.996.996 0 0 0-.076-.373Z" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Sidebar;
