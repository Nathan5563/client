import CoreLayout from "../../components/Core/Layout";
import GlobalInventory from "../../components/Gameplay/Inventory/GlobalInventory";
import InventoryList from "../../components/Gameplay/Inventory/ItemsListComp";
import SupabaseInventoryList from "../../components/Gameplay/Inventory/SupabaseInventoryTest";
import OwnedItemsList from "../../components/Gameplay/Inventory/userOwnedItems";
import OwnedPlanetsList from "../../components/Gameplay/Inventory/userOwnedPlanets";

export default function Inventory () {
    return (
        <CoreLayout>
            {/* <SupabaseInventoryList /> */}
            <OwnedItemsList />
        </CoreLayout>
    )
}