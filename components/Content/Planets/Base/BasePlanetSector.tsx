import { useSession, useSupabaseClient } from "@supabase/auth-helpers-react";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import RoverImageGallery, { RoverImage, RoverImageNoHandle } from "../PlanetData/RandomRoverImage";
import StructureComponent, { PlacedStructures } from "../Sectors/StructureCreate";
import { SectorStructureOwned } from "../../Inventory/UserOwnedItems";
import PostFormCardAnomalyTag from "../../Classify/AnomalyPostFormCard";
import {ClassificationFeedForIndividualPlanet} from "../../ClassificationFeed";
// import { CreateMenuBar, SectorCircularMenu } from "../../../Core/BottomBar";

const AddResourceToInventory = ({ resource, sectorId }) => {
  const supabase = useSupabaseClient();
  const session = useSession();
  const [isAdding, setIsAdding] = useState(false);

  const handleAddResource = async () => {
    setIsAdding(true);
    try {
      // Check if the user already has this resource in their inventory
      // const { data: existingResource, error } = await supabase
      //   .from('inventoryUSERS')
      //   .select('*')
      //   .eq('owner', session?.user?.id)
      //   .eq('item', resource)
      //   .single();

      // if (error) {
      //   throw error;
      // }

      let quantity = 1;

      // If the user already has this resource, increment the quantity
      // if (existingResource) {
      //   quantity = existingResource.quantity + 1;
      // }

      // Add the resource to the user's inventory
      const { error: insertError } = await supabase
        .from('inventoryUSERS')
        .upsert({
          owner: session?.user?.id,
          item: resource,//.id,
          quantity,
          sector: sectorId,
        });

      if (insertError) {
        throw insertError;
      }

      // Resource added successfully
      alert(`${resource.name} added to your inventory!`);
    } catch (error) {
      console.error('Error adding resource to inventory:', error.message);
      // Show error message or handle error appropriately
    } finally {
      setIsAdding(false);
    }
  };

  return (
    <button
      onClick={handleAddResource}
      disabled={isAdding}
      className={`bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded ${isAdding ? 'cursor-not-allowed' : ''}`}
    >
      {isAdding ? 'Adding...' : 'Add to Inventory'}
    </button>
  );
};

const SharePlanetCard = ({ sectorData }) => {
  const supabase = useSupabaseClient();
  const session = useSession();
  const [shareCard, setShareCard] = useState(false);
  const handleSharePopup = () => {
    if (session?.user?.id == sectorData.owner) {
      setShareCard(true);
    } else {
      throw new Error("Not owner");
    }
  }
  const handleCloseSharePopup = () => {
    setShareCard(false);
  }

  const handleShare = () => {
    return 0;
  }

  // const {
  //   id,
  //   created_at,
  //   anomaly,
  //   owner,
  //   deposit,
  //   coverUrl,
  //   exploration_start_data,
  //   explored,
  // } = sectorData;

  return (
      <div>
          <button
            onClick={handleSharePopup}
            className={'bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded ml-auto'}
          >
            Share
          </button>
          {shareCard && (
              <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex justify-center items-center">
                <div className="bg-white rounded-lg md:w-4/6 lg:w-3/6 xl:w-2/6 p-4">
                  <h1 className={"text-2xl"}>Share your discovery!</h1>
                  <hr className={"my-4"}/>
                  <div className={"flex flex-col shadow-lg"}>
                    <img src={"https://placehold.co/500x200"}/>
                    <div className={"text-xl mx-6 my-4 flex flex-col"}>
                      <span>Sector #{sectorData.id}</span>
                      <span>Anomaly: {sectorData.anomaly}</span>
                      <span>Owner: {session?.user?.id}</span>
                      <span>Deposit: {sectorData.deposit}</span>
                    </div>
                    <button
                        className={"bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 mx-2 mb-2 rounded"}
                    >
                      Share
                    </button>
                  </div>
                  <hr className={"my-4"}/>
                  <center>
                    <button onClick={handleCloseSharePopup} className="flex items-center justify-center p-3">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24"
                           stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                      </svg>
                      <span className="bg-yellow-500 text-white text-xs px-1 ml-1 rounded">Back</span>
                    </button>
                  </center>
                </div>
              </div>
          )}

      </div>
  )
}

