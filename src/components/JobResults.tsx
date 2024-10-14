import prisma from "@/lib/prisma";
import { JobFilterValues } from "@/lib/validation";
import { Prisma } from "@prisma/client";
import JobListItem from "./JobListItem";


interface JobResultsProps {
    filterValues: JobFilterValues
}

export default async function JobResults({filterValues: {
    query,
    type,
    location,
    remote
}}: JobResultsProps) {

    const searchString = query
    ?.split(" ")
    .filter((word) => word.length > 0)
    .join(" & ");

    const searchFilter: Prisma.JobWhereInput = searchString
    ? {
        OR: [
          { title: {contains: searchString}},
          { companyName: {contains: searchString}}, 
          { type:  {contains: searchString}},
          { locationType: {contains: searchString}},
          { location: {contains: searchString}},
        ],
      }
    : {};

    const where: Prisma.JobWhereInput = {
        AND: [
          searchFilter,
          type ? { type } : {},
          location ? { location } : {},
          remote ? { locationType: "Remote" } : {},
          { approved: true },
        ],
      };
 
    const jobs = await prisma.job.findMany({
        where,
        orderBy: { createdAt: "desc" }
      })

    return (
        <div className="space-y-4 grow">
            {jobs.map(job => (
            <JobListItem key={job.id} job={job} />
            ))}
            {jobs.length === 0 && (
                <p>
                    No jobs found. Try adjusting your search filters.
                </p>
            )}
        </div>
    )
}