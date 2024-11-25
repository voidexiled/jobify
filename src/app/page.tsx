import Image from "next/image";
import { redirect, useRouter } from "next/navigation";
import { useEffect } from "react";

export default async function Home() {
	redirect("/feed");
}
