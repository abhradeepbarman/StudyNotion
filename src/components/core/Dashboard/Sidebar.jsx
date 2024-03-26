import React, { useState } from 'react'
import { sidebarLinks } from '../../../data/dashboard-links'
import { logout } from '../../../services/operations/authAPI'
import { useDispatch, useSelector } from 'react-redux'
import SidebarLink from './SidebarLink'
import { useNavigate } from 'react-router-dom'
import { VscSignOut } from "react-icons/vsc";
import ConfirmationModal from '../../common/ConfirmationModal'

function Sidebar() {

    const {user, loading: profileLoading} = useSelector((state) => state.profile) 
    const {loading: authLoading} = useSelector((state) => state.auth)
    const navigate = useNavigate()
    const dispatch = useDispatch()

    const [confirmationModal, setConfirmationModal] = useState(null)

    if(authLoading || profileLoading) {
        return (
            <div className='spinner mt-12'></div>
        )
    }

  return (
    <div>
        <div className='flex min-w-[222px] flex-col border-r-[1px] border-r-richblack-700 h-[calc(100vh-3.5rem)] bg-richblack-800 py-10'>
            <div className='flex flex-col'>
                {
                    sidebarLinks.map((link) => {
                        if(link?.type && user?.accountType !== link?.type)  return null;

                        return (
                            <SidebarLink key={link?.id} link={link} iconName={link?.icon} />
                        )
                    })
                }
            </div>

            <div className='mx-auto mt-6 mb-6 h-[1px] w-10/12 bg-richblack-700'></div>

            <div className='flex flex-col'>
                <SidebarLink
                    link={{
                        name: "Settings",
                        path: "/dashboard/settings",
                    }}

                    iconName={"VscSettingsGear"}
                 />

                <button 
                onClick={() => setConfirmationModal({
                    text1: "Are You Sure?",
                    text2: "you will be logged out!",
                    btn1Text: "Log Out",
                    btn2Text: "Cancel",
                    btn1Handler: () => dispatch(logout(navigate)),
                    btn2Handler: () => setConfirmationModal(null),
                }) }
                className='text-sm font-medium text-richblack-300'
                >
                    <div className='flex flex-row items-center gap-x-2 px-8 py-2 text-lg font-medium'>
                        <VscSignOut className='text-lg' />
                        <span>Logout</span>
                    </div>
                </button>
            </div>
        </div>

        {
            confirmationModal &&
                <ConfirmationModal modalData={confirmationModal} />
        }
    </div>
  )
}

export default Sidebar