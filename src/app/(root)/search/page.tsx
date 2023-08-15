import React from 'react'
import { currentUser } from '@clerk/nextjs'
import { redirect } from 'next/navigation'
import { fetchUser } from '@/lib/actions/user.actions';
import PostThread from '@/components/forms/PostThread';
import ProfileHeader from '@/components/shared/ProfileHeader';
import { Tabs, TabsList, TabsContent, TabsTrigger } from '@/components/ui/tabs';
import { profileTabs } from '@/constants';
import Image from 'next/image';
import ThreadsTab from '@/components/shared/ThreadsTab';

export default async function Page({ params }: { params: { id: string } }) {
  const user = await currentUser()


  if (!user) return null;

  const userInfo = await fetchUser(params.id)

  if (!userInfo?.onboarded) {
    return redirect('/onboarding')
  }
  return (
    <section>
        <h1 className="head-text mb-10">Search</h1>
    </section>
  )
}

// export default Page