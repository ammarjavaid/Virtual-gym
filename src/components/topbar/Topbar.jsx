import React, { useEffect, useState } from 'react';
import './topbar.scss';
import { Arrow_Left, Arrow_Right, Msg, Msg_Top, Profile } from '../../assets';
import { Breadcrumb, Button, Drawer } from 'antd';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { HiOutlineBars4 } from 'react-icons/hi2';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../../Redux/actions/AuthActions';
import Sticky from 'react-stickynode';
import usePermissionCheck from '../../../utils/usePermissionCheck';

const Topbar = ({
  title,
  setAuth,
  arrow,
  titleOne,
  titleTwo,
  onNavigate,
  backLink
}) => {
  const user = useSelector(state => state.auth.userData);
  const [activeTab, setActiveTab] = useState('Dashboard');
  const [open, setOpen] = useState(false);

  // console.log(user, "user");

  const handleTabClick = tab => {
    setActiveTab(tab);
    setOpen(false);
  };

  const dispatch = useDispatch();
  const handleLogoutClick = () => {
    dispatch(logout());
  };

  const naviagte = useNavigate();

  const [scrolling, setScrolling] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setScrolling(true);
      } else {
        setScrolling(false);
      }
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const handleNavigation = () => {
    naviagte(backLink ? backLink : -1);
  };

  // const topbar = scrolling ? "navbar scrolled" : "navbar";

  //----------------------Drawer---------------------------
  const [placement, setPlacement] = useState('left');
  const showDrawer = () => {
    setOpen(true);
  };
  const onClose = () => {
    setOpen(false);
  };
  const onChange = e => {
    setPlacement(e.target.value);
  };

  const { checkPermission } = usePermissionCheck();

  //--------------------Drawer----------------------------

  return (
    <>
      <div className='sticky-topbar'>
        <Sticky top={24} innerZ={100}>
          <div
            className={
              scrolling ? 'topbar sticky-outer-wrapper scrolled' : 'topbar'
            }
          >
            <div
              className={
                scrolling
                  ? 'topbar__content tabbar-scrolling'
                  : 'topbar__content'
              }
            >
              {arrow ? (
                <>
                  <div className='topbar__content__left'>
                    <img src={Arrow_Left} alt='' onClick={handleNavigation} />
                    <div className='title_breadcrumb'>
                      <h3> {title} </h3>
                      <Breadcrumb
                        items={[
                          {
                            title: titleOne
                          },
                          {
                            title: titleTwo
                          }
                        ]}
                      />
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <div className='topbar__content__left'>
                    <h3> {title} </h3>
                  </div>
                </>
              )}

              <div className='topbar__content__right'>
                <div
                  className='mesg-icon'
                  onClick={() => naviagte('/messages')}
                >
                  <img src={Msg_Top} alt='' />
                </div>
                <div className='profileWrapper'>
                  <img
                    src={user?.profile_image ? user?.profile_image : Profile}
                    alt=''
                    onClick={() => naviagte('/my-account')}
                  />
                </div>

                <p onClick={showDrawer} className='icons'>
                  <HiOutlineBars4 />
                </p>
              </div>
            </div>
          </div>
        </Sticky>
      </div>
      <div className='drawer'>
        <Drawer
          title='DaruStrong'
          placement={placement}
          closable={false}
          onClose={onClose}
          open={open}
          key={placement}
          className='drawer'
        >
          <img
            src={user?.profile_image ? user?.profile_image : Profile}
            onClick={() => naviagte('/my-account')}
            alt=''
          />
          <ul className='list-items-sidebar'>
            {checkPermission('dashboard').status && (
              <NavLink to='/dashboard'>
                <li>Dashboard</li>
              </NavLink>
            )}
            {checkPermission('client').status && (
              <NavLink to='/client'>
                <li>Custom coaching clients</li>
              </NavLink>
            )}
            {checkPermission('library').status && (
              <NavLink to='/library'>
                <li>Library</li>
              </NavLink>
            )}
            {checkPermission('gallery-videos').status && (
              <NavLink to='/gallery-videos'>
                <li>Exercise Videos</li>
              </NavLink>
            )}
            {checkPermission('workout-program').status && (
              <NavLink to='/workout-program'>
                <li>Workout programs</li>
              </NavLink>
            )}
            {checkPermission('messages').status && (
              <NavLink to='/messages'>
                <li>Messages</li>
              </NavLink>
            )}
            {checkPermission('app-members').status && (
              <NavLink to='/app-members'>
                <li>App Members</li>
              </NavLink>
            )}
            {checkPermission('contact-request').status && (
              <NavLink to='/contact-request'>
                <li>Contact Request</li>
              </NavLink>
            )}
            {checkPermission('skills-training').status && (
              <NavLink to='/skills-training'>
                <li>Skills training</li>
              </NavLink>
            )}
            {checkPermission('role-permission').status && (
              <NavLink to='/role-permission'>
                <li>Roles & Permissions</li>
              </NavLink>
            )}
            {checkPermission('coaches-team-member').status && (
              <NavLink to='/coaches-team-member'>
                <li>Coaches or Team member</li>
              </NavLink>
            )}
          </ul>
          <p onClick={handleLogoutClick}> Logout </p>
        </Drawer>
      </div>
    </>
  );
};

export default Topbar;
