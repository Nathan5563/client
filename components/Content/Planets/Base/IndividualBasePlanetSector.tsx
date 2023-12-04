import { useSession, useSupabaseClient } from "@supabase/auth-helpers-react";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import Card from "../../../Card";
import RoverImageGallery from "../PlanetData/RandomRoverImage";

export default function BasePlanetSector({ sectorid }: { sectorid: string }) {
  const router = useRouter();
  const { id: sectorId } = router.query;

  const supabase = useSupabaseClient();
  const session = useSession();

  const [sectorData, setSectorData] = useState(null);
  const [planetData, setPlanetData] = useState(null);

  const getPlanetData = async () => {
    if (!sectorData) {
      return null;
    }
    try {
      const { data, error } = await supabase
        .from("basePlanets")
        .select("*")
        .eq("id", sectorData.id)
        .single();

      if (data) {
        setPlanetData(data);
      }

      console.log(data);

      if (error) {
        throw error;
      }
    } catch (error) {
      console.error(error.message);
    }
  };

  const getSectorData = async () => {
    try {
      const { data, error } = await supabase
        .from("basePlanetSectors")
        .select("*")
        .eq("id", sectorId)
        .single();

      if (data) {
        setSectorData(data);
      }

      if (error) {
        throw error;
      }
    } catch (error) {
      console.error(error.message);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      if (sectorId) {
        await getSectorData();
        await getPlanetData();
      }
    };

    fetchData();
  }, [sectorId]);

  if (!sectorData) {
    return <div>Loading...</div>;
  }

  const { id, created_at, anomaly, owner, deposit, coverUrl, exploration_start_data, explored } = sectorData;
  const { content } = planetData || {};

  // I think that sectors will have posts attributed to them via contentPLANETSECTORS -> following the IndividualBasePlanet.tsx fetch functions

  return (
    <>
    <Card noPadding={false}><div className="flex-col justify-center mt-[-80px] bg-cover bg-center rounded-15" style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1545243424-0ce743321e11?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D")' }}>
      <div className="h-[80vh] flex flex-col items-center justify-center relative">
        <h1 className="text-center text-slate-300 text-opacity-100 font-['Inter'] tracking-[3.48px] mt-[-50px] mb-4 text-4xl font-extrabold leading-none tracking-tight text-gray-900 md:text-5xl lg:text-6xl dark:text-white text-gray-400">
          Planet {planetData?.content}, Sector {id}
        </h1>
        <div className="w-full flex items-center justify-center">
          <img
            src={coverUrl}
            alt="Rover sector image"
            className="w-3/12 h-3/12 sm:w-4/11 sm:h-4/11 object-contain z-20 p-10 mb-2"
            style={{ zIndex: 20 }}
          />
        </div>
        <div className="flex items-start gap-8 mt-20">
                <div className="flex flex-col items-center justify-start gap-4">
                    <div className="text-center text-slate-300 text-opacity-70 text-[21.73px] font-medium font-['Inter'] tracking-[3.48px]">
                    Planet
                    </div>
                    <div className="text-center text-white text-opacity-90 text-[27.17px] font-medium font-['Inter']">
                        {planetData?.content || "Unknown"}, Sector {id}
                    </div>
                </div>

                <div className="flex flex-col items-center justify-start gap-4">
                    <div className="text-center text-slate-300 text-opacity-70 text-[21.73px] font-medium font-['Inter'] uppercase tracking-[3.48px]">
                    Mineral deposit
                    </div>
                    <div className="text-center text-white text-opacity-90 text-[27.17px] font-medium font-['Inter']">
                    {deposit}
                    </div>
                </div>

                <div className="flex flex-col items-center justify-start gap-4">
                    <div className="text-center text-slate-300 text-opacity-70 text-[21.73px] font-medium font-['Inter'] uppercase tracking-[3.48px]">
                    Exploration status
                    </div>
                    <div className="text-center text-white text-opacity-90 text-[27.17px] font-medium font-['Inter']">
                    {explored ? "Explored" : "Not Explored"}
                    </div>
                </div>

                <div className="flex flex-col items-center justify-start gap-4">
                    <div className="text-center text-slate-300 text-opacity-70 text-[21.73px] font-medium font-['Inter'] uppercase tracking-[3.48px]">
                    Init date
                    </div>
                    <div className="text-center text-white text-opacity-90 text-[27.17px] font-medium font-['Inter']">
                    {created_at && new Date(created_at).toLocaleDateString('en-GB')}
                    </div>
                </div>
                </div>
            </div>
            {/* {deposit && typeof deposit === "string" ? (
                <div>{deposit}</div>
            ) : (
                <div>{JSON.stringify(deposit)}</div>
            )} */}
    </div></Card>
    <div>
        <RoverImageGallery />
    </div>
    </>
  );
};