import { HomeCover } from "@/components/sections/home-cover";
import { HomeHello } from "@/components/sections/home-hello";
import { HomePractice } from "@/components/sections/home-practice";
import { HomeProjects } from "@/components/sections/home-projects";
import { HomeContact } from "@/components/sections/home-contact";

export default function HomePage() {
  return (
    <>
      <HomeCover />
      <HomeHello />
      <HomePractice />
      <HomeProjects />
      <HomeContact />
    </>
  );
}
