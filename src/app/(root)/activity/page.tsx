import React from 'react'
import { currentUser } from '@clerk/nextjs'
import { redirect } from 'next/navigation'
import { fetchUser, fetchUsers, getActivites } from '@/lib/actions/user.actions';
import Link from 'next/link';
import Image from 'next/image';

export default async function Page() {
  const user = await currentUser()


  if (!user) return null;

  const userInfo = await fetchUser(user.id)

  if (!userInfo?.onboarded) {
    return redirect('/onboarding')
  }

const activity = await getActivites(userInfo._id)

    return (
      <section>
          <h1 className="head-text mb-10">Activity</h1>

          <section className='mt-10 flex flex-col gap-5'>
            {activity.length > 0 ? (<>
            {activity.map((activity) => (
              <Link key={activity._id} href={`/thread/${activity.parentId}`}>
                <article className='activity-card'>
                  <Image src={activity.author.image} alt='profile picture' width={20} height={20} className='rounded-full object-cover' />
                  <p className='!text-small-regular text-light-1'>
                    <span className='mr-1 text-primary-500'>
                      {activity.author.name} 
                    </span>
                    replied to your thread
                  </p>
                </article>
              </Link>
            ))}
            </>):(<p className='!text-base-regular text-light-3'>No Activity yet</p>)}
          </section>
      </section>
    )
  }
  