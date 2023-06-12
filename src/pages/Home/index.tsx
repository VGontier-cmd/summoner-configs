import { useRef, useState, useEffect } from 'react';
import { ipcRenderer } from 'electron';
import { Profile } from 'electron/main/modules/profile-manager/profile.interface'

import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Input } from "@/components/ui/input"
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Icons } from '@/components/Icons'

import {
  Plus,
  Settings,
  Pen,
  Trash,
} from "lucide-react"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

import NewProfile from '@/layouts/Profiles/New'
import ListProfile from '@/layouts/Profiles/List'

const Home = () => {

  const [profiles, setProfiles] = useState<Profile[]>([]);

  useEffect(() => {
    ipcRenderer.invoke('ipcmain-profile-get-all').then((result) => {
      setProfiles(result);
    }).catch((error) => {
      console.log('Error retrieving profiles:', error);
    });
  }, []);

  return (
    <>
      <div className='overflow-y-auto'>
        <Card className='font-sans border-0 shadow-none'>
          <CardHeader>
            <CardTitle className='main-title text-primary'>
              Manage<br/>your profiles !
            </CardTitle>
            <CardDescription>
              Add a new profile config to your account.
            </CardDescription>
          </CardHeader>
          <CardContent className='grid gap-6 pb-8'>
            <div className='flex items-end justify-between gap-3'>
              <span className='text-sm text-muted text-primary'>{profiles.length} profiles</span>
              <div className='flex justify-end gap-3'>
                <NewProfile />

                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant='outline'>
                      <Settings className="h-4 w-4" />
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                      <DialogTitle>Settings</DialogTitle>
                      <DialogDescription>
                        Enter your config file path.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 pt-4">
                      <div className="flex flex-col gap-3">
                        <Label htmlFor="name">
                          Path
                        </Label>
                        <Input id="name" className="col-span-3" />
                      </div>
                    </div>
                    <DialogFooter>
                      <Button type="submit">Save</Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
            </div>
            <ListProfile />
          </CardContent>
        </Card>
      </div>
      <div className='footer relative h-[5rem] mt-auto p-5'>
        <div className='footer__circle'></div>
        <div className='footer__bg'></div>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button className='footer__btn rounded-circle'>Export profile</Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you absolutely sure ?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will load your selected profile settings to your League of Legends client.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction>Continue</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </>
  )
}

export default Home;
