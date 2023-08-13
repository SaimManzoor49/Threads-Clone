'use client'

// import 
// {Form}
//  from '@/components/ui/form'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { UserValidation } from '@/lib/validations/user'
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
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import Image from 'next/image'
import { ChangeEvent, useState } from 'react'
import { isBase64Image } from '@/lib/utils'
import { useUploadThing } from "@/lib/uploadthing"
import { updateUser } from '@/lib/actions/user.actions'

import { usePathname, useRouter } from 'next/navigation'

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
const AccountProfile = ({ user, btnTitle }: Props) => {

    const [files, setFiles] = useState<File[]>([])
    const { startUpload } = useUploadThing("media")


    const router = useRouter()
    const pathname = usePathname()




    const { register, handleSubmit, formState: { errors } } = useForm({
        resolver: zodResolver(UserValidation)
    })


    const form = useForm({
        resolver: zodResolver(UserValidation),
        defaultValues: {
            profile_photo: user?.image || "",
            name: user?.name || "",
            bio: user?.bio || "",
            username: user?.username || "",
        }
    })


    const handleImage = (e: ChangeEvent<HTMLInputElement>, fieldChane: (value: string) => void) => {
        e.preventDefault()
        const fileReader = new FileReader()
        if (e.target.files && e.target.files.length > 0) {
            const file = e.target.files[0]
            setFiles(Array.from(e.target.files))
            if (!file.type.includes("image")) return

            fileReader.onload = async (e) => {
                const imageDataUrl = e.target?.result?.toString() || ""
                fieldChane(imageDataUrl)
            }

            fileReader.readAsDataURL(file)
        }

    }



    const onSubmit = async (values: z.infer<typeof UserValidation>) => {

        const blob = values.profile_photo

        const hasImageChanged = isBase64Image(blob);

        if (hasImageChanged) {
            const imgRes = await startUpload(files)

            if (imgRes && imgRes[0].fileUrl) {
                values.profile_photo = imgRes[0].fileUrl
            }

        }

        // update profile

        await updateUser(
            {
                userId: user.id,
                username: values.username,
                name: values.name,
                bio: values.bio,
                image: values.profile_photo,
                path: pathname

            }
        )

        if(pathname==='/profile/edit'){
            router.back()
        }else{
            router.push('/')
        }

    }


    return (
        <Form {...form}>-0pppp0
            <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="flex flex-col justify-start gap-10">
                <FormField
                    control={form.control}
                    name="profile_photo"
                    render={({ field }) => (
                        <FormItem className='flex items-center gap-4'>
                            <FormLabel className='account-form_image-label'>
                                {field.value ?
                                    <Image
                                        src={field.value}
                                        alt='profile photo'
                                        width={96}
                                        height={96}
                                        priority
                                        className='rounded-full object-contain'
                                    />
                                    : (
                                        <Image
                                            src={'/assets/profile.svg'}
                                            alt='profile photo'
                                            width={24}
                                            height={24}
                                            className='object-contain'
                                        />
                                    )
                                }
                            </FormLabel>
                            <FormControl className='flex-1 text-base-semibold text-gray-200'>
                                <Input type='file' accept='image/*' placeholder='Upload a Photo' className='account-form_image-input' onChange={(e) => { handleImage(e, field.onChange) }} />
                            </FormControl>
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                        <FormItem className='flex flex-col w-full gap-3'>
                            <FormLabel className='text-base-semibold text-light-2'>
                                Name
                            </FormLabel>
                            <FormControl className='flex-1 text-base-semibold text-gray-200'>
                                <Input
                                    type='text'
                                    className='account-form_input'
                                    {...field}

                                />
                            </FormControl>
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="username"
                    render={({ field }) => (
                        <FormItem className='flex flex-col w-full gap-3'>
                            <FormLabel className='text-base-semibold text-light-2'>
                                Username
                            </FormLabel>
                            <FormControl className='flex-1 text-base-semibold text-gray-200'>
                                <Input
                                    type='text'
                                    className='account-form_input'
                                    {...field}

                                />
                            </FormControl>
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="bio"
                    render={({ field }) => (
                        <FormItem className='flex flex-col w-full gap-3'>
                            <FormLabel className='text-base-semibold text-light-2'>
                                Bio
                            </FormLabel>
                            <FormControl className='flex-1 text-base-semibold text-gray-200'>
                                <Textarea
                                    rows={10}
                                    className='account-form_input'
                                    {...field}

                                />
                            </FormControl>
                        </FormItem>
                    )}
                />
                <Button type="submit" className='bg-primary-500'>Submit</Button>
            </form>
        </Form>
    )

}


export default AccountProfile