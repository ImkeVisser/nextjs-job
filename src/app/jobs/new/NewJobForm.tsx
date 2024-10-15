"use client"

/* eslint-disable @typescript-eslint/no-unused-vars */

import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import H1 from "@/components/ui/H1"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import LoadingButton from "@/components/ui/LoadingButton"
import LocationSearchInput from "@/components/ui/LocationSearchInput"
import RichTextEditor from "@/components/ui/RichTextEditor"
import Select from "@/components/ui/Select"
import { JOB_TYPES, LOCATION_TYPES } from "@/lib/job-types"
import { createJobSchema, CreateJobValues } from "@/lib/validation"
import { zodResolver } from "@hookform/resolvers/zod"
import { draftToMarkdown } from "markdown-draft-js"
import { useForm } from "react-hook-form"
import { createJobPosting } from "./actions"

export default function NewJobForm() {
    const form = useForm<CreateJobValues>({
        resolver: zodResolver(createJobSchema),
        defaultValues: {
            title: "",
            companyName: "",
            location: "",
            applicationEmail: "",
            applicationUrl: "",
            description:"",
            salary:""
        }
    })

    const {
        handleSubmit,
        trigger,
        control,
        setFocus,
        formState: { isSubmitting },    
    } = form;

    async function onSubmit(values:CreateJobValues) {
        const formData = new FormData();

        Object.entries(values).forEach(([key, value]) => {
            if(value) {
                formData.append(key, value);
            }
        })

        try {
           await createJobPosting(formData) 
        } catch (error) {
            console.error(error)
            alert("something went wrong, please try again.");
        }
    }

    return (
    <main className="m-auto my-10 max-w-3xl space-y-10">
        <div className="space-y-5 text-center">
            <H1>Find your perfect developer</H1>
            <p className="text-muted-foreground">
            Get your job posting seen by thousands of job seekers.
            </p>
        </div>
        <div className="space-y-6 rounded-lg border p-4">
            <div>
           `    <h2 className="font-semibold">Job details</h2>
                <p className="text-muted-foreground">
                    Provide a job description and details
                </p>`
            </div>
        </div>
        <Form {...form}>
            <form className="space-y-4" noValidate onSubmit={handleSubmit(onSubmit)}>
                <FormField
                    control={control}
                    name="title"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Job title</FormLabel>
                            <FormControl>
                                <Input 
                                    placeholder="e.g. Frontend Developer"
                                    {...field}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>

                    )}
                />
                <FormField
                    control={control}
                    name="type"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Job type</FormLabel>
                            <FormControl>
                                <Select {...field} >
                                    <option value="" hidden>
                                        Select an option
                                    </option>
                                    {JOB_TYPES.map(jobType => (
                                        <option key={jobType} value={jobType}>
                                            {jobType}
                                        </option>
                                    ))}
                                </Select>
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={control}
                    name="companyName"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Company</FormLabel>
                            <FormControl>
                                <Input {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>

                    )}
                />
                <FormField
                    control={control}
                    name="companyLogo"
                    render={({ field: { value, ...fieldValues } }) => (
                        <FormItem>
                            <FormLabel>Company logo</FormLabel>
                            <FormControl>
                                <Input
                                {...fieldValues}
                                type="file"
                                accept="image/*"
                                onChange={(e) => {
                                    const file = e.target.files?.[0];
                                    fieldValues.onChange(file);
                                }}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={control}
                    name="locationType"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Location</FormLabel>
                            <FormControl>
                                <Select {...field} >
                                    <option value="" hidden>
                                        Select an option
                                    </option>
                                    {LOCATION_TYPES.map(locationType => (
                                        <option key={locationType} value={locationType}>
                                            {locationType}
                                        </option>
                                    ))}
                                </Select>
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                 <FormField
                    control={control}
                    name="location"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Office location</FormLabel>
                            <FormControl>
                                <LocationSearchInput
                                    onLocationSelected={field.onChange}
                                 />
                            </FormControl>
                            <FormMessage />
                        </FormItem>

                    )}
                />
                <div className="space-y-2">
                    <Label htmlFor="applicationEmail">How to apply</Label>
                    <div className="flex justify-between">
                        <FormField
                        control={control}
                        name="applicationEmail"
                        render={({ field }) => (
                            <FormItem className="grow">
                                <FormControl>
                                    <div className="flex items-center">
                                    <Input
                                        id="applicationEmail"
                                        placeholder="Email"
                                        type="email"
                                        {...field}
                                    />
                                    <span className="mx-2">or</span>
                                    </div>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                        />
                        <FormField
                        control={control}
                        name="applicationUrl"
                        render={({ field }) => (
                            <FormItem className="grow">
                                <FormControl>
                                    <Input
                                    placeholder="Website"
                                    type="url"
                                    {...field}
                                    onChange={(e) => {
                                        field.onChange(e);
                                        trigger("applicationEmail");
                                    }}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                        />
                    </div>
                </div>
                <FormField
                    control={control}
                    name="description"
                    render={({ field }) => (
                        <FormItem>
                            <Label onClick={() => setFocus("description")}>
                                Description
                            </Label>
                            <FormControl>
                                <RichTextEditor
                                onChange={(draft) =>
                                    field.onChange(draftToMarkdown(draft))
                                }
                                ref={field.ref}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={control}
                    name="salary"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Salary</FormLabel>
                            <FormControl>
                                <Input {...field} type="number" />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <LoadingButton type="submit" loading={isSubmitting}>
                    Submit
                </LoadingButton>
            </form>
        </Form>
    </main>
    )
} 