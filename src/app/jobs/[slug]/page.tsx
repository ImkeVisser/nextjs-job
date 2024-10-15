import { cache } from "react"
import prisma from "@/lib/prisma"
import { notFound } from "next/navigation"
import JobDetails from "@/components/JobDetails"
import { Button } from "@/components/ui/button"

interface PageProps {
    params: {slug: string}
}

const getJob = cache(async (slug:string) => {
    const job = await prisma.job.findUnique({
        where: {slug}
    })

    if(!job) notFound();

    return job
})

export async function generateStaticParams() {
    const jobs = await prisma.job.findMany({
      where: { approved: true },
      select: { slug: true },
    });
  
    return jobs.map(({ slug }) => slug);
  }

export default async function Page({params: {slug} }: PageProps) {
    const job = await getJob(slug);

    const {applicationEmail, applicationUrl} = job;

    const applicationLink = applicationEmail
        ? `mailto:${applicationEmail}`
        : applicationUrl;

    if(!applicationLink) {
        console.error("job has no application link or email");
        notFound();
    }

    return <main className="max-w-5xl px-3 m-auto my-10 flex flex-col md:flex-row items-center gap-5 md:items-start">
        <JobDetails job={job} />
        <aside>
            <Button asChild>
                <a href={applicationLink} className="w-40 md:w-fit">
                    Applay now
                </a>
            </Button>
        </aside>
    </main>
}