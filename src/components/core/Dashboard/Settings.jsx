import React from 'react'
import ChangeProfilePicture from './ChangeProfilePicture'
import EditProfile from './EditProfile'
import ChangePassword from './ChangePassword'
import DeleteAccount from './DeleteAccount'


function Settings() {
  return (
    <div>
      <h1>Edit Profile</h1>
      
      <ChangeProfilePicture />
      <EditProfile />
      <ChangePassword />
      <DeleteAccount />
    </div>
  )
}

export default Settings