import { FolderIcon, LockIcon, ProfileIcon } from '@assets/icons';
import classNames from 'classnames';
import { Link, NavLink } from 'react-router-dom';

function NavList() {
  const links = [
    {
      to: '/data',
      icon: <FolderIcon />,
    },
    // {
    //   to: '/algorithms',
    //   icon: <DeveloperIcon />,
    // },
    {
      to: '/monitor-access',
      icon: <LockIcon />,
    },
    {
      to: '/profile',
      icon: <ProfileIcon />,
    },
  ];

  return (
    <ul className="flex flex-col gap-[40px]">
      {links.map((item, i) => (
        <li key={i}>
          <NavLink to={item.to}>
            {({ isActive }) => (
              <div
                className={classNames(
                  'text-[#7B8290] text-[16px] hover:text-blue',
                  {
                    '!text-blue': isActive,
                  }
                )}
              >
                <div className="h-[24px]">{item.icon}</div>
              </div>
            )}
          </NavLink>
        </li>
      ))}
    </ul>
  );
}

function SideNavigation() {
  return (
    <div
      id="side-navigation"
      className="flex flex-col justify-between p-[30px]"
    >
      <div>
        <Link to="/data">
          <img src="./fishnet.png" alt="Robotter PNG" width={36} />
        </Link>
        <nav className="mt-[56px]">
          <NavList />
        </nav>
      </div>
    </div>
  );
}

export default SideNavigation;
