"use client"

import { useEffect, useState } from "react";
import Header from "../../components/Header";
import { HubData } from "../../components/warframe/types";
import CycleTimers from "../../components/warframe/SectionCycleTimers";
import Construction from "../../components/warframe/SectionConstruction";
import Darvo from "@/components/warframe/SectionDarvo";
import SectionNews from "@/components/warframe/SectionNews";
import useSWR, { Fetcher } from "swr";

export default function Warframe() {
  const fetcher: Fetcher<HubData, string> = (url: string) => fetch(url).then(res => res.json());

  const { data, error, isLoading } = useSWR("https://api.warframestat.us/pc", fetcher);

  return <>
    <Header />
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4 h-full">
      <div>
        <CycleTimers data={data} />
      </div>
      <div>
        <Construction data={data} />
      </div>
      <div>
        <Darvo />
        <SectionNews data={data} />
      </div>
    </div>
  </>
}
