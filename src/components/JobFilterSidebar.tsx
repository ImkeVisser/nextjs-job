import { JOB_TYPES } from "@/lib/job-types";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import Select from "./ui/Select";
import prisma from "@/lib/prisma";
import { Button } from "./ui/button";
import { jobFilterSchema, JobFilterValues } from "@/lib/validation";
import { redirect } from "next/navigation";
import FormSubmitButton from "./FormSubmitButton";

async function filterJobs(formData:FormData) {
    "use server";

    const values = Object.fromEntries(formData.entries());

    const { query, type, location, remote } = jobFilterSchema.parse(values);

    const searchParams = new URLSearchParams({
        ...(query && {query: query.trim()}),
        ...(type && {type}),
        ...(location && {location}),
        ...(remote && {remote: "true"}),
    })
    redirect(`/?${searchParams.toString()}`);
}

interface JobFilterSidebarProps {
    defaultValues: JobFilterValues;
  }  

export default async function JobFilterSidebar({
    defaultValues
}: JobFilterSidebarProps){
    const distinctLocations = (await prisma.job.findMany({
        where: {approved: true },
        select: {location: true},
        distinct: ["location"]
    }).then(locations => 
        locations.map(({location}) => location).filter(Boolean)
    )) as string[]

    return (
        <aside className="sticky top-0 h-fit rounded-lg border bg-background p-4 md:w-[260px]">
            <form action={filterJobs}>
                <div className="space-y-4">
                    <div className="flex flex-col gap-2">
                        <Label htmlFor="query">Search</Label>
                        <Input id="query" name="query" placeholder="title, company, etc" defaultValue={defaultValues.query}/>
                    </div>
                    <div className="flex flex-col gap-2">
                        <Label htmlFor="type"></Label>
                        <Select id="type" name="type" defaultValue={defaultValues.type || ""}>
                            <option value="">All types</option>
                            {JOB_TYPES.map(type => (
                                <option key={type} value={type}>{type}</option>
                            ))}
                        </Select>
                    </div>
                    <div className="flex flex-col gap-2">
                        <Label htmlFor="location"></Label>
                        <Select id="location" name="location" defaultValue={defaultValues.location || ""}>
                            <option value="">All locations</option>
                            {distinctLocations.map(location => (
                                <option key={location} value={location}>{location}</option>
                            ))}
                        </Select>
                    </div>
                    <div className="flex items-center gap-2">
                        <input id="remote" name="remote"type="checkbox" className="scale-125 accent-black" defaultChecked={defaultValues.remote}/>
                        <Label htmlFor="remote">Remote Jobs</Label>
                    </div>
                    <FormSubmitButton className="w-full">
                        Filter Jobs
                    </FormSubmitButton>
                </div>
            </form>
        </aside>
    )
}