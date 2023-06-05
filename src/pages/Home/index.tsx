
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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

const Home = () => {
  const nbProfiles = 5;

  const profiles = [];
  for (let i = 0; i < nbProfiles; i++) {
    profiles.push(
      <Label
        key={i}
        htmlFor={`profile-${i}`}
        className='flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground [&:has([data-state=checked])]:border-primary'
      >
        <RadioGroupItem value={`profile-${i}`} id={`profile-${i}`} className='sr-only' />
        <Icons.paypal className='mb-3 h-6 w-6' />
        Profile {i + 1}
      </Label>
    );
  }

  return (
    <Card className='font-sans'>
      <CardHeader>
        <CardTitle>Manage your profiles !</CardTitle>
        <CardDescription>
          Add a new profile config to your account.
        </CardDescription>
      </CardHeader>
      <CardContent className='grid gap-6'>
        <div className='flex justify-end'>
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="secondary">Add Profile</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Add Profile</DialogTitle>
                <DialogDescription>
                  Add a name to your new profile.
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
                <Button type="submit">Save changes</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
        <RadioGroup defaultValue='card' className='grid grid-cols-3 gap-4'>
          {profiles}
        </RadioGroup>
      </CardContent>
      <CardFooter>
        <Button className='w-full'>Export to League of Legends</Button>
      </CardFooter>
    </Card>
  )
}

export default Home;
