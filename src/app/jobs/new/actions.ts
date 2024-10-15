"use server"

import { nanoid } from "nanoid";
import path from "path";
import { put } from "@vercel/blob";
import { toSlug } from "@/lib/utils";
import { createJobSchema } from "@/lib/validation";
import prisma from "@/lib/prisma";
import { redirect } from "next/navigation";

export async function createJobPosting(formdata: FormData) {
    const values = Object.fromEntries(formdata.entries());

    const {
        title,
        type,
        companyName,
        companyLogo,
        locationType,
        location,
        applicationEmail,
        applicationUrl,
        description,
        salary
    } = createJobSchema.parse(values);

    const slug = `${toSlug(title)}-${nanoid(10)}`;

    let companyLogoUrl: string | undefined = undefined

    if(companyLogo) {
        const blob = await put(
            `company_logo/${slug}${path.extname(companyLogo.name)}`,
            companyLogo,
            {
                access: "public",
                addRandomSuffix: false
            }
        )
        companyLogoUrl = blob.url
    }

    await prisma.job.create({
        data: {
            slug,
            title: title.trim(),
            type,
            companyName: companyName.trim(),
            companyLogoUrl,
            locationType,
            location,
            applicationEmail: applicationEmail?.trim(),
            applicationUrl: applicationUrl?.trim(),
            description: description?.trim(),
            salary: parseInt(salary),
        }
    })

    redirect("/job-submitted");
} 