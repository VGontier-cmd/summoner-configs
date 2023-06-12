import { useRef } from 'react';
import { ipcRenderer } from 'electron';

import {
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

import { Profile } from 'electron/main/modules/profile-manager/profile.interface';
import Form from './Form'

interface UpdateProps {
  profile: Profile;
}

const Edit = ({ profile }: UpdateProps) => {
  const nameRef = useRef<HTMLInputElement>(null);

  console.log('profile : ' + profile.name)

  const handleUpdateProfile =(event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (nameRef.current) {
      const profileDto = {
        name: nameRef.current.value,
      };
  
      ipcRenderer
        .invoke('ipcmain-profile-update', profile.id, profileDto)
        .then((result) => {
          console.log(result);
          window.location.reload();
        })
        .catch((error) => {
          console.error(error);
        });
    }
  };

	return (
		<>
			<DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Update profile</DialogTitle>
          <DialogDescription>Update the profile name.</DialogDescription>
        </DialogHeader>
        <Form profile={profile} nameRef={nameRef} onSubmit={handleUpdateProfile} />
      </DialogContent>
		</>
	);
};

export default Edit;