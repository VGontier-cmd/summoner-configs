import React, { useEffect, useState } from 'react';

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
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Icons } from '@/components/Icons'

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
        Profile 2
      </Label>
		);
	}

  return (
    <Card>
      <CardHeader>
        <CardTitle>Manage your profiles !</CardTitle>
        <CardDescription>
          Add a new profile config to your account.
        </CardDescription>
      </CardHeader>
      <CardContent className='grid gap-6'>
        <RadioGroup defaultValue='card' className='grid grid-cols-3 gap-4'>
          {profiles}
        </RadioGroup>
      </CardContent>
      <CardFooter>
        <Button variant='outline' className='w-full'>Export to League of Legends</Button>
      </CardFooter>
    </Card>
  )
}

export default Home;
