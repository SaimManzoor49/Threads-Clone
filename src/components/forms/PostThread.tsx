'use client'

// import 
// {Form}
//  from '@/components/ui/form'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Button } from "@/components/ui/button"
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Textarea } from "@/components/ui/textarea"
import { usePathname, useRouter } from 'next/navigation'

// import { updateUser } from '@/lib/actions/user.actions'
import { ThreadValidation } from '@/lib/validations/thread'
import { createThread } from '@/lib/actions/thread.actions'
import { useOrganization } from '@clerk/nextjs'


interface Props {
    user: {
        id: string,
        objectId: string,
        username: string,
        name: string,
        bio: string,
        image: string,

    },
    btnTitle: String,
}

export default function PostThread({userId}:{userId:string}) {

    // const [files, setFiles] = useState<File[]>([])
    // const { startUpload } = useUploadThing("media")


    const router = useRouter()
    const pathname = usePathname()

    let {organization} = useOrganization()



    // const { register, handleSubmit, formState: { errors } } = useForm({
    //     resolver: zodResolver()
    // })


    const form = useForm({
        resolver: zodResolver(ThreadValidation),
        defaultValues: {
            thread:'',
            accountId:userId,
        }
    })


// Kuch to garbar ha yahan 
const onSubmit = async(values:z.infer<typeof ThreadValidation>) => {
console.log(organization?.id+'<- organizationId')
    await createThread({
        text:values.thread,
        author:userId,
        communityId:(organization)?organization?.id:null,
        path:pathname
    
    }) 


    router.push('/')

}





  return (
    <>
    
    <Form {...form}>-0pppp0
            <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="mt-10 flex flex-col justify-start gap-10">

<FormField
                    control={form.control}
                    name="thread"
                    render={({ field }) => (
                        <FormItem className='flex flex-col w-full gap-3'>
                            <FormLabel className='text-base-semibold text-light-2'>
                                Content
                            </FormLabel>
                            <FormControl className='no-focus border border-dark-4 bg-dark-3 text-light-1'>
                                <Textarea
                                    rows={15}
                                    className=''
                                    {...field}

                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <Button type='submit' className='bg-primary-500'>
                    Post Thread
                </Button>
                    </form>
                    </Form>
    </>
  )
}
