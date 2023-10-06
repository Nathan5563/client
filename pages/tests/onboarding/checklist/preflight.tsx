import React from "react";
import CoreLayout from "../../../../components/Core/Layout";
import OwnedItemsList from "../../../../components/Gameplay/Inventory/userOwnedItems";
import Crucible1BaseplanetList from "../../../../components/onboarding/Preflight/1_CruciblePlanetList";
import { Container } from "react-bootstrap";
import { useSession } from "@supabase/auth-helpers-react";

export default function CrucibleFlightCheck () {
    const session = useSession();

    return (
        <CoreLayout>
            <div className="mb-20">
                <Container><p>Classify these planets!</p> <br /></Container>
                <Crucible1BaseplanetList />
                {/* <OwnedItemsList /> */}
                {/* <CharacterCanvas /> */}
            </div>
        </CoreLayout>
    );
};