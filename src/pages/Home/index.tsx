
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Input } from "@/components/ui/input"
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Icons } from '@/components/Icons'

import {
  Plus,
  PlusCircle,
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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"


const Home = () => {
  const nbProfiles = 5;

  const profiles = [];
  for (let i = 0; i < nbProfiles; i++) {
    profiles.push(
      <Label
        key={i}
        htmlFor={`profile-${i}`}
        className='reltive glass cursor-pointer flex flex-col items-center justify-between rounded-md border-muted bg-popover p-4 py-5 hover:bg-accent hover:text-accent-foreground [&:has([data-state=checked])]:bg-primary'
      >
        <Dialog>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className='absolute outline-none p-2 top-0 right-0 flex items-center justify-center'>
                <Icons.dots className='h-4 w-4' />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56">
              <DropdownMenuGroup>
                <DialogTrigger asChild>
                  <DropdownMenuItem>
                    <Pen className="mr-2 h-4 w-4" />
                    <span>Update</span>
                  </DropdownMenuItem>
                </DialogTrigger>
                 
                <DropdownMenuItem>
                  <Trash className="mr-2 h-4 w-4" />
                  <span>Delete</span>
                </DropdownMenuItem>
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>

          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Update profile</DialogTitle>
              <DialogDescription>
                Update the profile name.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="flex flex-col gap-3">
                <Label htmlFor="name">
                  Name
                </Label>
                <Input id="name" className="col-span-3" />
              </div>
            </div>
            <DialogFooter>
              <Button type="submit">Save</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
        <RadioGroupItem value={`profile-${i}`} id={`profile-${i}`} className='sr-only' />

        <Icons.lol className='mb-3 h-6 w-6' />
        Profile {i + 1}
      </Label>
    );
  }

  return (
    <>
      <Card className='font-sans border-0 shadow-none'>
        <CardHeader>
          <CardTitle className='main-title'>
            Manage<br/>your profiles !
          </CardTitle>
          <CardDescription>
            Add a new profile config to your account.
          </CardDescription>
        </CardHeader>
        <CardContent className='grid gap-6'>
          <div className='flex justify-end gap-3'>
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
                <div className="grid gap-4 pt-4">
                  <div className="flex flex-col gap-3">
                    <Label htmlFor="name">
                      Name
                    </Label>
                    <Input id="name" className="col-span-3" />
                  </div>
                </div>
                <DialogFooter>
                  <Button type="submit">Save</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>

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
          <RadioGroup defaultValue='card' className='grid grid-cols-3 gap-3'>
            {profiles}
          </RadioGroup>
        </CardContent>
      </Card>
      <div className='glass mt-auto p-5 border-t border-gray-200 ctm-shadow'>
        <Button className='w-full'>Export to League of Legends</Button>
      </div>
    </>
  )
}

export default Home;
