"use client"

import { useEffect, useState } from "react";
import Icon from "../Icon";
import Section from "./Section";
import { CambionCycles, HubData } from "./types";
import Timer from "./Timer";

export interface CycleTimersProps {
  data: HubData | undefined
}

export default function CycleTimers({ data }: CycleTimersProps) {
  const cetusEnd = data?.cetusCycle.expiry;
  const venusEnd = new Date(data?.vallisCycle.expiry ?? Date()); // what is this
  const deimosEnd = data?.cambionCycle.expiry;
  const earthEnd = data?.earthCycle.expiry;

  return <>
    <Section text="Cycle Timers" >
      {/* TODO: i dont like grid :( */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
        <CycleTimer
          title="Cetus"
          text={data?.cetusCycle.isDay ? "Day" : "Night"}
          endDate={cetusEnd}
          icon={data?.cetusCycle.isDay ? "sunny" : "partly_cloudy_night"}
        />

        <CycleTimer
          title="Valis"
          text={data?.vallisCycle.isWarm ? "Warm" : "Cold"}
          endDate={venusEnd}
          icon={data?.vallisCycle.isWarm ? "mode_heat" : "ac_unit"}
        />

        <CycleTimer
          title="Cambion"
          text={data?.cambionCycle.state! == CambionCycles.vome ? "Vome" : "Fass"}
          endDate={deimosEnd}
          icon={data?.vallisCycle.isWarm ? "mode_heat" : "ac_unit"}
        />

        <CycleTimer
          title="Earth"
          text={data?.cetusCycle.isDay ? "Day" : "Night"}
          endDate={earthEnd}
          icon={data?.cetusCycle.isDay ? "sunny" : "partly_cloudy_night"}
        />
      </div>
    </Section>
  </>
}

function CycleTimer({ title, text, endDate, icon }:
  { title: string, text: string, endDate: Date | undefined, icon: string }) {

  return (
    <div className="flex flex-col items-center col-span-1">
      <span>{title}</span>
      <Icon i={icon} />
      <span>{text}</span>
      <div className="bg-secondary-container text-secondary p-0.5 rounded">
        <Timer expiry={endDate} />
      </div>
    </div>
  )
}
