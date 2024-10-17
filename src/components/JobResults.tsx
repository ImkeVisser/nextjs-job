import prisma from "@/lib/prisma";
import { JobFilterValues } from "@/lib/validation";
import { Prisma } from "@prisma/client";
import JobListItem from "./JobListItem";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { ArrowLeft, ArrowRight } from "lucide-react";

const JOB_PER_PAGE = 3

interface JobResultsProps {
    filterValues: JobFilterValues
    page?: number
}

export default async function JobResults({
    filterValues,
    page = 1,
}: JobResultsProps) {

    const {
        query,
        type,
        location,
        remote
    } = filterValues

    const searchString = query
    ?.split(" ")
    .filter((word) => word.length > 0)
    .join(" & ");

    const skip = (page - 1) * JOB_PER_PAGE;

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
 
    const jobsPromise = prisma.job.findMany({
        where,
        orderBy: { createdAt: "desc" },
        take: JOB_PER_PAGE,
        skip
      })

    const countPromise = prisma.job.count({ where});

    const [jobs, totalResults] = await Promise.all([jobsPromise, countPromise])

    return (
        <div className="space-y-4 grow">
            {jobs.map(job => (
            <Link key={job.id} href={`/jobs/${job.slug}`} color="block">
                <JobListItem job={job} />
            </Link>
            ))}
            {jobs.length === 0 && (
                <p>
                    No jobs found. Try adjusting your search filters.
                </p>
            )}
            {jobs.length > 0 && (
                <Pagination
                    currentPage={page}
                    totalPage={Math.ceil(totalResults / JOB_PER_PAGE)}
                    filterValues={filterValues}
                />
            )}
        </div>
    )
}
interface PaginationProps {
    currentPage: number,
    totalPage: number,
    filterValues: JobFilterValues
}

function Pagination({
    currentPage,
    totalPage,
    filterValues: {
        query,
        type,
        location,
        remote 
    }
}: PaginationProps) {
    function generatePageLink(page: number) {
        const searchParams = new URLSearchParams({
            ...(query && {query}),
            ...(type && {type}),
            ...(location && {location}),
            ...(remote && {remote: "true"}),
            page: page.toString(),
        })

        return `/?${searchParams.toString()}`
    }

    return (
        <div className="flex justify-between">
            <Link
                href={generatePageLink(currentPage -1)}
                className={cn(
                    "flex items-center gap-2 font-semibold",
                    currentPage <= 1 && "invisible"
                )}> 
                <ArrowLeft size={16}/>
                Previous Page
            </Link>
            <span className="font-semibold">
                Page {currentPage} of {totalPage}
            </span>
            <Link
                href={generatePageLink(currentPage + 1)}
                className={cn(
                    "flex items-center gap-2 font-semibold",
                    currentPage >= totalPage && "invisible"
                )}> 
                <ArrowRight size={16}/>
                Next Page
            </Link>
        </div>
    )
}