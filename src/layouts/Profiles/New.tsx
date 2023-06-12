import { useRef } from 'react';
import { ipcRenderer } from 'electron';

import { Button } from '@/components/ui/button'

import { Plus } from "lucide-react"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

import Form from './Form'

const New = () => {
  const nameRef = useRef<HTMLInputElement>(null);

  const handleNewProfile =(event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (nameRef.current) {
      const name = nameRef.current.value;
    
      const profileDto = {
        name: name,
      };
    
      ipcRenderer
        .invoke('ipcmain-profile-create', profileDto)
        .then((result) => {
          window.location.reload();
        })
        .catch((error) => {
          console.error(error); 
        });
    }
  };

	return (
		<>
			<Dialog>
        <DialogTrigger asChild>
          <Button>
            <Plus className="h-4 w-4" />
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Add Profile</DialogTitle>
            <DialogDescription>
              Add a name to your new profile.
            </DialogDescription>
          </DialogHeader>
          <Form profile={null} nameRef={nameRef} onSubmit={handleNewProfile} />
        </DialogContent>
      </Dialog>
		</>
	);
};

export default New;