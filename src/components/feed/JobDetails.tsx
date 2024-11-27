"use client";
import type { Job, JobWithRelations } from "@/types/common";
import RichTextEditor, {
	BaseKit,
	Bold,
	Italic,
	Strike,
	Underline,
	Heading,
	BulletList,
	Emoji,
} from "reactjs-tiptap-editor";
import "reactjs-tiptap-editor/style.css";

import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import type { Tables } from "@/types/supabase_public";
import { ApplyButtonState } from "@/utils/enums";
import { createClient } from "@/utils/supabase/client";
import { cn, getSalaryString, handlePlural } from "@/utils/utils";
import parse from "html-react-parser";
import { ArrowDownCircle, ChevronDownCircle } from "lucide-react";
import { useEffect, useRef, useState } from "react";

export default function JobDetails({
	job,
	apply,
	buttonState,
}: {
	job: (Tables<"jobs"> & JobWithRelations) | null;
	apply: (job: Tables<"jobs"> & JobWithRelations) => void;
	buttonState: ApplyButtonState;
}) {
	const divRef = useRef<HTMLDivElement>(null);
	const [isAtBottom, setIsAtBottom] = useState(false);

	// biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
	useEffect(() => {
		if (!divRef.current) return;

		if (
			divRef.current.scrollHeight - divRef.current.scrollTop <=
			divRef.current.clientHeight
		) {
			setIsAtBottom(true);
		} else {
			setIsAtBottom(false);
		}
	}, [divRef]);

	const handleScroll = () => {
		const chatArea = divRef.current?.querySelector(
			"[data-radix-scroll-area-viewport]",
		);

		if (chatArea?.scrollHeight && chatArea.scrollTop && chatArea.clientHeight) {
			if (
				chatArea?.scrollHeight - chatArea?.scrollTop <=
				chatArea?.clientHeight
			) {
				setIsAtBottom(true);
			} else {
				setIsAtBottom(false);
			}
		}
	};

	if (!job) return null;
	return (
		<ScrollArea
			onScrollCapture={handleScroll}
			ref={divRef}
			className="overscroll-contain prose text-foreground h-full prose-headings:text-foreground prose-p:text-muted-foreground prose-strong:text-foreground "
		>
			<div
				className={cn(
					"absolute bottom-0 left-0 right-0 w-full flex flex-row justify-center items-center pb-2 transition-all",
					isAtBottom
						? "invisible"
						: " visible bg-gradient-to-t from-[#000000aa] to-transparent",
				)}
			>
				<ChevronDownCircle
					className="h-8 w-8 cursor-pointer text-primary"
					onClick={() => {
						const chatArea = divRef.current?.querySelector(
							"[data-radix-scroll-area-viewport]",
						);
						if (!chatArea) return;
						if (!isAtBottom) {
							chatArea.scrollTo({
								top: chatArea.scrollHeight,
								behavior: "smooth",
							});
						}
					}}
				/>
			</div>
			<div className="flex flex-col px-4 sticky top-0 left-0 bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/60  pt-4 pb-2 mb-6 border-b border-border/40 text-muted-foreground">
				<div className="flex flex-row items-center justify-between">
					<span>
						{job.users.company_profiles.company_name} - {job.title}
					</span>
				</div>
				<div className="flex flex-row items-center justify-between">
					<span>{getSalaryString(job)}</span>
					<span>{job.location}</span>
				</div>
			</div>
			<div className="px-4">{parse(job.description)}</div>
			<div className="w-full px-4 mt-6 mb-2 flex flex-row justify-between ">
				<Button
					onClick={async () => {
						if (
							buttonState === ApplyButtonState.DISABLED ||
							buttonState === ApplyButtonState.APPLIED
						) {
							return;
						}
						apply(job);
					}}
					variant="default"
					disabled={
						buttonState === ApplyButtonState.DISABLED ||
						buttonState === ApplyButtonState.APPLIED
					}
				>
					{buttonState === ApplyButtonState.ENABLED && "Aplicar"}
					{buttonState === ApplyButtonState.DISABLED && "No aplicable"}
					{buttonState === ApplyButtonState.APPLIED && "Ya aplicaste"}
				</Button>
				<div
					className="flex flex-col items-center justify-center self-start"
					ref={divRef}
				>
					<span className="text-muted-foreground">
						{job.slots} {handlePlural(job.slots, "vacante", "vacantes")}
					</span>
					<span className="text-muted-foreground">
						{/* {job.requests.length ?? 0}{" "}
						{handlePlural(job.requests.length ?? 0, "solicitud", "solicitudes")} */}
						{job.applications.length ?? 0}{" "}
						{handlePlural(
							job.applications.length ?? 0,
							"solicitud",
							"solicitudes",
						)}
					</span>
				</div>
			</div>
		</ScrollArea>
	);
}
