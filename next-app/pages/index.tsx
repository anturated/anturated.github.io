import Header from "@/app/components/Header";
import Icon from "@/app/components/Icon";
import { Metadata } from "next";


export const metadata: Metadata = {
  title: "bobers",
  description: "Better webapp in the world.",
};

export default function Index() {
  return (
    <div className="min-h-screen flex flex-col items-center">
      <Header />
      <div className="flex flex-1 items-center justify-center">
        <Icon i="mode_heat" />
      </div>
    </div>
  )
}
