export default async function Page({
	params,
}: {
	params: { id: string };
}) {
	const jobId = params.id ?? "";
	console.log(jobId);

	return <div>Job: {jobId}</div>;
}
