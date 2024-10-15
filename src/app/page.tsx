import JobFilterSidebar from "@/components/JobFilterSidebar";
import JobResults from "@/components/JobResults";
import H1 from "@/components/ui/H1";
import { JobFilterValues } from "@/lib/validation";
import { Metadata } from "next";

interface PageProps {
  searchParams: {
      query?:string,
      type?:string,
      location?:string,
      remote?:string,     
  }
}

function getTitle({query, type, location, remote}: JobFilterValues){
  const titlePrefix = query
  ? `${query} jobs`
  : type
    ? `${type} developer jobs`
    :remote
      ? "Remote developer jobs"
      : "All developer jobs"
  
  const titleSuffics = location ? ` in ${location}` : ""

  return `${titlePrefix}${titleSuffics}`
}

export function generateMetadata({
  searchParams: { query, type, location, remote },
}: PageProps): Metadata {
  return {
    title: `${getTitle({
      query,
      type,
      location,
      remote: remote === "true",
    })} | Flow Jobs`,
  };
}

export default async function Home({
  searchParams: {
    query,
    type,
    location,
    remote
  }
}: PageProps) {

  const filterValues: JobFilterValues = {
    query,
    type,
    location,
    remote: remote === "true",
  }

  return (
  <main className="max-w-5xl m-auto px-3 my-10 space-y-10">
    <div className="space-y-5 text-center">
      <H1>
        {getTitle(filterValues)}
      </H1>
      <p className="text-muted-foreground">Find your dream job.</p>
    </div>
      <section className="flex flex-col md:flex-row gap-4">
      <JobFilterSidebar defaultValues={filterValues}/>
      <JobResults filterValues={filterValues}/>
    </section>
  </main>
  );
}