export default function BasePlanetSector({sectorid}: { sectorid: string }) {
  const router = useRouter();
  const {id: sectorId} = router.query;

  const supabase = useSupabaseClient();

  const [planetData, setPlanetData] = useState(null);
  const [sectorData, setSectorData] = useState(null);
  const [depositItem, setDepositItem] = useState(null);

  const fetchDepositItem = async (depositId) => {
    try {
      const {data, error} = await supabase
          .from("inventoryITEMS")
          .select("name")
          .eq("id", depositId)
          .single();

      if (data) {
        setDepositItem(data.name);
      }

      if (error) {
        throw error;
      }
    } catch (error) {
      console.error(error.message);
    }
  };

  const getSectorData = async () => {
    try {
      const {data, error} = await supabase
          .from("basePlanetSectors")
          .select("*")
          .eq("id", sectorId)
          .single();

      if (data) {
        setSectorData(data);
        if (data.deposit) {
          await fetchDepositItem(data.deposit);
        }
        ;
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
      }
      ;
    };

    fetchData();
  }, [sectorId]);

  if (!sectorData) {
    return (
        <div>Loading...</div>
    );
  };

  const {
    id,
    created_at,
    anomaly,
    owner,
    deposit,
    coverUrl,
    exploration_start_data,
    explored,
  } = sectorData;
  const { content } = planetData || {};

  return (
    <>
      <div className="flex-col justify-center">
              <style jsx global>
                {`
                  body {
                    background: url('/assets/Inventory/Planets/SectorBg.png') center/cover;
                  }
                  
                  @media only screen and (max-width: 767px) {
                    .planet-heading {
                      color: white;
                      font-size: 24px;
                      text-align: center;
                      margin-bottom: 10px;
                    }
                  }
        
                  @media only screen and (max-width: 767px) {
                    .planet-heading {
                      color: white;
                      font-size: 24px;
                      text-align: center;
                      margin-bottom: 10px;
                    }

                    .planet-stats {
                      display: none;
                    }
        
                    /* Adjusted image size for mobile */
                    .topographic-image {
                      max-width: 90%;
                      height: auto;
                    }
                  }
                `}
              </style>
          <div className="h-[80vh] flex flex-col items-center justify-center relative">
            <h1 className="mb-10 text-center text-slate-300 text-opacity-100 font-['Inter'] tracking-[3.48px] mt-[-50px] mb-4 text-4xl font-extrabold leading-none tracking-tight text-gray-900 md:text-5xl lg:text-6xl dark:text-white text-gray-400">
              Planet {sectorData?.anomaly}, Sector {id}
            </h1><br /><br /><br />
            {/* <SectorCircularMenu /> */}
            <div className="w-full flex items-center justify-center mb-20 py-10">
              <img
                // src={coverUrl}
                // alt="Rover sector image"
                className="w-10/12 h-10/12 sm:w-4/11 sm:h-4/11 object-contain z-30 p-10 mb-2"
                style={{ zIndex: 20 }}
              />
              <PlacedStructures sectorId={Number(sectorid)} />
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
                  {depositItem || "Unknown"}
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
                  {created_at &&
                    new Date(created_at).toLocaleDateString("en-GB")}
                </div>
                {/* <CreateMenuBar onUpdatesClick={null} /> */}
              </div>
            </div>
          </div>
          {/* {deposit && typeof deposit === "string" ? (
                <div>{deposit}</div>
            ) : (
                <div>{JSON.stringify(deposit)}</div>
            )} */}
        </div>
      <div>
          <div className={'flex justify-between'}>
            <AddResourceToInventory resource={deposit} sectorId={sectorId} />
            <SharePlanetCard sectorData={sectorData} />
          </div>
          {/* <SectorItems planetSectorId={sectorid} /> */}
          <SectorStructureOwned sectorid={sectorid} />
          <RoverImageNoHandle date='853' rover='opportunity' sectorNo={id} />
          <StructureComponent sectorId={sectorid} />
          {/* {imageUrl ? (
            <>
                <img src={imageUrl} alt="Rover image" />
                <RoverContentPostForm metadata={metadata} imageLink={imageUrl} sector={id} />
            </>
          ) : (
            <p>Loading...</p>
          )} */}
      </div>
    </>
  );
};